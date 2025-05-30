# 🛒 eCommerce Checkout Flow Simulation

**Live Demo**: [View Deployed Project](https://e-sales-one-t733-3fgo64swh-liyan-mubaraks-projects.vercel.app/)

This project is a 3-page mini eCommerce simulation designed to showcase a complete purchase journey, including transaction handling, form validations, email notifications, and backend integration.

---

## 🚀 Features

### Landing Page
- Product display (image, title, description, price)
- Variant and quantity selector
- "Buy Now" button redirects to the checkout page

### Checkout Page
- Form with validation:
  - Full Name
  - Email (valid format)
  - Phone Number (valid format)
  - Address
  - City, State, Zip Code
  - Card Number (16-digit validation)
  - Expiry Date (must be a future date)
  - CVV (3-digit validation)
- Dynamic Order Summary displaying selected variant and quantity
- On submission:
  - Order is stored in the database
  - Unique order number is generated
  - Product inventory is updated
  - Redirects to Thank You Page
  - Confirmation email is sent via Mailtrap

#### 💳 Transaction Simulation
To simulate different outcomes, enter the following card numbers:
- `Card 1` → ✅ Approved Transaction
- `Card 2` → ❌ Declined Transaction
- `Card 3` → ⚠️ Payment Gateway Error

> **CVV**: Any 3-digit number  
> **Expiry**: Any valid future date

### Thank You Page
- Displays unique order number, full customer details, and order summary
- Data is fetched directly from the backend (not browser storage)

---

## 🧰 Tech Stack

### Frontend
- [Next.js](https://nextjs.org/)
- Hosted on [Vercel](https://vercel.com/)

### Backend
- [Node.js](https://nodejs.org/) with Express
- Hosted on [Render](https://render.com/)

### Database
- [MongoDB](https://www.mongodb.com/)

### Email Service
- [Mailtrap.io](https://mailtrap.io/) (sandbox mode)

---

## 📧 Email Notifications

Emails are sent via Mailtrap with separate templates based on the transaction status:
- **Approved Transaction Email**
  - Includes order number, customer info, product summary
- **Declined/Failed Transaction Email**
  - Includes failure notice and retry/support suggestion

---

## 📂 Folder Structure

```bash
eSalesOne/
├── client/                       # Frontend (Next.js + TypeScript)
│   ├── public/                   # Static assets
│   ├── src/                      # Source files
│   │   ├── app/                  # App directory (routing and pages)
│   │   │   ├── checkout/         # Checkout page
│   │   │   ├── product/          # Dynamic product page ([product_id])
│   │   │   ├── thankYou/         # Thank you page
│   │   │   ├── layout.tsx        # App layout component
│   │   │   └── page.tsx          # Home page
│   │   ├── components/           # Reusable UI components
│   │   └── globals.css           # Global styles
│   ├── .env                      # Environment variables
│   ├── package.json              # Frontend dependencies and scripts
│   └── tsconfig.json             # TypeScript config
│
├── server/                       # Backend (Node.js + Express)
│   ├── src/                      # Server source code
│   │   ├── config/               # Configuration files (e.g., DB, cloud)
│   │   ├── controllers/          # Route controller logic
│   │   │   ├── order.controller.js
│   │   │   ├── product.controller.js
│   │   │   └── transporter.js
│   │   ├── mailer/               # Email templates and logic
│   │   ├── middleware/          
│   │   ├── models/               # Mongoose/Sequelize models (e.g., Product.js)
│   │   ├── routes/               # Express route definitions
│   │   │   ├── orders.js
│   │   │   └── products.js
│   │   ├── templates/            # Email HTML templates
│   │   │   ├── orderConfirmation.html
│   │   │   └── orderFailed.html
│   │   ├── utils/                # Utility functions/helpers
│   │   └── server.js             # Entry point for Express app
│   ├── .env                      # Environment variables
│   ├── package.json              # Backend dependencies and scripts
│   └── index.js                  # Entry point if needed (ref. package.json)
│
├── README.md                     # Project documentation
└── .gitignore                    # Files and folders to ignore in Git
