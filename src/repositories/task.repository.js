import { prisma } from '../config/prisma.js';

export async function createTask(userId, data) {
  return prisma.task.create({
    data: {
      userId,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    },
  });
}

export async function listTasks(userId) {
  return prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findTask(userId, taskId) {
  return prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });
}

export async function updateTask(userId, taskId, data) {
  const updateData = { ...data };
  if (data.dueDate !== undefined) {
    updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  }

  const existing = await findTask(userId, taskId);
  if (!existing) {
    return null;
  }

  return prisma.task.update({
    where: { id: taskId },
    data: updateData,
  });
}

export async function deleteTask(userId, taskId) {
  const existing = await findTask(userId, taskId);
  if (!existing) {
    return false;
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  return true;
}
