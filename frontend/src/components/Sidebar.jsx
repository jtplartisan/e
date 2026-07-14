import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Sidebar() {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role?.toLowerCase();

  if (!user) return null;

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-gray-900 text-white flex flex-col">

      
      <div className="p-5 border-b border-gray-700">
        <h2 className="text-xl font-bold">PANEL</h2>
      </div>

      
      <nav className="flex-1 overflow-y-auto px-3 py-4">

        <div className="space-y-2">

          
          {role === "customer" && (
            <>
              <SidebarLink to="/dashboard/customer" label="👤 Profile" />
              <SidebarLink to="/dashboard/cart" label="🛒 Cart" />
              <SidebarLink to="/dashboard/my-orders" label="📦 My Orders" />
              
              
            
            </>
          )}

          
          {role === "seller" && (
            <>
              <SidebarLink to="/dashboard/seller" label="📊 Reprts" />
              <SidebarLink to="/dashboard/seller/products" label="📦 Products" />
              <SidebarLink to="/dashboard/seller/add-product" label="➕ Add single Product" />
              <SidebarLink to="/dashboard/seller/orders" label="📋 Orders" />
               <SidebarLink to="/dashboard/seller/bulk-product" label="➕ Add bulk Products" />
            </>
          )}

          
          {role === "admin" && (
            <>
              <SidebarLink to="/dashboard/admin" label="📋 Admin" />
              <SidebarLink to="/dashboard/admin/users" label="👥 Users" />
              <SidebarLink to="/dashboard/admin/orders" label="📦 Orders" />
               <SidebarLink to="/dashboard/admin/categories" label="🏷️ Categories" />
            </>
          )}

        </div>

      </nav>
    </aside>
  );
} 


function SidebarLink({ to, label }) {
  return (
    <Link
      to={to}
      className="block px-4 py-2 rounded-lg text-sm font-medium
      hover:bg-gray-800 transition"
    >
      {label}
    </Link>
  );
}

export default Sidebar;