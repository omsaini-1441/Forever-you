# Deploy env guide

Vercel hosts **static frontends only** (Client + Admin). The **Express API does not run on Vercel**.

## Vercel — Client project (`forever-you-seven`)

**Site:** https://forever-you-seven.vercel.app

| Variable | Value |
|----------|--------|
| `VITE_BACKEND_URL` | `https://YOUR_RENDER_SERVICE.onrender.com` |

Apply to **Production**, **Preview**, and **Development** on Vercel (or at least Production).

Redeploy after changing (Vite bakes env at build time).

Root directory: `Client`

## Vercel — Admin project (second project, same repo)

| Variable | Example |
|----------|---------|
| `VITE_BACKEND_URL` | `https://your-api.onrender.com` |

Root directory: `Admin`

## Render / Railway — Server

Set **all** of these on the API host (not Vercel):

```
PORT=4000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
CLIENT_URL=https://forever-you-seven.vercel.app
ADMIN_URL=https://your-admin.vercel.app
BACKEND_URL=https://your-api.onrender.com
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
```

`CLIENT_URL` and `ADMIN_URL` must match your Vercel URLs exactly (CORS in production).

Run seed once against production Atlas from Render shell:
```bash
npm run seed
```

## Quick check

- Client loads products → `VITE_BACKEND_URL` correct + API up
- Login fails with CORS → fix `CLIENT_URL` on Server
- Admin fails → fix `ADMIN_URL` on Server
