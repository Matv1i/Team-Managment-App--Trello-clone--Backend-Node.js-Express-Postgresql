import { Router } from "express"
import {
  changeTeam,
  getTeamById,
  getTeams,
} from "../controllers/teamControllers"

const router = Router()

router.get("/", getTeams)
router.patch("/", changeTeam)
router.get("/:teamId", getTeamById)

export default router
