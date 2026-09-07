#notes/admin.py
from django.contrib import admin
from .models import Note, Review


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'price', 'created_at')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('note', 'user', 'rating', 'created_at')
