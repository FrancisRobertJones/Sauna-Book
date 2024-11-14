import {
    createBrowserRouter,
  } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Layout from "./Layout";
import Booking from "./pages/Booking";
import { ProtectedRoute } from "./components/ProtectedRoute";
import TestAuth from "./components/TestAuth";
import Register from "./pages/Register";
import SaunaAdminDashboard from "./pages/SaunaAdminDashboard";
import MySaunas from "./pages/MySaunas";
import { Auth0Callback } from "./components/AuthCallback";
import { AdminRoute } from "./components/AdminRoute";

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
                element: <AdminRoute />,  
                  children: [
                    {
                      path: "/my-saunas",
                      element: <MySaunas />
                    },
                    {
                      path: "/admin/sauna/:id",
                      element: <SaunaAdminDashboard />
                    }
                  ]
                },
                {
                  path: "/booking",
                  element: <Booking />
                },
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
              },
              {
                path: "/my-saunas",  
                element: <MySaunas />
              }
            ]
          }
      ],
    },
  ]);