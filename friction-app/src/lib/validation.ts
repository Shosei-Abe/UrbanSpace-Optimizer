/**
 * Validates a Hungarian phone number.
 * Supports flexible formats: +36 20 123 4567, 06-20-123-4567, 06201234567, etc.
 * Hungarian mobile numbers are usually 36 + 20/30/31/70 + 7 digits.
 * Landlines are 36 + area code + 6 or 7 digits.
 */
export function isValidHungarianPhone(phone: string): boolean {
    // Remove all non-numeric characters
    const clean = phone.replace(/\D/g, '');

    // Check if it starts with 36 or 06
    // If it starts with 06, replace with 36 for normalization check
    let normalized = clean;
    if (clean.startsWith('06')) {
        normalized = '36' + clean.substring(2);
    }

    // Must start with 36
    if (!normalized.startsWith('36')) {
        // If it's just local format without prefix, it's ambiguous but we can check length
        // Standard length is 11 digits including country code (36 + 2 digits area + 7 digits subscriber)
        // or 10 digits (36 + 1 digit area (Budapest) + 7 digits subscriber)
    }

    // Hungarian numbers with 36 prefix:
    // Budapest landline: 36 1 123 4567 (10 digits)
    // Mobile/Rural: 36 20 123 4567 (11 digits)

    // Regex for full validation:
    // (36|06) - prefix
    // (1|20|30|31|70|\d{2}) - area code / mobile provider
    // \d{6,7} - subscriber number

    const hungarianPhoneRegex = /^(?:\+?36|06)(?:1|[2-9]\d)\d{6,7}$/;

    // We allow standard international format or domestic format
    // Strip '+' if present
    const stripped = phone.replace(/^\+/, '').replace(/\s/g, '').replace(/-/g, '');

    return hungarianPhoneRegex.test(stripped);
}

/**
 * Formats options for currency validation or display if needed.
 */
export const HUNGARIAN_CURRENCY_OPTS = {
    locale: 'hu-HU',
    currency: 'HUF',
};
