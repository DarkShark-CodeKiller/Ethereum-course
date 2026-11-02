
pragma solidity ^0.5.1;

import "./ERC20.sol";

contract XYZCoin is ERC20 {

    // Token information
    string public name = "XYZCoin";
    string public symbol = "XYZ";
    uint8 public decimals = 0;

    // Total supply: 1000 tokens
    uint256 public totalSupply = 1000;

    // Token balances
    mapping(address => uint256) public balances;

    // Approved spending allowances
    mapping(address => mapping(address => uint256)) public allowed;

    // Constructor: allocate all tokens to creator
    constructor() public {
        balances[msg.sender] = totalSupply;

        emit Transfer(
            address(0),
            msg.sender,
            totalSupply
        );
    }

    // Get token balance
    function balanceOf(address account)
        public view returns (uint256)
    {
        return balances[account];
    }

    // Transfer tokens
    function transfer(address to, uint256 value)
        public returns (bool)
    {
        require(to != address(0), "Invalid recipient");
        require(
            balances[msg.sender] >= value,
            "Insufficient balance"
        );

        require(
            balances[to] <= uint256(-1) - value,
            "Balance overflow"
        );

        balances[msg.sender] -= value;
        balances[to] += value;

        emit Transfer(msg.sender, to, value);

        return true;
    }

    // Approve spending
    function approve(address spender, uint256 value)
        public returns (bool)
    {
        require(
            spender != address(0),
            "Invalid spender"
        );

        allowed[msg.sender][spender] = value;

        emit Approval(msg.sender, spender, value);

        return true;
    }

    // Read allowance
    function allowance(address owner, address spender)
        public view returns (uint256)
    {
        return allowed[owner][spender];
    }

    // Transfer on behalf of another account
    function transferFrom(
        address from,
        address to,
        uint256 value
    )
        public returns (bool)
    {
        require(from != address(0), "Invalid sender");
        require(to != address(0), "Invalid recipient");

        require(
            balances[from] >= value,
            "Insufficient balance"
        );

        require(
            allowed[from][msg.sender] >= value,
            "Insufficient allowance"
        );

        require(
            balances[to] <= uint256(-1) - value,
            "Balance overflow"
        );

        balances[from] -= value;
        balances[to] += value;
        allowed[from][msg.sender] -= value;

        emit Transfer(from, to, value);

        return true;
    }
}
