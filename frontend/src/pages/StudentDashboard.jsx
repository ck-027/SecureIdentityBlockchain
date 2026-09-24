import "../assets/student-dashboard.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import CertificateABI from "../contracts/CertificateVerificationABI.json";


function StudentDashboard() {

    const navigate =
        useNavigate();


    const [certificateID, setCertificateID] =
        useState("");

    const [certificate, setCertificate] =
        useState(null);

    const [loading, setLoading] =
        useState(true);


    const contractAddress =
        "0x9219c0Bb6Fe04DCD570443AD13d49DEB3DA2681b";


    /*
     * Format blockchain timestamp
     * as DD/MM/YYYY.
     */

    function formatDate(timestamp) {

        if (!timestamp) {

            return "N/A";

        }


        const date =
            new Date(
                Number(timestamp) * 1000
            );


        const day =
            String(
                date.getDate()
            ).padStart(2, "0");


        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");


        const year =
            date.getFullYear();


        return `${day}/${month}/${year}`;

    }


    /*
     * Load certificate from blockchain.
     */

    async function loadCertificate(id) {

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
                    id
                );


            setCertificate({

                studentName:
                    data[0],

                qualification:
                    data[1],

                institution:
                    data[2],

                certificateHash:
                    data[3],

                issueDate:
                    data[4],

                blockchainTimestamp:
                    data[5],

                verified:
                    data[6]

            });

        }

        catch (error) {

            console.error(
                "Certificate loading error:",
                error
            );

            setCertificate(null);

        }

        finally {

            setLoading(false);

        }

    }


    /*
     * Check login session.
     */

    useEffect(() => {

        const loggedIn =
            sessionStorage.getItem(
                "studentLoggedIn"
            );


        const storedCertificateID =
            sessionStorage.getItem(
                "studentCertificateID"
            );


        if (
            loggedIn !== "true" ||
            !storedCertificateID
        ) {

            sessionStorage.removeItem(
                "studentLoggedIn"
            );

            sessionStorage.removeItem(
                "studentCertificateID"
            );


            navigate(
                "/student-login",
                {
                    replace: true
                }
            );


            return;

        }


        setCertificateID(
            storedCertificateID
        );


        loadCertificate(
            storedCertificateID
        );

    }, [navigate]);


    /*
     * Open certificate page.
     */

    function openCertificate() {

        navigate(
            `/certificate/${certificateID}`
        );

    }


    /*
     * Logout.
     */

    function logout() {

        sessionStorage.removeItem(
            "studentLoggedIn"
        );


        sessionStorage.removeItem(
            "studentCertificateID"
        );


        setCertificate(null);


        navigate(
            "/student-login",
            {
                replace: true
            }
        );

    }


    /*
     * Loading screen.
     */

    if (loading) {

        return (

            <div className="dashboard-loading">

                <div className="loading-spinner"></div>

                <h2>
                    Loading your certificate
                </h2>

                <p>
                    Connecting to the blockchain...
                </p>

            </div>

        );

    }


    /*
     * Certificate could not be loaded.
     */

    if (!certificate) {

        return (

            <div className="dashboard-error-page">

                <div className="dashboard-error-card">

                    <div className="error-card-icon">
                        !
                    </div>


                    <h2>
                        Certificate could not be loaded
                    </h2>


                    <p>
                        We were unable to retrieve
                        certificate information from
                        the blockchain.
                    </p>


                    <div className="error-certificate-id">

                        <span>
                            Certificate ID
                        </span>

                        <strong>
                            {certificateID}
                        </strong>

                    </div>


                    <p className="error-help">

                        Please make sure the certificate
                        exists on the current blockchain
                        network.

                    </p>


                    <button
                        className="primary-button"
                        onClick={logout}
                    >
                        Return to Login
                    </button>

                </div>

            </div>

        );

    }


    return (

        <div className="student-dashboard">


            {/* =========================================
                HEADER
            ========================================= */}

            <header className="dashboard-header">

                <div className="dashboard-header-inner">


                    <div className="dashboard-brand">

                        <div className="dashboard-logo">
                            ✓
                        </div>

                        <div>

                            <div className="dashboard-platform">
                                verify.edu.pg
                            </div>

                            <div className="dashboard-tagline">
                                Academic Certificate Verification
                            </div>

                        </div>

                    </div>


                    <div className="dashboard-header-right">

                        <div className="student-account">

                            <span>
                                STUDENT
                            </span>

                            <strong>
                                {certificate.studentName}
                            </strong>

                        </div>


                        <button
                            className="logout-button"
                            onClick={logout}
                        >
                            Logout
                        </button>

                    </div>


                </div>

            </header>


            {/* =========================================
                MAIN
            ========================================= */}

            <main className="dashboard-main">


                <div className="dashboard-container">


                    {/* WELCOME */}

                    <section className="welcome-banner">

                        <div>

                            <span className="dashboard-eyebrow">
                                STUDENT PORTAL
                            </span>


                            <h1>
                                Welcome,
                                {" "}
                                {certificate.studentName}
                            </h1>


                            <p>
                                Here is your official
                                blockchain-verified academic
                                certificate information.
                            </p>

                        </div>


                        <div className="welcome-status">

                            <div className="status-check">
                                ✓
                            </div>

                            <div>

                                <span>
                                    CERTIFICATE STATUS
                                </span>

                                <strong>
                                    {
                                        certificate.verified
                                            ? "Verified"
                                            : "Revoked"
                                    }
                                </strong>

                            </div>

                        </div>

                    </section>


                    {/* QUICK INFORMATION */}

                    <section className="dashboard-stats">


                        <div className="stat-card">

                            <div className="stat-icon">
                                🎓
                            </div>

                            <div>

                                <span>
                                    Qualification
                                </span>

                                <strong>
                                    {certificate.qualification}
                                </strong>

                            </div>

                        </div>


                        <div className="stat-card">

                            <div className="stat-icon">
                                🏛
                            </div>

                            <div>

                                <span>
                                    Institution
                                </span>

                                <strong>
                                    {certificate.institution}
                                </strong>

                            </div>

                        </div>


                        <div className="stat-card">

                            <div className="stat-icon">
                                ✓
                            </div>

                            <div>

                                <span>
                                    Verification
                                </span>

                                <strong
                                    className={
                                        certificate.verified
                                            ? "text-valid"
                                            : "text-revoked"
                                    }
                                >
                                    {
                                        certificate.verified
                                            ? "Blockchain Verified"
                                            : "Certificate Revoked"
                                    }
                                </strong>

                            </div>

                        </div>


                    </section>


                    {/* CERTIFICATE INFORMATION */}

                    <section className="certificate-section">


                        <div className="section-heading">

                            <div>

                                <span>
                                    OFFICIAL RECORD
                                </span>

                                <h2>
                                    Certificate Information
                                </h2>

                            </div>


                            <div
                                className={
                                    certificate.verified
                                        ? "large-status valid"
                                        : "large-status revoked"
                                }
                            >

                                <span className="status-dot"></span>

                                {
                                    certificate.verified
                                        ? "Blockchain Verified"
                                        : "Certificate Revoked"
                                }

                            </div>

                        </div>


                        <div className="certificate-details-grid">


                            <div className="detail-card">

                                <span className="detail-label">
                                    Certificate ID
                                </span>

                                <strong className="detail-value certificate-id-value">
                                    {certificateID}
                                </strong>

                            </div>


                            <div className="detail-card">

                                <span className="detail-label">
                                    Student Name
                                </span>

                                <strong className="detail-value">
                                    {certificate.studentName}
                                </strong>

                            </div>


                            <div className="detail-card">

                                <span className="detail-label">
                                    Qualification
                                </span>

                                <strong className="detail-value">
                                    {certificate.qualification}
                                </strong>

                            </div>


                            <div className="detail-card">

                                <span className="detail-label">
                                    Institution
                                </span>

                                <strong className="detail-value">
                                    {certificate.institution}
                                </strong>

                            </div>


                            <div className="detail-card">

                                <span className="detail-label">
                                    Official Issue / Graduation Date
                                </span>

                                <strong className="detail-value">
                                    {formatDate(
                                        certificate.issueDate
                                    )}
                                </strong>

                            </div>


                            <div className="detail-card">

                                <span className="detail-label">
                                    Blockchain Recorded
                                </span>

                                <strong className="detail-value">
                                    {formatDate(
                                        certificate.blockchainTimestamp
                                    )}
                                </strong>

                            </div>


                        </div>


                        {/* HASH */}

                        <div className="hash-section">

                            <div className="hash-heading">

                                <span>
                                    🔐
                                </span>

                                <div>

                                    <strong>
                                        Certificate Hash
                                    </strong>

                                    <p>
                                        Unique blockchain identifier
                                        for this academic record.
                                    </p>

                                </div>

                            </div>


                            <div className="hash-value">

                                {certificate.certificateHash}

                            </div>

                        </div>


                    </section>


                    {/* ACTIONS */}

                    <section className="dashboard-actions-section">


                        <div>

                            <h3>
                                Certificate Access
                            </h3>

                            <p>
                                View your official certificate
                                or return to the login page.
                            </p>

                        </div>


                        <div className="dashboard-actions">


                            {
                                certificate.verified && (

                                    <button
                                        className="primary-button"
                                        onClick={
                                            openCertificate
                                        }
                                    >

                                        <span>
                                            ▣
                                        </span>

                                        View Certificate

                                        <span>
                                            →
                                        </span>

                                    </button>

                                )
                            }


                            <button
                                className="secondary-button"
                                onClick={logout}
                            >
                                Logout
                            </button>


                        </div>


                    </section>


                    {/* REVOCATION MESSAGE */}

                    {
                        !certificate.verified && (

                            <div className="revoked-notice">

                                <div className="revoked-icon">
                                    !
                                </div>

                                <div>

                                    <strong>
                                        Certificate Revoked
                                    </strong>

                                    <p>
                                        This certificate has been
                                        revoked by the issuing institution
                                        and is no longer considered valid.
                                    </p>

                                </div>

                            </div>

                        )
                    }


                </div>

            </main>


            {/* =========================================
                FOOTER
            ========================================= */}

            <footer className="dashboard-footer">

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


export default StudentDashboard;