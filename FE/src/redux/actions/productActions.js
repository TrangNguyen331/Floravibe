import axiosInstance from "../../axiosInstance";

export const FETCH_PRODUCTS_SUCCESS = "FETCH_PRODUCTS_SUCCESS";
export const UPDATE_PRODUCTS = "UPDATE_PRODUCTS";

export const fetchProductsSuccess = (products) => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload: products,
});

// fetch products
export const fetchProducts = () => {
  return (dispatch) => {
    axiosInstance.get(`/api/v1/products/allProducts`).then((response) => {
      dispatch(fetchProductsSuccess(response.data));
    });
  };
};
export const updateProducts = (newProducts) => ({
  type: UPDATE_PRODUCTS,
  payload: newProducts,
});
