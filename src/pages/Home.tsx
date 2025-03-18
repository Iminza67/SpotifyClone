import { useEffect, useState } from "react";
import { Box, Container, Grid, Typography, CircularProgress } from "@mui/material";
import Header from "../components/Header";
import PlaylistCard from "../components/PlaylistCard";
import MusicPlayer from "../components/MusicPlayer";

interface Playlist {
  name: string;
  images: { url: string }[];
}

interface Album {
  name: string;
  cover: string;
}

interface Recommendation {
  name: string;
  cover: string;
  artist: string;
}

const Home = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [filterPlaylists, setFilterPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const recommendations: Recommendation[] = [
    { name: "Recommended Album 1", cover: "/path/to/recommended1.jpg", artist: "Artist 1" },
    { name: "Recommended Album 2", cover: "/path/to/recommended2.jpg", artist: "Artist 2" },
  ];

  useEffect(() => {
    setAlbums([
      { name: "Album 1", cover: "/path/to/album1.jpg" },
      { name: "Album 2", cover: "/path/to/album2.jpg" },
      { name: "Album 3", cover: "/path/to/album3.jpg" },
    ]);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("spotify_token");
    if (token) {
      fetchPlaylists(token);
    } else {
      setError("No access token found. Please log in again.");
      setIsLoading(false);
    }
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem("spotify_token");
    window.location.href = "/";
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!playlists.length) return;

    if (query.trim() === "") {
      setFilterPlaylists(playlists);
    } else {
      const filtered = playlists.filter((playlist) =>
        playlist.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilterPlaylists(filtered);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#121212" }}>

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header onLogout={handleLogout} onSearch={handleSearch} />

        <Box sx={{ flex: 1, overflowY: "auto", padding: "80px 16px 16px" }}>
          <Container>
            <Typography variant="h4" sx={{ color: "#ffffff", mb: 4 }}>
              Good Evening
            </Typography>
            <Grid container spacing={4} sx={{ mb: 6 }}>
              {albums.map((album, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <PlaylistCard title={album.name} image={album.cover} />
                </Grid>
              ))}
            </Grid>

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

            <Typography variant="h4" sx={{ color: "#ffffff", mb: 4 }}>
              Your Playlists
            </Typography>
            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography variant="body1" color="error">
                {error}
              </Typography>
            ) : filterPlaylists.length === 0 ? (
              <Typography variant="body1" sx={{ color: "#ffffff", textAlign: "center" }}>
                No playlists found for "{searchQuery}"
              </Typography>
            ) : (
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

        <Box sx={{ position: "fixed", bottom: 0, width: "100%", zIndex: 1100 }}>
          <MusicPlayer />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;