# 🛍️ Multi-Vendor E-Commerce Platform

This is a complete multi-vendor e-commerce platform where vendors can create stores, add product categories, manage items, and track sales. Admins can monitor vendors, stores, orders, revenue trends, and customer activity.

---

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB (via Atlas or local)
- **Authentication**: Custom login (admin & vendor)
- **State Management**: React Hooks + LocalStorage
- **Deployment Ready**: Production build optimized

---

## 🔑 Features

### 👤 Customer Panel

- Register/Login (local state)
- Browse products
- Add to cart & checkout
- View past orders
- Manage wishlist

### 🏪 Vendor Panel

- Create store with categories
- Add, update, delete products
- View orders placed in their store

### 🛠️ Admin Panel

- Login with secure cookie session
- View all users and vendors
- Monitor stores and item counts
- Analyze orders, revenue, and top vendors
- Logout with cookie cleanup

---

## 📁 Folder Structure

```bash
src/
├── app/
│   ├── api/                      # All backend routes (e.g. login, orders, store)
│   ├── admin/                    # Admin dashboard UI pages
│   ├── store/                    # Vendor pages (Add/View/Update Items)
│   ├── components/               # Shared UI components (chatbot, sidebar, etc.)
│   └── product/[id]/             # Dynamic product page with image viewer
├── lib/                          # MongoDB connection config
```
