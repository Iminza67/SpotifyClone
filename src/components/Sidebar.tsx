import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
  IconButton,
  Box,
} from '@mui/material';
import {
  Home as HomeIcon,
  Search as SearchIcon,
  LibraryMusic as LibraryIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  PlaylistPlay as PlaylistIcon,
} from '@mui/icons-material';

const Sidebar = () => {
  const [isPlaylistsOpen, setIsPlaylistsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('Home');

  const handlePlaylistsClick = () => {
    setIsPlaylistsOpen(!isPlaylistsOpen);
  };

  const handleListItemClick = (item: string) => {
    setSelectedItem(item);
  };

  return (
    <Box
      sx={{
        width: 240,
        backgroundColor: '#000000',
        color: '#ffffff',
        height: '100vh',
        padding: 2,
      }}
    >
      <List>
        {/* Home */}
        <ListItem
          button
          selected={selectedItem === 'Home'}
          onClick={() => handleListItemClick('Home')}
          sx={{
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: '#282828',
            },
            '&.Mui-selected': {
              backgroundColor: '#282828',
            },
          }}
        >
          <ListItemIcon sx={{ color: '#ffffff' }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>

        {/* Search */}
        <ListItem
          button
          selected={selectedItem === 'Search'}
          onClick={() => handleListItemClick('Search')}
          sx={{
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: '#282828',
            },
            '&.Mui-selected': {
              backgroundColor: '#282828',
            },
          }}
        >
          <ListItemIcon sx={{ color: '#ffffff' }}>
            <SearchIcon />
          </ListItemIcon>
          <ListItemText primary="Search" />
        </ListItem>

        {/* Your Library */}
        <ListItem
          button
          selected={selectedItem === 'Library'}
          onClick={() => handleListItemClick('Library')}
          sx={{
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: '#282828',
            },
            '&.Mui-selected': {
              backgroundColor: '#282828',
            },
          }}
        >
          <ListItemIcon sx={{ color: '#ffffff' }}>
            <LibraryIcon />
          </ListItemIcon>
          <ListItemText primary="Your Library" />
        </ListItem>
      </List>

      <Divider sx={{ backgroundColor: '#282828', my: 2 }} />

      {/* Playlists Section */}
      <List>
        <ListItem button onClick={handlePlaylistsClick}>
          <ListItemIcon sx={{ color: '#ffffff' }}>
            <PlaylistIcon />
          </ListItemIcon>
          <ListItemText primary="Playlists" />
          {isPlaylistsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItem>

        {/* Collapsible Playlist Items */}
        <Collapse in={isPlaylistsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              sx={{ pl: 4, borderRadius: '4px', '&:hover': { backgroundColor: '#282828' } }}
            >
              <ListItemText primary="Chill Hits" />
            </ListItem>
            <ListItem
              button
              sx={{ pl: 4, borderRadius: '4px', '&:hover': { backgroundColor: '#282828' } }}
            >
              <ListItemText primary="Top 50 Global" />
            </ListItem>
            <ListItem
              button
              sx={{ pl: 4, borderRadius: '4px', '&:hover': { backgroundColor: '#282828' } }}
            >
              <ListItemText primary="Workout Mix" />
            </ListItem>
          </List>
        </Collapse>
      </List>
    </Box>
  );
};

export default Sidebar;