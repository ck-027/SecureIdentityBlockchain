// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract CertificateVerification {

    address public universityAdmin;


    struct Certificate {

        string certificateID;

        string studentName;

        string qualification;

        string institution;

        string certificateHash;

        uint256 issueDate;

        bool verified;

    }


    mapping(string => Certificate) private certificates;


    constructor() {

        universityAdmin = msg.sender;

    }


    modifier onlyAdmin() {

        require(
            msg.sender == universityAdmin,
            "Only university admin can perform this action"
        );

        _;

    }


    function issueCertificate(

        string memory _certificateID,

        string memory _studentName,

        string memory _qualification,

        string memory _institution,

        string memory _certificateHash

    )
        public
        onlyAdmin

    {


        certificates[_certificateID] = Certificate(

            _certificateID,

            _studentName,

            _qualification,

            _institution,

            _certificateHash,

            block.timestamp,

            true

        );

    }



    function verifyCertificate(

        string memory _certificateID

    )

        public

        view

        returns (

            string memory,

            string memory,

            string memory,

            string memory,

            bool

        )

    {

        Certificate memory cert =
            certificates[_certificateID];


        return (

            cert.studentName,

            cert.qualification,

            cert.institution,

            cert.certificateHash,

            cert.verified

        );

    }



    function revokeCertificate(

        string memory _certificateID

    )

        public

        onlyAdmin

    {

        certificates[_certificateID].verified = false;

    }


}