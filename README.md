🧂 Saabz Kitchen – Full-Stack Spices Product Showcase & CMS Platform

Saabz Kitchen is a modern, full-stack product showcase and CMS platform built for a spices & food products brand.
It enables customers to explore spice products, learn about the brand, and send enquiries—while providing administrators with a secure, powerful CMS dashboard to manage products, pages, users, and messages.

Built with React, Express.js, Prisma, PostgreSQL, Multer, JWT Authentication, and a role-based Admin Panel.

🚀 Features Overview
🛍️ Frontend (Customer-Facing)

Modern UI using React + Tailwind CSS + ShadCN

Spice product listing & detailed product pages

Fully dynamic About Saabz Kitchen page

Fully dynamic Contact Us page

Product enquiry & general contact forms

Image rendering from backend /uploads

FAQ sections (storage, usage, sourcing, etc.)

Fully mobile-responsive design

🔐 Authentication System

Email + password login

JWT-based authentication

Role-based access control (RBAC)

admin — full CMS access

user — restricted

Secure token storage (localStorage)

✔ Account Approval Workflow

New users → isApproved = false

Admin must approve users

Unapproved users cannot log in

Optional Disable Signup feature for private admin access

🧑‍💼 Admin Dashboard Features
1️⃣ Spice Product Management

Add, edit, delete spice products

Upload product images via /api/upload

Multiple gallery images

Product details like:

Description

Packaging

Shelf life

Usage notes

Full CRUD operations

2️⃣ About Page CMS

Edit hero section

Edit brand story (Saabz Kitchen journey)

Edit highlights (quality, sourcing, freshness)

Edit team members / brand values

Upload images or icons

Fully database-driven content

3️⃣ Contact Page CMS

Edit hero title & subtitle

Manage contact info cards

Edit FAQ questions & answers

Update map title & business address

4️⃣ Messages Inbox

View customer enquiries

Product enquiries auto-attach product name

Mark messages as read

Delete messages

5️⃣ User Management

Approve or reject users

Promote / demote admins

Delete users

View pending & approved accounts

6️⃣ Upload Management

All images stored in /public/uploads

Backend returns usable public image URLs

Old images replaced automatically

🏗️ Tech Stack
Frontend

React (Vite)

React Router

Tailwind CSS / ShadCN UI

Lucide Icons

Toast + Sonner

React Query

Axios / Fetch API

Backend

Node.js + Express.js

Prisma ORM

PostgreSQL

Multer (image uploads)

JWT Authentication

Bcrypt (password hashing)

Role-Based Access Control (RBAC)

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
│   ├── public/uploads/      # Image storage
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

Product (Spices)
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
1️⃣ Signup

POST /api/auth/register
Creates a user with isApproved = false

2️⃣ Admin Approval

PUT /api/admin/approve/:id

3️⃣ Login

POST /api/auth/login

Response:

{
  "token": "jwt-token",
  "user": {
    "email": "admin@saabzkitchen.com",
    "role": "admin"
  }
}

4️⃣ Protected Requests

Frontend sends:

Authorization: Bearer <token>

🗃️ Image Upload Workflow

1️⃣ React sends
POST /api/upload
Content-Type: multipart/form-data

2️⃣ Backend stores image in /public/uploads

3️⃣ Backend returns:

https://yourdomain.com/uploads/filename.png


4️⃣ Image URL stored in database

📨 Contact & Product Enquiry Workflow

1️⃣ Customer submits form
POST /api/messages

2️⃣ Backend stores enquiry

Includes product name if productId provided

3️⃣ Admin views enquiries in dashboard

4️⃣ Admin can:

Mark as read

Delete messages

🔒 ProtectedRoute Logic (Frontend)

Admin routes require:

✔ Valid JWT

✔ role === admin

✔ isApproved === true

Unauthorized users are redirected to /admin/login.

🧪 Environment Variables
Backend .env
DATABASE_URL="postgresql://user:password@host:5432/saabzkitchen"
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

Add environment variables

Enable static directory: /public

Frontend

Build Command: npm install && npm run build

Publish Directory: dist

Add .env with backend API URL

🎯 Future Enhancements

Spice categories & filters

Online ordering / cart system

Email notifications

CDN image optimization

Admin activity logs

Multi-language support

🏁 Conclusion

Saabz Kitchen is a complete CMS-driven spices & food product platform featuring:

Secure authentication

Full admin dashboard

Dynamic About & Contact pages

Product management system

Customer enquiry inbox

Scalable backend architecture

Designed to grow alongside your brand 🌿🧂