export interface WaveHistoryEntry {
  __typename: string;
  id: string;
  summary: string;
  whenEntered: string;
  isPending: boolean;
  isCancelled: boolean;
  grossAmount: number;
  feeAmount: number;
  actionSource: string;
  transferId: string;
  clientReference: string | null;
  customerMobile: string;
  customerName: string;
}