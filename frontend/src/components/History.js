import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Clock, 
  AlertCircle, 
  Loader2,
  ChevronRight
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Geçmiş yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analiz Geçmişi</h1>
        <p className="text-muted-foreground">
          Daha önce yaptığınız analizleri görüntüleyin ve detayları inceleyin.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {history.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground/20 mb-4" />
            <h3 className="text-lg font-medium">Henüz bir kayıt yok</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Analiz yapmak için ana sayfaya gidin ve kodunuzu yapıştırın.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/')}>
              Analiz Başlat
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {history.map((item) => (
            <Card key={item.id} className="group hover:border-primary/50 transition-colors">
              <CardContent className="p-0">
                <div 
                  className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 cursor-pointer"
                  onClick={() => navigate(`/history/${item.id}`)}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Clock className="h-3 w-3" />
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                    <p className="text-sm font-mono line-clamp-1 text-foreground/80 max-w-2xl">
                      {item.code}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-6 mt-4 md:mt-0">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-muted-foreground uppercase">AI</span>
                        <span className="text-sm font-bold text-orange-500">
                          {(item.final_ai_probability * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-muted-foreground uppercase">İnsan</span>
                        <span className="text-sm font-bold text-green-500">
                          {(item.final_human_probability * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    
                    <Badge variant={item.final_ai_probability > 0.5 ? "destructive" : "secondary"}>
                      {item.final_ai_probability > 0.5 ? "AI" : "İnsan"}
                    </Badge>
                    
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
