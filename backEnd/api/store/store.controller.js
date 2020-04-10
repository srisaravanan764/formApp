const sendRsp = require("../../utils/response").sendRsp;
const MSG = require("../../config/message");
const productService = require("./storeService.js");
//Retrieving a Store by ID and Retrieving list of products
const getAllproducts = async (req, res) => {
    
    try{
        const getAllproductsData = await productService.getAllProductData();
        return sendRsp(res,"200","get users data successfully",getAllproductsData);
    }catch(err){
        return sendRsp(res,"400","get users data failed",err);
    }

};

//get one story information
const getProduct = async (req, res) => {
    try{
            const getAllproductsData = await productService.getProductData(req.params.id);
            console.log("getAllproductsData" ,getAllproductsData)
            return sendRsp(res,"200","get users data successfully",JSON.stringify(getAllproductsData));
        }catch(err){
            return sendRsp(res,"400","get users data failed",err);
        }
};

//Creating new story
const updateProduct = async (req, res) => {
    try{
        let Id = req.params.id ? req.params.id : "";
        if(!Id){
            return sendRsp(res,"400","missing params ID");  
        }
        const updateProductData = await productService.updateProductData(Id , req.body);
        return sendRsp(res,"200","Update Product successfully", updateProductData);
        }catch(err){
        return sendRsp(res,"400","Update Product failed",err);
        }    
};

const searchProducts = async (req, res) => {
    try{
    const searchproductsData = await productService.searchProducts(req);
    const respData = searchproductsData.length == 0 ? "No data match" : searchproductsData;
        return  sendRsp(res,"200","search users data successfully",{
        length : searchproductsData.length,
        data : respData
    });
    }catch(err){
        return sendRsp(res,"400","search users data failed",err);
    }
};

const customerCount = async (req, res) => { 
    try{
    const customerCountData = await productService.customerCount(req);
    const respData = customerCountData.length == 0 ? "No data match" : customerCountData;
        return sendRsp(res,"200","search users data successfully",{
        length : customerCountData.length,
        data : respData
    });
    }catch(err){
        return sendRsp(res,"400","search users data failed",err);
    }
};

//create product information
const createProduct =async (req, res) => {
    try{
        console.log("body info",req.body)
        const customerCountData = await productService.createProduct(req);
        const respData = customerCountData.length == 0 ? "No data match" : customerCountData;
            return sendRsp(res,"200","product data added successfully",{
            length : customerCountData.length,
            data : respData
        });
    }catch(err){
        return sendRsp(res,"400","product data failed",err);
    }
};

//delete data from product list
const deleteProduct = async (req,res) =>{
    try{
        const deleteProductData = await productService.deleteProduct(req.body.id);
            return sendRsp(res,"200","product data deleted successfully");
    }catch(err){
        return sendRsp(res,"400","product data failed",err);
    }
}
const orderProduct = async (req,res) => {
    try{
        const orderProduct = await productService.orderProduct(req.body);
        return sendRsp(res,"200","Purchase Product successfully", orderProduct);
    }catch(err){
        return sendRsp(res,"400","product purchase failed",err); 
    }
}
const orderPurchaseList = async (req,res) => {
    try{    
        const orderProduct = await productService.orderPurchaseList();
        return sendRsp(res,"200","Purchase Product successfully", orderProduct);
    }catch(err){
        return sendRsp(res,"400","product purchase gets  failed",err); 
    }
}

 module.exports = {
    getAllproducts,
    getProduct ,
    createProduct ,
    updateProduct,
    searchProducts,
    customerCount,
    deleteProduct,
    orderProduct,
    orderPurchaseList
 }


