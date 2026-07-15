import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUser } from "./redux/slices/authSlice";

// Layouts
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Public Pages
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Payment from "./pages/customer/Payment";
import ReviewsPage from "./pages/ReviewsPage";

//ADMIN 
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import AdminOrders from "./pages/admin/AdminOrders";
import AddCategory from "./pages/admin/AddCategory";

// CUSTOMER 
import CustomerDashboard from "./pages/CustomerDashboard";
import Shop from "./pages/customer/Shop";
import MyOrders from "./pages/customer/MyOrders";
import Profile from "./pages/customer/Profile";
import OrderTracking from "./pages/customer/OrderTracking";
import Wishlist from "./pages/customer/WishList";

//SELLER
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProducts from "./pages/seller/SellerProducts";
import AddProduct from "./pages/seller/AddProduct";
import SellerOrders from "./pages/seller/SellerOrders";
import EditProduct from "./pages/seller/EditProduct";
import BulkProducts from "./pages/seller/BulkProducts"

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment/:id" element={<Payment />} />

        <Route path="/orders" element={<Orders />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id/reviews" element={<ReviewsPage />} />
      </Route>

      {/* DASHBOARD */}
      <Route path="/dashboard" element={<DashboardLayout />}>

        {/* CUSTOMER */}
        <Route path="customer" element={<CustomerDashboard />} />
        <Route path="shop" element={<Shop />} />
        <Route path="cart" element={<Cart />} />
        <Route path="my-orders" element={<MyOrders />} />
        <Route path="profile" element={<Profile />} />
       <Route path="order/:id" element={<OrderTracking />} />
       <Route path="wishlist" element={<Wishlist />} />

        {/* SELLER */}
        <Route path="seller" element={<SellerDashboard />} />
        <Route path="seller/products" element={<SellerProducts />} />
        <Route path="seller/add-product" element={<AddProduct />} />
        <Route path="seller/orders" element={<SellerOrders />} />
        <Route
          path="seller/edit-product/:id"
          element={<EditProduct />}
        />

         <Route path="seller/bulk-product" element={< BulkProducts/>} />

        {/* ADMIN */}
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/users" element={<Users />} />
        <Route path="admin/orders" element={<AdminOrders />} />
        <Route path="admin/categories" element={<AddCategory />} />

      </Route>

      {/* 404  */}
      <Route
        path="*"
        element={
          <div className="flex items-center justify-center min-h-screen text-2xl font-bold">
            404 - Page Not Found.
          </div>
        }
      />
    </Routes>
  );
}

export default App;