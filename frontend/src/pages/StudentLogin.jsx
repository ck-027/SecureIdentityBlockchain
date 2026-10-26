import "../assets/student-login.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import CertificateABI from "../contracts/CertificateVerificationABI.json";


function StudentLogin() {

    const navigate = useNavigate();


    const [certificateID, setCertificateID] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [showPassword, setShowPassword] =
        useState(false);


    const contractAddress =
        "0x9219c0Bb6Fe04DCD570443AD13d49DEB3DA2681b";


    async function login() {

        setError("");

        const cleanCertificateID =
            certificateID.trim();

        const cleanPassword =
            password.trim();


        if (
            !cleanCertificateID ||
            !cleanPassword
        ) {

            setError(
                "Please enter your Certificate ID and password."
            );

            return;

        }


        try {

            setLoading(true);


            /*
             * Connect to MetaMask / blockchain.
             */

            if (!window.ethereum) {

                setError(
                    "MetaMask is required to log in."
                );

                return;

            }


            const provider =
                new ethers.BrowserProvider(
                    window.ethereum
                );


            /*
             * Read-only contract connection.
             */

            const contract =
                new ethers.Contract(
                    contractAddress,
                    CertificateABI,
                    provider
                );


            /*
             * Check whether the certificate exists.
             */

            const certificate =
                await contract.verifyCertificate(
                    cleanCertificateID
                );


            if (!certificate[0]) {

                setError(
                    "Certificate ID not found."
                );

                return;

            }


            /*
             * Check whether the certificate
             * has been revoked.
             */

            if (!certificate[6]) {

                setError(
                    "This certificate has been revoked and cannot be used to log in."
                );

                return;

            }


            /*
             * Hash the student's password.
             */

            const passwordHash =
                ethers.keccak256(
                    ethers.toUtf8Bytes(
                        cleanPassword
                    )
                );


            /*
             * Verify password against
             * the blockchain.
             */

            const passwordCorrect =
                await contract.verifyStudentPassword(
                    cleanCertificateID,
                    passwordHash
                );


            if (!passwordCorrect) {

                setError(
                    "Incorrect password."
                );

                return;

            }


            /*
             * Login successful.
             */

            sessionStorage.setItem(
                "studentCertificateID",
                cleanCertificateID
            );

            sessionStorage.setItem(
                "studentLoggedIn",
                "true"
            );


            navigate("/student");

        }

        catch (error) {

            console.error(
                "Student login error:",
                error
            );


            setError(
                error?.reason ||
                error?.shortMessage ||
                error?.message ||
                "Unable to verify your credentials."
            );

        }

        finally {

            setLoading(false);

        }

    }


    function handleSubmit(event) {

        event.preventDefault();

        login();

    }


    return (

        <div className="student-login-page">


            {/* =========================================
                HEADER
            ========================================= */}

            
<header className="student-login-header">
    <div className="student-login-header-inner">

        <div
            className="student-login-brand"
            onClick={() => navigate("/")}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    navigate("/");
                }
            }}
            style={{ cursor: "pointer" }}
        >
            <div className="student-login-logo">
                ✓
            </div>

            <div>
                <div className="student-login-platform">
                    verify.edu.pg
                </div>

                <div className="student-login-tagline">
                    Academic Certificate Verification
                </div>
            </div>
        </div>

        <button
            type="button"
            className="student-home-button"
            onClick={() => navigate("/")}
        >
            <span aria-hidden="true">←</span>
            Home
        </button>

    </div>
</header>



            {/* =========================================
                MAIN CONTENT
            ========================================= */}

            <main className="student-login-main">


                <div className="student-login-layout">


                    {/* LEFT SIDE */}
                    <section className="student-login-intro">

                        <div className="login-eyebrow">
                            STUDENT PORTAL
                        </div>


                        <h1>
                            Your academic
                            <span>
                                credentials,
                            </span>
                            securely verified.
                        </h1>


                        <p>
                            Access your official academic
                            certificate through the
                            verify.edu.pg blockchain
                            verification platform.
                        </p>


                        <div className="login-benefits">


                            <div className="login-benefit">

                                <div className="benefit-icon">
                                    ✓
                                </div>

                                <div>

                                    <strong>
                                        Blockchain Verified
                                    </strong>

                                    <span>
                                        Your certificate information
                                        is verified directly against
                                        the blockchain.
                                    </span>

                                </div>

                            </div>


                            <div className="login-benefit">

                                <div className="benefit-icon">
                                    🔒
                                </div>

                                <div>

                                    <strong>
                                        Secure Access
                                    </strong>

                                    <span>
                                        Your Certificate ID and
                                        password protect access
                                        to your student portal.
                                    </span>

                                </div>

                            </div>


                            <div className="login-benefit">

                                <div className="benefit-icon">
                                    ◇
                                </div>

                                <div>

                                    <strong>
                                        Multiple Institutions
                                    </strong>

                                    <span>
                                        verify.edu.pg provides a
                                        common verification framework
                                        for participating institutions.
                                    </span>

                                </div>

                            </div>


                        </div>

                    </section>


                    {/* LOGIN CARD */}
                    <section className="student-login-card">


                        <div className="login-card-icon">
                            🎓
                        </div>


                        <div className="login-card-heading">

                            <h2>
                                Student Login
                            </h2>

                            <p>
                                Enter your certificate credentials
                                to continue.
                            </p>

                        </div>


                        <form
                            className="student-login-form"
                            onSubmit={handleSubmit}
                        >


                            {/* CERTIFICATE ID */}

                            <div className="login-form-group">

                                <label htmlFor="certificateID">
                                    Certificate ID
                                </label>

                                <div className="input-wrapper">

                                    <span className="input-icon">
                                        #
                                    </span>

                                    <input
                                        id="certificateID"
                                        type="text"
                                        value={certificateID}
                                        onChange={(e) =>
                                            setCertificateID(
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g. CERT-123456"
                                        autoComplete="username"
                                        disabled={loading}
                                    />

                                </div>

                            </div>


                            {/* PASSWORD */}

                            <div className="login-form-group">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="input-wrapper">

                                    <span className="input-icon">
                                        •
                                    </span>

                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        disabled={loading}
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        disabled={loading}
                                    >
                                        {
                                            showPassword
                                                ? "Hide"
                                                : "Show"
                                        }
                                    </button>

                                </div>

                            </div>


                            {/* ERROR */}

                            {error && (

                                <div className="login-error">

                                    <div className="login-error-icon">
                                        !
                                    </div>

                                    <div>
                                        {error}
                                    </div>

                                </div>

                            )}


                            {/* LOGIN BUTTON */}

                            <button
                                type="submit"
                                className="login-button"
                                disabled={loading}
                            >

                                {loading ? (

                                    <>
                                        <span className="login-spinner"></span>
                                        Verifying credentials...
                                    </>

                                ) : (

                                    <>
                                        Access Student Portal
                                        <span className="button-arrow">
                                            →
                                        </span>
                                    </>

                                )}

                            </button>


                        </form>


                        <div className="login-security-note">

                            <span>
                                🔐
                            </span>

                            <p>
                                Your credentials are verified
                                securely against the blockchain.
                            </p>

                        </div>


                    </section>


                </div>

            </main>


            {/* =========================================
                FOOTER
            ========================================= */}

            <footer className="student-login-footer">

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


export default StudentLogin;