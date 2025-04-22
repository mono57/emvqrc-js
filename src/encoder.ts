import { toTlv, mapFriendlyToEmv } from './utils';
import { calculateCrc } from './crc';

/**
 * Encodes a dictionary of EMV data into a QR code payload string.
 * @param data Dictionary with EMV tag IDs as keys
 * @returns EMV QR code payload string
 */
export function encodeEmvQr(data: Record<string, string>): string {
  let result = "";

  // Add QR format indicator (always 01)
  result += toTlv("00", "01");

  // Add point of initiation method if present
  if ("01" in data) {
    result += toTlv("01", data["01"]);
  }

  // Add tags 02-51 (merchant account information) in order
  for (let i = 2; i <= 51; i++) {
    const id = i.toString().padStart(2, '0');
    if (id in data) {
      result += toTlv(id, data[id]);
    }
  }

  // Add required fields
  const requiredIds = ["52", "53", "58", "59", "60"];
  for (const id of requiredIds) {
    if (id in data) {
      result += toTlv(id, data[id]);
    }
  }

  // Add optional fields
  const optionalIds = ["54", "55", "56", "57", "61", "62", "64"];
  for (const id of optionalIds) {
    if (id in data) {
      result += toTlv(id, data[id]);
    }
  }

  // Calculate and append CRC
  const crcPayload = result + "6304";
  const crc = calculateCrc(crcPayload);
  result += toTlv("63", crc);

  return result;
}

/**
 * Encodes a dictionary with user-friendly field names into an EMV QR code payload.
 * @param data Dictionary with user-friendly field names
 * @returns EMV QR code payload string
 *
 * @example
 * ```typescript
 * const data = {
 *   initiation_method: "dynamic",
 *   merchant_name: "RIEI",
 *   merchant_city: "Paris",
 *   country_code: "FR",
 *   currency: "EUR",
 *   amount: "42.00",
 *   merchant_category_code: "5812"
 * };
 * encodeEmvQrFriendly(data);
 * // Returns: '00020101110458125303978540642.005802FR5904RIEI6005Paris6304XXXX'
 * ```
 */
export function encodeEmvQrFriendly(data: Record<string, string>): string {
  const emvData = mapFriendlyToEmv(data);
  return encodeEmvQr(emvData);
}