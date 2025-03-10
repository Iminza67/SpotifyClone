import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, TextField } from "@mui/material";

interface HeaderProps {
  onLogout: () => void;
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout, onSearch }) => {
  return (
    <AppBar
      position="sticky"
      sx={{
        background: "linear-gradient(90deg, #1DB954, #121212)",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
        padding: "5px 0",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
        }}
      >
        {/* App Title */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#ffffff",
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          My Music Player
        </Typography>

        {/* Search Bar */}
        <TextField
          variant="outlined"
          placeholder="Search Playlists..."
          onChange={(e) => onSearch(e.target.value)}
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            input: { padding: "8px 10px" },
            width: "200px",
          }}
        />

        {/* Logout Button */}
        <Button
          variant="contained"
          onClick={onLogout}
          sx={{
            backgroundColor: "#ffffff",
            color: "#121212",
            fontWeight: "bold",
            borderRadius: "20px",
            padding: "8px 20px",
            textTransform: "none",
            fontSize: "14px",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              backgroundColor: "#1DB954",
              color: "#ffffff",
              transform: "scale(1.05)",
            },
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
