
pragma solidity ^0.5.1;

// ERC-20 standard interface
interface ERC20 {

    // Total token supply
    function totalSupply()
        external view returns (uint256);

    // Token balance of an account
    function balanceOf(address account)
        external view returns (uint256);

    // Transfer tokens
    function transfer(address to, uint256 value)
        external returns (bool);

    // Approved amount for a spender
    function allowance(address owner, address spender)
        external view returns (uint256);

    // Approve another account to spend tokens
    function approve(address spender, uint256 value)
        external returns (bool);

    // Transfer tokens on behalf of another account
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);

    // Emitted when tokens are transferred
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 value
    );

    // Emitted when an allowance is approved
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}
