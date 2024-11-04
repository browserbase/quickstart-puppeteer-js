import puppeteer from "puppeteer-core";
import Browserbase from "@browserbasehq/sdk";

const PROJECT_ID = process.env.BROWSERBASE_PROJECT_ID;
const API_KEY = process.env.BROWSERBASE_API_KEY;

if (!API_KEY) {
  throw new Error("BROWSERBASE_API_KEY is not set");
}

if (!PROJECT_ID) {
  throw new Error("BROWSERBASE_PROJECT_ID is not set");
}

const bb = new Browserbase({
  apiKey: API_KEY,
});

const session = await bb.sessions.create({
  projectId: PROJECT_ID,
});
console.log(`Session created, id: ${session.id}`);

const browser = await puppeteer.connect({
  browserWSEndpoint: session.connectUrl,
});

const page = await browser.newPage();

await page.goto("https://www.browserbase.com", {
  // let's make sure the page is fully loaded before asking for the live debug URL
  waitUntil: "domcontentloaded",
});

const debugUrl = await bb.sessions.debug(session.id);
console.log(
  `Session started, live debug accessible here: ${debugUrl.debuggerUrl}.`,
);

console.log("Taking a screenshot!");
await page.screenshot({ fullPage: true });

console.log("Shutting down...");
await page.close();
await browser.close();

console.log(
  `Session complete! View replay at https://browserbase.com/sessions/${session.id}`,
);

