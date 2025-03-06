
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { PlusCircle, Save, X } from "lucide-react";

interface AdditionalWorkProps {
  employeeId: string;
  date: Date;
}

const AdditionalWork = ({ employeeId, date }: AdditionalWorkProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [workType, setWorkType] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState("1");

  // Sample data for additional work
  const additionalWorks = [
    { id: "1", type: "Уборка", description: "Уборка рабочего места", hours: 0.5 },
    { id: "2", type: "Обучение", description: "Обучение новых сотрудников", hours: 1.5 },
  ];

  const handleAddNew = () => {
    setIsAdding(true);
    setWorkType("");
    setDescription("");
    setHours("1");
  };

  const handleCancel = () => {
    setIsAdding(false);
  };

  const handleSave = () => {
    // Here would be logic to save the new additional work
    setIsAdding(false);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <PlusCircle className="mr-2 h-5 w-5" />
          Дополнительные работы ({date.toLocaleDateString('ru-RU')})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isAdding && (
          <Button className="mb-4" onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Добавить работу
          </Button>
        )}

        {isAdding && (
          <div className="mb-4 p-4 border rounded-md bg-background">
            <h3 className="text-sm font-medium mb-2">Новая дополнительная работа</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Вид работы</label>
                <Input
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  placeholder="Например: Уборка"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Затраченное время (ч)</label>
                <Input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  min="0.1"
                  step="0.1"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Описание</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Описание выполненной работы"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Отмена
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Сохранить
              </Button>
            </div>
          </div>
        )}

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Вид работы</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead className="text-right">Время (ч)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {additionalWorks.map((work) => (
                <TableRow key={work.id}>
                  <TableCell className="font-medium">{work.type}</TableCell>
                  <TableCell>{work.description}</TableCell>
                  <TableCell className="text-right">{work.hours}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdditionalWork;
