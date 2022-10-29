const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      res.status(400).json({ error: "Category not found" });
    }
    req.category = category;
    next();
  });
};

exports.createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    const savedCategory = await category.save();
    if (!savedCategory)
      return res
        .status(400)
        .json({ error: "Error in creating in new Category" });
    return res.status(200).json(savedCategory);
  } catch (e) {
    console.log(e);
  }
};

exports.getCategory = (req, res) => {
  res.json(req.category);
};

exports.getAllCategories = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err || !categories) {
      return res.status(400).json({ error: "Categories not found in the DB" });
    }
    return res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  Category.findByIdAndUpdate(
    { _id: req.category._id },
    { $set: req.body },
    { new: true }
  ).exec((err, updatedCategory) => {
    if (err || !updatedCategory) {
      res.status(400).json({
        error: "Not able to update in DB",
      });
    }
    res.json(updatedCategory);
  });
};


exports.deleteCategory = (req,res) => {
    Category.findByIdAndDelete({_id:req.category._id}).exec((err,deletedCategory) => {
        if (err) {
            res.status(400).json({error:"Error in deleting the category"})
        }
        return res.json({successMsg:"Successfully deleted"})
    })
}
