import { waveGraphQlClient } from "../../libs/wave_graph_ql_client.js";

interface BusinessWalletResponse {
  walletId: string;
  balance: number;
  currency: string;
  name: string;
  country: string;
}

export async function fetchBusinessWallet(token: string) {
  const query = `
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

  const payload = {
    query,
    variables: {},
  };

  const graphQlResponse = await waveGraphQlClient(token, payload);

  const wallet = graphQlResponse?.data?.me?.businessUser?.business?.wallet;

  if (!wallet) {
    throw new Error("Wallet does not exists on the response payload");
  }

  const walletResponse: BusinessWalletResponse = {
    walletId: wallet.id,
    balance: formatBalance(wallet.balance),
    currency: wallet.currency,
    name: wallet.name,
    country: wallet.country,
  };

  return walletResponse;
}

function formatBalance(rawBalance: string) {
  const balanceString = String(rawBalance).replace("CFA", " ").trim();
  return parseFloat(balanceString);
}
