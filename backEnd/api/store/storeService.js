const moment = require("moment");
const ProductModel = require("./store.model");
const orderPurchase = require("./order.model");
const getAllProductData = async () =>{
    try{
        let query ={};
        const getProducts = await ProductModel.find(query).exec();
        console.log("getProducts",getProducts)
        return getProducts;
    }catch(err){
        return err
    }
 }
const getProductData = async (id) =>{
    try{
        const getProducts = await ProductModel.findById({_id:id}).exec();
        console.log("getProducts",getProducts)
        return getProducts;
    }catch(err){
        return err
    }
}
const createProduct = async (req) =>{
    try{
    let fieldsData = {
        Name:req.body.Name ? req.body.Name : "",
        price : req.body.price ? parseInt(req.body.price) * parseInt(req.body.quantity) : 1 * parseInt(req.body.quantity), 
        quantity : req.body.quantity ? parseInt(req.body.quantity) : 1,
        description : req.body.description ? req.body.description : "",
        created_at :moment(),
        updated_at:moment()
    }  
    const getProducts = await ProductModel.create(fieldsData);
    return getProducts;
    }catch(err){
        console.log("err",err)
        return err
    }
}
 const updateProductData = async (Id,updateData) =>{
    try{
        delete updateData.apiURL;
        delete updateData.username;
        updateData.price =  updateData.price ? parseInt(updateData.price) * parseInt(updateData.quantity) : 1 * parseInt(updateData.quantity);
        updateData.updated_at = moment();
       // Object.assign(...updateData , {price : updateData.price ? parseInt(updateData.price) * parseInt(updateData.quantity) : 1 * parseInt(updateData.quantity), updated_at: moment()})
        const getProducts = await ProductModel.findByIdAndUpdate({_id:Id},{$set:updateData},{upsert:true,new:true}).exec();
        return getProducts;
    }catch(err){
        return err
    }
 }

 const searchProducts = async (req) =>{
    try{
        let query ={};
        if(req.query.Name){
            query={Name: { $regex:req.query.Name, $options: "i" }};
        };
        const getProducts = await ProductModel.find(query).limit(5).exec()
        return getProducts;
    }catch(err){
        return err
    }
 }

 const customerCount = async (req) =>{
    
    try{
        let query ={};
        if(req.query.Name){
            query={};
        };

         const getProducts =  await ProductModel.aggregate([
            {
                $lookup:
                {
                    from: 'product',    
                    localField: "Id",
                    foreignField: "category_id",
                    as: 'products'
                }
            },
            {
                "$group": { 
                    "_id": "$products",
                    "total": { "$sum": 1 }
                }
            },
            {
                $sort : {total : -1}
            },
            {
                $project:
                {
                    _id: 1,
                    name: 1,
                    number_of_product: { $size: "$products" }
                }
            }
        ]).exec();

    return getProducts;
    }catch(err){
        return err
    }
 }
 const deleteProduct = async (id) => {
    try{
        return await ProductModel.findByIdAndRemove({_id:id}).exec()
    }catch(err){
        return err
    }
}

const orderProduct = async (orderInsertData) =>{
    try{
        let fieldsData = {
            productName: orderInsertData.Name,
            username: orderInsertData.username,
            created_at :moment(),
            updated_at:moment()
        }  
        let orderData = await orderPurchase.create(fieldsData);
        return orderData;
    }catch(err){
        return err
    }
}
const orderPurchaseList = async () => {
    try{
        const getProducts =  await ProductModel.aggregate([
            {
                $lookup:
                {
                    from: "purchases",    
                    localField: "Name",
                    foreignField: "productName",
                    as: 'order'
                }
            }
        ]).exec();
    getProducts.map(data =>{
        if(data.order.length >0){
            return data
        }
    })
    getProducts = getProducts.filter(Boolean)
    return getProducts;
    }catch(err){
        return err
    }
}
 module.exports = {
    getAllProductData,
    getProductData,
    updateProductData,
    searchProducts,
    createProduct,
    customerCount,
    deleteProduct,
    orderPurchaseList,
    orderProduct
 }