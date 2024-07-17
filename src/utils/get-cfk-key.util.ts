import axios from 'axios'
import { JSDOM } from 'jsdom'

/**
 * Get CFK key to decipher
 */
export default async function getCfkKey(): Promise<string> {
    const { data: cfkData } = await axios.request({
        url: 'https://www.ffhandball.fr/',
        method: 'GET',
    })

    const { document } = new JSDOM(cfkData).window
    return document.body.getAttribute('data-cfk')!
}
