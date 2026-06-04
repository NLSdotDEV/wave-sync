import { GetMerchantTransactionsQuery } from "../../shared/graphQlQueries/get_merchant_transactions_query.js";
import type { WaveHistoryEntry } from "../../shared/types/wave_history_entry.js";
import { WaveGraphQlClient } from "../../libs/wave_graph_ql_client.js";
import { WaveParser } from "../../libs/wave_parser.js";
import type { WaveSyncTransaction } from "../../shared/types/wave_sync_transaction.js";
import { NotFoundError } from "../../shared/exceptions/app_error.js";

interface TransactionResponse {
  total: number;
  transaction: WaveSyncTransaction | null;
}
export class FetchTransactionByRef {
  private waveParser: WaveParser;
  private waveGraphQlClient: WaveGraphQlClient;
  constructor() {
    this.waveParser = new WaveParser();
    this.waveGraphQlClient = new WaveGraphQlClient();
  }

  async get(
    token: string,
    walletOpaqueId: string,
    clientReference: string,
    rawDate?: string | null,
  ): Promise<TransactionResponse> {
    const date = rawDate ?? new Date().toDateString();
    const dateStr = this.waveParser.parseDate(date);

    const payload = {
      query: GetMerchantTransactionsQuery,
      variables: {
        start: dateStr,
        end: dateStr,
        walletOpaqueId,
        limit: 1000,
      },
    };

    const graphQlResponse = await this.waveGraphQlClient.request(
      token,
      payload,
    );

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
      throw new NotFoundError("transaction not found");
    }

    const transaction: WaveSyncTransaction = {
      id: matchingHistoryEntry.id,
      transferId: matchingHistoryEntry.transferId,
      paidAt: matchingHistoryEntry.whenEntered,
      isPending: matchingHistoryEntry.isPending,
      isCancelled: matchingHistoryEntry.isCancelled,
      source: matchingHistoryEntry.actionSource,
      fees: this.waveParser.parseAmount(matchingHistoryEntry.feeAmount),
      amount: this.waveParser.parseAmount(matchingHistoryEntry.grossAmount),
      clientReference: matchingHistoryEntry.clientReference,
      customerMobile: matchingHistoryEntry.customerMobile,
      customerName: matchingHistoryEntry.customerName,
    };

    return {
      transaction,
      total: 1,
    };
  }
}
