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
exports.searchTeams = exports.search = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.query;
    try {
        const tasks = yield prisma.task.findMany({
            where: {
                OR: [
                    { title: { contains: query } },
                    { description: { contains: query } },
                ],
            },
        });
        const projects = yield prisma.project.findMany({
            where: {
                OR: [
                    { name: { contains: query } },
                    { description: { contains: query } },
                ],
            },
        });
        const users = yield prisma.user.findMany({
            where: {
                OR: [{ username: { contains: query } }],
            },
        });
        res.json({
            tasks,
            projects,
            users,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving tasks" });
    }
});
exports.search = search;
const searchTeams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.query;
    try {
        // Ищем команды по запросу
        const teams = yield prisma.team.findMany({
            where: {
                OR: [
                    { id: { contains: query } },
                    { teamName: { contains: query } },
                ],
            },
            include: {
                // Включаем информацию о проектном менеджере команды
                projectManager: true, // Включаем информацию о менеджере команды
                user: true, // Включаем всех пользователей команды
            },
        });
        // Подготавливаем ответ с необходимыми полями
        const response = teams.map((team) => {
            return {
                id: team.id,
                teamName: team.teamName, // Имя команды
                projectManager: team.projectManager
                    ? team.projectManager.username
                    : "Manager not found", // Имя менеджера команды
                userCount: team.user.length, // Количество пользователей в команде
            };
        });
        console.log("respone", response);
        res.json(response); // Возвращаем ответ с информацией
    }
    catch (error) {
        console.error("Ошибка при получении информации о командах:", error);
        res
            .status(500)
            .json({ message: "Ошибка при получении информации о командах" });
    }
});
exports.searchTeams = searchTeams;
