import * as taskRepo from '../repositories/task.repository.js';

export async function createTask(userId, data) {
  return taskRepo.createTask(userId, data);
}

export async function listTasks(userId) {
  return taskRepo.listTasks(userId);
}

export async function getTaskById(userId, taskId) {
  const task = await taskRepo.findTask(userId, taskId);
  if (!task) {
    const error = new Error('Task not found');
    error.status = 404;
    throw error;
  }
  return task;
}

export async function updateTask(userId, taskId, data) {
  const task = await taskRepo.updateTask(userId, taskId, data);
  if (!task) {
    const error = new Error('Task not found');
    error.status = 404;
    throw error;
  }
  return task;
}

export async function deleteTask(userId, taskId) {
  const deleted = await taskRepo.deleteTask(userId, taskId);
  if (!deleted) {
    const error = new Error('Task not found');
    error.status = 404;
    throw error;
  }
}
