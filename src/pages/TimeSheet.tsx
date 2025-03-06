
import { useState } from "react";
import { format, getDaysInMonth, setDate, addMonths, subMonths } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Calendar, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Employee {
  id: string;
  name: string;
}

interface WorkNorm {
  employeeId: string;
  date: Date;
  hours: number;
}

const TimeSheet = () => {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workNorms, setWorkNorms] = useState<WorkNorm[]>([]);
  
  // Sample employees
  const employees: Employee[] = [
    { id: "1", name: "Иванов Иван Иванович" },
    { id: "2", name: "Петров Петр Петрович" },
    { id: "3", name: "Сидорова Анна Михайловна" },
  ];

  const daysInMonth = getDaysInMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  const prevMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const getWorkNorm = (employeeId: string, day: number): number => {
    const date = setDate(currentDate, day);
    const norm = workNorms.find(
      wn => wn.employeeId === employeeId && 
      format(wn.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    return norm?.hours || 8; // Default to 8 hours if not set
  };

  const handleWorkNormChange = (employeeId: string, day: number, hours: number) => {
    const date = setDate(currentDate, day);
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    setWorkNorms(prev => {
      // Remove existing entry if any
      const filtered = prev.filter(
        wn => !(wn.employeeId === employeeId && format(wn.date, 'yyyy-MM-dd') === formattedDate)
      );
      
      // Add new entry
      return [...filtered, { employeeId, date, hours }];
    });
  };

  const saveTimeSheet = () => {
    toast({
      title: "Данные сохранены",
      description: `Табель учета рабочего времени за ${format(currentDate, 'MMMM yyyy')} сохранен`,
    });
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">Табель учета рабочего времени</h1>
        <p className="text-secondary-foreground">Установка норм рабочего времени на месяц</p>
      </header>

      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Табель за {format(currentDate, 'MMMM yyyy')}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button onClick={saveTimeSheet}>
              <Save className="mr-2 h-4 w-4" />
              Сохранить
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-auto">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-background z-10">Сотрудник</TableHead>
                  {days.map(day => (
                    <TableHead key={day} className="text-center min-w-16">
                      {day}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map(employee => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium sticky left-0 bg-background z-10 min-w-48">
                      {employee.name}
                    </TableCell>
                    {days.map(day => (
                      <TableCell key={day} className="p-1 text-center">
                        <Input
                          type="number"
                          min="0"
                          max="24"
                          step="0.5"
                          className="h-8 text-center"
                          value={getWorkNorm(employee.id, day)}
                          onChange={(e) => 
                            handleWorkNormChange(
                              employee.id, 
                              day, 
                              parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeSheet;
