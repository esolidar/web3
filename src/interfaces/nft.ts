interface NFT {
  nftID: number;
  nftTokenURI: string;
  nftOwner: string;
  nftErc20token: string;
  nftDuration: number;
  nftTotalStaked: string;
  nftWinner: string;
  nftDrawTimestamp: string;
  nftActive: boolean;
  nftDestroyed: boolean;
}

export default NFT;
