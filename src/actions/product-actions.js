import { FETCH_PRODUCT, ADD_PRODUCT, EDIT_PRODUCT, DELETE_PRODUCT,PURCHASE_PRODUCT } from "../actions/action-type";
import {alertError, alertSuccess } from "./alert-actions";
import Product from "../tools/product-service";
export const listProduct = () => {
  return dispatch => {
    let productData = Product.listProduct();
    productData.then(productData => {
      return dispatch({
      type: FETCH_PRODUCT,
      payload: productData 
      })
    }).catch(productErr =>{
      return dispatch(alertError("product gets failed"));
    })
  };
};

export const addProduct = (productInfo) => {
  return dispatch => {
    let productData = Product.addProduct(productInfo);
    productData.then(productInfo =>{
      dispatch({
        type: ADD_PRODUCT,
        payload: productInfo 
        })
        return dispatch(
          alertSuccess("product added successfully ")
          
        );
    }).catch(productErr =>{
      return dispatch(alertError("product added failed"));
    })
  }; 
};
export const editProduct = (id,data) => {
  return dispatch => {
    let productData = Product.editProduct(id,data);
    productData.then(productInfo =>{
      dispatch({
        type: EDIT_PRODUCT,
        payload: productInfo 
        })
        return dispatch(
          alertSuccess("product modified successfully ")
          
        );
    }).catch(productErr =>{
      return dispatch(alertError("product modified failed"));
    })
  };
};
export const purchaseProduct = (state) =>{
  return dispatch => {
    let productData = Product.purchaseProduct(state);
    productData.then(productInfo =>{
      dispatch({
        type: PURCHASE_PRODUCT,
        payload: productInfo 
        })
        return dispatch(
          alertSuccess("product purchased successfully ")
          
        );
    }).catch(productErr =>{
      return dispatch(alertError("product purchased failed"));
    })
  };
}
export const deleteProduct = (id) => {
  return dispatch => {
    let productData = Product.deleteProduct(id);
    productData.then(productInfo =>{
      dispatch({
        type: DELETE_PRODUCT,
        payload: productInfo 
        })
        return dispatch(alertSuccess("product deleted successfully"));
    }).catch(productErr =>{
      return dispatch(alertError("product deleted failed"));
    })
  }; 
};
