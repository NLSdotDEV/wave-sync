import { waveGraphQlClient } from "../../libs/wave_graph_ql_client.js";
import { GetMerchantTransactionsQuery } from "../../shared/graphQlQueries/get_merchant_transactions_query.js";
import { waveDateParser } from "../../libs/wave_date_parser.js";
import type { WaveHistoryEntry } from "../../shared/types/wave_history_entry.js";
import type { WaveSyncTransaction } from "../../shared/types/wave_sync_transaction.js";
import { waveAmountParser } from "../../libs/wave_amount_parser.js";

interface TransactionResponse {
  transactionCount: number;
  transaction: WaveSyncTransaction | null;
}

export async function fetchTransactionByRef(
  waveToken: string,
  walletOpaqueId: string,
  clientReference: string,
  rawDate: string,
): Promise<TransactionResponse> {
  const formattedDate = waveDateParser(rawDate);

  const graphQlPayload = {
    query: GetMerchantTransactionsQuery,
    variables: {
      start: formattedDate,
      end: formattedDate,
      walletOpaqueId,
      limit: 1000,
    },
  };

  const graphQlResponse = await waveGraphQlClient(waveToken, graphQlPayload);

  const walletHistoryEntries: WaveHistoryEntry[] =
    graphQlResponse?.data?.me?.businessUser?.business?.walletHistory
      ?.historyEntries || [];

  const matchingHistoryEntry = walletHistoryEntries.find(
    (historyEntry: WaveHistoryEntry) => {
      return (
        historyEntry.__typename === "MerchantSaleEntry" &&
        historyEntry.clientReference === clientReference
      );
    },
  );

  if (!matchingHistoryEntry) {
    return {
      transactionCount: 0,
      transaction: null,
    };
  }

  const transaction: WaveSyncTransaction = {
    id: matchingHistoryEntry.id,
    transferId: matchingHistoryEntry.transferId,
    paidAt: matchingHistoryEntry.whenEntered,
    isPending: matchingHistoryEntry.isPending,
    isCancelled: matchingHistoryEntry.isCancelled,
    source: matchingHistoryEntry.actionSource,
    fees: waveAmountParser(matchingHistoryEntry.feeAmount),
    amount: waveAmountParser(matchingHistoryEntry.grossAmount),
    clientReference: matchingHistoryEntry.clientReference,
    customerMobile: matchingHistoryEntry.customerMobile,
    customerName: matchingHistoryEntry.customerName,
  };

  return {
    transactionCount: 1,
    transaction,
  };
}
