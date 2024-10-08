/**
 * 
 * LuzernEncryptor is a class for encrypting and decrypting text using a custom character set and offset key.
 * 
 */
class LuzernEncryptor {
    /**
     * 
     * Creates an instance of LuzernEncryptor.
     * @param {string} [defaultBaseKey="abcdefghijklmnopqrstuvwxyz0123456789;`</>- |_=,.:ABCDEFGHIJKLMNOPQRSTUVWXYZ\\/ "] - The default base key for encryption.
     * @param {number} [offsetKey=105] - The offset key used for generating the final base key.
     * 
     */
    constructor(defaultBaseKey = "abcdefghijklmnopqrstuvwxyz0123456789;`</>- |_=,.:ABCDEFGHIJKLMNOPQRSTUVWXYZ\\/ ", offsetKey = 105) {
        this.set(defaultBaseKey, offsetKey);
    }
    /**
     * 
     * Sets the base key and flipped base key for encryption and decryption.
     * @param {string} defaultBaseKey - The default base key for encryption.
     * @param {number} [offsetKey=105] - The offset key used for generating the final base key.
     * @throws {Error} Throws an error if defaultBaseKey is not a non-empty string, offsetKey is not a non-negative integer, or resulting key length is not within 100 to 999 characters.
     * 
     */
    set(defaultBaseKey, offsetKey = 105) {
        if (typeof defaultBaseKey !== 'string' || defaultBaseKey.length === 0) {
            throw new Error("Default base key must be a non-empty string");
        }
        if (typeof offsetKey !== 'number' || offsetKey < 0 || offsetKey % 1 !== 0) {
            throw new Error("Offset key must be a non-negative integer");
        }
        const keyLength = defaultBaseKey.length + offsetKey;
        if (keyLength < 100) {
            throw new Error("Default base key is too small, resulting key length must be at least 100");
        }
        if (keyLength > 999) {
            throw new Error("Default base key is too big, resulting key length must be at most 999");
        }
        this.baseKey = {};
        for (let i = 0; i < defaultBaseKey.length; i++) {
            this.baseKey[i + offsetKey] = defaultBaseKey.charAt(i);
        }
        this.flippedBaseKey = Object.fromEntries(Object.entries(this.baseKey).map(([key, value]) => [value, key]));
    }
    /**
     * 
     * Encrypts the input text using the base key.
     * @param {string} textInput - The text to be encrypted.
     * @returns {string} Returns the encrypted text.
     * @throws {Error} Throws an error if any character in textInput is not present in the base key.
     * 
     */
    enc(textInput) {
        const textSplit = textInput.split("");
        let encryptedText = "";
        textSplit.forEach(iterSplit => {
            if (!this.flippedBaseKey[iterSplit]) {
                throw new Error(iterSplit + " not in baseKey");
            }
            encryptedText += this.flippedBaseKey[iterSplit];
        });
        return encryptedText;
    }
    /**
     * 
     * Decrypts the input text using the base key.
     * @param {string} textInput - The text to be decrypted.
     * @returns {string} Returns the decrypted text.
     * 
     */
    dec(textInput) {
        const textSplit = textInput.match(/.{1,3}/g) || [];
        let decryptedText = "";
        textSplit.forEach(iterSplit => {
            decryptedText += this.baseKey[iterSplit] || "";
        });
        return decryptedText;
    }
}
export default LuzernEncryptor;