from rest_framework import serializers
from .models import Note, Review
from orders.models import Order
from django.contrib.auth import get_user_model

User = get_user_model()

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'full_name']

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user_name', 'rating', 'comment', 'created_at']


class NoteListSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    total_reviews = serializers.IntegerField(read_only=True)
    main_pdf = serializers.FileField(write_only=True)

    class Meta:
        model = Note
        fields = [
            'id', 'title', 'description', 'price', 'discounted_price', 
            'main_pdf', 'preview_pdf', 'author', 'average_rating', 'total_reviews', 'created_at'
        ]

class NoteDetailSerializer(serializers.ModelSerializer):
    is_unlocked = serializers.SerializerMethodField()
    main_pdf = serializers.SerializerMethodField()
    author = AuthorSerializer(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    total_reviews = serializers.IntegerField(read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Note
        fields = [
            'id', 'title', 'description', 'price', 'discounted_price', 'syllabus',
            'preview_pdf', 'main_pdf', 'is_unlocked', 'author', 
            'average_rating', 'total_reviews', 'reviews', 'created_at'
        ]

    def get_is_unlocked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Order.objects.filter(user=request.user, note=obj, is_paid=True).exists()
        return False

    def get_main_pdf(self, obj):
        if self.get_is_unlocked(obj):
            request = self.context.get('request')
            if obj.main_pdf and request:
                return request.build_absolute_uri(obj.main_pdf.url)
            return obj.main_pdf.url if obj.main_pdf else None
        return None