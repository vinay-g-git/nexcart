# NexCart — Full-Stack MERN Ecommerce Platform

A complete distributed ecommerce platform built with the MERN stack.

## Stack
- **Frontend**: React 18, React Router v6, Axios, Context API
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB
- **Auth**: Express Session + bcryptjs
- **API**: RESTful with rate limiting

## Services / API Routes

| Service  | Routes |
|----------|--------|
| Auth     | POST /api/auth/register, POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me |
| Products | GET/POST /api/products, GET/PUT/DELETE /api/products/:id, GET /api/products/featured |
| Cart     | GET/POST/DELETE /api/cart, PUT /api/cart/:productId |
| Orders   | GET/POST /api/orders, GET /api/orders/all (admin), PUT /api/orders/:id/status |
| Reviews  | GET /api/reviews/:productId, POST /api/reviews, DELETE /api/reviews/:id |
| Users    | GET /api/users (admin), PUT /api/users/profile, DELETE /api/users/:id |

## Quick Start

### 1. Prerequisites
- Node.js >= 18
- MongoDB running locally (or provide Atlas URI in .env)

### 2. Backend Setup
```bash
cd nexcart/backend
npm install
cp .env.example .env
# Edit .env with your MONGO_URI and SESSION_SECRET
npm run seed        # Seeds database with products and demo users
npm run dev         # Starts backend on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd nexcart/frontend
npm install
cp .env.example .env
npm start           # Starts frontend on http://localhost:3000
```

### 4. Demo Credentials
- **Admin**: admin@nexcart.io / admin123
- **User**: jane@example.com / demo123

## Project Structure

```
nexcart/
├── backend/
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── seed.js             # Database seeder
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Review.js
│   │   └── Cart.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   ├── reviews.js
│   │   └── users.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── reviewController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js             # Session auth middleware
│   │   └── validate.js         # Express-validator helper
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── Navbar.jsx
        │   ├── CartPanel.jsx
        │   ├── AuthModal.jsx
        │   └── ProductCard.jsx
        ├── context/
        │   ├── AuthContext.jsx
        │   ├── CartContext.jsx
        │   └── ToastContext.jsx
        ├── pages/
        │   ├── StorePage.jsx
        │   ├── ProductPage.jsx
        │   ├── CheckoutPage.jsx
        │   ├── OrdersPage.jsx
        │   ├── ProfilePage.jsx
        │   └── AdminPage.jsx
        ├── services/
        │   └── api.js          # Axios API layer
        ├── App.jsx
        ├── index.js
        └── index.css
```

## Features
- ✅ User registration & login (session-based)
- ✅ Product listing with search, filter, sort, pagination
- ✅ Product detail with reviews
- ✅ Shopping cart (persistent per user in MongoDB)
- ✅ Full checkout flow with address + payment method
- ✅ Order history with expandable details
- ✅ Admin dashboard: metrics, product CRUD, order management
- ✅ User profile management
- ✅ Rate limiting on all API routes
- ✅ Input validation on auth routes
