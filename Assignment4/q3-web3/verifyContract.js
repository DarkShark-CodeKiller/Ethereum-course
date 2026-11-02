
const path = require("path");
require("dotenv").config({
    path: path.join(__dirname, ".env"),
    quiet: true
});

const { Web3 } = require("web3");
const web3 = new Web3(process.env.INFURA_URL);

async function main() {
    const txHash =
        "0x6c929e1c3d860ee225d7f3a7addf9e3f740603d243260536dfa2f3cf02b51de4";

    const receipt = await web3.eth.getTransactionReceipt(txHash);

    console.log("Receipt status:", receipt.status ?? "Not available");
    console.log("Contract address:", receipt.contractAddress);

    if (receipt.contractAddress) {
        const code = await web3.eth.getCode(
            receipt.contractAddress,
            receipt.blockNumber
        );

        console.log("Contract code:", code);
        console.log(
            "Has deployed code:",
            code !== "0x" && code !== "0x0"
        );
    }
}

main().catch(console.error);
