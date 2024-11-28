import { Request, Response, NextFunction, RequestHandler } from 'express';
import { auth, AuthResult } from 'express-oauth2-jwt-bearer';
import { Container } from 'typedi';
import { UserService } from '../services/UserService';
import { InviteService } from '../services/InviteService';

export interface AuthRequest extends Request {
  auth?: AuthResult;
  user?: {
    id: string;
    auth0Id: string;
    email: string;
    name: string;
  };
  userStatus?: {
    role: 'admin' | 'user';
    hasPendingInvites: boolean;
    isSaunaMember: boolean;
  };
}

export const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
});

const createMiddleware = (
  handler: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void | Response>
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req as AuthRequest, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export const linkUser: RequestHandler = createMiddleware(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userService = Container.get(UserService);
  
  const auth0Id = req.auth?.payload.sub as string;
  const email = req.auth?.payload['https://api.frj-sauna-booking.com/email'] as string;
  const name = req.auth?.payload['https://api.frj-sauna-booking.com/name'] as string;

  if (!auth0Id) {
    res.status(401).json({ error: 'No user ID in token' });
    return;
  }

  const user = await userService.findOrCreateUser(auth0Id, email, name);
  req.user = user as { id: string; auth0Id: string; email: string; name: string };
  next();
});

export const attachUserStatus: RequestHandler = createMiddleware(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userService = Container.get(UserService);
  const inviteService = Container.get(InviteService);

  if (!req.user) {
    res.status(401).json({ error: 'User not found' });
    return;
  }

  const [hasPendingInvites, isSaunaMember] = await Promise.all([
    inviteService.hasPendingInvites(req.user.auth0Id),
    userService.isSaunaMember(req.user.auth0Id)
  ]);

  req.userStatus = {
    role: await userService.isAdmin(req.user.auth0Id) ? 'admin' : 'user',
    hasPendingInvites,
    isSaunaMember
  };

  next();
});

export const requireAdmin: RequestHandler = createMiddleware(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.userStatus?.role !== 'admin') {
    res.status(403).json({ 
      error: 'Admin access required',
      userStatus: req.userStatus
    });
    return;
  }
  next();
});

export const requireUser: RequestHandler = createMiddleware(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.userStatus?.role !== 'user') {
    res.status(403).json({ 
      error: 'User access required',
      userStatus: req.userStatus
    });
    return;
  }
  next();
});

export const requireNoPendingInvites: RequestHandler = createMiddleware(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.userStatus?.hasPendingInvites) {
    res.status(403).json({ 
      error: 'Please handle pending invites first',
      redirectTo: '/check-invites'
    });
    return;
  }
  next();
});

export const requireSaunaMembership: RequestHandler = createMiddleware(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.userStatus?.isSaunaMember) {
    res.status(403).json({ 
      error: 'Sauna membership required',
      redirectTo: '/no-access'
    });
    return;
  }
  next();
});