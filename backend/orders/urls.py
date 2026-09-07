from django.urls import path
from .views import (
    CreateOrderAPIView,
    VerifyPaymentAPIView,
    UserOrdersAPIView,
    SecureNoteDownloadAPIView,
    AdminOrdersView
)

urlpatterns = [
    # Your existing Razorpay payment routes
    path('create/', CreateOrderAPIView.as_view(), name='create-order'),
    path('verify/', VerifyPaymentAPIView.as_view(), name='verify-payment'),
    
    # The new Dashboard and Secure Download routes
    path('my-orders/', UserOrdersAPIView.as_view(), name='my-orders'),
    path('download/<int:note_id>/', SecureNoteDownloadAPIView.as_view(), name='download-note'),
    path('admin/orders/', AdminOrdersView.as_view(), name='admin-orders'),
]