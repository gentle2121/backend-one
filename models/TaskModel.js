const mongoose = require("mongoose");
const {ObjectId}=mongoose.Schema.Types;
const TaskSchema = mongoose.Schema(
  {
    projectTitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
      minlenght: 5,
      maxlength: 1000,
    },
assignedby:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User",
  required:true,
},


    assignedTo: {
      type: String,
      required: [true, "Pls input field is required "],
    },
    projectLink: {
      type: String,
      required: false,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Ongoing", "Completed"],
      default: "Pending",
    },
  //    orders:{
  //        type:[
  //            {
  //                productId:{
  //                    type:String
  //                }
  //            }
  //        ]
  //    }
  //    profilePix:{
  //    type:String,
  //    required:false,
  //    default:"https://avatar/img/djdj"
  //    }
   },

  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Task",TaskSchema);
