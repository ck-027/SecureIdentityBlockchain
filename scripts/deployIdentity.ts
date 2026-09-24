import { network } from "hardhat";

async function main() {

    const { ethers } = await network.connect();

    const IdentityVerification =
        await ethers.getContractFactory(
            "IdentityVerification"
        );


    const identity =
        await IdentityVerification.deploy();


    await identity.waitForDeployment();


    console.log(
        "IdentityVerification deployed to:",
        await identity.getAddress()
    );

}


main().catch((error) => {

    console.error(error);

    process.exitCode = 1;

});