interface InitLiq {
  eth: string;
  usd: string;
  lp_amount: number;
  timestamp: number;
  open_timestamp: number;
}

interface CurLiq {
  eth: string;
  usd: string;
}

interface Audit {
  mint_authority: boolean;
  locked_liquidity: { [key: number]: number };
  lp_holders_count: number;
}

interface Socials {
  twitter: string | null;
  website: string | null;
  telegram: string | null;
  medium: string | null;
  reddit: string | null;
}

interface Attributes {
  volume: number;
  buys_count: number;
  sells_count: number;
  address: string;
  fdv: number;
  name: string;
  symbol: string;
  created_timestamp: number;
  open_timestamp: number;
  init_liq: InitLiq;
  cur_liq: CurLiq;
  audit: Audit;
  socials: Socials;
}

export interface PhotonPairData {
  id: string;
  type: string;
  attributes: Attributes;
}

export interface PhotonPairs {
  data: PhotonPairData[];
}
