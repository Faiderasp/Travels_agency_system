import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

// Getting the JWT secret key
const SECRET_KEY = process.env.JWT_SECRET || 'JWTSECRETKEY';

// Generates the secret token that clients saves
export function generateToken(user: User): string {
    return jwt.sign(
        { id: user.user_id, username: user.username, role: user.role },
        SECRET_KEY,
        {
            expiresIn: '8h',
        }
    );

}

// Verifies if the token is valid
export function verifyToken(token: string): any {
    return jwt.verify(token, SECRET_KEY);
}
