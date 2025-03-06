
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, PieChart, ArrowUpRight, ArrowDownRight, Clock, Users, Settings } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Link } from "react-router-dom";

const data = [
  { name: "Jan", value: 2400 },
  { name: "Feb", value: 1398 },
  { name: "Mar", value: 9800 },
  { name: "Apr", value: 3908 },
  { name: "May", value: 4800 },
  { name: "Jun", value: 3800 },
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
            <Link to="/time-tracking">
              <Clock className="h-5 w-5 mr-2" />
              Учет времени
            </Link>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Общее количество сотрудников</p>
              <h2 className="text-2xl font-bold">25</h2>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/employee-settings">Управление сотрудниками</Link>
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
              <p className="text-sm text-muted-foreground">Среднее время простоя</p>
              <h2 className="text-2xl font-bold">1.2 ч/день</h2>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <ArrowDownRight className="h-4 w-4 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/time-tracking">Детали учета</Link>
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
                <XAxis dataKey="name" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8989DE"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Быстрые действия</h3>
          <div className="space-y-4">
            <Button className="w-full justify-start" asChild>
              <Link to="/time-tracking">
                <Clock className="mr-2 h-4 w-4" />
                Учет рабочего времени
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/employee-settings">
                <Settings className="mr-2 h-4 w-4" />
                Настройка норм времени
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/analytics">
                <PieChart className="mr-2 h-4 w-4" />
                Просмотр аналитики
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
