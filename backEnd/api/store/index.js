"use strict";
const express = require("express");
const controller = require("./store.controller");
const router = express.Router();

router.post("/order",controller.orderProduct);
router.get("/", controller.getAllproducts);
router.get("/:id", controller.getProduct);
router.post("/", controller.createProduct);
router.put("/:id", controller.updateProduct);
router.delete("/",controller.deleteProduct)
router.get("/search", controller.searchProducts);
router.post("/count", controller.customerCount);
router.get("/order/list", controller.orderPurchaseList)

module.exports = router;
