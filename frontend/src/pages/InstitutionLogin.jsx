import "../assets/institution-login.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function InstitutionLogin() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [walletConnected, setWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState("");
    const [error, setError] = useState("");

    const institutionName = "PNG University of Technology";

    function shortenAddress(address) {
        if (!address) return "";
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    async function connectWallet() {
        setError("");

        try {
            if (!window.ethereum) {
                setError(
                    "MetaMask is required for institution authentication."
                );
                return;
            }

            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            if (!accounts || accounts.length === 0) {
                setError("No wallet account was selected.");
                return;
            }

            setWalletAddress(accounts[0]);
            setWalletConnected(true);
        } catch (err) {
            console.error("Wallet connection error:", err);

            if (err?.code === 4001) {
                setError("Wallet connection was cancelled.");
            } else {
                setError("Unable to connect to MetaMask.");
            }
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        if (!walletConnected || !walletAddress) {
            setError(
                "Please connect your authorized institution wallet first."
            );
            return;
        }

        /*
         * PHASE 10:
         * UI flow only.
         *
         * FUNCTIONALITY PHASE:
         *
         * 1. Connect to CertificateVerification contract.
         * 2. Read universityAdmin().
         * 3. Compare universityAdmin with walletAddress.
         * 4. Reject unauthorized wallets.
         * 5. Allow the authorized institution to continue.
         */

        try {
            setLoading(true);

            // Temporary UI-only authentication delay.
            await new Promise((resolve) => setTimeout(resolve, 700));

            sessionStorage.setItem(
                "institutionLoggedIn",
                "true"
            );

            sessionStorage.setItem(
                "institutionWallet",
                walletAddress
            );

            sessionStorage.setItem(
                "institutionName",
                institutionName
            );

            navigate("/institution");
        } catch (err) {
            console.error("Institution login error:", err);

            setError(
                "Unable to authenticate the institution wallet."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="institution-login-page">

            {/* HEADER */}
            <header className="institution-login-header">
                <div className="institution-login-header-inner">

                    <button
                        className="institution-brand"
                        onClick={() => navigate("/")}
                    >
                        <div className="institution-brand-logo">
                            ✓
                        </div>

                        <div className="institution-brand-text">
                            <div className="institution-brand-name">
                                verify.edu.pg
                            </div>

                            <div className="institution-brand-subtitle">
                                Academic Certificate Verification
                            </div>
                        </div>
                    </button>

                    <div className="institution-header-badge">
                        <span className="header-security-dot"></span>
                        Secure Institutional Access
                    </div>

                </div>
            </header>


            {/* MAIN */}
            <main className="institution-login-main">

                <div className="institution-login-layout">

                    {/* LEFT SIDE */}
                    <section className="institution-login-intro">

                        <div className="institution-eyebrow">
                            INSTITUTION PORTAL
                        </div>

                        <h1>
                            Manage academic
                            <span> credentials </span>
                            securely.
                        </h1>

                        <p className="institution-intro-description">
                            Authorized institutions can issue, manage and
                            verify academic certificates through the
                            verify.edu.pg blockchain platform.
                        </p>


                        <div className="institution-features">

                            <div className="institution-feature">
                                <div className="institution-feature-icon">
                                    ⛓
                                </div>

                                <div>
                                    <strong>
                                        Blockchain Authentication
                                    </strong>

                                    <span>
                                        Institution access is tied to an
                                        authorized blockchain wallet.
                                    </span>
                                </div>
                            </div>


                            <div className="institution-feature">
                                <div className="institution-feature-icon">
                                    ✓
                                </div>

                                <div>
                                    <strong>
                                        Trusted Certificate Issuing
                                    </strong>

                                    <span>
                                        Issue official academic credentials
                                        that can be independently verified.
                                    </span>
                                </div>
                            </div>


                            <div className="institution-feature">
                                <div className="institution-feature-icon">
                                    ◇
                                </div>

                                <div>
                                    <strong>
                                        Central Verification Framework
                                    </strong>

                                    <span>
                                        A common platform for participating
                                        educational institutions.
                                    </span>
                                </div>
                            </div>

                        </div>


                        {/* SECURITY STRIP */}
                        <div className="institution-security-strip">

                            <div className="security-strip-icon">
                                🔐
                            </div>

                            <div>
                                <strong>
                                    Institutional security
                                </strong>

                                <span>
                                    Wallet authentication helps ensure that
                                    only authorized institutions can issue
                                    certificates.
                                </span>
                            </div>

                        </div>

                    </section>


                    {/* AUTHENTICATION CARD */}
                    <section className="institution-login-card">

                        <div className="institution-card-top">

                            <div className="institution-card-icon">
                                🏛
                            </div>

                            <div>
                                <h2>
                                    Institution Access
                                </h2>

                                <p>
                                    Connect your authorized institutional
                                    wallet to continue.
                                </p>
                            </div>

                        </div>


                        <form
                            className="institution-login-form"
                            onSubmit={handleSubmit}
                        >

                            {/* AUTHENTICATION INTRO */}
                            <div className="wallet-auth-intro">

                                <span className="wallet-label">
                                    BLOCKCHAIN AUTHENTICATION
                                </span>

                                <h3>
                                    Authorized Institution Wallet
                                </h3>

                                <p>
                                    Your connected wallet identifies the
                                    institution authorized to manage academic
                                    certificates on verify.edu.pg.
                                </p>

                            </div>


                            {/* WALLET */}
                            <div className="wallet-section">

                                <div className="wallet-section-heading">

                                    <div>
                                        <span className="wallet-label">
                                            INSTITUTION WALLET
                                        </span>

                                        <h3>
                                            MetaMask
                                        </h3>
                                    </div>

                                    <div
                                        className={
                                            walletConnected
                                                ? "wallet-status connected"
                                                : "wallet-status"
                                        }
                                    >
                                        <span></span>

                                        {walletConnected
                                            ? "Connected"
                                            : "Not Connected"}
                                    </div>

                                </div>


                                {!walletConnected ? (

                                    <button
                                        type="button"
                                        className="connect-wallet-button"
                                        onClick={connectWallet}
                                        disabled={loading}
                                    >
                                        <span className="wallet-button-icon">
                                            ◈
                                        </span>

                                        <span className="wallet-button-text">
                                            <strong>
                                                Connect MetaMask
                                            </strong>

                                            <small>
                                                Connect your authorized
                                                institution wallet
                                            </small>
                                        </span>

                                        <span className="wallet-button-arrow">
                                            →
                                        </span>
                                    </button>

                                ) : (

                                    <div className="connected-wallet">

                                        <div className="connected-wallet-icon">
                                            ✓
                                        </div>

                                        <div className="connected-wallet-info">
                                            <span>
                                                WALLET CONNECTED
                                            </span>

                                            <strong>
                                                {shortenAddress(walletAddress)}
                                            </strong>
                                        </div>

                                        <button
                                            type="button"
                                            className="change-wallet-button"
                                            onClick={connectWallet}
                                            disabled={loading}
                                        >
                                            Change
                                        </button>

                                    </div>

                                )}


                                <p className="wallet-help">
                                    During final integration, this wallet will
                                    be checked against the authorized
                                    institution address registered in the
                                    blockchain contract.
                                </p>

                            </div>


                            {/* INSTITUTION PREVIEW */}
                            {walletConnected && (
                                <div className="institution-wallet-preview">

                                    <div className="institution-wallet-check">
                                        ✓
                                    </div>

                                    <div>
                                        <span>
                                            INSTITUTION
                                        </span>

                                        <br></br>

                                        <strong>
                                            {institutionName}
                                        </strong>
                                        
                                        <br></br>

                                        <small>
                                            {shortenAddress(walletAddress)}
                                        </small>
                                    </div>

                                </div>
                            )}


                            {/* ERROR */}
                            {error && (
                                <div className="institution-login-error">

                                    <div className="institution-error-icon">
                                        !
                                    </div>

                                    <div>
                                        {error}
                                    </div>

                                </div>
                            )}


                            {/* ENTER PORTAL */}
                            <button
                                type="submit"
                                className="institution-login-button"
                                disabled={
                                    loading ||
                                    !walletConnected
                                }
                            >

                                {loading ? (
                                    <>
                                        <span className="institution-spinner">
                                        </span>

                                        Authenticating wallet...
                                    </>
                                ) : (
                                    <>
                                        Enter Institution Portal

                                        <span>
                                            →
                                        </span>
                                    </>
                                )}

                            </button>

                        </form>


                        {/* CARD FOOTER */}
                        <div className="institution-card-footer">

                            <span>
                                🔒
                            </span>

                            <p>
                                Institution access is protected using
                                blockchain wallet authentication.
                            </p>

                        </div>

                    </section>

                </div>

            </main>


            {/* FOOTER */}
            <footer className="institution-login-footer">

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

export default InstitutionLogin;