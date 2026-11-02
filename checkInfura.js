
const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, ".env"),
    quiet: true
});

async function main() {
    const url = process.env.INFURA_URL;

    if (!url || url.includes("YOUR_API_KEY")) {
        throw new Error("Please configure your real Infura URL.");
    }

    console.log("RPC host:", new URL(url).hostname);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_blockNumber",
            params: [],
            id: 1
        })
    });

    const data = await response.json();

    if (!response.ok || data.error) {
        console.error("HTTP status:", response.status);
        console.error("RPC error:", data.error ?? "Request failed");
        return;
    }

    console.log(
        "Latest block:",
        parseInt(data.result, 16)
    );
}

main().catch(error => {
    console.error("Connection error:", error.message);
});
