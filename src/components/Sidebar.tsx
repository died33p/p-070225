
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Users, ClipboardList, BarChart } from "lucide-react";

type SidebarItem = {
  title: string;
  href: string;
  icon: React.ElementType;
};

const mainItems: SidebarItem[] = [
  { title: "Главная", href: "/", icon: Home },
  { title: "Сотрудники", href: "/employee-directory", icon: Users },
  { title: "Аналитика", href: "/analytics", icon: BarChart },
  { title: "Доп. работы", href: "/additional-work", icon: ClipboardList },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border py-4 flex flex-col overflow-hidden">
      <div className="px-4">
        <h1 className="text-2xl font-bold text-primary">TimeTracker</h1>
        <p className="text-sm text-muted-foreground">Система учета рабочего времени</p>
      </div>
      
      <nav className="mt-8 flex-1 px-2 space-y-1">
        {mainItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center px-2 py-2 text-sm font-medium rounded-md",
              location.pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.title}
          </Link>
        ))}
      </nav>
      
      <div className="px-4 py-2 border-t border-border">
        <Link
          to="/employee-settings"
          className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Users className="mr-3 h-5 w-5" />
          Настройки учета
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
