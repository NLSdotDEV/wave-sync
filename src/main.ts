import express from "express";
import { appConfig } from "./configs/app.js";
import { appInfo } from "./services/app_service.js";
import { fetchAllTransactions } from "./services/transactions/fetch_all_transactions.js";
import { fetchBusinessWallet } from "./services/wallets/fetch_business_wallet.js";
import { fetchMerchantInfo } from "./services/merchant/fetch_merchant_info.js";
import { fetchTransactionByRef } from "./services/transactions/fetch_transaction_by_ref.js";

const app = express();
app.use(express.json());

app.get("/", (_, res) => {
  const response = appInfo();
  return res.status(200).json(response);
});

const token = "US_tok_ci_6370e7d5c12da5aa0b4801fa6e411d4a";
const walletOpaqueId = "W_ci_6ISwFjjHQBtk";

app.get("/transactions", async (req, res) => {
  const ref = req.query?.ref?.toString();
  const rawDate = new Date().toDateString();
  let transaction;

  if (ref) {
    transaction = await fetchTransactionByRef(
      token,
      walletOpaqueId,
      ref,
      rawDate,
    );

    if (transaction.transactionCount === 0) {
      return res.status(404).json({
        success: true,
        message: "transaction not found",
        data: transaction.transaction,
      });
    }

    return res.status(200).json({
      success: true,
      message: "transaction loaded",
      data: transaction.transaction,
    });
  }

  transaction = await fetchAllTransactions(token, walletOpaqueId);

  return res.status(200).json({
    success: true,
    message: "transaction loaded",
    data: transaction,
  });
});

app.get("/wallets", async (_, res) => {
  const response = await fetchBusinessWallet(token);
  return res.status(200).json(response);
});

app.get("/merchant/info", async (_, res) => {
  const response = await fetchMerchantInfo(token);
  return res.status(200).json(response);
});

// start application
app.listen(appConfig.port, () => {
  console.log("Application started on port: ", appConfig.port);
});
