import puppet from "puppeteer"


export function puppetAuth(href) {
    const browser = await puppet.launch()
    const page = await browser.newPage()

}

export default puppetAuth
