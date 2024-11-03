// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import { Container } from 'typedi';
import { UserService } from '../services/UserService';

type AuthRequest = Request & { auth?: { payload: { sub: string; [key: string]: any } } };

export const linkUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const userService = Container.get(UserService);

  Promise.resolve().then(async () => {
    try {
        console.log('Auth payload:', req.auth?.payload); 

      const auth0Id = req.auth?.payload.sub;
      
      const email = req.auth?.payload['https://api.frj-sauna-booking.com/email'];
      const name = req.auth?.payload['https://api.frj-sauna-booking.com/name'];

      console.log('Extracted data:', { auth0Id, email, name }); 

      if (!auth0Id) {
        return res.status(401).json({ error: 'No user ID in token' });
      }

      await userService.findOrCreateUser(auth0Id, email, name);

      next();
    } catch (error) {
      next(error);
    }
  });
};

export const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
});