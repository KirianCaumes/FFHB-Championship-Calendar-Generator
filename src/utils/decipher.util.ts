/**
 * Decipher data from API
 * {@link https://www.ffhandball.fr/wp-content/plugins/smartfire-blocks-project-library/build/static/js/shared/utils.ts}
 * @param strBase64 strBase64
 * @param key key
 * @returns Deciphered data
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export default function decipher<T = Record<string, unknown>>(strBase64: string, key: string): T {
    const str = Buffer.from(strBase64, 'base64').toString()
    let result = ''
    const keyLen = key.length

    for (let i = 0; i < str.length; i++) {
        result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % keyLen))
    }

    return JSON.parse(result) as T
}
