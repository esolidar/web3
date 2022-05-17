export const getRoute = {
  HOME: (locale: string) => `/${locale}`,
  DISCOVER: (locale: string) => `/${locale}/discover`,
  nonProfit: {
    DETAIL: (locale: string, nonProfitId: string | number) => `/${locale}/discover/${nonProfitId}`,
  },
};

export default getRoute;
