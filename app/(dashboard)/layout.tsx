"use client";
import * as React from "react";
import { useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme, useMediaQuery } from "@mui/material";
import { useAuth } from "../../context/auth.context";
import Menu from "../Components/SideNavigationMenu/Menu";

const drawerWidth = 240;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = React.useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--main-background)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--secondary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "var(--main-background)" }}>
      <CssBaseline />

      {/* Top Header Bar - Glass */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "var(--natural)",
          color: "var(--primary)",
          boxShadow: "var(--shadow-sm)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 2, sm: 3 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ color: "var(--text-secondary)" }}
            >
              <MenuIcon />
            </IconButton>

            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative w-7 h-7 flex-shrink-0">
                <div className="absolute inset-0 bg-[var(--secondary)] rounded-lg transform -rotate-6 opacity-60 blur-[2px]"></div>
                <div className="absolute inset-0 bg-[var(--secondary)] rounded-lg transform rotate-2 opacity-80"></div>
                <div className="absolute inset-0 bg-[var(--secondary)] rounded-lg flex items-center justify-center" style={{ boxShadow: 'var(--shadow-rose)' }}>
                  <span className="text-[var(--btn-primary-text)] text-sm font-black">P</span>
                </div>
              </div>
              <span className="text-[var(--primary)] font-black text-xl tracking-tight">Postilio</span>
            </Link>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <div className="w-8 h-8 rounded-full bg-[var(--secondary-dim)] text-[var(--secondary)] flex items-center justify-center font-bold text-sm border border-[var(--secondary-dim)]">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="text-xs font-bold text-[var(--text-secondary)] hidden sm:inline">{user?.name}</span>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={isMobile ? drawerOpen : false}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            border: "none",
          },
        }}
      >
        <Menu />
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={!isMobile && drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "1px solid var(--border)",
            background: "var(--main-background)",
          },
        }}
      >
        <Menu />
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "var(--main-background)",
          minHeight: "100vh",
          marginLeft: {
            xs: 0,
            md: drawerOpen && !isMobile ? `${drawerWidth}px` : 0,
          },
          transition: (theme) =>
            theme.transitions.create("margin", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Toolbar />
        <Box sx={{ p: 4 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
