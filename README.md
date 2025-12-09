📘 Gobbly Treat – Full-Stack Product Showcase Platform

A fully featured, modern product-showcase website built with React, Express.js, Prisma, PostgreSQL, JWT Authentication, and a secure Admin CMS Dashboard.

This platform allows customers to browse products, read information about the brand, and contact the business — while providing administrators with a robust control panel to manage products, pages, users, and messages.

🚀 Features Overview
🛍️ Frontend (Customer Facing)

Beautiful modern UI built in React + Tailwind

Product listing + product detail page

About page with dynamic content

Contact page with dynamic fields + form submission

FAQ area

Mobile-responsive layout

Image rendering from backend /uploads

🔐 Authentication System

Email + Password login

JWT-based authentication (stored securely in localStorage)

Role-based access:

admin — full platform access

user — restricted

Account approval workflow:

Newly registered users = isApproved: false

Admin must review & approve inside Admin Panel

Pending users cannot log in

Optional signup disable switch to restrict new accounts

🧑‍💼 Admin Dashboard Features
1. Product Management

Add, edit, delete products

Upload product images via the /api/upload endpoint

View product list with images

Full CRUD

2. About Page CMS

Edit heading, description

Edit team members, images, and icons

All content stored dynamically in DB

3. Contact Page CMS

Edit hero title, badge, subtitle

Edit contact cards (icon, title, line1, line2)

Edit FAQ questions and answers

Edit map details

4. Messages Inbox

All contact messages are stored in database

Admin can read and delete messages

Securely accessible only to approved admins

5. User Management System

View all users (approved + pending)

Approve or reject new accounts

Promote to admin / Demote admin

Delete user accounts permanently

6. Upload Management

Upload images into /public/uploads

Returns usable URL stored in DB

Preview image before saving

🏗️ Tech Stack
Frontend

React (Vite)

React Router

Tailwind CSS / ShadCN components

Lucide Icons

React Query

Toast + Sonner notifications

Backend

Node.js + Express.js

Prisma ORM

PostgreSQL

Multer for image uploads

JWT Authentication

Bcrypt password hashing

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
│   │   ├── auth.js
│   ├── public/
│   │   └── uploads/ (image storage)
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── hooks/
│   │   │   └── useAuth.tsx
│   │   ├── components/
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md

🧩 Prisma Schema (Key Models)
model User {
  id         String   @id @default(uuid())
  email      String   @unique
  password   String
  role       String   @default("user")
  isApproved Boolean  @default(false)
  createdAt  DateTime @default(now())
}

model Product {
  id          String   @id @default(uuid())
  title       String
  description String
  price       Float
  image       String?
  createdAt   DateTime @default(now())
}

model Message {
  id        String   @id @default(uuid())
  name      String
  email     String
  subject   String
  message   String
  createdAt DateTime @default(now())
}

🔐 Authentication Flow Overview
1. Signup
POST /api/auth/register


Creates user

isApproved = false

User cannot login yet

2. Admin approves user
PUT /api/admin/approve/:id


Now they can log in.

3. Login
POST /api/auth/login


Response includes:

{
  "token": "<jwt>",
  "user": { "id": "...", "email": "...", "role": "admin" }
}

4. Protected Requests

Frontend sends:

Authorization: Bearer <token>


Backend verifies token + admin permissions.

🗃️ Image Upload Workflow
1. Admin selects image

React component sends:

POST /api/upload
Content-Type: multipart/form-data

2. Backend stores file

Saved in /public/uploads

Returns file URL like:

http://localhost:5000/uploads/abc123.png

3. URL stored in DB

This URL is shown everywhere automatically.

📨 Contact Form Workflow
1. User submits contact form
POST /api/messages

2. Message saved in DB
3. Admin views messages in dashboard
4. Admin can delete message
DELETE /api/messages/:id

🧑‍💼 Admin CMS Details
Admin Controls:
Module	Actions
Products	Add / Edit / Delete / Upload images
About Page	Edit content + team members
Contact Page	Edit hero, cards, FAQ, map
Messages	View + Delete
Users	Approve / Reject / Promote / Demote / Delete
🔒 ProtectedRoute Logic (Frontend)

Admin pages require:

Valid JWT

User role = admin

isApproved = true

Non-admins cannot access admin area.

If unauthorized, user is redirected to:

/admin/login

🧪 Environment Variables

Create backend .env:

DATABASE_URL="postgresql://user:pass@localhost:5432/gobblytreat"
JWT_SECRET="yoursecret"

🚀 How to Run Project Locally
Backend
cd backend
npm install
npx prisma migrate dev
npm start

Frontend
cd frontend
npm install
npm run dev

🎯 Planned Enhancements

Product categories

Order or inquiry system

Email notifications for user registration

Image optimization CDN

Admin activity logs

🏁 Conclusion

Gobbly Treat is a robust full-stack CMS-driven product showcase platform with:

Secure authentication

Admin approval system

Complete CMS

Elegant frontend

Extendable backend architecture

This README fully documents how the system works internally and externally.