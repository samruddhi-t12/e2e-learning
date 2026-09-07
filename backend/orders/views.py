import io
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
import razorpay
from .models import Order
from notes.models import Note
from PyPDF2 import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from .serializers import OrderSerializer

# Initialize the Razorpay Client
client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class CreateOrderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        note_id = request.data.get('note_id')
        
        try:
            note = Note.objects.get(id=note_id)
        except Note.DoesNotExist:
            return Response({"error": "Note not found"}, status=status.HTTP_404_NOT_FOUND)

        # Use discounted price if it exists, otherwise use regular price
        actual_price = note.discounted_price if note.discounted_price else note.price
        amount_in_paise = int(actual_price * 100) 

        try:
            # Create Razorpay order
            razorpay_order = client.order.create({
                "amount": amount_in_paise,
                "currency": "INR",
                "payment_capture": "1" 
            })
        except Exception as e:
            # This forces Postman to show exactly where the error came from
            return Response({"error": f"Proof it is Razorpay: {repr(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Save pending order in DB
        order = Order.objects.create(
            user=request.user,
            note=note,
            razorpay_order_id=razorpay_order['id'],
            is_paid=False 
        )

        return Response({
            "order_id": order.id,
            "razorpay_order_id": razorpay_order['id'],
            "amount": amount_in_paise,
            "currency": "INR",
            "razorpay_key": settings.RAZORPAY_KEY_ID
        }, status=status.HTTP_201_CREATED)


class VerifyPaymentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # 1. Grab the 3 pieces of data React sends after the popup closes
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_signature = request.data.get('razorpay_signature')

        # 2. Mathematically verify the signature with Razorpay's secret math
        try:
            client.utility.verify_payment_signature({
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            })
        except razorpay.errors.SignatureVerificationError:
            # If the math fails, it's a fake request!
            return Response({"error": "Payment verification failed. Invalid signature."}, status=status.HTTP_400_BAD_REQUEST)

        # 3. If legit, find the pending order in our database
        try:
            order = Order.objects.get(razorpay_order_id=razorpay_order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        # 4. BOOM. Set to PAID and save the receipt details!
        order.razorpay_payment_id = razorpay_payment_id
        order.razorpay_signature = razorpay_signature
        order.is_paid = True
        order.save()

        # THIS is the exact moment that `is_unlocked` becomes True in your Notes API!
        return Response({"message": "Payment successful! Note is now unlocked."}, status=status.HTTP_200_OK)


class UserOrdersAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Only fetch orders that belong to the logged-in user AND are actually paid for
        orders = Order.objects.filter(user=request.user, is_paid=True).select_related('note')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class SecureNoteDownloadAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, note_id, *args, **kwargs):
        note = get_object_or_404(Note, id=note_id)
        
        has_paid = Order.objects.filter(user=request.user, note=note, is_paid=True).exists()
        if not has_paid:
            return Response({"error": "Purchase required to download this note."}, status=status.HTTP_403_FORBIDDEN)

        if not note.main_pdf:
            return Response({"error": "File missing from server."}, status=status.HTTP_404_NOT_FOUND)

        original_pdf = PdfReader(note.main_pdf.open('rb'))
        output = PdfWriter()

        watermark_buffer = io.BytesIO()
        c = canvas.Canvas(watermark_buffer, pagesize=letter)
        width, height = letter # Get the exact math dimensions of the page
        
        watermark_text = f"{request.user.email}"

        # Loop through every page and apply the massive diagonal stamp
        for page_num in range(len(original_pdf.pages)):
            # 1. Move to the absolute center of the page
            c.translate(width / 2, height / 2)
            
            # 2. Rotate the canvas 45 degrees diagonally
            c.rotate(45)
            
            # 3. Make it massive (40pt) and 20% transparent (alpha=0.2)
            c.setFont("Helvetica-Bold", 40)
            c.setFillGray(0.5, alpha=0.2)
            
            # 4. Draw the text exactly in the center (0, 0 because we translated)
            c.drawCentredString(0, 0, watermark_text) 
            
            # 5. Save the page and reset the canvas for the next loop
            c.showPage()
            
        c.save()

        watermark_buffer.seek(0)
        watermark_pdf = PdfReader(watermark_buffer)

        # Merge the new diagonal stamp layer onto the original pages
        for i in range(len(original_pdf.pages)):
            page = original_pdf.pages[i]
            page.merge_page(watermark_pdf.pages[0]) # Pages[0] is our stamp
            output.add_page(page)

        final_buffer = io.BytesIO()
        output.write(final_buffer)
        final_buffer.seek(0) 

        return FileResponse(
            final_buffer, 
            as_attachment=True, 
            filename=f"{note.title}_E2E_Protected.pdf",
            content_type='application/pdf'
        )

from users.permissions import IsSuperUser

class AdminOrdersView(APIView):
    permission_classes = [IsSuperUser]

    def get(self, request):
        orders = Order.objects.all().select_related('note', 'user').order_by('-created_at')
        data = []
        for o in orders:
            data.append({
                "id": o.id,
                "user_email": o.user.email,
                "note_title": o.note.title,
                "is_paid": o.is_paid,
                "created_at": o.created_at,
                "amount": o.note.discounted_price or o.note.price
            })
        return Response(data)