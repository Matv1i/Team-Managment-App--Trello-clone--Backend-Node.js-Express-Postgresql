"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userControllers_1 = require("../controllers/userControllers");
const router = (0, express_1.Router)();
router.get("/", userControllers_1.getUsers);
router.post("/register", userControllers_1.createUser);
router.post("/login", userControllers_1.loginUser);
router.get("/getUser", userControllers_1.getCurrentUserInfo);
router.post("/cookies", userControllers_1.deleteCookies);
router.get("/:teamId", userControllers_1.getUsersByTeamId);
exports.default = router;
