import React from 'react';
import { Box, Typography, Container, Link, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 4,
        px: 2,
        background: 'linear-gradient(180deg, rgba(30, 30, 70, 0.9) 0%, rgba(40, 40, 90, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(59, 130, 246, 0.4)',
        color: 'rgba(255, 255, 255, 0.8)',
        boxShadow: '0 -4px 24px rgba(59, 130, 246, 0.2)',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            © {new Date().getFullYear()} AI Kod Tespit Uygulaması. Tüm hakları saklıdır.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Bize ulaşın:
            </Typography>
            <IconButton
              size="small"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  color: '#3b82f6',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                },
              }}
              component={Link}
              href="https://github.com"
              target="_blank"
            >
              <GitHubIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  color: '#48cae4',
                  backgroundColor: 'rgba(72, 202, 228, 0.1)',
                },
              }}
              component={Link}
              href="https://linkedin.com"
              target="_blank"
            >
              <LinkedInIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  color: '#3b82f6',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                },
              }}
              component={Link}
              href="mailto:contact@example.com"
            >
              <EmailIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
      </Container>
    </Box>
  );
};

export default Footer;

