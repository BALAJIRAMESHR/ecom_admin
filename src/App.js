import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import ProductManagement from "./pages/ProductManagement/ProductManagement";
import CategoryManagement from "./pages/CategoryManagement/CategoryManagement";
import OrdersManagement from "./pages/OrderManagement/OrderManagement";
import Dashboard from "./pages/Dashboard/dashboard.jsx";
import Inventory from "./pages/Invetory/invetory.jsx";
import Coupons from "./pages/Coupoes/coupoes.jsx";
import User from "./pages/UserManagement/usermanagement.jsx";
import Login from "./pages/Login/Login";
import Marketing from "./pages/marketing/marketing.jsx";
import Designlab from "./pages/Designlab/designlab.jsx";
import { useEffect } from "react";

function HomeRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login");
  }, [navigate]);

  return null;
}

// ProtectedRoute for general route protection
const ProtectedRoute = ({ children }) => {
  const userPermissions = JSON.parse(localStorage.getItem("userPermissions") || "{}");

  // If no permissions are found, redirect to login
  if (!userPermissions) {
    return <Navigate to="/login" />;
  }

  return children;
};

// UserManagementRoute for user management specific route protection
const UserManagementRoute = ({ children }) => {
  const userPermissions = JSON.parse(localStorage.getItem("userPermissions") || "{}");

  if (!userPermissions || !userPermissions.userManagement) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

// DesignlabRoute to ensure only users with designlab permission can access
const DesignlabRoute = ({ children }) => {
  const userPermissions = JSON.parse(localStorage.getItem("userPermissions") || "{}");

  // If the user doesn't have permission for Designlab, redirect to Dashboard
  if (!userPermissions || !userPermissions.designlab) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />

      {/* Protecting the Product Management page */}
      <Route
        path="/productmanagement"
        element={
          <ProtectedRoute>
            <ProductManagement />
          </ProtectedRoute>
        }
      />
      
      {/* Protecting the Category Management page */}
      <Route
        path="/categorymanagement"
        element={
          <ProtectedRoute>
            <CategoryManagement />
          </ProtectedRoute>
        }
      />

      {/* Protecting Designlab page with special permission check */}
      <Route
        path="/designlab"
        element={
          <ProtectedRoute>
            
              <Designlab />
           
          </ProtectedRoute>
        }
      />

      {/* Protecting Orders page */}
      <Route
        path="/order"
        element={
          <ProtectedRoute>
            <OrdersManagement />
          </ProtectedRoute>
        }
      />

      {/* Protecting User Management page */}
      <Route
        path="/user-management"
        element={
          <ProtectedRoute>
            <UserManagementRoute>
              <User />
            </UserManagementRoute>
          </ProtectedRoute>
        }
      />

      {/* Protecting Dashboard page */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Protecting Coupons page */}
      <Route
        path="/coupons"
        element={
          <ProtectedRoute>
            <Coupons />
          </ProtectedRoute>
        }
      />

      {/* Protecting Inventory page */}
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <Inventory />
          </ProtectedRoute>
        }
      />

      {/* Protecting Marketing page */}
      <Route
        path="/marketing"
        element={
          <ProtectedRoute>
            <Marketing />
          </ProtectedRoute>
        }
      />
    </Route>
  )
);

function App() {
  return (
    <div className="font-bodyFont">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
