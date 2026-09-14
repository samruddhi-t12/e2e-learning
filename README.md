# 🎓 E2E-Learning Platform

![E2E-Learning Banner](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop)

A full-stack, enterprise-grade e-learning and digital notes marketplace. This platform allows creators to upload educational PDFs, securely hosts them in the cloud, generates automatic previews, and allows students to purchase and unlock the full content seamlessly using Razorpay.

---

## 🌟 Key Features

### 💻 Frontend (React + Vite)
- **Modern UI/UX:** Built with **Tailwind CSS** and fully animated using **Framer Motion**.
- **Role-Based Routing:** Dedicated secure dashboards for Admins/Creators and standard Users.
- **Secure Previews:** In-browser secure iframe rendering for PDF previews.
- **State Management:** React Context API for global authentication state (JWT).

### ⚙️ Backend (Django REST Framework)
- **Secure Authentication:** JSON Web Token (JWT) based authentication.
- **Payment Gateway:** End-to-end secure integration with **Razorpay** (Order creation & Signature verification).
- **Automated PDF Processing:** Uses `PyPDF2` to dynamically slice uploaded PDFs and auto-generate 3-page previews.
- **Cloud Storage:** Deep integration with **Supabase S3** for secure, scalable cloud storage of media and PDFs.
- **Database:** Powered by serverless **Neon PostgreSQL**.

---

## 🛠️ Tech Stack

**Frontend Layer**
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React (Icons)
- React Router DOM

**Backend Layer**
- Python 3.12 / Django 6.0
- Django REST Framework (DRF)
- PostgreSQL (NeonDB)
- Razorpay Python SDK
- Boto3 / Django-Storages (S3)
- PyPDF2 / ReportLab

---

## 🚀 Live Demo & Deployment

**🌍 Live Website:** [https://e2e-learning.vercel.app](https://e2e-learning.vercel.app)

- **Frontend Hosting:** Vercel
- **Backend Hosting:** Render
- **Database:** NeonDB (PostgreSQL)
- **Object Storage:** Supabase S3

---

## 💻 Local Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### 1. Clone the repository
```bash
git clone https://github.com/samruddhi-t12/e2e-learning.git
cd e2e-learning
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv

# Activate Virtual Environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in the `backend` folder:
```env
# Database
DATABASE_URL="your_neon_db_url"

# Supabase Storage
AWS_ACCESS_KEY_ID="your_s3_key"
AWS_SECRET_ACCESS_KEY="your_s3_secret"
AWS_STORAGE_BUCKET_NAME="e2e-learning-media"
AWS_S3_ENDPOINT_URL="https://your-project.supabase.co/storage/v1/s3"
AWS_S3_REGION_NAME="ap-south-1"

# Razorpay
RAZORPAY_KEY_ID="your_test_key"
RAZORPAY_KEY_SECRET="your_test_secret"
```

Run Migrations and start the server:
```bash
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend/project
npm install
```

Create a `.env` file in the `frontend/project` folder:
```env
VITE_API_URL="http://localhost:8000"
```

Start the React development server:
```bash
npm run dev
```

---

## 🛡️ Security Measures
- **PDF Protection:** Full notes are securely stored on S3 and are only accessible via authenticated backend signed requests.
- **Clickjacking Protection:** Configured Django middleware for secure iframe rendering.
- **Webhook Verification:** Cryptographic signature verification for all Razorpay transactions to prevent spoofing.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project is licensed under the MIT License.
