import { instance } from "./api.config";
import { serverUrl } from "../config.js";

const ProductsService = {
  getCategories() {
    return instance.get(`${serverUrl}/api/products/categories/`);
  },

  deleteCategory(categoryId) {
    return instance.delete(
      `${serverUrl}/api/products/categories/?product_category_id=${categoryId}`
    );
  },

  createCategory(name) {
    return instance.post(`${serverUrl}/api/products/categories/`, {
      name: name,
    });
  },

  getProducts(isArchived = false) {
    let url = `${serverUrl}/api/products/`;
    if (isArchived !== undefined && isArchived !== null) {
      url += `?archived=${isArchived}`;
    }

    return instance.get(url);
  },

  createProduct(obj) {
    return instance.post(`${serverUrl}/api/products/`, obj);
  },

  patchProduct(productId, obj) {
    return instance.patch(
      `${serverUrl}/api/products/?product_id=${productId}`,
      obj
    );
  },

  deleteProduct(productId) {
    return instance.delete(
      `${serverUrl}/api/products/?product_id=${productId}`
    );
  },

  deleteProducts(idsArr) {
    return instance.delete(`${serverUrl}/api/products/multiple/`, {
      data: idsArr,
    });
  },

  getProductById(productId) {
    return instance.get(`${serverUrl}/api/products/${productId}/`);
  },

  uploadProductImg(productId, file) {
    const formData = new FormData();
    formData.append("file", file);

    return instance.post(
      `${serverUrl}/api/products/${productId}/upload-image/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  deleteProductImg(productId) {
    return instance.delete(
      `${serverUrl}/api/products/images/?image_id=${productId}`
    );
  },

  uploadProductFile(productId, file) {
    const formData = new FormData();
    formData.append("file", file);

    return instance.post(
      `${serverUrl}/api/products/${productId}/upload-file/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  deleteProductFile(fileId) {
    const formData = new FormData();
    formData.append("file", file);

    return instance.delete(
      `${serverUrl}/api/products/files/?file_id=${fileId}`
    );
  },
};
