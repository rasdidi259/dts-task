/**
 * author       : Applicant
 * date         : 30/01/2026
 * decription   : Task Route for CRUD
 */


const { express } = require('../config/setupmodules')
const router = express.Router();
const { Task, validate } = require('../model/task');
const validateObjectId = require('../middleware/validateObjectId');


// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json({ message: "Tasks retrieved successfully", data: tasks });
  } catch (err) {
    res.json({ message: err });
  }
});

// Create a new task
router.post('/', async (req, res) => {

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message); // 400 - Bad Request

  const { title, description, status, dueDate } = req.body;
  let task = new Task({ title, description, status, dueDate });

  try {
    const savedTask = await task.save();
    res.json({ message: "Added new task successfully.", data: savedTask }).status(201);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// Retrieve task by ID
router.get("/:id", async (req, res) => {
  
  try {
    const tasks = await Task.findById(req.params.id) // Await the promise
    res.json({ message: `Task retreived by ID ${req.params.id} successfully.`, data: tasks }).status(200);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update task status "/:id/:status"
router.patch("/:id", async (req, res) => {

  try {
    // Find document and update it and return the task object
    const task = await Task.findByIdAndUpdate(req.params.id, {
      $set: {
        status: req.body.status
      }
    }, { new: true });

    if (!task) return res.status(404).send(`The task with the given ID ${req.params.id} was not found.`); // 404 - Not Found

    res.json({ message: "Task updated successfully", data: task }).status(200);
  } catch (error) {
    res.json({ message: error.message }).status(400);
  }
});

// Delete task
router.delete("/:id", validateObjectId, async (req, res) => {

  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).send(`The task with the given ID ${req.params.id} was not found.`); // 404 - Not Found
  res.status(200).json({ message: "Task deleted successfully", data: task });
});


module.exports = router;