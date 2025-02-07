import express from "express";
import AuthController from "../controllers/auth";

const authRouter = express.Router();

authRouter.get("/authorize", AuthController.getAuthorizationCode);
authRouter.post("/token", AuthController.getAccessToken);

export default authRouter;
