"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editTeam = exports.deleteTeam = exports.createTeam = exports.getTeamById = exports.changeTeam = exports.getTeams = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY;
const getTeams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teams = yield prisma.team.findMany();
        const teamsWithUsernames = Promise.all(teams.map((team) => __awaiter(void 0, void 0, void 0, function* () {
            const productOwner = yield prisma.user.findUnique({
                where: {
                    userId: team.productOwnerUserId,
                },
                select: {
                    username: true,
                },
            });
            const projectManager = yield prisma.user.findUnique({
                where: { userId: team.projectManagerUserId },
                select: { username: true },
            });
            return Object.assign(Object.assign({}, team), { productOwnerUsername: productOwner === null || productOwner === void 0 ? void 0 : productOwner.username, projectManagerUsername: projectManager === null || projectManager === void 0 ? void 0 : projectManager.username });
        })));
        res.json(teamsWithUsernames);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving teams" });
    }
});
exports.getTeams = getTeams;
const changeTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, teamId } = req.body;
        const user = yield prisma.user.update({
            where: {
                userId,
            },
            data: {
                teamId,
            },
        });
        if (!user) {
            return res.status(500).json({ message: "User wasnt found!" });
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user === null || user === void 0 ? void 0 : user.userId,
            username: user === null || user === void 0 ? void 0 : user.username,
            teamId: user === null || user === void 0 ? void 0 : user.teamId,
        }, SECRET_KEY, {
            expiresIn: "1h",
        });
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 3600000,
        });
        return res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving teams" });
    }
});
exports.changeTeam = changeTeam;
const getTeamById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teamId } = req.params;
        const team = yield prisma.team.findFirst({
            where: {
                id: teamId,
            },
        });
        if (!team) {
            return res.status(500).json({ message: "Team wasnt found!" });
        }
        return res.status(200).json(team);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving teams" });
    }
});
exports.getTeamById = getTeamById;
const createTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teamName, productOwnerUserId, projectManagerUserId } = req.body;
        const team = yield prisma.team.create({
            data: {
                teamName,
                productOwnerUserId,
                projectManagerUserId,
            },
        });
        if (!team) {
            return res.status(500).json({ message: "Team wasnt found!" });
        }
        yield prisma.user.update({
            where: {
                userId: productOwnerUserId,
            },
            data: {
                teamId: team.id,
            },
        });
        return res.status(200).json({ team });
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving teams" });
    }
});
exports.createTeam = createTeam;
const deleteTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { teamId, userId } = req.body;
    try {
        // Шаг 1. Найти команду, чтобы проверить, существует ли она
        const team = yield prisma.team.findFirst({
            where: {
                id: teamId,
            },
        });
        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }
        // Шаг 2. Удалить все проекты, связанные с командой
        const projectIds = yield prisma.projectTeam
            .findMany({
            where: { teamId },
            select: { projectId: true },
        })
            .then((projects) => projects.map((p) => p.projectId));
        // Удалить все связанные задачи (Task) и связанные с ними данные (Attachments, Comments)
        yield prisma.comment.deleteMany({
            where: { taskId: { in: projectIds } },
        });
        yield prisma.attachment.deleteMany({
            where: { taskId: { in: projectIds } },
        });
        yield prisma.taskAssignment.deleteMany({
            where: { taskId: { in: projectIds } },
        });
        yield prisma.task.deleteMany({
            where: { projectId: { in: projectIds } },
        });
        yield prisma.user.update({
            where: {
                userId,
                teamId,
            },
            data: {
                teamId: null,
            },
        });
        // Удалить проекты
        yield prisma.projectTeam.deleteMany({
            where: { teamId },
        });
        yield prisma.project.deleteMany({
            where: { id: { in: projectIds } },
        });
        // Шаг 3. Удалить саму команду
        const deletedTeam = yield prisma.team.delete({
            where: { id: teamId },
        });
        return res.status(200).json({
            message: "Team and related data deleted successfully",
            deletedTeam,
        });
    }
    catch (error) {
        console.error("Error deleting team and related data:", error);
        return res
            .status(500)
            .json({ message: "An error occurred while deleting the team" });
    }
});
exports.deleteTeam = deleteTeam;
const editTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, teamName, projectManagerUserId } = req.body;
        const team = yield prisma.team.update({
            where: {
                id,
            },
            data: {
                teamName,
                projectManagerUserId,
            },
        });
        if (!team) {
            return res.status(500).json({ message: "Team wasnt found!" });
        }
        return res.status(200).json({ team });
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving teams" });
    }
});
exports.editTeam = editTeam;
