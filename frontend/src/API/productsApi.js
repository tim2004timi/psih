import axios from "axios";

export async function getCategories() {
        try {
            let response = await axios.get('http://87.242.85.68:8000/api/products/categories/');
            return response 
        } catch(e) {
            throw(e)
        }
}

export async function getProductsNA() {
        try {
            let response = await axios.get('http://87.242.85.68:8000/api/products/not-archived/');
            return response 
        } catch(e) {
            throw(e)
        }
}

export async function patchProduct(productId, key, newValue) {
    try {
        let response = await axios.patch(`http://87.242.85.68:8000/api/products/?product_id=$${productId}`, { [key]: newValue });
        return response 
    } catch(e) {
        throw(e)
    }
}