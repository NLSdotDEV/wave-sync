export interface WaveSyncTransaction {
  id: string;
  paidAt: string;
  isPending: boolean;
  isCancelled: boolean;
  amount: number;
  fees: number;
  source: string;
  transferId: string;
  clientReference: string | null;
  customerMobile: string;
  customerName: string;
}