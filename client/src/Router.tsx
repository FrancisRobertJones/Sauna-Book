import {
    createBrowserRouter,
  } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Layout from "./Layout";
import Booking from "./pages/Booking";
import { ProtectedRoute } from "./components/ProtectedRoute";
import TestAuth from "./components/TestAuth";
import Auth0Callback from "./components/AuthCallback";
import Register from "./pages/Register";
import SaunaAdminDashboard from "./pages/SaunaAdminDashboard";

export const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Homepage />,
          index: true,
        },
        {
            path: "/callback", 
            element: <Auth0Callback />
        },
        {
            element: <ProtectedRoute />,
            children: [
              {
                path: "/booking",
                element: <Booking />
              },
              {
                path: "/register-sauna",
                element: <Register />
              },
              {
                path: "/test-auth",  
                element: <TestAuth />
              },
              {
                path: "/admin/sauna/:saunaId",  
                element: <SaunaAdminDashboard />
              }
            ]
          }
      ],
    },
  ]);