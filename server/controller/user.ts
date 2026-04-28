// Module imports
import { userModel } from '../models/userModel';
const { generateToken } = require('../config/jwt');
import bcrypt from 'bcrypt';

// Type imports
import type { Request, Response } from 'express';

const SALT_ROUNDS = 10;

export const registerUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { username, password, image, role } = req.body;
        if (!username.trim() || !password.trim()) return res.status(400).json({ success: false, message: 'Data missing.' });
        if (await userModel.selectUserByUsername(username.trim())) return res.status(400).json({ success: false, message: 'Username already exists.' });

        const hashedPassword: string = await bcrypt.hash(password, SALT_ROUNDS);

        await userModel.insertUser(username, hashedPassword, image, role);
        return res.status(201).json({ success: true, message: 'User successfully created.' });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message || 'An error has occured while registering' });
    }
}

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { username, password } = req.body;
        if (!username.trim() || !password.trim()) return res.status(400).json({ success: false, message: 'Data missing.' });
        const user = await userModel.selectUserByUsername(username);
        if (!user) return res.status(401).json({ success: false, message: 'That username is not registered.' });

        const valid: boolean = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ success: false, message: 'Incorrect password.' });

        const token = generateToken(user);
        return res.status(200).json({ success: true, msg: 'Logged successfully.', token, id: user.user_id, username: user.username, image: user.image});
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message || 'An error has occured while login' });
    }
}
