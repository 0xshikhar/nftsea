// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**

@title NFTMarketplacePaymentProcessor
@dev Contract that processes payments for NFT transactions across different chains
**/
contract NFTPaymentProcessor is Ownable, ReentrancyGuard {
    // Payment tracking to prevent double spending
    mapping(bytes32 => bool) public processedPaymentIds; // Fee percentage (in basis points, 100 = 1%)
    uint256 public feePercentage;
    uint256 private constant MAX_FEE = 2000; // 20% max fee// Supported ERC20 tokens for payment
    mapping(address => bool) public supportedTokens; // Emergency pause mechanism
    bool public paused; // Revenue tracking per token
    mapping(address => uint256) public tokenRevenue; // Operator addresses that can mark payments as completed
    mapping(address => bool) public operators; // Whitelist for trusted collections
    mapping(address => bool) public trustedCollections; // Events

    event PaymentProcessed(
        address indexed buyer,
        address indexed collection,
        uint256 nftId,
        uint256 price,
        address paymentToken,
        address seller,
        bytes32 paymentId,
        uint256 feeAmount,
        string metadata
    );
    event FeeUpdated(uint256 oldFee, uint256 newFee);
    event TokenStatusUpdated(address token, bool supported);
    event OperatorStatusUpdated(address operator, bool status);
    event CollectionStatusUpdated(address collection, bool trusted);
    event ContractPaused(bool status);
    event WithdrawalExecuted(address token, uint256 amount, address to);
    modifier notPaused() {
        require(!paused, "Contract is paused");
        _;
    }
    modifier onlyOperator() {
        require(operators[msg.sender] || owner() == msg.sender, "Not authorized");
        _;
    }

    constructor(uint256 _feePercentage) Ownable(msg.sender) {
        require(_feePercentage <= MAX_FEE, "Fee too high");
        feePercentage = _feePercentage;
        operators[msg.sender] = true;
    } /*@dev Process ETH payment for an NFT transaction
@param collection Address of the NFT collection
@param nftId The ID of the NFT being purchased
@param seller Address of the seller
@param metadata Additional transaction metadata
*/

    function processEthPayment(
        address collection,
        uint256 nftId,
        address seller,
        string calldata metadata
    ) external payable nonReentrant notPaused {
        require(msg.value > 0, "Payment amount must be greater than zero");
        require(seller != address(0), "Invalid seller address");
        require(collection != address(0), "Invalid collection address");
        if (trustedCollections[address(0)] == false) {
            require(trustedCollections[collection], "Collection not trusted");
        } // Generate a unique payment ID
        bytes32 paymentId = keccak256(
            abi.encodePacked(
                msg.sender,
                collection,
                nftId,
                seller,
                msg.value,
                address(0), // ETH payment
                block.timestamp
            )
        ); // Ensure payment hasn't been processed already
        require(!processedPaymentIds[paymentId], "Payment already processed"); // Mark payment as processed
        processedPaymentIds[paymentId] = true; // Calculate fee amount
        uint256 feeAmount = (msg.value * feePercentage) / 10000; // Update revenue tracking
        tokenRevenue[address(0)] += msg.value; // Emit event for cross-chain bridges or oracles to monitor
        emit PaymentProcessed(
            msg.sender,
            collection,
            nftId,
            msg.value,
            address(0), // ETH payment
            seller,
            paymentId,
            feeAmount,
            metadata
        );
    } /*
@dev Process ERC20 token payment for an NFT transaction
@param collection Address of the NFT collection
@param nftId The ID of the NFT being purchased
@param seller Address of the seller
@param tokenAddress Address of the ERC20 token used for payment
@param amount Amount of tokens to pay
@param metadata Additional transaction metadata
*/

    function processTokenPayment(
        address collection,
        uint256 nftId,
        address seller,
        address tokenAddress,
        uint256 amount,
        string calldata metadata
    ) external nonReentrant notPaused {
        require(amount > 0, "Payment amount must be greater than zero");
        require(seller != address(0), "Invalid seller address");
        require(collection != address(0), "Invalid collection address");
        require(supportedTokens[tokenAddress], "Token not supported");
        if (trustedCollections[address(0)] == false) {
            require(trustedCollections[collection], "Collection not trusted");
        } // Generate a unique payment ID
        bytes32 paymentId = keccak256(
            abi.encodePacked(msg.sender, collection, nftId, seller, amount, tokenAddress, block.timestamp)
        ); // Ensure payment hasn't been processed already
        require(!processedPaymentIds[paymentId], "Payment already processed"); // Mark payment as processed
        processedPaymentIds[paymentId] = true; // Transfer tokens from user to contract
        IERC20 token = IERC20(tokenAddress);
        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed"); // Calculate fee amount
        uint256 feeAmount = (amount * feePercentage) / 10000; // Update revenue tracking
        tokenRevenue[tokenAddress] += amount; // Emit event for cross-chain bridges or oracles to monitor
        emit PaymentProcessed(
            msg.sender,
            collection,
            nftId,
            amount,
            tokenAddress,
            seller,
            paymentId,
            feeAmount,
            metadata
        );
    }

    /*
@dev Update the fee percentage (in basis points)
@param _newFeePercentage New fee percentage (100 = 1%)
*/
    function updateFeePercentage(uint256 _newFeePercentage) external onlyOwner {
        require(_newFeePercentage <= MAX_FEE, "Fee too high");
        uint256 oldFee = feePercentage;
        feePercentage = _newFeePercentage;
        emit FeeUpdated(oldFee, _newFeePercentage);
    } /*
@dev Set support status for an ERC20 token
@param tokenAddress Address of the token
@param supported Whether the token is supported
*/

    function setTokenSupport(address tokenAddress, bool supported) external onlyOwner {
        require(tokenAddress != address(0), "Cannot set zero address");
        supportedTokens[tokenAddress] = supported;
        emit TokenStatusUpdated(tokenAddress, supported);
    } /*
@dev Set trusted status for a collection
@param collectionAddress Address of the collection
@param trusted Whether the collection is trusted
*/

    function setCollectionTrust(address collectionAddress, bool trusted) external onlyOwner {
        trustedCollections[collectionAddress] = trusted;
        emit CollectionStatusUpdated(collectionAddress, trusted);
    } /*
@dev Set or remove an operator
@param operatorAddress Address of the operator
@param status Operator status
*/

    function setOperator(address operatorAddress, bool status) external onlyOwner {
        require(operatorAddress != address(0), "Cannot set zero address");
        operators[operatorAddress] = status;
        emit OperatorStatusUpdated(operatorAddress, status);
    } /*
@dev Toggle emergency pause
@param _paused New pause state
*/

    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
        emit ContractPaused(_paused);
    } /*
@dev Withdraw collected ETH
@param to Address to send ETH to
@param amount Amount to withdraw
*/

    function withdrawEth(address payable to, uint256 amount) external onlyOwner {
        require(to != address(0), "Cannot withdraw to zero address");
        require(amount > 0 && amount <= address(this).balance, "Invalid amount");
        tokenRevenue[address(0)] -= amount;
        (bool success, ) = to.call{value: amount}("");
        require(success, "ETH withdrawal failed");
        emit WithdrawalExecuted(address(0), amount, to);
    } /*
@dev Withdraw collected ERC20 tokens
@param tokenAddress Address of the token to withdraw
@param to Address to send tokens to
@param amount Amount to withdraw
*/

    function withdrawTokens(address tokenAddress, address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Cannot withdraw to zero address");
        require(tokenAddress != address(0), "Invalid token address");
        require(amount > 0, "Amount must be greater than zero");
        IERC20 token = IERC20(tokenAddress);
        require(amount <= token.balanceOf(address(this)), "Insufficient balance");
        tokenRevenue[tokenAddress] -= amount;
        require(token.transfer(to, amount), "Token transfer failed");
        emit WithdrawalExecuted(tokenAddress, amount, to);
    } /*
@dev Check if a payment has been processed
@param paymentId The ID of the payment to check
@return Whether the payment has been processed
*/

    function isPaymentProcessed(bytes32 paymentId) external view returns (bool) {
        return processedPaymentIds[paymentId];
    } /*
@dev Generate a payment ID for verification purposes
*/

    function generateEthPaymentId(
        address buyer,
        address collection,
        uint256 nftId,
        address seller,
        uint256 amount,
        uint256 timestamp
    ) external pure returns (bytes32) {
        return keccak256(abi.encodePacked(buyer, collection, nftId, seller, amount, address(0), timestamp));
    } /*
@dev Generate a token payment ID for verification purposes
*/

    function generateTokenPaymentId(
        address buyer,
        address collection,
        uint256 nftId,
        address seller,
        uint256 amount,
        address tokenAddress,
        uint256 timestamp
    ) external pure returns (bytes32) {
        return keccak256(abi.encodePacked(buyer, collection, nftId, seller, amount, tokenAddress, timestamp));
    } /*
@dev Get contract balance for ETH
*/

    function getEthBalance() external view returns (uint256) {
        return address(this).balance;
    } /*
@dev Get contract balance for a specific token
*/

    function getTokenBalance(address tokenAddress) external view returns (uint256) {
        return IERC20(tokenAddress).balanceOf(address(this));
    }
}
