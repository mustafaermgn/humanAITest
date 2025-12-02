import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import MenuIcon from '@mui/icons-material/Menu';

const Navigation = ({ onMenuClick }) => {
  const location = useLocation();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'linear-gradient(180deg, rgba(3,20,40,0.9) 0%, rgba(6,24,44,0.95) 100%)',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(23, 143, 173, 0.12)',
        boxShadow: '0 4px 24px rgba(7, 33, 70, 0.28)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'center', position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', position: 'absolute', left: 0 }}>
          <IconButton
            onClick={onMenuClick}
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: 'rgba(255, 255, 255, 0.95)',
            fontSize: { xs: '1.1rem', sm: '1.3rem' },
          }}
        >
          Kod Analiz Aracı
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
