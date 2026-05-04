// Module imports
import { userModel } from '../models/userModel.js';
import { generateToken } from '../config/jwt.js';
import bcrypt from 'bcrypt';

// Type imports
import type { Request, Response } from 'express';

const SALT_ROUNDS = 10;

export const registerUser = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { username, password, image, role } = req.body;
        if (!username.trim() || !password.trim())
            return res
                .status(400)
                .json({ success: false, message: 'Data missing.' });
        if (await userModel.selectUserByUsername(username.trim()))
            return res
                .status(400)
                .json({ success: false, message: 'Username already exists.' });

        const hashedPassword: string = await bcrypt.hash(password, SALT_ROUNDS);

        await userModel.insertUser(username, hashedPassword, role, image);

        return res
            .status(201)
            .json({ success: true, message: 'User successfully created.' });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || 'An error has occured while registering.',
        });
    }
};

export const loginUser = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { username, password } = req.body;
        if (!username.trim() || !password.trim())
            return res
                .status(400)
                .json({ success: false, message: 'Data missing.' });
        const user = await userModel.selectUserByUsername(username);
        if (!user)
            return res.status(401).json({
                success: false,
                message: 'That username is not registered.',
            });

        const valid: boolean = await bcrypt.compare(password, user.password);
        if (!valid)
            return res
                .status(401)
                .json({ success: false, message: 'Incorrect password.' });

        const token = generateToken(user);
        return res.status(200).json({
            success: true,
            message: 'Logged successfully.',
            data: {
                token,
                id: user.user_id,
                username: user.username,
                image: user.image,
                role: user.role,
            },

        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || 'An error has occured while login.',
        });
    }
};

export const selectUsers = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const users = await userModel.selectAllUsers();

        return res.status(200).json({
            success: true,
            message: 'Users successfully fetched.',
            data: users,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message:
                error.message || 'An error has occured while fetching users.',
        });
    }
};

export const createUser = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { username, password, image, role } = req.body;
        if (!username.trim() || !password.trim())
            return res
                .status(400)
                .json({ success: false, message: 'Data missing.' });
        if (await userModel.selectUserByUsername(username.trim()))
            return res
                .status(400)
                .json({ success: false, message: 'Username already exists.' });

        const hashedPassword: string = await bcrypt.hash(password, SALT_ROUNDS);

        await userModel.insertUser(username, hashedPassword, role, image);

        return res
            .status(201)
            .json({ success: true, message: 'User successfully created.' });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || 'An error has occured while registering.',
        });
    }
};

export const updateUser = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { id } = req.params;
        const { username, password, image, role } = req.body;

        const updateData: any = {};
        if (username !== undefined) updateData.username = username;
        if (image !== undefined) updateData.image = image;
        if (role !== undefined) updateData.role = role;
        if (password) {
            updateData.password = await bcrypt.hash(password, SALT_ROUNDS);
        }

        await userModel.updateUserById(Number(id), updateData);

        return res
            .status(200)
            .json({ success: true, message: 'User updated successfully.' });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || 'An error occurred while updating.',
        });
    }
};

export const deleteUser = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { id } = req.params;
        await userModel.deleteUserById(Number(id));
        return res
            .status(200)
            .json({ success: true, message: 'User deleted successfully.' });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || 'An error occurred while deleting.',
        });
    }
};
