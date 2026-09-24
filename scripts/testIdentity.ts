import { network } from "hardhat";

async function main() {

    const { ethers } = await network.connect();


    const contractAddress =
        "0x9942Dc79A2d96d62eb3915e52cc6cD5219a945B0";


    const IdentityVerification =
        await ethers.getContractAt(
            "IdentityVerification",
            contractAddress
        );


    const accounts =
        await ethers.getSigners();


    const user =
        accounts[0];


    console.log(
        "Using account:",
        await user.getAddress()
    );


    // Register identity
    const tx =
        await IdentityVerification
        .connect(user)
        .registerIdentity(
            "Charlie Kisokau",
            "Papua New Guinea University of Technology"
        );


    await tx.wait();


    console.log(
        "Identity registered!"
    );


    // Retrieve identity
    const identity =
        await IdentityVerification
        .getIdentity(
            await user.getAddress()
        );


    console.log(
        "Name:",
        identity[0]
    );

    console.log(
        "Institution:",
        identity[1]
    );

    console.log(
        "Verified:",
        identity[2]
    );

}


main().catch((error)=>{

    console.error(error);

    process.exitCode = 1;

});