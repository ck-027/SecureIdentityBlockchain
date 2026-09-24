import React, { useState } from "react";
import { ethers } from "ethers";
import StudentRegistration from "../components/StudentRegistration";
import StudentTable from "../components/StudentTable";
import CertificateForm from "../components/CertificateForm";
import ABI from "../contracts/CertificateVerificationABI.json";
import { certificateContractAddress } from "../contracts/contractAddress";


function AdminDashboard() {


    const [account, setAccount] = useState("");

    const [certificate, setCertificate] = useState({

        certificateID: "",
        studentName: "",
        qualification: "",
        institution: "",
        certificateHash: ""

    });


    async function connectWallet() {

        if(window.ethereum){

            const accounts =
                await window.ethereum.request({
                    method:"eth_requestAccounts"
                });


            setAccount(accounts[0]);

        }

    }

    function registerStudent(student) {

  setStudents([...students, student]);

}const [students, setStudents] = useState([]);

    function handleChange(e){

        setCertificate({

            ...certificate,

            [e.target.name]: e.target.value

        });

    }



    async function issueCertificate(){


        const provider =
            new ethers.BrowserProvider(window.ethereum);


        const signer =
            await provider.getSigner();


        const contract =
            new ethers.Contract(

                certificateContractAddress,

                ABI,

                signer

            );


        const transaction =
            await contract.issueCertificate(

                certificate.certificateID,

                certificate.studentName,

                certificate.qualification,

                certificate.institution,

                certificate.certificateHash

            );


        await transaction.wait();


        alert("Certificate Issued Successfully!");

    }



return (

<div>

<h1>
University Admin Dashboard
</h1>


<button onClick={connectWallet}>
Connect MetaMask
</button>

<StudentRegistration
  onRegister={registerStudent}
/>

<StudentTable
  students={students}
/>

<CertificateForm />

<p>
Admin Account:
{account}
</p>



<h2>
Issue New Certificate
</h2>


<input
name="certificateID"
placeholder="Certificate ID"
onChange={handleChange}
/>


<input
name="studentName"
placeholder="Student Name"
onChange={handleChange}
/>


<input
name="qualification"
placeholder="Qualification"
onChange={handleChange}
/>


<input
name="institution"
placeholder="Institution"
onChange={handleChange}
/>


<input
name="certificateHash"
placeholder="Certificate Hash"
onChange={handleChange}
/>


<button onClick={issueCertificate}>
Issue Certificate
</button>


</div>

);

}


export default AdminDashboard;