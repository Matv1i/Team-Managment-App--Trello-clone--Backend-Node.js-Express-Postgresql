import express from "express"

import dotenv from "dotenv"

import morgan from "morgan"
import helmet from "helmet"
import cors from "cors"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import projectRoutes from "./routes/projectRoutes"
import taskRoutes from "./routes/taskRoutes"
import searchRoutes from "./routes/searchRoutes"
import userRoutes from "./routes/userRoutes"
import teamsRoutes from "./routes/teamsRoutes"
import commentsRoutes from "./routes/commentsRoutes"
import { authCheck } from "./middleware/authCheck"

dotenv.config()
const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(morgan("common"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
)

app.get("/", (req, res) => {
  res.send("This is home route")
})

const PORT = Number(process.env.PORT)

app.use("/projects", authCheck, projectRoutes)
app.use("/tasks", authCheck, taskRoutes)
app.use("/search", authCheck, searchRoutes)
app.use("/users", userRoutes)
app.use("/teams", authCheck, teamsRoutes)
app.use("/comments", authCheck, commentsRoutes)

app.listen(PORT, () => {
  console.log(`Server runnig out port ${PORT}`)
})
