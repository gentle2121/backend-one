const mongoose = require("mongoose");
const SampleSchema = mongoose.Schema(
  {
    ptitle: {
      type: String,
      required: true,
    },
    
  
   },

  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Sample",SampleSchema);
