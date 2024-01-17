import "./App.css";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Login from "./Pages/Login/Login.js";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer.js";
// import { UserProvider } from "./context/UserContext";
import Documents from "./Pages/Login/Documents.js";
import LP from "./Pages/Login/LP.js";
import Help from "./Pages/Login/Help.js";

function App() {
    return (
        <UserProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<LP />} />
                    <Route path="/docs" element={<Documents />} />
                    <Route path="/help" element={<Help />} />
                </Routes>
                <Footer />
            </BrowserRouter>
        </UserProvider>
    );
}

export default App;
