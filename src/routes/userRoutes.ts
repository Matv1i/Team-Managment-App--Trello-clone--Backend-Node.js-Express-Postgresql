import { Router } from "express"
import {
  createUser,
  deleteCookies,
  getCurrentUserInfo,
  getUsers,
  getUsersByTeamId,
  loginUser,
} from "../controllers/userControllers"

const router = Router()

router.get("/", getUsers)
router.post("/register", createUser)
router.post("/login", loginUser)
router.get("/getUser", getCurrentUserInfo)
router.post("/cookies", deleteCookies)
router.get("/:teamId", getUsersByTeamId)

export default router
