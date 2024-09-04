import TronWeb from 'tronweb';
import dotenv from 'dotenv';
import tokenAbi from './tokenAbi.json' assert { type: 'json' };

dotenv.config();

const tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
    privateKey: process.env.PRIVATE_KEY
});

const tokenAddress = 'TAt4ufXFaHZAEV44ev7onThjTnF61SEaEM';
const spendAddress = 'TZFs5ch1R1C4mmjwrrmZqeqbUgGpxY1yWB';

async function interactWithToken() {
    try {
        const contract = await tronWeb.contract(tokenAbi, tokenAddress);
        console.log(contract);

        if (typeof contract.name === 'function') {
            const name = await contract.name().call();
            console.log(`Token name: ${name}`);
        } else {
            console.log("The 'name' function is not available on this contract.");
        }

        if (typeof contract.symbol === 'function') {
            const symbol = await contract.symbol().call();
            console.log(`Token symbol: ${symbol}`);
        } else {
            console.log("The 'symbol' function is not available on this contract.");
        }

        if (typeof contract.decimals === 'function') {
            const decimals = await contract.decimals().call();
            console.log(`Token decimals: ${decimals}`);
        } else {
            console.log("The 'decimals' function is not available on this contract.");
        }

        const myAddress = tronWeb.defaultAddress.base58;
        let allowance = await contract.allowance(myAddress, spendAddress).call();
        console.log(`Current Allowance: ${allowance / Math.pow(10, 18)}`);

        const amountToApprove = 12456 * Math.pow(10, 18);
        await contract.approve(spendAddress, amountToApprove).send();

        allowance = await contract.allowance(myAddress, spendAddress).call();
        console.log(`New Allowance: ${allowance / Math.pow(10, 18)}`);
    } catch (error) {
        console.error('Error interacting with the token:', error);
    }
}

interactWithToken();