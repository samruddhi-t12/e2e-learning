# users/admin.py
from django.contrib import admin

# Register your models here.
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'full_name', 'is_active', 'is_staff', 'created_at')
    search_fields = ('email', 'full_name')
    list_filter = ('is_active', 'is_staff')

from .models import ContactQuery

@admin.register(ContactQuery)
class ContactQueryAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at')
    search_fields = ('name', 'email', 'message')