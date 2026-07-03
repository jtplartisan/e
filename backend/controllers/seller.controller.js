const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart=require("../models/Cart")

exports.getSellerProducts = async (req, res) => {
  const products = await Product.find({
    seller: req.user._id,
  });

  res.json(products);
};

exports.getSellerOrders = async (req, res) => {
  try {
    

    const sellerProducts = await Product.find({ seller: req.user._id });



    const productIds = sellerProducts.map((p) => p._id);

    console.log("PRODUCT IDS:", productIds);

    const orders = await Order.find({})
      .populate("items.product")
      .populate("customer");

   

    const sellerOrders = orders.filter((order) =>
      order.items.some((item) =>
        productIds.some((id) =>
          id.toString() === item.product?._id?.toString()
        )
      )
    );

    

    res.json({ orders: sellerOrders });     

  } catch (error) {
    console.log(" ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.shipOrder = async (req, res) => {
  try {
    
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus === "shipped") {
      return res.status(400).json({ message: "Already shipped" });
    }

    // update status
    order.orderStatus = "shipped";
    await order.save();

    // stock decrease
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    res.json({
      message: "Order shipped & stock updated",
      order,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


cartItems=async()=>{
  

  try{
    const userId="6a3e6c865bb5dfca7167ac03";
    const items=Cart.findById(userId)
    for(const item of items)
    console.log(item);


  }

  catch{

  }
}

cartItems()