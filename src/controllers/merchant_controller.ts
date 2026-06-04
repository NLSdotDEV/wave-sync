import type { Request, Response } from "express";
import { MerchantService } from "../services/merchant/merchant_service.js";
import { Controller } from "./controller.js";
import { Router } from "express";

const token = "US_tok_ci_6370e7d5c12da5aa0b4801fa6e411d4a";

class MerchantController extends Controller {
  private service: MerchantService;
  constructor() {
    super();
    this.service = new MerchantService();
  }

  async merchantInfo(req: Request, res: Response) {
    const merchantInfo = await this.service.merchantInfo(token);

    return this.success(res, "merchant info loaded", merchantInfo);
  }

  async businessInfo(req: Request, res: Response) {
    const businessInfo = await this.service.businessInfo(token);

    return this.success(res, "business info loaded", businessInfo);
  }
}

const merchantRoutes = Router();
const merchantController = new MerchantController();

merchantRoutes.get("/merchant/info", (req, res) =>
  merchantController.merchantInfo(req, res),
);

merchantRoutes.get("/merchant/business", (req, res) =>
  merchantController.businessInfo(req, res),
);

export { merchantRoutes };
