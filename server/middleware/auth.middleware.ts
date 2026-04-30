import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// User data payload
interface UserPayload {
    user_id: string;
    username: string;
    role: 'admin' | 'user' | 'mod';
}

// Extended request
export interface AuthenticatedRequest extends Request {
    user?: UserPayload;
}

export const auth = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string || 'JWTSECRETKEY'
        ) as UserPayload;
        req.user = decoded;
        next();
    } catch {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

export const checkAdmin = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated.' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            message: 'Access denied. Only administrators can perform this action.',
        });
    }

    next();
};

export const checkAdminOrUser = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated.' });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'user') {
        return res.status(403).json({
            message: 'Access denied. Only administrators or users can perform this action.',
        });
    }

    next();
};

