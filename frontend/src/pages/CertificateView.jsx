import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import CertificateABI from "../contracts/CertificateVerificationABI.json";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import "../assets/certificate-template.css";

function CertificateView() {
    const { certificateID } = useParams();

    const [certificate, setCertificate] = useState(null);

    const contractAddress =
        "0x9219c0Bb6Fe04DCD570443AD13d49DEB3DA2681b";

    /*
     * Convert a blockchain timestamp into
     * a readable date.
     *
     * The contract stores dates as Unix timestamps
     * measured in seconds.
     */
    function formatDate(timestamp) {
        if (!timestamp) {
            return "N/A";
        }

        return new Date(
            Number(timestamp) * 1000
        ).toLocaleDateString();
    }

    /*
     * Load certificate information
     * from the blockchain.
     */
    async function loadCertificate() {
        try {
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

            /*
             * The smart contract returns:
             *
             * data[0] = studentName
             * data[1] = qualification
             * data[2] = institution
             * data[3] = certificateHash
             * data[4] = issueDate
             * data[5] = blockchainTimestamp
             * data[6] = verified
             */
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
                "Certificate loading error:",
                error
            );

            setCertificate(null);
        }
    }

    useEffect(() => {
        loadCertificate();
    }, [certificateID]);

    /*
     * Download certificate as a PDF.
     *
     * The certificate is captured at high resolution
     * and then scaled proportionally so the ENTIRE
     * certificate fits inside one A4 page.
     */
    async function downloadCertificate() {
        const element =
            document.getElementById(
                "certificate"
            );

        if (!element) {
            alert(
                "Unable to find the certificate."
            );

            return;
        }

        try {
            /*
             * Temporarily make sure the certificate
             * can be fully captured even if the CSS
             * contains overflow restrictions.
             */
            const originalOverflow =
                element.style.overflow;

            const originalHeight =
                element.style.height;

            element.style.overflow = "visible";
            element.style.height = "auto";

            /*
             * Give the browser a moment to finish
             * rendering the expanded certificate.
             */
            await new Promise(
                (resolve) =>
                    setTimeout(resolve, 100)
            );

            /*
             * Capture the complete certificate.
             */
            const canvas =
                await html2canvas(
                    element,
                    {
                        scale: 2,
                        useCORS: true,
                        backgroundColor: "#ffffff",
                        scrollX: 0,
                        scrollY: 0,
                        windowWidth:
                            document.documentElement
                                .scrollWidth,
                        windowHeight:
                            document.documentElement
                                .scrollHeight
                    }
                );

            /*
             * Restore the original certificate styling.
             */
            element.style.overflow =
                originalOverflow;

            element.style.height =
                originalHeight;

            const imageData =
                canvas.toDataURL(
                    "image/png",
                    1.0
                );

            /*
             * Create A4 portrait PDF.
             */
            const pdf =
                new jsPDF(
                    "portrait",
                    "mm",
                    "a4"
                );

            const pageWidth =
                pdf.internal.pageSize.getWidth();

            const pageHeight =
                pdf.internal.pageSize.getHeight();

            /*
             * Leave a small safe margin around
             * the certificate so no part is cut off
             * by printer/PDF boundaries.
             */
            const margin = 8;

            const availableWidth =
                pageWidth -
                margin * 2;

            const availableHeight =
                pageHeight -
                margin * 2;

            /*
             * Calculate the certificate's
             * original aspect ratio.
             */
            const imageRatio =
                canvas.width /
                canvas.height;

            /*
             * First fit the image to the
             * available PDF width.
             */
            let imageWidth =
                availableWidth;

            let imageHeight =
                imageWidth /
                imageRatio;

            /*
             * If the resulting height is too large
             * for A4, scale it down again so that
             * the entire certificate fits.
             */
            if (
                imageHeight >
                availableHeight
            ) {
                imageHeight =
                    availableHeight;

                imageWidth =
                    imageHeight *
                    imageRatio;
            }

            /*
             * Center the certificate horizontally
             * and vertically on the A4 page.
             */
            const x =
                (pageWidth -
                    imageWidth) /
                2;

            const y =
                (pageHeight -
                    imageHeight) /
                2;

            /*
             * Add the complete certificate.
             */
            pdf.addImage(
                imageData,
                "PNG",
                x,
                y,
                imageWidth,
                imageHeight
            );

            /*
             * Save PDF.
             */
            pdf.save(
                "Digital-Certificate.pdf"
            );
        }
        catch (error) {
            console.error(
                "Certificate PDF generation error:",
                error
            );

            /*
             * Make sure the certificate's original
             * styling is restored if an error occurs.
             */
            element.style.overflow = "";
            element.style.height = "";

            alert(
                "Unable to generate the certificate PDF.\n\n" +
                (
                    error?.message ||
                    "Unknown error."
                )
            );
        }
    }

    /*
     * Loading screen.
     */
    if (!certificate) {
        return (
            <h2>
                Loading certificate...
            </h2>
        );
    }

    /*
     * If the certificate has been revoked,
     * do not display the certificate.
     */
    if (!certificate.verified) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#f5f7fb"
                }}
            >
                <div
                    style={{
                        background: "white",
                        padding: "40px",
                        borderRadius: "12px",
                        textAlign: "center",
                        boxShadow:
                            "0 2px 10px rgba(0,0,0,0.1)"
                    }}
                >
                    <h1
                        style={{
                            color: "red"
                        }}
                    >
                        CERTIFICATE REVOKED
                    </h1>

                    <p>
                        This credential has been revoked
                        by the issuing institution.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>

            {/* =========================
                CERTIFICATE
            ========================== */}

            <div
                id="certificate"
                className="certificate-template"
            >

                {/* UNIVERSITY */}

                <div className="university-name">
                    PAPUA NEW GUINEA UNIVERSITY
                    <br />
                    OF TECHNOLOGY
                </div>

                {/* TITLE */}

                <div className="certificate-title">
                    CERTIFICATE OF COMPLETION
                </div>

                {/* INTRODUCTION */}

                <div className="certificate-text">
                    This certifies that
                </div>

                {/* STUDENT NAME */}

                <div className="student-name">
                    {certificate.studentName}
                </div>

                {/* QUALIFICATION */}

                <div className="certificate-text">
                    has successfully fulfilled
                    the requirements for
                </div>

                <div className="degree-name">
                    {certificate.qualification}
                </div>

                {/* INSTITUTION */}

                <div className="certificate-text">
                    Issued by
                </div>

                <div className="certificate-text">
                    {certificate.institution}
                </div>

                {/* OFFICIAL ISSUE DATE */}

                <div className="certificate-text">
                    Issued on
                </div>

                <div
                    className="certificate-text"
                    style={{
                        fontWeight: "bold"
                    }}
                >
                    {formatDate(
                        certificate.issueDate
                    )}
                </div>

                {/* SIGNATURES */}

                <div className="footer-section">

                    <div className="signature-block">
                        <div className="signature-line">
                            Vice Chancellor
                        </div>
                    </div>

                    <div className="signature-block">
                        <div className="signature-line">
                            Official Seal
                        </div>
                    </div>

                </div>

                {/* BOTTOM SECTION */}

                <div className="bottom-section">

                    <div className="signature-block">
                        <div className="signature-line">
                            Registrar
                        </div>
                    </div>

                    {/* QR CODE */}

                    <div className="qr-block">

                        <QRCodeCanvas
                            value={
                                window.location.origin +
                                "/verify/" +
                                certificateID
                            }
                            size={120}
                        />

                        <p>
                            Scan to Verify
                        </p>

                        <p>
                            Certificate ID:
                            <br />
                            {certificateID}
                        </p>

                        {/* HASH */}

                        <small>
                            Hash:
                            <br />

                            {
                                certificate.certificateHash
                                    ?
                                    certificate.certificateHash.slice(
                                        0,
                                        18
                                    ) + "..."
                                    :
                                    ""
                            }
                        </small>

                        {/* BLOCKCHAIN RECORD DATE */}

                        <small
                            style={{
                                display: "block",
                                marginTop: "10px"
                            }}
                        >
                            Blockchain Recorded:
                            <br />

                            {formatDate(
                                certificate.blockchainTimestamp
                            )}
                        </small>

                        {/* STATUS */}

                        <div
                            className="verification-status"
                        >
                            {
                                certificate.verified
                                    ?
                                    "✓ Blockchain Verified"
                                    :
                                    "✕ Certificate Invalid"
                            }
                        </div>

                    </div>

                </div>

            </div>

            {/* DOWNLOAD BUTTON */}

            {
                sessionStorage.getItem(
                    "studentLoggedIn"
                ) === "true"
                &&
                (
                    <button
                        className="download-button"
                        onClick={
                            downloadCertificate
                        }
                    >
                        Download Certificate
                    </button>
                )
            }

        </div>
    );
}

export default CertificateView;
