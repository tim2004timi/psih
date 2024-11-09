import axios from "axios";
import { instance } from "./api.config";
import { serverUrl } from "../config";

export async function getOrders() {
    try {
        let response = await instance.get(`${serverUrl}/api/orders/`);
        return response;
    } catch (e) {
        throw e;
    }
}

export async function createOrder(obj) {
    try {
        let response = await instance.post(`${serverUrl}/api/orders/`, obj);
        return response;
    } catch (e) {
        throw e;
    }
}

export async function patchOrder(orderId, key, newValue) {
    try {
        let response = await instance.patch(`${serverUrl}/api/orders/?order_id=${orderId}`, { [key]: newValue });
        return response;
    } catch (e) {
        throw e;
    }
}

export async function deleteOrder(id) {
    try {
        let response = await instance.delete(`${serverUrl}/api/orders/?order_id=${id}`);
        return response;
    } catch (e) {
        throw e;
    }
}

export async function getOrderById(id) {
    try {
        let response = await instance.get(`${serverUrl}/api/orders/${id}`);
        return response;
    } catch (e) {
        throw e;
    }
}

export async function deleteOrders(idsArr) {
    try {
        let response = await instance.delete(`${serverUrl}/api/orders/multiple/`, { data: idsArr });
        return response;
    } catch (e) {
        throw e;
    }
}

export async function uploadOrderFile(orderId, file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await instance.post(
            `${serverUrl}/api/orders/${orderId}/upload-file/`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        // console.log(response);
        return response;
    } catch (e) {
        throw e;
    }
}

export async function deleteOrderFile(fileId) {
    try {
        let response = await instance.delete(`${serverUrl}/api/orders/files/?file_id=${fileId}`);
        // console.log(response)
        return response
    } catch (e) {
        throw e;
    }
}