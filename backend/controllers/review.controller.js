const Review = require("../models/Review");


exports.addReview = async (req, res) => {
  try {
    const { product, rating, comment } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    const existingReview = await Review.findOne({
      user: req.user._id,
      product,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product.",
      });
    }

    const review = await Review.create({
      user: req.user._id,
      product,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



exports.getProductReviews = async (req, res) => {
  try {  
    const reviews = await Review.find({
      product: req.params.productId,
    }).populate("user", "name email");

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};














exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    review.rating = rating;
    review.comment = comment;

    await review.save();

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


