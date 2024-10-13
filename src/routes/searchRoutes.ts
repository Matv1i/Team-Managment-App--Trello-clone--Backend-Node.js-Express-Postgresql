import { Router } from "express"
import { search, searchTeams } from "../controllers/searchController"

const router = Router()

router.get("/", search) //Unused route
router.get("/teams", searchTeams)

export default router
