import { Page } from "playwright";
import { env } from "../config/env.js";

export async function login(page: Page) {

    await page.goto(env.lmsUrl);

    await page.getByRole("textbox", {
        name: "Email"
    }).fill(env.lmsEmail!);

    await page.getByRole("textbox", {
        name: "Password"
    }).fill(env.lmsPassword!);

    await page.getByRole("button", {
        name: "Sign In"
    }).click();

}