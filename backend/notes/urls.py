from django.urls import path
from .views import NoteListAPIView, NoteDetailAPIView, ReviewCreateAPIView, MyNotesAPIView

urlpatterns = [
    path('', NoteListAPIView.as_view(), name='note-list'),
    path('my-notes/', MyNotesAPIView.as_view(), name='my-notes'),
    path('<int:pk>/', NoteDetailAPIView.as_view(), name='note-detail'),
    path('<int:pk>/review/', ReviewCreateAPIView.as_view(), name='note-review'),
]