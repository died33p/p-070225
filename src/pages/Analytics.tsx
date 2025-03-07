
import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from "recharts";
import { Calendar as CalendarIcon, Filter, PieChart as PieChartIcon, BarChart as BarChartIcon, 
  Users, Search, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, subDays, subMonths, isWithinInterval, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { ru } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";

// Sample employees
const employees = [
  { id: "1", name: "Иванов Иван Иванович" },
  { id: "2", name: "Петров Петр Петрович" },
  { id: "3", name: "Сидорова Анна Михайловна" },
];

// Sample analytics data
const fullMonthlyData = [
  { month: "Янв", date: "2023-01-15", normHours: 168, actualHours: 152, breakHours: 21, additionalHours: 8, idleHours: 24, employeeId: "1" },
  { month: "Фев", date: "2023-02-15", normHours: 160, actualHours: 148, breakHours: 20, additionalHours: 5, idleHours: 17, employeeId: "1" },
  { month: "Мар", date: "2023-03-15", normHours: 184, actualHours: 175, breakHours: 23, additionalHours: 10, idleHours: 19, employeeId: "1" },
  { month: "Апр", date: "2023-04-15", normHours: 168, actualHours: 162, breakHours: 21, additionalHours: 12, idleHours: 18, employeeId: "1" },
  { month: "Май", date: "2023-05-15", normHours: 168, actualHours: 155, breakHours: 21, additionalHours: 7, idleHours: 20, employeeId: "1" },
  { month: "Июн", date: "2023-06-15", normHours: 176, actualHours: 168, breakHours: 22, additionalHours: 9, idleHours: 17, employeeId: "1" },
  { month: "Янв", date: "2023-01-15", normHours: 168, actualHours: 142, breakHours: 25, additionalHours: 5, idleHours: 28, employeeId: "2" },
  { month: "Фев", date: "2023-02-15", normHours: 160, actualHours: 138, breakHours: 22, additionalHours: 4, idleHours: 20, employeeId: "2" },
  { month: "Мар", date: "2023-03-15", normHours: 184, actualHours: 165, breakHours: 26, additionalHours: 8, idleHours: 23, employeeId: "2" },
  { month: "Апр", date: "2023-04-15", normHours: 168, actualHours: 150, breakHours: 24, additionalHours: 10, idleHours: 22, employeeId: "2" },
  { month: "Май", date: "2023-05-15", normHours: 168, actualHours: 145, breakHours: 23, additionalHours: 6, idleHours: 24, employeeId: "2" },
  { month: "Июн", date: "2023-06-15", normHours: 176, actualHours: 160, breakHours: 25, additionalHours: 7, idleHours: 20, employeeId: "2" },
  { month: "Янв", date: "2023-01-15", normHours: 168, actualHours: 160, breakHours: 18, additionalHours: 9, idleHours: 19, employeeId: "3" },
  { month: "Фев", date: "2023-02-15", normHours: 160, actualHours: 155, breakHours: 17, additionalHours: 7, idleHours: 15, employeeId: "3" },
  { month: "Мар", date: "2023-03-15", normHours: 184, actualHours: 180, breakHours: 20, additionalHours: 12, idleHours: 16, employeeId: "3" },
  { month: "Апр", date: "2023-04-15", normHours: 168, actualHours: 165, breakHours: 19, additionalHours: 14, idleHours: 16, employeeId: "3" },
  { month: "Май", date: "2023-05-15", normHours: 168, actualHours: 160, breakHours: 19, additionalHours: 8, idleHours: 17, employeeId: "3" },
  { month: "Июн", date: "2023-06-15", normHours: 176, actualHours: 172, breakHours: 20, additionalHours: 10, idleHours: 14, employeeId: "3" },
];

// Sample daily work time data with actual dates
const dailyWorkTimeData = [
  { date: "2023-06-01", displayDate: "01.06.2023", startTime: "08:00", endTime: "17:00", breaks: 60, idle: 45, employeeId: "1" },
  { date: "2023-06-02", displayDate: "02.06.2023", startTime: "08:30", endTime: "17:30", breaks: 45, idle: 30, employeeId: "1" },
  { date: "2023-06-03", displayDate: "03.06.2023", startTime: "08:15", endTime: "17:15", breaks: 50, idle: 35, employeeId: "1" },
  { date: "2023-06-04", displayDate: "04.06.2023", startTime: "08:00", endTime: "17:00", breaks: 55, idle: 40, employeeId: "1" },
  { date: "2023-06-05", displayDate: "05.06.2023", startTime: "08:20", endTime: "17:20", breaks: 50, idle: 35, employeeId: "1" },
  { date: "2023-06-01", displayDate: "01.06.2023", startTime: "09:00", endTime: "18:00", breaks: 70, idle: 60, employeeId: "2" },
  { date: "2023-06-02", displayDate: "02.06.2023", startTime: "09:30", endTime: "18:30", breaks: 65, idle: 50, employeeId: "2" },
  { date: "2023-06-03", displayDate: "03.06.2023", startTime: "09:15", endTime: "18:15", breaks: 55, idle: 40, employeeId: "2" },
  { date: "2023-06-04", displayDate: "04.06.2023", startTime: "09:00", endTime: "18:00", breaks: 60, idle: 45, employeeId: "2" },
  { date: "2023-06-05", displayDate: "05.06.2023", startTime: "09:10", endTime: "18:10", breaks: 60, idle: 50, employeeId: "2" },
  { date: "2023-06-01", displayDate: "01.06.2023", startTime: "08:00", endTime: "17:00", breaks: 40, idle: 25, employeeId: "3" },
  { date: "2023-06-02", displayDate: "02.06.2023", startTime: "08:30", endTime: "17:30", breaks: 35, idle: 20, employeeId: "3" },
  { date: "2023-06-03", displayDate: "03.06.2023", startTime: "08:15", endTime: "17:15", breaks: 30, idle: 15, employeeId: "3" },
  { date: "2023-06-04", displayDate: "04.06.2023", startTime: "08:00", endTime: "17:00", breaks: 35, idle: 20, employeeId: "3" },
  { date: "2023-06-05", displayDate: "05.06.2023", startTime: "08:10", endTime: "17:10", breaks: 30, idle: 15, employeeId: "3" },
];

// Sample weekly statistics data
const weeklyStatsByEmployee = {
  "1": [
    { day: "Пн", date: "2023-06-05", hours: 8.5, normHours: 8 },
    { day: "Вт", date: "2023-06-06", hours: 7.8, normHours: 8 },
    { day: "Ср", date: "2023-06-07", hours: 8.2, normHours: 8 },
    { day: "Чт", date: "2023-06-08", hours: 8.0, normHours: 8 },
    { day: "Пт", date: "2023-06-09", hours: 7.5, normHours: 8 },
  ],
  "2": [
    { day: "Пн", date: "2023-06-05", hours: 7.0, normHours: 8 },
    { day: "Вт", date: "2023-06-06", hours: 7.5, normHours: 8 },
    { day: "Ср", date: "2023-06-07", hours: 7.8, normHours: 8 },
    { day: "Чт", date: "2023-06-08", hours: 7.2, normHours: 8 },
    { day: "Пт", date: "2023-06-09", hours: 7.0, normHours: 8 },
  ],
  "3": [
    { day: "Пн", date: "2023-06-05", hours: 8.2, normHours: 8 },
    { day: "Вт", date: "2023-06-06", hours: 8.5, normHours: 8 },
    { day: "Ср", date: "2023-06-07", hours: 8.4, normHours: 8 },
    { day: "Чт", date: "2023-06-08", hours: 8.3, normHours: 8 },
    { day: "Пт", date: "2023-06-09", hours: 8.0, normHours: 8 },
  ],
  "all": [
    { day: "Пн", date: "2023-06-05", hours: 8.0, normHours: 8 },
    { day: "Вт", date: "2023-06-06", hours: 8.0, normHours: 8 },
    { day: "Ср", date: "2023-06-07", hours: 8.0, normHours: 8 },
    { day: "Чт", date: "2023-06-08", hours: 8.0, normHours: 8 },
    { day: "Пт", date: "2023-06-09", hours: 7.5, normHours: 8 },
  ]
};

// Sample employee performance data with dates
const fullEmployeePerformance = [
  { name: "Иванов И.И.", efficiency: 92, normCompletion: 88, idlePercent: 8, employeeId: "1", date: "2023-06-15" },
  { name: "Петров П.П.", efficiency: 85, normCompletion: 79, idlePercent: 15, employeeId: "2", date: "2023-06-15" },
  { name: "Сидорова А.М.", efficiency: 95, normCompletion: 92, idlePercent: 5, employeeId: "3", date: "2023-06-15" },
];

// Create time distribution data with dates
const timeDistributionByEmployee = {
  "1": [
    { name: "Фактическое время", value: 152, date: "2023-06-15" },
    { name: "Перерывы", value: 21, date: "2023-06-15" },
    { name: "Доп. работы", value: 8, date: "2023-06-15" },
    { name: "Простои", value: 24, date: "2023-06-15" },
  ],
  "2": [
    { name: "Фактическое время", value: 142, date: "2023-06-15" },
    { name: "Перерывы", value: 25, date: "2023-06-15" },
    { name: "Доп. работы", value: 5, date: "2023-06-15" },
    { name: "Простои", value: 28, date: "2023-06-15" },
  ],
  "3": [
    { name: "Фактическое время", value: 160, date: "2023-06-15" },
    { name: "Перерывы", value: 18, date: "2023-06-15" },
    { name: "Доп. работы", value: 9, date: "2023-06-15" },
    { name: "Простои", value: 19, date: "2023-06-15" },
  ],
  "all": [
    { name: "Фактическое время", value: 152, date: "2023-06-15" },
    { name: "Перерывы", value: 21, date: "2023-06-15" },
    { name: "Доп. работы", value: 8, date: "2023-06-15" },
    { name: "Простои", value: 24, date: "2023-06-15" },
  ],
};

// Sample additional work data
const additionalWorkData = {
  "1": [
    { type: "Уборка", description: "Уборка рабочего места после смены", hours: 0.5, date: "2023-06-01" },
    { type: "Помощь коллеге", description: "Помощь в настройке оборудования", hours: 0.75, date: "2023-06-01" },
    { type: "Ремонт", description: "Мелкий ремонт оборудования", hours: 1.0, date: "2023-06-02" },
  ],
  "2": [
    { type: "Уборка", description: "Уборка рабочего места после смены", hours: 0.5, date: "2023-06-01" },
    { type: "Инвентаризация", description: "Участие в инвентаризации", hours: 1.2, date: "2023-06-03" },
  ],
  "3": [
    { type: "Уборка", description: "Уборка рабочего места после смены", hours: 0.5, date: "2023-06-01" },
    { type: "Обучение", description: "Прохождение онлайн-курса по ТБ", hours: 1.5, date: "2023-06-02" },
    { type: "Встреча", description: "Участие в планерке", hours: 0.75, date: "2023-06-03" },
  ]
};

const COLORS = ['#0088FE', '#8884D8', '#FFBB28', '#FF8042'];

const Analytics = () => {
  const { toast } = useToast();
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [date, setDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isCustomPeriod, setIsCustomPeriod] = useState(false);

  // Define date range based on selected period
  const getDateRange = useMemo(() => {
    let start: Date, end: Date;
    
    if (isCustomPeriod) {
      start = date;
      end = endDate;
    } else {
      switch (selectedPeriod) {
        case "day":
          start = date;
          end = date;
          break;
        case "week":
          start = startOfWeek(date, { weekStartsOn: 1 });
          end = endOfWeek(date, { weekStartsOn: 1 });
          break;
        case "month":
          start = startOfMonth(date);
          end = endOfMonth(date);
          break;
        case "year":
          start = startOfYear(date);
          end = endOfYear(date);
          break;
        default:
          start = date;
          end = date;
      }
    }
    
    return { start, end };
  }, [date, endDate, selectedPeriod, isCustomPeriod]);

  // Filter data based on employee selection and date range
  const filteredMonthlyData = useMemo(() => {
    // First filter by employee
    const employeeFiltered = selectedEmployee === "all" 
      ? fullMonthlyData 
      : fullMonthlyData.filter(item => item.employeeId === selectedEmployee);
    
    // Then filter by date range
    return employeeFiltered.filter(item => {
      const itemDate = parseISO(item.date);
      return isWithinInterval(itemDate, { start: getDateRange.start, end: getDateRange.end });
    });
  }, [selectedEmployee, getDateRange]);

  // Get performance data for selected employee and date range
  const filteredPerformanceData = useMemo(() => {
    // First filter by employee
    const employeeFiltered = selectedEmployee === "all"
      ? fullEmployeePerformance
      : fullEmployeePerformance.filter(item => item.employeeId === selectedEmployee);
    
    // Then filter by date range
    return employeeFiltered.filter(item => {
      const itemDate = parseISO(item.date);
      return isWithinInterval(itemDate, { start: getDateRange.start, end: getDateRange.end });
    });
  }, [selectedEmployee, getDateRange]);

  // Get time distribution data for selected employee
  const timeDistributionData = useMemo(() => {
    const distributionData = timeDistributionByEmployee[selectedEmployee] || timeDistributionByEmployee["all"];
    
    // Filter by date range
    return distributionData.filter(item => {
      const itemDate = parseISO(item.date);
      return isWithinInterval(itemDate, { start: getDateRange.start, end: getDateRange.end });
    });
  }, [selectedEmployee, getDateRange]);

  // Get weekly stats for selected employee and date range
  const filteredWeeklyStats = useMemo(() => {
    const weeklyData = weeklyStatsByEmployee[selectedEmployee] || weeklyStatsByEmployee["all"];
    
    // Filter by date range
    return weeklyData.filter(item => {
      const itemDate = parseISO(item.date);
      return isWithinInterval(itemDate, { start: getDateRange.start, end: getDateRange.end });
    });
  }, [selectedEmployee, getDateRange]);

  // Get daily work data for selected employee and date range
  const filteredDailyData = useMemo(() => {
    // First filter by employee
    const employeeFiltered = selectedEmployee === "all"
      ? dailyWorkTimeData
      : dailyWorkTimeData.filter(item => item.employeeId === selectedEmployee);
    
    // Then filter by date range
    return employeeFiltered.filter(item => {
      const itemDate = parseISO(item.date);
      return isWithinInterval(itemDate, { start: getDateRange.start, end: getDateRange.end });
    });
  }, [selectedEmployee, getDateRange]);

  // Get additional work data for selected employee and date range
  const filteredAdditionalWork = useMemo(() => {
    if (selectedEmployee === "all") return [];
    
    const employeeWorks = additionalWorkData[selectedEmployee] || [];
    
    // Filter by date range
    return employeeWorks.filter(item => {
      const itemDate = parseISO(item.date);
      return isWithinInterval(itemDate, { start: getDateRange.start, end: getDateRange.end });
    });
  }, [selectedEmployee, getDateRange]);

  // Calculate percentages for time distribution
  const timePercentages = useMemo(() => {
    const totalTime = timeDistributionData.reduce((sum, item) => sum + item.value, 0);
    return timeDistributionData.map(item => ({
      name: item.name,
      percentage: totalTime > 0 ? Math.round((item.value / totalTime) * 100) : 0
    }));
  }, [timeDistributionData]);

  const formatDate = (date: Date) => {
    return format(date, 'dd MMMM yyyy', { locale: ru });
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    setIsCustomPeriod(period === "custom");
    
    // Show toast to confirm filter change
    toast({
      title: "Фильтр изменен",
      description: `Выбран период: ${period === "custom" ? "Произвольный период" : period}`,
    });
  };

  // Apply filters button handler
  const applyFilters = () => {
    toast({
      title: "Фильтры применены",
      description: `Период: ${selectedPeriod}, Сотрудник: ${selectedEmployee === "all" ? "Все" : employees.find(e => e.id === selectedEmployee)?.name}`,
    });
  };

  // Summary cards - showing key metrics based on filtered data
  const summaryMetrics = useMemo(() => ({
    efficiency: filteredPerformanceData.length > 0 
      ? Math.round(filteredPerformanceData.reduce((sum, item) => sum + item.efficiency, 0) / filteredPerformanceData.length) 
      : 0,
    normCompletion: filteredPerformanceData.length > 0 
      ? Math.round(filteredPerformanceData.reduce((sum, item) => sum + item.normCompletion, 0) / filteredPerformanceData.length) 
      : 0,
    idlePercent: filteredPerformanceData.length > 0 
      ? Math.round(filteredPerformanceData.reduce((sum, item) => sum + item.idlePercent, 0) / filteredPerformanceData.length) 
      : 0,
    avgHours: filteredMonthlyData.length > 0 
      ? Math.round(filteredMonthlyData.reduce((sum, item) => sum + item.actualHours, 0) / filteredMonthlyData.length) 
      : 0
  }), [filteredPerformanceData, filteredMonthlyData]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">Аналитика и учет времени</h1>
        <p className="text-secondary-foreground">Учет и анализ рабочего времени сотрудников</p>
      </header>

      {/* Фильтры и настройки */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Сотрудник</label>
              <Select 
                value={selectedEmployee} 
                onValueChange={(value) => {
                  setSelectedEmployee(value);
                  toast({
                    title: "Выбран сотрудник",
                    description: value === "all" ? "Все сотрудники" : employees.find(e => e.id === value)?.name,
                  });
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Выберите сотрудника" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все сотрудники</SelectItem>
                  {employees.map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Период</label>
              <div className="flex flex-wrap gap-1">
                <Button 
                  variant={selectedPeriod === "day" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePeriodChange("day")}
                >
                  День
                </Button>
                <Button 
                  variant={selectedPeriod === "week" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePeriodChange("week")}
                >
                  Неделя
                </Button>
                <Button 
                  variant={selectedPeriod === "month" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePeriodChange("month")}
                >
                  Месяц
                </Button>
                <Button 
                  variant={selectedPeriod === "year" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePeriodChange("year")}
                >
                  Год
                </Button>
                <Button 
                  variant={selectedPeriod === "custom" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePeriodChange("custom")}
                >
                  Произвольный период
                </Button>
              </div>
            </div>

            {/* Выбор определенной даты */}
            {!isCustomPeriod && (
              <div>
                <label className="block text-sm font-medium mb-1">Выбрать дату</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-[240px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDate(date)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => {
                        if (newDate) {
                          setDate(newDate);
                          toast({
                            title: "Дата изменена",
                            description: formatDate(newDate),
                          });
                        }
                      }}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Выбор произвольного периода */}
            {isCustomPeriod && (
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Начало периода</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-[240px] justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formatDate(date)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => newDate && setDate(newDate)}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Конец периода</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-[240px] justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formatDate(endDate)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(newDate) => newDate && setEndDate(newDate)}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
            
            <Button onClick={applyFilters} className="ml-auto">
              Применить фильтры
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Сводные показатели (Key Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-primary">{summaryMetrics.efficiency}%</span>
              <span className="text-sm text-muted-foreground">Эффективность</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-primary">{summaryMetrics.normCompletion}%</span>
              <span className="text-sm text-muted-foreground">Выполнение нормы</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-primary">{summaryMetrics.idlePercent}%</span>
              <span className="text-sm text-muted-foreground">Простои</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-primary">{summaryMetrics.avgHours}</span>
              <span className="text-sm text-muted-foreground">Среднее кол-во часов</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* График эффективности использования рабочего времени */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChartIcon className="mr-2 h-5 w-5" />
            Эффективность использования рабочего времени
            <span className="ml-auto text-sm text-muted-foreground">
              {selectedEmployee === "all" ? "Все сотрудники" : employees.find(e => e.id === selectedEmployee)?.name}
              {" - "}{formatDate(getDateRange.start)} - {formatDate(getDateRange.end)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="normHours" name="Норма времени" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="actualHours" name="Фактическое время" stroke="#82ca9d" strokeWidth={2} />
                <Line type="monotone" dataKey="idleHours" name="Время простоя" stroke="#ff8042" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* График недельной статистики */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChartIcon className="mr-2 h-5 w-5" />
            Недельная статистика рабочего времени
            <span className="ml-auto text-sm text-muted-foreground">
              {selectedEmployee === "all" ? "Все сотрудники" : employees.find(e => e.id === selectedEmployee)?.name}
              {" - "}{formatDate(getDateRange.start)} - {formatDate(getDateRange.end)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredWeeklyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="hours" name="Фактические часы" fill="#82ca9d" />
                <Bar dataKey="normHours" name="Норма часов" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Блок с распределением рабочего времени */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChartIcon className="mr-2 h-5 w-5" />
              Распределение рабочего времени
              <span className="ml-auto text-sm text-muted-foreground">
                {selectedEmployee === "all" ? "Все сотрудники" : employees.find(e => e.id === selectedEmployee)?.name}
                {" - "}{formatDate(getDateRange.start)} - {formatDate(getDateRange.end)}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={timeDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {timeDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Процентное соотношение
              <span className="ml-auto text-sm text-muted-foreground">
                {selectedEmployee === "all" ? "Все сотрудники" : employees.find(e => e.id === selectedEmployee)?.name}
                {" - "}{formatDate(getDateRange.start)} - {formatDate(getDateRange.end)}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timePercentages.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-sm font-medium" style={{ color: COLORS[index % COLORS.length] }}>
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full" 
                      style={{ 
                        width: `${item.percentage}%`, 
                        backgroundColor: COLORS[index % COLORS.length] 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Сравнение показателей по сотрудникам */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Сравнение показателей по сотрудникам
            <span className="ml-auto text-sm text-muted-foreground">
              {selectedEmployee === "all" ? "Все сотрудники" : employees.find(e => e.id === selectedEmployee)?.name}
              {" - "}{formatDate(getDateRange.start)} - {formatDate(getDateRange.end)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="efficiency" name="Эффективность (%)" fill="#8884d8" />
                <Bar dataKey="normCompletion" name="Выполнение нормы (%)" fill="#82ca9d" />
                <Bar dataKey="idlePercent" name="Простои (%)" fill="#ff8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Динамика распределения рабочего времени */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChartIcon className="mr-2 h-5 w-5" />
            Динамика распределения рабочего времени
            <span className="ml-auto text-sm text-muted-foreground">
              {selectedEmployee === "all" ? "Все сотрудники" : employees.find(e => e.id === selectedEmployee)?.name}
              {" - "}{formatDate(getDateRange.start)} - {formatDate(getDateRange.end)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="actualHours" stackId="1" name="Фактическое время" stroke="#82ca9d" fill="#82ca9d" />
                <Area type="monotone" dataKey="breakHours" stackId="1" name="Перерывы" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="additionalHours" stackId="1" name="Доп. работы" stroke="#FFBB28" fill="#FFBB28" />
                <Area type="monotone" dataKey="idleHours" stackId="1" name="Простои" stroke="#FF8042" fill="#FF8042" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {selectedEmployee !== "all" && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Дополнительные работы
              <span className="ml-auto text-sm text-muted-foreground">
                {employees.find(e => e.id === selectedEmployee)?.name || ""}
                {" - "}{formatDate(getDateRange.start)} - {formatDate(getDateRange.end)}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Вид работы</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead className="text-right">Время (ч)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdditionalWork.length > 0 ? (
                  filteredAdditionalWork.map((work, index) => (
                    <TableRow key={index}>
                      <TableCell>{work.type}</TableCell>
                      <TableCell>{work.description}</TableCell>
                      <TableCell className="text-right">{work.hours}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">Нет данных за выбранный период</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Ежедневный учет рабочего времени */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChartIcon className="mr-2 h-5 w-5" />
            Ежедневный учет рабочего времени
            <span className="ml-auto text-sm text-muted-foreground">
              {selectedEmployee === "all" ? "Все сотрудники" : employees.find(e => e.id === selectedEmployee)?.name}
              {" - "}{formatDate(getDateRange.start)} - {formatDate(getDateRange.end)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Начало</TableHead>
                <TableHead>Окончание</TableHead>
                <TableHead>Перерывы (мин)</TableHead>
                <TableHead>Простои (мин)</TableHead>
                <TableHead className="text-right">Всего часов</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDailyData.length > 0 ? (
                filteredDailyData.map((item, index) => {
                  // Calculate total hours
                  const start = new Date(`2023-01-01T${item.startTime}:00`);
                  const end = new Date(`2023-01-01T${item.endTime}:00`);
                  const totalMinutes = (end.getTime() - start.getTime()) / 60000 - item.breaks;
                  const totalHours = Math.round(totalMinutes / 6) / 10; // Round to 1 decimal
                  
                  return (
                    <TableRow key={index}>
                      <TableCell>{item.displayDate}</TableCell>
                      <TableCell>{item.startTime}</TableCell>
                      <TableCell>{item.endTime}</TableCell>
                      <TableCell>{item.breaks}</TableCell>
                      <TableCell>{item.idle}</TableCell>
                      <TableCell className="text-right">{totalHours}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Нет данных за выбранный период</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
