// Test script for EMV QR code encoder with custom fields
const { encodeEmvQr, decodeEmvQr, decodeEmvQrFriendly, validateCrc } = require("./dist");

const data = {
    initiation_method: "dynamic",
    merchant_name: "AMONO AYMAR",
    merchant_code: "1234567890",
    merchant_city: "YAOUNDE",
    merchant_profile_picture: "0196601113ae73cba12f40b5f7674ee8",
    merchant_phone_number: "698049742",
    country_code: "CM",
    currency: "XAF",
    amount: "100000",
    merchant_category_code: "5812",
};

const qrCodePayload = encodeEmvQr(data);
console.log("EMV QR Code Payload:");
console.log(qrCodePayload);

// Analyze the output by splitting it into TLV components
const analyzeQrCode = (payload) => {
    let position = 0;
    const components = [];

    while (position < payload.length) {
        const tag = payload.substr(position, 2);
        position += 2;

        const lengthStr = payload.substr(position, 2);
        const length = parseInt(lengthStr, 10);
        position += 2;

        const value = payload.substr(position, length);
        position += length;

        components.push({ tag, length: lengthStr, value });
    }

    return components;
};

const components = analyzeQrCode(qrCodePayload);
console.log("\nQR Code Components:");
components.forEach(comp => {
    const fieldName = Object.entries(require("./dist/utils").FIELD_TO_TAG_MAPPING)
        .find(([_, v]) => v === comp.tag)?.[0] || "unknown";

    console.log(`Tag ${comp.tag} (${fieldName}): ${comp.value} (length: ${comp.length})`);
});

// ===== DECODE TEST SECTION =====
console.log("\n===== DECODE TEST =====");

// 1. Test decoding the QR code we just created
console.log("\n1. Decoding the generated QR code:");
if (validateCrc(qrCodePayload)) {
    const decodedQR = decodeEmvQr(qrCodePayload);
    console.log("Decoded QR (with tag names):");
    console.log(decodedQR);

    const decodedQRFriendly = decodeEmvQrFriendly(qrCodePayload);
    console.log("\nDecoded QR (with friendly names):");
    console.log(decodedQRFriendly);

    // Verify specific fields
    console.log("\nVerifying specific decoded fields:");
    console.log(`Merchant Name: ${decodedQRFriendly.merchant_name}`);
    console.log(`Amount: ${decodedQRFriendly.amount} ${decodedQRFriendly.currency}`);
    console.log(`Merchant Category Code: ${decodedQRFriendly.merchant_category_code}`);
    console.log(`Country: ${decodedQRFriendly.country_code}`);
} else {
    console.log("Invalid QR code (CRC check failed)");
}

// 2. Test decoding a sample EMV QR code for a coffee shop
// Generate a valid QR code instead of using a hard-coded one with invalid CRC
const sampleCoffeeShopData = {
    initiation_method: "static",
    merchant_name: "CoffeeShop",
    merchant_city: "NewYork",
    country_code: "US",
    currency: "USD",
    amount: "12.34",
    merchant_category_code: "5812",
};
const sampleQRCode = encodeEmvQr(sampleCoffeeShopData);
console.log("\n2. Decoding a sample coffee shop QR code:");
try {
    const decodedSample = decodeEmvQrFriendly(sampleQRCode);
    console.log("Decoded sample QR code:");
    console.log(decodedSample);
} catch (error) {
    console.log(`Error decoding sample: ${error.message}`);
}

// 3. Test handling a malformed QR code
console.log("\n3. Testing error handling with invalid QR code:");
const invalidQRCode = "00020101021229300012D156000000000510A93FO3230Q31280012D156000000010308123456786304BEEF";
try {
    const decodedInvalid = decodeEmvQr(invalidQRCode);
    console.log("Decoded invalid QR code (should not reach here):");
    console.log(decodedInvalid);
} catch (error) {
    console.log(`Expected error occurred: ${error.message}`);
}

// 4. Test specifically focusing on merchant category code
console.log("\n4. Test focusing on merchant category code:");
const mccTestData = {
    initiation_method: "static",
    merchant_name: "Restaurant ABC",
    merchant_city: "Berlin",
    country_code: "DE",
    currency: "EUR",
    amount: "25.99",
    // Testing different MCC codes:
    merchant_category_code: "5812", // Restaurants
};

const mccTestQRCode = encodeEmvQr(mccTestData);
try {
    const decodedMCC = decodeEmvQrFriendly(mccTestQRCode);
    console.log(`MCC Code: ${decodedMCC.merchant_category_code} (5812 = Restaurants)`);

    // Verify it matches what we put in
    const mccMatches = decodedMCC.merchant_category_code === mccTestData.merchant_category_code;
    console.log(`MCC matches original value: ${mccMatches ? "YES" : "NO"}`);
} catch (error) {
    console.log(`Error in MCC test: ${error.message}`);
}