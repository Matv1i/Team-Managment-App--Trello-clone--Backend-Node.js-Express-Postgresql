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
exports.deleteCookies = exports.getCurrentUserInfo = exports.loginUser = exports.createUser = exports.getUsersByTeamId = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving tasks" });
    }
});
exports.getUsers = getUsers;
const getUsersByTeamId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teamId } = req.params;
        const users = yield prisma.user.findMany({
            where: {
                teamId,
            },
        });
        return res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving tasks" });
    }
});
exports.getUsersByTeamId = getUsersByTeamId;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        if (!body.email || !body.username || !body.password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existUser = yield prisma.user.findFirst({
            where: { email: body.email },
        });
        if (existUser) {
            return res.status(400).json({ message: "User already exist" });
        }
        const newUser = yield prisma.user.create({
            data: {
                email: body.email,
                username: body.username,
                password: body.password,
            },
        });
        const token = jsonwebtoken_1.default.sign({
            id: newUser.userId,
            username: newUser.username,
        }, SECRET_KEY, {
            expiresIn: "1h",
        });
        console.log(token);
        return res.status(201).json({
            message: "User was created",
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving tasks" });
    }
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existUser = yield prisma.user.findFirst({
            where: { email },
        });
        if ((existUser === null || existUser === void 0 ? void 0 : existUser.password) === password) {
            if (existUser) {
                yield prisma.team.create({
                    data: {
                        teamName: "Test2Test",
                        productOwnerUserId: existUser.userId,
                        projectManagerUserId: existUser.userId,
                    },
                });
            }
            console.log(existUser);
            const token = jsonwebtoken_1.default.sign({
                userId: existUser === null || existUser === void 0 ? void 0 : existUser.userId,
                username: existUser === null || existUser === void 0 ? void 0 : existUser.username,
                teamId: existUser === null || existUser === void 0 ? void 0 : existUser.teamId,
            }, SECRET_KEY, {
                expiresIn: "1h",
            });
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 3600000,
            });
            return res.json({ token });
        }
        else {
            return res.status(401).json({ message: "Logging went wrong" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error authorization" });
    }
});
exports.loginUser = loginUser;
const getCurrentUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.token;
        console.log(token);
        if (!token)
            return res.status(401).json({ message: "Cannot find user" });
        const decodeToken = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        console.log(decodeToken);
        return res.status(201).json(decodeToken);
    }
    catch (error) {
        res.status(500).json({ message: "Happend error while searching for user" });
    }
});
exports.getCurrentUserInfo = getCurrentUserInfo;
const deleteCookies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("token");
        res.end();
    }
    catch (error) {
        res.status(500).json({ message: "Happend error while searching for user" });
    }
});
exports.deleteCookies = deleteCookies;
