import * as taskService from '../services/task.service.js';

export async function createTaskController(req, res, next) {
  try {
    const task = await taskService.createTask(req.user.id, req.body);
    return res.status(201).json({ task });
  } catch (error) {
    return next(error);
  }
}

export async function listTasksController(req, res, next) {
  try {
    const tasks = await taskService.listTasks(req.user.id);
    return res.status(200).json({ tasks });
  } catch (error) {
    return next(error);
  }
}

export async function getTaskController(req, res, next) {
  try {
    const task = await taskService.getTaskById(req.user.id, req.params.id);
    return res.status(200).json({ task });
  } catch (error) {
    return next(error);
  }
}

export async function updateTaskController(req, res, next) {
  try {
    const task = await taskService.updateTask(req.user.id, req.params.id, req.body);
    return res.status(200).json({ task });
  } catch (error) {
    return next(error);
  }
}

export async function deleteTaskController(req, res, next) {
  try {
    await taskService.deleteTask(req.user.id, req.params.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}
