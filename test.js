// Test script for EMV QR code encoder with custom fields
const { encodeEmvQr } = require('./dist');

const data = {
    initiation_method: "dynamic",
    merchant_name: "RIEI",
    merchant_code: "1234567890",
    merchant_city: "Paris",
    merchant_profile_picture: "id3452I5I3.jpg",
    merchant_phone_number: "+33666666666",
    country_code: "FR",
    currency: "EUR",
    amount: "42.00",
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