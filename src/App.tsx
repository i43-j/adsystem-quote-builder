import { forwardRef } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  NavLink as RouterNavLink,
  NavLinkProps,
  useLocation,
} from "react-router-dom";
import {
  FileText,
  Receipt,
  ShoppingCart,
  ClipboardCheck,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { AuthProvider, useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { LoginPage } from "@/pages/LoginPage";
import QuotationPage from "@/pages/QuotationPage";
import InvoicePage from "@/pages/InvoicePage";
import PurchaseOrderPage from "@/pages/PurchaseOrderPage";
import AcknowledgementReceiptPage from "@/pages/AcknowledgementReceiptPage";
import NotFound from "@/pages/NotFound";
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
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import adsystemsLogo from "@/assets/adsystems-logo.png";

const queryClient = new QueryClient();

/* ── NavLink (inlined) ────────────────────────────────── */

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
        {...props}
      />
    );
  },
);
NavLink.displayName = "NavLink";

/* ── AppSidebar (inlined) ─────────────────────────────── */

const navItems = [
  { title: "Quotation", url: "/quotation", icon: FileText, enabled: true },
  { title: "Acknowledgement Receipt", url: "/acknowledgement-receipt", icon: ClipboardCheck, enabled: true },
  { title: "Invoice", url: "/invoice", icon: Receipt, enabled: false },
  { title: "Purchase Order", url: "/purchase-order", icon: ShoppingCart, enabled: false },
];

function AppSidebar() {
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

/* ── AppLayout (inlined) ──────────────────────────────── */

function AppLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 px-4 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <Separator orientation="vertical" className="h-5" />
            <div className="flex-1" />
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

/* ── LoginRoute ───────────────────────────────────────── */

function LoginRoute() {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (user) return <Navigate to="/quotation" replace />;
  return <LoginPage />;
}

/* ── App ──────────────────────────────────────────────── */

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginRoute />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/quotation" replace />} />
              <Route path="/quotation" element={<QuotationPage />} />
              <Route path="/acknowledgement-receipt" element={<AcknowledgementReceiptPage />} />
              <Route path="/invoice" element={<InvoicePage />} />
              <Route path="/purchase-order" element={<PurchaseOrderPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
