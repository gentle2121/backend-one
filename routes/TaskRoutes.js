

 const express = require("express");
  const {CreateTask, GetAllTask, GetSingleTask, UpdateSingleTask, DeleteSingleTask} = require ("../CONTROLLER/TaskController");

  const router=express.Router();

 router.post("/", CreateTask);

  router.get("/", GetAllTask);
router.get("/:id", GetSingleTask);
router.put("/:id", UpdateSingleTask);
router.delete("/:id", DeleteSingleTask);





  module.exports = router;