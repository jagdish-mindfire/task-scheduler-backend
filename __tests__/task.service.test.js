// task.service.test.js
const taskService = require('../services/task.service');
const taskRepository = require('../repository/task.repo'); // Mock repository
const { APIError } = require('../utils/custom-errors');
const constantErrors = require('../constants/errors');
const constantStrings = require('../constants/strings');

// Mock taskRepository
jest.mock('../repository/task.repo');

describe('Task Service', () => {
  const uid = 'user123';
  const taskId = 'task456';
  const taskData = { title: 'Test Task', description: 'Test Description', dueDate: new Date() };
  const dataToUpdate = { title: 'Updated Title' };

  afterEach(() => {
    jest.clearAllMocks(); // Ensure mocks are cleared between tests
  });

  // Test: getAllTasks
  describe('getAllTasks', () => {
    test('should return all tasks when tasks exist', async () => {
      const mockTasks = [{ id: 1, name: 'Test Task' }];
      taskRepository.getAllTasks.mockResolvedValue(mockTasks);

      const result = await taskService.getAllTasks({ uid, sort: 'asc' });

      expect(taskRepository.getAllTasks).toHaveBeenCalledWith({ uid, sort: 'asc' });
      expect(result).toEqual({ data: mockTasks });
    });

    test('should throw APIError when no tasks are found', async () => {
      taskRepository.getAllTasks.mockResolvedValue([]);

      await expect(taskService.getAllTasks({ uid, sort: 'asc' }))
        .rejects.toThrow(new APIError(constantErrors.NO_TASK_FOUND));

      expect(taskRepository.getAllTasks).toHaveBeenCalledWith({ uid, sort: 'asc' });
    });
  });

  // Test: getTask
  describe('getTask', () => {
    test('should return a task when it exists', async () => {
      const mockTask = { id: taskId, name: 'Test Task' };
      taskRepository.getTask.mockResolvedValue(mockTask);

      const result = await taskService.getTask({ uid, taskId });

      expect(taskRepository.getTask).toHaveBeenCalledWith({ uid, taskId });
      expect(result).toEqual({ task: mockTask });
    });

    test('should throw APIError when task is not found', async () => {
      taskRepository.getTask.mockResolvedValue(null);

      await expect(taskService.getTask({ uid, taskId }))
        .rejects.toThrow(new APIError(constantErrors.TASK_NOT_FOUND));

      expect(taskRepository.getTask).toHaveBeenCalledWith({ uid, taskId });
    });
  });

  // Test: createTask
  describe('createTask', () => {
    test('should return a success response with created task details', async () => {
      const mockCreatedTask = { _id: taskId, ...taskData };
      taskRepository.createTask.mockResolvedValue(mockCreatedTask);

      const result = await taskService.createTask({ uid, ...taskData });

      expect(taskRepository.createTask).toHaveBeenCalledWith({ uid, ...taskData });
      expect(result).toEqual({
        message: constantStrings.TASK_CREATED_SUCCESS,
        task_id: taskId,
        task: mockCreatedTask,
      });
    });
  });

  // Test: updateTask
  describe('updateTask', () => {
    test('should return success response with updated task', async () => {
      const mockUpdatedTask = { _id: taskId, ...dataToUpdate };
      taskRepository.updateTask.mockResolvedValue(mockUpdatedTask);

      const result = await taskService.updateTask({ taskId, uid, dataToUpdate });

      expect(taskRepository.updateTask).toHaveBeenCalledWith({ taskId, uid, dataToUpdate });
      expect(result).toEqual({
        message: constantStrings.TASK_UPDATED_SUCCESS,
        task: mockUpdatedTask,
      });
    });

    test('should throw APIError when task to update is not found', async () => {
      taskRepository.updateTask.mockResolvedValue(null);

      await expect(taskService.updateTask({ taskId, uid, dataToUpdate }))
        .rejects.toThrow(new APIError(constantErrors.TASK_NOT_FOUND));

      expect(taskRepository.updateTask).toHaveBeenCalledWith({ taskId, uid, dataToUpdate });
    });
  });

  // Test: deleteTask
  describe('deleteTask', () => {
    test('should return success response when task is deleted', async () => {
      taskRepository.deleteTask.mockResolvedValue({ deletedCount: 1 });

      const result = await taskService.deleteTask({ uid, taskId });

      expect(taskRepository.deleteTask).toHaveBeenCalledWith({ uid, taskId });
      expect(result).toEqual({ message: constantStrings.TASK_DELETE_SUCCESS });
    });

    test('should throw APIError when task to delete is not found', async () => {
      taskRepository.deleteTask.mockResolvedValue({ deletedCount: 0 });

      await expect(taskService.deleteTask({ uid, taskId }))
        .rejects.toThrow(new APIError(constantErrors.TASK_NOT_FOUND));

      expect(taskRepository.deleteTask).toHaveBeenCalledWith({ uid, taskId });
    });
  });
});
