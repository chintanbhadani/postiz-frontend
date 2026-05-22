import {
    Avatar,
    Box,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
// import { HeadlineSmall } from "../../Typography/headline";
// import { BodyMedium } from "../../Typography/body";
import { useDispatch, useSelector } from "react-redux";
// import {
//     setLoggedUser,
//     setToken,
//     setRefreshToken,
//     setSelectedProjectForChat,
//     setSelectedUserForChat,
//     setChatSideBarLoaded,
//     setMessageModalOpen,
//     setCalculatorModalOpen,
//     setDraftProjectWarningModalOpen,
//     setTopMessage,
//     clearHiddenAlerts
// } from "@/lib/slice/Base";
import { useRouter } from "next/navigation";
// import { ReduxState } from "@/helper/fe.interface";
import OrdersIcon from "../../../../assets/images/sidebar/sidebar_orders_icon.png";
import Image from "next/image";
// import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import * as React from "react";
import { ReduxState } from "@/helper/fe.interface";
// import { clearAuthCookies } from "@/helper/cookie";

const AccountMenu = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const userDetail = useSelector((state: any) => state?.base?.user);

    const dispatch = useDispatch();
    const router = useRouter();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        // dispatch(setChatSideBarLoaded(false));
    }, []);

    const handleLogOut = async () => {
        sessionStorage.setItem("isLoggingOut", "true");
        // clearAuthCookies();
        // dispatch(setToken(null));
        // dispatch(setRefreshToken(null));
        // dispatch(setLoggedUser(null));
        // dispatch(setSelectedProjectForChat(null));
        // dispatch(setSelectedUserForChat(null));
        // dispatch(setChatSideBarLoaded(false));
        // dispatch(setMessageModalOpen(false));
        // dispatch(setCalculatorModalOpen(false));
        // dispatch(setDraftProjectWarningModalOpen(false));
        // dispatch(setTopMessage([]));
        // dispatch(clearHiddenAlerts());
        localStorage.clear();
        router.push("/");
        sessionStorage.removeItem("redirectAfterLogin");
    };
    const handleTerms = () => {
        window.open("https://www.mastercastingandcad.com/terms-of-use/", "_blank");
    };
    const handlePrivacy = () => {
        window.open("https://www.mastercastingandcad.com/privacy-policy/", "_blank");
    };

    return (
        <>
            <Tooltip title="Account settings">
                <IconButton
                    onClick={handleClick}
                    size="small"
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                >
                    <Avatar sx={{ width: 32, height: 32 }}>
                        {userDetail?.first_name
                            ? userDetail?.first_name?.charAt(0)?.toUpperCase()
                            : userDetail?.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: "auto",
                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                            mt: 1.5,
                            "& .MuiAvatar-root": {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            "&::before": {
                                content: '""',
                                display: "block",
                                position: "absolute",
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: "background.paper",
                                transform: "translateY(-50%) rotate(45deg)",
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem
                    onClick={handleClose}
                    key="user-info"
                    sx={{ "&:hover": { backgroundColor: "transparent" } }}
                >
                    {/* <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <HeadlineSmall>{userDetail?.name || ""}</HeadlineSmall>
                        <BodyMedium variant="body2">{userDetail?.email || ""}</BodyMedium>
                    </Box> */}
                </MenuItem>

                <Divider key="divider-1" />

                <MenuItem
                    key="profile"
                    onClick={() => router.push("profile")}
                    sx={{ "&:hover": { backgroundColor: "transparent" } }}
                >
                    {/* <PersonOutlineIcon
                        style={{ marginRight: 3, color: "rgb(124 124 124)" }}
                    />{" "} */}
                    Account
                </MenuItem>

                <Divider key="divider-2" />

                {userDetail?.permission === 1 && [
                    <MenuItem
                        key="create-order"
                        onClick={() => router.push("order-list")}
                        sx={{ "&:hover": { backgroundColor: "transparent" } }}
                    >
                        <Image
                            src={OrdersIcon}
                            alt="Orders"
                            style={{ marginRight: "5px" }}
                        />{" "}
                        Order
                    </MenuItem>,
                    // <Divider key="divider-3" />,
                    // <MenuItem key="blog" onClick={handleClose}>Blog</MenuItem>,
                    // <MenuItem key="help" onClick={handleClose}>Help Center</MenuItem>,
                    // <MenuItem key="exit" onClick={handleClose}>
                    //   <Box
                    //       sx={{
                    //         display: "flex",
                    //         justifyContent: "space-between",
                    //         width: "100%",
                    //       }}
                    //   >
                    //     Exit Account
                    //     <ListItemIcon sx={{ minWidth: "auto" }}>
                    //       <ArrowOutwardOutlinedIcon fontSize="small" />
                    //     </ListItemIcon>
                    //   </Box>
                    // </MenuItem>,
                    <Divider key="divider-4" />,
                ]}

                <MenuItem
                    key="Exit"
                    component="a"
                    href="https://mastercastingandcad.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ "&:hover": { backgroundColor: "transparent" } }}
                >
                    Exit Account{" "}
                    <OpenInNewIcon fontSize="small" style={{ marginLeft: "auto" }} />
                </MenuItem>

                <MenuItem
                    key="logout"
                    onClick={handleLogOut}
                    sx={{ "&:hover": { backgroundColor: "transparent" } }}
                >
                    Logout
                </MenuItem>

                <Divider key="divider-5" />

                <MenuItem
                    key="privacy"
                    sx={{ "&:hover": { backgroundColor: "transparent" } }}
                >
                    <span onClick={handlePrivacy}>Privacy </span>&nbsp; . &nbsp;
                    <span onClick={handleTerms}> Terms & Conditions</span>
                </MenuItem>
            </Menu>
        </>
    );
};

export default AccountMenu;
