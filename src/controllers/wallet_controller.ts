import { Router, type Request, type Response } from "express";
import { BusinessWalletService } from "../services/wallets/fetch_business_wallet.js";
import { Controller } from "./controller.js";

const token = "US_tok_ci_6370e7d5c12da5aa0b4801fa6e411d4a"; // for mock

class WalletController extends Controller {
  private readonly service: BusinessWalletService;
  constructor() {
    super();
    this.service = new BusinessWalletService();
  }

  async getWallet(req: Request, res: Response) {
    const wallet = await this.service.getBusinessWallet(token);
    return this.success(res, "wallet loaded", wallet);
  }
}

const walletRoutes = Router();
const walletController = new WalletController();

walletRoutes.get("/wallet", (req, res) =>(
  walletController.getWallet(req, res)
))

export {walletRoutes}