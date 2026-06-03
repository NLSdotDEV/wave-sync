import { waveGraphQlClient } from "../../libs/wave_graph_ql_client.js";
import { waveAmountParser } from "../../libs/wave_amount_parser.js";
import { GetMerchantTransactionsQuery } from "../../shared/graphQlQueries/get_merchant_transactions_query.js";
import { waveDateParser } from "../../libs/wave_date_parser.js";
import { type WaveHistoryEntry } from "../../shared/types/wave_history_entry.js";
import { type WaveSyncTransaction } from "../../shared/types/wave_sync_transaction.js";

interface TransactionReponse {
  transactionCount: number;
  transactions: WaveSyncTransaction[] | WaveSyncTransaction;
}

export async function fetchAllTransactions(
  token: string,
  walletOpaqueId: string,
): Promise<TransactionReponse> {
  const today = new Date();
  const strDate = waveDateParser(today.toDateString());

  const payload = {
    query: GetMerchantTransactionsQuery,
    variables: {
      start: strDate,
      end: strDate,
      walletOpaqueId,
      limit: 1000,
    },
  };
  const graphQlResponse = await waveGraphQlClient(token, payload);

  const historyEntries =
    graphQlResponse?.data?.me?.businessUser?.business?.walletHistory
      ?.historyEntries;

  const transactions: WaveSyncTransaction[] = historyEntries
    .filter((entry: WaveHistoryEntry) => {
      return entry.__typename === "MerchantSaleEntry";
    })
    .map((entry: WaveHistoryEntry) => {
      return {
        id: entry.id,
        transferId: entry.transferId,
        paidAt: entry.whenEntered,
        isPending: entry.isPending,
        isCancelled: entry.isCancelled,
        source: entry.actionSource,
        fees: waveAmountParser(entry.feeAmount),
        amount: waveAmountParser(entry.grossAmount),
        clientReference: entry.clientReference,
        customerMobile: entry.customerMobile,
        customerName: entry.customerName,
      };
    });

  const transactionCount = transactions.length;

  return {
    transactionCount,
    transactions,
  };
}
