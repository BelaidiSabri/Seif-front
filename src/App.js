import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import NavBar from "./component/dash-client/NavBar";
import Sidebar from "./component/dash-client/SideBar";
import Login from "./component/dash-client/Login";
import Accueil from "./component/dash-client/Accueil";
// import Offer from "./component/dash-client/Offer";
import Profil from "./component/dash-client/Profil";
import Livre from "./component/dash-client/Livre";
import Tarif from "./component/dash-client/Tarif";
// import NouveauOffre from "./component/dash-client/NouveauOffre";
import { Modal } from "react-bootstrap";
import Dashboard from "./component/dash-client/Dashboard";
import Chat from "./component/dash-client/chat/Chat";
import Communité from "./component/dash-client/Communité";
import Contact from "./component/dash-client/Contact";
import Homee from "./component/front-site/Homee";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";
import socketIO from "socket.io-client";
import "./App.css";
import Payment from "./component/dash-client/Payment";
// import ProductsPage from "./component/dash-client/ProductPage";
import ProductDetails from "./component/dash-client/ProductDetails";
import Cart from "./component/dash-client/Cart";
import { CartProvider } from "./contexts/CartContext";
import OfferManagement from "./component/dash-client/MyOffer";
import AdminPanel from "./component/dash-client/adminPanel";
import ForgotPassword from "./component/dash-client/ForgotPassword";
import ResetPassword from "./component/dash-client/ResetPassword";
import CartPage from "./component/dash-client/CartPage";
import ProductExchange from "./component/dash-client/ProductExchange";
import { NotificationProvider } from "./contexts/NotificationContext";
import ProductsPage from "./component/dash-client/productPage/ProductPage";
import ProductDonation from "./component/dash-client/ProductDonation";
import Test from "./component/dash-client/Test";
import BuyerPurchaseHistory from "./component/dash-client/BuyerPurchaseHistory";
import SellerHistory from "./component/dash-client/SellerHistory";



const AppContent = ({ socket, token }) => {
  const location = useLocation();

  const contentStyle =
    location.pathname === "/Chat"
      ? {
          marginLeft: "250px",
          padding: "0 80px 0 0",
          backgroundColor: "#EFF6FE",
        }
      : { marginLeft: "250px", padding: "0 80px" };

  return (
    <div>
      {token ? (
        <>
          <Sidebar />
          <NotificationProvider>
          <NavBar />
          </NotificationProvider>
          <div id="content" style={contentStyle}>
            <Routes>
              <Route path="/Livre" element={<Livre />} />
              {/* <Route path="/Products" element={<ProductsPage />} /> */}
              <Route path="/Products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              {/* <Route path="/Offer" element={<Offer />} /> */}
              <Route path="/Offer" element={<OfferManagement />} />
              {/* <Route path="/Cart" element={<Cart />} /> */}
              <Route path="/Cart" element={<CartPage />} />
              <Route path="/Profil" element={<Profil />} />
              <Route path="/Tarif" element={<Tarif />} />
              <Route path="/Payment" element={<Payment />} />
              {/* <Route path="/NouveauOffre" element={<NouveauOffre />} /> */}
              <Route path="/Modal" element={<Modal />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/Accueil" element={<Accueil />} />
              <Route path="/Chat" element={<Chat socket={socket} />} />
              <Route path="/Communité" element={<Communité />} />
              <Route path="/Contact" element={<Contact />} />
              <Route path="/exchange" element={<ProductExchange />} />
              <Route path="/don" element={<ProductDonation />} />
              <Route path="/test" element={<Test />} />
              <Route path="/history" element={<BuyerPurchaseHistory />} />
              <Route path="/ordre" element={<SellerHistory />} />
            </Routes>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/admin" element={<AdminPanel />}></Route>
          <Route path="/" element={<Homee />} />
          <Route path="/login" element={<Login socket={socket} />} />  
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/user/reset-password/:token"
            element={<ResetPassword />}
          />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      )}
    </div>
  );
};

const App = () => {
  const token = Cookies.get("token");
  const socket = socketIO.connect("http://localhost:5000");

  return (
    <Router>
      <CartProvider>
        <AppContent token={token} socket={socket} />
      </CartProvider>
    </Router>
  );
};

export default App;
