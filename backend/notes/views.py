# notes/views.py
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Note, Review
from .serializers import NoteListSerializer, NoteDetailSerializer, ReviewSerializer
from orders.models import Order

from .permissions import IsStaffOrReadOnly

class NoteListAPIView(generics.ListCreateAPIView):
    queryset = Note.objects.all().order_by('-created_at')
    serializer_class = NoteListSerializer
    permission_classes = [IsStaffOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class MyNotesAPIView(generics.ListAPIView):
    serializer_class = NoteListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user).order_by('-created_at')

class NoteDetailAPIView(generics.RetrieveAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteDetailSerializer
    permission_classes = [AllowAny]

class ReviewCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk, *args, **kwargs):
        note = get_object_or_404(Note, pk=pk)
        
        # Check if user purchased the note
        has_purchased = Order.objects.filter(user=request.user, note=note, is_paid=True).exists()
        if not has_purchased:
            return Response({"error": "You must purchase the note to leave a review."}, status=status.HTTP_403_FORBIDDEN)
        
        if Review.objects.filter(user=request.user, note=note).exists():
            return Response({"error": "You have already reviewed this note."}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, note=note)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
