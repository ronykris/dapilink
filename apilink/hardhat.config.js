"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomicfoundation/hardhat-toolbox");
require("@oasisprotocol/sapphire-hardhat");
const config = {
    solidity: "0.8.17",
    networks: {
        sapphire_dev: {
            url: "http://localhost:8545/",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 0x5afd,
          }
    }
}
exports.default = config;
