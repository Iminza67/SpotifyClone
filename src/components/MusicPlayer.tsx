import React from "react";
import { Box, Typography, Button } from "@mui/material";

interface MusicPlayerProps {
  currentTrack: { name: string; artist: string } | null;
  isPlaying: boolean;
  onPlayPause: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ currentTrack, isPlaying, onPlayPause }) => {
  return (
    <Box sx={{ backgroundColor: "#282828", padding: 2, textAlign: "center" }}>
      {currentTrack && (
        <Typography variant="body1" sx={{ color: "#ffffff", mb: 2 }}>
          Now Playing: {currentTrack.name} by {currentTrack.artist}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={onPlayPause}
        sx={{
          backgroundColor: "#1DB954",
          color: "#fff",
          borderRadius: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "#1ED760",
          },
        }}
      >
        {isPlaying ? "Pause" : "Play"}
      </Button>
    </Box>
  );
};

export default MusicPlayer;