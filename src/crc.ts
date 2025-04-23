/**
 * Calculates the CRC-16 checksum for the EMV QR Code payload.
 * @param payload Payload string to calculate CRC for
 * @returns CRC-16 checksum as 4-character hexadecimal string
 */
export function calculateCrc(payload: string): string {
  let crc = 0xFFFF;

  // Convert the string to UTF-8 byte array
  const utf8Encoder = new TextEncoder();
  const bytes = utf8Encoder.encode(payload);

  for (const byte of bytes) {
    crc ^= byte << 8;
    for (let i = 0; i < 8; i++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
      crc &= 0xFFFF;
    }
  }

  // Convert to 4-character hexadecimal string
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/**
 * Validates the CRC checksum of an EMV QR Code payload.
 * @param payloadWithCrc Full payload string including the CRC
 * @returns Boolean indicating whether the CRC is valid
 */
export function validateCrc(payloadWithCrc: string): boolean {
  const crcIndex = payloadWithCrc.lastIndexOf("6304");
  if (crcIndex === -1) {
    return false;
  }

  const expectedCrc = payloadWithCrc.substring(crcIndex + 4);
  const computedCrc = calculateCrc(payloadWithCrc.substring(0, crcIndex + 4));

  return expectedCrc.toUpperCase() === computedCrc;
}