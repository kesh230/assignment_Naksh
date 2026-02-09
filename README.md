# ShopHub - Full Stack E-Commerce Application

A complete full-stack e-commerce platform similar to Myntra, built with **React + Vite + Tailwind CSS** (Frontend) and **Node.js + Express + MongoDB** (Backend).

## Project Structure

```
Naksh_assignment/
├── Backend/
│   ├── src/
│   │   ├── app.js                 # Express app with all routes
│   │   ├── controllers/           # Route handling logic
│   │   ├── services/              # Business logic
│   │   ├── models/                # MongoDB schemas
│   │   └── db/                    # Database connection
│   ├── server.js                  # Server entry point
│   ├── package.json
│   ├── .env                       # Environment variables
│   └── API_ENDPOINTS_DOCUMENTATION.md
│
└── Frontend/
    └── frontend/
        ├── src/
        │   ├── pages/             # React pages
        │   ├── components/        # Reusable components
        │   ├── context/           # Context API (Auth, Cart)
        │   ├── services/          # API calls
        │   ├── App.jsx            # Main app component
        │   └── main.jsx           # React entry point
        ├── index.html
        ├── package.json
        ├── vite.config.js
        └── tailwind.config.js
```

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud)

### Step 1: Setup Backend

```bash
cd Backend
npm install
```

**Configure .env file:**
```env
MONGO_URI=mongodb+srv://username:password@cluster0.gnsqwmi.mongodb.net/?appName=Cluster_name
PORT=5000
NODE_ENV=development
```

**Start Backend:**
```bash
npm start
# or for development with auto-reload:
npm run dev
```

Backend will run on `http://localhost:5000`

### Step 2: Setup Frontend

```bash
cd Frontend/frontend
npm install
```

**Start Frontend (Development):**
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## Features

### Shopping Features
- Browse all products with pagination
- Search products by name, description, category
- View product details with popularity stats
- Check product stock availability
- Filter by categories (Men, Women, Kids, Electronics, Accessories, Home)

### Cart Management
- Add products to cart (with local storage persistence)
- Update item quantities
- Remove items from cart
- Clear entire cart
- View cart summary with total amount
- Real-time cart item count in navbar

### Checkout and Orders
- Direct product ordering (without cart dependency)
- Delivery address form
- Multiple payment methods (Card, UPI, NetBanking, COD)
- Order confirmation with order ID
- Automatic product stock reduction
- MongoDB transaction support for data consistency

### User Authentication
- User registration with validation
- Login with email/password
- Session persistence using localStorage
- User profile management
- View order history
- Track orders

### Database Relationships
The backend implements all 6 normalized database relationships:

1. **Users (1:N) Products** - One seller creates many products
2. **Users (1:1) Cart** - One user has one cart (unique constraint)
3. **Cart (1:N) CartItems** - One cart has many items
4. **Products (1:N) CartItems** - One product in many carts
5. **Users (1:N) Orders** - One user places many orders
6. **Orders (1:N) OrderItems** - One order has many items

### User Interface
- Myntra-like modern design
- Responsive grid layout
- Smooth animations and transitions
- Tailwind CSS styling
- Dark navbar with topbar
- Product cards with images, prices, ratings
- Shopping cart sidebar
- User profile dropdown
- Order tracking page

## API Endpoints

### Key API Endpoints Used:

**Products:**
- `GET /api/product` - Get all products
- `GET /api/product/search?query=...` - Search products
- `GET /api/product/:productId` - Get product details
- `GET /api/product/stock/check` - Check stock availability

**Cart:**
- `GET /api/cart/:userId` - Get user's cart
- `POST /api/cart/:userId/add` - Add to cart
- `PUT /api/cart/:userId/update` - Update quantity
- `DELETE /api/cart/:userId/remove` - Remove item

**Orders:**
- `POST /api/order/:userId` - Create order with products
- `GET /api/order/:userId` - Get user orders
- `GET /api/order/:userId/:orderId` - Get order details
- `GET /api/order/:orderId/items` - Get order items

**Auth:**
- `POST /api/auth/register` - Register user

For complete API documentation, see Backend/API_ENDPOINTS_DOCUMENTATION.md

---

## Frontend Technologies

- React 19 - UI framework
- React Router DOM - Navigation
- Axios - HTTP client for API calls
- Tailwind CSS - Utility-first CSS framework
- Vite - Fast build tool
- Context API - State management (Auth, Cart)

## Frontend Project Structure

### Pages (in src/pages/)
- Products.jsx - Product listing with search and pagination
- ProductDetail.jsx - Individual product page with details
- Cart.jsx - Shopping cart with items management
- Checkout.jsx - Order creation with address and payment
- OrderSuccess.jsx - Order confirmation page
- Orders.jsx - User's order history
- Profile.jsx - User profile information
- Register.jsx - User registration
- Login.jsx - User login

### Components (in src/components/)
- Navbar.jsx - Top navigation with search, profile, cart
- Footer.jsx - Footer with links

### Context Management (in src/context/)
- AuthContext.jsx - User authentication state
- CartContext.jsx - Shopping cart state with localStorage

### API Services (in src/services/)
- api.js - Centralized API calls using Axios
- mockApi.js - Mock API responses for offline development
- mockData.js - 15 hardcoded products and demo users

## Authentication

The frontend includes a mock authentication system:

**Test Credentials:**
- Email: `demo@example.com`
- Password: `demo123`

In production, replace the mock authentication in `Login.jsx` with actual backend API calls.

## Backend Project Structure

### Main Files
- server.js - Express server entry point
- src/app.js - Express application with all routes and middleware
- .env - Environment variables (MongoDB URI, port, etc.)

### Controllers (in src/controllers/)
Handle HTTP request/response:
- authController.js - User registration and login
- productController.js - Product CRUD operations and search
- cartController.js - Cart management endpoints
- orderController.js - Order creation and retrieval

### Models (in src/models/)
MongoDB schemas (Mongoose):
- User.js - User accounts with bcrypt password hashing
- Product.js - Product catalog with seller reference
- Cart.js - User shopping cart (1:1 with User)
- CartItem.js - Items in shopping carts (1:N with Cart)
- Order.js - User orders with status tracking
- OrderItem.js - Items in each order (1:N with Order)

### Services (in src/services/)
Business logic layer:
- userService.js - Registration, login, password verification
- productService.js - Product search, retrieval, stock checking
- cartService.js - Add/remove/update cart operations
- orderService.js - Order creation with transaction support

### Database
- src/db/db.js - MongoDB connection setup

## Backend Technologies

- Node.js - JavaScript runtime
- Express - Web framework
- MongoDB - NoSQL database
- Mongoose - MongoDB ODM
- bcryptjs - Password hashing
- jsonwebtoken - JWT token generation

## Feature Details

### Product Loading
- Loads 20 products per page
- "Load More" button for pagination
- Search displays filtered results
- Shows product stock status

### Cart Management
- Stores cart in LocalStorage (persists after refresh)
- Real-time total calculation
- Prevents ordering more than available stock
- Shows clear "Out of Stock" message

### Checkout Flow
1. User clicks "Proceed to Checkout"
2. Fills delivery address form
3. Selects payment method
4. System creates order directly with selected products
5. Products stock is automatically reduced
6. OrderItems are created for each product
7. User redirected to success page

### Order Tracking
- View all user orders
- See order status (Pending, Confirmed, Shipped, Delivered)
- Click order to view items
- Track payment and delivery info

---

## Development Tips

### Making API Calls
```javascript
import { productAPI, cartAPI, orderAPI } from './services/api';

// Search products
const response = await productAPI.searchProducts('iPhone', 20, 0);

// Add to cart
await cartAPI.addToCart(userId, productId, quantity);

// Create order
await orderAPI.createOrder(userId, products);
```

### Using Context
```javascript
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';

const { user, login, logout, isAuthenticated } = useAuth();
const { cartItems, addToCart, removeFromCart } = useCart();
```

### Adding New Routes
Edit `src/App.jsx` Routes section:
```jsx
<Route path="/new-page" element={<NewComponent />} />
```

---

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/shophub
PORT=5000
NODE_ENV=development
```

### Frontend (vite.config.js)
API base URL is set in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

---

## Troubleshooting

### CORS Errors
Resolved - Backend has CORS middleware enabled

### Package Installation Issues
- Clear cache: `npm cache clean --force`
- Delete `node_modules`: `rm -rf node_modules`
- Reinstall: `npm install`

### MongoDB Connection Failed
- Ensure MongoDB is running locally or provide valid connection URI
- Check `.env` file for correct `MONGODB_URI`

### Frontend Port Already in Use
- Vite uses port 5173 by default
- Change in `vite.config.js` if needed

---

## Build & Production

### Build Frontend
```bash
cd Frontend/frontend
npm run build
```

Creates optimized production build in `dist/` folder.

### Deploy
- Backend: Deploy to Heroku, Railway, or host on your server
- Frontend: Deploy to Vercel, Netlify, or any static hosting

---

## Database Schema

### Users
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  phone: String,
  address: String,
  createdAt: Date
}
```

### Products
```javascript
{
  _id: ObjectId,
  userId: ObjectId (seller),
  name: String,
  description: String,
  price: Number,
  quantity: Number,
  category: String,
  imageUrl: String,
  createdAt: Date
}
```

### Orders
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  totalAmount: Number,
  status: String (pending/confirmed/shipped/delivered),
  createdAt: Date
}
```

### OrderItems
```javascript
{
  _id: ObjectId,
  orderId: ObjectId,
  productId: ObjectId,
  quantity: Number,
  unitPrice: Number,
  subtotal: Number
}
```
### Carts 
```javascript
{
  _id: ObjectId,
  userId: ObjectId,        // Reference to Users (_id)
  totalItems: Number,      // Total distinct items in cart
  totalAmount: Number,    // Calculated cart total
  createdAt: Date,
  updatedAt: Date
}
```
### CartItems
```javascript
{
  _id: ObjectId,
  cartId: ObjectId,        // Reference to Cart (_id)
  productId: ObjectId,     // Reference to Products (_id)
  quantity: Number,
  priceAtAdd: Number,     // Product price when added to cart
  subtotal: Number,      
  createdAt: Date
}

---

## License

This project is open source and available under the MIT License.

---

## Contributing

Contributions are welcome! Feel free to fork and submit pull requests.

---

## Support

For issues or questions, please check the [API Documentation](Backend/API_ENDPOINTS_DOCUMENTATION.md) or create an issue in the repository.

---

**Happy Shopping!**
