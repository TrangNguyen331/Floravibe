import { FETCH_PRODUCTS_SUCCESS, UPDATE_PRODUCTS } from "../actions/productActions";

const initState = {
  products: []
};

const productReducer = (state = initState, action) => {
  switch (action.type) {
    case UPDATE_PRODUCTS:
      return {
        ...state,
        products: action.payload,
      };
    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        products: action.payload,
      };
    // Other cases for different actions can be added here
    default:
      return state;
  }
};

export default productReducer;
