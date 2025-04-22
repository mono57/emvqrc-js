import { decodeEmvQr } from "../src/decoder";
import { encodeEmvQr } from "../src/encoder";
import { calculateCrc } from "../src/crc";
import * as crcModule from "../src/crc";

describe("decodeEmvQr", () => {
  test("throws error if CRC is invalid", () => {
    // Create a valid payload first
    const basePayload =
      "00020101021229300012D156000000000510A93FO3230Q31280012D156000000010308123456786304";
    const crc = calculateCrc(basePayload);
    const validPayload = basePayload + crc;

    // Now tamper with the CRC
    const invalidPayload = basePayload + "FFFF";

    expect(() => decodeEmvQr(invalidPayload)).toThrow("Invalid CRC");
  });

  test("decodes valid EMV QR code payload correctly", () => {
    // Create a test payload with tag IDs
    const data = {
      "01": "12",
      "52": "5311",
      "53": "840",
      "54": "12.34",
      "58": "US",
      "59": "CoffeeShop",
      "60": "NewYork",
    };

    const encoded = encodeEmvQr(data);
    const decoded = decodeEmvQr(encoded);

    // Expect field names not tag IDs
    expect(decoded["initiation_method"]).toBe("12");
    expect(decoded["merchant_category_code"]).toBe("5311");
    expect(decoded["currency"]).toBe("USD"); // Converted from 840
    expect(decoded["amount"]).toBe("12.34");
    expect(decoded["country_code"]).toBe("US");
    expect(decoded["merchant_name"]).toBe("CoffeeShop");
    expect(decoded["merchant_city"]).toBe("NewYork");
  });

  test("round-trip encoding and decoding", () => {
    const originalData = {
      initiation_method: "dynamic",
      merchant_name: "RIEI",
      merchant_city: "Paris",
      country_code: "FR",
      currency: "EUR",
      amount: "42.00",
      merchant_category_code: "5812",
    };

    // Encode data
    const encoded = encodeEmvQr(originalData);

    // Decode back
    const decoded = decodeEmvQr(encoded);

    // Check fields
    expect(decoded["merchant_name"]).toBe(originalData["merchant_name"]);
    expect(decoded["merchant_city"]).toBe(originalData["merchant_city"]);
    expect(decoded["country_code"]).toBe(originalData["country_code"]);
    expect(decoded["amount"]).toBe(originalData["amount"]);
    expect(decoded["merchant_category_code"]).toBe(
      originalData["merchant_category_code"]
    );
    // Expect '11' rather than 'dynamic'
    expect(decoded["initiation_method"]).toBe("11");
    // Currency will be alphabetic code not numeric
    expect(decoded["currency"]).toBe("EUR");
  });

  test("handles static initiation method", () => {
    const originalData = {
      initiation_method: "static",
      merchant_name: "Shop",
      merchant_city: "London",
      country_code: "GB",
      currency: "GBP",
    };

    const encoded = encodeEmvQr(originalData);
    const decoded = decodeEmvQr(encoded);

    // Expect '12' not 'static'
    expect(decoded["initiation_method"]).toBe("12");
    expect(decoded["merchant_name"]).toBe("Shop");
    expect(decoded["merchant_city"]).toBe("London");
    expect(decoded["country_code"]).toBe("GB");
    expect(decoded["currency"]).toBe("GBP");
  });

  test("decodes sample EMV QR code", () => {
    // Create a sample payload for USA shop
    const data = {
      "01": "12", // static
      "52": "5311",
      "53": "840", // USD
      "54": "12.34",
      "58": "US",
      "59": "CoffeeShop",
      "60": "NewYork",
    };

    const encoded = encodeEmvQr(data);
    const result = decodeEmvQr(encoded);

    // Expect '12' not 'static'
    expect(result["initiation_method"]).toBe("12");
    expect(result["merchant_category_code"]).toBe("5311");
    expect(result["currency"]).toBe("USD");
    expect(result["amount"]).toBe("12.34");
    expect(result["country_code"]).toBe("US");
    expect(result["merchant_name"]).toBe("CoffeeShop");
    expect(result["merchant_city"]).toBe("NewYork");
  });
});
