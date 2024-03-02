import { hypeNewPairs, setIndexedTokens } from "@/vars/tokens";
import { TOKENS_CHANNEL_ID } from "@/utils/env";
import { errorHandler, log } from "@/utils/handlers";
import moment from "moment";
import { PhotonPairData } from "@/types/livePairs";
import { trackLpBurn } from "./trackLpBurn";
import { AGE_THRESHOLD } from "@/utils/constants";

export async function sendAlert(pairs: PhotonPairData[]) {
  log(`Caught ${pairs.length} pairs`);

  try {
    if (!TOKENS_CHANNEL_ID) {
      log("TOKENS_CHANNEL_ID is undefined");
      process.exit(1);
    }

    const newIndexedTokens = [];

    for (const pair of pairs) {
      const { created_timestamp, address, fdv: marketCap } = pair.attributes;

      newIndexedTokens.push(address);
      const age = moment(created_timestamp * 1e3).fromNow();
      const ageMinutes =
        Number(age.replace("minutes ago", "")) ||
        Number(age.replace("a minutes ago", "1")) ||
        Number(age.replace("a few seconds ago", "1"));

      if (hypeNewPairs[address]) {
        trackLpBurn(pair);
      } else if (ageMinutes <= AGE_THRESHOLD) {
        const { address, name, audit } = pair.attributes;
        const now = Math.floor(Date.now() / 1e3);

        // Audit
        const { locked_liquidity } = audit;
        const isLpStatusOkay =
          Object.values(locked_liquidity || {}).at(0) === 100;

        hypeNewPairs[address] = {
          startTime: now,
          initialMC: marketCap,
          pastBenchmark: 1,
          lpStatus: isLpStatusOkay,
        };

        log(`Caught token ${address} ${name}`);

        // // Links
        // const tokenLink = `https://etherscan.io/address/${address}`;
        // // const pairLink = `https://solscan.io/account/${address}`;
        // const dexScreenerLink = `https://dexscreener.com/ethereum/${address}`;
        // const birdEyeLink = `https://birdeye.so/token/${address}?chain=ethereum`;
        // const bonkBotLink = `https://t.me/bonkbot_bot?start=ref_teji6_ca_${address}`;
        // const magnumLink = `https://t.me/magnum_trade_bot?start=YIUrOaUs_snipe_${address}`;
        // const unibot = `https://t.me/unibotsniper_bot?start=whaleape-${address}`;
        // const maestroBot = `https://t.me/MaestroSniperBot?start=${address}`;
        // const bananaLink = `https://t.me/BananaGunSolana_bot?start=${address}`;
        // const photonLink = `https://photon-sol.tinyastro.io/@hunnid/${address}`;

        // const socials = [];
        // for (const [social, socialLink] of Object.entries(
        //   storedSocials || {}
        // )) {
        //   if (socialLink) {
        //     socials.push(`[${toTitleCase(social)}](${socialLink})`);
        //   }
        // }

        // const socialsText = socials.join(" \\| ") || "No links available";

        // const contractInstance = new ethers.Contract(
        //   address,
        //   TOKEN_ABI,
        //   provider
        // );

        // // Token Info
        // const initialLiquidity = cleanUpBotMessage(
        //   formatToInternational(Number(init_liq.eth).toFixed(2))
        // );
        // const initialLiquidityUsd = cleanUpBotMessage(
        //   formatToInternational(init_liq.eth)
        // );

        // const liquidity = cleanUpBotMessage(
        //   formatToInternational(Number(cur_liq.eth).toFixed(2))
        // );
        // const liquidityUsd = cleanUpBotMessage(
        //   formatToInternational(cur_liq.usd)
        // );
        // const totalSupply = await contractInstance.totalSupply();

        // // Keyboard
        // const keyboard = new InlineKeyboard()
        //   .url("💳 BONKBot", bonkBotLink)
        //   .url("🛒 Maestro", maestroBot)
        //   .row()
        //   .url("🔫 Magnum", magnumLink)
        //   .url("🦄 Unibot", unibot);
        // .url("🍌 BananaGun", bananaLink)
        // .row()
        // .url("⚡ Photon", photonLink);

        //         // Text
        //         const text = `${hardCleanUpBotMessage(
        //           name
        //         )} \\| [${hardCleanUpBotMessage(symbol)}](${tokenLink})

        // 🪙 Supply: ${cleanUpBotMessage(formatToInternational(totalSupply || 0))}
        // 💰 MCap: $${cleanUpBotMessage(formatToInternational(marketCap))}
        // 🏦 Lp ETH: ${liquidity} ETH *\\($${liquidityUsd}\\)*
        // 🏦 Initial LP ETH: ${initialLiquidity} ETH *\\($${initialLiquidityUsd}\\)*

        // Token Contract:
        // \`${address}\`

        // 🫧 Socials: ${socialsText}
        // 🔗 Links: [DexScreener](${dexScreenerLink}) \\| [BirdEye](${birdEyeLink}) \\| [EtherScan](${tokenLink})
        // ${promoText}`;

        // try {
        //   // const message = await teleBot.api.sendMessage(
        //   //   TOKENS_CHANNEL_ID,
        //   //   text,
        //   //   {
        //   //     parse_mode: "MarkdownV2",
        //   //     // @ts-expect-error Param not found
        //   //     disable_web_page_preview: true,
        //   //     reply_markup: keyboard,
        //   //   }
        //   // );

        //   hypeNewPairs[address] = {
        //     startTime: now,
        //     initialMC: marketCap,
        //     pastBenchmark: 1,
        //     lpStatus: isLpStatusOkay,
        //   };

        //   log(`Caught token ${address} ${name}`);
        // } catch (error) {
        //   errorHandler(error);
        // }
      }
    }

    setIndexedTokens(newIndexedTokens);
  } catch (error) {
    errorHandler(error);
  }
}
