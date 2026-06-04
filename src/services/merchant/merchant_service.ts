import { WaveGraphQlClient } from "../../libs/wave_graph_ql_client.js";

// interface MerchantInfoResponse {
//   userId: string;
//   merchantName: string;
//   contactMobile: string;
//   merchantId: string;
//   businessName: string;
// }

interface MerchantInfoResponse {
  id: string;
  name: string;
  mobile: string;
}

interface BusinessInfoResponse {
  merchantId: string;
  businessName: string;
}

export class MerchantService {
  private client: WaveGraphQlClient;

  constructor() {
    this.client = new WaveGraphQlClient();
  }

  async merchantInfo(token: string): Promise<MerchantInfoResponse> {
    const query = this.query();
    const payload = {
      query,
      variables: {},
    };

    const graphQlResponse = await this.client.request(token, payload);

    const me = graphQlResponse?.data?.me;

    const merchantInfo = {
      id: me?.id,
      name: me?.name,
      mobile: me?.contactMobile,
    };

    return merchantInfo;
  }

  async businessInfo(token: string): Promise<BusinessInfoResponse> {
    const query = this.query();
    const payload = {
      query,
      variables: {},
    };

    const graphQlResponse = await this.client.request(token, payload);

    const me = graphQlResponse?.data?.me;

    const businessInfo = {
      merchantId: me?.businessUser?.user.merchant.id,
      businessName: me?.businessUser?.user.merchant.name,
    };

    return businessInfo;
  }

  private query(): string {
    return `
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
  }
}
