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
            allowNull: false,
        },
        origin: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        destiny: {
            type: DataTypes.STRING(50),
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
        tableName: 'travel',
        timestamps: false,
    }
);

// Travel model with all the required functions
export const travelModel = {
    insertTravel: async (
        travel_code: string,
        name: string,
        seat_quantity: number,
        date: Date,
        origin: string,
        destiny: string
    ): Promise<void> => {
        await Travel.create({
            travel_code,
            name,
            seat_quantity,
            date,
            origin,
            destiny,
        });
    },

    selectAllTravels: async (): Promise<Travel[]> => {
        return await Travel.findAll();
    },

    selectTravelByCode: async (travel_code: string): Promise<Travel | null> => {
        return await Travel.findOne({
            where: {
                travel_code,
            },
        });
    },

    selectTravelById: async (travel_id: number): Promise<Travel | null> => {
        return await Travel.findByPk(travel_id);
    },

    updateTravelById: async (travel_id: number, data: any): Promise<void> => {
        await Travel.update(data, {
            where: {
                travel_id,
            },
        });
    },

    deleteTravelById: async (travel_id: number): Promise<void> => {
        await Travel.destroy({
            where: {
                travel_id,
            },
        });
    },
};
