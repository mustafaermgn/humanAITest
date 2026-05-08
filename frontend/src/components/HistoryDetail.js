import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  Clock, 
  Terminal, 
  BarChart3,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { Progress } from './ui/Progress';

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
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Analiz detayları yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-destructive max-w-md">
          <AlertCircle className="h-6 w-6" />
          <p className="font-medium">{error}</p>
        </div>
        <Button variant="ghost" onClick={() => navigate(-1)} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Geri Dön
        </Button>
      </div>
    );
  }

  if (!entry) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analiz Detayı</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {new Date(entry.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
        <Badge variant={entry.final_ai_probability > 0.5 ? "destructive" : "secondary"} className="text-sm px-3 py-1">
          {entry.final_ai_probability > 0.5 ? "Yapay Zeka" : "İnsan Yapımı"}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Code Content */}
        <Card className="md:col-span-8 bg-muted/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-lg flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                İncelenen Kod
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative rounded-md bg-zinc-950 p-4 border">
              <pre className="max-h-[600px] overflow-auto text-xs font-mono text-zinc-300 leading-relaxed">
                {entry.code}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Results Sidebar */}
        <div className="md:col-span-4 space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analiz Sonuçları
              </CardTitle>
              <CardDescription>Modellerin detaylı olasılık dağılımı.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* AI Probability */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-orange-500">AI Olasılığı</span>
                  <span className="font-bold">{(entry.final_ai_probability * 100).toFixed(1)}%</span>
                </div>
                <Progress value={entry.final_ai_probability * 100} className="h-2 bg-orange-500/10 [&>div]:bg-orange-500" />
              </div>

              {/* Human Probability */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-green-500">İnsan Olasılığı</span>
                  <span className="font-bold">{(entry.final_human_probability * 100).toFixed(1)}%</span>
                </div>
                <Progress value={entry.final_human_probability * 100} className="h-2 bg-green-500/10 [&>div]:bg-green-500" />
              </div>

              <div className="pt-4 border-t space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Model Bazlı Skorlar</h4>
                
                {[
                  { name: 'Random Forest', value: entry.ml_rf_prediction },
                  { name: 'SVM', value: entry.ml_svm_prediction },
                  { name: 'Logistic Regression', value: entry.ml_lr_prediction }
                ].map((model) => (
                  <div key={model.name} className="flex items-center justify-between group">
                    <span className="text-sm text-foreground/80">{model.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{( (model.value || 0) * 100).toFixed(0)}% AI</span>
                      <div className={`h-1.5 w-1.5 rounded-full ${model.value > 0.5 ? 'bg-orange-500' : 'bg-green-500'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HistoryDetail;
