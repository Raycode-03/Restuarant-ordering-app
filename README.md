🍽️ Restaurant Ordering App (Draft README)

Status: In active development 🚧
This README documents what is already implemented, what is partially implemented, and what is planned.

📌 Overview

This is a table-based restaurant ordering system with:

Admin & staff management

Session-based user flow (no traditional user accounts)

QR code–based table access

Background jobs for non-blocking tasks (emails)

Menu browsing with filtering and pagination

Frontend handling of unavailable items

The app is designed to scale later to mobile apps via API.

👥 Roles & Access Levels
1. Admin

Admins have full control over the system.

Implemented / In Progress:

View admin stats (basic)

Activate or deactivate staff accounts

Receive notifications when staff request activation

Change the shared password used by customers to access checkout

Generate downloadable QR codes for tables

Create, update, and manage menu items

API routes for menus with pagination and transformation

Planned:

More advanced admin analytics

Extended admin settings

Role-based API access for staff and customers

2. Staff

Staff accounts are inactive by default.

Flow:

Staff can sign up / log in

If inactive, they can click “Contact Admin”

This sends a notification to admins:

“Activate my account”

Admin manually activates the staff account

Rules:

The first admin can create other admins

Admins control who is active/inactive

3. Customers (Users)

Customers do not create accounts.

Implemented:

Session-based access tied to a table

Menu browsing with:

Pagination

Filter by veg / non-veg / others

Frontend hiding of unavailable items

Add items to cart (UI only, checkout flow planned)

Toast notifications for session start, menu load errors

🔐 Authentication & Sessions
Session-Based Access

Users access the app via QR code or manual URL

Sessions track activity and table association

Session creation handled via frontend React Query + API

API ensures table number is valid and session is unique

Inactivity Handling

If a user is inactive for a defined period:

Session is marked inactive in the database

Session eventually expires

Current Thresholds:

activityThrottle = 2 * 60 * 1000 → 2 minutes

INACTIVITY_THRESHOLD = 15 * 60 * 1000 → 15 minutes

If session expires for 1 hour, it is fully invalidated

⚙️ Background Jobs

The app uses background jobs to avoid blocking requests.

Implemented:

Email sending runs in the background

Signup / activation notifications

No waiting for email before continuing user flow

This improves:

Performance

User experience

📷 QR Code System

Implemented:

Admin can generate QR codes in bulk (e.g., 30 tables)

Admin can download QR code images

QR codes are placed on physical tables

Customer Access Options:

Scan QR code with camera

OR manually visit the landing page (for devices without cameras)

⚠️ Note:

Manual landing page flow is planned but not implemented yet

🛠️ Menu & Ordering Features

Implemented:

API route for fetching menus (/api/users/menu/getmenus) with:

Pagination (limit & offset)

Transformation (id → _id) to match frontend

Frontend:

Session-aware menu loading

Loading skeleton (BooksSkeleton) for menus

Pagination controls with Next / Prev

Filter buttons for veg, non-veg, all

Automatic hiding of unavailable items

Responsive grid display

Toast notifications for errors (session or menu fetch)

MediaDisplay component supports images/videos per menu item

Partially Implemented / Planned:

Full cart management (currently UI only)

Checkout flow with payment integration

Advanced filtering (by category, price, vegan/vegetarian, etc.)

🔑 Checkout Security

Admin sets a shared checkout password

Customers must enter this password before checkout

Admin can change this password anytime via settings

🧱 Tech Notes (High Level)

Frontend: Next.js / React

Backend: API routes (Node.js / Next.js)

Database: Supabase (with RLS policies)

Background processing: async jobs / cron-style logic

State management: React Query

Notifications: Sonner toast

UI Components: Custom + Radix/Next UI

🚧 What’s NOT Done Yet

Full checkout/payment integration

Manual landing page without QR

Full admin analytics dashboard

Advanced staff permissions

Mobile app integration

🛣️ Roadmap (Short-Term)

Improve admin stats

Harden session expiration logic

Finish manual table access flow

Extend frontend filters (categories, vegan, price range)

Prepare API for mobile app usage

✍️ Notes

This README will evolve as the app grows.

Some features are intentionally simple now to allow fast iteration.

The app uses React Query hooks for data fetching and caching, and handles errors gracefully via toast notifications.

Author: Akerele Raymond