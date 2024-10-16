"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commentsController_1 = require("../controllers/commentsController");
const router = (0, express_1.Router)();
router.post("/", commentsController_1.createComment);
router.get("/:id", commentsController_1.getComments);
exports.default = router;
