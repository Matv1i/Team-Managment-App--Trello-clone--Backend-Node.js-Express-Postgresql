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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectId = exports.createProject = exports.getProjects = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teamId } = req.params;
        const projectTeams = yield prisma.projectTeam.findMany({
            where: {
                teamId,
            },
            include: {
                project: true,
            },
        });
        const projects = projectTeams.map((pt) => pt.project);
        console.log(projects);
        return res.status(200).json(projects);
    }
    catch (error) {
        console.error("Ошибка при получении проектов:", error);
        return res.status(500).json({ message: "Ошибка при получении проектов" });
    }
});
exports.getProjects = getProjects;
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, startDate, endDate, userId } = req.body;
    console.log(req.body);
    try {
        const user = yield prisma.user.findFirst({
            where: {
                userId,
            },
        });
        if (user) {
            const project = yield prisma.project.create({
                data: {
                    name,
                    description,
                    startDate,
                    endDate,
                },
            });
            if (user.teamId !== null) {
                const projectTeam = yield prisma.projectTeam.create({
                    data: {
                        teamId: user.teamId,
                        projectId: project.id,
                    },
                });
                return res.status(200).json({ projectTeam });
            }
        }
        else {
            return res.status(400);
        }
    }
    catch (error) {
        res.status(500).json({
            message: `Error creating project. Error:${error}`,
        });
    }
    finally {
        console.log(req.body);
    }
});
exports.createProject = createProject;
const getProjectId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teamId } = req.params;
        const project = yield prisma.projectTeam.findFirst({
            where: {
                teamId,
            },
        });
        if (!project) {
            return res.status(403);
        }
        res.status(201).json(project === null || project === void 0 ? void 0 : project.projectId);
    }
    catch (error) {
        res.status(500).json({
            message: `Error creating project. Error:${error}`,
        });
    }
});
exports.getProjectId = getProjectId;
