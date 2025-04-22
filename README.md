# EMVQRC-JS - EMV QR Code Library for JavaScript

A JavaScript library for encoding and decoding EMV QR codes used in financial transactions according to the EMV® QR Code Specification.

## Overview

This library provides tools for working with EMV QR codes, which are used for facilitating mobile payments and financial transactions across various payment systems. It supports both encoding payment data into EMV QR code format and decoding QR code payloads into structured data.

## Features

- Generate EMV QR code payloads from structured payment data
- Parse and decode EMV QR code payloads into structured data
- Validate QR codes using CRC-16 checksums
- Compliant with EMV® QR Code Specification
- **User-friendly field names** instead of raw EMV tag IDs
- **Human-readable currency codes** (use "USD", "EUR", "XAF" instead of numeric codes)

## Installation

```bash
# Install via npm
npm install emvqrc-js

# Or using yarn
yarn add emvqrc-js
```

## Usage

### Encoding EMV QR Codes

```javascript
import { encodeEmvQr } from 'emvqrc-js';

// Prepare payment data
const paymentData = {
  "01": "12",                        // Point of Initiation Method: static
  "26": "0014A000000000010203040506", // Merchant Account Information
  "52": "5311",                      // Merchant Category Code
  "53": "840",                       // Transaction Currency Code (USD)
  "54": "12.34",                     // Transaction Amount
  "58": "US",                        // Country Code
  "59": "CoffeeShop",                // Merchant Name
  "60": "NewYork"                    // Merchant City
};

// Generate EMV QR code payload
const qrPayload = encodeEmvQr(paymentData);
console.log(qrPayload);
```

### Using User-Friendly Field Names

```javascript
import { encodeEmvQrFriendly } from 'emvqrc-js';

// Prepare payment data with user-friendly field names
const paymentData = {
  initiation_method: "dynamic",      // Instead of "01": "11"
  merchant_name: "RIEI",             // Instead of "59": "RIEI"
  merchant_city: "Paris",            // Instead of "60": "Paris"
  country_code: "FR",                // Instead of "58": "FR"
  currency: "EUR",                   // Instead of "53": "978" (now using alphabetic code)
  amount: "42.00",                   // Instead of "54": "42.00"
  merchant_category_code: "5812"     // Instead of "52": "5812"
};

// Generate EMV QR code payload
const qrPayload = encodeEmvQrFriendly(paymentData);
console.log(qrPayload);
```

### Decoding EMV QR Codes

```javascript
import { decodeEmvQr, validateCrc } from 'emvqrc-js';

// QR code payload string
const payload = "000201010212260014A00000000001020304050652045311530384054012.345802US5909CoffeeShop6007NewYork6304ABCD";

// Validate the CRC checksum
if (validateCrc(payload)) {
  // Decode the payload
  const decodedData = decodeEmvQr(payload);
  console.log(decodedData);
} else {
  console.log("Invalid QR code payload");
}
```

### Decoding with User-Friendly Field Names

```javascript
import { decodeEmvQrFriendly } from 'emvqrc-js';

// QR code payload string
const payload = "00020101110458125303978540642.005802FR5904RIEI6005Paris6304ABCD";

// Decode with user-friendly field names
try {
  const decodedData = decodeEmvQrFriendly(payload);
  console.log(`Payment to: ${decodedData.merchant_name}`);
  console.log(`Amount: ${decodedData.amount} ${decodedData.currency}`);  // Will show "EUR" instead of "978"
  console.log(`Location: ${decodedData.merchant_city}, ${decodedData.country_code}`);
} catch (error) {
  console.error(`Error: ${error.message}`);
}
```

## EMV QR Code Data Elements

The library follows the EMV QR Code specification with these data elements:

| ID   | Name                          | Description                                 | Required |
|------|-------------------------------|---------------------------------------------|----------|
| 00   | QR Format Indicator           | Version of the QR code format               | Yes      |
| 01   | Point of Initiation Method    | Static (11-12) or Dynamic (11-13)           | Optional |
| 02-51| Reserved for future use       | Various merchant account information        | Optional |
| 52   | Merchant Category Code        | ISO 18245 merchant category code            | Yes      |
| 53   | Transaction Currency          | ISO 4217 currency code                      | Yes      |
| 54   | Transaction Amount            | Amount to be paid                           | Optional |
| 55   | Tip or Convenience Indicator  | Tip handling instructions                   | Optional |
| 56   | Value of Convenience Fee Fixed| Fixed convenience fee                       | Optional |
| 57   | Value of Convenience Fee %    | Percentage-based convenience fee            | Optional |
| 58   | Country Code                  | ISO 3166 country code                       | Yes      |
| 59   | Merchant Name                 | Name of the merchant                        | Yes      |
| 60   | Merchant City                 | City of the merchant                        | Yes      |
| 61   | Postal Code                   | Postal/ZIP code                             | Optional |
| 62   | Additional Data Field Template| Additional information                      | Optional |
| 63   | CRC                           | Checksum for detecting errors               | Yes      |
| 64   | Merchant Information          | Language preference and merchant information| Optional |
| 65-79| Reserved for future use       | Reserved for EMVCo                          | Optional |
| 80-99| Unreserved templates          | Payment system-specific templates           | Optional |

## License

[MIT License](LICENSE)