const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Review = require("../models/Review");


exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    

    if (!items || !items.length) {
      return res.status(400).json({ message: "Items required" });
    }

    const formattedItems = items.map((item) => {
      if (!item.product) {
        throw new Error("Product missing in items");
      }

      return {
        product: item.product,
        quantity: item.quantity,
      };
    });

    const order = await Order.create({
      customer: req.user._id,
      items: formattedItems,
      totalAmount,
    });

    res.status(201).json(order);
  } catch (error) {
    
    res.status(500).json({ message: error.message });
  }
};



exports.getMyOrders = async (req, res) => {
  try {
    

    const orders = await Order.find({
      customer: req.user._id,
    }).populate("items.product");

   

    //  GET ALL REVIEWS BY USER
    const reviews = await Review.find({
      user: req.user._id,
    });

    
    const reviewedProductIds = reviews.map((r) =>
      r.product.toString()
    );

    res.json({
      orders,
      reviewedProductIds,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getSellerOrders = async (req, res) => {
  try {
    
    const products = await Product.find({ seller: req.user._id });

    const productIds = products.map((p) =>
      new mongoose.Types.ObjectId(p._id)
    );

   
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

    res.json({
      orders: sellerOrders,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






exports.shipOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    console.log("order id",order)

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    
    if (order.orderStatus === "shipped") {
      return res.status(400).json({ message: "Already shipped" });
    }

    
    order.orderStatus = "shipped";
    await order.save();

   
    for (const item of order.items) {
      const productId = item.product;
      console.log(productId);

      await Product.findByIdAndUpdate(
        productId,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );

     
    }

    return res.json({
      message: "Order shipped & stock updated successfully",
      order,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};



exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product")
      .populate("customer");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.payOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        paymentStatus: "paid",
      },
      { new: true }
    );

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("customer", "name email")
      .populate("items.product", "name price image");

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



exports.deliverOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    
    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    if (order.orderStatus !== "shipped") {
      return res.status(400).json({
        message: "Order is not shipped yet",
      });
    }

    order.orderStatus = "delivered";

    await order.save();

    res.json({
      success: true,
      message: "Order delivered successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


exports.cancelOrder = async (req, res) => {
  try {
    console.log("hh")
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (order.orderStatus !== "processing") {
      return res.status(400).json({
        message: "Cannot cancel this order",
      });
    }

    order.orderStatus = "cancelled";
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.rejectOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        orderStatus: "rejected",
      },
      { new: true }
    );

    res.json(order);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};



exports.returnOrder = async (req, res) => {
  try {
    const reason = req.body?.reason;

    if (!reason) {
      return res.status(400).json({
        message: "Return reason is required",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (order.orderStatus !== "delivered") {
      return res.status(400).json({
        message: "Only delivered orders can be returned",
      });
    }

    order.returnStatus = "requested";
    order.returnReason = reason;

    await order.save();

    res.json({
      success: true,
      message: "Return requested successfully",
      order,
    });

  } catch (error) {
    console.log("RETURN ERROR:", error); 
    res.status(500).json({ message: error.message });
  }
};

exports.acceptReturn = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.returnStatus = "accepted";
    order.orderStatus = "returned";
    order.paymentStatus = "refunded";


    await order.save();

    res.json({
      success: true,
      message: "Return accepted",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.rejectReturn = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    
    if (order.returnStatus !== "requested") {
      return res.status(400).json({
        message: "No return request found",
      });
    }

    order.returnStatus = "rejected";

    await order.save();

    res.json({
      success: true,
      message: "Return rejected",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

