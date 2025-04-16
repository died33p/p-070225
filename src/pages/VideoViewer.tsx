
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Square, Film, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VideoViewer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trainingHours, setTrainingHours] = useState<string>("1");
  const { toast } = useToast();

  const handleStartTraining = () => {
    if (!trainingHours || Number(trainingHours) <= 0) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, укажите корректное количество часов",
        variant: "destructive",
      });
      return;
    }

    setIsPlaying(true);
    toast({
      title: "Обучение запущено",
      description: `Запущено на ${trainingHours} ч.`,
    });
  };

  const handleStopTraining = () => {
    setIsPlaying(false);
    toast({
      title: "Обучение прервано",
      description: "Видеопоток остановлен",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Просмотр</h1>

      <Tabs defaultValue="viewing" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="viewing" className="flex items-center gap-2">
            <Film className="h-4 w-4" />
            <span>Просмотр</span>
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Обучение</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="viewing" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Просмотр видеопотока</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Video stream container */}
              <div className="bg-slate-900 aspect-video rounded-md flex items-center justify-center">
                <div className="text-white text-center">
                  <Film className="h-16 w-16 mx-auto mb-2 opacity-50" />
                  <p className="text-sm opacity-70">Видеопоток с бэкенда</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Обучение</CardTitle>
            </CardHeader>
            <CardContent>
              {!isPlaying ? (
                <div className="space-y-4">
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <label htmlFor="training-hours" className="text-sm font-medium mb-2 block">
                        Количество часов обучения
                      </label>
                      <Input
                        id="training-hours"
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={trainingHours}
                        onChange={(e) => setTrainingHours(e.target.value)}
                        className="max-w-xs"
                      />
                    </div>
                    <Button onClick={handleStartTraining} className="flex items-center gap-2">
                      <Play className="h-4 w-4" />
                      Запустить
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Video stream container */}
                  <div className="bg-slate-900 aspect-video rounded-md flex items-center justify-center">
                    <div className="text-white text-center">
                      <Film className="h-16 w-16 mx-auto mb-2 opacity-50 animate-pulse" />
                      <p className="text-sm opacity-70">Обучающий видеопоток</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="destructive" 
                    onClick={handleStopTraining} 
                    className="flex items-center gap-2"
                  >
                    <Square className="h-4 w-4" />
                    Прервать
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VideoViewer;
