import { defineConfig } from "hardhat/config";
import hardhatEthers from "@nomicfoundation/hardhat-ethers";

export default defineConfig({
    plugins: [
        hardhatEthers
    ],

    solidity: {
        version: "0.8.28",
        settings: {
            evmVersion: "paris"
        }
    },

    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts"
    },

    networks: {
        ganache: {
            type: "http",
            url: "http://127.0.0.1:7545"
        }
    }
});