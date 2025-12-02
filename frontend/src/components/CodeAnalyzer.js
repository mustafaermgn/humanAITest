import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Alert,
  IconButton,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { PieChart } from '@mui/x-charts/PieChart';
import axios from 'axios';

const CodeAnalyzer = () => {
  const [code, setCode] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [showInput, setShowInput] = useState(true);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Lütfen analiz etmek için kod girin.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/analyze', { code });
      setResults(response.data);
      setShowInput(false);
    } catch (err) {
      setError('Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyStatus('Kopyalandı!');
      setTimeout(() => setCopyStatus(''), 2000);
    } catch (err) {
      console.error('Kopya hatası:', err);
    }
  };

  const handleNewChat = () => {
    setCode('');
    setResults(null);
    setError('');
    setShowInput(true);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: 'auto', pb: 8 }}>
      {showInput && (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3, md: 3.5 },
            background: 'rgba(4, 10, 24, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(23, 143, 173, 0.12)',
            borderRadius: 3,
            mb: 3,
          }}
        >
          <TextField
            fullWidth
            multiline
            rows={6}
            placeholder="Analiz etmek istediğiniz kodu buraya yapıştırın..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#050505',
                color: 'rgba(255,255,255,0.9)',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                '& fieldset': { borderColor: 'rgba(23, 143, 173, 0.2)' },
                '&:hover fieldset': {
                  borderColor: 'rgba(23, 143, 173, 0.4)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(23, 143, 173, 0.6)',
                },
              },
              '& .MuiOutlinedInput-input::placeholder': {
                color: 'rgba(255,255,255,0.4)',
                opacity: 1,
              },
            }}
          />
          <Box sx={{ display: 'flex', gap: 2, mt: 2.5 }}>
            <Button
              variant="contained"
              onClick={handleAnalyze}
              disabled={loading}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                px: 3.5,
                background: 'linear-gradient(135deg, #178fad 0%, #3fb1c9 100%)',
                color: '#020617',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0e5e6d 0%, #178fad 100%)',
                },
                '&:disabled': {
                  opacity: 0.6,
                },
              }}
            >
              {loading ? 'Analiz Ediliyor...' : 'Analiz Et'}
            </Button>
          </Box>
        </Paper>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {results && (
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              position: 'fixed',
              top: { xs: 72, sm: 80 },
              right: { xs: 16, sm: 24, md: 32 },
              zIndex: 20,
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={handleNewChat}
              startIcon={<AddCircleOutlineIcon />}
              sx={{
                borderRadius: 999,
                fontWeight: 700,
                textTransform: 'none',
                px: { xs: 2.5, sm: 3.5 },
                py: 1,
                boxShadow: '0 6px 20px rgba(23,143,173,0.18)',
                background: 'linear-gradient(135deg, #178fad 0%, #3fb1c9 100%)',
                color: '#020617',
                letterSpacing: 0.4,
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #0e5e6d 0%, #178fad 100%)',
                  boxShadow: '0 10px 30px rgba(23,143,173,0.28)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.22s ease',
              }}
            >
              Yeni Kod
            </Button>
          </Box>

          <Grid container spacing={3.5} alignItems="stretch">
            <Grid item xs={12} md={7.5}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  height: '100%',
                  minHeight: { md: 520 },
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(4, 10, 24, 0.6)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 3,
                  border: '1px solid rgba(23, 143, 173, 0.08)',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: 600,
                    }}
                  >
                    Analiz Edilen Kod
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {copyStatus && (
                      <Typography
                        variant="caption"
                        sx={{ color: 'rgba(255,255,255,0.7)' }}
                      >
                        {copyStatus}
                      </Typography>
                    )}
                    <IconButton
                      size="small"
                      onClick={handleCopyCode}
                      sx={{
                        color: 'rgba(255,255,255,0.9)',
                        borderRadius: 1,
                        border: '1px solid rgba(255,255,255,0.08)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.02)',
                        },
                      }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Box
                  component="pre"
                  sx={{
                    flex: 1,
                    m: 0,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: '#050505',
                    color: 'rgba(255,255,255,0.9)',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    overflow: 'auto',
                    maxHeight: 520,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {code}
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4.5}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  height: '100%',
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 4 },
                    background: 'rgba(4, 10, 24, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(23, 143, 173, 0.08)',
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.9)',
                      mb: 2.5,
                    }}
                  >
                    Ortalama Tahmin
                  </Typography>

                  <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid item xs={12}>
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          background:
                            'linear-gradient(135deg, rgba(255, 152, 0, 0.12) 0%, rgba(255, 152, 0, 0.04) 100%)',
                          border: '1px solid rgba(255, 152, 0, 0.16)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow:
                              '0 8px 24px rgba(255, 152, 0, 0.18)',
                          },
                        }}
                      >
                        <CardContent sx={{ pb: 2.5 }}>
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
                          <Box sx={{ mt: 1.5 }}>
                            <LinearProgress
                              variant="determinate"
                              value={
                                results.predictions.final.ai_probability * 100
                              }
                              sx={{
                                height: 22,
                                borderRadius: 2,
                                backgroundColor:
                                  'rgba(255, 152, 0, 0.06)',
                                '& .MuiLinearProgress-bar': {
                                  background:
                                    'linear-gradient(90deg, #ff9800 0%, #ff6f00 100%)',
                                  borderRadius: 2,
                                },
                              }}
                            />
                            <Typography
                              variant="h4"
                              sx={{
                                mt: 1.8,
                                background:
                                  'linear-gradient(135deg, #ff9800 0%, #ff6f00 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 700,
                              }}
                            >
                              {(
                                results.predictions.final.ai_probability * 100
                              ).toFixed(2)}
                              %
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12}>
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          background:
                            'linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0.04) 100%)',
                          border: '1px solid rgba(34, 197, 94, 0.16)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow:
                              '0 8px 24px rgba(34, 197, 94, 0.18)',
                          },
                        }}
                      >
                        <CardContent sx={{ pb: 2.5 }}>
                          <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                              color: '#22c55e',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            İnsan Olasılığı
                          </Typography>
                          <Box sx={{ mt: 1.5 }}>
                            <LinearProgress
                              variant="determinate"
                              value={
                                results.predictions.final
                                  .human_probability * 100
                              }
                              sx={{
                                height: 22,
                                borderRadius: 2,
                                backgroundColor:
                                  'rgba(34, 197, 94, 0.06)',
                                '& .MuiLinearProgress-bar': {
                                  background:
                                    'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)',
                                  borderRadius: 2,
                                },
                              }}
                            />
                            <Typography
                              variant="h4"
                              sx={{
                                mt: 1.8,
                                background:
                                  'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 700,
                              }}
                            >
                              {(
                                results.predictions.final
                                  .human_probability * 100
                              ).toFixed(2)}
                              %
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 4 },
                    background: 'rgba(4, 10, 24, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(23, 143, 173, 0.08)',
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.9)',
                      mb: 2.5,
                    }}
                  >
                    Modellerimiz
                  </Typography>

                  <Grid
                    container
                    spacing={2.5}
                    sx={{ mt: 0.5, alignItems: 'stretch' }}
                  >
                    {Object.entries(results.predictions.ml_models).map(
                      ([key, value]) => (
                        <Grid item xs={12} sm={6} md={4} key={key}>
                          <Card
                            sx={{
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              background: 'rgba(6, 12, 28, 0.85)',
                              border: '1px solid rgba(255, 152, 0, 0.12)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                borderColor:
                                  'rgba(255, 152, 0, 0.22)',
                                boxShadow:
                                  '0 10px 30px rgba(255, 152, 0, 0.18)',
                              },
                            }}
                          >
                            <CardContent sx={{ pb: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                              <Typography
                                variant="subtitle1"
                                gutterBottom
                                sx={{
                                  fontWeight: 600,
                                  color: 'rgba(255,255,255,0.95)',
                                  textTransform: 'capitalize',
                                  mb: 1.5,
                                }}
                              >
                                {key.replace('_', ' ')}
                              </Typography>

                              <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                                <Chip
                                  label={`AI: ${(
                                    value.ai_probability * 100
                                  ).toFixed(1)}%`}
                                  size="small"
                                  sx={{
                                    backgroundColor:
                                      'rgba(255, 152, 0, 0.15)',
                                    color: '#ff9800',
                                    border:
                                      '1px solid rgba(255, 152, 0, 0.3)',
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                  }}
                                />
                                <Chip
                                  label={`Human: ${(
                                    value.human_probability * 100
                                  ).toFixed(1)}%`}
                                  size="small"
                                  sx={{
                                    backgroundColor:
                                      'rgba(34, 197, 94, 0.15)',
                                    color: '#22c55e',
                                    border:
                                      '1px solid rgba(34, 197, 94, 0.3)',
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                  }}
                                />
                              </Box>

                              <Box sx={{ mb: 1.2, flex: 1 }}>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: 'rgba(255,255,255,0.7)',
                                    mb: 0.6,
                                    display: 'block',
                                    fontSize: '0.7rem',
                                  }}
                                >
                                  AI Olasılığı: {(value.ai_probability * 100).toFixed(1)}%
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={
                                    value.ai_probability * 100
                                  }
                                  sx={{
                                    height: 8,
                                    borderRadius: 1,
                                    backgroundColor:
                                      'rgba(255, 152, 0, 0.1)',
                                    '& .MuiLinearProgress-bar': {
                                      background:
                                        'linear-gradient(90deg, #ff9800 0%, #ff6f00 100%)',
                                      borderRadius: 1,
                                    },
                                  }}
                                />
                              </Box>

                              <Box>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: 'rgba(255,255,255,0.7)',
                                    mb: 0.6,
                                    display: 'block',
                                    fontSize: '0.7rem',
                                  }}
                                >
                                  Human Olasılığı: {(value.human_probability * 100).toFixed(1)}%
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={
                                    value.human_probability * 100
                                  }
                                  sx={{
                                    height: 8,
                                    borderRadius: 1,
                                    backgroundColor:
                                      'rgba(34, 197, 94, 0.1)',
                                    '& .MuiLinearProgress-bar': {
                                      background:
                                        'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)',
                                      borderRadius: 1,
                                    },
                                  }}
                                />
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      )
                    )}
                  </Grid>
                </Paper>
              </Box>
            </Grid>
          </Grid>

          {results &&
            results.predictions &&
            results.predictions.final && (
              <Box sx={{ mt: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 4 },
                    background: 'rgba(4, 10, 24, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(23, 143, 173, 0.08)',
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.9)',
                      mb: 3,
                      textAlign: 'center',
                    }}
                  >
                    Dağılım Grafiği
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: 320,
                    }}
                  >
                    <PieChart
                      series={[
                        {
                          data: [
                            {
                              id: 0,
                              value: parseFloat(
                                (
                                  results.predictions.final
                                    .ai_probability * 100
                                ).toFixed(1)
                              ),
                              label: `AI: ${(
                                results.predictions.final
                                  .ai_probability * 100
                              ).toFixed(1)}%`,
                              color: '#ff9800',
                            },
                            {
                              id: 1,
                              value: parseFloat(
                                (
                                  results.predictions.final
                                    .human_probability * 100
                                ).toFixed(1)
                              ),
                              label: `İnsan: ${(
                                results.predictions.final
                                  .human_probability * 100
                              ).toFixed(1)}%`,
                              color: '#22c55e',
                            },
                          ],
                          innerRadius: 70,
                          outerRadius: 125,
                          paddingAngle: 5,
                          cornerRadius: 5,
                          startAngle: -90,
                          endAngle: 270,
                        },
                      ]}
                      width={380}
                      height={320}
                      slotProps={{
                        legend: {
                          direction: 'row',
                          position: {
                            vertical: 'bottom',
                            horizontal: 'middle',
                          },
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
              </Box>
            )}
        </Box>
      )}
    </Box>
  );
};

export default CodeAnalyzer;

