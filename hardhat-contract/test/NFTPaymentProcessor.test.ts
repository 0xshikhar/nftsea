import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { NFTPaymentProcessor, MockERC20, MockNFTCollection } from "../types";
import { parseEther } from "ethers";

describe("NFTPaymentProcessor", function () {
    // Test variables
    let paymentProcessor: NFTPaymentProcessor;
    let mockToken: MockERC20;
    let mockCollection: MockNFTCollection;
    let owner: SignerWithAddress;
    let operator: SignerWithAddress;
    let buyer: SignerWithAddress;
    let seller: SignerWithAddress;
    const feePercentage = 100; // 1%  

    // Setup test environment before each test
    beforeEach(async function () {
        // Get signers
        [owner, operator, buyer, seller] = await ethers.getSigners();

        // Deploy mock ERC20 token
        const MockERC20Factory = await ethers.getContractFactory("MockERC20");
        mockToken = await MockERC20Factory.deploy("Test Token", "TEST");

        // Deploy mock NFT collection
        const MockNFTCollectionFactory = await ethers.getContractFactory("MockNFTCollection");
        mockCollection = await MockNFTCollectionFactory.deploy("Test NFT", "TNFT");

        // Deploy payment processor
        const PaymentProcessorFactory = await ethers.getContractFactory("NFTPaymentProcessor");
        paymentProcessor = await PaymentProcessorFactory.deploy(feePercentage);

        // Setup test environment
        await paymentProcessor.setTokenSupport(await mockToken.getAddress(), true);
        await paymentProcessor.setCollectionTrust(await mockCollection.getAddress(), true);
        await paymentProcessor.setOperator(operator.address, true);

        // Fund buyer account with tokens
        await mockToken.mint(buyer.address, parseEther("1000"));
        await mockToken.connect(buyer).approve(await paymentProcessor.getAddress(), parseEther("1000"));
    });

    describe("Initialization", function () {
        it("Should set the correct owner", async function () {
            expect(await paymentProcessor.owner()).to.equal(owner.address);
        });

        it("Should set the correct fee percentage", async function () {
            expect(await paymentProcessor.feePercentage()).to.equal(feePercentage);
        });

        it("Should set the deployer as an operator", async function () {
            expect(await paymentProcessor.operators(owner.address)).to.be.true;
        });
    });

    describe("ETH Payment Processing", function () {
        it("Should process ETH payment correctly", async function () {
            const nftId = 1;
            const paymentAmount = parseEther("1");
            const metadata = "Test metadata";

            // Process payment
            await expect(
                paymentProcessor.connect(buyer).processEthPayment(
                    await mockCollection.getAddress(),
                    nftId,
                    seller.address,
                    metadata,
                    { value: paymentAmount }
                )
            )
                .to.emit(paymentProcessor, "PaymentProcessed")
                .withArgs(
                    buyer.address,
                    await mockCollection.getAddress(),
                    nftId,
                    paymentAmount,
                    ethers.ZeroAddress, // ETH payment
                    seller.address,
                    (paymentId: string) => typeof paymentId === "string", // Verifies it's a string
                    paymentAmount * BigInt(feePercentage) / BigInt(10000),
                    metadata
                );

            // Check revenue tracking
            expect(await paymentProcessor.tokenRevenue(ethers.ZeroAddress)).to.equal(paymentAmount);
        });

        it("Should reject ETH payment with zero amount", async function () {
            await expect(
                paymentProcessor.connect(buyer).processEthPayment(
                    await mockCollection.getAddress(),
                    1,
                    seller.address,
                    "metadata",
                    { value: 0 }
                )
            ).to.be.revertedWith("Payment amount must be greater than zero");
        });

        it("Should reject ETH payment for untrusted collection", async function () {
            // Deploy a new untrusted collection
            const UntrustedCollection = await ethers.getContractFactory("MockNFTCollection");
            const untrustedCollection = await UntrustedCollection.deploy("Untrusted", "UNTRUST");

            await expect(
                paymentProcessor.connect(buyer).processEthPayment(
                    await untrustedCollection.getAddress(),
                    1,
                    seller.address,
                    "metadata",
                    { value: parseEther("1") }
                )
            ).to.be.revertedWith("Collection not trusted");
        });
    });

    describe("Token Payment Processing", function () {
        it("Should process token payment correctly", async function () {
            const nftId = 2;
            const paymentAmount = parseEther("10");
            const metadata = "Token payment metadata";

            // Process token payment
            await expect(
                paymentProcessor.connect(buyer).processTokenPayment(
                    await mockCollection.getAddress(),
                    nftId,
                    seller.address,
                    await mockToken.getAddress(),
                    paymentAmount,
                    metadata
                )
            )
                .to.emit(paymentProcessor, "PaymentProcessed")
                .withArgs(
                    buyer.address,
                    await mockCollection.getAddress(),
                    nftId,
                    paymentAmount,
                    await mockToken.getAddress(),
                    seller.address,
                    (paymentId: string) => typeof paymentId === "string", // Verifies it's a string
                    paymentAmount * BigInt(feePercentage) / BigInt(10000),
                    metadata
                );

            // Check token balance of contract
            expect(await mockToken.balanceOf(await paymentProcessor.getAddress())).to.equal(paymentAmount);

            // Check revenue tracking
            expect(await paymentProcessor.tokenRevenue(await mockToken.getAddress())).to.equal(paymentAmount);
        });

        it("Should reject token payment for unsupported token", async function () {
            const UnsupportedToken = await ethers.getContractFactory("MockERC20");
            const unsupportedToken = await UnsupportedToken.deploy("Unsupported", "UNSUP");

            await unsupportedToken.mint(buyer.address, parseEther("100"));
            await unsupportedToken.connect(buyer).approve(await paymentProcessor.getAddress(), parseEther("100"));

            await expect(
                paymentProcessor.connect(buyer).processTokenPayment(
                    await mockCollection.getAddress(),
                    1,
                    seller.address,
                    await unsupportedToken.getAddress(),
                    parseEther("10"),
                    "metadata"
                )
            ).to.be.revertedWith("Token not supported");
        });
    });

    describe("Payment IDs and Double-Spending Prevention", function () {
        it("Should prevent double processing of payments", async function () {
            const nftId = 3;
            const paymentAmount = parseEther("1");
            const metadata = "Duplicate payment test";

            // First payment should succeed
            const tx = await paymentProcessor.connect(buyer).processEthPayment(
                await mockCollection.getAddress(),
                nftId,
                seller.address,
                metadata,
                { value: paymentAmount }
            );

            // Wait for transaction to be mined
            await tx.wait();

            // Try the exact same payment again
            await expect(
                paymentProcessor.connect(buyer).processEthPayment(
                    await mockCollection.getAddress(),
                    nftId,
                    seller.address,
                    metadata,
                    { value: paymentAmount }
                )
            ).to.be.revertedWith("Payment already processed");
        });

        it("Should correctly generate and verify payment IDs", async function () {
            const nftId = 4;
            const amount = parseEther("2");
            const timestamp = Math.floor(Date.now() / 1000);

            // Generate ETH payment ID
            const ethPaymentId = await paymentProcessor.generateEthPaymentId(
                buyer.address,
                await mockCollection.getAddress(),
                nftId,
                seller.address,
                amount,
                timestamp
            );

            // Generate token payment ID
            const tokenPaymentId = await paymentProcessor.generateTokenPaymentId(
                buyer.address,
                await mockCollection.getAddress(),
                nftId,
                seller.address,
                amount,
                await mockToken.getAddress(),
                timestamp
            );

            // Verify they are different
            expect(ethPaymentId).to.not.equal(tokenPaymentId);

            // Verify initially not processed
            expect(await paymentProcessor.isPaymentProcessed(ethPaymentId)).to.be.false;
            expect(await paymentProcessor.isPaymentProcessed(tokenPaymentId)).to.be.false;
        });
    });

    describe("Admin Functions", function () {
        it("Should update fee percentage correctly", async function () {
            const newFee = 1000; // 10%

            await expect(paymentProcessor.updateFeePercentage(newFee))
                .to.emit(paymentProcessor, "FeeUpdated")
                .withArgs(feePercentage, newFee);

            expect(await paymentProcessor.feePercentage()).to.equal(newFee);
        });

        it("Should reject fee percentage above maximum", async function () {
            const tooHighFee = 3000; // 30%, above MAX_FEE (20%)

            await expect(paymentProcessor.updateFeePercentage(tooHighFee))
                .to.be.revertedWith("Fee too high");
        });

        it("Should set token support status correctly", async function () {
            const newToken = await (await ethers.getContractFactory("MockERC20")).deploy("New Token", "NEW");

            await expect(paymentProcessor.setTokenSupport(await newToken.getAddress(), true))
                .to.emit(paymentProcessor, "TokenStatusUpdated")
                .withArgs(await newToken.getAddress(), true);

            expect(await paymentProcessor.supportedTokens(await newToken.getAddress())).to.be.true;

            await expect(paymentProcessor.setTokenSupport(await newToken.getAddress(), false))
                .to.emit(paymentProcessor, "TokenStatusUpdated")
                .withArgs(await newToken.getAddress(), false);

            expect(await paymentProcessor.supportedTokens(await newToken.getAddress())).to.be.false;
        });

        it("Should set collection trust status correctly", async function () {
            const newCollection = await (await ethers.getContractFactory("MockNFTCollection")).deploy("New NFT", "NNFT");

            await expect(paymentProcessor.setCollectionTrust(await newCollection.getAddress(), true))
                .to.emit(paymentProcessor, "CollectionStatusUpdated")
                .withArgs(await newCollection.getAddress(), true);

            expect(await paymentProcessor.trustedCollections(await newCollection.getAddress())).to.be.true;
        });

        it("Should set operator status correctly", async function () {
            const newOperator = (await ethers.getSigners())[5];

            await expect(paymentProcessor.setOperator(newOperator.address, true))
                .to.emit(paymentProcessor, "OperatorStatusUpdated")
                .withArgs(newOperator.address, true);

            expect(await paymentProcessor.operators(newOperator.address)).to.be.true;
        });

        it("Should toggle pause state correctly", async function () {
            expect(await paymentProcessor.paused()).to.be.false;

            await expect(paymentProcessor.setPaused(true))
                .to.emit(paymentProcessor, "ContractPaused")
                .withArgs(true);

            expect(await paymentProcessor.paused()).to.be.true;

            // Try to process payment while paused
            await expect(
                paymentProcessor.connect(buyer).processEthPayment(
                    await mockCollection.getAddress(),
                    1,
                    seller.address,
                    "metadata",
                    { value: parseEther("1") }
                )
            ).to.be.revertedWith("Contract is paused");

            // Unpause
            await paymentProcessor.setPaused(false);
            expect(await paymentProcessor.paused()).to.be.false;
        });
    });

    describe("Withdrawal Functions", function () {
        it("Should withdraw ETH correctly", async function () {
            // First, send some ETH to the contract
            await paymentProcessor.connect(buyer).processEthPayment(
                await mockCollection.getAddress(),
                1,
                seller.address,
                "metadata",
                { value: parseEther("5") }
            );

            const withdrawAmount = parseEther("2");
            const initialBalance = await ethers.provider.getBalance(owner.address);

            // Withdraw ETH
            await expect(paymentProcessor.withdrawEth(owner.address, withdrawAmount))
                .to.emit(paymentProcessor, "WithdrawalExecuted")
                .withArgs(ethers.ZeroAddress, withdrawAmount, owner.address);

            // Check owner balance increased
            const newBalance = await ethers.provider.getBalance(owner.address);
            expect(newBalance).to.be.gt(initialBalance);

            // Check contract ETH balance decreased
            expect(await paymentProcessor.getEthBalance()).to.equal(parseEther("3"));

            // Check revenue tracking decreased
            expect(await paymentProcessor.tokenRevenue(ethers.ZeroAddress)).to.equal(parseEther("3"));
        });

        it("Should withdraw ERC20 tokens correctly", async function () {
            // First, send some tokens to the contract
            await paymentProcessor.connect(buyer).processTokenPayment(
                await mockCollection.getAddress(),
                1,
                seller.address,
                await mockToken.getAddress(),
                parseEther("50"),
                "metadata"
            );

            const withdrawAmount = parseEther("20");

            // Withdraw tokens
            await expect(paymentProcessor.withdrawTokens(await mockToken.getAddress(), owner.address, withdrawAmount))
                .to.emit(paymentProcessor, "WithdrawalExecuted")
                .withArgs(await mockToken.getAddress(), withdrawAmount, owner.address);

            // Check owner token balance
            expect(await mockToken.balanceOf(owner.address)).to.equal(withdrawAmount);

            // Check contract token balance
            expect(await paymentProcessor.getTokenBalance(await mockToken.getAddress())).to.equal(parseEther("30"));

            // Check revenue tracking decreased
            expect(await paymentProcessor.tokenRevenue(await mockToken.getAddress())).to.equal(parseEther("30"));
        });

        it("Should reject ETH withdrawal when amount exceeds balance", async function () {
            await paymentProcessor.connect(buyer).processEthPayment(
                await mockCollection.getAddress(),
                1,
                seller.address,
                "metadata",
                { value: parseEther("1") }
            );

            await expect(paymentProcessor.withdrawEth(owner.address, parseEther("2")))
                .to.be.revertedWith("Invalid amount");
        });

        it("Should reject token withdrawal when amount exceeds balance", async function () {
            await paymentProcessor.connect(buyer).processTokenPayment(
                await mockCollection.getAddress(),
                1,
                seller.address,
                await mockToken.getAddress(),
                parseEther("10"),
                "metadata"
            );

            await expect(paymentProcessor.withdrawTokens(await mockToken.getAddress(), owner.address, parseEther("20")))
                .to.be.revertedWith("Insufficient balance");
        });
    });

    describe("Access Control", function () {
        it("Should prevent non-owners from calling admin functions", async function () {
            const nonOwner = buyer;

            await expect(paymentProcessor.connect(nonOwner).updateFeePercentage(1000))
                .to.be.reverted;

            await expect(paymentProcessor.connect(nonOwner).setTokenSupport(await mockToken.getAddress(), false))
                .to.be.reverted;

            await expect(paymentProcessor.connect(nonOwner).setCollectionTrust(await mockCollection.getAddress(), false))
                .to.be.reverted;

            await expect(paymentProcessor.connect(nonOwner).setOperator(nonOwner.address, true))
                .to.be.reverted;

            await expect(paymentProcessor.connect(nonOwner).setPaused(true))
                .to.be.reverted;

            await expect(paymentProcessor.connect(nonOwner).withdrawEth(nonOwner.address, parseEther("1")))
                .to.be.reverted;
        });

        it("Should allow operators to perform authorized functions", async function () {
            // Operators should be able to perform only operator-specific functions
            // Currently the contract doesn't have operator-specific functions
            expect(await paymentProcessor.operators(operator.address)).to.be.true;
        });
    });

    describe("Balance Checking", function () {
        it("Should correctly report ETH balance", async function () {
            expect(await paymentProcessor.getEthBalance()).to.equal(0);

            // Use the proper function to send ETH to the contract
            await paymentProcessor.connect(buyer).processEthPayment(
                await mockCollection.getAddress(),
                1,
                seller.address,
                "metadata",
                { value: parseEther("3") }
            );

            expect(await paymentProcessor.getEthBalance()).to.equal(parseEther("3"));
        });

        it("Should correctly report token balance", async function () {
            expect(await paymentProcessor.getTokenBalance(await mockToken.getAddress())).to.equal(0);

            await paymentProcessor.connect(buyer).processTokenPayment(
                await mockCollection.getAddress(),
                1,
                seller.address,
                await mockToken.getAddress(),
                parseEther("25"),
                "metadata"
            );

            expect(await paymentProcessor.getTokenBalance(await mockToken.getAddress())).to.equal(parseEther("25"));
        });
    });
}); 