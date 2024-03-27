const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
},
{
  timestamps: true,
});

module.exports = model("Posts", postSchema);
