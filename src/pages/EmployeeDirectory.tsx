
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Search, UserPlus, Pencil, Trash2, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Employee {
  id: string;
  name: string;
  position: string;
  shift: number;
}

const EmployeeDirectory = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([
    { id: "1", name: "Иванов Иван Иванович", position: "Менеджер", shift: 1 },
    { id: "2", name: "Петров Петр Петрович", position: "Разработчик", shift: 2 },
    { id: "3", name: "Сидорова Анна Михайловна", position: "Бухгалтер", shift: 0 },
  ]);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [isEditingEmployee, setIsEditingEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    name: "",
    position: "",
    shift: 0,
  });
  const [editEmployeeId, setEditEmployeeId] = useState<string | null>(null);

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.shift.toString().includes(searchQuery)
  );

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.position) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive",
      });
      return;
    }

    const id = Date.now().toString();
    setEmployees([...employees, { id, ...newEmployee as Employee }]);
    setNewEmployee({ name: "", position: "", shift: 0 });
    setIsAddingEmployee(false);
    toast({
      title: "Сотрудник добавлен",
      description: `${newEmployee.name} успешно добавлен в справочник`,
    });
  };

  const handleEditEmployee = () => {
    if (!newEmployee.name || !newEmployee.position) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive",
      });
      return;
    }

    setEmployees(
      employees.map((emp) =>
        emp.id === editEmployeeId
          ? { ...emp, ...newEmployee as Employee }
          : emp
      )
    );
    setNewEmployee({ name: "", position: "", shift: 0 });
    setIsEditingEmployee(false);
    setEditEmployeeId(null);
    toast({
      title: "Сотрудник обновлен",
      description: `Данные сотрудника успешно обновлены`,
    });
  };

  const startEditEmployee = (employee: Employee) => {
    setNewEmployee({
      name: employee.name,
      position: employee.position,
      shift: employee.shift,
    });
    setEditEmployeeId(employee.id);
    setIsEditingEmployee(true);
    setIsAddingEmployee(false);
  };

  const handleDeleteEmployee = (id: string) => {
    const employeeToDelete = employees.find((emp) => emp.id === id);
    setEmployees(employees.filter((emp) => emp.id !== id));
    toast({
      title: "Сотрудник удален",
      description: `${employeeToDelete?.name} успешно удален из справочника`,
    });
  };

  const cancelForm = () => {
    setNewEmployee({ name: "", position: "", shift: 0 });
    setIsAddingEmployee(false);
    setIsEditingEmployee(false);
    setEditEmployeeId(null);
  };

  const getShiftName = (shift: number) => {
    switch(shift) {
      case 0: return "Без смены";
      case 1: return "Смена 1";
      case 2: return "Смена 2";
      case 3: return "Смена 3";
      default: return "Неизвестно";
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">Справочник сотрудников</h1>
        <p className="text-secondary-foreground">Управление данными о сотрудниках</p>
      </header>

      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Список сотрудников</CardTitle>
          {!isAddingEmployee && !isEditingEmployee && (
            <Button onClick={() => setIsAddingEmployee(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Добавить сотрудника
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {(isAddingEmployee || isEditingEmployee) && (
            <div className="mb-6 p-4 border rounded-md bg-muted/50">
              <h3 className="text-lg font-medium mb-4">
                {isAddingEmployee ? "Добавить нового сотрудника" : "Редактировать сотрудника"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">ФИО</label>
                  <Input
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    placeholder="Иванов Иван Иванович"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Должность</label>
                  <Input
                    value={newEmployee.position}
                    onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                    placeholder="Менеджер"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Смена</label>
                  <Select
                    value={newEmployee.shift?.toString()}
                    onValueChange={(value) => setNewEmployee({ ...newEmployee, shift: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите смену" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Без смены</SelectItem>
                      <SelectItem value="1">Смена 1</SelectItem>
                      <SelectItem value="2">Смена 2</SelectItem>
                      <SelectItem value="3">Смена 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={cancelForm}>
                  Отмена
                </Button>
                <Button onClick={isAddingEmployee ? handleAddEmployee : handleEditEmployee}>
                  {isAddingEmployee ? "Добавить" : "Сохранить"}
                </Button>
              </div>
            </div>
          )}

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Поиск сотрудников..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><User className="h-4 w-4" /></TableHead>
                  <TableHead>ФИО</TableHead>
                  <TableHead>Должность</TableHead>
                  <TableHead>Смена</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium w-10">
                        <div className="bg-primary/10 rounded-full p-2 flex items-center justify-center w-9 h-9">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{getShiftName(employee.shift)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 mr-1"
                          onClick={() => startEditEmployee(employee)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDeleteEmployee(employee.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      Сотрудники не найдены
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDirectory;
