import express from "express"

import dotenv from "dotenv"

import morgan from "morgan"
import helmet from "helmet"
import cors from "cors"
import bodyParser from "body-parser"
import projectRoutes from "./routes/projectRoutes"
import taskRoutes from "./routes/taskRoutes"
import searchRoutes from "./routes/searchRoutes"
import userRoutes from "./routes/userRoutes"
import teamsRoutes from "./routes/teamsRoutes"

dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(morgan("common"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

app.get("/", (req, res) => {
  res.send("This is home route")
})

const PORT = Number(process.env.PORT)

app.use("/projects", projectRoutes)
app.use("/tasks", taskRoutes)
app.use("/search", searchRoutes)
app.use("/users", userRoutes)
app.use("/teams", teamsRoutes)

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server runnig out port ${PORT}`)
})
