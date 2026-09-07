# notes/models.py
import io
import os
from django.db import models
from django.conf import settings
from django.core.files.base import ContentFile
from PyPDF2 import PdfReader, PdfWriter

class Note(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    discounted_price = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    syllabus = models.JSONField(default=list, blank=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='notes')
    
    # We will auto-generate the preview, so make it optional in forms
    preview_pdf = models.FileField(upload_to="previews/", blank=True, null=True)
    main_pdf = models.FileField(upload_to="notes/")
    
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # We need to save the model first if it's new so that main_pdf is actually saved 
        # (if it's a completely new instance, saving the generated pdf directly might be tricky, 
        # but let's handle generating the preview before super().save if we have the file in memory,
        # or after. We will generate it after saving if it's not present).
        
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        # If main_pdf exists but we don't have a preview_pdf yet, generate it.
        # Note: In a production app, it's safer to do this via Celery/Signals to avoid blocking.
        if self.main_pdf and not self.preview_pdf:
            try:
                with self.main_pdf.open('rb') as pdf_file:
                    reader = PdfReader(pdf_file)
                    writer = PdfWriter()
                    
                    # Take up to first 3 pages
                    num_pages = min(3, len(reader.pages))
                    for i in range(num_pages):
                        writer.add_page(reader.pages[i])
                    
                    output = io.BytesIO()
                    writer.write(output)
                    
                    # Save the new preview
                    file_name = os.path.basename(self.main_pdf.name)
                    preview_name = f"preview_{file_name}"
                    
                    self.preview_pdf.save(preview_name, ContentFile(output.getvalue()), save=False)
                    
                # Need to save again because we passed save=False
                super().save(update_fields=['preview_pdf'])
            except Exception as e:
                print(f"Error generating preview PDF: {e}")
                # Fallback: Generate a simple 1-page dummy preview so it doesn't stay null
                try:
                    from reportlab.pdfgen import canvas
                    fallback_buffer = io.BytesIO()
                    p = canvas.Canvas(fallback_buffer)
                    p.drawString(100, 400, "Preview generation failed for this specific PDF format.")
                    p.drawString(100, 380, "The full document is still completely safe and available for purchase.")
                    p.showPage()
                    p.save()
                    fallback_name = f"fallback_preview_{self.id}.pdf"
                    self.preview_pdf.save(fallback_name, ContentFile(fallback_buffer.getvalue()), save=False)
                    super().save(update_fields=['preview_pdf'])
                except Exception as inner_e:
                    pass

    @property
    def average_rating(self):
        reviews = self.reviews.all()
        if reviews.exists():
            return sum(r.rating for r in reviews) / reviews.count()
        return 0

    @property
    def total_reviews(self):
        return self.reviews.count()

    def __str__(self):
        return self.title


class Review(models.Model):
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('note', 'user') # A user can only leave one review per note

    def __str__(self):
        return f"{self.user.email} - {self.note.title} ({self.rating}/5)"
