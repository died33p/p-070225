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
  role: string;
  totalHours?: number;
}

interface WorkNorm {
  employeeId: string;
  date: Date;
  hours: number;
  modified?: boolean;
}

const TimeSheet = () => {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 2)); // Март 2025
  const [workNorms, setWorkNorms] = useState<WorkNorm[]>([]);
  const [modifiedCells, setModifiedCells] = useState<{[key: string]: boolean}>({});
  const [isEditMode, setIsEditMode] = useState(false);

  const employees: Employee[] = [
    { id: "1", name: "Куликов А.В.", shift: 1, role: "Мастер цеха", totalHours: 167 },
    { id: "2", name: "Грошиков А.В.", shift: 1, role: "Оператор АИСС", totalHours: 159 },
    { id: "3", name: "Федорков Е.А.", shift: 1, role: "Оператор АИСС", totalHours: 159 },
    { id: "4", name: "Ситников П.В.", shift: 1, role: "Оператор СПО", totalHours: 159 },
    { id: "5", name: "Максинов А.В.", shift: 1, role: "Ст. оп. СПО", totalHours: 159 },
    { id: "6", name: "Шигапитов И.А.", shift: 1, role: "Оператор испыт., физ. испыт.", totalHours: 159 },
    { id: "7", name: "Романовский Д.А.", shift: 1, role: "Оператор испыт.", totalHours: 159 },
    { id: "8", name: "Бориев Геннадий А.", shift: 1, role: "Подсобный рабочий, Старший испыт.", totalHours: 159 },
    { id: "9", name: "Шульгин М.А.", shift: 1, role: "Старший испыт.", totalHours: 159 },
    { id: "10", name: "Клещев Е.И.", shift: 1, role: "Оператор АИСС", totalHours: 159 },
    { id: "11", name: "Ермаков А.И.", shift: 1, role: "Оператор испыт., Старший АИСС", totalHours: 159 },
    { id: "12", name: "Борисов И.В.", shift: 2, role: "Оператор испыт.", totalHours: 151 },
    { id: "13", name: "Ветров С.Н.", shift: 2, role: "Оператор АИСС", totalHours: 151 },
    { id: "14", name: "Новосёлов И.С.", shift: 2, role: "Оператор испыт., опр. АИСС, опр. приёмный", totalHours: 151 },
    { id: "15", name: "Пушкарь А.О.", shift: 2, role: "Оператор АИСС, опр. приёмный", totalHours: 151 },
    { id: "16", name: "Вяткин М.Ф.", shift: 2, role: "Оператор СПО", totalHours: 151 },
    { id: "17", name: "Козулин И.В.", shift: 2, role: "Оператор СПО", totalHours: 151 },
    { id: "18", name: "Пихнатов А.В.", shift: 2, role: "Оператор АИСС", totalHours: 151 },
    { id: "19", name: "Лиханов Н.А.", shift: 2, role: "Оператор АИСС", totalHours: 151 },
    { id: "20", name: "Малышин А.О.", shift: 2, role: "Подсобный рабочий", totalHours: 151 },
    { id: "21", name: "Бутаков Н.С.", shift: 2, role: "Оператор испыт.", totalHours: 151 },
  ];

  const sortedEmployees = [...employees].sort((a, b) => a.shift - b.shift);
  const employeesByShift: {[key: number]: Employee[]} = sortedEmployees.reduce((acc, employee) => {
    if (!acc[employee.shift]) acc[employee.shift] = [];
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
      wn => wn.employeeId === employeeId && format(wn.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    return norm?.hours || 8; // По умолчанию 8 часов
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

    setModifiedCells(prev => ({ ...prev, [cellKey]: true }));
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

      const newNorms: WorkNorm[] = jsonData.map((row: any) => ({
        employeeId: row.employeeId,
        date: new Date(row.date),
        hours: Number(row.hours),
        modified: true
      }));

      setWorkNorms(prev => [...prev, ...newNorms]);
      toast({ title: "Импорт завершен", description: "Данные из Excel загружены" });
    };
    reader.readAsArrayBuffer(file);
  };

  const saveTimeSheet = () => {
    setModifiedCells({});
    setIsEditMode(false);
    toast({ title: "Сохранено", description: `Табель за ${format(currentDate, 'MMMM yyyy', { locale: ru })} сохранен` });
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

  const formatMonth = (date: Date): string => {
    return format(date, 'LLLL', { locale: ru }).replace(/^./, str => str.toLowerCase());
  };

  const getShiftName = (shift: string | number): string => {
    return shift === 0 || shift === "0" ? "Без смены" : `${shift} смена`;
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">График смен</h1>
        <p className="text-secondary-foreground">
          {isEditMode ? "Редактирование графика смен" : "Просмотр графика смен"}
        </p>
      </header>

      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-4">
            <Calendar className="h-5 w-5" />
            <div className="flex items-center">
              График за
              <Button variant="ghost" size="icon" className="mx-1" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span>{formatMonth(currentDate)} {format(currentDate, 'yyyy')}</span>
              <Button variant="ghost" size="icon" className="mx-1" onClick={nextMonth}>
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
              <TableHeader className="sticky top-0 z-20">
                <TableRow>
                  <TableHead className="sticky left-0 bg-background z-10">Смена</TableHead>
                  <TableHead className="sticky left-48 bg-background z-10">№ п/п</TableHead>
                  <TableHead className="sticky left-72 bg-background z-10">ФАМИЛИЯ И.О.</TableHead>
                  {days.map(day => (
                    <TableHead
                      key={day}
                      className={`text-center min-w-16 ${isWeekend(day) ? 'bg-red-50 text-red-600' : ''}`}
                    >
                      <div>{day}</div>
                      <div className="text-xs font-normal">{getDayOfWeekName(day)}</div>
                    </TableHead>
                  ))}
                  <TableHead className="text-center min-w-16">ИТОГ</TableHead>
                  <TableHead className="text-center min-w-32">ДОЛЖНОСТЬ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(employeesByShift).map(([shift, shiftEmployees]) => (
                  <React.Fragment key={shift}>
                    {shiftEmployees.length > 0 && (
                      <TableRow className="sticky top-10 z-10">
                        <TableCell colSpan={days.length + 4} className="bg-muted font-semibold">
                          {getShiftName(shift)}
                        </TableCell>
                      </TableRow>
                    )}
                    {shiftEmployees.map((employee, index) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium sticky left-0 bg-background z-10 min-w-48">
                          {employee.shift}
                        </TableCell>
                        <TableCell className="font-medium sticky left-48 bg-background z-10 min-w-24">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-medium sticky left-72 bg-background z-10 min-w-48">
                          {employee.name}
                        </TableCell>
                        {days.map(day => (
                          <TableCell
                            key={day}
                            className={`p-1 text-center ${isWeekend(day) ? 'bg-red-50' : ''} ${
                              isCellModified(employee.id, day) ? 'bg-yellow-50' : ''
                            }`}
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
                                  handleWorkNormChange(employee.id, day, parseFloat(e.target.value) || 0)
                                }
                              />
                            ) : (
                              <span>{getWorkNorm(employee.id, day)}</span>
                            )}
                          </TableCell>
                        ))}
                        <TableCell className="text-center">{employee.totalHours || 0}</TableCell>
                        <TableCell className="text-center">{employee.role}</TableCell>
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
