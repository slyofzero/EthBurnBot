import { Bot } from "grammy";
import { initiateBotCommands, initiateCallbackQueries } from "./bot";
import { errorHandler, log } from "./utils/handlers";
import { BOT_TOKEN, DATA_URL, PHOTON_COOKIE } from "./utils/env";
import { sendAlert } from "./bot/sendAlert";
import { PhotonPairs } from "./types/livePairs";
import { configureWeb3 } from "./rpc";
import { cleanUpHypePairs } from "./bot/cleanUpHypePairs";
import { trackMC } from "./bot/trackMC";

if (!BOT_TOKEN || !DATA_URL) {
  log("BOT_TOKEN or WSS_URL or DATA_URL is missing");
  process.exit(1);
}

export const teleBot = new Bot(BOT_TOKEN);
log("Bot instance ready");

(async function () {
  configureWeb3();
  teleBot.start();
  log("Telegram bot setup");
  initiateBotCommands();
  initiateCallbackQueries();

  async function toRepeat() {
    try {
      const response = await fetch(DATA_URL || "", {
        headers: { Cookie: `_photon_eth_production=${PHOTON_COOKIE}` },
      });

      const pairs = (await response.json()) as PhotonPairs;

      await sendAlert(pairs.data);
      trackMC();
    } catch (error) {
      errorHandler(error);
    } finally {
      setTimeout(toRepeat, 5 * 1e3);
    }

    setInterval(cleanUpHypePairs, 60 * 1e3);
  }

  toRepeat();
})();
