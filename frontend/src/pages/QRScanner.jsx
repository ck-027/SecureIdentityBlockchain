import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserQRCodeReader } from "@zxing/browser";
import "./qr-scanner.css";

function QRScanner() {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const controlsRef = useRef(null);

  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [manualID, setManualID] = useState("");

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  function extractCertificateID(value) {
    if (!value) {
      return "";
    }

    const cleanValue = value.trim();

    /*
     * If the QR contains a full verification URL:
     *
     * https://verify.edu.pg/verify/CERT-123456
     *
     * or:
     *
     * https://verify.edu.pg/certificate/CERT-123456
     */

    try {
      const url = new URL(cleanValue);

      const parts = url.pathname
        .split("/")
        .filter(Boolean);

      const verifyIndex = parts.indexOf("verify");
      const certificateIndex = parts.indexOf("certificate");

      if (verifyIndex !== -1 && parts[verifyIndex + 1]) {
        return decodeURIComponent(parts[verifyIndex + 1]);
      }

      if (certificateIndex !== -1 && parts[certificateIndex + 1]) {
        return decodeURIComponent(parts[certificateIndex + 1]);
      }
    } catch {
      // Not a URL. It may simply be a certificate ID.
    }

    /*
     * Also support QR codes containing only:
     *
     * CERT-123456
     */

    if (cleanValue.toUpperCase().startsWith("CERT-")) {
      return cleanValue;
    }

    return "";
  }

  function handleScannedValue(value) {
    const certificateID = extractCertificateID(value);

    if (!certificateID) {
      setError(
        "The QR code was detected, but it does not contain a valid certificate ID."
      );
      return;
    }

    stopScanner();

    navigate(`/verify/${encodeURIComponent(certificateID)}`);
  }

  async function startScanner() {
    setError("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setError(
        "Camera access is not supported by this browser. Please enter the Certificate ID manually."
      );
      return;
    }

    try {
      setScanning(true);

      const reader = new BrowserQRCodeReader();

      readerRef.current = reader;

      const devices = await BrowserQRCodeReader.listVideoInputDevices();

      if (!devices.length) {
        throw new Error("No camera was found.");
      }

      /*
       * Prefer the back/rear camera on mobile devices.
       */
      const preferredCamera =
        devices.find((device) =>
          /back|rear|environment/i.test(device.label)
        ) || devices[0];

      controlsRef.current =
        await reader.decodeFromVideoDevice(
          preferredCamera.deviceId,
          videoRef.current,
          (result, decodeError) => {
            if (result) {
              handleScannedValue(result.getText());
            }

            if (decodeError) {
              // Normal while the scanner is searching.
            }
          }
        );

    } catch (scanError) {
      console.error("QR scanner error:", scanError);

      setScanning(false);

      setError(
        scanError?.message ||
        "Unable to access the camera. Please check your browser camera permissions."
      );
    }
  }

  function stopScanner() {
    try {
      if (controlsRef.current) {
        controlsRef.current.stop();
        controlsRef.current = null;
      }

      if (readerRef.current) {
        readerRef.current.reset();
        readerRef.current = null;
      }

      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();

        tracks.forEach((track) => track.stop());

        videoRef.current.srcObject = null;
      }
    } catch (scannerError) {
      console.error("Unable to stop scanner:", scannerError);
    }

    setScanning(false);
  }

  function handleManualVerification(event) {
    event.preventDefault();

    const certificateID = manualID.trim();

    if (!certificateID) {
      setError("Please enter a Certificate ID.");
      return;
    }

    if (!certificateID.toUpperCase().startsWith("CERT-")) {
      setError("Please enter a valid Certificate ID beginning with CERT-.");
      return;
    }

    setError("");

    navigate(`/verify/${encodeURIComponent(certificateID)}`);
  }

  return (
    <div className="qr-page">

      {/* Header */}
      <header className="qr-header">

        <div
          className="qr-brand"
          onClick={() => navigate("/")}
        >

          <div className="qr-brand-mark">
            V
          </div>

          <div className="qr-brand-text">

            <strong>
              verify.edu.pg
            </strong>

            <span>
              Academic Credential Verification
            </span>

          </div>

        </div>

        <button
          className="qr-home-button"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>

      </header>


      {/* Main */}
      <main className="qr-main">

        <div className="qr-container">

          <div className="qr-intro">

            <span className="qr-eyebrow">
              CERTIFICATE VERIFICATION
            </span>

            <h1>
              Scan a certificate
            </h1>

            <p>
              Use your device camera to scan the QR code on
              an academic certificate and verify its record.
            </p>

          </div>


          {/* Scanner Card */}
          <div className="scanner-card">

            <div className="scanner-card-header">

              <div>
                <h2>
                  QR Code Scanner
                </h2>

                <p>
                  Position the certificate QR code inside the frame.
                </p>
              </div>

              <div className="scanner-status">
                <span className={scanning ? "status-dot active" : "status-dot"}></span>
                {scanning ? "Scanning" : "Ready"}
              </div>

            </div>


            <div className="camera-area">

              <video
                ref={videoRef}
                className={`scanner-video ${scanning ? "visible" : ""}`}
                muted
                playsInline
              />

              {!scanning && (
                <div className="scanner-placeholder">

                  <div className="camera-icon">
                    ◉
                  </div>

                  <h3>
                    Camera scanner ready
                  </h3>

                  <p>
                    Allow camera access when your browser asks
                    for permission.
                  </p>

                  <button
                    className="start-scanner-button"
                    onClick={startScanner}
                  >
                    Start Camera Scanner
                  </button>

                </div>
              )}

              {scanning && (
                <div className="scanner-overlay">

                  <div className="scan-frame">
                    <span className="corner top-left"></span>
                    <span className="corner top-right"></span>
                    <span className="corner bottom-left"></span>
                    <span className="corner bottom-right"></span>

                    <div className="scan-line"></div>
                  </div>

                  <span className="scan-instruction">
                    Align the QR code inside the frame
                  </span>

                </div>
              )}

            </div>


            {scanning && (
              <button
                className="stop-scanner-button"
                onClick={stopScanner}
              >
                Stop Camera
              </button>
            )}


            {error && (
              <div className="qr-error">
                <strong>
                  Unable to scan
                </strong>

                <span>
                  {error}
                </span>
              </div>
            )}


            <div className="manual-divider">
              <span>OR</span>
            </div>


            {/* Manual verification */}
            <form
              className="manual-form"
              onSubmit={handleManualVerification}
            >

              <label htmlFor="certificateID">
                Enter Certificate ID manually
              </label>

              <div className="manual-input-row">

                <input
                  id="certificateID"
                  type="text"
                  value={manualID}
                  onChange={(event) => {
                    setManualID(event.target.value);
                    setError("");
                  }}
                  placeholder="e.g. CERT-123456"
                  autoComplete="off"
                />

                <button type="submit">
                  Verify
                </button>

              </div>

            </form>

          </div>


          {/* Information */}
          <div className="scanner-info-grid">

            <div className="scanner-info-card">

              <div className="info-number">
                01
              </div>

              <h3>
                Find the QR code
              </h3>

              <p>
                Look for the verification QR code printed
                on the academic certificate.
              </p>

            </div>


            <div className="scanner-info-card">

              <div className="info-number">
                02
              </div>

              <h3>
                Scan the code
              </h3>

              <p>
                Position the QR code within the camera frame
                until it is automatically detected.
              </p>

            </div>


            <div className="scanner-info-card">

              <div className="info-number">
                03
              </div>

              <h3>
                Review the record
              </h3>

              <p>
                The platform retrieves the certificate record
                and displays its current status.
              </p>

            </div>

          </div>

        </div>

      </main>


      <footer className="qr-footer">
        <span>
          verify.edu.pg
        </span>

        <span>
          Blockchain-Based Academic Certificate Verification
        </span>
      </footer>

    </div>
  );
}

export default QRScanner;