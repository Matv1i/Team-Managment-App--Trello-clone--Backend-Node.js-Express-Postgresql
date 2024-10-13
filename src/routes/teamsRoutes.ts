import { Router } from "express"
import {
  changeTeam,
  createTeam,
  deleteTeam,
  editTeam,
  getTeamById,
  getTeams,
} from "../controllers/teamControllers"

const router = Router()

router.get("/", getTeams)
router.patch("/", changeTeam)
router.get("/:teamId", getTeamById)
router.post("/", createTeam)
router.patch("/edit", editTeam)
router.delete("/delete/", deleteTeam)

export default router
