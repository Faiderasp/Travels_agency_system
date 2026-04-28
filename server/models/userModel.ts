import {
    DataTypes,
    Model,
    type InferAttributes,
    type InferCreationAttributes,
    type CreationOptional,
} from 'sequelize';

// Module imports
import { sequelize } from '../config/database.js';

// Defines the user model
export class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
> {
    declare user_id: CreationOptional<number>;
    declare username: string;
    declare password: string;
    declare image: string;
    declare role: 'admin' | 'user' | 'mod';
    declare created_at: CreationOptional<Date>;
}

User.init(
    {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('admin', 'user', 'mod'),
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'user',
        timestamps: false,
    }
);

// User model with all the required functions
export const userModel = {
    insertUser: async (
        username: string,
        password: string,
        role: 'admin' | 'user' | 'mod',
        image?: string
    ): Promise<void> => {
        await User.create({
            username: username,
            password: password,
            image:
                image ||
                'https://i.pinimg.com/736x/8a/a4/1b/8aa41b29166550802284e1806c420c70.jpg',
            role: role,
        });
    },

    selectUserByUsername: async (username: string): Promise<User | null> => {
        return await User.findOne({
            where: {
                username: username,
            },
        });
    },

    updateUserById: async (user_id: number, data: any): Promise<void> => {
        await User.update(data, {
            where: {
                user_id: user_id,
            },
        });
    },

    deleteUserById: async (user_id: number): Promise<void> => {
        await User.destroy({
            where: {
                user_id: user_id,
            },
        });
    },
};
