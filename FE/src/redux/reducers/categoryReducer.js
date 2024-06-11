import {
  CLEAR_SELECTED_CATEGORY,
  SET_SELECTED_CATEGORY,
} from "../actions/categoryActions";

const initialState = {
  selectedCategory: null,
};

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_CATEGORY:
      return {
        ...state,
        selectedCategory: action.payload,
      };
    case CLEAR_SELECTED_CATEGORY:
      return {
        ...state,
        selectedCategory: "",
      };
    default:
      return state;
  }
};

export default categoryReducer;
