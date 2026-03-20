/**
 * author       : Applicant
 * date         : 30/01/2026
 * decription   : Task Schema compiled into a Task Model
 */

const { Joi, mongoose } = require("../config/setupmodules");

const taskSchema = new mongoose.Schema({
  title:{
        type:String,
        required:true,
        trim:true,
        minlength:5,
        maxlength:50
    },
  description: {
    type: String
  },
  status:{
    type: String,
    enum : ['pending','in_progress', 'completed'],
    default: 'pending'
  },
  dueDate: {
    type: Date, 
    default: Date.now
  }
});

// Task
 const Task = mongoose.model('Task', taskSchema);


// Validate Task
function validateTask(task) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    description: Joi.string().optional(),
    status: Joi.string().valid('pending', 'in_progress', 'completed').default('pending'),
    dueDate: Joi.date().optional()
  });
  return schema.validate(task);
}

// Module Exports
exports.taskSchema = taskSchema;
exports.Task = Task;
exports.validate = validateTask;