import { TOKENS_CHANNEL_ID } from "@/utils/env";
import { teleBot } from "..";
import { hypeNewPairs } from "@/vars/tokens";
import { errorHandler, log } from "@/utils/handlers";
import { apiFetcher } from "@/utils/api";
import { PairDataResponse } from "@/types";
import { auditToken } from "@/utils/tokenAudit";

export async function trackTax() {
  log("Checking taxes");

  try {
    if (!TOKENS_CHANNEL_ID) {
      log("TOKENS_CHANNEL_ID is undefined");
      process.exit(1);
    }

    for (const token in hypeNewPairs) {
      const { launchMessage, lpStatus } = hypeNewPairs[token];
      if (!lpStatus) continue;

      const [tokenAudit, tokenData] = await Promise.all([
        auditToken(token),
        apiFetcher<PairDataResponse>(
          `https://api.dexscreener.com/latest/dex/tokens/${token}`
        ),
      ]);

      const firstPair = tokenData.data.pairs.at(0);
      if (!firstPair) continue;
      const buyTax = Number((Number(tokenAudit.buy_tax) * 100).toFixed(2));
      const sellTax = Number((Number(tokenAudit.sell_tax) * 100).toFixed(2));

      if (buyTax >= 70 || sellTax >= 70) {
        const { baseToken, pairAddress: address } = firstPair;
        const { symbol, name } = baseToken;

        const text = `⚠️ RUG PULL ALERT
${name} (${symbol}) has high tax rates:

Buy Tax: ${buyTax}%
Sell Tax: ${sellTax}%

Be cautious!`;

        teleBot.api
          .sendMessage(TOKENS_CHANNEL_ID, text, {
            // @ts-expect-error Param not found
            disable_web_page_preview: true,
            reply_parameters: { message_id: launchMessage },
          })
          .then(() => log(`Sent message for ${address}`))
          .catch((e) => {
            log(text);
            errorHandler(e);
          });

        teleBot.api
          .sendMessage(-1002084945881, text, {
            // @ts-expect-error Param not found
            disable_web_page_preview: true,
          })
          .catch((e) => {
            log(text);
            errorHandler(e);
          });
      }
    }
  } catch (error) {
    errorHandler(error);
  }
}
