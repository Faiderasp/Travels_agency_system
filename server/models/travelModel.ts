import {
    DataTypes,
    Model,
    type InferAttributes,
    type InferCreationAttributes,
    type CreationOptional,
} from 'sequelize';

// Module imports
import { sequelize } from '../config/database.js';

// Defines the traveller model
export class Travel extends Model<
    InferAttributes<Travel>,
    InferCreationAttributes<Travel>
> {
    declare travel_id: CreationOptional<number>;
    declare travel_code: string;
    declare name: string;
    declare seat_quantity: number;
    declare date: Date;
    declare origin: string;
    declare destiny: string;
    declare created_at: CreationOptional<Date>;
}

Travel.init(
    {
        travel_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        travel_code: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        seat_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        origin: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        destiny: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'travel',
        timestamps: false,
    }
)