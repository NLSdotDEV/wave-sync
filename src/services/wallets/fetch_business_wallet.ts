import { WaveGraphQlClient } from "../../libs/wave_graph_ql_client.js";
import { WaveParser } from "../../libs/wave_parser.js";
import { NotFoundError } from "../../shared/exceptions/app_error.js";

interface BusinessWalletResponse {
  walletId: string;
  balance: number;
  currency: string;
  name: string;
  country: string;
}

export class BusinessWalletService {
  private readonly waveGraphQlClient: WaveGraphQlClient;
  private readonly waveParser: WaveParser;
  constructor() {
    this.waveGraphQlClient = new WaveGraphQlClient();
    this.waveParser = new WaveParser();
  }

  async getBusinessWallet(token: string): Promise<BusinessWalletResponse> {
    const query = this.walletQuery();
    const payload = {
      query,
      variables: {},
    };

    const graphQlResponse = await this.waveGraphQlClient.request(
      token,
      payload,
    );

    const wallet = graphQlResponse?.data?.me?.businessUser?.business?.wallet;

    if (!wallet) {
      throw new NotFoundError("Wallet does not exists on the response payload");
    }

    const walletResponse: BusinessWalletResponse = {
      walletId: wallet.id,
      balance: this.waveParser.parseAmount(wallet.balance),
      currency: wallet.currency,
      name: wallet.name,
      country: wallet.country,
    };

    return walletResponse;
  }

  private walletQuery(): string {
    return `
    query GetBusinessWallet {
        me {
            businessUser {
                role
                business {
                    wallet {
                        id
                        currency
                        name
                        country
                        balance
                    }
                }
            }
        }
    }
    `;
  }
}
