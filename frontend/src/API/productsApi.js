import axios from "axios";
import { instance } from "./api.config";
import {serverUrl} from '../config.js'

export async function getCategories() {
    try {
        let response = await instance.get(`${serverUrl}/api/products/categories/`);
        return response;
    } catch (e) {
        throw e;
    }
}

export async function deleteCategory(categoryId) {
    try {
        let response = await instance.delete(`${serverUrl}/api/products/categories/?product_category_id=${categoryId}`);
        return response;
    } catch (e) {
        throw e;
    }
}

export async function createCategory(name) {
    try {
        let response = await instance.post(`${serverUrl}/api/products/categories/`, { 'name': name });
        return response;
    } catch (e) {
        throw e;
    }
}

export async function getProducts(isArchived = false) {
    try {
        let url = `${serverUrl}/api/products/`;
        if (isArchived !== undefined && isArchived !== null) {
            url += `?archived=${isArchived}`;
        }
        let response = await instance.get(url);
        return response;
    } catch (e) {
        throw e;
    }
}

// export async function getProductsNA() {
//     try {
//         let response = await instance.get(`${serverUrl}/api/products/not-archived/`);
//         return response;
//     } catch (e) {
//         throw e;
//     }
// }

// export async function getProductsA() {
//     try {
//         let response = await instance.get(`${serverUrl}/api/products/archived/`);
//         return response;
//     } catch (e) {
//         throw e;
//     }
// }

export async function createProduct(obj) {
    try {
        let response = await instance.post(`${serverUrl}/api/products/`, obj);
        return response;
    } catch (e) {
        throw e;
    }
}

export async function patchProduct(productId, obj) {
    try {
        let response = await instance.patch(`${serverUrl}/api/products/?product_id=${productId}`, obj);
        return response;
    } catch (e) {
        throw e;
    }
}

export async function deleteProduct(productId) {
    try {
        let response = await instance.delete(`${serverUrl}/api/products/?product_id=${productId}`);
        // console.log(response)
    } catch (e) {
        throw e;
    }
}

export async function deleteProducts(idsArr) {
    try {
        let response = await instance.delete(`${serverUrl}/api/products/multiple/`, { data: idsArr });
        return response;
    } catch (e) {
        throw e;
    }
}

export async function getProductById(productId) {
    try {
        let response = await instance.get(`${serverUrl}/api/products/${productId}/`);
        return response
    } catch (e) {
        throw e;
    }
}

export async function uploadProductImg(productId, file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await instance.post(
            `${serverUrl}/api/products/${productId}/upload-image/`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        // console.log(response);
        return response.data;
    } catch (e) {
        throw e;
    }
}

export async function deleteProductImg(productId) {
    try {
        let response = await instance.delete(`${serverUrl}/api/products/images/?image_id=${productId}`);
        // console.log(response)
    } catch (e) {
        throw e;
    }
}

export async function uploadProductFile(productId, file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await instance.post(
            `${serverUrl}/api/products/${productId}/upload-file/`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        // console.log(response);
        return response.data;
    } catch (e) {
        throw e;
    }
}