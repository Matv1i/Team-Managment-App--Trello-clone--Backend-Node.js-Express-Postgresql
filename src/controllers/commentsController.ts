import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const createComment = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  try {
    const { id, text, taskId, userId } = req.body

    const createdComment = await prisma.comment.create({
      data: {
        id,
        text,
        taskId,
        userId,
      },
    })

    return res.status(200).json(createComment)
  } catch (error) {
    return res.status(500).json({ message: "Comment cant be created" })
  }
}

export const getComments = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  try {
    const { id } = req.params

    const comments = await prisma.comment.findMany({
      where: {
        taskId: id,
      },
      include: {
        user: true,
        task: true,
      },
    })

    if (!comments) {
      return res.status(400).json({ message: "Cant find comments" })
    }

    return res.status(200).json(comments)
  } catch (error) {
    return res.status(500)
  }
}
