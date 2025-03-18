import axios from 'axios';
import axiosRetry from 'axios-retry';

const API_BASE_URL = process.env.REACT_APP_SPOTIFY_API_BASE_URL || 'https://api.spotify.com/v1';

const spotifyAPI = axios.create({
  baseURL: API_BASE_URL,
});

axiosRetry(spotifyAPI, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return error.response?.status === 429; // Retry on rate limit errors
  },
});

interface PlaylistResponse {
  items: Playlist[];
}

interface Playlist {
  name: string;
  images: { url: string }[];
}

interface TrackSearchResponse {
  tracks: {
    items: Track[];
  };
}

interface Track {
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
}

export const fetchPlaylists = async (token: string, limit: number = 20, offset: number = 0): Promise<PlaylistResponse> => {
  try {
    const response = await spotifyAPI.get('/me/playlists', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        limit,
        offset,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching playlists:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error?.message || "Failed to fetch playlists");
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};

export const searchTracks = async (token: string, query: string): Promise<TrackSearchResponse> => {
  try {
    const response = await spotifyAPI.get('/search', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: query,
        type: 'track',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error searching tracks:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error?.message || "Failed to search tracks");
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};