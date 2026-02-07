import {
  FileText,
  Receipt,
  ShoppingCart,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import adsystemsLogo from "@/assets/adsystems-logo.png";

const navItems = [
  {
    title: "Quotation",
    url: "/quotation",
    icon: FileText,
    enabled: true,
  },
  {
    title: "Invoice",
    url: "/invoice",
    icon: Receipt,
    enabled: false,
  },
  {
    title: "Purchase Order",
    url: "/purchase-order",
    icon: ShoppingCart,
    enabled: false,
  },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { state: sidebarState } = useSidebar();
  const collapsed = sidebarState === "collapsed";

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="gradient-sidebar">
        {/* Brand header */}
        <div className="p-4 pb-2">
          <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3 px-2"}`}>
            <img
              src={adsystemsLogo}
              alt="Adsystems logo"
              className={`shrink-0 object-contain ${collapsed ? "w-8 h-8" : "w-10 h-10"}`}
            />
            {!collapsed && (
              <h2 className="text-sm font-semibold text-sidebar-primary-foreground">
                Adsystems
              </h2>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 uppercase text-[10px] tracking-widest font-medium">
            Documents
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={location.pathname === item.url}
                  >
                    {item.enabled ? (
                      <NavLink
                        to={item.url}
                        end
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                        activeClassName="bg-sidebar-accent text-sidebar-primary-foreground font-medium"
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="flex-1">{item.title}</span>
                            {location.pathname === item.url && (
                              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                            )}
                          </>
                        )}
                      </NavLink>
                    ) : (
                      <span className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/30 cursor-not-allowed">
                        <item.icon className="w-4 h-4 shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="flex-1">{item.title}</span>
                            <span className="text-[10px] bg-sidebar-accent/60 px-1.5 py-0.5 rounded text-sidebar-foreground/40">
                              Soon
                            </span>
                          </>
                        )}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User footer */}
      <SidebarFooter className="gradient-sidebar border-t border-sidebar-border">
        <div className="p-3">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarImage src={user?.picture} referrerPolicy="no-referrer" />
                <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-medium text-sidebar-foreground truncate">
                    {user?.name}
                  </p>
                  <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 uppercase tracking-wider shrink-0">
                    {user?.branch}
                  </Badge>
                </div>
                <p className="text-[10px] text-sidebar-foreground/50 truncate">
                  {user?.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="h-7 w-7 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.picture} referrerPolicy="no-referrer" />
                <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="w-full h-7 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
