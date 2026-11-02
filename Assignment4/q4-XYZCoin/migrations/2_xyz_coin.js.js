

const XYZCoin = artifacts.require("XYZCoin");

module.exports = async function (deployer) {
    await deployer.deploy(XYZCoin);
};

