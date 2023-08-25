const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema(
    {
      month: { type: String, required: [true, "Please provide a month"] },
      year: { type: String, required: [true, "Please provide a year"] },
      bills: {
        type: [String]
      },
      count: {
        type: Number
      }
    },
    { timestamps: true }
  );
const Data = mongoose.model("Data", DataSchema);
module.exports = Data;