// Module imports
import { travelsModel } from '../models/travelsModel.js';
import { travelModel } from '../models/travelModel.js';
import { travellerModel } from '../models/travellerModel.js';

// Type imports
import type { Request, Response } from 'express';

export const createTravels = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { traveller_id, travel_id } = req.body;
        if (!traveller_id || !travel_id)
            return res
                .status(400)
                .json({ success: false, message: 'Data missing.' });

        // Checks for the traveller
        const traveller = await travellerModel.selectTravellerById(
            Number(traveller_id)
        );
        if (!traveller) {
            return res
                .status(404)
                .json({ success: false, message: 'Traveller not found.' });
        }

        // Checks for the travel
        const travel = await travelModel.selectTravelById(Number(travel_id));
        if (!travel) {
            return res
                .status(404)
                .json({ success: false, message: 'Travel not found.' });
        }

        // Check if traveller is already registered to this travel
        const existingRegistration =
            await travelsModel.selectByTravellerAndTravel(
                Number(traveller_id),
                Number(travel_id)
            );
        if (existingRegistration) {
            return res.status(400).json({
                success: false,
                message: 'Traveller is already registered to this travel.',
            });
        }

        // Check if the seats aren't complete
        const currentRegistrations = await travelsModel.countByTravelId(
            Number(travel_id)
        );
        if (currentRegistrations >= travel.seat_quantity) {
            return res.status(400).json({
                success: false,
                message: 'This travel has no more seats available.',
            });
        }

        await travelsModel.insertTravels(
            Number(traveller_id),
            Number(travel_id)
        );
        return res.status(201).json({
            success: true,
            message: 'Traveller successfully registered to the travel.',
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message:
                error.message ||
                'An error has occurred while registering traveller to travel.',
        });
    }
};

export const getTravelRegistrations = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { travel_id } = req.params;
        const registrations = await travelsModel.selectAllByTravelId(
            Number(travel_id)
        );
        return res.status(200).json({ success: true, data: registrations });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message:
                error.message ||
                'An error occurred while fetching registrations.',
        });
    }
};

export const getAllRegistrations = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const registrations = await travelsModel.selectAll();
        return res.status(200).json({ success: true, data: registrations });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message:
                error.message ||
                'An error occurred while fetching all registrations.',
        });
    }
};

export const deleteTravels = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { id } = req.params;
        await travelsModel.deleteTravelsById(Number(id));
        return res.status(200).json({
            success: true,
            message: 'Registration deleted successfully.',
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message:
                error.message ||
                'An error occurred while deleting registration.',
        });
    }
};
