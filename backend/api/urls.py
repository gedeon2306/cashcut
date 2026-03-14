from django.urls import path
from .views import (
    register_user,
    get_user_profile,
    barber_list,
    barber_detail,
    transaction_list,
    transaction_detail,
    update_password,
    monthly_report,
    dashboard,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # ── Auth ──────────────────────────────────────────
    path('register/', register_user, name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # ── Profil utilisateur ────────────────────────────
    path('profile/', get_user_profile, name='user-profile'),

    # ── Mot de passe ──────────────────────────────────
    path('password/', update_password, name='update-password'),

    # ── Barbers ───────────────────────────────────────
    path('barbers/', barber_list, name='barber-list'),
    path('barbers/<uuid:pk>/', barber_detail, name='barber-detail'),

    # ── Transactions ──────────────────────────────────
    path('transactions/', transaction_list, name='transaction-list'),
    path('transactions/<uuid:pk>/', transaction_detail, name='transaction-detail'),

    # ── Salon ──────────────────────────────────
    path('reports/monthly/', monthly_report, name='monthly-report'),
    path('dashboard/', dashboard, name='dashboard'),
]