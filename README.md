📘 Gobbly Treat – Full-Stack Product Showcase Platform

A fully featured, modern product-showcase and CMS platform built with React, Express.js, Prisma, PostgreSQL, Multer image uploads, JWT Authentication, and a secure Admin Dashboard.

This platform allows customers to explore products, learn about the brand, and submit enquiries—while giving administrators a complete CMS to manage products, pages, users, and messages.

🚀 Features Overview
🛍️ Frontend (Customer Facing)

Modern UI with React + Tailwind + ShadCN

Product listing + product detail pages

Fully dynamic About Page

Fully dynamic Contact Page

Contact + Product Enquiry forms

Image rendering from backend /uploads

FAQ sections

Fully mobile responsive design

🔐 Authentication System

Email + password login

JWT-based authentication (token stored in localStorage)

Role-based access

admin — full control panel

user — restricted

✔ Account Approval Workflow

New users → isApproved: false

Admin must approve user

Unapproved users cannot log in

Optional “Disable Signup” switch for restricted access

🧑‍💼 Admin Dashboard Features
1. Product Management

Add, edit, delete products

Upload product images via /api/upload

Multiple gallery images

Full CRUD

2. About Page CMS

Edit hero section

Edit story paragraphs

Edit highlights

Edit team members

Upload images or icons

Fully dynamic DB-driven page

3. Contact Page CMS

Edit hero, subtitle

Edit contact cards (icon, title, lines)

Edit FAQ questions & answers

Edit map title & address

4. Messages Inbox

View customer enquiries

Product enquiries automatically include product name

Mark message as read

Delete messages

5. User Management

Approve new users

Promote/demote admin

Delete users

See pending + approved accounts

6. Upload Management

All images stored in /public/uploads

Returns usable image URL to store in DB

Replaces old images automatically

🏗️ Tech Stack
Frontend

React (Vite)

React Router

Tailwind CSS / ShadCN

Lucide Icons

Toast + Sonner

React Query

Axios / Fetch API

Backend

Node.js + Express.js

Prisma ORM

PostgreSQL

Multer for image uploads

JWT Authentication

Bcrypt for password hashing

Role-based Access Control (RBAC)

📁 Folder Structure
root/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── client.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── products.js
│   │   ├── settings.js
│   │   ├── about.js
│   │   ├── contactPage.js
│   │   └── contactMessages.js
│   ├── middleware/
│   │   └── auth.js
│   ├── public/uploads/     (image storage)
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   │   └── useAuth.tsx
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md

🧩 Core Prisma Models (Simplified)
User
model User {
  id         String   @id @default(uuid())
  email      String   @unique
  password   String
  role       String   @default("USER")
  isApproved Boolean  @default(false)
  createdAt  DateTime @default(now())
}

Product
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  price       Float?
  image_url   String?
  gallery     Json?
  images      ProductImage[]
  created_at  DateTime @default(now())
}

Contact Message
model ContactMessage {
  id          Int      @id @default(autoincrement())
  name        String
  email       String
  subject     String
  message     String
  phone       String?
  productId   Int?
  productName String?
  is_read     Boolean  @default(false)
  createdAt   DateTime @default(now())
}

🔐 Authentication Flow
1. Signup

POST /api/auth/register

Creates user with isApproved = false

2. Admin Approves

PUT /api/admin/approve/:id

3. Login

POST /api/auth/login
Returns:

{
  "token": "jwt-token",
  "user": { "email": "x", "role": "admin" }
}

4. Protected Requests

Frontend sends:

Authorization: Bearer <token>

🗃️ Image Upload Workflow
1️⃣ React sends:
POST /api/upload
Content-Type: multipart/form-data

2️⃣ Backend saves image in /public/uploads
3️⃣ Backend returns:
https://yourdomain.com/uploads/filename.png

4️⃣ URL stored in DB
📨 Contact + Product Enquiry Workflow
1. User submits form

POST /api/messages

2. Backend stores it

Includes product name if productId passed

3. Admin sees messages in dashboard
4. Admin can:

Mark as read

Delete

🔒 ProtectedRoute Logic (Frontend)

Admin pages require:

✔ Valid JWT
✔ role = admin
✔ isApproved = true

Unauthorized users → redirected to /admin/login.

🧪 Environment Variables
Backend .env
DATABASE_URL="postgresql://user:password@host:5432/gobblytreat"
JWT_SECRET="your-secret"
PORT=5000

Frontend .env
VITE_API_URL="https://your-backend.onrender.com/api"

🚀 Run Project Locally
Backend
cd backend
npm install
npx prisma migrate dev
npm start

Frontend
cd frontend
npm install
npm run dev

🟣 Deployment (Render.com)
Backend

Build Command: npm install

Start Command: node server.js

Add environment variables (DATABASE_URL, JWT_SECRET)

Enable Static Directory: /public

Frontend

Build Command: npm install && npm run build

Publish Directory: dist

Add frontend .env with:

VITE_API_URL="https://your-backend-url.onrender.com/api"

🎯 Future Enhancements

Product categories

Order system / Cart

Email notifications

Image optimization CDN

Admin activity logs

🏁 Conclusion

Gobbly Treat is a complete full-stack CMS-driven product showcase system featuring:

Secure authentication

CMS for About + Contact pages

Full product management

Message inbox

Dynamic frontend

Extendable backend architecture

This README fully documents the system’s structure and workflow.