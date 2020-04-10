import { FETCH_PRODUCT, ADD_PRODUCT, EDIT_PRODUCT, DELETE_PRODUCT,PURCHASE_PRODUCT } from "../actions/action-type";

const initialState = {
    listProduct: [],
    message: "Default",
    variant: "success"
};

const productReducers =  (state = initialState, action) => {
    console.log("action ===>",action)
    switch(action.type) {
        case FETCH_PRODUCT:
            return {
                ...state,
                listProduct: action.payload,
                message: "Product data gets successfully",
                variant: "success"
            }
        case ADD_PRODUCT:
            return {
                ...state,
                addProduct: action.payload,
                message: "New Products Added",
                variant: "success"
            }
        case EDIT_PRODUCT:
            return {
                ...state,
                editProduct: action.payload,
                message: "Products Edited Successfully",
                variant: "info"
            }
        case DELETE_PRODUCT:
            return {
                ...state,
                deleteProduct: action.payload,
                message: "Products Deleted Successfully",
                variant: "error"
            }
        case PURCHASE_PRODUCT :
            return {
                ...state,
                purchaseProduct: action.payload,
                message: "Products purchased Successfully",
                variant: "info"
            }
        default:
            return state;
    }
}

export default productReducers;



