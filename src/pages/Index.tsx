
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { Link } from "react-router-dom";
import { Clock, Users, CalendarClock, ClipboardList, BarChart, ArrowUpRight, ArrowDownRight } from "lucide-react";

const data = [
  { name: "Янв", actual: 152, norm: 168 },
  { name: "Фев", actual: 148, norm: 160 },
  { name: "Мар", actual: 175, norm: 184 },
  { name: "Апр", actual: 162, norm: 168 },
  { name: "Май", actual: 155, norm: 168 },
  { name: "Июн", actual: 168, norm: 176 },
];

const Index = () => {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary">Система учета рабочего времени</h1>
          <p className="text-secondary-foreground">Контроль и анализ рабочего времени сотрудников</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button className="glass-card px-4 py-2 rounded-lg hover-scale" asChild>
            <Link to="/analytics">
              <Clock className="h-5 w-5 mr-2" />
              Аналитика и учет
            </Link>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Сотрудников</p>
              <h2 className="text-2xl font-bold">25</h2>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/employee-directory">Перейти к справочнику</Link>
            </Button>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Средняя эффективность</p>
              <h2 className="text-2xl font-bold">87%</h2>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/analytics">Анализ эффективности</Link>
            </Button>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Доп. работ за месяц</p>
              <h2 className="text-2xl font-bold">42</h2>
            </div>
            <div className="p-2 bg-purple-100 rounded-full">
              <ClipboardList className="h-4 w-4 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/additional-work">Журнал доп. работ</Link>
            </Button>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Простои</p>
              <h2 className="text-2xl font-bold">1.4 ч/день</h2>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <ArrowDownRight className="h-4 w-4 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/analytics?tab=timetracking">Детали учета</Link>
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Статистика рабочего времени (последние 6 месяцев)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Фактические часы"
                  stroke="#8989DE"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="norm"
                  name="Нормативные часы"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Быстрые действия</h3>
          <div className="space-y-4">
            <Button className="w-full justify-start" asChild>
              <Link to="/analytics?tab=timetracking">
                <Clock className="mr-2 h-4 w-4" />
                Учет рабочего времени
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/employee-directory">
                <Users className="mr-2 h-4 w-4" />
                Справочник сотрудников
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/time-sheet">
                <CalendarClock className="mr-2 h-4 w-4" />
                Табель учета
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/additional-work">
                <ClipboardList className="mr-2 h-4 w-4" />
                Журнал доп. работ
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/analytics">
                <BarChart className="mr-2 h-4 w-4" />
                Аналитика
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
