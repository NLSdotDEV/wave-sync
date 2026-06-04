import type { Request, Response } from "express";
import { AppService } from "../services/app_service.js";
import { Controller } from "./controller.js";
import { Router } from "express";

class AppController extends Controller {
  private service: AppService;

  constructor() {
    super();
    this.service = new AppService();
  }

  appInfo(_req: Request, res: Response) {
    const appInfo = this.service.appInfo();

    return this.success(res, "app version", appInfo);
  }
}

const appRoutes = Router();

const appController = new AppController();
appRoutes.get("/", (req, res) => appController.appInfo(req, res));

export { appRoutes };
