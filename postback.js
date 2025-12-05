const fetch = require("node-fetch");

exports.handler = async (event, context) => {
    try {
        const params = event.queryStringParameters || {};

        // Secret key for security
        const SECRET_KEY = "MY_SECRET_123"; // নিজের secret key বসাও
        if (!params.key || params.key !== SECRET_KEY) {
            return { statusCode: 403, body: "Invalid Key" };
        }

        // CPAGrip parameters
        const payout = params.payout || "0";
        const offer_id = params.offer_id || "Unknown";
        const tracking_id = params.tracking_id || "Unknown";

        const time = new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" });

        // Telegram credentials
        const BOT_TOKEN = "8581335823:AAGXTfJ6GIL6NYsIIIbiKKBUKX6hu3RKG1M";
        const CHAT_ID = -5023570952;

        // Save conversion (Netlify KV pseudo)
        const key = `conv_${Date.now()}`;
        await context.client.set(key, JSON.stringify({ payout, offer_id, tracking_id, time }));

        // Send Telegram message
        const text = `🔥 New Conversion!\nOffer: ${offer_id}\nTracking ID: ${tracking_id}\nPayout: $${payout}\nTime: ${time}`;
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text }),
        });

        return { statusCode: 200, body: "Postback received + Telegram sent" };
    } catch (err) {
        return { statusCode: 500, body: "Error: " + err.toString() };
    }
};
