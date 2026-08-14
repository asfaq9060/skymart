# SKY Mart

## Run the backend

The API is an Express server backed by MongoDB. Its initial product catalogue is inserted into MongoDB the first time it starts; React does not contain product data.

1. Install and start [MongoDB Community Server](https://www.mongodb.com/try/download/community), or use a MongoDB Atlas connection string.
2. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI` if necessary.
3. Run:

```powershell
cd backend
npm install
npm run dev
```

The API runs at `http://localhost:5000`. To reseed or update the catalogue intentionally, run `npm run seed` from `backend`.

## Run the frontend

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

The frontend fetches `GET /api/products` from the backend. To use another API host, create `frontend/.env.local` with:

```env
VITE_API_URL=http://your-api-host:5000
```

## API routes

- `GET /api/health`
- `GET /api/products`
- `GET /api/products?category=women|men|kid`
- `GET /api/products/:productId`

`GET /api/products` accepts `category=women|men|kid`, `sort=featured|price_asc|price_desc`, and `limit=1..100`.

## Accounts, coupons, and checkout

The API supports account registration, login, coupon validation, and authenticated order checkout. Set a long, private `JWT_SECRET` in `backend/.env` before deploying.

New accounts must verify a six-digit email code before they can log in. For Gmail delivery, enable 2-Step Verification and create a Gmail App Password, then set `GMAIL_USER` and `GMAIL_APP_PASSWORD` in `backend/.env`.


- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/products` (admin only)
- `PATCH /api/products/:productId` (admin only; updates prices)
- `DELETE /api/products/:productId` (admin only)
- `POST /api/coupons/validate`
- `POST /api/newsletter/subscribe`
- `POST /api/orders/checkout` (requires `Authorization: Bearer <token>`)
- `GET /api/orders/:orderId` (requires `Authorization: Bearer <token>`)

Development coupons seeded into MongoDB:

- `WELCOME10`: 10% off orders of ₹999 or more, up to ₹500.
- `SAVE200`: ₹200 off orders of ₹1,499 or more.

Checkout creates an order only; connect a payment provider such as Razorpay or Stripe before using it to collect payments in production.

## Administrator access

All new accounts are customers by default. Register and log in once, then promote the account from the backend directory:

```powershell
npm run make-admin -- your-email@example.com
```

Log out and back in after promotion. Administrators can open `/admin`, log in if asked, then add products, update prices, or delete products.
