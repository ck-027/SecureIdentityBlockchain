import { network } from "hardhat";
import { getAddress } from "ethers";

async function main() {

  const { ethers } = await network.connect();


  const [admin] = await ethers.getSigners();


  console.log("Using admin account:", await admin.getAddress());


const contractAddress = getAddress(
    "0xC21b13CCD44A3782B0526D62A2d3d2639aEE2619"
);

  const CertificateVerification =
    await ethers.getContractAt(
      "CertificateVerification",
      contractAddress,
      admin
    );

    console.log(
  "Contract address:",
  CertificateVerification.target
);

  const certificateID =
    "PNG-BSC-CS-2026-001";


  const studentName =
    "Charlie Kisokau";


  const qualification =
    "Bachelor of Computer Science";


  const institution =
    "Papua New Guinea University of Technology";


  const certificateHash =
    "0x7fa91b92c8e4d72a91f3a";


  console.log("Issuing certificate...");


  const tx =
    await CertificateVerification.issueCertificate(
      certificateID,
      studentName,
      qualification,
      institution,
      certificateHash
    );


  await tx.wait();


  console.log("Certificate issued successfully!");


  const certificate =
    await CertificateVerification.verifyCertificate(
      certificateID
    );


  console.log("\nCertificate Details:");
  console.log("----------------------");

  console.log("Student:", certificate[0]);
  console.log("Qualification:", certificate[1]);
  console.log("Institution:", certificate[2]);
  console.log("Hash:", certificate[3]);
  console.log("Verified:", certificate[4]);

}


main()
.catch((error) => {

  console.error(error);

  process.exitCode = 1;

});