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
exports.getUserTasks = exports.updateTaskStatus = exports.createTask = exports.deleteTask = exports.getTasks = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.query;
    try {
        const tasks = yield prisma.task.findMany({
            where: {
                projectId: String(projectId),
            },
            include: {
                author: true,
                assignee: true,
                comments: true,
            },
        });
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving tasks" });
    }
});
exports.getTasks = getTasks;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    console.log(req.body);
    try {
        const task = yield prisma.task.findUnique({
            where: {
                id,
            },
        });
        if (!task) {
            return res.status(400).json({ message: "Task doesn't exist" });
        }
        yield prisma.task.delete({
            where: { id },
        });
        return res.status(200);
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting task" });
    }
});
exports.deleteTask = deleteTask;
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, status, priority, tags, startDate, dueDate, points, projectId, authorUserId, assignedUserId, } = req.body;
    console.log({
        title,
        description,
        status,
        priority,
        tags,
        startDate,
        dueDate,
        points,
        projectId,
        authorUserId,
        assignedUserId,
    });
    try {
        const newTask = yield prisma.task.create({
            data: {
                title,
                description,
                status,
                priority,
                tags,
                startDate,
                dueDate,
                points,
                projectId,
                authorUserId,
                assignedUserId,
            },
        });
        return res.status(201).json(newTask);
    }
    catch (error) {
        return res.status(500).json({
            message: `Error creating task. Error:${error}`,
        });
    }
});
exports.createTask = createTask;
const updateTaskStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    const { status } = req.body;
    try {
        const updatedTask = yield prisma.task.update({
            where: {
                id: String(taskId),
            },
            data: {
                status: status,
            },
        });
        res.status(201).json(updatedTask);
    }
    catch (error) {
        res.status(500).json({
            message: `Error updating task. Error:${error}`,
        });
    }
});
exports.updateTaskStatus = updateTaskStatus;
const getUserTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const tasks = yield prisma.task.findMany({
            where: {
                OR: [
                    { authorUserId: String(userId) },
                    {
                        assignedUserId: String(userId),
                    },
                ],
            },
            include: {
                author: true,
                assignee: true,
            },
        });
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving users tasks" });
    }
});
exports.getUserTasks = getUserTasks;
