

 const express = require("express");
const { NewUser, GetAllUser, GetSingleUser, UpdateSingleUser, DeleteSingleUser, LoginUser } = require("../CONTROLLER/Usercontroller");
  
  const router=express.Router();

 router.post("/", NewUser);
router.post("/login", LoginUser);

   router.get("/", GetAllUser);
 router.get("/:id", GetSingleUser);
 router.put("/:id", UpdateSingleUser);
 router.delete("/:id", DeleteSingleUser );





  module.exports = router;