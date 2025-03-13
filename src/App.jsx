import { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import companyLogo from "./assets/image.png"; // Ensure the image is in src/assets/

const API_URL = "http://localhost:5000/api"; // ✅ Local backend URL

function App() {
  const [coupon, setCoupon] = useState(null);
  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkCooldown();
  }, []);

  const checkCooldown = async () => {
    try {
      const res = await axios.get(`${API_URL}/cooldown`, { withCredentials: true });
      if (res.data.timeRemaining) {
        setCooldown(res.data.timeRemaining);
      }
    } catch (error) {
      console.error("Error fetching cooldown:", error);
    }
  };

  const claimCoupon = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/claim`, {}, { withCredentials: true });
      setCoupon(res.data.coupon);
      setMessage(res.data.message);
      setCooldown(res.data.timeRemaining);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error claiming coupon.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <img src={companyLogo} alt="Company Logo" className="company-logo" />

      <div className="coupon-section">
        <h1>🎟️ Claim Your Coupon</h1>
        <p className="subtext">Exclusive discount – 1 for every hour</p>

        {coupon ? (
          <div className="coupon-box">
            <h2>🎉 Congratulations! 🎉</h2>
            <p className="coupon-text">You've unlocked an exclusive discount!</p>
            <div className="coupon-code">
              <span>✨ {coupon} ✨</span>
            </div>
            <p className="valid-text">🔥 Use this code at checkout before it expires!</p>
          </div>
        ) : (
          <p className="instruction-text">Click below to claim your coupon!</p>
        )}

        {message && <p className="message">{message}</p>}

        {cooldown ? (
          <button className="btn disabled" disabled>
            ⏳ Wait {cooldown} min
          </button>
        ) : (
          <button className="btn" onClick={claimCoupon} disabled={isLoading}>
            {isLoading ? "Processing..." : "Claim Coupon 🎁"}
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
