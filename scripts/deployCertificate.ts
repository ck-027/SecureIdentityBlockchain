import { network } from "hardhat";

async function main() {

  const { ethers } = await network.connect();


  const CertificateVerification =
    await ethers.getContractFactory("CertificateVerification");


  const certificateVerification =
    await CertificateVerification.deploy();


  await certificateVerification.waitForDeployment();


  console.log(
    "CertificateVerification deployed to:",
    await certificateVerification.getAddress()
  );

}


main()
  .catch((error) => {

    console.error(error);

    process.exitCode = 1;

  });