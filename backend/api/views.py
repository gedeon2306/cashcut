from django.shortcuts import render
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from drf_spectacular.utils import extend_schema, inline_serializer
from drf_spectacular.types import OpenApiTypes
from rest_framework import serializers as drf_serializers
from .models import Barber, Transaction
from .serializers import UserSerializer, BarberSerializer, TransactionSerializer


def landing_view(request):
    return render(request, "landingPage.html")


# ─────────────────────────────────────────────
#  AUTH
# ─────────────────────────────────────────────

@extend_schema(
    tags=["Auth"],
    summary="Créer un compte utilisateur",
    request=UserSerializer,
    responses={
        201: inline_serializer(
            name="RegisterSuccess",
            fields={
                "message": drf_serializers.CharField(),
                "user": inline_serializer(
                    name="RegisterUserInfo",
                    fields={
                        "email": drf_serializers.EmailField(),
                        "name": drf_serializers.CharField(),
                    }
                ),
            }
        ),
        400: None,
    },
)
@api_view(['POST'])
@permission_classes([AllowAny])  # Tout le monde peut s'inscrire
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            "message": "Utilisateur créé !",
            "user": {"email": user.email, "name": user.name}
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ─────────────────────────────────────────────
#  PROFIL UTILISATEUR
# ─────────────────────────────────────────────

@extend_schema(
    tags=["Profil"],
    methods=["GET"],
    summary="Récupérer le profil de l'utilisateur connecté",
    responses={
        200: inline_serializer(
            name="UserProfileResponse",
            fields={
                "id": drf_serializers.UUIDField(),
                "name": drf_serializers.CharField(),
                "email": drf_serializers.EmailField(),
                "ville": drf_serializers.CharField(),
            }
        ),
    },
)
@extend_schema(
    tags=["Profil"],
    methods=["PUT"],
    summary="Mettre à jour le profil de l'utilisateur connecté",
    request=UserSerializer,
    responses={
        200: inline_serializer(
            name="UserProfileUpdateResponse",
            fields={
                "id": drf_serializers.UUIDField(),
                "name": drf_serializers.CharField(),
                "email": drf_serializers.EmailField(),
                "ville": drf_serializers.CharField(),
            }
        ),
        400: None,
    },
)
@extend_schema(
    tags=["Profil"],
    methods=["DELETE"],
    summary="Supprimer le compte de l'utilisateur connecté",
    responses={
        204: inline_serializer(
            name="UserDeleteResponse",
            fields={"message": drf_serializers.CharField()}
        ),
    },
)
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    if request.method == 'GET':
        return Response({
            "id": request.user.id,
            "name": request.user.name,
            "email": request.user.email,
            "ville": request.user.ville,
        })

    if request.method == 'PUT':
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "id": request.user.id,
                "name": request.user.name,
                "email": request.user.email,
                "ville": request.user.ville,
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'DELETE':
        request.user.delete()
        return Response({"message": "Utilisateur supprimé avec succès."}, status=status.HTTP_204_NO_CONTENT)


@extend_schema(
    tags=["Profil"],
    summary="Changer le mot de passe de l'utilisateur connecté",
    request=inline_serializer(
        name="UpdatePasswordRequest",
        fields={
            "currentPassword": drf_serializers.CharField(),
            "newPassword": drf_serializers.CharField(),
        }
    ),
    responses={
        200: inline_serializer(
            name="UpdatePasswordSuccess",
            fields={"message": drf_serializers.CharField()}
        ),
        400: inline_serializer(
            name="UpdatePasswordError",
            fields={"error": drf_serializers.CharField()}
        ),
    },
)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_password(request):
    currentPassword = request.data.get("currentPassword")
    newPassword = request.data.get("newPassword")
    if not currentPassword or not newPassword:
        return Response(
            {"error": "Les champs 'password' et 'newpassword' sont obligatoires."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    user = request.user
    if not user.check_password(currentPassword):
        return Response(
            {"error": "Mot de passe actuel incorrect."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    user.set_password(newPassword)
    user.save()
    return Response(
        {"message": "Mot de passe mis à jour avec succès."},
        status=status.HTTP_200_OK,
    )

    
# ─────────────────────────────────────────────
#  BARBERS
# ─────────────────────────────────────────────

@extend_schema(
    tags=["Barbiers"],
    methods=["GET"],
    summary="Lister les barbiers de l'utilisateur connecté (paginé, 5 par page)",
    responses={200: BarberSerializer(many=True)},
)
@extend_schema(
    tags=["Barbiers"],
    methods=["POST"],
    summary="Créer un nouveau barbier pour l'utilisateur connecté",
    request=BarberSerializer,
    responses={201: BarberSerializer, 400: None},
)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def barber_list(request):
    """
    GET  /api/barbers/  → liste les barbiers de l'utilisateur connecté
    POST /api/barbers/  → crée un nouveau barbier pour l'utilisateur connecté
    """
    if request.method == 'GET':

        barbers = Barber.objects.filter(user=request.user)
        paginator = PageNumberPagination()
        paginator.page_size = 5  
        result_page = paginator.paginate_queryset(barbers, request)
        serializer = BarberSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    if request.method == 'POST':
        serializer = BarberSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # On force le propriétaire
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    tags=["Barbiers"],
    methods=["GET"],
    summary="Récupérer les détails d'un barbier",
    responses={200: BarberSerializer, 404: None},
)
@extend_schema(
    tags=["Barbiers"],
    methods=["PUT"],
    summary="Mettre à jour un barbier (barber_name, salary)",
    request=BarberSerializer,
    responses={200: BarberSerializer, 400: None, 404: None},
)
@extend_schema(
    tags=["Barbiers"],
    methods=["DELETE"],
    summary="Supprimer un barbier et toutes ses transactions (CASCADE)",
    responses={
        204: inline_serializer(
            name="BarberDeleteResponse",
            fields={"message": drf_serializers.CharField()}
        ),
        404: None,
    },
)
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def barber_detail(request, pk):
    """
    GET    /api/barbers/<uuid>/  → détails d'un barbier
    PUT    /api/barbers/<uuid>/  → mise à jour partielle (barber_name, salary)
    DELETE /api/barbers/<uuid>/  → supprime le barbier et toutes ses transactions (CASCADE)
    """
    try:
        barber = Barber.objects.get(pk=pk, user=request.user)
    except Barber.DoesNotExist:
        return Response({"error": "Barbier non trouvé."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = BarberSerializer(barber)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = BarberSerializer(barber, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        barber.delete()
        return Response({"message": "Barbier supprimé avec succès."}, status=status.HTTP_204_NO_CONTENT)


# ─────────────────────────────────────────────
#  TRANSACTIONS
# ─────────────────────────────────────────────

@extend_schema(
    tags=["Transactions"],
    methods=["GET"],
    summary="Lister les transactions de l'utilisateur connecté (paginé, 15 par page)",
    responses={
        200: inline_serializer(
            name="TransactionListResponse",
            fields={
                "count": drf_serializers.IntegerField(),
                "next": drf_serializers.CharField(allow_null=True),
                "previous": drf_serializers.CharField(allow_null=True),
                "barbers": BarberSerializer(many=True),
                "results": TransactionSerializer(many=True),
            }
        ),
    },
)
@extend_schema(
    tags=["Transactions"],
    methods=["POST"],
    summary="Créer une transaction (champ barber_id obligatoire dans le body)",
    request=TransactionSerializer,
    responses={201: TransactionSerializer, 400: None},
)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def transaction_list(request):
    """
    GET  /api/transactions/  → liste les transactions de l'utilisateur connecté
    POST /api/transactions/  → crée une transaction (champ barber_id obligatoire dans le body)
    """
    if request.method == 'GET':
        transactions = Transaction.objects.filter(user=request.user)
        barbers = Barber.objects.filter(user=request.user)
        paginator = PageNumberPagination()
        paginator.page_size = 15  
        result_page = paginator.paginate_queryset(transactions, request)
        serializer = TransactionSerializer(result_page, many=True)
        barber_serializer = BarberSerializer(barbers, many=True)
        return Response({
            'count': paginator.page.paginator.count,
            'next': paginator.get_next_link(),
            'previous': paginator.get_previous_link(),
            'barbers': barber_serializer.data,
            'results': serializer.data
        })

    if request.method == 'POST':
        serializer = TransactionSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    tags=["Transactions"],
    methods=["GET"],
    summary="Récupérer les détails d'une transaction",
    responses={200: TransactionSerializer, 404: None},
)
@extend_schema(
    tags=["Transactions"],
    methods=["PUT"],
    summary="Mettre à jour une transaction (amount, date, barber_id)",
    request=TransactionSerializer,
    responses={200: TransactionSerializer, 400: None, 404: None},
)
@extend_schema(
    tags=["Transactions"],
    methods=["DELETE"],
    summary="Supprimer une transaction",
    responses={
        204: inline_serializer(
            name="TransactionDeleteResponse",
            fields={"message": drf_serializers.CharField()}
        ),
        404: None,
    },
)
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def transaction_detail(request, pk):
    """
    GET    /api/transactions/<uuid>/  → détails d'une transaction
    PUT    /api/transactions/<uuid>/  → mise à jour partielle (amount, date, barber_id)
    DELETE /api/transactions/<uuid>/  → suppression
    """
    try:
        transaction = Transaction.objects.get(pk=pk, user=request.user)
    except Transaction.DoesNotExist:
        return Response({"error": "Transaction non trouvée."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TransactionSerializer(transaction, context={'request': request})
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = TransactionSerializer(
            transaction, data=request.data, partial=True, context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        transaction.delete()
        return Response({"message": "Transaction supprimée avec succès."}, status=status.HTTP_204_NO_CONTENT)


# ─────────────────────────────────────────────
#  SALON
# ─────────────────────────────────────────────

@extend_schema(
    tags=["Rapports"],
    summary="Rapport mensuel du salon par coiffeur",
    request=inline_serializer(
        name="MonthlyReportRequest",
        fields={
            "month": drf_serializers.IntegerField(min_value=1, max_value=12),
            "year": drf_serializers.IntegerField(min_value=2000),
        }
    ),
    responses={
        200: inline_serializer(
            name="MonthlyReportResponse",
            fields={
                "month": drf_serializers.IntegerField(),
                "year": drf_serializers.IntegerField(),
                "barbers": inline_serializer(
                    name="BarberReportItem",
                    fields={
                        "barber_id": drf_serializers.UUIDField(),
                        "barber_name": drf_serializers.CharField(),
                        "salary_percentage": drf_serializers.IntegerField(),
                        "service_count": drf_serializers.IntegerField(),
                        "total_revenue": drf_serializers.DecimalField(max_digits=12, decimal_places=2),
                        "barber_salary": drf_serializers.DecimalField(max_digits=12, decimal_places=2),
                        "salon_share": drf_serializers.DecimalField(max_digits=12, decimal_places=2),
                    },
                    many=True
                ),
                "summary": inline_serializer(
                    name="MonthlyReportSummary",
                    fields={
                        "total_revenue": drf_serializers.DecimalField(max_digits=12, decimal_places=2),
                        "total_salary_deductions": drf_serializers.DecimalField(max_digits=12, decimal_places=2),
                        "salon_net_profit": drf_serializers.DecimalField(max_digits=12, decimal_places=2),
                    }
                ),
            }
        ),
        400: inline_serializer(
            name="MonthlyReportError",
            fields={"error": drf_serializers.CharField()}
        ),
    },
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def monthly_report(request):
    """
    POST /api/reports/monthly/
    Body: { "month": 6, "year": 2025 }
    Retourne le rapport mensuel par coiffeur + totaux du salon
    """

    # ── 1. Récupération et validation des paramètres ──────────────────────────
    month = request.data.get("month")
    year = request.data.get("year")

    if not month or not year:
        return Response(
            {"error": "Les champs 'month' et 'year' sont obligatoires."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        # On s'assure que month et year sont bien des entiers
        month = int(month)
        year = int(year)
    except (ValueError, TypeError):
        return Response(
            {"error": "'month' et 'year' doivent être des entiers."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    from django.db.models import Sum, Count
    from decimal import Decimal

    # ── 2. Récupération des coiffeurs de l'utilisateur connecté ───────────────
    # On filtre uniquement les barbiers appartenant à l'utilisateur authentifié
    barbers = Barber.objects.filter(user=request.user)

    barbers_report = []         # Contiendra le détail de chaque coiffeur
    total_salon_revenue = Decimal("0.00")       # Cumul de tout ce que le salon a encaissé
    total_salary_deductions = Decimal("0.00")   # Cumul de tous les salaires à verser

    # ── 3. Calcul des statistiques pour chaque coiffeur ───────────────────────
    for barber in barbers:

        # On récupère toutes les transactions du coiffeur sur le mois/année demandé
        # date__month et date__year sont des filtres Django ORM sur le champ DateTimeField
        transactions = Transaction.objects.filter(
            user=request.user,
            barber=barber,
            date__month=month,
            date__year=year,
        )

        # aggregate() permet de calculer la somme et le nombre en une seule requête SQL
        # → évite de charger tous les objets en mémoire juste pour additionner
        agg = transactions.aggregate(
            total_amount=Sum("amount"),   # Somme de tous les montants
            service_count=Count("id"),    # Nombre de services réalisés
        )

        # Si aucune transaction ce mois-ci, Sum retourne None → on force 0.00
        total_amount = agg["total_amount"] or Decimal("0.00")
        service_count = agg["service_count"]

        # ── Calcul du salaire du coiffeur ─────────────────────────────────────
        # salary est un entier (ex: 40 pour 40%), on le convertit en Decimal pour la précision
        # Ex: total_amount = 100 000, salary = 40% → barber_salary = 40 000
        salary_rate = Decimal(barber.salary) / Decimal("100")
        barber_salary = total_amount * salary_rate

        # Ce que le salon conserve après déduction du salaire du coiffeur
        # Ex: 100 000 - 40 000 = 60 000
        salon_share = total_amount - barber_salary

        # ── Accumulation des totaux globaux du salon ──────────────────────────
        total_salon_revenue += total_amount         # On additionne les revenus de tous les coiffeurs
        total_salary_deductions += barber_salary    # On additionne tous les salaires à payer

        # ── Construction de l'objet rapport pour ce coiffeur ─────────────────
        barbers_report.append({
            "barber_id": str(barber.id),            # UUID converti en string pour la sérialisation JSON
            "barber_name": barber.barber_name,
            "salary_percentage": barber.salary,     # Le taux brut (ex: 40)
            "service_count": service_count,          # Nombre de services ce mois
            "total_revenue": total_amount,           # Ce que le coiffeur a rapporté au salon
            "barber_salary": barber_salary,          # Ce que le coiffeur va recevoir
            "salon_share": salon_share,              # Ce que le salon garde pour ce coiffeur
        })

    # ── 4. Calcul du bénéfice net du salon ────────────────────────────────────
    # Après avoir payé tous les coiffeurs, voici ce qu'il reste au salon
    # Ex: salon encaisse 300 000 total, verse 120 000 en salaires → bénéfice net = 180 000
    salon_net_profit = total_salon_revenue - total_salary_deductions

    # ── 5. Retour de la réponse complète ──────────────────────────────────────
    return Response({
        "month": month,
        "year": year,
        "barbers": barbers_report,  # Détail coiffeur par coiffeur
        "summary": {
            "total_revenue": total_salon_revenue,           # Tout ce que le salon a encaissé
            "total_salary_deductions": total_salary_deductions,  # Total des salaires à verser
            "salon_net_profit": salon_net_profit,           # Ce qu'il reste après les salaires
        }
    }, status=status.HTTP_200_OK)


@extend_schema(
    tags=["Dashboard"],
    summary="Données complètes du tableau de bord",
    responses={
        200: inline_serializer(
            name="DashboardResponse",
            fields={
                "user": inline_serializer(
                    name="DashboardUser",
                    fields={
                        "name": drf_serializers.CharField(),
                        "ville": drf_serializers.CharField(),
                    }
                ),
                "today_revenue": drf_serializers.DecimalField(max_digits=12, decimal_places=2),
                "yesterday_revenue": drf_serializers.DecimalField(max_digits=12, decimal_places=2),
                "barber_count": drf_serializers.IntegerField(),
                "total_salaries_to_pay": drf_serializers.DecimalField(max_digits=12, decimal_places=2),
                "last_transactions": inline_serializer(
                    name="DashboardTransaction",
                    fields={
                        "id": drf_serializers.UUIDField(),
                        "service": drf_serializers.CharField(),
                        "amount": drf_serializers.DecimalField(max_digits=12, decimal_places=2),
                        "payment_method": drf_serializers.CharField(),
                        "date": drf_serializers.DateTimeField(),
                        "barber_name": drf_serializers.CharField(),
                    },
                    many=True
                ),
                "ranking": inline_serializer(
                    name="DashboardRanking",
                    fields={
                        "barber_id": drf_serializers.UUIDField(),
                        "barber_name": drf_serializers.CharField(),
                        "service_count": drf_serializers.IntegerField(),
                        "total_revenue": drf_serializers.DecimalField(max_digits=12, decimal_places=2),
                        "rank": drf_serializers.IntegerField(),
                    },
                    many=True
                ),
                "barbers": BarberSerializer(many=True),
            }
        ),
    },
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    """
    GET /api/dashboard/
    Retourne toutes les données nécessaires pour le tableau de bord
    """
    from django.db.models import Sum, Count
    from decimal import Decimal
    from datetime import date, timedelta

    user = request.user

    # ── 0. Informations de l'utilisateur ──────────────────────────────────────
    user_data = {
        "name": user.name,
        "ville": user.ville,
    }

    # ── 1. Définition des dates utiles ────────────────────────────────────────
    today = date.today()
    yesterday = today - timedelta(days=1)
    current_month = today.month
    current_year = today.year

    # ── 2. Chiffre d'affaires du jour actuel ──────────────────────────────────
    # On filtre les transactions dont la date correspond à aujourd'hui
    today_revenue = Transaction.objects.filter(
        user=request.user,
        date__date=today,       # __date extrait uniquement la partie date d'un DateTimeField
    ).aggregate(total=Sum("amount"))["total"] or Decimal("0.00")

    # ── 3. Chiffre d'affaires du jour passé (hier) ────────────────────────────
    yesterday_revenue = Transaction.objects.filter(
        user=request.user,
        date__date=yesterday,
    ).aggregate(total=Sum("amount"))["total"] or Decimal("0.00")

    # ── 4. Nombre de coiffeurs actifs de l'utilisateur ────────────────────────
    barber_count = Barber.objects.filter(user=request.user).count()

    # ── 5. Somme des salaires à payer pour le mois actuel ─────────────────────
    # On récupère tous les coiffeurs avec leur CA du mois
    # puis on calcule le salaire de chacun (CA * salary%) et on les additionne
    barbers = Barber.objects.filter(user=request.user)
    total_salaries = Decimal("0.00")

    for barber in barbers:
        monthly_revenue = Transaction.objects.filter(
            user=request.user,
            barber=barber,
            date__month=current_month,
            date__year=current_year,
        ).aggregate(total=Sum("amount"))["total"] or Decimal("0.00")

        # Salaire = CA du mois * pourcentage du coiffeur
        barber_salary = monthly_revenue * (Decimal(barber.salary) / Decimal("100"))
        total_salaries += barber_salary

    # ── 6. Les 5 dernières transactions de l'utilisateur ──────────────────────
    # Le model est déjà trié par -created_at, on slice juste les 5 premiers
    last_transactions = Transaction.objects.filter(
        user=request.user
    ).select_related("barber")[:5]  # select_related évite les requêtes N+1 sur barber

    last_transactions_data = [
        {
            "id": str(t.id),
            "service": t.service,
            "amount": t.amount,
            "payment_method": t.payment_method,
            "date": t.created_at,
            "barber_name": t.barber.barber_name,
        }
        for t in last_transactions
    ]

    # ── 7. Classement des coiffeurs basé sur le CA du jour ────────────────────
    # Pour chaque coiffeur on calcule son CA aujourd'hui + nombre de services
    ranking = []

    for barber in barbers:
        agg = Transaction.objects.filter(
            user=request.user,
            barber=barber,
            date__date=today,
        ).aggregate(
            total_revenue=Sum("amount"),    # CA du jour
            service_count=Count("id"),      # Nombre de services du jour
        )

        total_revenue = agg["total_revenue"] or Decimal("0.00")
        service_count = agg["service_count"]

        # On n'inclut que les coiffeurs ayant au moins 1 service aujourd'hui
        if service_count > 0:
            ranking.append({
                "barber_id": str(barber.id),
                "barber_name": barber.barber_name,
                "service_count": service_count,
                "total_revenue": total_revenue,
            })

    # On trie par CA décroissant puis on attribue le rang
    ranking.sort(key=lambda x: x["total_revenue"], reverse=True)
    for index, barber_rank in enumerate(ranking):
        barber_rank["rank"] = index + 1     # Rang #1, #2, #3...

    # ── 8. Barbers ──────────────────────────────────────
    barbers = Barber.objects.filter(user=request.user)
    barber_serializer = BarberSerializer(barbers, many=True)

    # ── 9. Retour de la réponse complète ──────────────────────────────────────
    return Response({
        "user": user_data,
        "today_revenue": today_revenue,             # CA du jour
        "yesterday_revenue": yesterday_revenue,     # CA d'hier (comparaison)
        "barber_count": barber_count,               # Nombre de coiffeurs
        "total_salaries_to_pay": total_salaries,    # Salaires à verser ce mois
        "last_transactions": last_transactions_data,# 5 dernières transactions
        "ranking": ranking,                         # Classement du jour
        'barbers': barber_serializer.data,
    }, status=status.HTTP_200_OK)