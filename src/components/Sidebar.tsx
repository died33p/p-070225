
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Users, ClipboardList, BarChart, Settings, HelpCircle, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

type SidebarItem = {
  title: string;
  href: string;
  icon: React.ElementType;
};

const mainItems: SidebarItem[] = [
  { title: "Главная", href: "/", icon: Home },
  { title: "Сотрудники", href: "/employee-directory", icon: Users },
  { title: "Аналитика", href: "/analytics", icon: BarChart },
  { title: "График", href: "/timesheet", icon: Calendar },
  { title: "Доп. работы", href: "/additional-work", icon: ClipboardList },
];

const settingsItems: SidebarItem[] = [
  { title: "Параметры учета", href: "/employee-settings", icon: Settings },
  { title: "Справка", href: "/help", icon: HelpCircle },
];

interface SidebarProps {
  onToggle?: (collapsed: boolean) => void;
}

const Sidebar = ({ onToggle }: SidebarProps) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (onToggle) {
      onToggle(isCollapsed);
    }
  }, [isCollapsed, onToggle]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 bg-card border-r border-border py-4 flex flex-col overflow-hidden transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="px-4 flex justify-between items-center">
        {!isCollapsed && (
          <>
            <h1 className="text-2xl font-bold text-primary">TimeTracker</h1>
          </>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={toggleSidebar}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
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
            <item.icon className="h-5 w-5" />
            {!isCollapsed && <span className="ml-3">{item.title}</span>}
          </Link>
        ))}
      </nav>
      
      <div className="px-2 py-2 border-t border-border mt-auto">
        {!isCollapsed && (
          <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
            НАСТРОЙКИ
          </div>
        )}
        <div className="space-y-1">
          {settingsItems.map((item) => (
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
              <item.icon className="h-5 w-5" />
              {!isCollapsed && <span className="ml-3">{item.title}</span>}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
