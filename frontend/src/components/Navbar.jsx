import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  const cartCount = items?.length || 0;

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-md border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-50">

      
      <Link
        to="/"
        className="text-2xl font-extrabold text-blue-600 tracking-wide"
      >
        🛍️ E-Shop
      </Link>

      
      <div className="flex items-center gap-5">

        <Link
          to="/"
          className="text-gray-700 hover:text-blue-600 font-medium transition"
        >
          Home
        </Link>

        
        {user?.role === "customer" && (
          <>
            <Link
              to="/dashboard/customer"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Customer-Panel
            </Link>

            <Link
              to="/dashboard/shop"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Shop
            </Link>

            
            <Link
              to="/dashboard/cart"
              className="relative text-gray-700 hover:text-blue-600 font-medium transition"
            >
              🛒 Cart

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </>
        )}

        
        {user?.role === "seller" && (
          <Link
            to="/dashboard/seller"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Seller-Panel
          </Link>
        )}

        
        {user?.role === "admin" && (
          <Link
            to="/dashboard/admin"
            className="text-gray-700 hover:text-blue-600 font-semibold transition"
          >
            Admin-Panel
          </Link>
        )}

        
        {user ? (
          <div className="flex items-center gap-3 ml-4">

            
            <span className="text-sm font-semibold text-gray-800">
              👤 {user.name}
            </span>

            
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                user.role === "admin"
                  ? "bg-red-100 text-red-600"
                  : user.role === "seller"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {user.role}
            </span>

            
            <button
              onClick={handleLogout}
              className="bg-linear-to-r from-red-500 to-red-600 text-white px-4 py-1.5 rounded-lg hover:shadow-lg hover:scale-105 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-2 ml-4">

            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg transition"
            >
              Register
            </Link>

          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;  