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
exports.getComments = exports.createComment = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, text, taskId, userId } = req.body;
        const createdComment = yield prisma.comment.create({
            data: {
                id,
                text,
                taskId,
                userId,
            },
        });
        return res.status(200).json(exports.createComment);
    }
    catch (error) {
        return res.status(500).json({ message: "Comment cant be created" });
    }
});
exports.createComment = createComment;
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const comments = yield prisma.comment.findMany({
            where: {
                taskId: id,
            },
            include: {
                user: true,
                task: true,
            },
        });
        if (!comments) {
            return res.status(400).json({ message: "Cant find comments" });
        }
        return res.status(200).json(comments);
    }
    catch (error) {
        return res.status(500);
    }
});
exports.getComments = getComments;
