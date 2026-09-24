// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract CertificateVerification {

    /*
     * Address of the university/institution administrator.
     */
    address public universityAdmin;


    /*
     * Certificate information stored on the blockchain.
     */
    struct Certificate {

        string certificateID;

        string studentName;

        string qualification;

        string institution;

        string certificateHash;

        /*
         * Official academic issue/graduation date.
         *
         * Stored as a Unix timestamp in seconds.
         */
        uint256 issueDate;

        /*
         * Date/time when the certificate was
         * recorded on the blockchain.
         */
        uint256 blockchainTimestamp;

        /*
         * Certificate validity status.
         *
         * true  = valid
         * false = revoked
         */
        bool verified;

        /*
         * Hash of the student's login password.
         *
         * The actual password is NEVER stored
         * on the blockchain.
         */
        bytes32 passwordHash;
    }


    /*
     * Certificate ID => Certificate information.
     */
    mapping(string => Certificate) private certificates;


    /*
     * List of all certificate IDs.
     */
    string[] private certificateIDs;


    /*
     * Set the account deploying the contract
     * as the university administrator.
     */
    constructor() {

        universityAdmin = msg.sender;

    }


    /*
     * Only the university administrator can
     * issue or revoke certificates.
     */
    modifier onlyAdmin() {

        require(
            msg.sender == universityAdmin,
            "Only university admin can perform this action"
        );

        _;

    }


    /*
     * ISSUE CERTIFICATE
     *
     * Creates a new certificate on the blockchain.
     *
     * The password is supplied as a hash.
     */
    function issueCertificate(

    string memory _certificateID,

    string memory _studentName,

    string memory _qualification,

    string memory _institution,

    string memory _certificateHash,

    uint256 _issueDate,

    bytes32 _passwordHash
)
    public
    onlyAdmin
{

        /*
         * Certificate ID must not be empty.
         */
        require(
            bytes(_certificateID).length > 0,
            "Certificate ID required"
        );


        /*
         * Student name must not be empty.
         */
        require(
            bytes(_studentName).length > 0,
            "Student name required"
        );


        /*
         * Qualification must not be empty.
         */
        require(
            bytes(_qualification).length > 0,
            "Qualification required"
        );


        /*
         * Institution must not be empty.
         */
        require(
            bytes(_institution).length > 0,
            "Institution required"
        );


        /*
         * Official issue date must be provided.
         */
        require(
            _issueDate > 0,
            "Issue date required"
        );


        /*
         * Password hash must be provided.
         */
        require(
            _passwordHash != bytes32(0),
            "Password hash required"
        );


        /*
         * Prevent accidentally overwriting
         * an existing certificate.
         */
        require(
            certificates[_certificateID].issueDate == 0,
            "Certificate already exists"
        );


        /*
         * Create the certificate.
         *
         * block.timestamp records the actual
         * blockchain transaction time.
         */
        certificates[_certificateID] = Certificate(

            _certificateID,

            _studentName,

            _qualification,

            _institution,

            _certificateHash,

            _issueDate,

            block.timestamp,

            true,

            _passwordHash

        );


        /*
         * Add the certificate ID to the list.
         */
        certificateIDs.push(
            _certificateID
        );

    }


    /*
     * VERIFY CERTIFICATE
     *
     * Returns the public certificate information.
     *
     * IMPORTANT:
     * The password hash is NOT returned here.
     */
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

            uint256,

            uint256,

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

            cert.issueDate,

            cert.blockchainTimestamp,

            cert.verified

        );

    }


    /*
     * VERIFY STUDENT PASSWORD
     *
     * The frontend hashes the password entered
     * by the student and sends only the hash here.
     *
     * The blockchain compares it with the stored
     * password hash.
     *
     * Returns:
     *
     * true  = password is correct
     * false = password is incorrect
     */
    function verifyStudentPassword(

        string memory _certificateID,

        bytes32 _passwordHash

    )
        public
        view
        returns (bool)
    {

        /*
         * Make sure the certificate exists.
         */
        require(
            certificates[_certificateID].issueDate > 0,
            "Certificate not found"
        );


        /*
         * Compare the supplied password hash
         * with the stored password hash.
         */
        return (
            certificates[_certificateID].passwordHash
            ==
            _passwordHash
        );

    }


    /*
     * REVOKE CERTIFICATE
     *
     * Only the university administrator can
     * revoke a certificate.
     */
    function revokeCertificate(

        string memory _certificateID

    )
        public
        onlyAdmin
    {

        /*
         * Make sure the certificate exists.
         */
        require(
            certificates[_certificateID].issueDate > 0,
            "Certificate not found"
        );


        /*
         * Prevent unnecessary revocation.
         */
        require(
            certificates[_certificateID].verified,
            "Certificate already revoked"
        );


        certificates[_certificateID].verified =
            false;

    }


    /*
     * GET ALL CERTIFICATE IDs
     */
    function getAllCertificateIDs()

        public
        view
        returns (string[] memory)

    {

        return certificateIDs;

    }

}