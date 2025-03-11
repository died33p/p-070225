import React, { useState } from "react";
import { format, getDaysInMonth, setDate, addMonths, subMonths, getDay } from "date-fns";
import { ru } from "date-fns/locale";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Calendar, Save, FileSpreadsheet, Pencil, Download } from "lucide-react";
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
  const [currentDate, setCurrentDate] = useState(new Date(2025, 2));
  const [workNorms, setWorkNorms] = useState<WorkNorm[]>([]);
  const [modifiedCells, setModifiedCells] = useState<{[key: string]: boolean}>({});
  const [isEditMode, setIsEditMode] = useState(false);

  const employees: Employee[] = [
    { id: "1", name: "Куликов А.Б.", shift: 1, role: "Мастер цеха", totalHours: 167 },
    { id: "2", name: "Грознецкий А.В.", shift: 1, role: "Оператор АЛСС", totalHours: 159 },
    { id: "3", name: "Фараджов Е.А.", shift: 1, role: "подсобный рабочий", totalHours: 159 },
    { id: "4", name: "Ситников П.В.", shift: 1, role: "Оператор СПО", totalHours: 159 },
    { id: "5", name: "Максимов А.В.", shift: 1, role: "Ст.оп-р СПО", totalHours: 159 },
    { id: "6", name: "Шаритдинов Д.А.", shift: 1, role: "Оператор листогиба, гильотины", totalHours: 159 },
    { id: "7", name: "Романовский Д.А.", shift: 1, role: "Оператор листогиба", totalHours: 159 },
    { id: "8", name: "Борцев Геннадий А.", shift: 1, role: '"Подсобный рабочий,\nСтажёр листогиба"', totalHours: 159 },
    { id: "9", name: "Шубин М.А.", shift: 1, role: "Оператор листогиба", totalHours: 159 },
    { id: "10", name: "Клебер Е.И.", shift: 1, role: "Оператор АЛСС", totalHours: 159 },
    { id: "11", name: "Германов А.Я.", shift: 1, role: "Оператор листогиба, Стажер АЛСС", totalHours: 159 },
    { id: "12", name: "Борисов Д.В.", shift: 2, role: "Оператор гильотины", totalHours: 151 },
    { id: "13", name: "Вепрев С.Н.", shift: 2, role: "Оператор АЛСС", totalHours: 151 },
    { id: "14", name: "Новосёлов И.С.", shift: 2, role: "Оператор листогиба", totalHours: 151 },
    { id: "15", name: "Елизаров А.О.", shift: 2, role: "оператор листогиба, опр-р АЛСС, опе-р гильотины", totalHours: 151 },
    { id: "16", name: "Вяткин М.Ф.", shift: 2, role: "Оператор СПО", totalHours: 151 },
    { id: "17", name: "Козочкин П.В.", shift: 2, role: "Оператор СПО", totalHours: 151 },
    { id: "18", name: "Шахматов А.В.", shift: 2, role: "Оператор АЛСС", totalHours: 151 },
    { id: "19", name: "Лиханов Н.А.", shift: 2, role: "Оператор АЛСС", totalHours: 151 },
    { id: "20", name: "Малыгин А.О.", shift: 2, role: "подсобный рабочий", totalHours: 151 },
    { id: "21", name: "Булгаков Н.С.", shift: 2, role: "Оператор листогиба", totalHours: 151 },
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
    return norm ? norm.hours : 0;
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
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });

      // Поиск индекса столбца "Фамилия И.О."
      let nameColumnIndex = -1;
      let headerRow: any[] | null = null;

      for (const row of jsonData) {
        const rowArray = row as any[];
        const index = rowArray.findIndex(cell => cell?.toString().trim() === "Фамилия И.О.");
        if (index !== -1) {
          nameColumnIndex = index;
          headerRow = rowArray;
          break;
        }
      }

      if (nameColumnIndex === -1 || !headerRow) {
        toast({ title: "Ошибка", description: "Колонка 'Фамилия И.О.' не найдена", variant: "destructive" });
        return;
      }

      // Определение столбцов с днями (ищем числа от 1 до 31)
      const dayColumns: { [key: number]: number } = {};
      for (let i = nameColumnIndex + 1; i < headerRow.length; i++) {
        const headerValue = headerRow[i]?.toString().trim();
        const day = parseFloat(headerValue);
        if (!isNaN(day) && day >= 1 && day <= 31 && Number.isInteger(day)) {
          dayColumns[day] = i;
        }
      }

      const newNorms: WorkNorm[] = [];
      let processedEmployees = 0;

      // Обработка каждого сотрудника из таблицы на странице
      for (const employee of employees) {
        const excelRow = jsonData.find((row: any[]) => {
          const rowArray = row as any[];
          const name = rowArray[nameColumnIndex]?.toString().trim();
          return name === employee.name;
        });

        if (excelRow) {
          processedEmployees++;
          for (let day = 1; day <= daysInMonth; day++) {
            const columnIndex = dayColumns[day];
            if (columnIndex !== undefined) {
              const hours = parseFloat(excelRow[columnIndex]) || 0;
              const date = setDate(currentDate, day);
              newNorms.push({
                employeeId: employee.id,
                date,
                hours,
                modified: true,
              });
            }
          }
        }
      }

      if (processedEmployees === 0) {
        toast({ title: "Ошибка", description: "Сотрудники из файла не найдены в графике", variant: "destructive" });
        return;
      }

      setWorkNorms(newNorms);
      toast({ title: "Импорт завершен", description: `Загружено данных для ${processedEmployees} сотрудников` });
    };
    reader.readAsArrayBuffer(file);
  };

  const downloadTemplate = () => {
    const workbook = XLSX.utils.book_new();
    const worksheetData: any[][] = [];

    // Заголовок
    worksheetData.push(["График смен", "", "Март", "2025"]);
    worksheetData.push(["Смена", "№ п/п", "Фамилия И.О.", ...days.map(d => d.toString()), "ИТОГ", "Должность", "наставник"]);

    // Данные по сменам и сотрудникам
    let index = 1;
    Object.entries(employeesByShift).forEach(([shift, shiftEmployees]) => {
      worksheetData.push([`${shift} смена`]);
      shiftEmployees.forEach(employee => {
        const row = ["", index++, employee.name, ...days.map(() => ""), employee.totalHours || 0, employee.role, ""];
        worksheetData.push(row);
      });
    });

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Шаблон");
    XLSX.writeFile(workbook, `Шаблон_график_смен_${format(currentDate, 'MMMM_yyyy', { locale: ru })}.xlsx`);
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
    return shift === 0 || shift === "0" ? "Без смены" : `${shift} СМЕНА`;
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
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="mr-2 h-4 w-4" />
                  Скачать шаблон
                </Button>
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
                  <TableHead className="sticky left-0 bg-background z-10 min-w-24">Смена</TableHead>
                  <TableHead className="sticky left-24 bg-background z-10 min-w-48">ФАМИЛИЯ И.О.</TableHead>
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
                  shiftEmployees.map((employee, index) => (
                    <TableRow key={employee.id}>
                      {index === 0 && (
                        <TableCell
                          rowSpan={shiftEmployees.length}
                          className="font-medium sticky left-0 bg-background z-10 min-w-24 text-center"
                          style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
                        >
                          {getShiftName(shift)}
                        </TableCell>
                      )}
                      <TableCell className="font-medium sticky left-24 bg-background z-10 min-w-48">
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
                  ))
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
