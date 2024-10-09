import axios from "axios";

export const serverUrl = 'http://87.242.85.68:8000/';

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

export async function createProduct(obj) {
    try{
        let response = await axios.post('http://87.242.85.68:8000/api/products/', obj);
        return response
    } catch(e) {
        throw(e)
    }
}

export async function patchProduct(productId, productData) {
    try {
        let response = await axios.patch(`http://87.242.85.68:8000/api/products/?product_id=${productId}`, productData);
        return response 
    } catch(e) {
        throw(e)
    }
}

export async function deleteProduct(productId) {
    try {
        let response = await axios.delete(`http://87.242.85.68:8000/api/products/?product_id=${productId}`);
        // console.log(response)
    } catch(e) {
        throw(e)
    }
}

export async function getProductById(productId) {
    try {
        let response = await axios.get(`http://87.242.85.68:8000/api/products/?product_id=${productId}`);
        // console.log(response)
    } catch(e) {
        throw(e)
    }
}

export async function uploadProductImg(productId, file) {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post(
        `http://87.242.85.68:8000/api/products/${productId}/upload-image/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    //   console.log(response);
      return response.data;
    } catch (e) {
      throw e;
    }
  }

export async function deleteProductImg(productId) {
    try {
        let response = await axios.delete(`http://87.242.85.68:8000/api/products/images/?image_id=${productId}`);
        // console.log(response)
    } catch(e) {
        throw(e)
    }
}