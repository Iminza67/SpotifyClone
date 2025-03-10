// src/services/spotifyAPI.ts
import axios from 'axios';

const API_BASE_URL = 'https://api.spotify.com/v1';

export const fetchPlaylists = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/me/playlists`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const searchTracks = async (token: string, query: string) => {
  const response = await axios.get(`${API_BASE_URL}/search`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      q: query,
      type: 'track',
    },
  });
  return response.data;
};