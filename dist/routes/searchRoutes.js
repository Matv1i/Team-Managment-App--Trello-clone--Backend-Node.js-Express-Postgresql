"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const searchController_1 = require("../controllers/searchController");
const router = (0, express_1.Router)();
router.get("/", searchController_1.search);
router.get("/teams", searchController_1.searchTeams);
exports.default = router;
