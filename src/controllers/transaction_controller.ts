import { Router, type Request, type Response } from "express";
import { FetchAllTransactionService } from "../services/transactions/fetch_all_transactions.js";
import { Controller } from "./controller.js";
import { FetchTransactionByRef } from "../services/transactions/fetch_transaction_by_ref.js";
import { FetchTransactionsByDate } from "../services/transactions/fetch_transactions_by_date.js";

const token = "US_tok_ci_6370e7d5c12da5aa0b4801fa6e411d4a";
const walletOpaqueId = "W_ci_6ISwFjjHQBtk";

class TransactionController extends Controller {
  private fetchAllTransactionsService: FetchAllTransactionService;
  private fetchTransactionByRefService: FetchTransactionByRef;
  private fetchTransactionBydateService: FetchTransactionsByDate;

  constructor() {
    super();
    this.fetchAllTransactionsService = new FetchAllTransactionService();
    this.fetchTransactionByRefService = new FetchTransactionByRef();
    this.fetchTransactionBydateService = new FetchTransactionsByDate();
  }

  async get(req: Request, res: Response) {
    const date: string | null = req.query?.date?.toString() ?? null;

    if (date) {
      return this.filterByDate(date, res);
    }

    const transactions = await this.fetchAllTransactionsService.get(
      token,
      walletOpaqueId,
    );

    return this.success(res, "all transactions loaded", transactions);
  }

  async getByRef(req: Request, res: Response, ref: string) {
    const date: string | null = req.query?.date?.toString() ?? null;
    const transaction = await this.fetchTransactionByRefService.get(
      token,
      walletOpaqueId,
      ref,
      date,
    );

    return this.success(res, "transaction loaded", transaction);
  }

  // filter by date
  private async filterByDate(date: string, res: Response) {
    const transactions = await this.fetchTransactionBydateService.get(
      token,
      walletOpaqueId,
      date,
    );

    return this.success(res, "transactions by date loaded", transactions);
  }
}

const transactionRoutes = Router();
const transactionController = new TransactionController();

transactionRoutes.get("/transactions", (req, res) =>
  transactionController.get(req, res),
);

transactionRoutes.get("/transactions/:ref", (req, res) => {
  const ref = req.params.ref.toString();
  return transactionController.getByRef(req, res, ref);
});

export { transactionRoutes };
