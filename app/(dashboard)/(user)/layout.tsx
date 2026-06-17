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
import { useAuth } from "@/context/auth.context";
// import { useAuth } from "../../context/auth.context";
import Menu from "../../Components/SideNavigationMenu/Menu";

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#2e7d32] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F9F9FB" }}>
      <CssBaseline />

      {/* Top Header Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "white",
          color: "black",
          boxShadow: "none",
          borderBottom: "1px solid #e5e7eb",
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
            {/* Hamburger Toggle Button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ color: "gray.600" }}
            >
              <MenuIcon />
            </IconButton>

            {/* Postilio Brand/Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-7 h-7 flex-shrink-0">
                <div className="absolute inset-0 bg-[#A3E695] rounded-lg transform -rotate-6"></div>
                <div className="absolute inset-0 bg-[#8CD57E] rounded-lg transform rotate-3 opacity-90"></div>
                <div className="absolute inset-0 bg-[#2e7d32] rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white text-sm font-black">P</span>
                </div>
              </div>
              <span className="text-gray-900 font-black text-xl tracking-tight">Postilio</span>
            </Link>
          </Box>

          {/* User Profile Avatar */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <div className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#2e7d32] flex items-center justify-center font-bold text-sm border border-[#C8E6C9]">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="text-xs font-bold text-gray-700 hidden sm:inline">{user?.name}</span>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer (Temporary overlay) */}
      <Drawer
        variant="temporary"
        open={isMobile ? drawerOpen : false}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
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

      {/* Desktop Drawer (Persistent/Permanent sidebar) */}
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
            borderRight: "1px solid #e5e7eb",
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
          bgcolor: "#F9F9FB",
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
        <Toolbar /> {/* Offsets the content height under the fixed header */}
        <Box sx={{ p: 4 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
