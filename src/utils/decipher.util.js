/**
 * Decipher data from API
 * {@link https://www.ffhandball.fr/wp-content/plugins/smartfire-blocks-project-library/build/static/js/shared/utils.ts}
 * @param {string} strBase64 strBase64
 * @param {string} key key
 * @returns {object} Json
 */
export default function decipher(strBase64, key) {
    const str = Buffer.from(strBase64, 'base64').toString()
    let result = ''
    const keyLen = key.length
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < str.length; i++) {
        // eslint-disable-next-line no-bitwise
        result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % keyLen))
    }

    return JSON.parse(result)
}
