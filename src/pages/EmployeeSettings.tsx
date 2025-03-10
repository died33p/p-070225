
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings, Clock, Plus, Trash2, Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BreakSetting {
  id: string;
  name: string;
  duration: number;
  frequency: string;
  isEditing?: boolean;
}

const EmployeeSettings = () => {
  const { toast } = useToast();
  const [breakTime, setBreakTime] = useState("1");
  const [breakSettings, setBreakSettings] = useState<BreakSetting[]>([
    { id: "1", name: "Обед", duration: 40, frequency: "daily" },
    { id: "2", name: "Перекур", duration: 5, frequency: "hourly" }
  ]);
  
  const [newBreak, setNewBreak] = useState<BreakSetting>({
    id: "",
    name: "",
    duration: 0,
    frequency: "daily"
  });

  const [isAddingBreak, setIsAddingBreak] = useState(false);

  const frequencyOptions = [
    { value: "hourly", label: "Раз в час" },
    { value: "daily", label: "Раз в день" },
    { value: "weekly", label: "Раз в неделю" }
  ];

  const getFrequencyLabel = (value: string) => {
    return frequencyOptions.find(option => option.value === value)?.label || value;
  };

  const handleSaveBreakTime = () => {
    toast({
      title: "Настройки сохранены",
      description: `Время перерыва установлено: ${breakTime} ч.`,
    });
  };

  const handleAddBreak = () => {
    setIsAddingBreak(true);
    setNewBreak({
      id: `break-${Date.now()}`,
      name: "",
      duration: 0,
      frequency: "daily"
    });
  };

  const handleCancelAddBreak = () => {
    setIsAddingBreak(false);
  };

  const handleSaveNewBreak = () => {
    if (!newBreak.name || newBreak.duration <= 0) {
      toast({
        title: "Ошибка",
        description: "Все поля обязательны для заполнения",
        variant: "destructive"
      });
      return;
    }
    
    setBreakSettings([...breakSettings, newBreak]);
    setIsAddingBreak(false);
    toast({
      title: "Перерыв добавлен",
      description: `Новый перерыв "${newBreak.name}" успешно добавлен`
    });
  };

  const handleEditBreak = (id: string) => {
    setBreakSettings(
      breakSettings.map(breakItem => 
        breakItem.id === id 
          ? { ...breakItem, isEditing: true } 
          : breakItem
      )
    );
  };

  const handleCancelEdit = (id: string) => {
    setBreakSettings(
      breakSettings.map(breakItem => 
        breakItem.id === id 
          ? { ...breakItem, isEditing: false } 
          : breakItem
      )
    );
  };

  const handleSaveEdit = (id: string) => {
    setBreakSettings(
      breakSettings.map(breakItem => 
        breakItem.id === id 
          ? { ...breakItem, isEditing: false } 
          : breakItem
      )
    );
    
    toast({
      title: "Перерыв обновлен",
      description: `Настройки перерыва успешно обновлены`
    });
  };

  const handleUpdateBreakField = (id: string, field: string, value: string | number) => {
    setBreakSettings(
      breakSettings.map(breakItem => 
        breakItem.id === id 
          ? { ...breakItem, [field]: value } 
          : breakItem
      )
    );
  };

  const handleUpdateNewBreakField = (field: string, value: string | number) => {
    setNewBreak({
      ...newBreak,
      [field]: value
    });
  };

  const handleDeleteBreak = (id: string) => {
    setBreakSettings(breakSettings.filter(breakItem => breakItem.id !== id));
    toast({
      title: "Перерыв удален",
      description: `Перерыв успешно удален из расписания`
    });
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">Настройки учета времени</h1>
        <p className="text-secondary-foreground">Управление нормами рабочего времени и перерывами</p>
      </header>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Настройки перерывов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Общее время регламентированных перерывов (часов в день)
              </label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  value={breakTime}
                  onChange={(e) => setBreakTime(e.target.value)}
                  min="0"
                  max="4"
                  step="0.25"
                />
                <Button onClick={handleSaveBreakTime}>Сохранить</Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Это время будет автоматически учитываться для всех сотрудников
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="font-medium text-blue-700">Текущие настройки перерывов</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Стандартное время перерывов:</span>
                  <span className="font-medium">{breakTime} час / день</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Применяется ко всем сотрудникам</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Настраиваемые перерывы</h3>
              <Button onClick={handleAddBreak} className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Добавить перерыв
              </Button>
            </div>

            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Длительность (мин)</TableHead>
                    <TableHead>Периодичность</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isAddingBreak && (
                    <TableRow>
                      <TableCell>
                        <Input
                          value={newBreak.name}
                          onChange={e => handleUpdateNewBreakField('name', e.target.value)}
                          placeholder="Название перерыва"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={newBreak.duration}
                          onChange={e => handleUpdateNewBreakField('duration', parseInt(e.target.value))}
                          min="1"
                          max="120"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={newBreak.frequency}
                          onValueChange={value => handleUpdateNewBreakField('frequency', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите периодичность" />
                          </SelectTrigger>
                          <SelectContent>
                            {frequencyOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={handleSaveNewBreak}
                          className="h-8 w-8 text-green-500 mr-1"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={handleCancelAddBreak}
                          className="h-8 w-8 text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                  
                  {breakSettings.map(breakItem => (
                    <TableRow key={breakItem.id}>
                      <TableCell>
                        {breakItem.isEditing ? (
                          <Input
                            value={breakItem.name}
                            onChange={e => handleUpdateBreakField(breakItem.id, 'name', e.target.value)}
                          />
                        ) : (
                          breakItem.name
                        )}
                      </TableCell>
                      <TableCell>
                        {breakItem.isEditing ? (
                          <Input
                            type="number"
                            value={breakItem.duration}
                            onChange={e => handleUpdateBreakField(breakItem.id, 'duration', parseInt(e.target.value))}
                            min="1"
                            max="120"
                          />
                        ) : (
                          `${breakItem.duration} мин`
                        )}
                      </TableCell>
                      <TableCell>
                        {breakItem.isEditing ? (
                          <Select
                            value={breakItem.frequency}
                            onValueChange={value => handleUpdateBreakField(breakItem.id, 'frequency', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите периодичность" />
                            </SelectTrigger>
                            <SelectContent>
                              {frequencyOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          getFrequencyLabel(breakItem.frequency)
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {breakItem.isEditing ? (
                          <>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleSaveEdit(breakItem.id)}
                              className="h-8 w-8 text-green-500 mr-1"
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleCancelEdit(breakItem.id)}
                              className="h-8 w-8 text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEditBreak(breakItem.id)}
                              className="h-8 w-8 mr-1"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteBreak(breakItem.id)}
                              className="h-8 w-8 text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeSettings;
