import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";
import { pino } from "pino";

import { env } from "./common/utils/envConfig";
import errorHandler from "./middleware/errorHandler";
import { tasksRouter } from "./api/tasks/tasksRouter";
import authenticateToken from "./middleware/authenticate";

const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(authenticateToken);

// Routes
app.use("/tasks", tasksRouter);

// Swagger UI
//app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
