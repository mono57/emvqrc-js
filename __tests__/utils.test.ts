import {
  toTlv,
  mapFieldsToTags,
  mapTagsToFields,
  CURRENCY_CODE_MAPPING,
  NUMERIC_TO_CURRENCY_CODE,
  FIELD_TO_TAG_MAPPING,
  TAG_TO_FIELD_MAPPING,
} from "../src/utils";

describe("toTlv", () => {
  test("formats tag, length, and value correctly", () => {
    expect(toTlv("00", "01")).toBe("000201");
    expect(toTlv("59", "CoffeeShop")).toBe("59" + "10" + "CoffeeShop");
    expect(toTlv("54", "12.34")).toBe("54" + "05" + "12.34");
    expect(toTlv("01", "")).toBe("01" + "00" + "");
  });

  test("pads length with leading zero if needed", () => {
    expect(toTlv("58", "US")).toBe("58" + "02" + "US");
  });
});

describe("CURRENCY_CODE_MAPPING and NUMERIC_TO_CURRENCY_CODE", () => {
  test("currency mappings are correctly defined", () => {
    expect(CURRENCY_CODE_MAPPING["USD"]).toBe("840");
    expect(CURRENCY_CODE_MAPPING["EUR"]).toBe("978");
    expect(CURRENCY_CODE_MAPPING["GBP"]).toBe("826");
    expect(NUMERIC_TO_CURRENCY_CODE["840"]).toBe("USD");
    expect(NUMERIC_TO_CURRENCY_CODE["978"]).toBe("EUR");
    expect(NUMERIC_TO_CURRENCY_CODE["826"]).toBe("GBP");
  });

  test("NUMERIC_TO_CURRENCY_CODE is reverse of CURRENCY_CODE_MAPPING", () => {
    for (const [alpha, numeric] of Object.entries(CURRENCY_CODE_MAPPING)) {
      expect(NUMERIC_TO_CURRENCY_CODE[numeric]).toBe(alpha);
    }
  });
});

describe("FIELD_TO_TAG_MAPPING and TAG_TO_FIELD_MAPPING", () => {
  test("field mappings are correctly defined", () => {
    expect(FIELD_TO_TAG_MAPPING["merchant_name"]).toBe("59");
    expect(FIELD_TO_TAG_MAPPING["currency"]).toBe("53");
    expect(FIELD_TO_TAG_MAPPING["country_code"]).toBe("58");
    expect(TAG_TO_FIELD_MAPPING["59"]).toBe("merchant_name");
    expect(TAG_TO_FIELD_MAPPING["53"]).toBe("currency");
    expect(TAG_TO_FIELD_MAPPING["58"]).toBe("country_code");
  });

  test("TAG_TO_FIELD_MAPPING is reverse of FIELD_TO_TAG_MAPPING", () => {
    for (const [field, tag] of Object.entries(FIELD_TO_TAG_MAPPING)) {
      expect(TAG_TO_FIELD_MAPPING[tag]).toBe(field);
    }
  });
});

describe("mapFieldsToTags", () => {
  test("maps basic user-friendly fields to EMV tags", () => {
    const friendly = {
      merchant_name: "CoffeeShop",
      merchant_city: "NewYork",
      country_code: "US",
      amount: "12.34",
      currency: "USD",
    };

    const emv = mapFieldsToTags(friendly);

    expect(emv["00"]).toBe("01"); // Always added
    expect(emv["59"]).toBe("CoffeeShop");
    expect(emv["60"]).toBe("NewYork");
    expect(emv["58"]).toBe("US");
    expect(emv["54"]).toBe("12.34");
    expect(emv["53"]).toBe("840"); // USD converted to numeric
  });

  test("handles initiation method conversion", () => {
    expect(mapFieldsToTags({ initiation_method: "dynamic" })["01"]).toBe("11");
    expect(mapFieldsToTags({ initiation_method: "static" })["01"]).toBe("12");
    expect(mapFieldsToTags({ initiation_method: "DYNAMIC" })["01"]).toBe("11");
    expect(mapFieldsToTags({ initiation_method: "STATIC" })["01"]).toBe("12");
  });

  test("handles currency code conversion", () => {
    expect(mapFieldsToTags({ currency: "USD" })["53"]).toBe("840");
    expect(mapFieldsToTags({ currency: "EUR" })["53"]).toBe("978");
    expect(mapFieldsToTags({ currency: "GBP" })["53"]).toBe("826");

    // Already numeric code
    expect(mapFieldsToTags({ currency: "840" })["53"]).toBe("840");
  });

  test("throws error for unsupported currency codes", () => {
    expect(() => mapFieldsToTags({ currency: "XYZ" })).toThrow(
      "Unsupported currency code: XYZ"
    );
  });

  test("handles sample_friendly.json data correctly", () => {
    const friendly = {
      initiation_method: "dynamic",
      merchant_name: "RIEI",
      merchant_city: "Paris",
      country_code: "FR",
      currency: "EUR",
      amount: "42.00",
      merchant_category_code: "5812",
    };

    const emv = mapFieldsToTags(friendly);

    expect(emv["00"]).toBe("01");
    expect(emv["01"]).toBe("11");
    expect(emv["59"]).toBe("RIEI");
    expect(emv["60"]).toBe("Paris");
    expect(emv["58"]).toBe("FR");
    expect(emv["53"]).toBe("978");
    expect(emv["54"]).toBe("42.00");
    expect(emv["52"]).toBe("5812");
  });
});

describe("mapTagsToFields", () => {
  test("maps basic EMV tags to user-friendly fields", () => {
    const emv = {
      "59": "CoffeeShop",
      "60": "NewYork",
      "58": "US",
      "54": "12.34",
      "53": "840",
    };

    const friendly = mapTagsToFields(emv);

    expect(friendly["merchant_name"]).toBe("CoffeeShop");
    expect(friendly["merchant_city"]).toBe("NewYork");
    expect(friendly["country_code"]).toBe("US");
    expect(friendly["amount"]).toBe("12.34");
    expect(friendly["currency"]).toBe("USD"); // Numeric converted to alphabetic
  });

  test("handles initiation method conversion", () => {
    expect(mapTagsToFields({ "01": "11" })["initiation_method"]).toBe("11");
    expect(mapTagsToFields({ "01": "12" })["initiation_method"]).toBe("12");
  });

  test("handles currency code conversion", () => {
    expect(mapTagsToFields({ "53": "840" })["currency"]).toBe("USD");
    expect(mapTagsToFields({ "53": "978" })["currency"]).toBe("EUR");
    expect(mapTagsToFields({ "53": "826" })["currency"]).toBe("GBP");

    // Unknown numeric code is left as-is
    expect(mapTagsToFields({ "53": "999" })["currency"]).toBe("999");
  });

  test("handles sample.json data correctly", () => {
    const emv = {
      "01": "12",
      "26": "0014A000000000010203040506",
      "52": "5311",
      "53": "840",
      "54": "12.34",
      "58": "US",
      "59": "CoffeeShop",
      "60": "NewYork",
    };

    const friendly = mapTagsToFields(emv);

    expect(friendly["initiation_method"]).toBe("12");
    expect(friendly["merchant_category_code"]).toBe("5311");
    expect(friendly["currency"]).toBe("USD");
    expect(friendly["amount"]).toBe("12.34");
    expect(friendly["country_code"]).toBe("US");
    expect(friendly["merchant_name"]).toBe("CoffeeShop");
    expect(friendly["merchant_city"]).toBe("NewYork");
    // Note: Field 26 is not in the mapping so it should be ignored
    expect(friendly["26"]).toBeUndefined();
  });
});
