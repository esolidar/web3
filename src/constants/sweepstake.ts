interface ITokenMap {
  readonly [key: string]: string;
  readonly pEUR: string;
  readonly pUSD: string;
  readonly pBRL: string;
}

const tokenMap: ITokenMap = {
  pEUR: String(process.env.NEXT_PUBLIC_CEUR),
  pUSD: String(process.env.NEXT_PUBLIC_CUSD),
  pBRL: String(process.env.NEXT_PUBLIC_CBRL),
};

export default tokenMap;
