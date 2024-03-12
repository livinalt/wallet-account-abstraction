# Smart Contract Wallet

This project implements a smart contract wallet system using Solidity and account abstraction. It allows users to create their own smart contract wallets and perform basic wallet operations such as sending and receiving funds, as well as checking wallet balances.

## Features

- **Create Wallet**: Each user can create their own smart contract wallet.
- **Send and Receive Funds**: Users can send and receive cryptocurrencies through their wallet.
- **View Balance**: Users can check their wallet balances.
- **Testnet Support**: The project is designed to be tested on Ethereum testnets.

## Tools Used

- **Hardhat**: Development environment for Ethereum smart contracts.
- **React**: JavaScript library for building user interfaces.
- **ethers.js**: Ethereum library for interacting with smart contracts.
- **Web3Modal**: Library for connecting to various Ethereum wallets.
- **WalletConnectProvider**: Provider for connecting to wallets via WalletConnect.


## Usage

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/livinalt/wallet-account-abstraction
    ```

2. Install dependencies:

    ```bash
    cd wallet-account-abstraction
    npm install
    ```

### Deploying Smart Contracts

1. Deploy the smart contracts:

    ```bash
    npx hardhat run scripts/deploy.js --network <network-name>
    ```

### Frontend Integration

1. Start the development server:

    ```bash
    npm start
    ```

2. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to access the frontend.

### Wallet Operations

#### Sending Funds

```javascript
const recipientAddress = "0x..."; // Recipient's address
const amount = 0.1; // Amount to send
await walletContract.sendFunds(recipientAddress, amount);
```

#### Receiving Funds

```javascript
const amountReceived = await walletContract.receiveFunds();
console.log("Received:", amountReceived);
```

#### Checking Balance

```javascript
const balance = await walletContract.getBalance();
console.log("Balance:", balance);
```

## Testing

1. Run tests:

    ```bash
    npx hardhat test
    ```

## Contributing

Contributions are welcome. Please follow the standard GitHub flow:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your fork.
5. Submit a pull request to the main repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

Feel free to modify this README.md file as needed to suit your project's specific requirements.