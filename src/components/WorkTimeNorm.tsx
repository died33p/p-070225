
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Clock, Edit, Trash2 } from "lucide-react";

interface WorkTimeNormProps {
  employeeId: string;
  employeeName: string;
}

const WorkTimeNorm = ({ employeeId, employeeName }: WorkTimeNormProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [hours, setHours] = useState<string>("8");
  
  // Sample data for work time norms
  const workNorms = [
    { id: "1", date: new Date(), hours: 8 },
    { id: "2", date: new Date(Date.now() + 86400000), hours: 7 },
    { id: "3", date: new Date(Date.now() + 172800000), hours: 8 },
  ];

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          Установка нормы рабочего времени для {employeeName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Выберите дату</label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>
          
          <div className="md:col-span-2">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Норма часов</label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  min="0"
                  max="24"
                  step="0.5"
                />
                <Button>Установить норму</Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Установленные нормы</h3>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Дата</TableHead>
                      <TableHead>Норма часов</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workNorms.map((norm) => (
                      <TableRow key={norm.id}>
                        <TableCell>{norm.date.toLocaleDateString('ru-RU')}</TableCell>
                        <TableCell>{norm.hours}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 mr-1">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkTimeNorm;
