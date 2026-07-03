const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");


const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("seller");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE PRODUCT
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const product = await Product.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      seller: req.user._id,
      image: `${BASE_URL}/uploads/${req.file.filename}`,
    });

    res.status(201).json(product);
  } catch (error) {
    console.log("CREATE PRODUCT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
    };

    // image 
    if (req.file) {
      updateData.image = `${process.env.BASE_URL}/uploads/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    
    res.status(500).json({ message: error.message });
  }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    //  image delete 
    if (product.image) {
      const imagePath = path.join(
        __dirname,
        "..",
        product.image.replace(process.env.BASE_URL, "")
      );

      fs.unlink(imagePath, (err) => {
        if (err) {
          console.log("Image delete error:", err.message);
        } else {
          console.log("Image deleted:", imagePath);
        }
      });
    }

    
    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Product + image deleted successfully",
    });

  } catch (error) {
    console.log("DELETE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      seller: req.user._id,
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 









exports.bulkCreateProducts = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Excel/CSV file is required" });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(sheet);

    const products = [];
    const failed = [];

    for (let i = 0; i < rows.length; i++) {
      const item = rows[i];

      if (
        !item.name ||
        !item.description ||
        !item.category ||
        !item.price ||
        !item.stock ||
        !item.image
      ) {
        failed.push({
          row: i + 2,
          reason: "Required fields are missing",
        });
        continue;
      }

      products.push({
        seller: req.user._id,
        name: item.name,
        description: item.description,
        category: item.category,
        price: Number(item.price),
        stock: Number(item.stock),
        image: item.image,
      });
    }

    if (products.length > 0) {
      await Product.insertMany(products);
    }

    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      created: products.length,
      failed,
    });
  } catch (error) {
    console.log("BULK CREATE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};