import "reflect-metadata";
import "./config/env";
import { initServer, connectDB } from "./config";

connectDB();
initServer();
