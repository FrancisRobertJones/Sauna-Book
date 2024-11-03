// src/types/auth.types.ts
import { Request } from 'express';
import { AuthResult } from 'express-oauth2-jwt-bearer';

export interface AuthRequest extends Request {
    auth?: AuthResult;
}