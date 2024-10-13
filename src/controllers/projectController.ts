import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const getProjects = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  try {
    const { teamId } = req.params

    const projectTeams = await prisma.projectTeam.findMany({
      where: {
        teamId,
      },
      include: {
        project: true,
      },
    })

    const projects = projectTeams.map((pt) => pt.project)

    console.log(projects)
    return res.status(200).json(projects)
  } catch (error) {
    console.error("Ошибка при получении проектов:", error)
    return res.status(500).json({ message: "Ошибка при получении проектов" })
  }
}
export const createProject = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { name, description, startDate, endDate, userId } = req.body
  console.log(req.body)
  try {
    const user = await prisma.user.findFirst({
      where: {
        userId,
      },
    })

    if (user) {
      const project = await prisma.project.create({
        data: {
          name,
          description,
          startDate,
          endDate,
        },
      })
      if (user.teamId !== null) {
        const projectTeam = await prisma.projectTeam.create({
          data: {
            teamId: user.teamId,
            projectId: project.id,
          },
        })
        return res.status(200).json({ projectTeam })
      }
    } else {
      return res.status(400)
    }
  } catch (error: any) {
    res.status(500).json({
      message: `Error creating project. Error:${error}`,
    })
  } finally {
    console.log(req.body)
  }
}

export const getProjectId = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  try {
    const { teamId } = req.params

    const project = await prisma.projectTeam.findFirst({
      where: {
        teamId,
      },
    })
    if (!project) {
      return res.status(403)
    }

    res.status(201).json(project?.projectId)
  } catch (error: any) {
    res.status(500).json({
      message: `Error creating project. Error:${error}`,
    })
  }
}
