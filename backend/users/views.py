#users/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            return Response(
                {
                    "message": "User created successfully",
                    "email": user.email,
                    "access": access_token,
                    "refresh": str(refresh),
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        return Response(
            {
                "email": user.email,
                "full_name": user.full_name,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser
            }
        )

from rest_framework import generics
from .models import ContactQuery
from .serializers import ContactQuerySerializer

from django.core.mail import send_mail
from django.conf import settings

class ContactCreateAPIView(generics.CreateAPIView):
    queryset = ContactQuery.objects.all()
    serializer_class = ContactQuerySerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        contact = serializer.save()
        
        # Send Email
        subject = f"New Contact Query from {contact.name}"
        message = f"Name: {contact.name}\nEmail: {contact.email}\n\nMessage:\n{contact.message}"
        
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [settings.DEFAULT_FROM_EMAIL], # Send to admin
                fail_silently=True,
            )
        except Exception as e:
            print("Email failed:", e)

from .permissions import IsSuperUser

class AdminUsersView(APIView):
    permission_classes = [IsSuperUser]

    def get(self, request):
        from .models import User
        users = User.objects.all().values('id', 'email', 'full_name', 'is_staff', 'is_active', 'created_at')
        return Response(list(users))
