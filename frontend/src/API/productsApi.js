import axios from "axios";

export async function getCategories() {
        try {
            let response = await axios.get('http://87.242.85.68:8000/api/products/categories/');
            return response 
        } catch(e) {
            throw(e)
        }
}

export async function deleteCategory(categoryId) {
    try {
        let response = await axios.delete(`http://87.242.85.68:8000/api/products/categories/?product_category_id=${categoryId}`);
        return response 
    } catch(e) {
        throw(e)
    }
}

export async function createCategory(name) {
    try {
        let response = await axios.post(`http://87.242.85.68:8000/api/products/categories/`, { 'name': name });
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

export async function getProductsA() {
        try {
            let response = await axios.get('http://87.242.85.68:8000/api/products/archived/');
            return response 
        } catch(e) {
            throw(e)
        }
}

export async function patchProduct(productId, key, newValue) {
    try {
        let response = await axios.patch(`http://87.242.85.68:8000/api/products/?product_id=${productId}`, { [key]: newValue });
        return response 
    } catch(e) {
        throw(e)
    }
}

export async function deleteProduct(productId) {
    try {
        let response = await axios.delete(`http://87.242.85.68:8000/api/products/?product_id=${productId}`);
        console.log(response)
    } catch(e) {
        throw(e)
    }
}