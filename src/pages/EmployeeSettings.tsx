
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings, Clock } from "lucide-react";
import WorkTimeNorm from "@/components/WorkTimeNorm";

const EmployeeSettings = () => {
  const [selectedEmployee, setSelectedEmployee] = useState({
    id: "1",
    name: "Иванов Иван Иванович",
  });
  
  const [breakTime, setBreakTime] = useState("1");
  
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
                <Button>Сохранить</Button>
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
                  <span className="font-medium">1 час / день</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Применяется ко всем сотрудникам</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <WorkTimeNorm employeeId={selectedEmployee.id} employeeName={selectedEmployee.name} />
    </div>
  );
};

export default EmployeeSettings;
