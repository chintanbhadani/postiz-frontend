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
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#030712" }}>
      <CssBaseline />

      {/* Top Header Bar - Glass */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "rgba(15, 23, 42, 0.55)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          color: "#f9fafb",
          boxShadow: "none",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
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
              sx={{ color: "rgba(255,255,255,0.5)" }}
            >
              <MenuIcon />
            </IconButton>

            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative w-7 h-7 flex-shrink-0">
                <div className="absolute inset-0 bg-[#6366f1] rounded-lg transform -rotate-6 opacity-60 blur-[2px]"></div>
                <div className="absolute inset-0 bg-[#6366f1] rounded-lg transform rotate-2 opacity-80"></div>
                <div className="absolute inset-0 bg-[#6366f1] rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.4)]">
                  <span className="text-white text-sm font-black">P</span>
                </div>
              </div>
              <span className="text-white font-black text-xl tracking-tight">Postiz</span>
            </Link>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <div className="w-8 h-8 rounded-full bg-[rgba(99,102,241,0.15)] text-[#6366f1] flex items-center justify-center font-bold text-sm border border-[rgba(99,102,241,0.2)]">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="text-xs font-bold text-gray-300 hidden sm:inline">{user?.name}</span>
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
            borderRight: "1px solid rgba(255, 255, 255, 0.05)",
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
          bgcolor: "#030712",
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
