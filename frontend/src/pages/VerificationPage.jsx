import "../assets/verification-page.css";

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import CertificateABI from "../contracts/CertificateVerificationABI.json";


function VerificationPage() {

    const { certificateID } = useParams();
    const navigate = useNavigate();

    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);


    const contractAddress =
        "0x9219c0Bb6Fe04DCD570443AD13d49DEB3DA2681b";


    function formatDate(timestamp) {

        if (!timestamp || Number(timestamp) === 0) {
            return "N/A";
        }

        const date =
            new Date(Number(timestamp) * 1000);

        const day =
            String(date.getDate()).padStart(2, "0");

        const month =
            String(date.getMonth() + 1).padStart(2, "0");

        const year =
            date.getFullYear();

        return `${day}/${month}/${year}`;
    }


    async function loadCertificate() {

        try {

            if (!window.ethereum) {
                throw new Error(
                    "MetaMask is not installed."
                );
            }


            const provider =
                new ethers.BrowserProvider(
                    window.ethereum
                );


            const contract =
                new ethers.Contract(
                    contractAddress,
                    CertificateABI,
                    provider
                );


            const data =
                await contract.verifyCertificate(
                    certificateID
                );


            const studentName = data[0];
            const qualification = data[1];
            const institution = data[2];


            /*
             * A certificate that does not exist returns
             * empty certificate information.
             */

            if (
                studentName === "" &&
                qualification === "" &&
                institution === ""
            ) {

                setNotFound(true);
                return;

            }


            setCertificate({

                studentName: data[0],

                qualification: data[1],

                institution: data[2],

                certificateHash: data[3],

                issueDate: data[4],

                blockchainTimestamp: data[5],

                verified: data[6]

            });

        }

        catch (error) {

            console.error(
                "Certificate verification error:",
                error
            );

            setNotFound(true);

        }

        finally {

            setLoading(false);

        }

    }


    useEffect(() => {

        loadCertificate();

    }, [certificateID]);


    /* =====================================================
       LOADING
       ===================================================== */

    if (loading) {

        return (

            <div className="verification-loading-page">

                <div className="verification-loading-card">

                    <div className="verification-loading-logo">
                        ✓
                    </div>

                    <div className="verification-spinner"></div>

                    <h2>
                        Verifying Certificate
                    </h2>

                    <p>
                        Checking the certificate record
                        against the blockchain...
                    </p>

                    <div className="loading-certificate-id">
                        {certificateID}
                    </div>

                </div>

            </div>

        );

    }


    /* =====================================================
       NOT FOUND
       ===================================================== */

    if (notFound) {

        return (

            <div className="verification-page">

                <header className="verification-header">

                    <div className="verification-header-inner">

                        <button
                            className="verification-brand"
                            onClick={() => navigate("/")}
                        >

                            <div className="verification-brand-logo">
                                ✓
                            </div>

                            <div>

                                <div className="verification-brand-name">
                                    verify.edu.pg
                                </div>

                                <div className="verification-brand-subtitle">
                                    Academic Certificate Verification
                                </div>

                            </div>

                        </button>


                        <div className="verification-header-status">

                            <span></span>

                            Public Verification

                        </div>

                    </div>

                </header>


                <main className="verification-main">

                    <div className="verification-result-card not-found-card">

                        <div className="result-icon not-found-icon">
                            ?
                        </div>

                        <div className="result-label not-found-label">
                            VERIFICATION RESULT
                        </div>

                        <h1>
                            Certificate Not Found
                        </h1>

                        <p className="result-description">
                            We could not find a certificate matching
                            the ID provided on the blockchain.
                        </p>


                        <div className="searched-certificate">

                            <span>
                                CERTIFICATE ID
                            </span>

                            <strong>
                                {certificateID}
                            </strong>

                        </div>


                        <div className="verification-info-box">

                            <div className="info-box-icon">
                                i
                            </div>

                            <p>
                                Please check that the Certificate ID
                                was entered correctly. If you received
                                this certificate from an institution,
                                contact the issuing institution for
                                assistance.
                            </p>

                        </div>


                        <div className="result-actions">

                            <button
                                className="secondary-result-button"
                                onClick={() => navigate("/")}
                            >
                                ← Back to verify.edu.pg
                            </button>

                        </div>

                    </div>

                </main>


                <footer className="verification-footer">

                    <span>
                        © {new Date().getFullYear()} verify.edu.pg
                    </span>

                    <span>
                        Blockchain-Based Academic Certificate Verification
                    </span>

                </footer>

            </div>

        );

    }


    /* =====================================================
       FOUND CERTIFICATE
       ===================================================== */

    return (

        <div className="verification-page">

            {/* HEADER */}

            <header className="verification-header">

                <div className="verification-header-inner">

                    <button
                        className="verification-brand"
                        onClick={() => navigate("/")}
                    >

                        <div className="verification-brand-logo">
                            ✓
                        </div>

                        <div>

                            <div className="verification-brand-name">
                                verify.edu.pg
                            </div>

                            <div className="verification-brand-subtitle">
                                Academic Certificate Verification
                            </div>

                        </div>

                    </button>


                    <div className="verification-header-status">

                        <span></span>

                        Public Verification

                    </div>

                </div>

            </header>


            {/* MAIN */}

            <main className="verification-main">

                <div className="verification-container">

                    {/* PAGE TITLE */}

                    <div className="verification-page-heading">

                        <div className="verification-eyebrow">
                            PUBLIC CERTIFICATE VERIFICATION
                        </div>

                        <h1>
                            Certificate Verification
                        </h1>

                        <p>
                            Verify the authenticity of an academic
                            certificate using its blockchain record.
                        </p>

                    </div>


                    {/* RESULT CARD */}

                    <section
                        className={
                            certificate.verified
                                ? "verification-result-card verified-card"
                                : "verification-result-card revoked-card"
                        }
                    >

                        {/* RESULT HEADER */}

                        <div className="verification-result-header">

                            <div
                                className={
                                    certificate.verified
                                        ? "result-icon verified-icon"
                                        : "result-icon revoked-icon"
                                }
                            >

                                {certificate.verified
                                    ? "✓"
                                    : "!"}

                            </div>


                            <div className="result-heading">

                                <span
                                    className={
                                        certificate.verified
                                            ? "result-label verified-label"
                                            : "result-label revoked-label"
                                    }
                                >
                                    VERIFICATION RESULT
                                </span>

                                <h2>

                                    {certificate.verified
                                        ? "Certificate Verified"
                                        : "Certificate Revoked"}

                                </h2>

                                <p>

                                    {certificate.verified

                                        ? "This certificate has been successfully verified against the blockchain record."

                                        : "This certificate exists on the blockchain but has been revoked by the issuing institution."

                                    }

                                </p>

                            </div>


                            <div
                                className={
                                    certificate.verified
                                        ? "verification-status-badge verified-badge"
                                        : "verification-status-badge revoked-badge"
                                }
                            >

                                <span></span>

                                {certificate.verified
                                    ? "VALID"
                                    : "REVOKED"}

                            </div>

                        </div>


                        {/* CERTIFICATE ID */}

                        <div className="certificate-id-banner">

                            <div>

                                <span>
                                    CERTIFICATE ID
                                </span>

                                <strong>
                                    {certificateID}
                                </strong>

                            </div>

                            <div className="certificate-id-check">
                                ✓
                            </div>

                        </div>


                        {/* DETAILS */}

                        <div className="verification-details">

                            <div className="verification-section-title">

                                <span>
                                    OFFICIAL RECORD
                                </span>

                                <h3>
                                    Certificate Information
                                </h3>

                            </div>


                            <div className="verification-details-grid">

                                <div className="verification-detail">

                                    <span>
                                        STUDENT NAME
                                    </span>

                                    <strong>
                                        {certificate.studentName}
                                    </strong>

                                </div>


                                <div className="verification-detail">

                                    <span>
                                        QUALIFICATION
                                    </span>

                                    <strong>
                                        {certificate.qualification}
                                    </strong>

                                </div>


                                <div className="verification-detail">

                                    <span>
                                        ISSUING INSTITUTION
                                    </span>

                                    <strong>
                                        {certificate.institution}
                                    </strong>

                                </div>


                                <div className="verification-detail">

                                    <span>
                                        OFFICIAL ISSUE / GRADUATION DATE
                                    </span>

                                    <strong>
                                        {formatDate(
                                            certificate.issueDate
                                        )}
                                    </strong>

                                </div>


                                <div className="verification-detail">

                                    <span>
                                        BLOCKCHAIN RECORDED
                                    </span>

                                    <strong>
                                        {formatDate(
                                            certificate.blockchainTimestamp
                                        )}
                                    </strong>

                                </div>


                                <div className="verification-detail">

                                    <span>
                                        BLOCKCHAIN STATUS
                                    </span>

                                    <strong
                                        className={
                                            certificate.verified
                                                ? "valid-text"
                                                : "revoked-text"
                                        }
                                    >

                                        {certificate.verified
                                            ? "✓ Valid"
                                            : "✕ Revoked"}

                                    </strong>

                                </div>

                            </div>


                            {/* HASH */}

                            <div className="verification-hash">

                                <div className="hash-top">

                                    <div className="hash-icon">
                                        #
                                    </div>

                                    <div>

                                        <strong>
                                            Certificate Hash
                                        </strong>

                                        <span>
                                            Unique identifier recorded
                                            on the blockchain.
                                        </span>

                                    </div>

                                </div>


                                <div className="hash-code">
                                    {certificate.certificateHash}
                                </div>

                            </div>

                        </div>


                        {/* VERIFIED NOTICE */}

                        {certificate.verified && (

                            <div className="verified-notice">

                                <div className="verified-notice-icon">
                                    ✓
                                </div>

                                <div>

                                    <strong>
                                        Blockchain verification successful
                                    </strong>

                                    <p>
                                        The certificate information above
                                        corresponds to a record stored on
                                        the blockchain.
                                    </p>

                                </div>

                            </div>

                        )}


                        {/* REVOKED NOTICE */}

                        {!certificate.verified && (

                            <div className="revoked-notice">

                                <div className="revoked-notice-icon">
                                    !
                                </div>

                                <div>

                                    <strong>
                                        Certificate revoked
                                    </strong>

                                    <p>
                                        This certificate has been revoked
                                        by the issuing institution and
                                        should not be considered valid.
                                    </p>

                                </div>

                            </div>

                        )}


                        {/* ACTIONS */}

                        <div className="verification-actions">

                            {certificate.verified && (

                                <Link
                                    to={`/certificate/${certificateID}`}
                                    className="view-certificate-button"
                                >

                                    <span>
                                        ▣
                                    </span>

                                    View Full Certificate

                                    <span>
                                        →
                                    </span>

                                </Link>

                            )}


                            <button
                                className="verify-another-button"
                                onClick={() => navigate("/")}
                            >

                                Verify Another Certificate

                            </button>

                        </div>

                    </section>


                    {/* TRUST MESSAGE */}

                    <div className="verification-trust">

                        <div className="trust-icon">
                            ⛓
                        </div>

                        <div>

                            <strong>
                                Verified using blockchain technology
                            </strong>

                            <p>
                                verify.edu.pg provides a transparent
                                certificate verification framework that
                                allows academic credentials to be checked
                                against their recorded blockchain data.
                            </p>

                        </div>

                    </div>

                </div>

            </main>


            {/* FOOTER */}

            <footer className="verification-footer">

                <span>
                    © {new Date().getFullYear()} verify.edu.pg
                </span>

                <span>
                    Blockchain-Based Academic Certificate Verification
                </span>

            </footer>

        </div>

    );

}


export default VerificationPage;