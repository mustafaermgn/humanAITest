import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
} from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import axios from 'axios';

const CodeAnalyzer = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Lütfen analiz edilecek kod girin');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await axios.post('/api/analyze', { code });
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Analiz sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography 
        variant="h2" 
        component="h1" 
        gutterBottom
        sx={{
          fontWeight: 800,
          fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
          textAlign: 'center',
          color: '#000000',
          mb: 3,
          letterSpacing: '0.05em',
          textShadow: '0 2px 10px rgba(255, 255, 255, 0.5)',
        }}
      >
        Kodunu Kim Yazdı?{' '}
        <Box component="span" sx={{ color: '#ff9800' }}>Yapay Zeka mı</Box>
        {', '}
        <Box component="span" sx={{ color: '#48cae4' }}>İnsan mı?</Box>
      </Typography>
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          mb: 3,
          background: 'rgba(30, 30, 70, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: 3,
        }}
      >
        <TextField
          fullWidth
          multiline
          rows={14}
          variant="outlined"
          label="Kod Girin"
          placeholder="Kodunuzu buraya yapıştırın..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          sx={{ 
            mb: 3,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'rgba(255, 255, 255, 0.9)',
              fontFamily: 'monospace',
              fontSize: '0.95rem',
              '& fieldset': {
                borderColor: 'rgba(59, 130, 246, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(59, 130, 246, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#3b82f6',
                borderWidth: 2,
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#3b82f6',
            },
          }}
        />
        <Button
          variant="contained"
          size="large"
          onClick={handleAnalyze}
          disabled={loading || !code.trim()}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          fullWidth
          sx={{
            py: 1.5,
            background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
            color: 'white',
            fontWeight: 600,
            fontSize: '1rem',
            textTransform: 'none',
            borderRadius: 2,
            boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
              boxShadow: '0 6px 20px 0 rgba(59, 130, 246, 0.6)',
              transform: 'translateY(-2px)',
            },
            '&:disabled': {
              background: 'rgba(59, 130, 246, 0.3)',
              color: 'rgba(255, 255, 255, 0.5)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {loading ? 'Analiz Ediliyor...' : 'Kodu Analiz Et'}
        </Button>
      </Paper>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            background: 'rgba(211, 47, 47, 0.1)',
            border: '1px solid rgba(211, 47, 47, 0.3)',
            color: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 2,
            '& .MuiAlert-icon': {
              color: '#f44336',
            },
          }}
        >
          {error}
        </Alert>
      )}

      {results && (
        <Box>
          {/* Final Results */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              mb: 3,
              background: 'rgba(30, 30, 70, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 152, 0, 0.3)',
              borderRadius: 3,
            }}
          >
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.9)',
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              Ortalama Tahmin
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.15) 0%, rgba(255, 152, 0, 0.05) 100%)',
                    border: '1px solid rgba(255, 152, 0, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(255, 152, 0, 0.4)',
                    },
                  }}
                >
                  <CardContent>
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      sx={{
                        color: '#ff9800',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      AI Olasılığı
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={results.predictions.final.ai_probability * 100}
                        sx={{
                          height: 32,
                          borderRadius: 2,
                          backgroundColor: 'rgba(255, 152, 0, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(90deg, #ff9800 0%, #ff6f00 100%)',
                            borderRadius: 2,
                          },
                        }}
                      />
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          mt: 2,
                          background: 'linear-gradient(135deg, #ff9800 0%, #ff6f00 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          fontWeight: 700,
                        }}
                      >
                        {(results.predictions.final.ai_probability * 100).toFixed(2)}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, rgba(72, 202, 228, 0.15) 0%, rgba(72, 202, 228, 0.05) 100%)',
                    border: '1px solid rgba(72, 202, 228, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(72, 202, 228, 0.4)',
                    },
                  }}
                >
                  <CardContent>
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      sx={{
                        color: '#90e0ef',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      İnsan Olasılığı
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={results.predictions.final.human_probability * 100}
                        sx={{
                          height: 32,
                          borderRadius: 2,
                          backgroundColor: 'rgba(72, 202, 228, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(90deg, #48cae4 0%, #90e0ef 100%)',
                            borderRadius: 2,
                          },
                        }}
                      />
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          mt: 2,
                          background: 'linear-gradient(135deg, #48cae4 0%, #90e0ef 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          fontWeight: 700,
                        }}
                      >
                        {(results.predictions.final.human_probability * 100).toFixed(2)}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          {/* ML Models Results */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              mb: 3,
              background: 'rgba(30, 30, 70, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 152, 0, 0.3)',
              borderRadius: 3,
            }}
          >
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.9)',
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              Modellerimiz
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {Object.entries(results.predictions.ml_models).map(([key, value], index) => (
                <Grid item xs={12} sm={6} md={4} key={key}>
                  <Card
                    sx={{
                      background: 'rgba(26, 0, 51, 0.6)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        borderColor: 'rgba(59, 130, 246, 0.5)',
                        boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
                      },
                    }}
                  >
                    <CardContent>
                      <Typography 
                        variant="h6" 
                        gutterBottom
                        sx={{
                          fontWeight: 600,
                          color: 'rgba(255, 255, 255, 0.9)',
                          textTransform: 'capitalize',
                        }}
                      >
                        {key.replace('_', ' ')}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, gap: 1 }}>
                          <Chip
                            label={`AI: ${(value.ai_probability * 100).toFixed(1)}%`}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(255, 152, 0, 0.2)',
                              color: '#ff9800',
                              border: '1px solid rgba(255, 152, 0, 0.5)',
                              fontWeight: 600,
                            }}
                          />
                          <Chip
                            label={`Human: ${(value.human_probability * 100).toFixed(1)}%`}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(72, 202, 228, 0.2)',
                              color: '#90e0ef',
                              border: '1px solid rgba(72, 202, 228, 0.5)',
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                        <Box sx={{ mb: 1.5 }}>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 0.5, display: 'block' }}>
                            AI Olasılığı
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={value.ai_probability * 100}
                            sx={{
                              height: 10,
                              borderRadius: 1,
                              backgroundColor: 'rgba(255, 152, 0, 0.1)',
                              '& .MuiLinearProgress-bar': {
                                background: 'linear-gradient(90deg, #ff9800 0%, #ff6f00 100%)',
                                borderRadius: 1,
                              },
                            }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 0.5, display: 'block' }}>
                            İnsan Olasılığı
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={value.human_probability * 100}
                            sx={{
                              height: 10,
                              borderRadius: 1,
                              backgroundColor: 'rgba(72, 202, 228, 0.1)',
                              '& .MuiLinearProgress-bar': {
                                background: 'linear-gradient(90deg, #48cae4 0%, #90e0ef 100%)',
                                borderRadius: 1,
                              },
                            }}
                          />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Pie Chart Visualization */}
          {results && results.predictions && results.predictions.final && (
            <Paper 
              elevation={0}
              sx={{ 
                p: 4,
                background: 'rgba(30, 30, 70, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 152, 0, 0.3)',
                borderRadius: 3,
              }}
            >
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.9)',
                  mb: 3,
                  textAlign: 'center',
                }}
              >
                Dağılım Grafiği
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <PieChart
                  series={[
                    {
                      data: [
                        {
                          id: 0,
                          value: parseFloat((results.predictions.final.ai_probability * 100).toFixed(1)),
                          label: `AI: ${(results.predictions.final.ai_probability * 100).toFixed(1)}%`,
                          color: '#ff9800',
                        },
                        {
                          id: 1,
                          value: parseFloat((results.predictions.final.human_probability * 100).toFixed(1)),
                          label: `İnsan: ${(results.predictions.final.human_probability * 100).toFixed(1)}%`,
                          color: '#48cae4',
                        },
                      ],
                      innerRadius: 60,
                      outerRadius: 120,
                      paddingAngle: 5,
                      cornerRadius: 5,
                      startAngle: -90,
                      endAngle: 270,
                      cx: 150,
                      cy: 150,
                    },
                  ]}
                  width={400}
                  height={400}
                  slotProps={{
                    legend: {
                      direction: 'row',
                      position: { vertical: 'bottom', horizontal: 'middle' },
                      padding: 0,
                      labelStyle: {
                        fill: 'rgba(255, 255, 255, 0.9)',
                        fontSize: 14,
                      },
                    },
                  }}
                />
              </Box>
            </Paper>
          )}
        </Box>
      )}
    </Box>
  );
};

export default CodeAnalyzer;

