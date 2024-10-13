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
exports.createTeam = exports.getTeamById = exports.changeTeam = exports.getTeams = void 0;
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
        return res.status(200).json({ team });
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving teams" });
    }
});
exports.getTeamById = getTeamById;
const createTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teamName, userId, projectManagerUserId } = req.params;
        const team = yield prisma.team.create({
            data: {
                teamName,
                productOwnerUserId: userId,
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
exports.createTeam = createTeam;
