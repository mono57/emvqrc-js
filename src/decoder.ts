import { validateCrc } from './crc';
import { mapEmvToFriendly } from './utils';

/**
 * Decodes an EMV QR code payload string into a dictionary.
 * @param payload EMV QR code payload string
 * @returns Dictionary with EMV tag IDs as keys
 * @throws Error if the CRC validation fails
 */
export function decodeEmvQr(payload: string): Record<string, string> {
  if (!validateCrc(payload)) {
    throw new Error("Invalid CRC");
  }

  const parsed: Record<string, string> = {};
  let index = 0;

  while (index < payload.length) {
    // Extract the tag ID
    const id = payload.substring(index, index + 2);
    index += 2;

    // If we've reached the end of the payload
    if (index >= payload.length) {
      break;
    }

    // Extract the length
    const lengthStr = payload.substring(index, index + 2);
    const length = parseInt(lengthStr, 10);
    index += 2;

    // Extract the value
    const value = payload.substring(index, index + length);
    index += length;

    // Store in the parsed data dictionary
    parsed[id] = value;
  }

  return parsed;
}

/**
 * Decodes an EMV QR code payload and returns a dictionary with user-friendly field names.
 * @param payload EMV QR code payload string
 * @returns Dictionary with user-friendly field names
 * @throws Error if the CRC validation fails
 *
 * @example
 * ```typescript
 * const payload = "00020101110458125303978540642.005802FR5904RIEI6005Paris6304ABCD";
 * const decoded = decodeEmvQrFriendly(payload);
 * // Returns:
 * // {
 * //   initiation_method: "dynamic",
 * //   merchant_category_code: "5812",
 * //   currency: "EUR",  // Converted from 978
 * //   amount: "42.00",
 * //   country_code: "FR",
 * //   merchant_name: "RIEI",
 * //   merchant_city: "Paris"
 * // }
 * ```
 */
export function decodeEmvQrFriendly(payload: string): Record<string, string> {
  // Decode using the existing function
  const emvData = decodeEmvQr(payload);

  // Convert EMV tag IDs to user-friendly names
  return mapEmvToFriendly(emvData);
}