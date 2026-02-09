# LOCAL vs DEV Profiles Guide

## Overview

The application supports two development profiles:

### LOCAL Profile (Default)
- **Purpose:** Quick local testing without backend setup
- **Data Source:** Mock data (hardcoded in-memory)
- **Database:** None required
- **Backend:** Not needed
- **Use Case:** Rapid UI development, testing without infrastructure

### DEV Profile
- **Purpose:** Full-stack development with real backend
- **Data Source:** MongoDB (cloud)
- **Database:** MongoDB Atlas (cloud)
- **Backend:** Node.js + Express required
- **Use Case:** Testing full functionality, integration testing

---

## Quick Start

### LOCAL Profile (No Setup Required)

```bash
cd Frontend/frontend

# Option 1: Default (local enabled)
npm run dev

# Option 2: Explicit local mode
npm run dev:local
```

**That's it!** Application loads with mock data immediately.

---

### DEV Profile (With MongoDB Backend)

**Step 1: Start Backend**
```bash
cd Backend
npm start           # Starts server on port 5000
```

**Step 2: Start Frontend** (in new terminal)
```bash
cd Frontend/frontend
npm run dev:dev     # Connects to backend
```

---

## Feature Comparison

| Feature | LOCAL | DEV |
|---------|-------|-----|
| **Setup Time** | ~5 seconds | ~2 minutes |
| **Data Persistence** | Session only | Permanent (DB) |
| **Backend Required** | No | Yes |
| **Database Required** | No | Yes |
| **Real Authentication** | Mock | Real bcrypt |
| **Products** | 15 fixed | 15 from database |
| **Users** | 2 demo | Multiple |
| **Orders** | 2 mock | Real |
| **Full Testing** | Basic UI | Complete flow |

---

## LOCAL Profile Details

### What You Get
- 15 pre-loaded products
- 2 demo user accounts
- Instant loading (simulated delay only)
- Mock orders functionality
- Search/filter working
- Cart persistence in localStorage  

### Demo Accounts

```
Account 1:
  Email: demo@myntra.com
  Password: (any password works)

Account 2:
  Email: test@example.com
  Password: (any password works)
```

### Mock Data Files

- **Products:** `src/services/mockData.js` (15 items)
- **Users:** 2 demo accounts in mockData.js
- **Orders:** 2 sample orders in mockData.js
- **API Service:** `src/services/mockApi.js`

### How It Works

1. API requests are intercepted in `api.js`
2. Checks `VITE_MODE=local` environment variable
3. Routes to `mockApi.js` instead of backend
4. Mock service simulates delays (200-500ms)
5. Returns mock data as if from real API

### Adding Mock Products

Edit `src/services/mockData.js`:
```javascript
export const mockProducts = [
    {
        _id: 'unique-id',
        name: 'Product Name',
        price: 999,
        // ... other fields
    }
];
```

---

## DEV Profile Details

### What You Get
- Real MongoDB backend
- bcrypt password hashing
- Real user registration
- User-specific carts
- Persistent orders
- Full feature testing
- Production-like environment  

### Initial Setup

```bash
# 1. Start backend (in terminal)
cd Backend
npm start

# 2. In new terminal, start frontend
cd Frontend/frontend
npm run dev:dev
```

### Demo Account

```
Email: demo@myntra.com
Password: Demo@123
```

### MongoDB Connection

Connection string in `Backend/.env`:
```
MONGO_URI=mongodb+srv://keshchaurasiya448_db_user:448449447@cluster0.gnsqwmi.mongodb.net/?appName=Cluster0
```

### Data Structure

**MongoDB Collections:**
- `users` - User accounts with bcrypt hashed passwords
- `products` - Product catalog
- `carts` - 1:1 relationship with users
- `orders` - User orders
- `orderitems` - Items in each order
- `cartitems` - Items in each cart

---

## Environment Variables

### .env.local
```env
VITE_MODE=local
VITE_API_URL=http://localhost:5000/api
```

### .env.dev
```env
VITE_MODE=dev
VITE_API_URL=http://localhost:5000/api
```

### Backend .env
```env
MONGO_URI=mongodb+srv://keshchaurasiya448_db_user:448449447@cluster0.gnsqwmi.mongodb.net/?appName=Cluster0
PORT=5000
NODE_ENV=development
```

---

## Switching Between Profiles

### From LOCAL to DEV

```bash
# Currently running LOCAL
npm run dev:local

# Switch to DEV (Ctrl+C to stop)
# Make sure backend is running!
npm run dev:dev
```

### From DEV to LOCAL

```bash
# Currently running DEV
npm run dev:local
```

No backend needed - all features work with mock data.

---

## Testing Workflows

### Workflow 1: Quick UI Testing (LOCAL)

```bash
npm run dev
# - Make UI changes
# - See instant results
# - No backend needed
# - Perfect for rapid development
```

### Workflow 2: Full Feature Testing (DEV)

```bash
# Terminal 1: Backend
cd Backend && npm start

# Terminal 2: Frontend
cd Frontend/frontend && npm run dev:dev

# Test complete user journey:
# - Login with real credentials
# - Add products to cart
# - Place orders
# - View order history
```

### Workflow 3: Multi-User Testing (DEV only)

```bash
# LOCAL: Can't test multiple users (only 2 fixed demo accounts)
# DEV: Can register unlimited users

# Terminal 1: Backend running

# Terminal 2: Frontend
npm run dev:dev

# Test with:
# - Login as demo@myntra.com
# - Register new user
# - Switch users (logout/login)
# - Verify isolated carts/orders
```

---

## Console Output

### LOCAL Mode
```
API Mode: LOCAL (Mock Data)
Mock data loaded - Local profile initialized
```

### DEV Mode
```
API Mode: DEV (MongoDB Backend)
```

---

## Troubleshooting

### LOCAL Profile Issues

**Q: Products not showing?**
- Check browser console for errors
- Ensure `mockData.js` exists in `src/services/`
- Verify `VITE_MODE=local` in `.env.local`

**Q: Login not working?**
- Use any email/password for LOCAL
- Password doesn't matter in mock mode
- Check `.env.local` has `VITE_MODE=local`

---

### DEV Profile Issues

**Q: Backend won't start?**
- Check MongoDB connection in `.env`
- Verify port 5000 is available

**Q: Frontend can't connect to backend?**
- Ensure backend is running on port 5000
- Check `.env.dev` has `VITE_MODE=dev`
- Run `npm run dev:dev` (not `npm run dev`)

**Q: "Products not found" error?**
- Verify MongoDB connection string
- Check that products exist in database
- Restart backend: `npm start`

---

## Performance Notes

### LOCAL Profile
- Instant responses (simulated 200-500ms delay)
- No network latency
- Lightweight, runs in browser memory
- Data lost on page refresh

### DEV Profile
- Real network requests
- Data persists across sessions
- Production-like experience
- Depends on backend/MongoDB availability
- Slightly slower (network latency)

---

## Commands Reference

```bash
# LOCAL Profile
npm run dev              # Default (LOCAL)
npm run dev:local       # Explicit local
npm run build           # Build for production

# DEV Profile
npm run dev:dev         # With backend
npm run dev:dev:build   # Build for dev

# Backend
cd Backend
npm start               # Start server
npm run dev             # Start with nodemon

# Both profiles
npm run preview         # Preview production build
npm run lint            # Lint code
```

---

## Best Practices

**Use LOCAL for:**
- Rapid UI development
- Testing components in isolation
- No backend setup needed
- Quick prototyping

**Use DEV for:**
- Testing complete user flows
- Integration testing
- Testing with real data
- Multi-user scenarios
- Before production deployment

---

## Next Steps

1. **Try LOCAL first** - `npm run dev` - Takes 5 seconds
2. **Explore mock data** - `src/services/mockData.js`
3. **Try DEV** - Start backend, run `npm run dev:dev`
4. **Compare experiences** - Switch between profiles
5. **Build features** - Local for UI, DEV for integration

---

**Ready to develop!**

