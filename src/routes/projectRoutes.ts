import e, { Router } from "express"
import {
  getProjects,
  createProject,
  getProjectId,
} from "../controllers/projectController"

const router = Router()

router.get("/:teamId", getProjects)
router.post("/", createProject)
router.get("/projectId/:teamId", getProjectId)

export default router
