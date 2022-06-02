export const getRoute = {
  HOME: (locale: string) => `/${locale}`,
  DISCOVER: (locale: string) => `/${locale}/discover`,
  nonProfit: {
    DETAIL: (locale: string, nonProfitId: string | number) => `/${locale}/nonprofit/${nonProfitId}`,
  },
  sweepStake: {
    DETAIL: (locale: string, sweepStakeId: string | number) =>
      `/${locale}/sweepstake/${sweepStakeId}`,
  },
};

export default getRoute;
