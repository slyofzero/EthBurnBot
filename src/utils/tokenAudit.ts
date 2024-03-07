import { TokenAudit, TokenAuditResponse } from "@/types/audit";

const headers = new Headers();
headers.append("Host", "quaint-orbital-isle.quiknode.pro");
headers.append(
  "User-Agent",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0"
);
headers.append("Accept", "*/*");
headers.append("Accept-Language", "en-US,en;q=0.5");
headers.append("Accept-Encoding", "gzip, deflate, br");
headers.append("Content-Type", "application/json");
headers.append("Content-Length", "109");
headers.append("Referer", "https://unidexai.xyz/");
headers.append("Origin", "https://unidexai.xyz");
headers.append("Sec-Fetch-Dest", "empty");
headers.append("Sec-Fetch-Mode", "cors");
headers.append("Sec-Fetch-Site", "cross-site");
headers.append("Sec-GPC", "1");
headers.append("Connection", "keep-alive");
headers.append("TE", "trailers");

export async function auditToken(token: string): Promise<TokenAudit> {
  //   const token = "0x4DFCa4BCB92235D6F89bb478A2ac98EE4fb529Be";
  const requestBody = {
    method: "gp_tokenSecurity",
    params: [token],
    id: 42,
    jsonrpc: "2.0",
  };
  const response = await fetch(
    "https://quaint-orbital-isle.quiknode.pro/139ce259bfc400c1f76445c20826eaf95d38780b/",
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody), // Convert the JSON object to a string
    }
  );
  const jsonData = (await response.json()) as TokenAuditResponse;
  const auditData = jsonData.result[token];
  return auditData;
}
