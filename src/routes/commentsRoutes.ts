import e, { Router } from "express"
import { createComment, getComments } from "../controllers/commentsController"

const router = Router()

router.post("/", createComment)
router.get("/:id", getComments)

export default router
