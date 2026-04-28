import jwt from 'jsonwebtoken';

// Getting the JWT secret key
const SECRET_KEY = process.env.JWT_SECRET || 'JWTSECRETKEY';

// Generates the secret token that clients saves
export function generateToken (user) {
    return jwt.sign(
        { id: user.user_id, username: user.username },
        SECRET_KEY,
        { expiresIn: "8h" } 
    );
}

// Verifies if the token is valid
export function verifyToken (token) {
    return jwt.verify(token, SECRET_KEY);
}