import { makeAutoObservable, runInAction } from "mobx";
import ProductsService from './API/api.products';


class ProductsStore {
  productsNA = [];
  productsA = [];
  categories = [];
  categoriesObj = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setProductsNA(arr) {
    this.productsNA = arr;
  }

  setProductsA(arr) {
    this.productsA = arr;
  }

  setCategories(arr) {
    this.categories = arr;
  }

  setCategoriesObj(arr) {
    this.categoriesObj = arr;
  }

  async getCategories() {
    try {
      const resp = await ProductsService.getCategories();
      const newCategoriesObj = resp.data.reduce((acc, category) => {
        acc[category.name] = category.id;
        return acc;
      }, {});
      this.setCategoriesObj(newCategoriesObj);
      const newCategories = Object.keys(newCategoriesObj);
      this.setCategories((prevCategories) => [
        ...new Set([...prevCategories, ...newCategories]),
      ]);
    } catch (e) {
      throw e;
    }
  }

  async deleteCategory(categoryId) {
    try {
      const resp = await ProductsService.deleteCategory(categoryId);
      this.setCategories((prevCategories) =>
        prevCategories.filter(
          (category) => categoriesObj[category] !== categoryId
        )
      );
      this.setCategoriesObj((prevCategoriesObj) => {
        const newCategoriesObj = { ...prevCategoriesObj };
        delete newCategoriesObj[
          Object.keys(newCategoriesObj).find(
            (key) => newCategoriesObj[key] === categoryId
          )
        ];
        return newCategoriesObj;
      });
    } catch (e) {
      throw e;
    }
  }

  async createCategory(name) {
    try {
      const resp = await ProductsService.createCategory(name);
      this.setCategories((prevCategories) => [...prevCategories, name]);
      this.setCategoriesObj((prevCategoriesObj) => ({
        ...prevCategoriesObj,
        [name]: response.data.id,
      }));
    } catch (e) {
      throw e;
    }
  }
}

export default new ProductsStore();