import express from "express";
import { appConfig } from "./configs/app.js";
import { ErrorHandlerMiddleware } from "./middlewares/error_handler_middleware.js";
import { appRoutes } from "./controllers/app_controller.js";

import { merchantRoutes } from "./controllers/merchant_controller.js";
import { transactionRoutes } from "./controllers/transaction_controller.js";
import { walletRoutes } from "./controllers/wallet_controller.js";

const app = express();
app.use(express.json());

app.use("/", appRoutes);
app.use("/", merchantRoutes);
app.use("/", transactionRoutes);
app.use("/", walletRoutes);

app.use(ErrorHandlerMiddleware.handle);

app.listen(appConfig.port, () => {
  console.log("Application started on port: ", appConfig.port);
});
