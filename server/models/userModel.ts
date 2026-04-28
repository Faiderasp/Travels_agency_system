import { DataTypes } from 'sequelize';

// Module imports
import { pgSequelize } from '../config/database';

// Defines the user model
export const User = pgSequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    image: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'user', 'mod'),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }}, {
    tableName: 'user',
    timestamps: false
    }
);

// User model with all the required functions
export const userModel = {
    insertUser: async (username: string, password: string, image: string | null, role: string): Promise<void> => {
        const createdUser = await User.create({
            username: username,
            password: password,
            image: image || 'https://i.pinimg.com/736x/8a/a4/1b/8aa41b29166550802284e1806c420c70.jpg',
            role: role
        });

        await createdUser.save();
    },
    
    selectUserByUsername: async (username: string) => {
        return(
            await User.findOne({
                where: {
                    username: username
                }
            })
        );
    }
}
