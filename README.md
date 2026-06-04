# BillStack – GST Inventory & Billing SaaS

A modern full-stack SaaS application designed for small and medium businesses to manage inventory, customers, GST invoices, stock tracking, and business analytics.

Built with **React.js**, **Laravel REST API**, **Laravel Sanctum**, and **MySQL**.

---

## 🚀 Overview

BillStack streamlines business operations by combining inventory management, customer management, GST-compliant invoicing, stock monitoring, and reporting into a single platform.

The application supports secure authentication, role-based access control, automated stock deduction, PDF invoice generation, and real-time business insights.

---

## ✨ Key Features

### Authentication & Security

* Secure Authentication using Laravel Sanctum
* Token-Based API Authentication
* Role-Based Access Control (Admin, Manager, Customer)

### Inventory Management

* Product Management (CRUD)
* Category Management
* Automatic Stock Tracking
* Low Stock Alerts
* Stock Movement Logs

### Customer Management

* Customer Profiles
* Customer Invoice History
* Customer Portal Access

### GST Billing System

* GST Invoice Generation
* Tax & Discount Calculation
* Multiple Invoice Items
* Automatic Stock Deduction
* PDF Invoice Download

### Business Management

* Business Profile Settings
* Company Logo Management
* Signature Upload Support

### Dashboard & Reports

* Sales Analytics Dashboard
* Revenue Statistics
* Inventory Insights
* Business Reports
* Interactive Charts using Recharts

### User Experience

* Responsive Design
* Modern UI with Tailwind CSS
* Mobile-Friendly Interface
* Fast Single Page Application (SPA)

---

## 🛠 Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* Recharts
* jsPDF

### Backend

* Laravel
* Laravel Sanctum
* REST API Architecture
* Eloquent ORM

### Database

* MySQL

---

## 🏗 Architecture

Frontend (React.js)
↓
REST API Communication
↓
Laravel Backend
↓
MySQL Database

---

## 📊 Database Design

Core Tables:

* users
* roles
* customers
* categories
* products
* invoices
* invoice_items
* stock_logs
* business_settings

---

## 🔄 Invoice Workflow

1. Select Customer
2. Add Products to Invoice
3. Calculate GST and Discounts
4. Generate Invoice
5. Deduct Product Stock Automatically
6. Create Stock Log Entry
7. Download PDF Invoice

---

## ⚙️ Installation

### Backend Setup

```bash
git clone https://github.com/your-username/billstack.git

cd backend

composer install

cp .env.example .env

php artisan key:generate

php artisan migrate

php artisan serve
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## 📸 Planned Enhancements

* Email Invoice Delivery
* Multi-Tenant SaaS Support
* Subscription Billing
* QR Code Invoice Verification
* Advanced Reporting
* Payment Gateway Integration

---

## 👨‍💻 Developer

**Ravikiran G Mailar**
Full Stack Developer

**Skills:** Laravel, Livewire, React.js, REST APIs, MySQL, WordPress, JavaScript

LinkedIn: https://linkedin.com/in/ravi-kiran-1a7010247

---

## 📄 License

This project is developed for portfolio, and commercial SaaS learning purposes.
