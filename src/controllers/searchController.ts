import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
//Unused endpoint Global search
export const search = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query
  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { title: { contains: query as string } },
          { description: { contains: query as string } },
        ],
      },
    })

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: query as string } },
          { description: { contains: query as string } },
        ],
      },
    })
    const users = await prisma.user.findMany({
      where: {
        OR: [{ username: { contains: query as string } }],
      },
    })
    res.json({
      tasks,
      projects,
      users,
    })
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tasks" })
  }
}

export const searchTeams = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { query } = req.query

  try {
    // Ищем команды по запросу
    const teams = await prisma.team.findMany({
      where: {
        OR: [
          { id: { contains: query as string } },
          { teamName: { contains: query as string } },
        ],
      },
      include: {
        // Включаем информацию о проектном менеджере команды
        projectManager: true, // Включаем информацию о менеджере команды
        user: true, // Включаем всех пользователей команды
      },
    })

    // Подготавливаем ответ с необходимыми полями
    const response = teams.map((team) => {
      return {
        id: team.id,
        teamName: team.teamName, // Имя команды
        projectManager: team.projectManager
          ? team.projectManager.username
          : "Manager not found", // Имя менеджера команды
        userCount: team.user.length, // Количество пользователей в команде
      }
    })

    console.log("respone", response)
    res.json(response) // Возвращаем ответ с информацией
  } catch (error) {
    console.error("Ошибка при получении информации о командах:", error)
    res
      .status(500)
      .json({ message: "Ошибка при получении информации о командах" })
  }
}
