import {
  createBrowserRouter,
} from "react-router-dom";
import Homepage from "./pages/Home/Homepage";
import Layout from "./Layout";
import { ProtectedRoute } from "./components/Routing/ProtectedRoute";
import Register from "./components/Admin/Register";
import SaunaAdminDashboard from "./pages/Admin/SaunaAdminDashboard";
import { AdminRoute } from "./components/Routing/AdminRoute";
import { Auth0Callback } from "./components/Routing/AuthCallback";
import NoAccess from "./pages/Error/No-access";
import RegisterNewUser from "./components/Admin/RegisterNewUser";
import { UnauthedProtected } from "./components/Routing/UnAuthedProtectedRoute";
import BookingPage from "./pages/User/BookingPage";
import SaunaSelectBooking from "./pages/User/SaunaSelectList";
import { PendingInvites } from "./components/Admin/PendingInvites";
import { PendingInvitesGuard } from "./components/Routing/PendingInvitesGuard";
import MyAdminSaunas from "./pages/Admin/MyAdminSaunas";
import { AccountTypeSelection } from "./components/Routing/AccountTypeSelection";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        element: <UnauthedProtected />,
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
            path: "/select-account-type",
            element: <AccountTypeSelection />
          }
        ]
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
                    element: <MyAdminSaunas />
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
                element: <SaunaSelectBooking />
              },
              {
                path: "/booking/:saunaId",  
                element: <BookingPage />  
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