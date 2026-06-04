import { GetMerchantTransactionsQuery } from "../../shared/graphQlQueries/get_merchant_transactions_query.js";
import { WaveGraphQlClient } from "../../libs/wave_graph_ql_client.js";
import { WaveParser } from "../../libs/wave_parser.js";
import type { WaveSyncTransaction } from "../../shared/types/wave_sync_transaction.js";
import type { WaveHistoryEntry } from "../../shared/types/wave_history_entry.js";

interface TransactionReponse {
  total: number;
  transactions: WaveSyncTransaction[] | WaveSyncTransaction;
}

export class FetchTransactionsByDate {
  private waveParser: WaveParser;
  private waveGraphQlClient: WaveGraphQlClient;
  constructor() {
    this.waveParser = new WaveParser();
    this.waveGraphQlClient = new WaveGraphQlClient();
  }

  async get(
    token: string,
    walletOpaqueId: string,
    rawDate: string,
  ): Promise<TransactionReponse> {
    const date = this.waveParser.parseDate(rawDate);

    const payload = {
      query: GetMerchantTransactionsQuery,
      variables: {
        start: date,
        end: date,
        walletOpaqueId,
        limit: 1000,
      },
    };

    const graphQlResponse = await this.waveGraphQlClient.request(
      token,
      payload,
    );

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
          fees: this.waveParser.parseAmount(entry.feeAmount),
          amount: this.waveParser.parseAmount(entry.grossAmount),
          clientReference: entry.clientReference,
          customerMobile: entry.customerMobile,
          customerName: entry.customerName,
        };
      });

    const transactionCount = transactions.length;

    return {
      total: transactionCount,
      transactions,
    };
  }
}
