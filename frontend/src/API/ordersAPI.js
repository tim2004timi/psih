import axios from "axios";

export async function getOrders() {
        try {
            let response = await axios.get('http://87.242.85.68:8000/api/orders/');
            return response 
        } catch(e) {
            throw(e)
        }
}

export async function createOrder(obj) {
    try {
        let response = await axios.post('http://87.242.85.68:8000/api/orders/', obj);
        return response;
    } catch (e) {
        throw e;
    }
}

export async function patchOrder(orderId, key, newValue) {
        try {
            let response = await axios.patch(`http://87.242.85.68:8000/api/orders/?order_id=${orderId}`, { [key]: newValue });
            return response 
        } catch(e) {
            throw(e)
        }
}

export async function deleteOrder(id) {
        try {
            let response = await axios.delete(`http://87.242.85.68:8000/api/orders/?order_id=${id}`);
            return response 
        } catch(e) {
            throw(e)
        }
}

export async function getOrderById(id) {
        try {
            let response = await axios.get(`http://87.242.85.68:8000/api/orders/${id}`);
            return response 
        } catch(e) {
            throw(e)
        }
}

export async function deleteOrders(idsArr) {
    try {
        let response = await axios.delete(`http://87.242.85.68:8000/api/orders/multiple/`, {data: idsArr});
        return response;
    } catch (e) {
        throw e;
    }
}