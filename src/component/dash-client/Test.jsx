import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const baseURL = "http://localhost:5000";
const token = Cookies.get("token");

const Test = () => {
  const [result, setResult] = useState("");

  const handleAction = async (actionType) => {
    let endpoint = "";
    switch (actionType) {
      case "notifications":
        endpoint = "/notifications/delete-all";
        break;
      case "exchanges":
        endpoint = "/exchange";
        break;
      case "donations":
        endpoint = "/donation";
        break;
      case "products":
        endpoint = "/product/delete-all";
        break;
      case "users":
        endpoint = "/user/delete-all"; // New endpoint for deleting all users
        break;
      default:
        return;
    }

    try {
      await axios.delete(`${baseURL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setResult(`${actionType.charAt(0).toUpperCase() + actionType.slice(1)} deleted successfully.`);
    } catch (error) {
      console.error(error);
      setResult(`Failed to delete ${actionType}. Please try again.`);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Test Component</h2>
      <div>
        <button onClick={() => handleAction("notifications")}>
          Delete All Notifications
        </button>
        <button onClick={() => handleAction("exchanges")}>
          Delete All Exchanges
        </button>
        <button onClick={() => handleAction("donations")}>
          Delete All Donations
        </button>
        <button onClick={() => handleAction("products")}>
          Delete All Products
        </button>
        <button onClick={() => handleAction("users")}> {/* New button for deleting all users */}
          Delete All Users
        </button>
      </div>
      {result && (
        <div style={{ marginTop: "20px", color: "blue" }}>
          <strong>Result:</strong> {result}
        </div>
      )}
    </div>
  );
};

export default Test;
