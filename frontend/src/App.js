import "./App.css";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { CompanyProvider } from "./context/CompanyContext";
import Login from "./Pages/Login/Login.js";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer.js";
import Documents from "./Pages/Login/Documents.js";
import LP from "./Pages/Login/LP.js";
import Help from "./Pages/Login/Help.js";
import Header from "./Pages/Login/dashboard for buiness/Header.jsx";
import Sidebar from "./Pages/Login/dashboard for buiness/Sidebar.jsx";
import Main from "./Pages/Login/dashboard for buiness/Main.jsx";
import Dashboard from "./Pages/Login/dashboard for buiness/Dashboard.jsx";
import DisplayCaseDetailsPage from "./Pages/Login/DisplayCaseDetailsPage.js";
import Thanks from "./Pages/Login/Thanks.js";
import Sidebaruser from "./Pages/Login/dashboard for user/Sidebaruser.jsx";
import Mainuser from "./Pages/Login/dashboard for user/Mainuser.jsx";
import Headeruser from "./Pages/Login/dashboard for user/Headeruser.jsx";
import Dashboarduser from "./Pages/Login/dashboard for user/Dashboarduser.jsx";
import Ask from "./Pages/Login/Ask.js";
import LoginB from "./Pages/Login/LoginB.js";
import DashboardB from "./Pages/Login/dashboard for user/DashboardB.js";
import Complaint from "./Pages/Login/dashboard for user/CaseListP.js";
import CaseListP from "./Pages/Login/dashboard for user/CaseListP.js";
import Chat from "./Components/Chat.js";
import TrackingPage from "./Pages/Login/dashboard for user/TrackingPage.jsx";
import ComplainthistoryPage from "./Pages/Login/dashboard for user/complaint history/ComplainthistoryPage.jsx";
import Blog from "./Components/Navbar/Blog.jsx";
import Contactus from "./Components/Navbar/Contactus.jsx";
import ChatEngineComponent from "./Pages/Login/ChatEngine.js";
import CategoryPage from "./Pages/Login/dashboard for buiness/CategoryPage.js";
import ComplaintList from "./Pages/Login/dashboard for buiness/ComplaintList.js";
import Dept from "./Pages/Login/dashboard for buiness/Dept.js";
import Leaderboard from "./Pages/Login/LeaderBoard.js";
function App() {
    return (
        <UserProvider>
            <CompanyProvider>
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/loginb" element={<LoginB />} />
                        <Route
                            path="/dashboardbusiness"
                            element={<Dashboard />}
                        />
                        <Route path="/" element={<LP />} />
                        <Route path="/docs" element={<Documents />} />
                        <Route path="/help" element={<Help />} />
                        <Route
                            path="/case"
                            element={<DisplayCaseDetailsPage />}
                        />
                        <Route path="/thanks" element={<Thanks />} />
                        <Route
                            path="/dashboarduser"
                            element={<Dashboarduser />}
                        />
                        <Route path="/dashb" element={<DashboardB />} />
                        <Route path="/ask" element={<Ask />} />
                        <Route path="/caselists" element={<CaseListP />} />
                        <Route path="/chat" element={<Chat />} />
                        <Route path="/tracking" element={<TrackingPage />} />
                        <Route
                            path="/complaint-history"
                            element={<ComplainthistoryPage />}
                        />
                        <Route path="/Blogs" element={<Blog />} />
                        <Route path="/contact" element={<Contactus />} />
                        <Route
                            path="/chatengine"
                            element={<ChatEngineComponent />}
                        />
                        <Route path="/category" element={<CategoryPage />} />
                        <Route
                            path="/customer-seervice"
                            element={<ComplaintList />}
                        />
                        <Route path="/dept/:index" element={<Dept />} />
                        <Route path="/leaderboard" element={<Leaderboard />} />
                    </Routes>
                    <Footer />
                </BrowserRouter>
            </CompanyProvider>
        </UserProvider>
    );
}

export default App;
