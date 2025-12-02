import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Chip,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

const HistoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await axios.get(`/api/history/${id}`);
        setEntry(res.data.entry);
      } catch (err) {
        setError('Analiz verisi yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress sx={{ color: '#072146' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!entry) {
    return null;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: 'rgba(3,20,40,0.9)' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 700, background: 'linear-gradient(180deg, rgba(3,20,40,0.9) 0%, rgba(6,24,44,0.95) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Analiz Detayı
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', ml: 1, background: 'linear-gradient(180deg, rgba(3,20,40,0.9) 0%, rgba(6,24,44,0.95) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {new Date(entry.timestamp).toLocaleString()}
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700 }}>
          İncelenen Kod
        </Typography>
        <Box component="pre" sx={{
          p: 2,
          backgroundColor: 'rgba(0,0,0,0.6)',
          borderRadius: 1,
          whiteSpace: 'pre-wrap',
          fontFamily: 'Roboto Mono, monospace',
          fontSize: '0.9rem',
          color: 'rgba(255,255,255,0.9)'
        }}>
          {entry.code}
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700 }}>
          Analiz Sonuçları
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip label={`AI ${(entry.final_ai_probability * 100).toFixed(1)}%`} color="primary" />
          <Chip label={`Human ${(entry.final_human_probability * 100).toFixed(1)}%`} sx={{ backgroundColor: 'rgba(72,202,228,0.15)', color: '#90e0ef' }} />
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Random Forest:</strong> AI {( (entry.ml_rf_prediction || 0) * 100).toFixed(2)}% | Human {( (1 - (entry.ml_rf_prediction || 0)) * 100).toFixed(2)}%
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>SVM:</strong> AI {( (entry.ml_svm_prediction || 0) * 100).toFixed(2)}% | Human {( (1 - (entry.ml_svm_prediction || 0)) * 100).toFixed(2)}%
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Logistic Regression:</strong> AI {( (entry.ml_lr_prediction || 0) * 100).toFixed(2)}% | Human {( (1 - (entry.ml_lr_prediction || 0)) * 100).toFixed(2)}%
          </Typography>
        </Box>

      </Paper>
    </Box>
  );
};

export default HistoryDetail;
