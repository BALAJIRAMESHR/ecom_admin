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
import { useEffect } from "react";

function HomeRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login");
  }, [navigate]);

  return null;
}

// Add this component to protect routes
const ProtectedRoute = ({ children }) => {
  const userPermissions = localStorage.getItem("userPermissions");

  if (!userPermissions) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Add this new component for user management route protection
const UserManagementRoute = ({ children }) => {
  const userPermissions = JSON.parse(
    localStorage.getItem("userPermissions") || "{}"
  );

  if (!userPermissions || !userPermissions.userManagement) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/productmanagement"
        element={
          <ProtectedRoute>
            <ProductManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categorymanagement"
        element={
          <ProtectedRoute>
            <CategoryManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order"
        element={
          <ProtectedRoute>
            <OrdersManagement />
          </ProtectedRoute>
        }
      />
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
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coupons"
        element={
          <ProtectedRoute>
            <Coupons />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <Inventory />
          </ProtectedRoute>
        }
      />
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
