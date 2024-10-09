import axios from "axios";
import { serverUrl } from "./productsApi";

export async function getOrders() {
    try {
        let response = await axios.get(`${serverUrl}/api/orders/`);
        return response;
    } catch (e) {
        throw e;
    }
}

export async function createOrder(obj) {
    try {
        let response = await axios.post(`${serverUrl}/api/orders/`, obj);
        return response;
    } catch (e) {
        throw e;
    }
}

export async function patchOrder(orderId, key, newValue) {
    try {
        let response = await axios.patch(`${serverUrl}/api/orders/?order_id=${orderId}`, { [key]: newValue });
        return response;
    } catch (e) {
        throw e;
    }
}

export async function deleteOrder(id) {
    try {
        let response = await axios.delete(`${serverUrl}/api/orders/?order_id=${id}`);
        return response;
    } catch (e) {
        throw e;
    }
}

export async function getOrderById(id) {
    try {
        let response = await axios.get(`${serverUrl}/api/orders/${id}`);
        return response;
    } catch (e) {
        throw e;
    }
}

export async function deleteOrders(idsArr) {
    try {
        let response = await axios.delete(`${serverUrl}/api/orders/multiple/`, { data: idsArr });
        return response;
    } catch (e) {
        throw e;
    }
}