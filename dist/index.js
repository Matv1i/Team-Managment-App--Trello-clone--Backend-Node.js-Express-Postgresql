"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const searchRoutes_1 = __importDefault(require("./routes/searchRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const teamsRoutes_1 = __importDefault(require("./routes/teamsRoutes"));
const commentsRoutes_1 = __importDefault(require("./routes/commentsRoutes"));
const authCheck_1 = require("./middleware/authCheck");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((0, morgan_1.default)("common"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.get("/", (req, res) => {
    res.send("This is home route");
});
const PORT = Number(process.env.PORT);
app.use("/projects", authCheck_1.authCheck, projectRoutes_1.default);
app.use("/tasks", authCheck_1.authCheck, taskRoutes_1.default);
app.use("/search", authCheck_1.authCheck, searchRoutes_1.default);
app.use("/users", userRoutes_1.default);
app.use("/teams", authCheck_1.authCheck, teamsRoutes_1.default);
app.use("/comments", authCheck_1.authCheck, commentsRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Server runnig out port ${PORT}`);
});
