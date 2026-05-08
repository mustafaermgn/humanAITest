import React, { useState } from 'react';
import axios from 'axios';
import { 
  Copy, 
  PlusCircle, 
  Terminal, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Bot,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/Card';
import { Textarea } from './ui/Textarea';
import { Badge } from './ui/Badge';
import { Progress } from './ui/Progress';

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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kod Analizi</h1>
          <p className="text-muted-foreground">
            Yapay zeka tarafından üretilmiş kodları tespit edin.
          </p>
        </div>
        {!showInput && (
          <Button onClick={handleNewChat} className="shrink-0">
            <PlusCircle className="mr-2 h-4 w-4" />
            Yeni Analiz
          </Button>
        )}
      </div>

      {showInput ? (
        <Card className="border-2 border-dashed border-muted bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Kaynak Kod
            </CardTitle>
            <CardDescription>
              Analiz etmek istediğiniz kodu aşağıya yapıştırın.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="import React from 'react';..."
              className="min-h-[300px] font-mono text-sm leading-relaxed"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            <p className="text-xs text-muted-foreground">
              Desteklenen diller: Python, JavaScript, Java, C++, Go ve daha fazlası.
            </p>
            <Button onClick={handleAnalyze} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analiz Ediliyor
                </>
              ) : (
                <>
                  Analiz Et
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : null}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {results && (
        <div className="grid gap-6 md:grid-cols-12 lg:gap-8">
          {/* Main Results Column */}
          <div className="space-y-6 md:col-span-7">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Analiz Edilen Kod</CardTitle>
                <Button variant="ghost" size="sm" onClick={handleCopyCode}>
                  {copyStatus ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="ml-2">{copyStatus || 'Kopyala'}</span>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="relative rounded-md bg-muted/50 p-4">
                  <pre className="max-h-[500px] overflow-auto text-xs font-mono text-foreground/90">
                    {code}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Column */}
          <div className="space-y-6 md:col-span-5">
            {/* Final Prediction */}
            <Card className="overflow-hidden border-2 border-primary/20">
              <div className="bg-primary/5 p-6 pb-0">
                <CardTitle className="text-xl">Sonuç Özeti</CardTitle>
                <CardDescription>
                  Tüm modellerden elde edilen ağırlıklı ortalama.
                </CardDescription>
              </div>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-medium">
                      <Bot className="h-4 w-4 text-orange-500" />
                      Yapay Zeka
                    </div>
                    <span className="text-lg font-bold text-orange-500">
                      {(results.predictions.final.ai_probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={results.predictions.final.ai_probability * 100} 
                    className="h-3 bg-orange-500/10 [&>div]:bg-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-medium">
                      <User className="h-4 w-4 text-green-500" />
                      İnsan
                    </div>
                    <span className="text-lg font-bold text-green-500">
                      {(results.predictions.final.human_probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={results.predictions.final.human_probability * 100} 
                    className="h-3 bg-green-500/10 [&>div]:bg-green-500"
                  />
                </div>

                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-sm font-medium">
                    Tahmin: {' '}
                    <Badge variant={(results.predictions.final.prediction === 'AI' || results.predictions.final.ai_probability > 0.5) ? 'destructive' : 'secondary'} className="ml-1">
                      {(results.predictions.final.prediction === 'AI' || results.predictions.final.ai_probability > 0.5) ? 'Yapay Zeka' : 'İnsan Yapımı'}
                    </Badge>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Model Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Model Detayları</CardTitle>
                <CardDescription>
                  Kullanılan farklı ML modellerinin tahminleri.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {Object.entries(results.predictions.ml_models).map(([name, data]) => (
                  <div key={name} className="flex items-center justify-between space-x-4">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none capitalize">{name.replace('_', ' ')}</p>
                      <p className="text-xs text-muted-foreground">
                        {(data.prediction === 'AI' || data.ai_probability > 0.5) ? 'AI Tespit Edildi' : 'İnsan Belirlendi'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-sm font-bold">
                          {(Math.max(data.ai_probability, data.human_probability) * 100).toFixed(0)}%
                        </p>
                      </div>
                      <div className={`h-2 w-2 rounded-full ${(data.prediction === 'AI' || data.ai_probability > 0.5) ? 'bg-orange-500' : 'bg-green-500'}`} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeAnalyzer;
