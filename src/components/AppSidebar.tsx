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
          {!collapsed && (
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-sm">
                <FileText className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-sidebar-primary-foreground">
                  Adsystem
                </h2>
                <p className="text-[11px] text-sidebar-foreground/60">
                  {user?.branch?.toUpperCase()} branch
                </p>
              </div>
            </div>
          )}
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
                <AvatarImage src={user?.picture} />
                <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-sidebar-foreground truncate">
                  {user?.name}
                </p>
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
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="w-full h-8 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
