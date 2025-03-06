
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Search, PlusCircle, Clock, User } from "lucide-react";

const TimeTracking = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  // Sample employee data
  const employees = [
    { id: "1", name: "Иванов Иван Иванович" },
    { id: "2", name: "Петров Петр Петрович" },
    { id: "3", name: "Сидорова Анна Михайловна" },
  ];

  // Sample time tracking data for the selected date and employee
  const timeData = {
    workNorm: 8.0, // hours
    actualTime: 7.5, // hours
    breakTime: 1.0, // hours
    additionalWork: 0.5, // hours
    idleTime: 1.0, // hours
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">Учет рабочего времени</h1>
        <p className="text-secondary-foreground">Мониторинг и анализ рабочего времени сотрудников</p>
      </header>

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
                      className={selectedEmployee === employee.id ? "bg-muted" : ""}
                      onClick={() => setSelectedEmployee(employee.id)}
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

      {selectedEmployee && (
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
    </div>
  );
};

export default TimeTracking;
