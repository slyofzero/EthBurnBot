export interface TokenAuditResponse {
  id: number;
  jsonrpc: string;
  result: Result;
}

interface Result {
  [address: string]: TokenAudit;
}

export interface TokenAudit {
  buy_tax: string;
  cannot_buy: string;
  cannot_sell_all: string;
  creator_address: string;
  creator_balance: string;
  creator_percent: string;
  dex: Dex[];
  holder_count: string;
  holders: Holder[];
  honeypot_with_same_creator: string;
  is_in_dex: string;
  is_open_source: string;
  is_proxy: string;
  lp_holder_count: string;
  lp_holders: LpHolder[];
  lp_total_supply: string;
  owner_address: string;
  sell_tax: string;
  token_name: string;
  token_symbol: string;
  total_supply: string;
  trust_list: string;
  is_blacklisted: string;
  is_whitelisted: string;
  is_honeypot: string;
  can_take_back_ownership: string;
  transfer_pausable: string;
  is_mintable: string;
}

interface Dex {
  liquidity_type: string;
  name: string;
  liquidity: string;
  pair: string;
}

interface Holder {
  address: string;
  tag: string;
  is_contract: number;
  balance: string;
  percent: string;
  is_locked: number;
}

interface LpHolder {
  address: string;
  tag: string;
  value: null;
  is_contract: number;
  balance: string;
  percent: string;
  NFT_list: null;
  is_locked: number;
}
