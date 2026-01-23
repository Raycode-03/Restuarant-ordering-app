# 🍽️ Restaurant Ordering App (Draft README)

> **Status:** In active development 🚧
> This README documents what is **already implemented**, what is **partially implemented**, and what is **planned**.

---

## 📌 Overview

This is a **table-based restaurant ordering system** with:

* Admin & staff management
* Session-based user flow (no traditional user accounts)
* QR code–based table access
* Background jobs for non-blocking tasks (emails)

The app is designed to scale later to **mobile apps via API**.

---

## 👥 Roles & Access Levels

### 1. Admin

Admins have full control over the system.

**Implemented / In Progress:**

* View admin stats (basic)
* Activate or deactivate staff accounts
* Receive notifications when staff request activation
* Change the **shared password** used by customers to access checkout
* Generate downloadable QR codes for tables

**Planned:**

* More advanced admin analytics
* Extended admin settings

---

### 2. Staff

Staff accounts are **inactive by default**.

**Flow:**

1. Staff can **sign up / log in**
2. If inactive, they can click **“Contact Admin”**
3. This sends a notification to admins:

   > “Activate my account”
4. Admin manually activates the staff account

**Rules:**

* The **first admin** can create other admins
* Admins control who is active/inactive

---

### 3. Customers (Users)

Customers do **not create accounts**.

They interact with the app using **sessions** tied to a table.

---

## 🔐 Authentication & Sessions

### Session-Based Access

* Users access the app via **QR code** or **manual URL**
* Sessions track activity and table association

### Inactivity Handling

* If a user is inactive for a defined period:

  * Session is marked **inactive** in the database
  * Session eventually expires

**Current Thresholds:**

* `activityThrottle = 2 * 60 * 1000` → **2 minutes**
* `INACTIVITY_THRESHOLD = 15 * 60 * 1000` → **15 minutes**
* If session expires for **1 hour**, it is fully invalidated

---

## ⚙️ Background Jobs

The app uses **background jobs** to avoid blocking requests.

**Implemented:**

* Email sending runs in the background

  * Signup / activation notifications
  * No waiting for email before continuing user flow

This improves:

* Performance
* User experience

---

## 📷 QR Code System

**Implemented:**

* Admin can generate QR codes in bulk (e.g., 30 tables)
* Admin can **download QR code images**
* QR codes are placed on physical tables

**Customer Access Options:**

* Scan QR code with camera
* OR manually visit the landing page (for devices without cameras)

⚠️ **Note:**

* Manual landing page flow is **planned but not implemented yet**

---

## 🔑 Checkout Security

* Admin sets a **shared checkout password**
* Customers must enter this password before checkout
* Admin can change this password anytime via settings

---

## 🧱 Tech Notes (High Level)

* Frontend: **Next.js / React**
* Backend: API routes (Node.js)
* Database: Supabase (with RLS policies)
* Background processing: async jobs / cron-style logic

---

## 🚧 What’s NOT Done Yet

* Manual landing page without QR
* Full admin analytics dashboard
* Advanced staff permissions
* Mobile app integration

---

## 🛣️ Roadmap (Short-Term)

* Improve admin stats
* Harden session expiration logic
* Finish manual table access flow
* Prepare API for mobile app usage

---

## ✍️ Notes

This README will evolve as the app grows.
Some features are intentionally simple now to allow fast iteration.

---

**Author:** Akerele Raymond
