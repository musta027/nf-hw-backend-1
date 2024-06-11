import { NextFunction, Request, Response } from 'express';
import AuthService from '../auth/auth-service';

const authService = new AuthService();

export const eventMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    (req as any).user = null;
    next();
    return;
  }

  const token = authHeader.split(' ')[1];
  const payload = authService.verifyJwt(token);

  if (!payload) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  (req as any).user = payload;
  next();
};