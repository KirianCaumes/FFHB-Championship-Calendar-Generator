import { JSDOM } from 'jsdom'

/**
 * Get CFK key to decipher
 * @returns CFK key
 */
export default async function getCfkKey(): Promise<string> {
    const res = await fetch('https://www.ffhandball.fr/', { method: 'GET' })

    const text = await res.text()

    const { document } = new JSDOM(text).window
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return document.body.getAttribute('data-cfk')!
}
