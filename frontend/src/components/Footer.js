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
        background: 'linear-gradient(180deg, rgba(3,20,40,0.9) 0%, rgba(6,24,44,0.95) 100%)',
        backdropFilter: 'blur(18px)',
        borderTop: '1px solid rgba(23, 143, 173, 0.12)',
        color: 'rgba(255, 255, 255, 0.85)',
        boxShadow: '0 -6px 30px rgba(7, 33, 70, 0.28)',
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
                  color: '#072146',
                  backgroundColor: 'rgba(7, 33, 70, 0.08)',
                },
              }}
              component={Link}
              href="https://github.com/mustafaermgn/humanAITest"
              target="_blank"
            >
              <GitHubIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
                sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  color: '#178fad',
                  backgroundColor: 'rgba(23, 143, 173, 0.08)',
                },
              }}
              component={Link}
              href="https://www.linkedin.com/in/mustafa-erme%C4%9Fan-162073223/"
              target="_blank"
            >
              <LinkedInIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
                sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  color: '#072146',
                  backgroundColor: 'rgba(7, 33, 70, 0.08)',
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

