import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useWeb3 } from "../web3/Web3Context";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { isConnected, account, formatAddress, connect, disconnect, isInstalled } = useWeb3();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleWalletConnect = async () => {
    if (isConnected) {
      disconnect();
    } else {
      await connect();
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">SecureChain</div>

      <div className="nav-links">
        {user && (
          <>
            <Link to="/"> Dashboard</Link>
            
            {user.role === "admin" && (
              <>
                <Link to="/add"> Add Block</Link>
                <Link to="/users"> Users</Link>
              </>
            )}
            
            {(user.role === "admin" || user.role === "auditor") && (
              <Link to="/verify"> Verify Chain</Link>
            )}
            
            <Link to="/risk"> Risk Monitor</Link>
            <Link to="/analytics"> Analytics</Link>
          </>
        )}
      </div>

      <div className="auth-section">
        {/* Wallet Connection Button */}
        {isInstalled ? (
          <button 
            className={`wallet-btn ${isConnected ? "connected" : ""}`}
            onClick={handleWalletConnect}
            title={isConnected ? "Click to disconnect wallet" : "Click to connect MetaMask"}
          >
            {isConnected ? (
              <>
                <span className="wallet-icon">🔗</span>
                {formatAddress(account)}
              </>
            ) : (
              <>
                <span className="wallet-icon">🦊</span>
                Connect Wallet
              </>
            )}
          </button>
        ) : (
          <div style={{ fontSize: "12px", color: "#ccc", marginRight: "8px" }}>
            MetaMask required for blockchain updates.
          </div>
        )}

        {user ? (
          <>
            <span className="role-badge">
              {user.username} <strong>[{user.role.toUpperCase()}]</strong>
            </span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="login-btn">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;