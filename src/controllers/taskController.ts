import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.query
  try {
    const tasks = await prisma.task.findMany({
      where: {
        projectId: String(projectId),
      },
      include: {
        author: true,
        assignee: true,
        comments: true,
      },
    })

    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tasks" })
  }
}
export const deleteTask = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { id } = req.body
  console.log(req.body)
  try {
    const task = await prisma.task.findUnique({
      where: {
        id,
      },
    })

    if (!task) {
      return res.status(400).json({ message: "Task doesn't exist" })
    }

    await prisma.task.delete({
      where: { id },
    })

    return res.status(200)
  } catch (error) {
    res.status(500).json({ message: "Error deleting task" })
  }
}

export const createTask = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    projectId,
    authorUserId,
    assignedUserId,
  } = req.body
  console.log({
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    projectId,
    authorUserId,
    assignedUserId,
  })

  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        tags,
        startDate,
        dueDate,
        points,
        projectId,
        authorUserId,
        assignedUserId,
      },
    })
    return res.status(201).json(newTask)
  } catch (error: any) {
    return res.status(500).json({
      message: `Error creating task. Error:${error}`,
    })
  }
}

export const updateTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params
  const { status } = req.body
  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: String(taskId),
      },
      data: {
        status: status,
      },
    })
    res.status(201).json(updatedTask)
  } catch (error: any) {
    res.status(500).json({
      message: `Error updating task. Error:${error}`,
    })
  }
}

export const getUserTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params
  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { authorUserId: String(userId) },
          {
            assignedUserId: String(userId),
          },
        ],
      },
      include: {
        author: true,
        assignee: true,
      },
    })

    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users tasks" })
  }
}
