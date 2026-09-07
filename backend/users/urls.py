from django.urls import path

from .views import RegisterView, MeView, ContactCreateAPIView, AdminUsersView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='user-register'),
    path('me/', MeView.as_view(), name='user-me'),
    path('contact/', ContactCreateAPIView.as_view(), name='contact-create'),
    path('admin/users/', AdminUsersView.as_view(), name='admin-users'),
]
