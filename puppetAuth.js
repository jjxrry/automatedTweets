import puppeteer from "puppeteer"
import dotenv from 'dotenv';

dotenv.config()

export async function puppetAuth(href) {
    const browser = await puppeteer.launch({
        headless: false,
        //executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', userDataDir: '/Users/jerrygao/Library/Application Support/Google/Chrome',
        //args: [
        //    '--no-sandbox',
        //    '--disable-setuid-sandbox',
        //    '--disable-infobars',
        //    '--disable-extensions',
        //]
    })
    const page = await browser.newPage()
    console.log('pupp fire')
    //might need to sanitize this
    await page.goto(href, { waitUntil: 'networkidle2' })
    await page.setViewport({ height: 1024, width: 1080 })
    console.log("goto and viewport fired")

    await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay

    console.log("current page: ", page.url())
    console.log("first page being opened ")
    console.log("entering credentials")
    await page.waitForSelector('#password')

    await page.locator('#username_or_email').fill(process.env.TWITUSER)
    await page.locator('#password').fill(process.env.TWITPASS)
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay
    await page.locator('#allow').click()

    console.log("second page being opened")
    await page.waitForSelector("code")
    console.log("code field found")
    console.log("current page: ", page.url())

    await page.evaluate(() => {
        const pinElement = document.querySelector("code")
        const pin = pinElement.innerText
        console.log("document item found")
        return pin
    })
    console.log("pin: ", pin)

    await browser.close()

    return pin
}

export default puppetAuth
