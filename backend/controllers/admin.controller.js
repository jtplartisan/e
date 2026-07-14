const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");




exports.getAllUsers = async (req, res) => {
  const users = await User.find();

  res.json(users);
}; 




exports.blockUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  user.isBlocked = true;

  await user.save();

  res.json({
    success: true,
    message: "User blocked",
  });
};





exports.unblockUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  user.isBlocked = false; 

  await user.save();

  res.json({
    success: true,
    message: "User unblocked",
  });
};





exports.getDashboardStats = async (req, res) => {
  const totalCustomers = await User.countDocuments({
    role: "customer",
  });

  const totalSellers = await User.countDocuments({
    role: "seller",
  });

  const totalProducts = await Product.countDocuments();

  const totalOrders = await Order.countDocuments();

  res.json({  
    totalCustomers,         
    totalSellers,
    totalProducts,
    totalOrders,
  });
};   