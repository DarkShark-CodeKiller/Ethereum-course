
const XYZCoin = artifacts.require("XYZCoin");
const truffleAssert = require("truffle-assertions");

contract("XYZCoin", accounts => {

    const owner = accounts[0];
    const alice = accounts[1];
    const bob = accounts[2];

    let coin;

    // Deploy a fresh contract before every test
    beforeEach(async () => {
        coin = await XYZCoin.new({ from: owner });
    });

    // 1. Token name
    it("should set the token name correctly", async () => {
        const name = await coin.name();
        assert.equal(name, "XYZCoin");
    });

    // 2. Token symbol and decimals
    it("should set symbol and decimals correctly", async () => {
        assert.equal(await coin.symbol(), "XYZ");
        assert.equal((await coin.decimals()).toString(), "0");
    });

    // 3. Initial supply and owner balance
    it("should allocate all tokens to creator", async () => {
        const supply = await coin.totalSupply();
        const balance = await coin.balanceOf(owner);

        assert.equal(supply.toString(), "1000");
        assert.equal(balance.toString(), "1000");
    });

    // 4. Normal transfer
    it("should transfer tokens", async () => {
        await coin.transfer(alice, 100, { from: owner });

        assert.equal(
            (await coin.balanceOf(owner)).toString(),
            "900"
        );

        assert.equal(
            (await coin.balanceOf(alice)).toString(),
            "100"
        );
    });

    // 5. Approve and read allowance
    it("should approve and read allowance", async () => {
        await coin.approve(bob, 200, { from: owner });

        const amount = await coin.allowance(owner, bob);

        assert.equal(amount.toString(), "200");
    });

    // 6. Delegated transfer
    it("should allow transferFrom", async () => {
        await coin.approve(bob, 200, { from: owner });

        await coin.transferFrom(
            owner,
            alice,
            150,
            { from: bob }
        );

        assert.equal(
            (await coin.balanceOf(alice)).toString(),
            "150"
        );

        assert.equal(
            (await coin.allowance(owner, bob)).toString(),
            "50"
        );
    });

    // 7. Insufficient balance must revert
    it("should reject insufficient balance", async () => {
        await truffleAssert.reverts(
            coin.transfer(alice, 2000, { from: owner }),
            "Insufficient balance"
        );
    });

    // 8. Unauthorized transferFrom must revert
    it("should reject unauthorized transferFrom", async () => {
        await truffleAssert.reverts(
            coin.transferFrom(owner, alice, 50, { from: bob }),
            "Insufficient allowance"
        );
    });

    // 9. Normal transfer emits Transfer
    it("should emit Transfer event", async () => {
        const tx = await coin.transfer(
            alice, 100, { from: owner }
        );

        truffleAssert.eventEmitted(tx, "Transfer", ev =>
            ev.from.toLowerCase() === owner.toLowerCase() &&
            ev.to.toLowerCase() === alice.toLowerCase() &&
            ev.value.toString() === "100"
        );
    });

    // 10. Zero-value transfer emits Transfer
    it("should emit Transfer for zero tokens", async () => {
        const tx = await coin.transfer(
            alice, 0, { from: owner }
        );

        truffleAssert.eventEmitted(tx, "Transfer", ev =>
            ev.value.toString() === "0"
        );
    });

    // 11. transferFrom emits Transfer
    it("should emit Transfer from transferFrom", async () => {
        await coin.approve(bob, 100, { from: owner });

        const tx = await coin.transferFrom(
            owner,
            alice,
            50,
            { from: bob }
        );

        truffleAssert.eventEmitted(tx, "Transfer", ev =>
            ev.from.toLowerCase() === owner.toLowerCase() &&
            ev.to.toLowerCase() === alice.toLowerCase() &&
            ev.value.toString() === "50"
        );
    });

    // 12. Zero-value transferFrom emits Transfer
    it("should emit Transfer for zero-value transferFrom", async () => {
        const tx = await coin.transferFrom(
            owner,
            alice,
            0,
            { from: bob }
        );

        truffleAssert.eventEmitted(tx, "Transfer", ev =>
            ev.value.toString() === "0"
        );
    });

    // 13. approve emits Approval
    it("should emit Approval event", async () => {
        const tx = await coin.approve(
            bob, 200, { from: owner }
        );

        truffleAssert.eventEmitted(tx, "Approval", ev =>
            ev.owner.toLowerCase() === owner.toLowerCase() &&
            ev.spender.toLowerCase() === bob.toLowerCase() &&
            ev.value.toString() === "200"
        );
    });

});

