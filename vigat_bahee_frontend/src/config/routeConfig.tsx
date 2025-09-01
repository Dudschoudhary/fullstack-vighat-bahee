// src/router/index.ts
import { createBrowserRouter, Navigate } from "react-router-dom";
import VigatBahee from "../components/VigatBahee";
import VigatBaheeLayout from "../components/VigatBaheeLayout";
import AddNewEntries from "../common/AddNewEntries";
import Login from "../components/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute"; // नया import

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "/",
        element: <Navigate to="/login" replace />
      },
      {
        path: "/login",
        element: (
          <PublicRoute redirectTo="/bahee">
            <Login />
          </PublicRoute>
        )
      },
      {
        path: "/bahee",
        element: (
          <ProtectedRoute>
            <VigatBahee />
          </ProtectedRoute>
        )
      },
      {
        path: "/bahee-layout",
        element: (
          <ProtectedRoute>
            <VigatBaheeLayout />
          </ProtectedRoute>
        )
      },
      {
        path: "/new-entries",
        element: (
          <ProtectedRoute>
            <AddNewEntries />
          </ProtectedRoute>
        )
      }
    ]
  }
]);

export default router;