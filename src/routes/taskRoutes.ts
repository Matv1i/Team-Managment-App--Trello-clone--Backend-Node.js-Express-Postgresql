import { Router } from "express"
import {
  getTasks,
  createTask,
  updateTaskStatus,
  getUserTasks,
  deleteTask,
} from "../controllers/taskController"

const router = Router()

router.get("/", getTasks)
router.delete("/", deleteTask)
router.post("/", createTask)
router.patch("/:taskId/status", updateTaskStatus)
router.get("/user/:userId", getUserTasks)
export default router
