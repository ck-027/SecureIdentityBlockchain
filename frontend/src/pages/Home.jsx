import { useNavigate } from "react-router-dom";
import "./home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">

      {/* Header */}
      <header className="home-header">
        <div className="home-header-inner">

          <div
            className="home-brand"
            onClick={() => navigate("/")}
          >
            <div className="home-brand-mark">
              V
            </div>

            <div className="home-brand-text">
              <span className="home-platform-name">
                verify.edu.pg
              </span>

              <span className="home-platform-subtitle">
                Academic Credential Verification
              </span>
            </div>
          </div>

          <nav className="home-navigation">
            <button
              className="nav-link"
              onClick={() => navigate("/scan")}
            >
              Verify Certificate
            </button>

            <button
              className="nav-link"
              onClick={() => navigate("/student-login")}
            >
              Student Portal
            </button>

            <button
              className="nav-institution-button"
              onClick={() => navigate("/institution")}
            >
              Institution Portal
            </button>
          </nav>

        </div>
      </header>


      {/* Hero */}
      <main>

        <section className="home-hero">

          <div className="home-hero-content">

            <div className="hero-eyebrow">
              BLOCKCHAIN-BASED ACADEMIC VERIFICATION
            </div>

            <h1>
              Trusted academic credentials,
              <span> verified with confidence.</span>
            </h1>

            <p className="hero-description">
              verify.edu.pg provides a secure platform for issuing,
              managing and verifying academic certificates using
              blockchain technology.
            </p>

            <div className="hero-actions">

              <button
                className="hero-primary-button"
                onClick={() => navigate("/scan")}
              >
                <span className="button-icon">⌕</span>
                Verify a Certificate
              </button>

              <button
                className="hero-secondary-button"
                onClick={() => navigate("/student-login")}
              >
                Student Login
                <span>→</span>
              </button>

            </div>

            <div className="hero-note">
              <span className="hero-note-dot"></span>
              No blockchain knowledge required
            </div>

          </div>


          {/* Hero visual */}
          <div className="hero-visual">

            <div className="verification-card">

              <div className="verification-card-top">
                <span className="verification-label">
                  CERTIFICATE STATUS
                </span>

                <span className="verification-status">
                  VERIFIED
                </span>
              </div>

              <div className="certificate-preview">

                <div className="preview-emblem">
                  V
                </div>

                <div className="preview-content">

                  <span className="preview-small">
                    ACADEMIC CREDENTIAL
                  </span>

                  <h3>
                    Certificate of Achievement
                  </h3>

                  <div className="preview-line"></div>

                  <span className="preview-name">
                    Verified Academic Record
                  </span>

                  <span className="preview-institution">
                    Registered Institution
                  </span>

                </div>

              </div>

              <div className="verification-details">

                <div className="verification-detail">
                  <span>Certificate ID</span>
                  <strong>CERT-••••••</strong>
                </div>

                <div className="verification-detail">
                  <span>Blockchain</span>
                  <strong>Secured</strong>
                </div>

              </div>

              <div className="verified-footer">
                <span className="verified-check">✓</span>

                <div>
                  <strong>Blockchain Verified</strong>
                  <small>Record integrity confirmed</small>
                </div>
              </div>

            </div>

          </div>

        </section>


        {/* Trust strip */}
        <section className="trust-strip">

          <div className="trust-item">
            <div className="trust-icon">✓</div>
            <div>
              <strong>Authentic</strong>
              <span>Verified on blockchain</span>
            </div>
          </div>

          <div className="trust-divider"></div>

          <div className="trust-item">
            <div className="trust-icon">⌁</div>
            <div>
              <strong>Secure</strong>
              <span>Tamper-resistant records</span>
            </div>
          </div>

          <div className="trust-divider"></div>

          <div className="trust-item">
            <div className="trust-icon">QR</div>
            <div>
              <strong>Easy to verify</strong>
              <span>Scan a certificate QR code</span>
            </div>
          </div>

        </section>


        {/* Services */}
        <section className="home-services">

          <div className="section-heading">

            <span className="section-eyebrow">
              ONE PLATFORM
            </span>

            <h2>
              Everything you need to manage
              academic credentials.
            </h2>

            <p>
              Designed for institutions, students and anyone
              who needs to verify an academic certificate.
            </p>

          </div>


          <div className="service-grid">

            <div className="service-card">

              <div className="service-number">
                01
              </div>

              <div className="service-icon">
                ◈
              </div>

              <h3>
                Verify Certificates
              </h3>

              <p>
                Quickly verify the authenticity and current
                status of an academic certificate.
              </p>

              <button
                onClick={() => navigate("/scan")}
                className="service-link"
              >
                Start verification →
              </button>

            </div>


            <div className="service-card">

              <div className="service-number">
                02
              </div>

              <div className="service-icon">
                ◎
              </div>

              <h3>
                Student Portal
              </h3>

              <p>
                Students can securely access their certificate
                information using their issued credentials.
              </p>

              <button
                onClick={() => navigate("/student-login")}
                className="service-link"
              >
                Student login →
              </button>

            </div>


            <div className="service-card">

              <div className="service-number">
                03
              </div>

              <div className="service-icon">
                ▣
              </div>

              <h3>
                Institution Portal
              </h3>

              <p>
                Institutions can issue, manage and revoke
                academic certificates through one portal.
              </p>

              <button
                onClick={() => navigate("/institution")}
                className="service-link"
              >
                Institution portal →
              </button>

            </div>

          </div>

        </section>


        {/* How it works */}
        <section className="how-section">

          <div className="section-heading">

            <span className="section-eyebrow">
              SIMPLE VERIFICATION
            </span>

            <h2>
              Verify in three simple steps.
            </h2>

          </div>

          <div className="steps-grid">

            <div className="step-card">
              <div className="step-number">1</div>

              <div>
                <h3>Scan</h3>
                <p>
                  Scan the QR code attached to the certificate.
                </p>
              </div>
            </div>

            <div className="step-connector"></div>

            <div className="step-card">
              <div className="step-number">2</div>

              <div>
                <h3>Retrieve</h3>
                <p>
                  The certificate record is retrieved from
                  the blockchain.
                </p>
              </div>
            </div>

            <div className="step-connector"></div>

            <div className="step-card">
              <div className="step-number">3</div>

              <div>
                <h3>Verify</h3>
                <p>
                  Review the certificate details and its
                  current verification status.
                </p>
              </div>
            </div>

          </div>

        </section>

      </main>


      {/* Footer */}
      <footer className="home-footer">

        <div className="footer-inner">

          <div className="footer-brand">

            <div className="footer-mark">
              V
            </div>

            <div>
              <strong>verify.edu.pg</strong>
              <span>
                Blockchain-Based Academic Certificate Verification
              </span>
            </div>

          </div>

          <div className="footer-links">

            <button onClick={() => navigate("/scan")}>
              Verify
            </button>

            <button onClick={() => navigate("/student-login")}>
              Student Portal
            </button>

            <button onClick={() => navigate("/institution")}>
              Institutions
            </button>

          </div>

          <div className="footer-copy">
            © {new Date().getFullYear()} verify.edu.pg
          </div>

        </div>

      </footer>

    </div>
  );
}

export default Home;