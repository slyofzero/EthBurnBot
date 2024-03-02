import { cleanUpBotMessage, hardCleanUpBotMessage } from "@/utils/bot";
import { TOKENS_CHANNEL_ID } from "@/utils/env";
import { teleBot } from "..";
import { hypeNewPairs } from "@/vars/tokens";
import { errorHandler, log } from "@/utils/handlers";
import { PhotonPairData } from "@/types/livePairs";
import { formatToInternational, toTitleCase } from "@/utils/general";
import { promoText } from "@/vars/promo";
import { InlineKeyboard } from "grammy";

export async function trackLpBurn(pair: PhotonPairData) {
  try {
    if (!TOKENS_CHANNEL_ID) {
      log("TOKENS_CHANNEL_ID is undefined");
      process.exit(1);
    }

    const {
      address,
      symbol,
      audit,
      socials: storedSocials,
      cur_liq,
      fdv: mcap,
      init_liq,
    } = pair.attributes;

    const { locked_liquidity, lp_holders_count } = audit;
    const { lpStatus, initialMC, ...rest } = hypeNewPairs[address];
    const lpLocked = Object.values(locked_liquidity || {}).at(0) || 0;
    const isLpStatusOkay = lpLocked === 100;

    if (!lpStatus && isLpStatusOkay) {
      hypeNewPairs[address] = {
        lpStatus: true,
        initialMC,
        ...rest,
      };

      // Links
      const tokenLink = `https://etherscan.io/address/${address}`;
      const dexScreenerLink = `https://dexscreener.com/ethereum/${address}`;
      const birdEyeLink = `https://birdeye.so/token/${address}?chain=ethereum`;
      const bonkBotLink = `https://t.me/bonkbot_bot?start=ref_teji6_ca_${address}`;
      const magnumLink = `https://t.me/magnum_trade_bot?start=YIUrOaUs_snipe_${address}`;
      const unibot = `https://t.me/unibotsniper_bot?start=whaleape-${address}`;
      const maestroBot = `https://t.me/MaestroSniperBot?start=${address}`;

      const keyboard = new InlineKeyboard()
        .url("💳 BONKBot", bonkBotLink)
        .url("🛒 Maestro", maestroBot)
        .row()
        .url("🔫 Magnum", magnumLink)
        .url("🦄 Unibot", unibot);

      let socialsText = "📱 *Socials*";
      const socials = Object.entries(storedSocials || {});
      if (socials.length) {
        for (const [social, socialLink] of socials) {
          if (socialLink) {
            socialsText += `\n       *├─* [${toTitleCase(
              social
            )}](${socialLink})`;
          }
        }
      } else {
        socialsText += `\n       *├─* No Links Available`;
      }

      // Token Info
      const initialLiquidity = cleanUpBotMessage(
        formatToInternational(Number(init_liq.eth).toFixed(2))
      );
      const initialLiquidityUsd = cleanUpBotMessage(
        formatToInternational(init_liq.usd)
      );

      const liquidity = cleanUpBotMessage(
        formatToInternational(Number(cur_liq.eth).toFixed(2))
      );
      const liquidityUsd = cleanUpBotMessage(
        formatToInternational(cur_liq.usd)
      );
      const change = (mcap / initialMC).toFixed(2);

      const text = `🔥 *New Liquidity Burn for ${hardCleanUpBotMessage(
        symbol
      )}\\!* 🔥
      
${socialsText}

🏠 *Address:* \`${address}\`

💧 *Liquidity*: 
      *├─ Launch*: ${initialLiquidity} ETH \\($${initialLiquidityUsd}\\)
      *├─ Now:*: ${liquidity} ETH \\($${liquidityUsd}\\)

📊 *MarketCap*
       *├─ Launch:* $${cleanUpBotMessage(formatToInternational(initialMC))}
       *├─ Now:* $${cleanUpBotMessage(
         formatToInternational(mcap)
       )} \\(x${cleanUpBotMessage(change)}\\)

💰 *Holders*
       *├─ LP Locked:* ${cleanUpBotMessage(lpLocked)}%
       *├─ LP Holders:* ${cleanUpBotMessage(lp_holders_count)}%

🔗 Links: [DexScreener](${dexScreenerLink}) \\| [BirdEye](${birdEyeLink}) \\| [EtherScan](${tokenLink})
${promoText}`;

      teleBot.api
        .sendMessage(TOKENS_CHANNEL_ID, text, {
          parse_mode: "MarkdownV2",
          reply_markup: keyboard,
          // @ts-expect-error Param not found
          disable_web_page_preview: true,
        })
        .then(() => log(`Sent message for ${address}`))
        .catch((e) => {
          log(text);
          errorHandler(e);
        });
    }
  } catch (error) {
    errorHandler(error);
  }
}
