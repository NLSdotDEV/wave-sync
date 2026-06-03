export const GetMerchantTransactionsQuery = `
 query GetMerchantTransactions (
      $start: Date!
      $end: Date!
      $walletOpaqueId: String!
      $limit: Int
    ) {
      me {
        businessUser {
          business {
            walletHistory (start: $start, end: $end, walletOpaqueId: $walletOpaqueId, limit: $limit) {
              historyEntries {
                 __typename
                id
                summary
                whenEntered
                isPending
                isCancelled
                ... on MerchantSaleEntry {
                  grossAmount
                  feeAmount
                  actionSource  
                  transferId
                  clientReference
                  customerMobile: unmaskedSenderMobile
                  customerName: senderName
                }
              }
            }
          }
        }
      }
    }
`;
