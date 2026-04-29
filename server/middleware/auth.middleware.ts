import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// User data payload
interface UserPayload {
    user_id: string;
    username: string;
}

// Extended request
interface AuthenticatedRequest extends Request {
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
            process.env.JWT_SECRET as string
        ) as UserPayload;
        req.user = decoded;
        next();
    } catch {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};
