import { useState, useEffect } from "react";
import { ethers } from "ethers";
import CertificateABI from "../contracts/CertificateVerificationABI.json";
import pnguotLogo from "../assets/pnguot-logo.png";
import "../assets/institution-portal.css";

const InstitutionPortal = () => {
  // =========================================================
  // STATE
  // =========================================================

  const [studentName, setStudentName] = useState("");
  const [qualification, setQualification] = useState("");
  const [issueDate, setIssueDate] = useState("");

  const [certificates, setCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] =
    useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [csvRows, setCsvRows] = useState([]);
  const [csvFileName, setCsvFileName] = useState("");
  const [csvError, setCsvError] = useState("");

  const [bulkIssuing, setBulkIssuing] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [bulkResults, setBulkResults] = useState([]);

  const institution = "PNG University of Technology";

  const contractAddress =
    "0x9219c0Bb6Fe04DCD570443AD13d49DEB3DA2681b";

  // =========================================================
  // CONTRACT
  // =========================================================

  const getContract = async () => {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed.");
    }

    const provider = new ethers.BrowserProvider(
      window.ethereum
    );

    const signer = await provider.getSigner();

    return new ethers.Contract(
      contractAddress,
      CertificateABI,
      signer
    );
  };

  // =========================================================
  // HELPERS
  // =========================================================

  // Generate an 8-character student password
  const generatePassword = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let password = "";

    for (let i = 0; i < 8; i++) {
      password += characters.charAt(
        Math.floor(
          Math.random() * characters.length
        )
      );
    }

    return password;
  };

  // Format blockchain timestamp as DD/MM/YYYY
  const formatDate = (timestamp) => {
    try {
      if (
        timestamp === undefined ||
        timestamp === null ||
        timestamp === ""
      ) {
        return "N/A";
      }

      const date = new Date(
        Number(timestamp) * 1000
      );

      if (isNaN(date.getTime())) {
        return "N/A";
      }

      const day = String(
        date.getDate()
      ).padStart(2, "0");

      const month = String(
        date.getMonth() + 1
      ).padStart(2, "0");

      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    } catch {
      return "N/A";
    }
  };

  // Convert DD/MM/YYYY into a blockchain Unix timestamp
  const convertDDMMYYYYToTimestamp = (dateString) => {
    if (
      typeof dateString !== "string" ||
      !/^\d{2}\/\d{2}\/\d{4}$/.test(
        dateString
      )
    ) {
      return null;
    }

    const [dayString, monthString, yearString] =
      dateString.split("/");

    const day = Number(dayString);
    const month = Number(monthString);
    const year = Number(yearString);

    // Basic range validation
    if (
      day < 1 ||
      day > 31 ||
      month < 1 ||
      month > 12 ||
      year < 1900 ||
      year > 2100
    ) {
      return null;
    }

    const date = new Date(
      year,
      month - 1,
      day,
      0,
      0,
      0
    );

    // Prevent JavaScript from silently
    // converting invalid dates such as 31/02/2026.
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return Math.floor(
      date.getTime() / 1000
    );
  };

  // Create certificate hash
  const createCertificateHash = (
    student,
    qualificationName,
    certificateIssueDate
  ) => {
    return ethers.keccak256(
      ethers.toUtf8Bytes(
        student +
          qualificationName +
          institution +
          certificateIssueDate
      )
    );
  };

  // Store student credentials locally
  const storeCredentials = (
    certificateID,
    password,
    student,
    qualificationName
  ) => {
    const credentials = {
      certificateID,
      studentName: student,
      qualification: qualificationName,
      password,
    };

    localStorage.setItem(
      `certificate_credentials_${certificateID}`,
      JSON.stringify(credentials)
    );
  };

  // Generate unique certificate ID
  const generateCertificateID = () => {
    return `CERT-${Date.now()}`;
  };

  // =========================================================
  // ISSUE CERTIFICATE
  // =========================================================

  const issueCertificate = async () => {
    if (!studentName.trim()) {
      alert("Please enter the student's name.");
      return;
    }

    if (!qualification.trim()) {
      alert("Please enter the qualification.");
      return;
    }

    if (!issueDate) {
      alert("Please select an issue date.");
      return;
    }

    try {
      const contract = await getContract();

      const certificateID =
        generateCertificateID();

      // Browser date input returns YYYY-MM-DD.
      // Convert it to a timestamp for the blockchain.
      const issueDateTimestamp = Math.floor(
        new Date(
          issueDate + "T00:00:00"
        ).getTime() / 1000
      );

      if (
        !Number.isFinite(
          issueDateTimestamp
        )
      ) {
        throw new Error(
          "Invalid issue date."
        );
      }

      const certificateHash =
        createCertificateHash(
          studentName.trim(),
          qualification.trim(),
          issueDate
        );

      const studentPassword =
        generatePassword();

      const passwordHash =
        ethers.keccak256(
          ethers.toUtf8Bytes(
            studentPassword
          )
        );

      const tx =
        await contract.issueCertificate(
          certificateID,
          studentName.trim(),
          qualification.trim(),
          institution,
          certificateHash,
          issueDateTimestamp,
          passwordHash
        );

      await tx.wait();

      storeCredentials(
        certificateID,
        studentPassword,
        studentName.trim(),
        qualification.trim()
      );

      alert(
        `Certificate issued successfully!\n\n` +
          `Certificate ID: ${certificateID}\n` +
          `Issue Date: ${formatDate(
            issueDateTimestamp
          )}\n` +
          `Student Password: ${studentPassword}`
      );

      setStudentName("");
      setQualification("");
      setIssueDate("");

      await loadCertificates();
    } catch (error) {
      console.error(
        "Certificate issuance error:",
        error
      );

      alert(
        error?.reason ||
          error?.shortMessage ||
          error?.message ||
          "Failed to issue certificate."
      );
    }
  };

  // =========================================================
  // REVOKE CERTIFICATE
  // =========================================================

  const revokeCertificate = async (
    certificateID
  ) => {
    try {
      const contract =
        await getContract();

      const tx =
        await contract.revokeCertificate(
          certificateID
        );

      await tx.wait();

      alert(
        `Certificate ${certificateID} has been revoked.`
      );

      await loadCertificates();
    } catch (error) {
      console.error(
        "Certificate revocation error:",
        error
      );

      alert(
        error?.reason ||
          error?.shortMessage ||
          error?.message ||
          "Failed to revoke certificate."
      );
    }
  };

  const confirmRevocation = (
    certificateID
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to revoke certificate ${certificateID}?`
      );

    if (confirmed) {
      revokeCertificate(certificateID);
    }
  };

  // =========================================================
  // LOAD CERTIFICATES
  // =========================================================

  const loadCertificates = async () => {
    try {
      if (!window.ethereum) {
        return;
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

      const ids =
        await contract.getAllCertificateIDs();

      const certificateList = [];

      for (const id of ids) {
        try {
          const data =
            await contract.verifyCertificate(
              id
            );

          certificateList.push({
            id,
            student: data[0],
            qualification: data[1],
            institution: data[2],
            hash: data[3],
            issueDate: data[4],
            blockchainTimestamp: data[5],
            verified: data[6],
          });
        } catch (error) {
          console.error(
            `Unable to load certificate ${id}:`,
            error
          );
        }
      }

      setCertificates(
        certificateList
      );
    } catch (error) {
      console.error(
        "Unable to load certificates:",
        error
      );
    }
  };

  // =========================================================
  // CREDENTIALS
  // =========================================================

  const openCredentials = (
    certificate
  ) => {
    try {
      const stored =
        localStorage.getItem(
          `certificate_credentials_${certificate.id}`
        );

      if (!stored) {
        alert(
          "Student credentials could not be found on this device."
        );
        return;
      }

      let credentials;

      try {
        credentials =
          JSON.parse(stored);
      } catch {
        credentials = {
          password: stored,
        };
      }

      setSelectedCertificate({
        ...certificate,
        password:
          credentials.password,
      });

      setShowPassword(false);
    } catch (error) {
      console.error(
        "Unable to retrieve credentials:",
        error
      );

      alert(
        "Unable to retrieve certificate credentials."
      );
    }
  };

  const closeCredentials = () => {
    setSelectedCertificate(null);
    setShowPassword(false);
  };

  // =========================================================
  // CSV TEMPLATE
  // =========================================================

  const downloadCSVTemplate = () => {
    const csvContent =
      "studentName,qualification,issueDate\n" +
      "John Doe,Bachelor of Information Technology,15/08/2026\n" +
      "Jane Smith,Diploma in Business,20/08/2026";

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "certificate_upload_template.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =========================================================
  // CSV PARSER
  // =========================================================

  const parseCSVLine = (line) => {
    const result = [];

    let current = "";

    let insideQuotes = false;

    for (
      let i = 0;
      i < line.length;
      i++
    ) {
      const char = line[i];

      if (char === '"') {
        if (
          insideQuotes &&
          line[i + 1] === '"'
        ) {
          current += '"';
          i++;
        } else {
          insideQuotes =
            !insideQuotes;
        }
      } else if (
        char === "," &&
        !insideQuotes
      ) {
        result.push(
          current.trim()
        );

        current = "";
      } else {
        current += char;
      }
    }

    result.push(
      current.trim()
    );

    return result;
  };

  // =========================================================
  // CSV UPLOAD
  // =========================================================

  const handleCSVUpload = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setCsvError("");
    setCsvRows([]);
    setBulkResults([]);
    setBulkProgress(0);
    setCsvFileName(file.name);

    if (
      !file.name
        .toLowerCase()
        .endsWith(".csv")
    ) {
      setCsvError(
        "Please upload a CSV file."
      );

      return;
    }

    const reader =
      new FileReader();

    reader.onload = (e) => {
      try {
        let text =
          e.target.result || "";

        // Remove UTF-8 BOM if present
        text =
          text.replace(
            /^\uFEFF/,
            ""
          );

        const lines =
          text
            .split(/\r?\n/)
            .filter(
              (line) =>
                line.trim() !== ""
            );

        if (lines.length < 2) {
          setCsvError(
            "The CSV file must contain a header row and at least one student record."
          );

          return;
        }

        const headers =
          parseCSVLine(
            lines[0]
          ).map((header) =>
            header
              .trim()
              .toLowerCase()
              .replace(
                /\s+/g,
                ""
              )
          );

        const studentNameIndex =
          headers.indexOf(
            "studentname"
          );

        const qualificationIndex =
          headers.indexOf(
            "qualification"
          );

        const issueDateIndex =
          headers.indexOf(
            "issuedate"
          );

        if (
          studentNameIndex ===
            -1 ||
          qualificationIndex ===
            -1 ||
          issueDateIndex === -1
        ) {
          setCsvError(
            "CSV must contain studentName, qualification, and issueDate columns."
          );

          return;
        }

        const rows = [];

        for (
          let i = 1;
          i < lines.length;
          i++
        ) {
          const values =
            parseCSVLine(
              lines[i]
            );

          const student =
            values[
              studentNameIndex
            ]?.trim() || "";

          const qualificationName =
            values[
              qualificationIndex
            ]?.trim() || "";

          const date =
            values[
              issueDateIndex
            ]?.trim() || "";

          const errors = [];

          if (!student) {
            errors.push(
              "Student name is required."
            );
          }

          if (!qualificationName) {
            errors.push(
              "Qualification is required."
            );
          }

          // Validate DD/MM/YYYY
          const issueDateTimestamp =
            convertDDMMYYYYToTimestamp(
              date
            );

          if (
            issueDateTimestamp ===
            null
          ) {
            errors.push(
              "Issue date must use DD/MM/YYYY."
            );
          }

          rows.push({
            rowNumber: i + 1,
            studentName: student,
            qualification:
              qualificationName,
            issueDate: date,
            errors,
          });
        }

        setCsvRows(rows);
      } catch (error) {
        console.error(
          "CSV parsing error:",
          error
        );

        setCsvError(
          "Unable to read the CSV file."
        );
      }
    };

    reader.readAsText(file);
  };

  // =========================================================
  // CLEAR CSV
  // =========================================================

  const clearCSV = () => {
    setCsvRows([]);
    setCsvFileName("");
    setCsvError("");
    setBulkResults([]);
    setBulkProgress(0);

    const fileInput =
      document.getElementById(
        "csv-upload"
      );

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // =========================================================
  // CSV CREDENTIAL EXPORT
  // =========================================================

  const escapeCSVValue = (
    value
  ) => {
    const stringValue =
      String(value ?? "");

    if (
      stringValue.includes(",") ||
      stringValue.includes('"') ||
      stringValue.includes("\n")
    ) {
      return `"${stringValue.replace(
        /"/g,
        '""'
      )}"`;
    }

    return stringValue;
  };

  const downloadCredentialsCSV =
    () => {
      const successfulResults =
        bulkResults.filter(
          (result) =>
            result.success
        );

      if (
        successfulResults.length ===
        0
      ) {
        alert(
          "There are no successful certificate records to download."
        );

        return;
      }

      const header =
        "Certificate ID,Student Name,Qualification,Issue Date,Student Password";

      const rows =
        successfulResults.map(
          (result) =>
            [
              result.id,
              result.studentName,
              result.qualification,
              result.issueDate,
              result.password,
            ]
              .map(
                escapeCSVValue
              )
              .join(",")
        );

      const csvContent = [
        header,
        ...rows,
      ].join("\n");

      const blob = new Blob(
        [csvContent],
        {
          type: "text/csv;charset=utf-8;",
        }
      );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "student_certificate_credentials.csv";

      document.body.appendChild(
        link
      );

      link.click();

      document.body.removeChild(
        link
      );

      URL.revokeObjectURL(url);
    };

  // =========================================================
  // BULK ISSUANCE
  // =========================================================

  const issueBulkCertificates =
    async () => {
      if (csvRows.length === 0) {
        alert(
          "Please upload a CSV file first."
        );

        return;
      }

      const invalidRows =
        csvRows.filter(
          (row) =>
            row.errors &&
            row.errors.length > 0
        );

      if (
        invalidRows.length > 0
      ) {
        alert(
          `Please correct the ${invalidRows.length} invalid row(s) before issuing certificates.`
        );

        return;
      }

      const confirmed =
        window.confirm(
          `You are about to issue ${csvRows.length} certificates. Continue?`
        );

      if (!confirmed) {
        return;
      }

      setBulkIssuing(true);
      setBulkProgress(0);
      setBulkResults([]);

      try {
        const contract =
          await getContract();

        const results = [];

        for (
          let i = 0;
          i < csvRows.length;
          i++
        ) {
          const row =
            csvRows[i];

          try {
            const certificateID =
              generateCertificateID();

            // Convert DD/MM/YYYY to timestamp
            const issueDateTimestamp =
              convertDDMMYYYYToTimestamp(
                row.issueDate
              );

            if (
              issueDateTimestamp ===
              null
            ) {
              throw new Error(
                "Invalid issue date. Use DD/MM/YYYY."
              );
            }

            const certificateHash =
              createCertificateHash(
                row.studentName.trim(),
                row.qualification.trim(),
                row.issueDate
              );

            const studentPassword =
              generatePassword();

            const passwordHash =
              ethers.keccak256(
                ethers.toUtf8Bytes(
                  studentPassword
                )
              );

            const tx =
              await contract.issueCertificate(
                certificateID,
                row.studentName.trim(),
                row.qualification.trim(),
                institution,
                certificateHash,
                issueDateTimestamp,
                passwordHash
              );

            await tx.wait();

            storeCredentials(
              certificateID,
              studentPassword,
              row.studentName.trim(),
              row.qualification.trim()
            );

            results.push({
              rowNumber:
                row.rowNumber,

              success: true,

              id: certificateID,

              studentName:
                row.studentName,

              qualification:
                row.qualification,

              issueDate:
                row.issueDate,

              password:
                studentPassword,

              txHash: tx.hash,
            });
          } catch (error) {
            console.error(
              `Bulk issuance failed for row ${row.rowNumber}:`,
              error
            );

            results.push({
              rowNumber:
                row.rowNumber,

              success: false,

              studentName:
                row.studentName,

              qualification:
                row.qualification,

              issueDate:
                row.issueDate,

              error:
                error?.reason ||
                error?.shortMessage ||
                error?.message ||
                "Failed to issue certificate.",
            });
          }

          const progress =
            Math.round(
              ((i + 1) /
                csvRows.length) *
                100
            );

          setBulkProgress(
            progress
          );

          setBulkResults([
            ...results,
          ]);
        }

        await loadCertificates();

        const successful =
          results.filter(
            (result) =>
              result.success
          ).length;

        const failed =
          results.filter(
            (result) =>
              !result.success
          ).length;

        alert(
          `Bulk certificate issuance completed.\n\nSuccessful: ${successful}\nFailed: ${failed}`
        );
      } catch (error) {
        console.error(
          "Bulk issuance error:",
          error
        );

        alert(
          error?.reason ||
            error?.shortMessage ||
            error?.message ||
            "Bulk certificate issuance failed."
        );
      } finally {
        setBulkIssuing(false);
      }
    };

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredCertificates =
    certificates.filter(
      (certificate) => {
        const search =
          searchTerm
            .trim()
            .toLowerCase();

        if (!search) {
          return true;
        }

        const status =
          certificate.verified
            ? "valid"
            : "revoked";

        return (
          String(
            certificate.id
          )
            .toLowerCase()
            .includes(search) ||
          String(
            certificate.student
          )
            .toLowerCase()
            .includes(search) ||
          String(
            certificate.qualification
          )
            .toLowerCase()
            .includes(search) ||
          String(
            certificate.institution
          )
            .toLowerCase()
            .includes(search) ||
          status.includes(search)
        );
      }
    );

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    if (window.ethereum) {
      loadCertificates();
    }
  }, []);

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="institution-portal">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="institution-header">

        <div className="institution-header-inner">

          <div className="institution-brand">

            <div className="institution-logo-wrapper">

              <img
                src={pnguotLogo}
                alt="Papua New Guinea University of Technology"
                className="pnguot-logo"
              />

            </div>

            <div className="institution-brand-text">

              <span className="platform-name">
                verify.edu.pg
              </span>

              <span className="portal-name">
                Institution Portal
              </span>

            </div>

          </div>

          <div className="institution-info">

            <span className="institution-label">
              Institution
            </span>

            <strong>
              {institution}
            </strong>

          </div>

        </div>

      </header>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="institution-main">

        {/* ===================================================
            WELCOME / OVERVIEW
        =================================================== */}

        <section className="portal-intro">

          <div>

            <span className="section-eyebrow">
              INSTITUTION PORTAL
            </span>

            <h1>
              Certificate Management
            </h1>

            <p>
              Manage academic certificates,
              issue new records, and maintain
              trusted blockchain-based
              verification.
            </p>

          </div>

        </section>


        {/* ===================================================
            QUICK OVERVIEW
        =================================================== */}

        <section className="overview-grid">

          <div className="overview-item">

            <span>
              Total Certificates
            </span>

            <strong>
              {certificates.length}
            </strong>

          </div>


          <div className="overview-item">

            <span>
              Valid Certificates
            </span>

            <strong>
              {
                certificates.filter(
                  (certificate) =>
                    certificate.verified
                ).length
              }
            </strong>

          </div>


          <div className="overview-item">

            <span>
              Revoked Certificates
            </span>

            <strong>
              {
                certificates.filter(
                  (certificate) =>
                    !certificate.verified
                ).length
              }
            </strong>

          </div>

        </section>


        {/* ===================================================
            ISSUE CERTIFICATE
        =================================================== */}

        <section className="portal-card">

          <div className="card-header">

            <div>

              <span className="section-eyebrow">
                NEW CERTIFICATE
              </span>

              <h2>
                Issue a Certificate
              </h2>

              <p>
                Enter the student's details
                below to create a new
                certificate.
              </p>

            </div>

          </div>


          <div className="certificate-form">

            <div className="form-group">

              <label htmlFor="studentName">
                Student Name
              </label>

              <input
                id="studentName"
                type="text"
                value={studentName}
                onChange={(e) =>
                  setStudentName(
                    e.target.value
                  )
                }
                placeholder="Full name"
              />

            </div>


            <div className="form-group">

              <label htmlFor="qualification">
                Qualification
              </label>

              <input
                id="qualification"
                type="text"
                value={qualification}
                onChange={(e) =>
                  setQualification(
                    e.target.value
                  )
                }
                placeholder="Qualification awarded"
              />

            </div>


            <div className="form-group">

              <label htmlFor="issueDate">
                Issue Date
              </label>

              <input
                id="issueDate"
                type="date"
                value={issueDate}
                onChange={(e) =>
                  setIssueDate(
                    e.target.value
                  )
                }
              />

            </div>

          </div>


          <div className="form-actions">

            <button
              className="primary-button"
              onClick={
                issueCertificate
              }
            >
              Issue Certificate
            </button>

          </div>

        </section>


        {/* ===================================================
            BULK UPLOAD
        =================================================== */}

        <section className="portal-card">

          <div className="card-header">

            <div>

              <span className="section-eyebrow">
                BULK ISSUANCE
              </span>

              <h2>
                Upload Student Records
              </h2>

              <p>
                Create multiple certificates
                from a single CSV file.
              </p>

            </div>

            <button
              className="secondary-button"
              onClick={
                downloadCSVTemplate
              }
            >
              Download Template
            </button>

          </div>


          <div className="bulk-upload-content">

            <div className="csv-upload-area">

              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={
                  handleCSVUpload
                }
              />

              <label
                htmlFor="csv-upload"
                className="csv-upload-label"
              >

                <strong>
                  Select CSV File
                </strong>

                <span>
                  Upload a CSV containing
                  studentName, qualification
                  and issueDate.
                  Use DD/MM/YYYY for the
                  issue date.
                </span>

              </label>

            </div>


            {csvFileName && (

              <div className="csv-file-info">

                <div>

                  <strong>
                    {csvFileName}
                  </strong>

                  <span>
                    {csvRows.length}{" "}
                    record
                    {csvRows.length !==
                    1
                      ? "s"
                      : ""}{" "}
                    loaded
                  </span>

                </div>

                <button
                  className="text-button"
                  onClick={clearCSV}
                >
                  Remove
                </button>

              </div>

            )}


            {csvError && (

              <div className="error-message">
                {csvError}
              </div>

            )}


            {csvRows.length > 0 && (

              <div className="csv-preview">

                <div className="preview-header">

                  <div>

                    <h3>
                      Records Ready
                    </h3>

                    <span>
                      Review the records
                      before issuing.
                    </span>

                  </div>

                  <span>
                    {csvRows.length}{" "}
                    records
                  </span>

                </div>


                <div className="table-wrapper">

                  <table>

                    <thead>

                      <tr>

                        <th>
                          Row
                        </th>

                        <th>
                          Student
                        </th>

                        <th>
                          Qualification
                        </th>

                        <th>
                          Issue Date
                        </th>

                        <th>
                          Status
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {csvRows.map(
                        (row) => (

                          <tr
                            key={
                              row.rowNumber
                            }
                          >

                            <td>
                              {
                                row.rowNumber
                              }
                            </td>

                            <td>
                              {
                                row.studentName
                              }
                            </td>

                            <td>
                              {
                                row.qualification
                              }
                            </td>

                            <td>
                              {
                                row.issueDate
                              }
                            </td>

                            <td>

                              {row.errors
                                ?.length >
                              0 ? (

                                <span className="status-badge status-error">
                                  Invalid
                                </span>

                              ) : (

                                <span className="status-badge status-ready">
                                  Ready
                                </span>

                              )}

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>


                <div className="bulk-actions">

                  <button
                    className="primary-button"
                    onClick={
                      issueBulkCertificates
                    }
                    disabled={
                      bulkIssuing
                    }
                  >
                    {bulkIssuing
                      ? "Processing..."
                      : `Issue ${csvRows.length} Certificates`}
                  </button>

                </div>


                {bulkIssuing && (

                  <div className="progress-section">

                    <div className="progress-label">

                      <span>
                        Processing
                      </span>

                      <strong>
                        {bulkProgress}%
                      </strong>

                    </div>

                    <div className="progress-bar">

                      <div
                        className="progress-fill"
                        style={{
                          width: `${bulkProgress}%`,
                        }}
                      />

                    </div>

                  </div>

                )}


                {bulkResults.length >
                  0 && (

                  <div className="bulk-results">

                    <div className="preview-header">

                      <div>

                        <h3>
                          Issuance Results
                        </h3>

                        <span>
                          Certificate
                          creation
                          results.
                        </span>

                      </div>

                      <button
                        className="secondary-button"
                        onClick={
                          downloadCredentialsCSV
                        }
                      >
                        Download Credentials
                      </button>

                    </div>


                    <div className="table-wrapper">

                      <table>

                        <thead>

                          <tr>

                            <th>
                              Row
                            </th>

                            <th>
                              Student
                            </th>

                            <th>
                              Status
                            </th>

                            <th>
                              Certificate ID
                            </th>

                          </tr>

                        </thead>


                        <tbody>

                          {bulkResults.map(
                            (
                              result,
                              index
                            ) => (

                              <tr
                                key={`${result.rowNumber}-${index}`}
                              >

                                <td>
                                  {
                                    result.rowNumber
                                  }
                                </td>

                                <td>
                                  {
                                    result.studentName
                                  }
                                </td>

                                <td>

                                  {result.success ? (

                                    <span className="status-badge status-valid">
                                      Issued
                                    </span>

                                  ) : (

                                    <span className="status-badge status-error">
                                      Failed
                                    </span>

                                  )}

                                </td>

                                <td>

                                  {result.success
                                    ? result.id
                                    : result.error}

                                </td>

                              </tr>

                            )
                          )}

                        </tbody>

                      </table>

                    </div>

                  </div>

                )}

              </div>

            )}

          </div>

        </section>


        {/* ===================================================
            CERTIFICATE RECORDS
        =================================================== */}

        <section className="portal-card">

          <div className="card-header certificate-management-header">

            <div>

              <span className="section-eyebrow">
                CERTIFICATE RECORDS
              </span>

              <h2>
                Issued Certificates
              </h2>

              <p>
                View certificates currently
                registered on the blockchain.
              </p>

            </div>


            <div className="search-box">

              <input
                type="text"
                placeholder="Search certificates..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
              />

            </div>

          </div>


          {filteredCertificates.length ===
          0 ? (

            <div className="empty-state">

              <h3>
                No certificates found
              </h3>

              <p>
                {certificates.length ===
                0
                  ? "Certificates issued by the institution will appear here."
                  : "No certificates match your search."}
              </p>

            </div>

          ) : (

            <div className="certificate-table-wrapper">

              <table className="certificate-table">

                <thead>

                  <tr>

                    <th>
                      Certificate ID
                    </th>

                    <th>
                      Student
                    </th>

                    <th>
                      Qualification
                    </th>

                    <th>
                      Issue Date
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredCertificates.map(
                    (certificate) => (

                      <tr
                        key={
                          certificate.id
                        }
                      >

                        <td>

                          <span className="certificate-id">
                            {
                              certificate.id
                            }
                          </span>

                        </td>


                        <td>

                          <strong>
                            {
                              certificate.student
                            }
                          </strong>

                        </td>


                        <td>
                          {
                            certificate.qualification
                          }
                        </td>


                        <td>
                          {formatDate(
                            certificate.issueDate
                          )}
                        </td>


                        <td>

                          {certificate.verified ? (

                            <span className="status-badge status-valid">
                              Valid
                            </span>

                          ) : (

                            <span className="status-badge status-revoked">
                              Revoked
                            </span>

                          )}

                        </td>


                        <td>

                          <div className="table-actions">

                            <button
                              className="action-button"
                              onClick={() =>
                                openCredentials(
                                  certificate
                                )
                              }
                            >
                              Credentials
                            </button>


                            {certificate.verified && (

                              <button
                                className="action-button danger"
                                onClick={() =>
                                  confirmRevocation(
                                    certificate.id
                                  )
                                }
                              >
                                Revoke
                              </button>

                            )}

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>


      {/* =====================================================
          CREDENTIAL MODAL
      ===================================================== */}

      {selectedCertificate && (

        <div
          className="modal-overlay"
          onClick={
            closeCredentials
          }
        >

          <div
            className="credentials-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <span className="section-eyebrow">
                  CERTIFICATE CREDENTIALS
                </span>

                <h2>
                  Student Credentials
                </h2>

              </div>

              <button
                className="modal-close"
                onClick={
                  closeCredentials
                }
              >
                ×
              </button>

            </div>


            <div className="credential-details">

              <div className="credential-row">

                <span>
                  Certificate ID
                </span>

                <strong>
                  {
                    selectedCertificate.id
                  }
                </strong>

              </div>


              <div className="credential-row">

                <span>
                  Student
                </span>

                <strong>
                  {
                    selectedCertificate.student
                  }
                </strong>

              </div>


              <div className="credential-row">

                <span>
                  Qualification
                </span>

                <strong>
                  {
                    selectedCertificate.qualification
                  }
                </strong>

              </div>


              <div className="credential-row">

                <span>
                  Issue Date
                </span>

                <strong>
                  {formatDate(
                    selectedCertificate.issueDate
                  )}
                </strong>

              </div>


              <div className="credential-password">

                <span>
                  Student Password
                </span>

                <div className="password-field">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      selectedCertificate.password ||
                      ""
                    }
                    readOnly
                  />

                  <button
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>

            </div>


            <div className="modal-warning">

              Keep the student's
              password secure. It is
              required to access the
              certificate.

            </div>


            <div className="modal-actions">

              <button
                className="secondary-button"
                onClick={
                  closeCredentials
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="institution-footer">

        <div>

          <strong>
            verify.edu.pg
          </strong>

          <span>
            Blockchain-Based Academic
            Certificate Verification
          </span>

        </div>

        <span>
          {institution}
        </span>

      </footer>

    </div>
  );
};

export default InstitutionPortal;