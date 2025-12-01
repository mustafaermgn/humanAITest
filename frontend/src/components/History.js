import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('/api/history');
      setHistory(response.data.history);
    } catch (err) {
      setError('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await axios.get(`/api/history/${id}`);
      setSelectedItem(response.data.entry);
    } catch (err) {
      setError('Failed to load details');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Analysis History
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        View your previous code analysis results and predictions from all models.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3 }}>
        {history.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
            No analysis history found. Start analyzing code to see results here.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Code Preview</TableCell>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>AI Probability</TableCell>
                  <TableCell>Human Probability</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {item.code}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(item.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${(item.final_ai_probability * 100).toFixed(1)}%`}
                        color="error"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${(item.final_human_probability * 100).toFixed(1)}%`}
                        color="success"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(item.id)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {selectedItem && (
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Detailed Analysis - ID: {selectedItem.id}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              ML Models:
            </Typography>
            <Box sx={{ ml: 2, mb: 2 }}>
              <Typography variant="body2">
                Random Forest: AI {((selectedItem.ml_rf_prediction || 0) * 100).toFixed(1)}% | 
                Human {((1 - (selectedItem.ml_rf_prediction || 0)) * 100).toFixed(1)}%
              </Typography>
              <Typography variant="body2">
                SVM: AI {((selectedItem.ml_svm_prediction || 0) * 100).toFixed(1)}% | 
                Human {((1 - (selectedItem.ml_svm_prediction || 0)) * 100).toFixed(1)}%
              </Typography>
              <Typography variant="body2">
                Neural Network: AI {((selectedItem.ml_nn_prediction || 0) * 100).toFixed(1)}% | 
                Human {((1 - (selectedItem.ml_nn_prediction || 0)) * 100).toFixed(1)}%
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default History;

