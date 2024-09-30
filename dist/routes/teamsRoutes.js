"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teamControllers_1 = require("../controllers/teamControllers");
const router = (0, express_1.Router)();
router.get("/", teamControllers_1.getTeams);
exports.default = router;
