# RFP AI – RFP Management System

An AI-powered application designed to manage, analyze, and respond to RFPs (Request for Proposals) using automated workflows, email integration, and AI-assisted proposal generation.

---
 1. Project Setup

 a. Prerequisites
- Node.js v18.x or above
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- OpenAI API Key
- SMTP Email credentials (Gmail / Outlook / custom SMTP)

---

 b. Install Steps (Frontend & Backend)

 Backend
cd backend
npm install
  Frontend
cd frontend
npm install
---
c. Configure Email Sending / Receiving
Create a .env file in the backend folder:
AI_PROVIDER=groq
PORT=3000
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_openai_api_key

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com
Note: For Gmail, use App Passwords, not your actual password.
----
d. How to Run Everything Locally
Start Backend
npm run dev
Start Frontend
npm run dev
Backend URL: http://localhost:5000
Frontend URL: http://localhost:5173

e. Seed Data / Initial Scripts
No seed data is required.
RFPs can be tested via API calls or by sending sample emails to the configured inbox.

2. Tech Stack
a. Technology Overview
Frontend: React, Vite, JSX

Backend: Node.js, Express

Database: MongoDB

AI Provider: https://groq.com/

Email Solution: Nodemailer (SMTP)

Key Libraries:

Axios

Mongoose

Nodemailer

dotenv

3. API Documentation
a. Main Endpoints
Generate Proposal
POST /api/proposal/generate

Request Body:

json
Copy code
{
  "rfpText": "RFP document content here"
}
Success Response:

json
Copy code
{
  "success": true,
  "proposal": "Generated proposal content"
}
Error Response:

json
Copy code
{
  "success": false,
  "error": "Failed to generate proposal"
}
Send Proposal via Email
POST /api/email/send

Request Body:

json
Copy code
{
  "to": "client@example.com",
  "subject": "RFP Proposal",
  "content": "Proposal content"
}
Success Response:

json
Copy code
{
  "message": "Email sent successfully"
}
Error Response:

json
Copy code
{
  "error": "Email sending failed"
}
