import { chromium } from "playwright";

export async function createBrowser() {

    const browser = await chromium.launch({
        headless: false,
        slowMo: 200
    });

    const context = await browser.newContext();
    const page = await browser.newPage();

    return {
        browser,
        page,
        context
    };

}