import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Home, Users, ClipboardList, BarChart, Settings, HelpCircle, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

type SidebarItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

const mainItems: SidebarItem[] = [
  { title: "Главная", href: "/", icon: Home },
  { title: "Сотрудники", href: "/employee-directory", icon: Users },
  { title: "Аналитика", href: "/analytics", icon: BarChart },
  { title: "График", href: "/timesheet", icon: Calendar },
  { title: "Журнал", href: "/additional-work", icon: ClipboardList },
];

const settingsItems: SidebarItem[] = [
  { title: "Параметры учета", href: "/employee-settings", icon: Settings },
  { title: "Справка", href: "/help", icon: HelpCircle },
];

interface SidebarProps {
  onToggle?: (collapsed: boolean) => void;
}

const SidebarItem = ({ item, isCollapsed, isActive }: { 
  item: SidebarItem; 
  isCollapsed: boolean; 
  isActive: boolean;
}) => (
  <Link
    to={item.href}
    className={cn(
      "flex items-center py-2 text-sm font-medium rounded-md",
      isCollapsed ? "justify-center px-0" : "px-2",
      isActive
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    )}
  >
    <item.icon className="h-5 w-5 flex-shrink-0" />
    {!isCollapsed && (
      <span
        className={cn(
          "ml-3 transition-all duration-300",
          isCollapsed ? "opacity-0 translate-x-[-10px]" : "opacity-100 translate-x-0"
        )}
      >
        {item.title}
      </span>
    )}
  </Link>
);

const Sidebar = ({ onToggle }: SidebarProps) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    onToggle?.(isCollapsed);
  }, [isCollapsed, onToggle]);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col overflow-hidden transition-all duration-300",
        "bg-card border-r border-border py-4",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="px-4 flex justify-between items-center">
        {!isCollapsed && (
          <h1
            className={cn(
              "text-2xl font-bold text-primary transition-opacity duration-300",
              isCollapsed ? "opacity-0" : "opacity-100"
            )}
          >
            TimeTracker
          </h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Развернуть боковую панель" : "Свернуть боковую панель"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="mt-8 flex-1 px-2 space-y-1">
        {mainItems.map((item) => (
          <SidebarItem
            key={item.href}
            item={item}
            isCollapsed={isCollapsed}
            isActive={location.pathname === item.href}
          />
        ))}
      </nav>

      <div className="px-2 py-2 border-t border-border mt-auto">
        {!isCollapsed && (
          <div
            className={cn(
              "mb-2 px-2 text-xs font-semibold text-muted-foreground transition-opacity duration-300",
              isCollapsed ? "opacity-0" : "opacity-100"
            )}
          >
            НАСТРОЙКИ
          </div>
        )}
        <div className="space-y-1">
          {settingsItems.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              isCollapsed={isCollapsed}
              isActive={location.pathname === item.href}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
