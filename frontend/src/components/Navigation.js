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
        background: 'linear-gradient(180deg, rgba(30, 30, 70, 0.9) 0%, rgba(40, 40, 90, 0.85) 100%)',
        backdropFilter: 'blur(30px)',
        borderBottom: '1px solid rgba(59, 130, 246, 0.4)',
        boxShadow: '0 4px 24px rgba(59, 130, 246, 0.2)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
        
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
