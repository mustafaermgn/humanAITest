import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Sidebar = ({ open, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openClearDialog, setOpenClearDialog] = useState(false);
  const [clearing, setClearing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      fetchHistory();
    }
  }, [open]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('/api/history');
      setHistory(response.data.history);
    } catch (err) {
      setError('Geçmiş yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id, navigateToPage = false) => {
    if (navigateToPage) {
      onClose();
      navigate(`/history/${id}`);
      return;
    }

    try {
      const response = await axios.get(`/api/history/${id}`);
      setSelectedItem(response.data.entry);
    } catch (err) {
      setError('Detaylar yüklenemedi');
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Az önce';
    if (minutes < 60) return `${minutes} dk önce`;
    if (hours < 24) return `${hours} sa önce`;
    if (days < 7) return `${days} gün önce`;
    return date.toLocaleDateString();
  };

  const handleClearHistory = async () => {
    setClearing(true);
    try {
      await axios.post('/api/history/clear');
      setHistory([]);
      setSelectedItem(null);
      setOpenClearDialog(false);
    } catch (err) {
      setError('Geçmiş temizlenirken hata oluştu');
    } finally {
      setClearing(false);
    }
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
          '& .MuiDrawer-paper': {
          width: { xs: '85%', sm: 420 },
          backgroundColor: 'rgba(6, 12, 28, 0.98)',
          backdropFilter: 'blur(30px)',
          borderRight: '1px solid rgba(23, 143, 173, 0.08)',
          color: 'rgba(255, 255, 255, 0.92)',
          boxShadow: '4px 0 28px rgba(7, 33, 70, 0.26)',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(23, 143, 173, 0.06)',
            background: 'linear-gradient(135deg, rgba(7, 33, 70, 0.06) 0%, transparent 100%)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <HistoryIcon sx={{ color: '#072146', fontSize: 28 }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #072146 0%, #178fad 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Analiz Geçmişi
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                color: '#072146',
                backgroundColor: 'rgba(7, 33, 70, 0.06)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#072146' }} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : history.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <HistoryIcon sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Analiz geçmişi bulunamadı.
                <br />
                Sonuçları görmek için kod analizi yapın.
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {history.map((item, index) => (
                <React.Fragment key={item.id}>
                  <ListItem
                    disablePadding
                    sx={{
                      mb: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(7, 33, 70, 0.06)',
                        borderRadius: 1,
                      },
                    }}
                  >
                    <ListItemButton
                      onClick={() => handleViewDetails(item.id, true)}
                      sx={{
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        py: 2,
                        px: 2.5,
                        borderRadius: 2,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(7, 33, 70, 0.06)',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          {formatDate(item.timestamp)}
                        </Typography>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.5)',
                              '&:hover': {
                                color: '#072146',
                              },
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(item.id, true);
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          mb: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          width: '100%',
                        }}
                      >
                        {item.code}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                        <Chip
                          label={`AI ${(item.final_ai_probability * 100).toFixed(0)}%`}
                          size="small"
                          sx={{
                          backgroundColor: 'rgba(23, 143, 173, 0.12)',
                          color: '#178fad',
                          border: '1px solid rgba(23, 143, 173, 0.22)',
                            fontSize: '0.7rem',
                            height: 24,
                          }}
                        />
                        <Chip
                          label={`Human ${(item.final_human_probability * 100).toFixed(0)}%`}
                          size="small"
                          sx={{
                          backgroundColor: 'rgba(63, 177, 201, 0.12)',
                          color: '#3fb1c9',
                          border: '1px solid rgba(63, 177, 201, 0.22)',
                            fontSize: '0.7rem',
                            height: 24,
                          }}
                        />
                      </Box>
                    </ListItemButton>
                  </ListItem>
                  {index < history.length - 1 && (
                    <Divider sx={{ borderColor: 'rgba(23, 143, 173, 0.06)', my: 0.5 }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>

        {/* Selected Item Details */}
        {selectedItem && (
            <Paper
            sx={{
              m: 2,
              p: 2,
              backgroundColor: 'rgba(7, 33, 70, 0.06)',
              border: '1px solid rgba(23, 143, 173, 0.12)',
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle2" gutterBottom sx={{ color: '#072146', mb: 1 }}>
              Detaylı Analiz
            </Typography>
            <Box sx={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Random Forest:</strong> AI{' '}
                {((selectedItem.ml_rf_prediction || 0) * 100).toFixed(1)}% | Human{' '}
                {((1 - (selectedItem.ml_rf_prediction || 0)) * 100).toFixed(1)}%
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>SVM:</strong> AI{' '}
                {((selectedItem.ml_svm_prediction || 0) * 100).toFixed(1)}% | Human{' '}
                {((1 - (selectedItem.ml_svm_prediction || 0)) * 100).toFixed(1)}%
              </Typography>
              <Typography variant="body2">
                <strong>Logistic Regression:</strong> AI{' '}
                {((selectedItem.ml_lr_prediction || 0) * 100).toFixed(1)}% | Human{' '}
                {((1 - (selectedItem.ml_lr_prediction || 0)) * 100).toFixed(1)}%
              </Typography>
            </Box>
          </Paper>
        )}

        {/* Clear History Button */}
        {history.length > 0 && (
          <Box sx={{ p: 2, borderTop: '1px solid rgba(23, 143, 173, 0.06)' }}>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setOpenClearDialog(true)}
              sx={{
                borderColor: 'rgba(244, 67, 54, 0.5)',
                color: 'rgba(244, 67, 54, 0.9)',
                '&:hover': {
                  backgroundColor: 'rgba(244, 67, 54, 0.08)',
                  borderColor: 'rgba(244, 67, 54, 0.8)',
                },
              }}
            >
              Tümünü Temizle
            </Button>
          </Box>
        )}

        {/* Clear History Dialog */}
        <Dialog
          open={openClearDialog}
          onClose={() => setOpenClearDialog(false)}
          PaperProps={{
            sx: {
              backgroundColor: 'rgba(6, 12, 28, 0.98)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(23, 143, 173, 0.12)',
            },
          }}
        >
          <DialogTitle sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Geçmiş Temizle
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Tüm analiz geçmişini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button
              onClick={() => setOpenClearDialog(false)}
              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              İptal
            </Button>
            <Button
              onClick={handleClearHistory}
              disabled={clearing}
              variant="contained"
              color="error"
              sx={{
                background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)',
                },
              }}
            >
              {clearing ? 'Temizleniyor...' : 'Evet, Temizle'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Drawer>
  );
};

export default Sidebar;

