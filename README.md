# Moms Taste - Full Stack App

Moms Taste is a family-oriented food ordering platform where parents can send sweets and snacks to children studying in different cities.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express.js (MVC)
- Database: MongoDB + Mongoose
- Auth: JWT
- Payments: Razorpay
- Realtime updates: Socket.IO

## Folder Structure

- `backend/` - API server, models, controllers, routes, middleware, seed
- `frontend/` - React app with role dashboards and responsive pages

## Backend Setup

1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env`
4. Update values in `.env`
5. Seed sample data: `npm run seed`
6. Start API server: `npm run dev`

Backend runs on `http://localhost:5000`

## Frontend Setup

1. Open a new terminal
2. `cd frontend`
3. `npm install`
4. Copy `.env.example` to `.env`
5. Start app: `npm run dev`

Frontend runs on `http://localhost:5173`

## Sample Accounts (after seed)

- Admin: `admin@momstaste.com` / `Admin@123`
- Parent: `parent@momstaste.com` / `Parent@123`
- Shop Owner: `shop@momstaste.com` / `Shop@123`

## Implemented Features

### Authentication

- Parent registration/login
- Shop owner registration/login
- JWT-protected APIs
- Role-based route protection

### Parent

- Child profile CRUD
- City-wise approved shops list
- Browse menus and add to cart
- Emotional message with order
- Scheduled delivery datetime
- Place order + Razorpay payment flow
- Track order status
- Receive notifications

### Shop Owner

- Shop profile management
- Menu item management
- Incoming order list
- Accept/reject/update order status
- Delivery method selection support

### Admin

- Pending shop approvals
- Approve/reject shops
- Analytics dashboard (users, shops, orders, revenue)

### Order & Delivery

- Orders linked with parent, child, and shop
- Fixed hostel delivery details from child profile
- Status timeline and realtime status events

## Important API Endpoints

- `POST /api/auth/register/parent`
- `POST /api/auth/register/shop-owner`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/parent/children`
- `POST /api/parent/orders`
- `POST /api/payment/create-order`
- `POST /api/payment/verify`
- `GET /api/shop/orders`
- `PATCH /api/shop/orders/:orderId/status`
- `GET /api/admin/analytics`

## Notes for Production

- Replace test JWT secret and Razorpay keys
- Add image upload service (S3/Cloudinary)
- Add robust retry and job queue for notifications
- Add unit/integration tests and API rate-limits
- Add Redis caching for scale
