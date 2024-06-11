export const SET_SELECTED_CATEGORY = "SET_SELECTED_CATEGORY";
export const CLEAR_SELECTED_CATEGORY = "CLEAR_SELECTED_CATEGORY";
export const setSelectedCategory = (category) => ({
  type: SET_SELECTED_CATEGORY,
  payload: category,
});
export const clearSelectedCategory = () => ({
  type: CLEAR_SELECTED_CATEGORY,
});
