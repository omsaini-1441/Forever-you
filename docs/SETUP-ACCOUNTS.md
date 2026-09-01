# Account setup — Stripe, Razorpay, MongoDB Atlas

## MongoDB Atlas (you’re on this)

### Dashboard steps
1. Log in at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Wake cluster if it says **Paused** (free tier sleeps after idle time)
3. **Network Access** → Add IP → **Allow Access from Anywhere** (`0.0.0.0/0`) for dev/deploy  
   (or add your home IP + Render’s IP later)
4. **Database Access** → confirm user `omsaini` has read/write on the cluster

### In `Server/.env`
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.foogz.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0
```
Database name is **`e-commerce`** (app uses this).

### Seed Atlas (first time)
```bash
cd Server
npm run seed
```
Uploads images to Cloudinary + inserts 52 products + admin user into Atlas.

### Test connection
```bash
cd Server
npm run server
```
You should see **`DB Connected`**.

---

## Stripe (test mode)

### 1. Create / log in
- [dashboard.stripe.com](https://dashboard.stripe.com)

### 2. Enable test mode
- Toggle **Test mode** ON (top-right)

### 3. Get secret key
- **Developers** → **API keys**
- Copy **Secret key** (`sk_test_...`)

### 4. `Server/.env`
```env
STRIPE_SECRET_KEY=sk_test_xxxxxxxx
```
(`STRIPE_WEBHOOK_SECRET` optional for local — we verify via `/verify` page)

### 5. Restart server
```bash
cd Server && npm run server
```

### 6. Test checkout
1. Client → login → add to cart → **Place Order**
2. Choose **Stripe** → PLACE ORDER
3. Redirected to Stripe Checkout
4. Card: `4242 4242 4242 4242` · any future expiry · any CVC · any ZIP
5. Success → `/verify` → **Orders** (payment Done in admin)

---

## Razorpay (test mode)

### 1. Create / log in
- [dashboard.razorpay.com](https://dashboard.razorpay.com)
- Complete signup (India; test mode works without full KYC for dev)

### 2. Test mode
- Dashboard should show **Test Mode** (toggle if available)

### 3. API keys
- **Settings** → **API Keys** → **Generate / Reveal**
- Copy **Key ID** (`rzp_test_...`) and **Key Secret**

### 4. `Server/.env`
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxx
```

### 5. Restart server

### 6. Test checkout (India test account — no international cards)

**Easiest on desktop:** NetBanking → pick any bank → click **Success** on mock page.

**UPI:** enter `success@razorpay` (works on mobile web / iOS for Collect).

**Domestic test cards only** (not your real foreign card):
| Network | Number |
|---------|--------|
| Visa (domestic) | `4111 1111 1111 1111` |
| Mastercard (domestic) | `5267 3181 8797 5449` |

Any future expiry, any CVV.

> International cards fail with “international cards not supported” — that is normal for Indian Razorpay test mode. Use NetBanking or UPI for demo.

---

## Security

- Never commit `Server/.env`
- If passwords/keys were shared in chat or git history, **rotate** them in Atlas / Stripe / Razorpay dashboards
