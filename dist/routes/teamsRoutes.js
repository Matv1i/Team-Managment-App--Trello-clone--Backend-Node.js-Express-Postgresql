"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teamControllers_1 = require("../controllers/teamControllers");
const router = (0, express_1.Router)();
router.get("/", teamControllers_1.getTeams);
router.patch("/", teamControllers_1.changeTeam);
router.get("/:teamId", teamControllers_1.getTeamById);
exports.default = router;
