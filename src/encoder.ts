import { toTlv, mapFieldsToTags } from "./utils";
import { calculateCrc } from "./crc";

// Re-export toTlv to satisfy test imports
export { toTlv } from "./utils";

/**
 * Encodes a dictionary of EMV data into a QR code payload string.
 * This is an internal function used by the public API.
 * @param data Dictionary with EMV tag IDs as keys
 * @returns EMV QR code payload string
 * @internal
 */
function encodeEmvQrInternal(data: Record<string, string>): string {
  let encoded = "";

  encoded += toTlv("00", "01");

  if ("01" in data) {
    encoded += toTlv("01", data["01"]);
  }

  for (let i = 2; i <= 51; i++) {
    const id = i.toString().padStart(2, "0");
    if (id in data) {
      encoded += toTlv(id, data[id]);
    }
  }

  const requiredIds = ["52", "53", "58", "59", "60"];
  for (const id of requiredIds) {
    if (id in data) {
      encoded += toTlv(id, data[id]);
    }
  }

  const optionalIds = ["54", "55", "56", "57", "61", "62", "64"];
  for (const id of optionalIds) {
    if (id in data) {
      encoded += toTlv(id, data[id]);
    }
  }

  const crcPayload = encoded + "6304";
  const crc = calculateCrc(crcPayload);
  encoded += toTlv("63", crc);

  return encoded;
}

/**
 * Encodes a dictionary with user-friendly field names into an EMV QR code payload.
 * @param data Dictionary with standard field names or raw EMV tag IDs
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
 * encodeEmvQr(data);
 * // Returns: '00020101110458125303978540642.005802FR5904RIEI6005Paris6304XXXX'
 * ```
 */
export function encodeEmvQr(data: Record<string, string>): string {
  const hasStandardFields = Object.keys(data).some(
    (key) =>
      key === "initiation_method" ||
      key === "merchant_name" ||
      key === "merchant_city" ||
      key === "country_code" ||
      key === "currency" ||
      key === "amount" ||
      key === "merchant_category_code"
  );

  const emvData = hasStandardFields ? mapFieldsToTags(data) : { ...data };

  // Ensure "00" is set to "01" (format indicator)
  if (!("00" in emvData)) {
    emvData["00"] = "01";
  }

  return encodeEmvQrInternal(emvData);
}
