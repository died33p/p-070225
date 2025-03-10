
import React, { useState } from "react";
import { format, getDaysInMonth, setDate, addMonths, subMonths, getDay } from "date-fns";
import { ru } from "date-fns/locale";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Calendar, Save, FileSpreadsheet, Pencil } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';

interface Employee {
  id: string;
  name: string;
  shift: number;
}

interface WorkNorm {
  employeeId: string;
  date: Date;
  hours: number;
  modified?: boolean;
}

const TimeSheet = () => {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workNorms, setWorkNorms] = useState<WorkNorm[]>([]);
  const [modifiedCells, setModifiedCells] = useState<{[key: string]: boolean}>({});
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Sample employees with shifts
  const employees: Employee[] = [
    { id: "1", name: "Иванов Иван Иванович", shift: 1 },
    { id: "2", name: "Петров Петр Петрович", shift: 2 },
    { id: "3", name: "Сидорова Анна Михайловна", shift: 0 },
  ];

  // Sort employees by shift
  const sortedEmployees = [...employees].sort((a, b) => a.shift - b.shift);
  
  // Group employees by shift
  const employeesByShift: {[key: number]: Employee[]} = sortedEmployees.reduce((acc, employee) => {
    if (!acc[employee.shift]) {
      acc[employee.shift] = [];
    }
    acc[employee.shift].push(employee);
    return acc;
  }, {} as {[key: number]: Employee[]});

  const daysInMonth = getDaysInMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  const prevMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
    setModifiedCells({});
  };
  
  const nextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
    setModifiedCells({});
  };

  const getWorkNorm = (employeeId: string, day: number): number => {
    const date = setDate(currentDate, day);
    const norm = workNorms.find(
      wn => wn.employeeId === employeeId && 
      format(wn.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    return norm?.hours || 8; // Default to 8 hours if not set
  };

  const getCellKey = (employeeId: string, day: number): string => {
    return `${employeeId}-${format(setDate(currentDate, day), 'yyyy-MM-dd')}`;
  };

  const isCellModified = (employeeId: string, day: number): boolean => {
    const cellKey = getCellKey(employeeId, day);
    return !!modifiedCells[cellKey];
  };

  const handleWorkNormChange = (employeeId: string, day: number, hours: number) => {
    if (!isEditMode) return;
    
    const date = setDate(currentDate, day);
    const formattedDate = format(date, 'yyyy-MM-dd');
    const cellKey = getCellKey(employeeId, day);
    
    setWorkNorms(prev => {
      const filtered = prev.filter(
        wn => !(wn.employeeId === employeeId && format(wn.date, 'yyyy-MM-dd') === formattedDate)
      );
      return [...filtered, { employeeId, date, hours, modified: true }];
    });

    setModifiedCells(prev => ({
      ...prev,
      [cellKey]: true
    }));
  };

  const handleExcelImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Process Excel data and update workNorms
      // This is a simple example - adjust according to your Excel structure
      const newNorms: WorkNorm[] = jsonData.map((row: any) => ({
        employeeId: row.employeeId,
        date: new Date(row.date),
        hours: Number(row.hours),
        modified: true
      }));

      setWorkNorms(prev => [...prev, ...newNorms]);
      toast({
        title: "Импорт завершен",
        description: `Данные из Excel успешно загружены`,
      });
    };
    reader.readAsArrayBuffer(file);
  };

  const saveTimeSheet = () => {
    setModifiedCells({});
    setIsEditMode(false);
    toast({
      title: "Данные сохранены",
      description: `Табель учета рабочего времени за ${format(currentDate, 'MMMM yyyy', { locale: ru })} сохранен`,
    });
  };

  const isWeekend = (day: number): boolean => {
    const date = setDate(currentDate, day);
    const dayOfWeek = getDay(date);
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const getDayOfWeekName = (day: number): string => {
    const date = setDate(currentDate, day);
    return format(date, 'EEEEEE', { locale: ru });
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">График учета рабочего времени</h1>
        <p className="text-secondary-foreground">
          {isEditMode ? "Редактирование норм рабочего времени" : "Просмотр графика учета рабочего времени"}
        </p>
      </header>

      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-4">
            <Calendar className="h-5 w-5" />
            <div className="flex items-center">
              График за 
              <Button
                variant="ghost"
                size="icon"
                className="mx-1"
                onClick={prevMonth}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span>
                {format(currentDate, 'LLLL yyyy', { locale: ru })
                  .replace(/^./, (str) => str.toLowerCase())}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="mx-1"
                onClick={nextMonth}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
          <div className="flex gap-2">
            {isEditMode ? (
              <>
                <Input
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  id="excel-upload"
                  onChange={handleExcelImport}
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('excel-upload')?.click()}
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Импорт из Excel
                </Button>
                <Button onClick={saveTimeSheet}>
                  <Save className="mr-2 h-4 w-4" />
                  Сохранить
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditMode(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Редактировать
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="overflow-auto">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-background z-10">Сотрудник</TableHead>
                  {days.map(day => (
                    <TableHead 
                      key={day} 
                      className={`text-center min-w-16 ${isWeekend(day) ? 'bg-red-50 text-red-600' : ''}`}
                    >
                      <div>{day}</div>
                      <div className="text-xs font-normal">{getDayOfWeekName(day)}</div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(employeesByShift).map(([shift, shiftEmployees]) => (
                  <React.Fragment key={shift}>
                    {shiftEmployees.length > 0 && (
                      <TableRow>
                        <TableCell 
                          colSpan={days.length + 1} 
                          className="bg-muted font-semibold"
                        >
                          Смена {shift}
                        </TableCell>
                      </TableRow>
                    )}
                    {shiftEmployees.map(employee => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium sticky left-0 bg-background z-10 min-w-48">
                          {employee.name}
                        </TableCell>
                        {days.map(day => (
                          <TableCell 
                            key={day} 
                            className={`p-1 text-center ${isWeekend(day) ? 'bg-red-50' : ''} ${isCellModified(employee.id, day) ? 'bg-yellow-50' : ''}`}
                          >
                            {isEditMode ? (
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
                            ) : (
                              <span>{getWorkNorm(employee.id, day)}</span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </React.Fragment>
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
