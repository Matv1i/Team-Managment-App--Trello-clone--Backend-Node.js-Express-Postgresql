import { NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
const SECRET_KEY = process.env.SECRET_KEY as string

export const authCheck = (req: any, res: any, next: NextFunction) => {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ message: "Access denied." })
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload

    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" })
  }
}
