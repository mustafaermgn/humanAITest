import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import CodeAnalyzer from './components/CodeAnalyzer';
import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import HistoryDetail from './components/HistoryDetail';
import './index.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      // Deep navy primary for a cohesive dark UI
      main: '#072146',
      light: '#0b4b7a',
      dark: '#031428',
    },
    secondary: {
      // Teal/cerulean accent for contrast
      main: '#178fad',
      light: '#3fb1c9',
      dark: '#0e5e6d',
    },
    background: {
      default: 'transparent',
      paper: 'rgba(5, 12, 28, 0.84)',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.92)',
      secondary: 'rgba(255, 255, 255, 0.72)',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 700,
      color: 'rgba(255, 255, 255, 0.95)',
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(4, 10, 24, 0.72)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(23, 143, 173, 0.12)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
        contained: {
          boxShadow: `0 6px 20px 0 rgba(7, 33, 70, 0.48)`,
          '&:hover': {
            boxShadow: `0 8px 30px 0 rgba(7, 33, 70, 0.6)`,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            '& fieldset': {
              borderColor: 'rgba(23, 143, 173, 0.12)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(23, 143, 173, 0.22)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#178fad',
            },
          },
        },
      },
    },
  },
});

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="animated-background" />
      <Router>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Navigation onMenuClick={() => setSidebarOpen(true)} />
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          
          <Box
            component="main"
            sx={{
              flex: 1,
              width: '100%',
              maxWidth: '2000px',
              mx: 'auto',
              px: { xs: 2, sm: 3, md: 4, lg: 5 },
              py: { xs: 3, sm: 4, md: 5.5 },
            }}
          >
            <Routes>
              <Route path="/" element={<CodeAnalyzer />} />
              <Route path="/history" element={<CodeAnalyzer />} />
              <Route path="/history/:id" element={<HistoryDetail />} />
            </Routes>
          </Box>
          
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
