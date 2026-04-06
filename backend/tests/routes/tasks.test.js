/**
 * author       : Applicant
 * date         : 30/03/2026
 * decription   : Unit tests for the tasks route using Jest and Supertest. Tests cover all CRUD operations, including success and error scenarios. Mocks are used for the Task model and validation middleware to isolate route logic.
 *               Each test ensures proper status codes and response messages are returned based on the operation performed.
 */

const request = require('supertest');
const express = require('express');
const { Task, validate } = require('../../model/task');
const router = require('../../routes/tasks'); // Update to your actual path
const mongoose = require('mongoose');

const { validateObjectId } = require('../../middleware/validateObjectId'); // Update to your actual path
const e = require('connect-flash');

// 1. Mock the dependencies
jest.mock('../../model/task');
jest.mock('../../middleware/validateObjectId', () => (req, res, next) => next());

const app = express();
app.use(express.json());
app.use('/api/tasks', router);

describe('Tasks Router', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    it('should return all tasks and status 200', async () => {
      const mockTasks = [{ title: 'Task 1' }, { title: 'Task 2' }];
      Task.find.mockResolvedValue(mockTasks);

      const res = await request(app).get('/api/tasks');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.message).toMatch(/retrieved successfully/);
    });

    it('should return 500 if there is a server error', async () => {
      const errorMessage = 'Database error';
      Task.find.mockRejectedValue(new Error(errorMessage)); 

      const res = await request(app).get('/api/tasks');

      expect(res.status).toBe(500);
      expect(res.body.message).toBe(errorMessage.toString());
      expect(res.body.message).toBeDefined();   
    });

  });

  describe('POST /', () => {

    beforeEach(() => {
        // Reset all mocks to a clean state before every test
        jest.clearAllMocks();
    });

    afterEach(() => {
        // Optional: useful if you use jest.spyOn elsewhere
        jest.restoreAllMocks();
    });

    it('should return 400 if validation fails', async () => {
      // Simulate Joi validation error
      validate.mockReturnValue({ error: { details: [{ message: 'Title is required' }] } });

      const res = await request(app).post('/api/tasks').send({});

      expect(res.status).toBe(400);
      expect(res.text).toBe('Title is required');
    });

    it('should save and return the task with 201', async () => {
      validate.mockReturnValue({ error: null });
      const mockTask = { title: 'New Task', _id: '123' };
      
      // Mock the constructor save method
      Task.prototype.save = jest.fn().mockResolvedValue(mockTask);

      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'New Task' });

        expect(res.status).toBe(201);
        expect(res.body.data.title).toBe('New Task');
        expect(res.body.message).toBe("Added new task successfully.");
        expect(Task.prototype.save).toHaveBeenCalled();
    });

    it('should return 500 if there is a server error', async () => {
      validate.mockReturnValue({ error: null });
      const errorMessage = 'Database save error'; 
      Task.prototype.save = jest.fn().mockRejectedValue(new Error(errorMessage));

      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'New Task' });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe(errorMessage.toString());
      expect(res.body.message).toBeDefined();
      expect(Task.prototype.save).toHaveBeenCalled();

    });


  });

  describe('GET /:id', () => {
    it('should return 200 and the task if found', async () => {
      const mockTask = { _id: '123', title: 'Find Me' };
      Task.findById.mockResolvedValue(mockTask);

      const res = await request(app).get('/api/tasks/123');

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Find Me');
    });

    it('should return 500 if there is a server error', async () => {
      const errorMessage = 'Database error';
      Task.findById.mockRejectedValue(new Error(errorMessage)); 

      const res = await request(app).get('/api/tasks/123');

      expect(res.status).toBe(500);
      expect(res.body.message).toBe(errorMessage.toString());
      expect(res.body.message).toBeDefined();
      expect(Task.findById).toHaveBeenCalledWith('123');  
      
    });

  });

  describe('PATCH /:id', () => {

    // Clear mocks before each test to ensure no cross-test pollution
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Restore mock to original behavior if needed
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should return 404 if task does not exist', async () => {
      Task.findByIdAndUpdate.mockResolvedValue(null);

      const res = await request(app)
        .patch('/api/tasks/123')
        .send({ status: 'completed' });

      expect(res.status).toBe(404);
      expect(Task.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('should update task and return 200', async () => {
      const updatedTask = { _id: '123', status: 'completed' };
      Task.findByIdAndUpdate.mockResolvedValue(updatedTask);

      const res = await request(app)
        .patch('/api/tasks/123')
        .send({ status: 'completed' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('completed');
    });

    it('should return 400 if there is a server error', async () => {
      const errorMessage = 'Update error';
      Task.findByIdAndUpdate.mockRejectedValue(new Error(errorMessage));  

      const res = await request(app)
        .patch('/api/tasks/123')
        .send({ status: 'completed' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe(errorMessage.toString());
      expect(res.body.message).toBeDefined();
      expect(Task.findByIdAndUpdate).toHaveBeenCalled();  
    });

  });

  describe('DELETE /:id', () => {

    let taskId;

    beforeEach(() => {
        // Generate a valid Mongoose ObjectId for testing
        taskId = new mongoose.Types.ObjectId().toHexString();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Clean up mocks between tests
    });


    it('should delete and return the task with 200', async () => {
      const deletedTask = { _id: taskId, title: 'Gone' };
      Task.findByIdAndDelete.mockResolvedValue(deletedTask);

      const res = await request(app).delete(`/api/tasks/${taskId}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Task deleted successfully");
    });

    it('should return 404 if task not found', async () => {
      Task.findByIdAndDelete.mockResolvedValue(null);

      const res = await request(app).delete(`/api/tasks/${taskId}`);

      expect(res.status).toBe(404);
      expect(res.text).toContain(`The task with the given ID ${taskId} was not found.`);
    });

  });
});


