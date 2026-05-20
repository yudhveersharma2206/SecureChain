import React, { useState, useContext, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { blockchainAPI } from "../api/apiClient";
function AddBlock() {
  const { user } = useContext(AuthContext);

  const [action, setAction] = useState("");
  const [blockUser, setBlockUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const containerRef = useRef(null);



  const setupScrollAnimations = () => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("scroll-animate-in");
        }
      });
    });

    const elements = containerRef.current.querySelectorAll(".scroll-animate, .card");
    elements.forEach((el) => observer.observe(el));
  };

  useEffect(() => {
    setTimeout(setupScrollAnimations, 100);
  }, []);

  // ✅ FIXED FUNCTION with proper error handling
  const handleAddBlock = async (e) => {
    e.preventDefault();

    if (!action || !blockUser) {
      setError("All fields required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      // ✅ STEP 1: Backend → get hash
      const apiResponse = await blockchainAPI.addLog(action, blockUser);

      if (!apiResponse.success) {
        throw new Error(apiResponse.data?.message || "Backend failed");
      }

      // ✅ Extract hash from corrected response structure
      const hash = apiResponse.data?.data?.hash || apiResponse.data?.hash;
      const txHash = apiResponse.data?.data?.txHash;

      if (!hash) {
        throw new Error("No hash returned from backend");
      }

      // ✅ STEP 3: Save to Supabase
      setMessage(`✅ Block added successfully`);

      // Reset form
      setAction("");
      setBlockUser("");

    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="container" ref={containerRef}>
        <div className="card scroll-animate" style={{ color: "red" }}>
          <h2>Access Denied</h2>
          <p>Only administrators can add blocks.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" ref={containerRef}>
      <h2>Add New Block</h2>

      <div className="card scroll-animate">
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <form onSubmit={handleAddBlock}>
          <label>Action : </label>
          <input
            type="text"
            placeholder="USER_LOGIN, FILE_ACCESS"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            disabled={loading}
          />

          <label>   User : </label>
          <input
            type="text"
            placeholder="john_doe"
            value={blockUser}
            onChange={(e) => setBlockUser(e.target.value)}
            disabled={loading}
          />

          <button type="submit" disabled={loading} className="btn-primary">
            {loading && message.includes("MetaMask") ? "⏳ Confirm in MetaMask..." : 
            loading && message.includes("too busy") ? "⏱️ Retrying..." :
            loading ? "⛏️ Mining..." : "Add Block"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddBlock;