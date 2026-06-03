import { waveGraphQlClient } from "../../libs/wave_graph_ql_client.js";

interface MerchantInfoResponse {
  userId: string;
  merchantName: string;
  contactMobile: string;
  merchantId: string;
  businessName: string;
}

export async function fetchMerchantInfo(token: string): Promise<MerchantInfoResponse> {
  const query = `
    query GetMerchantInfo{
      me {
        id
        name
        contactMobile
        businessUser {
          user {
            id
            merchant {
              id
              name
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

  const me = graphQlResponse?.data?.me

  const merchantInfo = {
    userId: me?.id,
    merchantName: me?.name,
    contactMobile: me?.contactMobile,
    merchantId: me?.businessUser?.user.merchant.id,
    businessName: me?.businessUser?.user.merchant.name
  }

  return merchantInfo;
}
