import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
const prisma = new PrismaClient()
const SECRET_KEY = process.env.SECRET_KEY as string
export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await prisma.team.findMany()

    const teamsWithUsernames = Promise.all(
      teams.map(async (team: any) => {
        const productOwner = await prisma.user.findUnique({
          where: {
            userId: team.productOwnerUserId!,
          },
          select: {
            username: true,
          },
        })
        const projectManager = await prisma.user.findUnique({
          where: { userId: team.projectManagerUserId },
          select: { username: true },
        })
        return {
          ...team,
          productOwnerUsername: productOwner?.username,
          projectManagerUsername: projectManager?.username,
        }
      })
    )
    res.json(teamsWithUsernames)
  } catch (error) {
    res.status(500).json({ message: "Error retrieving teams" })
  }
}

export const changeTeam = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  try {
    const { userId, teamId } = req.body

    const user = await prisma.user.update({
      where: {
        userId,
      },
      data: {
        teamId,
      },
    })
    if (!user) {
      return res.status(500).json({ message: "User wasnt found!" })
    }
    const token = jwt.sign(
      {
        userId: user?.userId,
        username: user?.username,
        teamId: user?.teamId,
      },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    )
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
    })

    return res.status(200).json({ user })
  } catch (error) {
    res.status(500).json({ message: "Error retrieving teams" })
  }
}

export const getTeamById = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  try {
    const { teamId } = req.params

    const team = await prisma.team.findFirst({
      where: {
        id: teamId,
      },
    })
    if (!team) {
      return res.status(500).json({ message: "Team wasnt found!" })
    }
    return res.status(200).json(team)
  } catch (error) {
    res.status(500).json({ message: "Error retrieving teams" })
  }
}

export const createTeam = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  try {
    const { teamName, productOwnerUserId, projectManagerUserId } = req.body

    const team = await prisma.team.create({
      data: {
        teamName,
        productOwnerUserId,
        projectManagerUserId,
      },
    })
    if (!team) {
      return res.status(500).json({ message: "Team wasnt found!" })
    }

    await prisma.user.update({
      where: {
        userId: productOwnerUserId,
      },
      data: {
        teamId: team.id,
      },
    })
    return res.status(200).json({ team })
  } catch (error) {
    res.status(500).json({ message: "Error retrieving teams" })
  }
}

export const deleteTeam = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  const { teamId, userId } = req.body

  try {
    // Шаг 1. Найти команду, чтобы проверить, существует ли она
    const team = await prisma.team.findFirst({
      where: {
        id: teamId,
      },
    })

    if (!team) {
      return res.status(404).json({ message: "Team not found" })
    }

    // Шаг 2. Удалить все проекты, связанные с командой
    const projectIds = await prisma.projectTeam
      .findMany({
        where: { teamId },
        select: { projectId: true },
      })
      .then((projects) => projects.map((p) => p.projectId))

    // Удалить все связанные задачи (Task) и связанные с ними данные (Attachments, Comments)
    await prisma.comment.deleteMany({
      where: { taskId: { in: projectIds } },
    })

    await prisma.attachment.deleteMany({
      where: { taskId: { in: projectIds } },
    })

    await prisma.taskAssignment.deleteMany({
      where: { taskId: { in: projectIds } },
    })

    await prisma.task.deleteMany({
      where: { projectId: { in: projectIds } },
    })
    await prisma.user.update({
      where: {
        userId,
        teamId,
      },
      data: {
        teamId: null,
      },
    })

    // Удалить проекты
    await prisma.projectTeam.deleteMany({
      where: { teamId },
    })

    await prisma.project.deleteMany({
      where: { id: { in: projectIds } },
    })

    // Шаг 3. Удалить саму команду
    const deletedTeam = await prisma.team.delete({
      where: { id: teamId },
    })

    return res.status(200).json({
      message: "Team and related data deleted successfully",
      deletedTeam,
    })
  } catch (error) {
    console.error("Error deleting team and related data:", error)
    return res
      .status(500)
      .json({ message: "An error occurred while deleting the team" })
  }
}

export const editTeam = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  try {
    const { id, teamName, projectManagerUserId } = req.body

    const team = await prisma.team.update({
      where: {
        id,
      },
      data: {
        teamName,
        projectManagerUserId,
      },
    })
    if (!team) {
      return res.status(500).json({ message: "Team wasnt found!" })
    }
    return res.status(200).json({ team })
  } catch (error) {
    res.status(500).json({ message: "Error retrieving teams" })
  }
}
