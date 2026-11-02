
require("dotenv").config();

const { Web3 } = require("web3");

// 通过 Infura 连接以太坊主网
const web3 = new Web3(process.env.INFURA_URL);

async function main() {
    // 获取最新区块编号
    const blockNumber = await web3.eth.getBlockNumber();

    // 获取以太坊创世区块（编号 0）
    const genesisBlock = await web3.eth.getBlock(0);

    console.log("Latest block:", blockNumber.toString());
    console.log("Genesis block number:", genesisBlock.number.toString());
    console.log("Genesis block hash:", genesisBlock.hash);
}

main().catch(console.error);
