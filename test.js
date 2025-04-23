// Test script for EMV QR code encoder with custom fields
const { encodeEmvQr } = require('./dist');

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
    const fieldName = Object.entries(require('./dist/utils').FIELD_TO_TAG_MAPPING)
        .find(([_, v]) => v === comp.tag)?.[0] || 'unknown';

    console.log(`Tag ${comp.tag} (${fieldName}): ${comp.value} (length: ${comp.length})`);
});