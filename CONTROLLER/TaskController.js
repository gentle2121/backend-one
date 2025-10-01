const TaskModel = require("../models/TaskModel");

const CreateTask = async (req, res) => {
  const { projectTitle, assignedTo, description, startDate, endDate, assignedby } = req.body;

  try {
    // Validate description length
    if (description && description.length < 5) {
      return res.status(400).json({
        message: "Minimum length of description is 5 characters",
      });
    }
    if (description && description.length > 1000) {
      return res.status(400).json({
        message: "Maximum length of description is 1000 characters",
      });
    }

    // Check if task already exists for user
    const projectExist = await TaskModel.findOne({ projectTitle, assignedTo });
    if (projectExist) {
      return res.status(409).json({
        message: "Task already assigned to this user",
      });
    }

    // Create task
    const createNewTask = new TaskModel({
      projectTitle,
      assignedTo,
      description,
      startDate,
      endDate,
      assignedby,
    });

    const taskResult = await createNewTask.save();
    res.status(201).json(taskResult);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const GetAllTask = async (req, res) => {
  try {
    const result = await TaskModel.find().sort({ createdAt: -1 }).populate("assignedby");
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch data" });
  }
};

const GetSingleTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await TaskModel.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const UpdateSingleTask = async (req, res) => {
  const { id } = req.params;
  const {
    projectTitle,
    description,
    assignedTo,
    startDate,
    endDate,
    projectLink,
    status,
    isCompleted,
    assignedby,
  } = req.body;

  try {
    const task = await TaskModel.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (projectTitle) task.projectTitle = projectTitle;
    if (assignedTo) task.assignedTo = assignedTo;
    if (assignedby) task.assignedby = assignedby;
    if (description) task.description = description;
    if (startDate) task.startDate = startDate;
    if (endDate) task.endDate = endDate;
    if (projectLink) task.projectLink = projectLink;
    if (status) task.status = status;
    if (typeof isCompleted !== "undefined") task.isCompleted = isCompleted;

    await task.save();
    res.json(task);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const DeleteSingleTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await TaskModel.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  GetAllTask,
  CreateTask,
  GetSingleTask,
  UpdateSingleTask,
  DeleteSingleTask,
};
