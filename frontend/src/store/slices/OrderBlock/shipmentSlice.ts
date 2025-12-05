import {shipmentApi} from "../../../api/OrderBlock/shipmentApi.ts";
import type {IShipment} from "../../../types";
import { createGenericSlice } from '../GenericSlice.ts';

const shipmentSlice = createGenericSlice(
    'shipments',
    shipmentApi,
    "shipmentId"
);

export const {
    fetchAll: fetchShipment,
    fetchById: fetchShipmentById,
    create: createShipment,
    update: updateShipment
} = shipmentSlice.actions

export default shipmentSlice.reducer