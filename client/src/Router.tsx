import {
  createBrowserRouter,
} from "react-router-dom";
import Homepage from "./pages/Homepage";
import Layout from "./Layout";
import Booking from "./pages/Booking";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Register from "./pages/Register";
import SaunaAdminDashboard from "./pages/SaunaAdminDashboard";
import MySaunas from "./pages/MySaunas";
import { AdminRoute } from "./components/AdminRoute";
import { Auth0Callback } from "./components/AuthCallback";
import { PendingInvites } from "./pages/PendingInvites";
import NoAccess from "./pages/No-access";
import { PendingInvitesGuard } from "./components/PendingInvitesGuard";
import RegisterNewUser from "./pages/RegisterNewUser";

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
        path: "/register-user",
        element: <RegisterNewUser />
      },
      {
        path: "/callback",
        element: <Auth0Callback />
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <PendingInvitesGuard />,
            children: [
              {
                element: <AdminRoute />,
                children: [
                  {
                    path: "/my-saunas",
                    element: <MySaunas />
                  },
                  {
                    path: "/admin/sauna/:saunaId",
                    element: <SaunaAdminDashboard />
                  },
                  {
                    path: "/register-sauna",
                    element: <Register />
                  }
                ]
              },
              {
                path: "/booking",
                element: <Booking />
              },
              {
                path: "/no-access",
                element: <NoAccess />
              }
            ]
          },
          {
            path: "/check-invites",
            element: <PendingInvites />
          }
        ]
      }
    ]
  }
]);