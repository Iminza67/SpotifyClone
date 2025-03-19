import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const accessToken = new URLSearchParams(hash.substring(1)).get("access_token");
      if (accessToken) {
        localStorage.setItem("spotify_token", accessToken);
        window.location.hash = ""; // Clear URL hash
        navigate("/home"); // Redirect to home
      } else {
        navigate("/"); // Redirect to login if no token found
      }
    }
  }, [navigate]);

  return (
    <div style={styles.container as React.CSSProperties}>
      <h1 style={styles.heading}>Logging you in...</h1>
      <p style={styles.text}>Please wait while we process your Spotify login.</p>
      <div style={styles.loader}></div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    textAlign: "center" as const,
  },
  heading: {
    fontSize: "24px",
    marginBottom: "10px",
  },
  text: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "20px",
  },
  loader: {
    width: "50px",
    height: "50px",
    border: "5px solid rgba(0, 0, 0, 0.1)",
    borderTopColor: "#1DB954",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

// Adding keyframes for the loader animation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);

export default Callback;
