
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, User, Coffee, PlusCircle, AlertCircle } from "lucide-react";

interface TimeReportProps {
  employeeId: string;
  date: Date;
  timeData: {
    workNorm: number;
    actualTime: number;
    breakTime: number;
    additionalWork: number;
    idleTime: number;
  };
}

const TimeReport = ({ employeeId, date, timeData }: TimeReportProps) => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>
          Отчет о рабочем времени
          <span className="ml-2 text-muted-foreground">
            ({date.toLocaleDateString('ru-RU')})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="text-sm font-medium text-blue-700">Норма времени</h3>
            </div>
            <p className="mt-2 text-2xl font-bold">{timeData.workNorm} ч</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="flex items-center">
              <User className="h-5 w-5 text-green-500 mr-2" />
              <h3 className="text-sm font-medium text-green-700">Фактическое время</h3>
            </div>
            <p className="mt-2 text-2xl font-bold">{timeData.actualTime} ч</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="flex items-center">
              <Coffee className="h-5 w-5 text-purple-500 mr-2" />
              <h3 className="text-sm font-medium text-purple-700">Перерывы</h3>
            </div>
            <p className="mt-2 text-2xl font-bold">{timeData.breakTime} ч</p>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
            <div className="flex items-center">
              <PlusCircle className="h-5 w-5 text-amber-500 mr-2" />
              <h3 className="text-sm font-medium text-amber-700">Доп. работы</h3>
            </div>
            <p className="mt-2 text-2xl font-bold">{timeData.additionalWork} ч</p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <h3 className="text-sm font-medium text-red-700">Время простоя</h3>
            </div>
            <p className="mt-2 text-2xl font-bold">{timeData.idleTime} ч</p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Итоги дня</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Эффективность:</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${(timeData.actualTime / timeData.workNorm) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm mt-1">
                {Math.round((timeData.actualTime / timeData.workNorm) * 100)}%
              </p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Время простоя:</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-red-500 h-2.5 rounded-full" 
                  style={{ width: `${(timeData.idleTime / timeData.workNorm) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm mt-1">
                {Math.round((timeData.idleTime / timeData.workNorm) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeReport;
