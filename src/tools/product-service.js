import axios from 'axios';
  const apiURL = "http://localhost:3002/api"
  class Product {
    listProduct = () => {
    return axios.get(`${apiURL}/store`)
    .then( response =>response.data.response)
    .catch(error => error );
    };
    
    addProduct = (productInfo) => {
    return axios.post(`${apiURL}/store`, productInfo)
    .then( response =>response.data.response)
    .catch(error => error );
    };
    editProduct = (id, productInfo) => {
        return axios.put(`${apiURL}/store/${id}`, productInfo)
        .then(productInfo => productInfo)
        .catch(err => err);
    };
    purchaseProduct(state){
        return axios.post(`${apiURL}/store/order/`,state)
        .then(productInfo => productInfo)
        .catch(err => err);
    }
        
    deleteProduct  = (id) => {
        return axios.delete(`${apiURL}/store/`, {
        headers: {
            "Content-Type":"application/json"
        },
        data: {
            id: id
        }
    }).then( response =>response)
    .catch(error => error );
    }
  }
  export default new Product();