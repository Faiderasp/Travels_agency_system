import {
    DataTypes,
    Model,
    type InferAttributes,
    type InferCreationAttributes,
    type CreationOptional,
} from 'sequelize';

// Module imports
import { sequelize } from '../config/database.js';

// Defines the travels model
export class Travels extends Model<
    InferAttributes<Travels>,
    InferCreationAttributes<Travels>
> {
    declare travels_id: CreationOptional<number>;
    declare traveller_id: number;
    declare travel_id: number;
    declare created_at: CreationOptional<Date>;
}

Travels.init(
    {
        travels_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        traveller_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        travel_id: {
            type: DataTypes.INTEGER,
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
        tableName: 'travels',
        modelName: 'TravellerTravel',
        timestamps: false,
    }
);

// Travels model with all the required functions
export const travelsModel = {
    insertTravels: async (
        traveller_id: number,
        travel_id: number
    ): Promise<void> => {
        await Travels.create({ traveller_id, travel_id });
    },

    countByTravelId: async (travel_id: number): Promise<number> => {
        return await Travels.count({ where: { travel_id } });
    },

    selectAllByTravelId: async (travel_id: number): Promise<Travels[]> => {
        return await Travels.findAll({ where: { travel_id } });
    },

    selectByTravellerAndTravel: async (
        traveller_id: number,
        travel_id: number
    ): Promise<Travels | null> => {
        return await Travels.findOne({ where: { traveller_id, travel_id } });
    },

    deleteTravelsById: async (travels_id: number): Promise<void> => {
        await Travels.destroy({ where: { travels_id } });
    },
};
