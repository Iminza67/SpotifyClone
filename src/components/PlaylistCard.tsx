import React from 'react';
import { Card, CardMedia, CardContent, Typography, Skeleton } from '@mui/material';

interface PlaylistCardProps {
  title: string;
  image: string;
  subtitle?: string;
  onClick?: () => void;
  isLoading?: boolean;
  sx?: React.CSSProperties;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({
  title,
  image,
  subtitle,
  onClick,
  isLoading = false,
  sx,
}) => {
  return (
    <Card
      sx={{
        maxWidth: 200,
        width: '100%',
        backgroundColor: '#181818',
        color: '#ffffff',
        borderRadius: '8px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
          cursor: onClick ? 'pointer' : 'default',
        },
        ...sx,
      }}
      onClick={onClick}
      aria-label={isLoading ? 'Loading playlist card' : `Playlist: ${title}`}
      tabIndex={0}
      role="button"
    >
      {isLoading ? (
        <Skeleton variant="rectangular" height={140} animation="wave" />
      ) : (
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt={`Playlist cover for ${title}`}
          sx={{ borderRadius: '8px 8px 0 0' }}
        />
      )}
      <CardContent sx={{ padding: '16px', '&:last-child': { paddingBottom: '16px' } }}>
        {isLoading ? (
          <>
            <Skeleton variant="text" width="80%" height={24} animation="wave" />
            <Skeleton variant="text" width="60%" height={18} animation="wave" />
          </>
        ) : (
          <>
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: subtitle ? '4px' : 0 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                {subtitle}
              </Typography>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PlaylistCard;