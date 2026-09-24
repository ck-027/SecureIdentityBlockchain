import "../assets/institution-login.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function InstitutionLogin() {
    const navigate = useNavigate();

    const [institutionID, setInstitutionID] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [walletConnected, setWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState("");
    const [error, setError] = useState("");

    function shortenAddress(address) {
        if (!address) return "";
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    async function connectWallet() {
        setError("");

        try {
            if (!window.ethereum) {
                setError("MetaMask is required for institution authentication.");
                return;
            }

            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts"
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

        if (!institutionID.trim()) {
            setError("Please enter your Institution ID.");
            return;
        }

        if (!password.trim()) {
            setError("Please enter your password.");
            return;
        }

        if (!walletConnected) {
            setError("Please connect your authorized institution wallet.");
            return;
        }

        /*
         * Blockchain authentication will be connected here.
         *
         * The next stage will:
         *
         * 1. Connect to your CertificateVerification contract.
         * 2. Read universityAdmin().
         * 3. Compare it with the connected MetaMask address.
         * 4. Only allow authorized institution wallets to continue.
         */

        try {
            setLoading(true);

            /*
             * Temporary UI-only delay.
             * This will be replaced with the real blockchain
             * authentication in the next step.
             */
            await new Promise((resolve) => setTimeout(resolve, 1000));

            sessionStorage.setItem("institutionLoggedIn", "true");
            sessionStorage.setItem("institutionID", institutionID.trim());
            sessionStorage.setItem("institutionWallet", walletAddress);

            navigate("/institution");

        } catch (err) {
            console.error("Institution login error:", err);
            setError("Unable to authenticate institution.");
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


                    {/* LOGIN CARD */}
                    <section className="institution-login-card">

                        <div className="institution-card-top">

                            <div className="institution-card-icon">
                                🏛
                            </div>

                            <div>
                                <h2>
                                    Institution Login
                                </h2>

                                <p>
                                    Sign in to access your institution portal.
                                </p>
                            </div>

                        </div>


                        <form
                            className="institution-login-form"
                            onSubmit={handleSubmit}
                        >

                            {/* INSTITUTION ID */}
                            <div className="institution-form-group">

                                <label htmlFor="institutionID">
                                    Institution ID
                                </label>

                                <div className="institution-input-wrapper">

                                    <span className="institution-input-icon">
                                        #
                                    </span>

                                    <input
                                        id="institutionID"
                                        type="text"
                                        value={institutionID}
                                        onChange={(e) =>
                                            setInstitutionID(e.target.value)
                                        }
                                        placeholder="e.g. PNGUOT-ADMIN"
                                        autoComplete="username"
                                        disabled={loading}
                                    />

                                </div>

                                <small>
                                    Enter the institution identifier provided
                                    by verify.edu.pg.
                                </small>

                            </div>


                            {/* PASSWORD */}
                            <div className="institution-form-group">

                                <label htmlFor="institutionPassword">
                                    Password
                                </label>

                                <div className="institution-input-wrapper">

                                    <span className="institution-input-icon">
                                        •
                                    </span>

                                    <input
                                        id="institutionPassword"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        disabled={loading}
                                    />

                                    <button
                                        type="button"
                                        className="institution-password-toggle"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        disabled={loading}
                                    >
                                        {showPassword
                                            ? "Hide"
                                            : "Show"}
                                    </button>

                                </div>

                            </div>


                            {/* WALLET */}
                            <div className="wallet-section">

                                <div className="wallet-section-heading">

                                    <div>
                                        <span className="wallet-label">
                                            AUTHORIZED WALLET
                                        </span>

                                        <h3>
                                            Blockchain Authentication
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
                                    Your wallet will be checked against the
                                    institution address registered on the
                                    blockchain.
                                </p>

                            </div>


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


                            {/* LOGIN BUTTON */}
                            <button
                                type="submit"
                                className="institution-login-button"
                                disabled={loading}
                            >

                                {loading ? (
                                    <>
                                        <span className="institution-spinner"></span>

                                        Authenticating institution...
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
                                Institutional credentials and wallet
                                authentication are used to protect access
                                to certificate management.
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