/* eslint-disable import/prefer-default-export */
export declare const approveDonationAmount: () => {
    approve: (value: string | number) => Promise<import("@celo/connect").CeloTxReceipt | {
        status: boolean;
    } | undefined>;
    donateToNonprofit: (community: string, value: string | number) => Promise<import("@celo/connect").CeloTxReceipt | undefined>;
}
  