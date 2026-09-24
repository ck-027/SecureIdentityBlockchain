import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Home from "./pages/Home";
import StudentLogin from "./pages/StudentLogin";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import InstitutionLogin from "./pages/InstitutionLogin";
import InstitutionPortal from "./pages/InstitutionPortal";
import CertificateView from "./pages/CertificateView";
import VerificationPage from "./pages/VerificationPage";
import QRScanner from "./pages/QRScanner";


function InstitutionProtectedRoute({ children }) {

    const institutionLoggedIn =
        sessionStorage.getItem("institutionLoggedIn");

    if (institutionLoggedIn !== "true") {
        return (
            <Navigate
                to="/institution-login"
                replace
            />
        );
    }

    return children;
}


function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* MAIN WEBSITE */}
                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/home"
                    element={<Home />}
                />


                {/* STUDENT PORTAL */}
                <Route
                    path="/student-login"
                    element={<StudentLogin />}
                />

                <Route
                    path="/student"
                    element={<StudentDashboard />}
                />


                {/* INSTITUTION PORTAL */}
                <Route
                    path="/institution-login"
                    element={<InstitutionLogin />}
                />

                <Route
                    path="/institution"
                    element={
                        <InstitutionProtectedRoute>
                            <InstitutionPortal />
                        </InstitutionProtectedRoute>
                    }
                />


                {/* ADMIN */}
                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />


                {/* PUBLIC VERIFICATION */}
                <Route
                    path="/verify/:certificateID"
                    element={<VerificationPage />}
                />

                <Route
                    path="/certificate/:certificateID"
                    element={<CertificateView />}
                />

                <Route
                    path="/scan"
                    element={<QRScanner />}
                />


                {/* FALLBACK */}
                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}


export default App;