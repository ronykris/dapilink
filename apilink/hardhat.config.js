"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomicfoundation/hardhat-toolbox");
require("@oasisprotocol/sapphire-hardhat");
const config = {
    solidity: "0.8.17",
    networks: {
        sapphire_testnet: {
            url: "https://testnet.sapphire.oasis.dev",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 0x5aff,
        },
    },
};
exports.default = config;
