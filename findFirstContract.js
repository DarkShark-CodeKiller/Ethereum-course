const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, ".env"),
    quiet: true
});

const { Web3 } = require("web3");

const rpc = process.env.INFURA_URL;

if (!rpc) {
    throw new Error("INFURA_URL is not configured!");
}

const web3 = new Web3(rpc);

// 从以太坊早期有交易的区块附近开始
const START_BLOCK = 46147;
const END_BLOCK = 47000;
const BATCH_SIZE = 3;

async function main() {
    console.log("Searching for the first contract creation...");

    for (
        let start = START_BLOCK;
        start <= END_BLOCK;
        start += BATCH_SIZE
    ) {
        const end = Math.min(
            start + BATCH_SIZE - 1,
            END_BLOCK
        );

        // 准备这一批区块编号
        const numbers = [];
        for (let i = start; i <= end; i++) {
            numbers.push(i);
        }

        // 并行请求，但保留区块编号顺序
        const blocks = await Promise.all(
            numbers.map(n => web3.eth.getBlock(n, true))
        );

        // 按区块编号由小到大检查
        for (const block of blocks) {
            for (const tx of block.transactions) {

                // to 为 null：合约创建交易
                if (tx.to === null) {

                    const receipt =
                        await web3.eth.getTransactionReceipt(tx.hash);

                    console.log("\nContract creation found!");
                    console.log("Block:", block.number.toString());
                    console.log("Transaction hash:", tx.hash);
                    console.log("Sender:", tx.from);
                    console.log("Recipient:", tx.to);
                    console.log(
                        "Contract address:",
                        receipt.contractAddress
                    );
                    console.log(
                        "Gas used:",
                        receipt.gasUsed.toString()
                    );

                    console.log(
                        "Etherscan:",
                        `https://etherscan.io/tx/${tx.hash}`
                    );

                    return;
                }
            }
        }

        // 每 100 个区块显示一次进度
        if ((start - START_BLOCK) % 100 === 0) {
            console.log("Scanned through block", end);
        }
    }

    console.log("No contract creation found in range.");
}

main().catch(error => {
    console.error("Scan failed:", error.message);
    process.exitCode = 1;
});
