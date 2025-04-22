import { encodeEmvQr } from "../src/encoder";
import { validateCrc } from "../src/crc";
import { decodeEmvQrRaw } from "../src/decoder";
import fs from "fs";
import path from "path";

describe("encodeEmvQr", () => {
  test("encodes empty data with QR format indicator", () => {
    const result = encodeEmvQr({});
    expect(result.startsWith("000201")).toBe(true);
    expect(validateCrc(result)).toBe(true);
  });

  test("encodes EMV data dictionary into a valid QR code payload", () => {
    const data = {
      "01": "12",
      "52": "5311",
      "53": "840",
      "54": "12.34",
      "58": "US",
      "59": "CoffeeShop",
      "60": "NewYork",
    };

    const result = encodeEmvQr(data);
    const decoded = decodeEmvQrRaw(result);

    // Check format is correct
    expect(result.startsWith("000201")).toBe(true);

    // Check all data is included
    expect(decoded["01"]).toBe("12");
    expect(decoded["52"]).toBe("5311");
    expect(decoded["53"]).toBe("840");
    expect(decoded["54"]).toBe("12.34");
    expect(decoded["58"]).toBe("US");
    expect(decoded["59"]).toBe("CoffeeShop");
    expect(decoded["60"]).toBe("NewYork");

    // Check CRC is valid
    expect(validateCrc(result)).toBe(true);
  });

  test("encodes data with field IDs 2-51", () => {
    const data = {
      "02": "test2",
      "03": "test3",
      "51": "test51",
    };

    const result = encodeEmvQr(data);
    const decoded = decodeEmvQrRaw(result);

    expect(decoded["02"]).toBe("test2");
    expect(decoded["03"]).toBe("test3");
    expect(decoded["51"]).toBe("test51");
    expect(validateCrc(result)).toBe(true);
  });

  test("encodes required fields (52, 53, 58, 59, 60)", () => {
    const data = {
      "52": "5812",
      "53": "978",
      "58": "FR",
      "59": "RIEI",
      "60": "Paris",
    };

    const result = encodeEmvQr(data);
    const decoded = decodeEmvQrRaw(result);

    expect(decoded["52"]).toBe("5812");
    expect(decoded["53"]).toBe("978");
    expect(decoded["58"]).toBe("FR");
    expect(decoded["59"]).toBe("RIEI");
    expect(decoded["60"]).toBe("Paris");
    expect(validateCrc(result)).toBe(true);
  });

  test("encodes optional fields (54, 55, 56, 57, 61, 62, 64)", () => {
    const data = {
      "54": "42.00",
      "55": "1",
      "56": "10.00",
      "57": "15",
      "61": "75001",
      "62": "additional",
      "64": "merchant info",
    };

    const result = encodeEmvQr(data);
    const decoded = decodeEmvQrRaw(result);

    expect(decoded["54"]).toBe("42.00");
    expect(decoded["55"]).toBe("1");
    expect(decoded["56"]).toBe("10.00");
    expect(decoded["57"]).toBe("15");
    expect(decoded["61"]).toBe("75001");
    expect(decoded["62"]).toBe("additional");
    expect(decoded["64"]).toBe("merchant info");
    expect(validateCrc(result)).toBe(true);
  });

  test("encodes data from sample.json", () => {
    // Load sample data if it exists, otherwise use hardcoded test data
    let sampleData: Record<string, string>;
    try {
      const samplePath = path.join(process.cwd(), "sample.json");
      const fileData = fs.readFileSync(samplePath, "utf8");
      sampleData = JSON.parse(fileData);
    } catch (error) {
      // If file doesn't exist, use test data
      sampleData = {
        "01": "12",
        "26": "0014A000000000010203040506",
        "52": "5311",
        "53": "840",
        "54": "12.34",
        "58": "US",
        "59": "CoffeeShop",
        "60": "NewYork",
      };
    }

    const result = encodeEmvQr(sampleData);
    const decoded = decodeEmvQrRaw(result);

    // Check all sample data is included
    for (const [id, value] of Object.entries(sampleData)) {
      expect(decoded[id]).toBe(value);
    }

    // Check CRC is valid
    expect(validateCrc(result)).toBe(true);
  });
});

describe("encodeEmvQr with standard field names", () => {
  test("encodes standard field names into a valid QR code payload", () => {
    const standardData = {
      initiation_method: "dynamic",
      merchant_name: "RIEI",
      merchant_city: "Paris",
      country_code: "FR",
      currency: "EUR",
      amount: "42.00",
      merchant_category_code: "5812",
    };

    const result = encodeEmvQr(standardData);
    const decoded = decodeEmvQrRaw(result);

    // Check format is correct
    expect(result.startsWith("000201")).toBe(true);

    // Check initiation method is dynamic
    expect(decoded["01"]).toBe("11");

    // Check data is included (with converted currency)
    expect(decoded["52"]).toBe("5812");
    expect(decoded["53"]).toBe("978"); // EUR converted to numeric
    expect(decoded["54"]).toBe("42.00");
    expect(decoded["58"]).toBe("FR");
    expect(decoded["59"]).toBe("RIEI");
    expect(decoded["60"]).toBe("Paris");

    // Check CRC is valid
    expect(validateCrc(result)).toBe(true);
  });

  test("encodes static initiation method correctly", () => {
    const standardData = {
      initiation_method: "static",
      merchant_name: "Shop",
      merchant_city: "London",
      country_code: "GB",
      currency: "GBP",
    };

    const result = encodeEmvQr(standardData);
    const decoded = decodeEmvQrRaw(result);

    // Check initiation method is static
    expect(decoded["01"]).toBe("12");

    // Check currency conversion
    expect(decoded["53"]).toBe("826"); // GBP converted to numeric

    // Check CRC is valid
    expect(validateCrc(result)).toBe(true);
  });

  test("encodes data from sample_standard.json", () => {
    // Load sample data if it exists, otherwise use hardcoded test data
    let sampleData: Record<string, string>;
    try {
      const samplePath = path.join(process.cwd(), "sample_standard.json");
      const fileData = fs.readFileSync(samplePath, "utf8");
      sampleData = JSON.parse(fileData);
    } catch (error) {
      // If file doesn't exist, use test data
      sampleData = {
        initiation_method: "dynamic",
        merchant_name: "RIEI",
        merchant_city: "Paris",
        country_code: "FR",
        currency: "EUR",
        amount: "42.00",
        merchant_category_code: "5812",
      };
    }

    const result = encodeEmvQr(sampleData);
    const decoded = decodeEmvQrRaw(result);

    // Check specific fields we expect to be in the output
    if (sampleData.initiation_method === "dynamic") {
      expect(decoded["01"]).toBe("11");
    } else if (sampleData.initiation_method === "static") {
      expect(decoded["01"]).toBe("12");
    }

    // Check CRC is valid
    expect(validateCrc(result)).toBe(true);
  });
});
