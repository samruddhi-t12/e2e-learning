from rest_framework import serializers
from .models import Order
from notes.models import Note

# 1. A mini-serializer just to grab the readable details of the Note
class OrderNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        # Add 'cover_image' or 'description' here if your frontend needs them!
        fields = ['id', 'title', 'price'] 

# 2. The main serializer that packages the Order + the Note details together
class OrderSerializer(serializers.ModelSerializer):
    # This nests the Note data inside the Order JSON
    note = OrderNoteSerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 
            'note', 
            'razorpay_order_id', 
            'razorpay_payment_id', 
            'is_paid', 
            'created_at'
        ]