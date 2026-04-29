// Module imports
import { travelModel } from '../models/travelModel.js';

// Type imports
import type { Request, Response } from 'express';

export const createTravel = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { travel_code, name, seat_quantity, date, origin, destiny } =
            req.body;
        if (
            !travel_code ||
            !name ||
            !seat_quantity ||
            !date ||
            !origin ||
            !destiny
        )
            return res
                .status(400)
                .json({ success: false, message: 'Data missing.' });

        const existingTravel =
            await travelModel.selectTravelByCode(travel_code);
        if (existingTravel)
            return res.status(400).json({
                success: false,
                message: 'Travel with this code already exists.',
            });

        await travelModel.insertTravel(
            travel_code,
            name,
            seat_quantity,
            new Date(date),
            origin,
            destiny
        );
        return res.status(201).json({
            success: true,
            message: 'Travel successfully created.',
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message:
                error.message || 'An error has occurred while creating travel.',
        });
    }
};

export const getTravels = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const travels = await travelModel.selectAllTravels();
        return res.status(200).json({ success: true, travels });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message:
                error.message || 'An error occurred while fetching travels.',
        });
    }
};

export const getTravelById = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { id } = req.params;
        const travel = await travelModel.selectTravelById(Number(id));
        if (!travel)
            return res
                .status(404)
                .json({ success: false, message: 'Travel not found.' });

        return res.status(200).json({ success: true, travel });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message:
                error.message || 'An error occurred while fetching travel.',
        });
    }
};

export const updateTravel = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { id } = req.params;
        const { travel_code, name, seat_quantity, date, origin, destiny } =
            req.body;

        const updateData: any = {};
        if (travel_code) updateData.travel_code = travel_code;
        if (name) updateData.name = name;
        if (seat_quantity) updateData.seat_quantity = seat_quantity;
        if (date) updateData.date = new Date(date);
        if (origin) updateData.origin = origin;
        if (destiny) updateData.destiny = destiny;

        await travelModel.updateTravelById(Number(id), updateData);

        return res.status(200).json({
            success: true,
            message: 'Travel updated successfully.',
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message:
                error.message || 'An error occurred while updating travel.',
        });
    }
};

export const deleteTravel = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { id } = req.params;
        await travelModel.deleteTravelById(Number(id));
        return res.status(200).json({
            success: true,
            message: 'Travel deleted successfully.',
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message:
                error.message || 'An error occurred while deleting travel.',
        });
    }
};
