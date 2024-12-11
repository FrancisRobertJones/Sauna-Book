import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './Router.tsx'
import { Auth0Provider } from '@auth0/auth0-react'

console.log('Redirect URI:', `${window.location.origin}/callback`);


createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: `${window.location.origin}/callback`,
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: 'openid profile email'
        }}
        useRefreshTokens={true}
        cacheLocation="localstorage"
    >
      <RouterProvider router={router} />
    </Auth0Provider>
  </React.StrictMode>
)
