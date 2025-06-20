// --- /lib/crypto.js ---
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const PBKDF2_ITERATIONS = 100000;
const secret = process.env.ENCRYPTION_KEY;
if (!secret || secret.length < 32) {
    throw new Error('ENCRYPTION_KEY must be at least 32 characters long.');
}
const getKey = (salt) => crypto.pbkdf2Sync(secret, salt, PBKDF2_ITERATIONS, 32, 'sha512');
export function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const salt = crypto.randomBytes(SALT_LENGTH);
    const key = getKey(salt);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([salt, iv, tag, encrypted]).toString('hex');
}
export function decrypt(encryptedText) {
    try {
        const bData = Buffer.from(encryptedText, 'hex');
        const salt = bData.slice(0, SALT_LENGTH);
        const iv = bData.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
        const tag = bData.slice(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
        const encrypted = bData.slice(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
        const key = getKey(salt);
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(tag);
        return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
}
