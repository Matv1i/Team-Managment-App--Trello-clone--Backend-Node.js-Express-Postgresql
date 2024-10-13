import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { error } from "console"

import jwt from "jsonwebtoken"

const prisma = new PrismaClient()
const SECRET_KEY = process.env.SECRET_KEY as string

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany()
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tasks" })
  }
}
export const getUsersByTeamId = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { teamId } = req.params
    const users = await prisma.user.findMany({
      where: {
        teamId,
      },
    })
    return res.json(users)
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tasks" })
  }
}

export const createUser = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  try {
    const body = req.body

    if (!body.email || !body.username || !body.password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const existUser = await prisma.user.findFirst({
      where: { email: body.email },
    })

    if (existUser) {
      return res.status(400).json({ message: "User already exist" })
    }
    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        username: body.username,
        password: body.password,
      },
    })

    const token = jwt.sign(
      {
        id: newUser.userId,
        username: newUser.username,
      },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    )

    console.log(token)

    return res.status(201).json({
      message: "User was created",
    })
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tasks" })
  }
}

export const loginUser = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const existUser = await prisma.user.findFirst({
      where: { email },
    })

    if (existUser?.password === password) {
      if (existUser) {
        await prisma.team.create({
          data: {
            teamName: "Test2Test",
            productOwnerUserId: existUser.userId,
            projectManagerUserId: existUser.userId,
          },
        })
      }

      console.log(existUser)

      const token = jwt.sign(
        {
          userId: existUser?.userId,
          username: existUser?.username,
          teamId: existUser?.teamId,
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

      return res.json({ token })
    } else {
      return res.status(401).json({ message: "Logging went wrong" })
    }
  } catch (error) {
    res.status(500).json({ message: "Error authorization" })
  }
}

export const getCurrentUserInfo = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  try {
    const token = req.cookies.token
    console.log(token)

    if (!token) return res.status(401).json({ message: "Cannot find user" })

    const decodeToken = jwt.verify(token, SECRET_KEY)

    console.log(decodeToken)
    return res.status(201).json(decodeToken)
  } catch (error) {
    res.status(500).json({ message: "Happend error while searching for user" })
  }
}

export const deleteCookies = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token")
    res.end()
  } catch (error) {
    res.status(500).json({ message: "Happend error while searching for user" })
  }
}
