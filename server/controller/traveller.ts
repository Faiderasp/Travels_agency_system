// Module imports
import { travellerModel } from '../models/travellerModel.js';

// Type imports
import type { Request, Response } from 'express';

export const createTraveller = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { dni, name, address, phone } = req.body;
        if (!dni || !name || !address || !phone)
            return res
                .status(400)
                .json({ success: false, message: 'Data missing.' });

        const existingTraveller =
            await travellerModel.selectTravellerByDni(dni);
        if (existingTraveller)
            return res.status(400).json({
                success: false,
                message: 'Traveller with this DNI already exists.',
            });

        await travellerModel.insertTraveller(dni, name, address, phone);
        return res.status(201).json({
            success: true,
            message: 'Traveller successfully created.',
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message:
                error.message ||
                'An error has occurred while creating traveller.',
        });
    }
};

export const getTravellers = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const travellers = await travellerModel.selectAllTravellers();
        return res.status(200).json({ success: true, travellers });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message:
                error.message || 'An error occurred while fetching travellers.',
        });
    }
};

export const getTravellerById = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { id } = req.params;
        const traveller = await travellerModel.selectTravellerById(Number(id));
        if (!traveller)
            return res
                .status(404)
                .json({ success: false, message: 'Traveller not found.' });

        return res.status(200).json({ success: true, traveller });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message:
                error.message || 'An error occurred while fetching traveller.',
        });
    }
};

export const updateTraveller = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { id } = req.params;
        const { dni, name, address, phone } = req.body;

        const updateData: any = {};
        if (dni) updateData.dni = dni;
        if (name) updateData.name = name;
        if (address) updateData.address = address;
        if (phone) updateData.phone = phone;

        await travellerModel.updateTravellerById(Number(id), updateData);

        return res.status(200).json({
            success: true,
            message: 'Traveller updated successfully.',
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message:
                error.message || 'An error occurred while updating traveller.',
        });
    }
};

export const deleteTraveller = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { id } = req.params;
        await travellerModel.deleteTravellerById(Number(id));
        return res.status(200).json({
            success: true,
            message: 'Traveller deleted successfully.',
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message:
                error.message || 'An error occurred while deleting traveller.',
        });
    }
};
