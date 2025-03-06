
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Calendar as CalendarIcon, Filter, PieChart as PieChartIcon, BarChart as BarChartIcon, 
  Users, User, Search, PlusCircle, Clock, ArrowUpRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample employees
const employees = [
  { id: "1", name: "Иванов Иван Иванович" },
  { id: "2", name: "Петров Петр Петрович" },
  { id: "3", name: "Сидорова Анна Михайловна" },
];

// Sample analytics data
const monthlyData = [
  { month: "Янв", normHours: 168, actualHours: 152, breakHours: 21, additionalHours: 8, idleHours: 24 },
  { month: "Фев", normHours: 160, actualHours: 148, breakHours: 20, additionalHours: 5, idleHours: 17 },
  { month: "Мар", normHours: 184, actualHours: 175, breakHours: 23, additionalHours: 10, idleHours: 19 },
  { month: "Апр", normHours: 168, actualHours: 162, breakHours: 21, additionalHours: 12, idleHours: 18 },
  { month: "Май", normHours: 168, actualHours: 155, breakHours: 21, additionalHours: 7, idleHours: 20 },
  { month: "Июн", normHours: 176, actualHours: 168, breakHours: 22, additionalHours: 9, idleHours: 17 },
];

// Sample employee performance data
const employeePerformance = [
  { name: "Иванов И.И.", efficiency: 92, normCompletion: 88, idlePercent: 8 },
  { name: "Петров П.П.", efficiency: 85, normCompletion: 79, idlePercent: 15 },
  { name: "Сидорова А.М.", efficiency: 95, normCompletion: 92, idlePercent: 5 },
];

// Time distribution data for pie chart
const timeDistributionData = [
  { name: "Фактическое время", value: 152 },
  { name: "Перерывы", value: 21 },
  { name: "Доп. работы", value: 8 },
  { name: "Простои", value: 24 },
];

// Sample time tracking data
const timeData = {
  workNorm: 8.0,
  actualTime: 7.5,
  breakTime: 1.0,
  additionalWork: 0.5,
  idleTime: 1.0,
};

const COLORS = ['#0088FE', '#8884D8', '#FFBB28', '#FF8042'];

const Analytics = () => {
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedView, setSelectedView] = useState("efficiency");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEmployeeForTime, setSelectedEmployeeForTime] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("analytics");

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">Аналитика и учет времени</h1>
        <p className="text-secondary-foreground">Учет и анализ рабочего времени сотрудников</p>
      </header>

      <Tabs defaultValue="analytics" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          <TabsTrigger value="timetracking">Учет времени</TabsTrigger>
        </TabsList>
        
        {/* Содержимое вкладки Аналитика */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium mb-1">Сотрудник</label>
              <select
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option value="all">Все сотрудники</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Период</label>
              <div className="flex space-x-1">
                <Button 
                  variant={selectedPeriod === "day" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod("day")}
                >
                  День
                </Button>
                <Button 
                  variant={selectedPeriod === "week" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod("week")}
                >
                  Неделя
                </Button>
                <Button 
                  variant={selectedPeriod === "month" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod("month")}
                >
                  Месяц
                </Button>
                <Button 
                  variant={selectedPeriod === "year" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod("year")}
                >
                  Год
                </Button>
              </div>
            </div>
            
            <div className="ml-auto">
              <label className="block text-sm font-medium mb-1">Вид аналитики</label>
              <div className="flex space-x-1">
                <Button 
                  variant={selectedView === "efficiency" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedView("efficiency")}
                >
                  <BarChartIcon className="h-4 w-4 mr-1" />
                  Эффективность
                </Button>
                <Button 
                  variant={selectedView === "time" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedView("time")}
                >
                  <PieChartIcon className="h-4 w-4 mr-1" />
                  Распределение времени
                </Button>
                <Button 
                  variant={selectedView === "comparison" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedView("comparison")}
                >
                  <Users className="h-4 w-4 mr-1" />
                  Сравнение
                </Button>
              </div>
            </div>
          </div>

          {selectedView === "efficiency" && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChartIcon className="mr-2 h-5 w-5" />
                  Эффективность использования рабочего времени
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
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
          )}

          {selectedView === "time" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChartIcon className="mr-2 h-5 w-5" />
                    Распределение рабочего времени
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
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Фактическое время</span>
                        <span className="text-sm font-medium text-blue-600">74%</span>
                      </div>
                      <div className="w-full bg-blue-100 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '74%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Перерывы</span>
                        <span className="text-sm font-medium text-purple-600">10%</span>
                      </div>
                      <div className="w-full bg-purple-100 rounded-full h-2.5">
                        <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Дополнительные работы</span>
                        <span className="text-sm font-medium text-yellow-600">4%</span>
                      </div>
                      <div className="w-full bg-yellow-100 rounded-full h-2.5">
                        <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: '4%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Простои</span>
                        <span className="text-sm font-medium text-red-600">12%</span>
                      </div>
                      <div className="w-full bg-red-100 rounded-full h-2.5">
                        <div className="bg-red-600 h-2.5 rounded-full" style={{ width: '12%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedView === "comparison" && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Сравнение показателей по сотрудникам
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={employeePerformance}>
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
          )}
        </TabsContent>
        
        {/* Содержимое вкладки Учет времени */}
        <TabsContent value="timetracking" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card md:col-span-2">
              <CardHeader>
                <CardTitle>Поиск сотрудника</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Поиск по имени сотрудника..."
                      className="pl-8"
                    />
                  </div>
                  <Button variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Добавить сотрудника
                  </Button>
                </div>
                
                <div className="mt-4 border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Имя сотрудника</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map((employee) => (
                        <TableRow 
                          key={employee.id}
                          className={selectedEmployeeForTime === employee.id ? "bg-muted" : ""}
                          onClick={() => setSelectedEmployeeForTime(employee.id)}
                        >
                          <TableCell className="font-medium">{employee.name}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Выбрать
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Выбор даты</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          </div>

          {selectedEmployeeForTime && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>
                  Данные о рабочем времени
                  <span className="ml-2 text-muted-foreground">
                    ({date ? date.toLocaleDateString('ru-RU') : 'Не выбрано'})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                      <Clock className="h-5 w-5 text-purple-500 mr-2" />
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
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Время простоя</h3>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <p className="text-2xl font-bold text-red-600">{timeData.idleTime} ч</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Дополнительные работы</h3>
                  <Button className="mr-2">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Добавить работу
                  </Button>
                  
                  <div className="mt-2 border rounded-md">
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
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
