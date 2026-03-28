from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from decimal import Decimal
from datetime import date, timedelta, datetime, timezone as tz
import uuid

from .models import User, Barber, Transaction
from .serializers import UserSerializer, BarberSerializer, TransactionSerializer

User = get_user_model()


# ═══════════════════════════════════════════════════════════════════════════
#  TESTS DES MODÈLES
# ═══════════════════════════════════════════════════════════════════════════

class UserModelTest(TestCase):
    """Tests pour le modèle User"""

    def test_create_user(self):
        """Test la création d'un utilisateur avec create_user"""
        user = User.objects.create_user(
            email="test@example.com",
            name="Test User",
            password="testpass123"
        )
        self.assertEqual(user.email, "test@example.com")
        self.assertEqual(user.name, "Test User")
        self.assertTrue(user.check_password("testpass123"))
        self.assertTrue(user.is_active)

    def test_create_user_without_email_raises_error(self):
        """Test qu'un utilisateur sans email génère une erreur"""
        with self.assertRaises(ValueError):
            User.objects.create_user(
                email="",
                name="Test User",
                password="testpass123"
            )

    def test_user_email_unique(self):
        """Test que l'email est unique"""
        User.objects.create_user(
            email="test@example.com",
            name="Test User 1",
            password="testpass123"
        )
        with self.assertRaises(Exception):
            User.objects.create_user(
                email="test@example.com",
                name="Test User 2",
                password="testpass123"
            )

    def test_user_has_uuid_id(self):
        """Test que l'utilisateur a un UUID comme id"""
        user = User.objects.create_user(
            email="test@example.com",
            name="Test User",
            password="testpass123"
        )
        self.assertIsInstance(user.id, uuid.UUID)


class BarberModelTest(TestCase):
    """Tests pour le modèle Barber"""

    def setUp(self):
        """Crée un utilisateur et un barbier pour les tests"""
        self.user = User.objects.create_user(
            email="test@example.com",
            name="Test User",
            password="testpass123"
        )

    def test_create_barber(self):
        """Test la création d'un barbier"""
        barber = Barber.objects.create(
            user=self.user,
            barber_name="Jean",
            salary=40
        )
        self.assertEqual(barber.barber_name, "Jean")
        self.assertEqual(barber.salary, 40)
        self.assertEqual(barber.user, self.user)

    def test_barber_has_uuid_id(self):
        """Test que le barbier a un UUID comme id"""
        barber = Barber.objects.create(
            user=self.user,
            barber_name="Jean",
            salary=40
        )
        self.assertIsInstance(barber.id, uuid.UUID)

    def test_barber_cascade_delete(self):
        """Test que suppression de l'utilisateur supprime ses barbiers"""
        barber = Barber.objects.create(
            user=self.user,
            barber_name="Jean",
            salary=40
        )
        barber_id = barber.id
        self.user.delete()
        self.assertFalse(Barber.objects.filter(id=barber_id).exists())


class TransactionModelTest(TestCase):
    """Tests pour le modèle Transaction"""

    def setUp(self):
        """Crée les données nécessaires pour les tests"""
        self.user = User.objects.create_user(
            email="test@example.com",
            name="Test User",
            password="testpass123"
        )
        self.barber = Barber.objects.create(
            user=self.user,
            barber_name="Jean",
            salary=40
        )

    def test_create_transaction(self):
        """Test la création d'une transaction"""
        transaction = Transaction.objects.create(
            user=self.user,
            barber=self.barber,
            service="Coupe simple",
            amount=Decimal("25.00"),
            payment_method="Espèces"
        )
        self.assertEqual(transaction.service, "Coupe simple")
        self.assertEqual(transaction.amount, Decimal("25.00"))
        self.assertEqual(transaction.user, self.user)
        self.assertEqual(transaction.barber, self.barber)

    def test_transaction_has_uuid_id(self):
        """Test que la transaction a un UUID comme id"""
        transaction = Transaction.objects.create(
            user=self.user,
            barber=self.barber,
            service="Coupe simple",
            amount=Decimal("25.00"),
            payment_method="Espèces"
        )
        self.assertIsInstance(transaction.id, uuid.UUID)

    def test_transaction_ordering(self):
        """Test que les transactions sont triées par date décroissante"""
        t1 = Transaction.objects.create(
            user=self.user,
            barber=self.barber,
            service="Coupe",
            amount=Decimal("25.00"),
            payment_method="Espèces"
        )
        t2 = Transaction.objects.create(
            user=self.user,
            barber=self.barber,
            service="Barbe",
            amount=Decimal("15.00"),
            payment_method="Carte"
        )
        transactions = list(Transaction.objects.all())
        self.assertEqual(transactions[0].id, t2.id)
        self.assertEqual(transactions[1].id, t1.id)


# ═══════════════════════════════════════════════════════════════════════════
#  TESTS DES SÉRIALISEURS
# ═══════════════════════════════════════════════════════════════════════════

class UserSerializerTest(TestCase):
    """Tests pour le UserSerializer"""

    def test_user_serializer_create(self):
        """Test la création d'un utilisateur via le serializer"""
        data = {
            "email": "test@example.com",
            "name": "Test User",
            "password": "testpass123"
        }
        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertEqual(user.email, "test@example.com")
        self.assertTrue(user.check_password("testpass123"))

    def test_user_serializer_password_write_only(self):
        """Test que le mot de passe n'est pas retourné en JSON"""
        user = User.objects.create_user(
            email="test@example.com",
            name="Test User",
            password="testpass123"
        )
        serializer = UserSerializer(user)
        self.assertNotIn("password", serializer.data)

    def test_user_serializer_validation_duplicate_email(self):
        """Test que l'email unique est validé"""
        User.objects.create_user(
            email="test@example.com",
            name="Test User 1",
            password="testpass123"
        )
        data = {
            "email": "test@example.com",
            "name": "Test User 2",
            "password": "testpass123"
        }
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())


class BarberSerializerTest(TestCase):
    """Tests pour le BarberSerializer"""

    def setUp(self):
        """Crée un utilisateur pour les tests"""
        self.user = User.objects.create_user(
            email="test@example.com",
            name="Test User",
            password="testpass123"
        )

    def test_barber_serializer_create(self):
        """Test la création d'un barbier via le serializer"""
        data = {
            "barber_name": "Jean",
            "salary": 40
        }
        serializer = BarberSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_barber_serializer_read_only_fields(self):
        """Test que les champs read-only sont correctement configurés"""
        barber = Barber.objects.create(
            user=self.user,
            barber_name="Jean",
            salary=40
        )
        serializer = BarberSerializer(barber)
        self.assertIn("id", serializer.data)
        self.assertIn("created_at", serializer.data)


class TransactionSerializerTest(TestCase):
    """Tests pour le TransactionSerializer"""

    def setUp(self):
        """Crée les données nécessaires pour les tests"""
        self.user = User.objects.create_user(
            email="test@example.com",
            name="Test User",
            password="testpass123"
        )
        self.barber = Barber.objects.create(
            user=self.user,
            barber_name="Jean",
            salary=40
        )

    def test_transaction_serializer_validate_positive_amount(self):
        """Test que le montant doit être positif"""
        data = {
            "barber_id": str(self.barber.id),
            "service": "Coupe",
            "amount": Decimal("-25.00"),
            "payment_method": "Espèces"
        }
        serializer = TransactionSerializer(
            data=data,
            context={"request": type('Request', (), {'user': self.user})()}
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn("amount", serializer.errors)

    def test_transaction_serializer_validate_zero_amount(self):
        """Test que le montant doit être supérieur à zéro"""
        data = {
            "barber_id": str(self.barber.id),
            "service": "Coupe",
            "amount": Decimal("0.00"),
            "payment_method": "Espèces"
        }
        serializer = TransactionSerializer(
            data=data,
            context={"request": type('Request', (), {'user': self.user})()}
        )
        self.assertFalse(serializer.is_valid())

    def test_transaction_serializer_barber_ownership(self):
        """Test que le barbier doit appartenir à l'utilisateur"""
        other_user = User.objects.create_user(
            email="other@example.com",
            name="Other User",
            password="testpass123"
        )
        other_barber = Barber.objects.create(
            user=other_user,
            barber_name="Marc",
            salary=50
        )
        data = {
            "barber_id": str(other_barber.id),
            "service": "Coupe",
            "amount": Decimal("25.00"),
            "payment_method": "Espèces"
        }
        serializer = TransactionSerializer(
            data=data,
            context={"request": type('Request', (), {'user': self.user})()}
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn("barber_id", serializer.errors)


# ═══════════════════════════════════════════════════════════════════════════
#  TESTS DES ENDPOINTS API
# ═══════════════════════════════════════════════════════════════════════════

class AuthAPITest(APITestCase):
    """Tests pour les endpoints d'authentification"""

    def test_register_user_success(self):
        """Test l'enregistrement réussi d'un utilisateur"""
        data = {
            "email": "newuser@example.com",
            "name": "New User",
            "password": "newpass123"
        }
        response = self.client.post("/api/register/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["user"]["email"], "newuser@example.com")
        self.assertTrue(User.objects.filter(email="newuser@example.com").exists())

    def test_register_user_missing_fields(self):
        """Test l'enregistrement sans email"""
        data = {
            "name": "New User",
            "password": "newpass123"
        }
        response = self.client.post("/api/register/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_duplicate_email(self):
        """Test l'enregistrement avec un email déjà existant"""
        User.objects.create_user(
            email="test@example.com",
            name="Test User",
            password="testpass123"
        )
        data = {
            "email": "test@example.com",
            "name": "Another User",
            "password": "anotherpass123"
        }
        response = self.client.post("/api/register/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ProfileAPITest(APITestCase):
    """Tests pour les endpoints de profil utilisateur"""

    def setUp(self):
        """Crée un utilisateur et le connecte"""
        self.user = User.objects.create_user(
            email="test@example.com",
            name="Test User",
            password="testpass123"
        )
        self.user.ville = "Paris"
        self.user.save()
        self.client.force_authenticate(user=self.user)

    def test_get_user_profile(self):
        """Test la récupération du profil utilisateur"""
        response = self.client.get("/api/profile/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "test@example.com")
        self.assertEqual(response.data["name"], "Test User")

    def test_update_user_profile(self):
        """Test la mise à jour du profil utilisateur"""
        data = {
            "name": "Updated Name",
            "ville": "Lyon"
        }
        response = self.client.put("/api/profile/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.name, "Updated Name")
        self.assertEqual(self.user.ville, "Lyon")

    def test_delete_user_profile(self):
        """Test la suppression du profil utilisateur"""
        response = self.client.delete("/api/profile/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(id=self.user.id).exists())

    def test_update_password_success(self):
        """Test la mise à jour réussie du mot de passe"""
        data = {
            "currentPassword": "testpass123",
            "newPassword": "newpass123"
        }
        response = self.client.put("/api/password/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("newpass123"))

    def test_update_password_wrong_current(self):
        """Test la mise à jour avec mauvais mot de passe courant"""
        data = {
            "currentPassword": "wrongpassword",
            "newPassword": "newpass123"
        }
        response = self.client.put("/api/password/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_password_missing_fields(self):
        """Test la mise à jour sans tous les champs"""
        data = {
            "currentPassword": "testpass123"
        }
        response = self.client.put("/api/password/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_profile_unauthorized(self):
        """Test l'accès au profil sans authentification"""
        self.client.force_authenticate(user=None)
        response = self.client.get("/api/profile/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class BarberAPITest(APITestCase):
    """Tests pour les endpoints des barbiers"""

    def setUp(self):
        """Crée un utilisateur avec des barbiers et le connecte"""
        self.user = User.objects.create_user(
            email="test@example.com",
            name="Test User",
            password="testpass123"
        )
        self.barber1 = Barber.objects.create(
            user=self.user,
            barber_name="Jean",
            salary=40
        )
        self.barber2 = Barber.objects.create(
            user=self.user,
            barber_name="Marc",
            salary=50
        )
        self.client.force_authenticate(user=self.user)

    def test_list_barbers(self):
        """Test la liste des barbiers paginée"""
        response = self.client.get("/api/barbers/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)

    def test_create_barber(self):
        """Test la création d'un barbier"""
        data = {
            "barber_name": "Pierre",
            "salary": 45
        }
        response = self.client.post("/api/barbers/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["barber_name"], "Pierre")
        self.assertTrue(Barber.objects.filter(barber_name="Pierre").exists())

    def test_get_barber_detail(self):
        """Test la récupération des détails d'un barbier"""
        response = self.client.get(f"/api/barbers/{self.barber1.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["barber_name"], "Jean")

    def test_update_barber(self):
        """Test la mise à jour d'un barbier"""
        data = {
            "barber_name": "Jean Updated",
            "salary": 55
        }
        response = self.client.put(f"/api/barbers/{self.barber1.id}/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.barber1.refresh_from_db()
        self.assertEqual(self.barber1.barber_name, "Jean Updated")
        self.assertEqual(self.barber1.salary, 55)

    def test_delete_barber(self):
        """Test la suppression d'un barbier"""
        barber_id = self.barber1.id
        response = self.client.delete(f"/api/barbers/{barber_id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Barber.objects.filter(id=barber_id).exists())

    def test_get_other_user_barber_returns_404(self):
        """Test l'accès au barbier d'un autre utilisateur"""
        other_user = User.objects.create_user(
            email="other@example.com",
            name="Other User",
            password="testpass123"
        )
        other_barber = Barber.objects.create(
            user=other_user,
            barber_name="Other",
            salary=40
        )
        response = self.client.get(f"/api/barbers/{other_barber.id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class TransactionAPITest(APITestCase):
    """Tests pour les endpoints des transactions"""

    def setUp(self):
        """Crée des données pour les tests"""
        self.user = User.objects.create_user(
            email="test@example.com",
            name="Test User",
            password="testpass123"
        )
        self.barber = Barber.objects.create(
            user=self.user,
            barber_name="Jean",
            salary=40
        )
        self.transaction = Transaction.objects.create(
            user=self.user,
            barber=self.barber,
            service="Coupe simple",
            amount=Decimal("25.00"),
            payment_method="Espèces"
        )
        self.client.force_authenticate(user=self.user)

    def test_list_transactions(self):
        """Test la liste des transactions paginée"""
        response = self.client.get("/api/transactions/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(len(response.data["barbers"]), 1)

    def test_create_transaction(self):
        """Test la création d'une transaction"""
        data = {
            "barber_id": str(self.barber.id),
            "service": "Barbe",
            "amount": Decimal("15.00"),
            "payment_method": "Carte"
        }
        response = self.client.post("/api/transactions/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["service"], "Barbe")

    def test_create_transaction_invalid_amount(self):
        """Test la création avec montant invalide"""
        data = {
            "barber_id": str(self.barber.id),
            "service": "Coupe",
            "amount": Decimal("-10.00"),
            "payment_method": "Espèces"
        }
        response = self.client.post("/api/transactions/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_transaction_detail(self):
        """Test la récupération des détails d'une transaction"""
        response = self.client.get(f"/api/transactions/{self.transaction.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["service"], "Coupe simple")

    def test_update_transaction(self):
        """Test la mise à jour d'une transaction"""
        data = {
            "amount": Decimal("30.00")
        }
        response = self.client.put(f"/api/transactions/{self.transaction.id}/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.transaction.refresh_from_db()
        self.assertEqual(self.transaction.amount, Decimal("30.00"))

    def test_delete_transaction(self):
        """Test la suppression d'une transaction"""
        transaction_id = self.transaction.id
        response = self.client.delete(f"/api/transactions/{transaction_id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Transaction.objects.filter(id=transaction_id).exists())


class MonthlyReportAPITest(APITestCase):
    """Tests pour l'endpoint du rapport mensuel"""

    def setUp(self):
        """Crée des données pour les tests"""
        self.user = User.objects.create_user(
            email="test@example.com",
            name="Test User",
            password="testpass123"
        )
        self.barber1 = Barber.objects.create(
            user=self.user,
            barber_name="Jean",
            salary=40
        )
        self.barber2 = Barber.objects.create(
            user=self.user,
            barber_name="Marc",
            salary=50
        )
        # Crée des transactions pour le mois actuel
        today = date.today()
        Transaction.objects.create(
            user=self.user,
            barber=self.barber1,
            service="Coupe",
            amount=Decimal("100.00"),
            payment_method="Espèces",
            date=datetime(today.year, today.month, 15, tzinfo=tz.utc)
        )
        Transaction.objects.create(
            user=self.user,
            barber=self.barber2,
            service="Barbe",
            amount=Decimal("200.00"),
            payment_method="Carte",
            date=datetime(today.year, today.month, 20, tzinfo=tz.utc)
        )
        self.client.force_authenticate(user=self.user)

    def test_monthly_report_success(self):
        """Test le rapport mensuel réussi"""
        today = date.today()
        data = {
            "month": today.month,
            "year": today.year
        }
        response = self.client.post("/api/reports/monthly/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["barbers"]), 2)
        self.assertEqual(response.data["summary"]["total_revenue"], Decimal("300.00"))

    def test_monthly_report_salary_calculation(self):
        """Test le calcul des salaires dans le rapport"""
        today = date.today()
        data = {
            "month": today.month,
            "year": today.year
        }
        response = self.client.post("/api/reports/monthly/", data)
        # Barber1: 100 * 40% = 40
        # Barber2: 200 * 50% = 100
        self.assertEqual(response.data["summary"]["total_salary_deductions"], Decimal("140.00"))
        self.assertEqual(response.data["summary"]["salon_net_profit"], Decimal("160.00"))

    def test_monthly_report_missing_fields(self):
        """Test le rapport sans fields obligatoires"""
        data = {"month": 6}
        response = self.client.post("/api/reports/monthly/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_monthly_report_invalid_month(self):
        """Test le rapport avec mois invalide"""
        data = {
            "month": "invalid",
            "year": 2025
        }
        response = self.client.post("/api/reports/monthly/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class DashboardAPITest(APITestCase):
    """Tests pour l'endpoint du tableau de bord"""

    def setUp(self):
        """Crée des données pour les tests"""
        self.user = User.objects.create_user(
            email="test@example.com",
            name="Test User",
            password="testpass123"
        )
        self.user.ville = "Paris"
        self.user.save()
        self.barber = Barber.objects.create(
            user=self.user,
            barber_name="Jean",
            salary=40
        )
        # Transaction d'aujourd'hui
        today = date.today()
        Transaction.objects.create(
            user=self.user,
            barber=self.barber,
            service="Coupe",
            amount=Decimal("50.00"),
            payment_method="Espèces",
            date=datetime(today.year, today.month, today.day, 10, 0, tzinfo=tz.utc)
        )
        # Transaction d'hier
        yesterday = today - timedelta(days=1)
        Transaction.objects.create(
            user=self.user,
            barber=self.barber,
            service="Barbe",
            amount=Decimal("30.00"),
            payment_method="Carte",
            date=datetime(yesterday.year, yesterday.month, yesterday.day, 14, 0, tzinfo=tz.utc)
        )
        self.client.force_authenticate(user=self.user)

    def test_dashboard_success(self):
        """Test le tableau de bord réussi"""
        response = self.client.get("/api/dashboard/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"]["name"], "Test User")
        self.assertEqual(response.data["barber_count"], 1)

    def test_dashboard_today_revenue(self):
        """Test le calcul du chiffre d'affaires du jour"""
        response = self.client.get("/api/dashboard/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["today_revenue"], Decimal("50.00"))

    def test_dashboard_yesterday_revenue(self):
        """Test le calcul du chiffre d'affaires d'hier"""
        response = self.client.get("/api/dashboard/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["yesterday_revenue"], Decimal("30.00"))

    def test_dashboard_last_transactions(self):
        """Test les dernières transactions du jour"""
        response = self.client.get("/api/dashboard/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["last_transactions"]), 2)

    def test_dashboard_ranking(self):
        """Test le classement des coiffeurs"""
        response = self.client.get("/api/dashboard/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        ranking = response.data["ranking"]
        self.assertEqual(len(ranking), 1)
        self.assertEqual(ranking[0]["rank"], 1)

    def test_dashboard_unauthorized(self):
        """Test l'accès au tableau de bord non authentifié"""
        self.client.force_authenticate(user=None)
        response = self.client.get("/api/dashboard/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
