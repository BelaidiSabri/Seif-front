import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import NavBar from "./component/dash-client/NavBar";
import Sidebar from "./component/dash-client/SideBar";
import Login from "./component/dash-client/Login";
import Accueil from "./component/dash-client/Accueil";
import Offer from "./component/dash-client/Offer";
import Profil from "./component/dash-client/Profil";
import Livre from "./component/dash-client/Livre";
import Tarif from "./component/dash-client/Tarif";
import NouveauOffre from "./component/dash-client/NouveauOffre";
import { Modal } from "react-bootstrap";
import Dashboard from "./component/dash-client/Dashboard";
import Chat from "./component/dash-client/chat/Chat";
import Communité from "./component/dash-client/Communité";
import Contact from "./component/dash-client/Contact";
import Homee from "./component/front-site/Homee";
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';
import socketIO from "socket.io-client";
import "./App.css";
import Payment from "./component/dash-client/Payment";

const AppContent = ({ socket, token }) => {
  const location = useLocation();  // Get the current location

  // Apply different styles for Chat
  const contentStyle = location.pathname === '/Chat'
    ? { marginLeft: "250px", padding: "0 80px 0 0", backgroundColor: "#EFF6FE" }
    : { marginLeft: "250px", padding: "0 80px" };

  return (
    <div>
      {token ? (
        <>
          <Sidebar />
          <NavBar />
          <div id="content" style={contentStyle}>
            <Routes>
              <Route path="/Livre" element={<Livre />} />
              <Route path="/Offer" element={<Offer />} />
              <Route path="/Profil" element={<Profil />} />
              <Route path="/Tarif" element={<Tarif />} />
              <Route path="/Payment" element={<Payment />} />
              <Route path="/NouveauOffre" element={<NouveauOffre />} />
              <Route path="/Modal" element={<Modal />} />
              <Route path="/" element={<Dashboard />} />
          {/* <Route path="/FilAcceuil" element={<FilAcceuil/>}/> */}
              <Route path="/Accueil" element={<Accueil />} />
              <Route path="/Chat" element={<Chat socket={socket} />} />
              <Route path="/Communité" element={<Communité />} />
              <Route path="/Contact" element={<Contact />} />
            </Routes>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Homee />} />
          <Route path="/login" element={<Login socket={socket} />} />
        </Routes>
      )}
    </div>
  );
};

const App = () => {
  const token = Cookies.get('token');
  const socket = socketIO.connect("http://localhost:5000");

  return (
    <Router>
      <AppContent token={token} socket={socket} />
    </Router>
  );
};

export default App;

