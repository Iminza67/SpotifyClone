import { useEffect, useState } from "react";
import { Box, Container, Grid, Typography, CircularProgress } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import PlaylistCard from "../components/PlaylistCard";
import MusicPlayer from "../components/MusicPlayer";

const Home = () => {
  interface Playlist {
    name: string;
    images: { url: string }[];
  }

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [filterPlaylists, setFilterPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch playlists when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("spotify_token");
    if (token) {
      fetchPlaylists(token);
    } else {
      setError("No access token found. Please log in again.");
      setIsLoading(false);
    }
  }, []);

  // Fetch playlists from Spotify API
  const fetchPlaylists = async (token: string) => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me/playlists", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch playlists");
      }

      const data = await response.json();
      setPlaylists(data.items);
      setFilterPlaylists(data.items);
    } catch (error) {
      setError("Failed to fetch playlists. Please try again.");
      console.error("Error fetching playlists:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("spotify_token");
    window.location.href = "/";
  };

  // Handle search input
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!playlists.length) return;

    // Filter playlists based on search query
    if (query.trim() === "") {
      setFilterPlaylists(playlists);
    } else {
      const filtered = playlists.filter((playlist) =>
        playlist.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilterPlaylists(filtered);
    }
  };

  // Static data for albums and recommendations
  const albums = [
    {
      name: "Daily Mix 1",
      cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=96&h=96&fit=crop",
    },
    {
      name: "This is Daft Punk",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=96&h=96&fit=crop",
    },
    {
      name: "Electronic Beats",
      cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=96&h=96&fit=crop",
    },
    {
      name: "Chill Out Mix",
      cover: "https://images.unsplash.com/photo-1446057032654-9d8885db76c6?w=96&h=96&fit=crop",
    },
    {
      name: "Deep Focus",
      cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=96&h=96&fit=crop",
    },
    {
      name: "Summer Hits",
      cover: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=96&h=96&fit=crop",
    },
  ];

  const recommendations = [
    {
      name: "Daily Mix 1",
      artist: "Spotify",
      cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
    },
    {
      name: "Discover Weekly",
      artist: "Spotify",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    },
    {
      name: "Release Radar",
      artist: "Spotify",
      cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop",
    },
    {
      name: "Your Top Songs 2023",
      artist: "Spotify",
      cover: "https://images.unsplash.com/photo-1446057032654-9d8885db76c6?w=300&h=300&fit=crop",
    },
    {
      name: "Time Capsule",
      artist: "Spotify",
      cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
    },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#121212" }}>
      {/* Sidebar */}
      <Box sx={{ width: 240, flexShrink: 0, backgroundColor: "#000000", zIndex: 1200 }}>
        <Sidebar />
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Fixed Header */}
        <Header onLogout={handleLogout} onSearch={handleSearch} />

        {/* Scrollable Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            padding: "80px 16px 16px", // Adjusted padding to account for the fixed header
          }}
        >
          <Container>
            {/* Good Evening Section */}
            <Typography variant="h4" sx={{ color: "#ffffff", mb: 4 }}>
              Good Evening
            </Typography>
            <Grid container spacing={4} sx={{ mb: 6 }}>
              {albums.map((album, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <PlaylistCard
                    title={album.name}
                    image={album.cover}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Made for You Section */}
            <Typography variant="h4" sx={{ color: "#ffffff", mb: 4 }}>
              Made for You
            </Typography>
            <Grid container spacing={4} sx={{ mb: 6 }}>
              {recommendations.map((album, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <PlaylistCard
                    title={album.name}
                    image={album.cover}
                    subtitle={album.artist}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Your Playlists Section */}
            <Typography variant="h4" sx={{ color: "#ffffff", mb: 4 }}>
              Your Playlists
            </Typography>
            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              // Error Message
              <Typography variant="body1" color="error">
                {error}
              </Typography>
            ) : filterPlaylists.length === 0 ? (
              // No search results message
              <Typography variant="body1" sx={{ color: "#ffffff", textAlign: "center" }}>
                No playlists found for "{searchQuery}"
              </Typography>
            ) : (
              // Playlist Grid
              <Grid container spacing={4}>
                {filterPlaylists.map((playlist, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <PlaylistCard
                      title={playlist.name}
                      image={playlist.images[0]?.url || "/path/to/default-image.jpg"}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Container>
        </Box>

        {/* Music Player - Stays Fixed at Bottom */}
        <Box sx={{ position: "fixed", bottom: 0, width: "100%", zIndex: 1100 }}>
          <MusicPlayer />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;