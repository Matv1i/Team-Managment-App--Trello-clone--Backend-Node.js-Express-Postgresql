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
    return res.status(200).json({ team })
  } catch (error) {
    res.status(500).json({ message: "Error retrieving teams" })
  }
}

export const createTeam = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  try {
    const { teamName, userId, projectManagerUserId } = req.params

    const team = await prisma.team.create({
      data: {
        teamName,
        productOwnerUserId: userId,
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
