
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
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
import { format } from "date-fns";
import { ru } from "date-fns/locale";

// Sample employees
const employees = [
  { id: "1", name: "Иванов Иван Иванович" },
  { id: "2", name: "Петров Петр Петрович" },
  { id: "3", name: "Сидорова Анна Михайловна" },
];

// Sample analytics data - we'll filter these based on selections
const fullMonthlyData = [
  { month: "Янв", normHours: 168, actualHours: 152, breakHours: 21, additionalHours: 8, idleHours: 24, employeeId: "1" },
  { month: "Фев", normHours: 160, actualHours: 148, breakHours: 20, additionalHours: 5, idleHours: 17, employeeId: "1" },
  { month: "Мар", normHours: 184, actualHours: 175, breakHours: 23, additionalHours: 10, idleHours: 19, employeeId: "1" },
  { month: "Апр", normHours: 168, actualHours: 162, breakHours: 21, additionalHours: 12, idleHours: 18, employeeId: "1" },
  { month: "Май", normHours: 168, actualHours: 155, breakHours: 21, additionalHours: 7, idleHours: 20, employeeId: "1" },
  { month: "Июн", normHours: 176, actualHours: 168, breakHours: 22, additionalHours: 9, idleHours: 17, employeeId: "1" },
  { month: "Янв", normHours: 168, actualHours: 142, breakHours: 25, additionalHours: 5, idleHours: 28, employeeId: "2" },
  { month: "Фев", normHours: 160, actualHours: 138, breakHours: 22, additionalHours: 4, idleHours: 20, employeeId: "2" },
  { month: "Мар", normHours: 184, actualHours: 165, breakHours: 26, additionalHours: 8, idleHours: 23, employeeId: "2" },
  { month: "Апр", normHours: 168, actualHours: 150, breakHours: 24, additionalHours: 10, idleHours: 22, employeeId: "2" },
  { month: "Май", normHours: 168, actualHours: 145, breakHours: 23, additionalHours: 6, idleHours: 24, employeeId: "2" },
  { month: "Июн", normHours: 176, actualHours: 160, breakHours: 25, additionalHours: 7, idleHours: 20, employeeId: "2" },
  { month: "Янв", normHours: 168, actualHours: 160, breakHours: 18, additionalHours: 9, idleHours: 19, employeeId: "3" },
  { month: "Фев", normHours: 160, actualHours: 155, breakHours: 17, additionalHours: 7, idleHours: 15, employeeId: "3" },
  { month: "Мар", normHours: 184, actualHours: 180, breakHours: 20, additionalHours: 12, idleHours: 16, employeeId: "3" },
  { month: "Апр", normHours: 168, actualHours: 165, breakHours: 19, additionalHours: 14, idleHours: 16, employeeId: "3" },
  { month: "Май", normHours: 168, actualHours: 160, breakHours: 19, additionalHours: 8, idleHours: 17, employeeId: "3" },
  { month: "Июн", normHours: 176, actualHours: 172, breakHours: 20, additionalHours: 10, idleHours: 14, employeeId: "3" },
];

// Sample employee performance data - also to be filtered
const fullEmployeePerformance = [
  { name: "Иванов И.И.", efficiency: 92, normCompletion: 88, idlePercent: 8, employeeId: "1" },
  { name: "Петров П.П.", efficiency: 85, normCompletion: 79, idlePercent: 15, employeeId: "2" },
  { name: "Сидорова А.М.", efficiency: 95, normCompletion: 92, idlePercent: 5, employeeId: "3" },
];

// Create a mapping between employee IDs and their time distribution data
const timeDistributionByEmployee = {
  "1": [
    { name: "Фактическое время", value: 152 },
    { name: "Перерывы", value: 21 },
    { name: "Доп. работы", value: 8 },
    { name: "Простои", value: 24 },
  ],
  "2": [
    { name: "Фактическое время", value: 142 },
    { name: "Перерывы", value: 25 },
    { name: "Доп. работы", value: 5 },
    { name: "Простои", value: 28 },
  ],
  "3": [
    { name: "Фактическое время", value: 160 },
    { name: "Перерывы", value: 18 },
    { name: "Доп. работы", value: 9 },
    { name: "Простои", value: 19 },
  ],
  "all": [
    { name: "Фактическое время", value: 152 },
    { name: "Перерывы", value: 21 },
    { name: "Доп. работы", value: 8 },
    { name: "Простои", value: 24 },
  ],
};

const COLORS = ['#0088FE', '#8884D8', '#FFBB28', '#FF8042'];

const Analytics = () => {
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [date, setDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isCustomPeriod, setIsCustomPeriod] = useState(false);

  // Filter data based on employee selection
  const filteredMonthlyData = selectedEmployee === "all" 
    ? fullMonthlyData 
    : fullMonthlyData.filter(item => item.employeeId === selectedEmployee);

  // Get performance data for selected employee
  const filteredPerformanceData = selectedEmployee === "all"
    ? fullEmployeePerformance
    : fullEmployeePerformance.filter(item => item.employeeId === selectedEmployee);

  // Get time distribution data for selected employee
  const timeDistributionData = timeDistributionByEmployee[selectedEmployee] || timeDistributionByEmployee["all"];

  // Calculate percentages for time distribution
  const totalTime = timeDistributionData.reduce((sum, item) => sum + item.value, 0);
  const timePercentages = timeDistributionData.map(item => ({
    name: item.name,
    percentage: Math.round((item.value / totalTime) * 100)
  }));

  const formatDate = (date: Date) => {
    return format(date, 'dd MMMM yyyy', { locale: ru });
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    setIsCustomPeriod(period === "custom");
  };

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
                onValueChange={setSelectedEmployee}
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
                      onSelect={(date) => date && setDate(date)}
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
                        onSelect={(date) => date && setDate(date)}
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
                        onSelect={(date) => date && setEndDate(date)}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* График эффективности использования рабочего времени */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChartIcon className="mr-2 h-5 w-5" />
            Эффективность использования рабочего времени
            <span className="ml-auto text-sm text-muted-foreground">
              {selectedEmployee === "all" ? "Все сотрудники" : employees.find(e => e.id === selectedEmployee)?.name}
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

      {/* Блок с распределением рабочего времени */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChartIcon className="mr-2 h-5 w-5" />
              Распределение рабочего времени
              <span className="ml-auto text-sm text-muted-foreground">
                {selectedEmployee === "all" ? "Все сотрудники" : employees.find(e => e.id === selectedEmployee)?.name}
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

      {selectedEmployee !== "all" && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Дополнительные работы
              <span className="ml-auto text-sm text-muted-foreground">
                {employees.find(e => e.id === selectedEmployee)?.name || ""}
                {" - "}{formatDate(date)}
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
                <TableRow>
                  <TableCell>Уборка</TableCell>
                  <TableCell>Уборка рабочего места после смены</TableCell>
                  <TableCell className="text-right">0.5</TableCell>
                </TableRow>
                {selectedEmployee === "1" && (
                  <TableRow>
                    <TableCell>Помощь коллеге</TableCell>
                    <TableCell>Помощь в настройке оборудования</TableCell>
                    <TableCell className="text-right">0.75</TableCell>
                  </TableRow>
                )}
                {selectedEmployee === "3" && (
                  <TableRow>
                    <TableCell>Обучение</TableCell>
                    <TableCell>Прохождение онлайн-курса по ТБ</TableCell>
                    <TableCell className="text-right">1.5</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Analytics;
