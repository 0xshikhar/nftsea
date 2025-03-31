// Define ABIs for the relayer service
export const ethereumBridgeABI = [
    'event TokensDeposited(address indexed user, address indexed token, uint256 amount, uint256 destinationChainId, bytes32 depositId)'
];

export const espressoBridgeABI = [
    'function confirmDeposit(address user, address token, uint256 amount, bytes32 depositId)',
    'event PurchaseInitiated(address indexed user, address indexed token, uint256 amount, uint256 targetChainId, address nftContract, uint256 nftId, bytes32 purchaseId)'
];

export const arbitrumBridgeABI = [
    'function executeNFTPurchase(address user, address nftContract, uint256 nftId, uint256 price, bytes32 purchaseId)'
]; 