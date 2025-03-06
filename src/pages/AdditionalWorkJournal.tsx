
import { useState } from "react";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ClipboardList, PlusCircle, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Employee {
  id: string;
  name: string;
}

interface AdditionalWork {
  id: string;
  employeeId: string;
  date: Date;
  workType: string;
  description: string;
  hours: number;
}

const AdditionalWorkJournal = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [workType, setWorkType] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  // Sample employees
  const employees: Employee[] = [
    { id: "1", name: "Иванов Иван Иванович" },
    { id: "2", name: "Петров Петр Петрович" },
    { id: "3", name: "Сидорова Анна Михайловна" },
  ];
  
  // Sample additional works
  const [additionalWorks, setAdditionalWorks] = useState<AdditionalWork[]>([
    { 
      id: "1", 
      employeeId: "1", 
      date: new Date(), 
      workType: "Уборка", 
      description: "Уборка рабочего места", 
      hours: 1 
    },
    { 
      id: "2", 
      employeeId: "2", 
      date: new Date(), 
      workType: "Документация", 
      description: "Подготовка отчетов", 
      hours: 2 
    },
  ]);

  const filteredWorks = date 
    ? additionalWorks.filter(work => 
        format(work.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      )
    : [];

  const resetForm = () => {
    setSelectedEmployee("");
    setWorkType("");
    setDescription("");
    setHours("");
    setIsEditing(false);
    setEditId(null);
  };

  const handleAddWork = () => {
    if (!date || !selectedEmployee || !workType || !description || !hours) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive",
      });
      return;
    }

    if (isEditing && editId) {
      setAdditionalWorks(works => 
        works.map(work => 
          work.id === editId 
            ? { 
                ...work, 
                employeeId: selectedEmployee, 
                date: date, 
                workType, 
                description, 
                hours: parseFloat(hours) 
              }
            : work
        )
      );
      
      toast({
        title: "Запись обновлена",
        description: "Информация о дополнительной работе успешно обновлена",
      });
    } else {
      const newWork: AdditionalWork = {
        id: Date.now().toString(),
        employeeId: selectedEmployee,
        date: date,
        workType,
        description,
        hours: parseFloat(hours),
      };
      
      setAdditionalWorks([...additionalWorks, newWork]);
      
      toast({
        title: "Запись добавлена",
        description: "Информация о дополнительной работе успешно добавлена",
      });
    }
    
    resetForm();
  };

  const handleEditWork = (work: AdditionalWork) => {
    setSelectedEmployee(work.employeeId);
    setWorkType(work.workType);
    setDescription(work.description);
    setHours(work.hours.toString());
    setIsEditing(true);
    setEditId(work.id);
    setDate(work.date);
  };

  const handleDeleteWork = (id: string) => {
    setAdditionalWorks(works => works.filter(work => work.id !== id));
    
    toast({
      title: "Запись удалена",
      description: "Информация о дополнительной работе успешно удалена",
    });
  };

  const getEmployeeName = (id: string) => {
    return employees.find(emp => emp.id === id)?.name || "Неизвестный сотрудник";
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">Журнал дополнительных работ</h1>
        <p className="text-secondary-foreground">Учет дополнительных работ сотрудников</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <Card className="glass-card md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClipboardList className="mr-2 h-5 w-5" />
              Добавление дополнительной работы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Сотрудник</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                >
                  <option value="">Выберите сотрудника</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Вид работы</label>
                <Input
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  placeholder="Например: Уборка, Документация"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Описание</label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Краткое описание работы"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Время (часов)</label>
                <Input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="Количество часов"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              {isEditing && (
                <Button variant="outline" onClick={resetForm}>
                  Отмена
                </Button>
              )}
              <Button onClick={handleAddWork}>
                {isEditing ? (
                  <>Сохранить изменения</>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Добавить работу
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>
            Журнал дополнительных работ 
            {date && (
              <span className="text-muted-foreground ml-2 font-normal">
                за {format(date, 'dd.MM.yyyy')}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredWorks.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Сотрудник</TableHead>
                    <TableHead>Вид работы</TableHead>
                    <TableHead>Описание</TableHead>
                    <TableHead className="text-right">Часы</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorks.map((work) => (
                    <TableRow key={work.id}>
                      <TableCell className="font-medium">{getEmployeeName(work.employeeId)}</TableCell>
                      <TableCell>{work.workType}</TableCell>
                      <TableCell>{work.description}</TableCell>
                      <TableCell className="text-right">{work.hours}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 mr-1"
                          onClick={() => handleEditWork(work)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDeleteWork(work.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <ClipboardList className="h-12 w-12 mb-4" />
              <h3 className="text-lg font-medium">Нет дополнительных работ</h3>
              <p>На выбранную дату нет записей о дополнительных работах</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdditionalWorkJournal;
