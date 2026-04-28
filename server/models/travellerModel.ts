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
export class Traveller extends Model<
    InferAttributes<Traveller>,
    InferCreationAttributes<Traveller>
> {
    declare traveller_id: CreationOptional<number>;
    declare dni: string;
    declare name: string;
    declare address: string;
    declare phone: string;
    declare created_at: CreationOptional<Date>;
}

Traveller.init(
    {
        traveller_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        dni: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        phone: {
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
        tableName: 'traveller',
        timestamps: false,
    }
);

// Traveller model with all the required functions
export const travellerModel = {
    insertTraveller: async (
        dni: string,
        name: string,
        address: string,
        phone: string
    ): Promise<void> => {
        await Traveller.create({
            dni: dni,
            name: name,
            address: address,
            phone: phone,
        });
    },

    selectAllTravellers: async (): Promise<Traveller[]> => {
        return await Traveller.findAll();
    },

    selectTravellerByDni: async (dni: string): Promise<Traveller | null> => {
        return await Traveller.findOne({
            where: {
                dni: dni,
            },
        });
    },

    selectTravellerById: async (
        traveller_id: number
    ): Promise<Traveller | null> => {
        return await Traveller.findByPk(traveller_id);
    },

    updateTravellerById: async (
        traveller_id: number,
        data: any
    ): Promise<void> => {
        await Traveller.update(data, {
            where: {
                traveller_id: traveller_id,
            },
        });
    },

    deleteTravellerById: async (traveller_id: number): Promise<void> => {
        await Traveller.destroy({
            where: {
                traveller_id: traveller_id,
            },
        });
    },
};
