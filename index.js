import Web3 from "web3"
import fs from "fs";
import {
    Abi
} from "./abi.js";
import Tx from "ethereumjs-tx"
import { abiContract, dapptokenContractData } from "./dappTokenContract.js";
const ApiKey = "ac8b92f8b3a14ae7a478378794e4131f";
const mainnetUrl = "https://mainnet.infura.io/v3/ac8b92f8b3a14ae7a478378794e4131f";
const myTestAddress = "0x3DD4d25dd807C03EE6f62A99B5D65886AdBBf7eB";
const etherAddrerss = "0x0716a17FBAeE714f1E6aB0f9d59edbC5f09815C0"
const contractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const GanacheURL = "HTTP://127.0.0.1:7545";


async function getBalance() {
    const web3 = new Web3(mainnetUrl);
    const addressBalance = await web3.eth.getBalance("0x3c02560B4CbbF3B6FCa2843B19396ED16a3F0dc9");
    const wei = web3.utils.fromWei(addressBalance, 'ether'); // convert unit
    console.log(makeAmountFormat(addressBalance));
    console.log(wei);
}

function makeAmountFormat(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
async function createWeb3Account(web3) {
    const accountDetail = await web3.eth.accounts.create();
    //address, privateKey, encrypt, sign, signTransaction
    fs.appendFileSync("./accounts.json", "\n\n" + JSON.stringify(accountDetail, null, 4))
    return accountDetail
}
async function createNewContract(address) {
    const web3 = new Web3(mainnetUrl);
    const contract = new web3.eth.Contract(Abi, address)
    console.log(await contract.methods.balanceOf("0x5754284f345afc66a98fbb0a0afe71e0f007b949").call());
}

async function createTransaction() {
    const etherGanacheAddress = "0xe31C40a32175Ac0905Dd5B61171De97AB3f71baf";
    const recieverGanacheAddress = "0x3dd4d25dd807c03ee6f62a99b5d65886adbbf7eb";
    const web3 = new Web3(GanacheURL);
    const balance = await web3.eth.getBalance(etherGanacheAddress);
    const ethUnit = web3.utils.fromWei(balance, "ether")
    const transactionAmount = web3.utils.toWei('2', "ether");
    const transactionResult = await web3.eth.sendTransaction({
        from: etherGanacheAddress,
        to: recieverGanacheAddress,
        value: transactionAmount
    })
    fs.appendFileSync("./transaction.json", "\n" + JSON.stringify(transactionResult, null, 4))
    console.log(transactionResult);
}

async function transaction(metaMaskAccount1, pk1) {
    const metaMaskAccount2 = "0x3bB6a250083d389A7ADB0b9a9AA5C8A62daFae4c";
    const privateKey1 = Buffer.from(pk1, 'hex');
    const privateKey2 = Buffer.from("01fdcc9280c3441c0252755ad66cbd98acabdaa9312ac16c480349e019a2e71f", "hex");
    const web3 = new Web3(GanacheURL);
    const account1Balance = await web3.eth.getBalance(metaMaskAccount1);
    const account2Balance = await web3.eth.getBalance(metaMaskAccount2);
    console.log(account1Balance, account2Balance);
    const transaction = await web3.eth.getTransactionCount(metaMaskAccount1)
    console.log(transaction);
    // build transaction
    const transactionObject = {
        nonce: web3.utils.toHex(transaction),
        to: metaMaskAccount2,
        value: web3.utils.toHex(web3.utils.toWei("99", "ether")),
        gasLimit: web3.utils.toHex(21000),
        gasPrice: web3.utils.toHex(web3.utils.toWei("10", "Gwei")),
    }
    console.log(transactionObject);
    console.log(privateKey1.byteLength);
    // sign transaction
    const ethertransaxtion = new Tx.Transaction(transactionObject)
    ethertransaxtion.sign(privateKey1)
    const serializedTransaction = ethertransaxtion.serialize();
    const row = `0x${serializedTransaction.toString('hex')}`
    // broadcast transaction
    const transactionResult = await web3.eth.sendSignedTransaction(row);
    console.log(transactionResult);
    fs.appendFileSync("./result.json", "\n" + JSON.stringify({
        account1Balance,
        account2Balance,
        transaction,
        transactionObject,
        transactionResult,
        row,
    }, null, 4))
}
async function deployContract() {
    const metaMaskAccount1 = "0x3bB6a250083d389A7ADB0b9a9AA5C8A62daFae4c";
    const privateKey1 = Buffer.from("0969dcfc9785d4d52023f55acc4545cdef91ea4c13be4617e466b90a1567b146", 'hex');
    const web3 = new Web3(GanacheURL);
    const transaction = await web3.eth.getTransactionCount(metaMaskAccount1)
    // build transaction
    const transactionObject = {
        nonce: web3.utils.toHex(transaction),
        gasLimit: web3.utils.toHex(1000000),
        gasPrice: web3.utils.toHex(web3.utils.toWei("10", "Gwei")),
        data: dapptokenContractData
    }
    // sign transaction
    const ethertransaxtion = new Tx.Transaction(transactionObject)
    ethertransaxtion.sign(privateKey1)
    const serializedTransaction = ethertransaxtion.serialize();
    const row = `0x${serializedTransaction.toString('hex')}`
    // broadcast transaction
    const transactionResult = await web3.eth.sendSignedTransaction(row);
    fs.appendFileSync("./result.json", "\n" + JSON.stringify({
        transaction,
        transactionObject,
        transactionResult,
        row,
    }, null, 4))
}
async function getContract() {
    const contractAddress = "0x35e8748Dce7b14e09C1062bBFC9632faC8c8e0C5"
    const web3 = new Web3(GanacheURL);
    const dapptokenContract = new web3.eth.Contract(abiContract, contractAddress)
    console.log(await dapptokenContract.methods.name().call());
}
// transaction("0x70442799F5E549e586210C37387FF105CfBbdBb3", "f3735c8094498ab80122df0a0b3c54cd2125762ba446438ee9412542b8782971")

// deployContract()
getContract()