/**
 * Converts a tag ID and value into the TLV (Tag-Length-Value) format.
 * @param id Tag identifier
 * @param value Value to encode
 * @returns Formatted TLV string
 */
export function toTlv(id: string, value: string): string {
  const length = value.length.toString().padStart(2, '0');
  return `${id}${length}${value}`;
}

/**
 * ISO 4217 currency code mapping (alphabetic to numeric)
 */
export const CURRENCY_CODE_MAPPING: Record<string, string> = {
  "AED": "784",  // UAE Dirham
  "AFN": "971",  // Afghani
  "ALL": "008",  // Lek
  "AMD": "051",  // Armenian Dram
  "ANG": "532",  // Netherlands Antillean Guilder
  "AOA": "973",  // Kwanza
  "ARS": "032",  // Argentine Peso
  "AUD": "036",  // Australian Dollar
  "AWG": "533",  // Aruban Florin
  "AZN": "944",  // Azerbaijan Manat
  "BAM": "977",  // Convertible Mark
  "BBD": "052",  // Barbados Dollar
  "BDT": "050",  // Taka
  "BGN": "975",  // Bulgarian Lev
  "BHD": "048",  // Bahraini Dinar
  "BIF": "108",  // Burundi Franc
  "BMD": "060",  // Bermudian Dollar
  "BND": "096",  // Brunei Dollar
  "BOB": "068",  // Boliviano
  "BRL": "986",  // Brazilian Real
  "BSD": "044",  // Bahamian Dollar
  "BTN": "064",  // Ngultrum
  "BWP": "072",  // Pula
  "BYN": "933",  // Belarusian Ruble
  "BZD": "084",  // Belize Dollar
  "CAD": "124",  // Canadian Dollar
  "CDF": "976",  // Congolese Franc
  "CHF": "756",  // Swiss Franc
  "CLP": "152",  // Chilean Peso
  "CNY": "156",  // Yuan Renminbi
  "COP": "170",  // Colombian Peso
  "CRC": "188",  // Costa Rican Colon
  "CUC": "931",  // Peso Convertible
  "CUP": "192",  // Cuban Peso
  "CVE": "132",  // Cabo Verde Escudo
  "CZK": "203",  // Czech Koruna
  "DJF": "262",  // Djibouti Franc
  "DKK": "208",  // Danish Krone
  "DOP": "214",  // Dominican Peso
  "DZD": "012",  // Algerian Dinar
  "EGP": "818",  // Egyptian Pound
  "ERN": "232",  // Nakfa
  "ETB": "230",  // Ethiopian Birr
  "EUR": "978",  // Euro
  "FJD": "242",  // Fiji Dollar
  "FKP": "238",  // Falkland Islands Pound
  "GBP": "826",  // Pound Sterling
  "GEL": "981",  // Lari
  "GHS": "936",  // Ghana Cedi
  "GIP": "292",  // Gibraltar Pound
  "GMD": "270",  // Dalasi
  "GNF": "324",  // Guinean Franc
  "GTQ": "320",  // Quetzal
  "GYD": "328",  // Guyana Dollar
  "HKD": "344",  // Hong Kong Dollar
  "HNL": "340",  // Lempira
  "HRK": "191",  // Kuna
  "HTG": "332",  // Gourde
  "HUF": "348",  // Forint
  "IDR": "360",  // Rupiah
  "ILS": "376",  // New Israeli Sheqel
  "INR": "356",  // Indian Rupee
  "IQD": "368",  // Iraqi Dinar
  "IRR": "364",  // Iranian Rial
  "ISK": "352",  // Iceland Krona
  "JMD": "388",  // Jamaican Dollar
  "JOD": "400",  // Jordanian Dinar
  "JPY": "392",  // Yen
  "KES": "404",  // Kenyan Shilling
  "KGS": "417",  // Som
  "KHR": "116",  // Riel
  "KMF": "174",  // Comorian Franc
  "KPW": "408",  // North Korean Won
  "KRW": "410",  // Won
  "KWD": "414",  // Kuwaiti Dinar
  "KYD": "136",  // Cayman Islands Dollar
  "KZT": "398",  // Tenge
  "LAK": "418",  // Lao Kip
  "LBP": "422",  // Lebanese Pound
  "LKR": "144",  // Sri Lanka Rupee
  "LRD": "430",  // Liberian Dollar
  "LSL": "426",  // Loti
  "LYD": "434",  // Libyan Dinar
  "MAD": "504",  // Moroccan Dirham
  "MDL": "498",  // Moldovan Leu
  "MGA": "969",  // Malagasy Ariary
  "MKD": "807",  // Denar
  "MMK": "104",  // Kyat
  "MNT": "496",  // Tugrik
  "MOP": "446",  // Pataca
  "MRU": "929",  // Ouguiya
  "MUR": "480",  // Mauritius Rupee
  "MVR": "462",  // Rufiyaa
  "MWK": "454",  // Malawi Kwacha
  "MXN": "484",  // Mexican Peso
  "MYR": "458",  // Malaysian Ringgit
  "MZN": "943",  // Mozambique Metical
  "NAD": "516",  // Namibia Dollar
  "NGN": "566",  // Naira
  "NIO": "558",  // Cordoba Oro
  "NOK": "578",  // Norwegian Krone
  "NPR": "524",  // Nepalese Rupee
  "NZD": "554",  // New Zealand Dollar
  "OMR": "512",  // Rial Omani
  "PAB": "590",  // Balboa
  "PEN": "604",  // Sol
  "PGK": "598",  // Kina
  "PHP": "608",  // Philippine Peso
  "PKR": "586",  // Pakistan Rupee
  "PLN": "985",  // Zloty
  "PYG": "600",  // Guarani
  "QAR": "634",  // Qatari Rial
  "RON": "946",  // Romanian Leu
  "RSD": "941",  // Serbian Dinar
  "RUB": "643",  // Russian Ruble
  "RWF": "646",  // Rwanda Franc
  "SAR": "682",  // Saudi Riyal
  "SBD": "090",  // Solomon Islands Dollar
  "SCR": "690",  // Seychelles Rupee
  "SDG": "938",  // Sudanese Pound
  "SEK": "752",  // Swedish Krona
  "SGD": "702",  // Singapore Dollar
  "SHP": "654",  // Saint Helena Pound
  "SLL": "694",  // Leone
  "SOS": "706",  // Somali Shilling
  "SRD": "968",  // Surinam Dollar
  "SSP": "728",  // South Sudanese Pound
  "STN": "930",  // Dobra
  "SVC": "222",  // El Salvador Colon
  "SYP": "760",  // Syrian Pound
  "SZL": "748",  // Lilangeni
  "THB": "764",  // Baht
  "TJS": "972",  // Somoni
  "TMT": "934",  // Turkmenistan New Manat
  "TND": "788",  // Tunisian Dinar
  "TOP": "776",  // Pa'anga
  "TRY": "949",  // Turkish Lira
  "TTD": "780",  // Trinidad and Tobago Dollar
  "TWD": "901",  // New Taiwan Dollar
  "TZS": "834",  // Tanzanian Shilling
  "UAH": "980",  // Hryvnia
  "UGX": "800",  // Uganda Shilling
  "USD": "840",  // US Dollar
  "UYU": "858",  // Peso Uruguayo
  "UZS": "860",  // Uzbekistan Sum
  "VES": "928",  // Bolívar
  "VND": "704",  // Dong
  "VUV": "548",  // Vatu
  "WST": "882",  // Tala
  "XAF": "950",  // CFA Franc BEAC
  "XCD": "951",  // East Caribbean Dollar
  "XOF": "952",  // CFA Franc BCEAO
  "XPF": "953",  // CFP Franc
  "YER": "886",  // Yemeni Rial
  "ZAR": "710",  // Rand
  "ZMW": "967",  // Zambian Kwacha
  "ZWL": "932",  // Zimbabwe Dollar
};

/**
 * Reverse mapping for decoding (numeric to alphabetic)
 */
export const NUMERIC_TO_CURRENCY_CODE: Record<string, string> =
  Object.entries(CURRENCY_CODE_MAPPING).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {} as Record<string, string>);


export const FIELD_TO_TAG_MAPPING: Record<string, string> = {
  payload_format_indicator: "00",
  initiation_method: "01",
  merchant_category_code: "52",
  currency: "53",
  amount: "54",
  country_code: "58",
  merchant_name: "59",
  merchant_city: "60",
  postal_code: "61",
  additional_data: "62",
  merchant_information: "64",
  tip_or_convenience_indicator: "55",
  value_of_convenience_fee_fixed: "56",
  value_of_convenience_fee_percentage: "57",
  merchant_code: "80",
  merchant_profile_picture: "81",
  merchant_phone_number: "82",
};

export const TAG_TO_FIELD_MAPPING: Record<string, string> = Object.entries(
  FIELD_TO_TAG_MAPPING
).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {} as Record<string, string>);

/**
 * Converts a dictionary with standard field names to EMV QR code tag IDs
 * @param fieldData Dictionary with standard field names
 * @returns Dictionary with EMV QR code tag IDs
 */
export function mapFieldsToTags(
  fieldData: Record<string, string>
): Record<string, string> {
  const emvData: Record<string, string> = {};

  emvData["00"] = "01";

  const processedFieldData = { ...fieldData };

  if ("initiation_method" in processedFieldData) {
    const method = processedFieldData.initiation_method.toLowerCase();
    if (method === "dynamic") {
      emvData["01"] = "11";
      delete processedFieldData.initiation_method;
    } else if (method === "static") {
      emvData["01"] = "12";
      delete processedFieldData.initiation_method;
    }
  }

  if ("currency" in processedFieldData) {
    let currencyValue = processedFieldData.currency;

    if (/^[A-Za-z]+$/.test(currencyValue)) {
      currencyValue = currencyValue.toUpperCase();
      if (currencyValue in CURRENCY_CODE_MAPPING) {
        processedFieldData.currency = CURRENCY_CODE_MAPPING[currencyValue];
      } else {
        throw new Error(`Unsupported currency code: ${currencyValue}`);
      }
    }
  }

  for (const [field, value] of Object.entries(processedFieldData)) {
    if (field in FIELD_TO_TAG_MAPPING) {
      const tagId = FIELD_TO_TAG_MAPPING[field];
      emvData[tagId] = value;
    }
  }

  return emvData;
}

/**
 * Converts a dictionary with EMV QR code tag IDs to standard field names
 * @param emvData Dictionary with EMV QR code tag IDs
 * @returns Dictionary with standard field names
 */
export function mapTagsToFields(
  emvData: Record<string, string>
): Record<string, string> {
  const fieldData: Record<string, string> = {};

  for (const [tag, value] of Object.entries(emvData)) {
    if (tag in TAG_TO_FIELD_MAPPING) {
      const fieldName = TAG_TO_FIELD_MAPPING[tag];
      fieldData[fieldName] = value;
    }
  }

  if (
    "currency" in fieldData &&
    fieldData.currency in NUMERIC_TO_CURRENCY_CODE
  ) {
    fieldData.currency = NUMERIC_TO_CURRENCY_CODE[fieldData.currency];
  }

  return fieldData;
}
