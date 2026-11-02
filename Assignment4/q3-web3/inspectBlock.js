
require("dotenv").config();
const { Web3 } = require("web3");

const web3 = new Web3(process.env.INFURA_URL);

async function main() {
    // 先查看第 1000 个区块
    const blockNumber = 1000;

    // true 表示获取完整交易对象
    const block = await web3.eth.getBlock(blockNumber, true);

    console.log("Block number:", block.number.toString());
    console.log("Transaction count:", block.transactions.length);

    // 遍历区块中的每一笔交易
    for (const tx of block.transactions) {
        console.log("-------------------");
        console.log("Hash:", tx.hash);
        console.log("From:", tx.from);
        console.log("To:", tx.to);

        // 判断是否为合约创建交易
        if (tx.to === null) {
            console.log("Contract creation detected!");
        }
    }
}

main().catch(console.error);
