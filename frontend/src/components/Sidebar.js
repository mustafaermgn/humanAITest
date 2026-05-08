import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  X, 
  History, 
  Trash2, 
  ExternalLink, 
  Loader2,
  Clock
} from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

const Sidebar = ({ open, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    if (!window.confirm('Tüm geçmişi silmek istediğinize emin misiniz?')) return;
    
    try {
      await axios.post('/api/history/clear');
      setHistory([]);
    } catch (err) {
      setError('Geçmiş temizlenirken hata oluştu');
    }
  };

  const handleItemClick = (id) => {
    onClose();
    navigate(`/history/${id}`);
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Sidebar Content */}
      <div className="fixed inset-y-0 left-0 z-50 h-full w-full max-w-sm border-r bg-background p-6 shadow-lg transition ease-in-out animate-in slide-in-from-left duration-300">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight">Analiz Geçmişi</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto -mx-2 px-2 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="rounded-lg bg-destructive/10 p-4 text-destructive text-sm">
                {error}
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Henüz bir analiz yapılmamış.</p>
              </div>
            ) : (
              history.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className="group relative cursor-pointer rounded-xl border bg-card p-4 transition-all hover:bg-accent hover:border-primary/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDate(item.timestamp)}
                    </div>
                    <Badge variant={item.final_ai_probability > 0.5 ? "destructive" : "secondary"} className="text-[10px] h-4">
                      {item.final_ai_probability > 0.5 ? "AI" : "Human"}
                    </Badge>
                  </div>
                  
                  <p className="text-sm font-medium line-clamp-2 mb-3 text-foreground/90 leading-snug">
                    {item.code}
                  </p>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex gap-2">
                      <span className="text-[10px] font-semibold text-orange-500">
                        AI: {(item.final_ai_probability * 100).toFixed(0)}%
                      </span>
                      <span className="text-[10px] font-semibold text-green-500">
                        H: {(item.final_human_probability * 100).toFixed(0)}%
                      </span>
                    </div>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))
            )}
          </div>

          {history.length > 0 && (
            <div className="pt-6 mt-auto border-t">
              <Button 
                variant="outline" 
                className="w-full border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={handleClearHistory}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Tümünü Temizle
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
