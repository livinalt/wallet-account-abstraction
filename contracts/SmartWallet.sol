// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import '@account-abstraction/contracts/core/EntryPoint.sol';
import '@account-abstraction/contracts/interfaces/IAccount.sol';
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@account-abstraction/contracts/core/BaseAccount.sol";
import "@openzeppelin/contracts/utils/Create2.sol";



contract SmartWallet is IAccount{
     using ECDSA for bytes32;
     
    address public owner;
    uint256 private _nonce;
    IEntryPoint private _entryPoint;


    event Deposit(address indexed sender, uint256 amount);
    event Transfered(address indexed sender, address indexed withdrawAddress, uint256 amount);

    struct Wallet {
        address owner;
        mapping(address => uint256) balances;
    }
    
    mapping(address => Wallet) wallets;


    modifier onlyOwner() {
    require(msg.sender == owner, "Only owner can call this function");
    _;
}

    // this is used to validate a valid EntryPoint and user operations
    function validateUserOp(UserOperation calldata userOp, bytes32 userOpHash, uint256 missingAccountFunds)
    external view override returns (uint256 validationData){
        address recovered = ECDSA.recover(ECDSA.toEthSignedMessageHash(userOpHash), userOp.signature);
        return owner == recovered ? 0 : 1;
    }


    function entryPoint() public view virtual returns (IEntryPoint) {
        return _entryPoint;
    }


    /**
     * check current account deposit in the entryPoint
     */
    function getDeposit() public view returns (uint256) {
        return entryPoint().balanceOf(address(this));
    }

    /**
     * deposit more funds for this account in the entryPoint
     */
    function addDeposit(uint256 amount) public payable {
        entryPoint().depositTo{value: amount}(address(this));
        emit Deposit(msg.sender, amount);
    }

    /**
     * withdraw value from the account's deposit
     * @param withdrawAddress target to send to
     * @param amount to withdraw
     */
    function withdrawDepositTo(address payable withdrawAddress, uint256 amount) public onlyOwner {
       entryPoint().withdrawTo(withdrawAddress, amount);
        emit Transfered(msg.sender, withdrawAddress, amount);
    }

   
}

contract SmartWalletFactory{

    // create an account factory
    function  createSmartWallet(address owner) external returns(address){
        
        bytes32 salt = bytes32(uint256(uint160(owner)));
        bytes memory bytecode = abi.encodePacked(type(SmartWallet).creationCode, abi.encode(owner));
        
        address addr = Create2.computeAddress(salt, keccak256(bytecode));
        if (addr.code.length >0) {
            return addr;
        }
        
        return deploy(salt, bytecode);
        
    }

    function deploy(bytes32 salt, bytes memory bytecode) internal returns (address addr) {
        require(bytecode.length != 0, "Create2: bytecode length is zero");
        /// @solidity memory-safe-assembly
        assembly {
            addr := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
        }
        require(addr != address(0), "Create2: Failed on deploy");
    }
}


