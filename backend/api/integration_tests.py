"""
Tests d'intégration pour le système CashCut
Couvre les workflows complets, les interactions entre endpoints et les cas d'usage réels
"""

from rest_framework.test import APITestCase
from rest_framework import status
from decimal import Decimal
from datetime import date, timedelta, datetime, timezone as tz
from django.contrib.auth import get_user_model
from .models import Barber, Transaction

User = get_user_model()


# ═══════════════════════════════════════════════════════════════════════════
#  WORKFLOWS UTILISATEUR COMPLETS
# ═══════════════════════════════════════════════════════════════════════════

class FullUserJourneyTest(APITestCase):
    """Tests couvrant le workflow complet d'un utilisateur du début à la fin"""

    def test_complete_user_journey(self):
        """
        Intégration complète: Inscription → Profil → Barbier → Transactions → Rapports
        """
        # ── 1. INSCRIPTION ────────────────────────────────────────────────────
        register_data = {
            "email": "barbershop@example.com",
            "name": "Salon de Pierre",
            "password": "securepass123"
        }
        response = self.client.post("/api/register/", register_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("user", response.data)
        
        # ── 2. CONNEXION (simulée par force_authenticate) ──────────────────
        user = User.objects.get(email="barbershop@example.com")
        self.client.force_authenticate(user=user)
        
        # ── 3. MISE A JOUR DU PROFIL ──────────────────────────────────────────
        profile_update = {
            "name": "Salon de Pierre - Bordeaux",
            "ville": "Bordeaux"
        }
        response = self.client.put("/api/profile/", profile_update)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["ville"], "Bordeaux")
        
        # ── 4. AJOUT DE BARBIERS ──────────────────────────────────────────────
        barners_data = [
            {"barber_name": "Jean", "salary": 40},
            {"barber_name": "Marc", "salary": 50},
            {"barber_name": "Claude", "salary": 35}
        ]
        barber_ids = []
        for barber_data in barners_data:
            response = self.client.post("/api/barbers/", barber_data)
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            barber_ids.append(response.data["id"])
        
        # Vérifier la liste des barbiers
        response = self.client.get("/api/barbers/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 3)
        
        # ── 5. AJOUT DE TRANSACTIONS ──────────────────────────────────────────
        today = date.today()
        transactions_data = [
            {
                "barber_id": barber_ids[0],
                "service": "Coupe simple",
                "amount": Decimal("25.00"),
                "payment_method": "Espèces"
            },
            {
                "barber_id": barber_ids[1],
                "service": "Coupe + Barbe",
                "amount": Decimal("40.00"),
                "payment_method": "Carte"
            },
            {
                "barber_id": barber_ids[0],
                "service": "Coupe enfant",
                "amount": Decimal("15.00"),
                "payment_method": "Espèces"
            },
            {
                "barber_id": barber_ids[2],
                "service": "Coloration",
                "amount": Decimal("60.00"),
                "payment_method": "Carte"
            },
        ]
        
        for trans_data in transactions_data:
            response = self.client.post("/api/transactions/", trans_data)
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            self.assertEqual(response.data["service"], trans_data["service"])
        
        # Vérifier les transactions
        response = self.client.get("/api/transactions/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 4)
        
        # ── 6. CONSULTER LE DASHBOARD ─────────────────────────────────────────
        response = self.client.get("/api/dashboard/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        dashboard = response.data
        
        # Vérifications du dashboard
        self.assertEqual(dashboard["barber_count"], 3)
        self.assertEqual(dashboard["today_revenue"], Decimal("140.00"))  # Total du jour
        self.assertGreaterEqual(len(dashboard["last_transactions"]), 1)
        self.assertIn("ranking", dashboard)
        
        # ── 7. RAPPORT MENSUEL ────────────────────────────────────────────────
        report_data = {
            "month": today.month,
            "year": today.year
        }
        response = self.client.post("/api/reports/monthly/", report_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        report = response.data
        
        # Vé9rifications du rapport
        self.assertEqual(len(report["barbers"]), 3)
        self.assertEqual(report["summary"]["total_revenue"], Decimal("140.00"))
        
        # Calcul attendu des salaires:
        # Jean (40%): (25+15) * 0.40 = 16
        # Marc (50%): 40 * 0.50 = 20
        # Claude (35%): 60 * 0.35 = 21
        # Total salaires = 57
        self.assertEqual(report["summary"]["total_salary_deductions"], Decimal("57.00"))
        self.assertEqual(report["summary"]["salon_net_profit"], Decimal("83.00"))

    def test_multiple_barbiers_multiple_transactions(self):
        """Test avec plusieurs barbiés et transactions sur plusieurs jours"""
        user = User.objects.create_user(
            email="test@example.com",
            name="Test User",
            password="testpass"
        )
        self.client.force_authenticate(user=user)
        
        # Créer 5 barbiés
        barbers = []
        for i in range(5):
            response = self.client.post("/api/barbers/", {
                "barber_name": f"Barber{i+1}",
                "salary": 30 + (i * 5)
            })
            barbers.append(response.data["id"])
        
        # Créer des transactions sur 7 jours
        today = date.today()
        for day_offset in range(7):
            day = today - timedelta(days=day_offset)
            for barber_id in barbers:
                response = self.client.post("/api/transactions/", {
                    "barber_id": barber_id,
                    "service": f"Service day {day_offset}",
                    "amount": Decimal("50.00"),
                    "payment_method": "Espèces",
                    "date": datetime(day.year, day.month, day.day, 10, 0, tzinfo=tz.utc)
                })
                self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Vérifier le dashboard
        response = self.client.get("/api/dashboard/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["barber_count"], 5)


# ═══════════════════════════════════════════════════════════════════════════
#  GESTION DES PERMISSIONS ET CAS LIMITES
# ═══════════════════════════════════════════════════════════════════════════

class PermissionAndIsolationTest(APITestCase):
    """Tests des permissions et isolations entre utilisateurs"""

    def setUp(self):
        """Crée deux utilisateurs séparés"""
        self.user1 = User.objects.create_user(
            email="user1@example.com",
            name="User 1",
            password="pass1"
        )
        self.user2 = User.objects.create_user(
            email="user2@example.com",
            name="User 2",
            password="pass2"
        )
        
        # Créer des barbiés pour user1
        self.barber_user1 = Barber.objects.create(
            user=self.user1,
            barber_name="Barber User1",
            salary=40
        )
        
        # Créer des barbiés pour user2
        self.barber_user2 = Barber.objects.create(
            user=self.user2,
            barber_name="Barber User2",
            salary=50
        )

    def test_user1_cannot_see_user2_barbers(self):
        """User1 ne peut pas voir les barbiés du user2"""
        self.client.force_authenticate(user=self.user1)
        
        response = self.client.get("/api/barbers/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        barber_ids = [b["id"] for b in response.data["results"]]
        
        # Le barbié de user2 ne doit pas être dans la liste
        self.assertNotIn(str(self.barber_user2.id), barber_ids)
        self.assertIn(str(self.barber_user1.id), barber_ids)

    def test_user1_cannot_create_transaction_with_user2_barber(self):
        """User1 ne peut pas créer de transaction avec le barbié de user2"""
        self.client.force_authenticate(user=self.user1)
        
        response = self.client.post("/api/transactions/", {
            "barber_id": str(self.barber_user2.id),
            "service": "Coupe",
            "amount": Decimal("25.00"),
            "payment_method": "Espèces"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user1_cannot_access_user2_transactions(self):
        """User1 ne peut pas voir les transactions de user2"""
        # Créer une transaction pour user2
        trans = Transaction.objects.create(
            user=self.user2,
            barber=self.barber_user2,
            service="Coupe",
            amount=Decimal("25.00"),
            payment_method="Espèces"
        )
        
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(f"/api/transactions/{trans.id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user1_cannot_delete_user2_barber(self):
        """User1 ne peut pas supprimer le barbié de user2"""
        self.client.force_authenticate(user=self.user1)
        
        response = self.client.delete(f"/api/barbers/{self.barber_user2.id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        # Vérifier que le barbié existe toujours
        self.assertTrue(Barber.objects.filter(id=self.barber_user2.id).exists())

    def test_dashboard_only_shows_own_data(self):
        """Le dashboard ne montre que les données de l'utilisateur connecte"""
        # Créer des transactions pour user2
        for i in range(3):
            Transaction.objects.create(
                user=self.user2,
                barber=self.barber_user2,
                service=f"Service {i}",
                amount=Decimal("50.00"),
                payment_method="Espèces"
            )
        
        # Vérifier le dashboard de user1
        self.client.force_authenticate(user=self.user1)
        response = self.client.get("/api/dashboard/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["barber_count"], 1)
        # Le total du jour devrait \être 0 car user1 n'a pas de transactions aujourd'hui
        self.assertEqual(response.data["today_revenue"], Decimal("0.00"))


# ═══════════════════════════════════════════════════════════════════════════
#  MODIFICATIONS ET SUPPRESSIONS EN CASCADE
# ═══════════════════════════════════════════════════════════════════════════

class CascadeDeleteTest(APITestCase):
    """Tests des suppressions en cascade"""

    def test_delete_barber_cascade_deletes_transactions(self):
        """Supprimer un barbié supprime aussi toutes ses transactions"""
        user = User.objects.create_user(
            email="test@example.com",
            name="Test",
            password="pass"
        )
        barber = Barber.objects.create(user=user, barber_name="Jean", salary=40)
        
        # Créer plusieurs transactions
        for i in range(5):
            Transaction.objects.create(
                user=user,
                barber=barber,
                service=f"Service {i}",
                amount=Decimal("25.00"),
                payment_method="Espèces"
            )
        
        self.assertEqual(Transaction.objects.filter(barber=barber).count(), 5)
        
        self.client.force_authenticate(user=user)
        response = self.client.delete(f"/api/barbers/{barber.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Vérifier que le barbié est supprimé
        self.assertFalse(Barber.objects.filter(id=barber.id).exists())
        
        # Vérifier que les transactions sont supprimées
        self.assertEqual(Transaction.objects.filter(barber=barber).count(), 0)

    def test_delete_user_cascade_deletes_barbers_and_transactions(self):
        """Supprimer un utilisateur supprime ses barbiés et transactions"""
        user = User.objects.create_user(
            email="test@example.com",
            name="Test",
            password="pass"
        )
        
        # Créer barbiés et transactions
        barber1 = Barber.objects.create(user=user, barber_name="Jean", salary=40)
        barber2 = Barber.objects.create(user=user, barber_name="Marc", salary=50)
        
        trans1 = Transaction.objects.create(
            user=user, barber=barber1,
            service="Coupe", amount=Decimal("25.00"), payment_method="Espèces"
        )
        trans2 = Transaction.objects.create(
            user=user, barber=barber2,
            service="Barbe", amount=Decimal("15.00"), payment_method="Espèces"
        )
        
        self.assertEqual(Barber.objects.filter(user=user).count(), 2)
        self.assertEqual(Transaction.objects.filter(user=user).count(), 2)
        
        self.client.force_authenticate(user=user)
        response = self.client.delete("/api/profile/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Vérifier que l'utilisateur est supprimé
        self.assertFalse(User.objects.filter(id=user.id).exists())
        
        # Vérifier que les barbiés et transactions sont aussi supprimés
        self.assertFalse(Barber.objects.filter(id=barber1.id).exists())
        self.assertFalse(Barber.objects.filter(id=barber2.id).exists())
        self.assertFalse(Transaction.objects.filter(id=trans1.id).exists())
        self.assertFalse(Transaction.objects.filter(id=trans2.id).exists())


# ═══════════════════════════════════════════════════════════════════════════
#  MODIFICATIONS DE DONNEES
# ═══════════════════════════════════════════════════════════════════════════

class DataModificationTest(APITestCase):
    """Tests des modifications de données en cascade"""

    def test_update_barber_salary_affects_reports(self):
        """Modifier le salaire d'un barbié affecte les futurs rapports"""
        user = User.objects.create_user(
            email="test@example.com",
            name="Test",
            password="pass"
        )
        barber = Barber.objects.create(user=user, barber_name="Jean", salary=40)
        
        # Créer une transaction
        today = date.today()
        Transaction.objects.create(
            user=user,
            barber=barber,
            service="Coupe",
            amount=Decimal("100.00"),
            payment_method="Espèces",
            date=datetime(today.year, today.month, 15, tzinfo=tz.utc)
        )
        
        self.client.force_authenticate(user=user)
        
        # Générer un rapport avec salaire 40%
        response = self.client.post("/api/reports/monthly/", {
            "month": today.month,
            "year": today.year
        })
        self.assertEqual(
            response.data["summary"]["total_salary_deductions"],
            Decimal("40.00")  # 100 * 40%
        )
        
        # Modifier le salaire du barbié
        response = self.client.put(f"/api/barbers/{barber.id}/", {
            "barber_name": "Jean",
            "salary": 50
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Générer un rapport avec nouveau salaire
        response = self.client.post("/api/reports/monthly/", {
            "month": today.month,
            "year": today.year
        })
        self.assertEqual(
            response.data["summary"]["total_salary_deductions"],
            Decimal("50.00")  # 100 * 50%
        )

    def test_update_transaction_amount(self):
        """Modifier le montant d'une transaction affecte le résumé"""
        user = User.objects.create_user(
            email="test@example.com",
            name="Test",
            password="pass"
        )
        barber = Barber.objects.create(user=user, barber_name="Jean", salary=40)
        trans = Transaction.objects.create(
            user=user,
            barber=barber,
            service="Coupe",
            amount=Decimal("25.00"),
            payment_method="Espèces"
        )
        
        self.client.force_authenticate(user=user)
        
        # Vérifier le montant initial
        response = self.client.get("/api/dashboard/")
        initial_revenue = response.data["today_revenue"]
        self.assertGreater(initial_revenue, Decimal("0.00"))
        
        # Modifier le montant
        response = self.client.put(f"/api/transactions/{trans.id}/", {
            "amount": Decimal("50.00")
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Vérifier que le montant a doublé
        response = self.client.get("/api/dashboard/")
        new_revenue = response.data["today_revenue"]
        self.assertEqual(new_revenue, Decimal("50.00"))


# ═══════════════════════════════════════════════════════════════════════════
#  VALIDATIONS ET CONTRAINTES
# ═══════════════════════════════════════════════════════════════════════════

class ValidationConstraintTest(APITestCase):
    """Tests des validations et contraintes de données"""

    def test_cannot_update_transaction_to_negative_amount(self):
        """Ne pas pouvoir modifier une transaction avec montant négatif"""
        user = User.objects.create_user(
            email="test@example.com",
            name="Test",
            password="pass"
        )
        barber = Barber.objects.create(user=user, barber_name="Jean", salary=40)
        trans = Transaction.objects.create(
            user=user,
            barber=barber,
            service="Coupe",
            amount=Decimal("25.00"),
            payment_method="Espèces"
        )
        
        self.client.force_authenticate(user=user)
        response = self.client.put(f"/api/transactions/{trans.id}/", {
            "amount": Decimal("-50.00")
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Vérifier que le montant n'a pas changé
        trans.refresh_from_db()
        self.assertEqual(trans.amount, Decimal("25.00"))

    def test_cannot_create_duplicate_user_email(self):
        """Ne pas pouvoir créer deux utilisateurs avec le même email"""
        data1 = {
            "email": "duplicate@example.com",
            "name": "User 1",
            "password": "pass1"
        }
        response = self.client.post("/api/register/", data1)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        data2 = {
            "email": "duplicate@example.com",
            "name": "User 2",
            "password": "pass2"
        }
        response = self.client.post("/api/register/", data2)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_password_is_hashed(self):
        """Le mot de passe doit être hashé, pas en clair"""
        data = {
            "email": "test@example.com",
            "name": "Test",
            "password": "mypassword123"
        }
        response = self.client.post("/api/register/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        user = User.objects.get(email="test@example.com")
        self.assertNotEqual(user.password, "mypassword123")
        self.assertTrue(user.check_password("mypassword123"))


# ═══════════════════════════════════════════════════════════════════════════
#  AUTHENTIFICATION ET AUTORISATION
# ═══════════════════════════════════════════════════════════════════════════

class AuthenticationAuthorizationTest(APITestCase):
    """Tests l'authentification et l'autorisation"""

    def test_unauthenticated_cannot_access_protected_endpoints(self):
        """Un utilisateur non connecté ne peut pas accéder aux endpoints protégés"""
        protected_endpoints = [
            ("/api/profile/", "GET"),
            ("/api/barbers/", "GET"),
            ("/api/transactions/", "GET"),
            ("/api/dashboard/", "GET"),
        ]
        
        for endpoint, method in protected_endpoints:
            if method == "GET":
                response = self.client.get(endpoint)
            elif method == "POST":
                response = self.client.post(endpoint)
            
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_anonymous_can_register(self):
        """Un utilisateur anonyme peut s'inscrire"""
        data = {
            "email": "new@example.com",
            "name": "New User",
            "password": "newpass"
        }
        response = self.client.post("/api/register/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_password_change_requires_current_password(self):
        """Le changement de mot de passe doit vérifier l'ancien mot de passe"""
        user = User.objects.create_user(
            email="test@example.com",
            name="Test",
            password="oldpass"
        )
        self.client.force_authenticate(user=user)
        
        # Avec ancien mot de passe invalide
        response = self.client.put("/api/password/", {
            "currentPassword": "wrongpass",
            "newPassword": "newpass"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Avec ancien mot de passe valide
        response = self.client.put("/api/password/", {
            "currentPassword": "oldpass",
            "newPassword": "newpass"
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_can_delete_own_account(self):
        """Un utilisateur peut supprimer son propre compte"""
        user = User.objects.create_user(
            email="test@example.com",
            name="Test",
            password="pass"
        )
        user_id = user.id
        self.client.force_authenticate(user=user)
        
        response = self.client.delete("/api/profile/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Vérifier que l'utilisateur n'existe plus
        self.assertFalse(User.objects.filter(id=user_id).exists())


# ═══════════════════════════════════════════════════════════════════════════
#  RAPPORTS COMPLEXES
# ═══════════════════════════════════════════════════════════════════════════

class ComplexReportingTest(APITestCase):
    """Tests des rapports complexity avec différents scénarios"""

    def test_report_with_no_transactions(self):
        """Un rapport pour un mois vide doit retourner 0"""
        user = User.objects.create_user(
            email="test@example.com",
            name="Test",
            password="pass"
        )
        barber = Barber.objects.create(user=user, barber_name="Jean", salary=40)
        
        self.client.force_authenticate(user=user)
        response = self.client.post("/api/reports/monthly/", {
            "month": 1,
            "year": 2020  # Année sans transactions
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["summary"]["total_revenue"], Decimal("0.00"))
        self.assertEqual(response.data["summary"]["total_salary_deductions"], Decimal("0.00"))

    def test_report_with_multiple_barbers_different_salaries(self):
        """Test rapport avec salaires différents pour chaque barbié"""
        user = User.objects.create_user(
            email="test@example.com",
            name="Test",
            password="pass"
        )
        
        # Créer 3 barbiés avec salaires différents
        barber_configs = [
            ("Jean", 30, Decimal("1000.00")),
            ("Marc", 50, Decimal("2000.00")),
            ("Claude", 70, Decimal("3000.00")),
        ]
        
        today = date.today()
        for name, salary, amount in barber_configs:
            barber = Barber.objects.create(user=user, barber_name=name, salary=salary)
            Transaction.objects.create(
                user=user,
                barber=barber,
                service="Service",
                amount=amount,
                payment_method="Espèces",
                date=datetime(today.year, today.month, 15, tzinfo=tz.utc)
            )
        
        self.client.force_authenticate(user=user)
        response = self.client.post("/api/reports/monthly/", {
            "month": today.month,
            "year": today.year
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Vérifications
        total_revenue = Decimal("6000.00")  # 1000 + 2000 + 3000
        expected_salaries = (
            Decimal("1000.00") * Decimal("0.30") +  # Jean 30%
            Decimal("2000.00") * Decimal("0.50") +  # Marc 50%
            Decimal("3000.00") * Decimal("0.70")    # Claude 70%
        )  # = 300 + 1000 + 2100 = 3400
        
        self.assertEqual(response.data["summary"]["total_revenue"], total_revenue)
        self.assertEqual(response.data["summary"]["total_salary_deductions"], expected_salaries)
        self.assertEqual(response.data["summary"]["salon_net_profit"], total_revenue - expected_salaries)

    def test_report_malformed_request(self):
        """Test du rapport avec requête mal formée"""
        user = User.objects.create_user(
            email="test@example.com",
            name="Test",
            password="pass"
        )
        self.client.force_authenticate(user=user)
        
        # Sans mois et année
        response = self.client.post("/api/reports/monthly/", {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Avec mois invalide
        response = self.client.post("/api/reports/monthly/", {
            "month": 13,
            "year": 2025
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


# ═══════════════════════════════════════════════════════════════════════════
#  PAGINATION ET LIMITES
# ═══════════════════════════════════════════════════════════════════════════

class PaginationLimitTest(APITestCase):
    """Tests la pagination et les limites"""

    def test_barber_pagination_5_per_page(self):
        """Vérifier la pagination des barbiés (5 par page)"""
        user = User.objects.create_user(
            email="test@example.com",
            name="Test",
            password="pass"
        )
        
        # Créer 12 barbiés
        for i in range(12):
            Barber.objects.create(
                user=user,
                barber_name=f"Barber{i}",
                salary=40
            )
        
        self.client.force_authenticate(user=user)
        
        # Page 1
        response = self.client.get("/api/barbers/?page=1")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 5)
        self.assertIsNotNone(response.data["next"])
        
        # Page 2
        response = self.client.get("/api/barbers/?page=2")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 5)
        self.assertIsNotNone(response.data["next"])
        
        # Page 3
        response = self.client.get("/api/barbers/?page=3")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)
        self.assertIsNone(response.data["next"])

    def test_transaction_pagination_15_per_page(self):
        """Vérifier la pagination des transactions (15 par page)"""
        user = User.objects.create_user(
            email="test@example.com",
            name="Test",
            password="pass"
        )
        barber = Barber.objects.create(user=user, barber_name="Jean", salary=40)
        
        # Créer 50 transactions
        for i in range(50):
            Transaction.objects.create(
                user=user,
                barber=barber,
                service=f"Service {i}",
                amount=Decimal("25.00"),
                payment_method="Espèces"
            )
        
        self.client.force_authenticate(user=user)
        
        # Page 1
        response = self.client.get("/api/transactions/?page=1")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 15)
        
        # Vérifier que le compte total existe
        self.assertEqual(response.data["count"], 50)
