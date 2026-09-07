import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Avatar,
    Badge,
    IconButton,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Menu,
    MenuItem,
    Tooltip,
    Chip
} from '@mui/material';

import {
    Dashboard,
    Business,
    People,
    Assignment,
    Notifications,
    Person,
    Settings,
    Logout,
    Menu as MenuIcon,
    Close,
    KeyboardArrowDown,
    CheckCircle,
    Info,
    Warning
} from '@mui/icons-material';

import { Link, useLocation } from 'react-router-dom';


// ======================================================
// COLORES CORPORATIVOS
// ======================================================

const COLORS = {
    navy: '#062B49',
    navyDark: '#041F35',
    navyLight: '#0B3C63',

    yellow: '#FDD100',
    yellowHover: '#FFE05A',

    white: '#FFFFFF',
    textLight: '#D9E4ED',

    hover: 'rgba(255,255,255,0.08)',
    active: 'rgba(253,209,0,0.14)',

    border: 'rgba(255,255,255,0.10)'
};


// ======================================================
// LOGO
// ======================================================

const BrandLogo = () => {
    return (
        <Box
            sx={{
                width: 46,
                height: 46,
                borderRadius: '13px',
                background: `linear-gradient(135deg, ${COLORS.yellow}, #E8B900)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 5px 18px rgba(253,209,0,0.25)',
                flexShrink: 0
            }}
        >
            <Typography
                sx={{
                    color: COLORS.navyDark,
                    fontSize: '27px',
                    fontWeight: 900,
                    fontFamily: 'Arial, sans-serif',
                    lineHeight: 1
                }}
            >
                C
            </Typography>

            <Box
                sx={{
                    position: 'absolute',
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: COLORS.navy,
                    top: 8,
                    right: 8
                }}
            />

            <Box
                sx={{
                    position: 'absolute',
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: COLORS.navy,
                    bottom: 7,
                    left: 8
                }}
            />
        </Box>
    );
};


// ======================================================
// NAVBAR
// ======================================================

const Navbar = () => {

    const location = useLocation();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [notificationAnchor, setNotificationAnchor] = useState(null);
    const [profileAnchor, setProfileAnchor] = useState(null);


    // ==================================================
    // OPCIONES DE NAVEGACIÓN
    // ==================================================

    const navItems = [
        {
            path: '/',
            label: 'Dashboard',
            icon: <Dashboard />
        },
        {
            path: '/departamentos',
            label: 'Departamentos',
            icon: <Business />
        },
        {
            path: '/empleados',
            label: 'Empleados',
            icon: <People />
        },
        {
            path: '/proyectos',
            label: 'Proyectos',
            icon: <Assignment />
        }
    ];


    // ==================================================
    // VALIDAR RUTA ACTIVA
    // ==================================================

    const isActive = (path) => {

        if (path === '/') {
            return location.pathname === '/';
        }

        return location.pathname.startsWith(path);
    };


    // ==================================================
    // MOBILE DRAWER
    // ==================================================

    const handleMobileNavigation = () => {
        setMobileOpen(false);
    };


    // ==================================================
    // NOTIFICACIONES
    // ==================================================

    const handleNotificationOpen = (event) => {
        setNotificationAnchor(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setNotificationAnchor(null);
    };


    // ==================================================
    // PERFIL
    // ==================================================

    const handleProfileOpen = (event) => {
        setProfileAnchor(event.currentTarget);
    };

    const handleProfileClose = () => {
        setProfileAnchor(null);
    };


    // ==================================================
    // DRAWER
    // ==================================================

    const drawerContent = (
        <Box
            sx={{
                width: 285,
                height: '100%',
                background: COLORS.navyDark,
                color: COLORS.white
            }}
        >

            {/* HEADER DRAWER */}
            <Box
                sx={{
                    height: 78,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2.5,
                    borderBottom: `1px solid ${COLORS.border}`
                }}
            >

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5
                    }}
                >

                    <BrandLogo />

                    <Box>
                        <Typography
                            sx={{
                                fontWeight: 800,
                                fontSize: '18px'
                            }}
                        >
                            Cavipetrol
                        </Typography>

                        <Typography
                            sx={{
                                color: COLORS.textLight,
                                fontSize: '11px'
                            }}
                        >
                            Gestión Empresarial
                        </Typography>
                    </Box>

                </Box>

                <IconButton
                    onClick={() => setMobileOpen(false)}
                    sx={{
                        color: COLORS.white
                    }}
                >
                    <Close />
                </IconButton>

            </Box>


            {/* MENÚ */}
            <List sx={{ px: 1.5, py: 2 }}>

                {navItems.map((item) => {

                    const active = isActive(item.path);

                    return (
                        <ListItemButton
                            key={item.path}
                            component={Link}
                            to={item.path}
                            onClick={handleMobileNavigation}
                            sx={{
                                borderRadius: '12px',
                                mb: 0.7,
                                minHeight: 50,

                                backgroundColor: active
                                    ? COLORS.active
                                    : 'transparent',

                                color: active
                                    ? COLORS.yellow
                                    : COLORS.textLight,

                                borderLeft: active
                                    ? `3px solid ${COLORS.yellow}`
                                    : '3px solid transparent',

                                '&:hover': {
                                    backgroundColor: COLORS.hover,
                                    color: COLORS.white
                                }
                            }}
                        >

                            <ListItemIcon
                                sx={{
                                    minWidth: 42,
                                    color: 'inherit'
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>

                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{
                                    fontWeight: active ? 700 : 500,
                                    fontSize: '14px'
                                }}
                            />

                        </ListItemButton>
                    );
                })}

            </List>


            <Divider
                sx={{
                    borderColor: COLORS.border,
                    mx: 2
                }}
            />


            {/* USUARIO MOBILE */}
            <Box sx={{ p: 2.5 }}>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5
                    }}
                >

                    <Avatar
                        sx={{
                            width: 42,
                            height: 42,
                            bgcolor: COLORS.yellow,
                            color: COLORS.navyDark,
                            fontWeight: 800
                        }}
                    >
                        AD
                    </Avatar>

                    <Box>
                        <Typography
                            sx={{
                                fontSize: '14px',
                                fontWeight: 700
                            }}
                        >
                            Administrador
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: '11px',
                                color: COLORS.textLight
                            }}
                        >
                            Gestión empresarial
                        </Typography>
                    </Box>

                </Box>

            </Box>

        </Box>
    );


    return (
        <>
            {/* ==================================================
                APP BAR
            ================================================== */}

            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    zIndex: 1201,

                    height: {
                        xs: '70px',
                        md: '78px'
                    },

                    background: `
                        linear-gradient(
                            135deg,
                            ${COLORS.navyDark} 0%,
                            ${COLORS.navy} 55%,
                            ${COLORS.navyLight} 100%
                        )
                    `,

                    borderBottom: `1px solid ${COLORS.border}`,

                    boxShadow: `
                        0 8px 25px rgba(4,31,53,0.18)
                    `,

                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: `
                            linear-gradient(
                                90deg,
                                transparent,
                                ${COLORS.yellow},
                                transparent
                            )
                        `
                    }
                }}
            >

                <Toolbar
                    sx={{
                        height: '100%',
                        minHeight: 'unset !important',
                        px: {
                            xs: 2,
                            md: 3
                        },

                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >

                    {/* ==================================================
                        BRAND
                    ================================================== */}

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            minWidth: {
                                xs: 'auto',
                                md: 230
                            }
                        }}
                    >

                        {/* MOBILE MENU */}
                        <IconButton
                            onClick={() => setMobileOpen(true)}
                            sx={{
                                display: {
                                    xs: 'flex',
                                    md: 'none'
                                },

                                color: COLORS.white,
                                mr: 0.5,

                                '&:hover': {
                                    backgroundColor: COLORS.hover
                                }
                            }}
                        >
                            <MenuIcon />
                        </IconButton>


                        <BrandLogo />


                        <Box
                            sx={{
                                display: {
                                    xs: 'none',
                                    sm: 'block'
                                }
                            }}
                        >

                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    fontSize: {
                                        sm: '17px',
                                        md: '19px'
                                    },
                                    letterSpacing: '0.2px',
                                    lineHeight: 1.2,
                                    color: COLORS.white
                                }}
                            >
                                Cavipetrol
                            </Typography>

                            <Typography
                                sx={{
                                    color: COLORS.textLight,
                                    fontSize: '10px',
                                    mt: 0.3,
                                    letterSpacing: '0.4px'
                                }}
                            >
                                SISTEMA DE GESTIÓN EMPRESARIAL
                            </Typography>

                        </Box>

                    </Box>


                    {/* ==================================================
                        NAVEGACIÓN DESKTOP
                    ================================================== */}

                    <Box
                        sx={{
                            display: {
                                xs: 'none',
                                md: 'flex'
                            },

                            alignItems: 'center',
                            gap: 0.5,

                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)'
                        }}
                    >

                        {navItems.map((item) => {

                            const active = isActive(item.path);

                            return (
                                <Button
                                    key={item.path}
                                    component={Link}
                                    to={item.path}
                                    startIcon={item.icon}
                                    aria-current={active ? 'page' : undefined}
                                    sx={{
                                        position: 'relative',

                                        color: active
                                            ? COLORS.yellow
                                            : COLORS.textLight,

                                        backgroundColor: active
                                            ? COLORS.active
                                            : 'transparent',

                                        borderRadius: '10px',

                                        px: {
                                            md: 1.4,
                                            lg: 1.8
                                        },

                                        py: 1,

                                        minHeight: 42,

                                        fontSize: '13px',

                                        fontWeight: active
                                            ? 700
                                            : 500,

                                        textTransform: 'none',

                                        transition: 'all 0.2s ease',

                                        '& .MuiButton-startIcon': {
                                            marginRight: 0.8,

                                            '& svg': {
                                                fontSize: '19px'
                                            }
                                        },

                                        '&:hover': {
                                            backgroundColor: active
                                                ? COLORS.active
                                                : COLORS.hover,

                                            color: active
                                                ? COLORS.yellowHover
                                                : COLORS.white
                                        },

                                        '&::after': active
                                            ? {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: -11,
                                                left: '20%',
                                                right: '20%',
                                                height: '3px',
                                                borderRadius: '3px 3px 0 0',
                                                backgroundColor: COLORS.yellow
                                            }
                                            : {}
                                    }}
                                >
                                    {item.label}
                                </Button>
                            );

                        })}

                    </Box>


                    {/* ==================================================
                        ACCIONES
                    ================================================== */}

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: {
                                xs: 0.5,
                                md: 1
                            }
                        }}
                    >

                        {/* NOTIFICACIONES */}

                        <Tooltip title="Notificaciones">

                            <IconButton
                                onClick={handleNotificationOpen}
                                sx={{
                                    width: 42,
                                    height: 42,
                                    color: COLORS.textLight,

                                    '&:hover': {
                                        backgroundColor: COLORS.hover,
                                        color: COLORS.white
                                    }
                                }}
                            >

                                <Badge
                                    badgeContent={3}
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            backgroundColor: COLORS.yellow,
                                            color: COLORS.navyDark,
                                            fontWeight: 800,
                                            fontSize: '10px',
                                            minWidth: 18,
                                            height: 18
                                        }
                                    }}
                                >
                                    <Notifications />
                                </Badge>

                            </IconButton>

                        </Tooltip>


                        {/* PERFIL */}

                        <Button
                            onClick={handleProfileOpen}
                            endIcon={
                                <KeyboardArrowDown
                                    sx={{
                                        fontSize: '18px !important'
                                    }}
                                />
                            }
                            sx={{
                                display: {
                                    xs: 'none',
                                    sm: 'flex'
                                },

                                textTransform: 'none',
                                color: COLORS.white,
                                borderRadius: '12px',
                                px: 1,

                                '&:hover': {
                                    backgroundColor: COLORS.hover
                                }
                            }}
                        >

                            <Avatar
                                sx={{
                                    width: 38,
                                    height: 38,
                                    mr: 1,

                                    bgcolor: COLORS.yellow,
                                    color: COLORS.navyDark,

                                    fontSize: '13px',
                                    fontWeight: 800,

                                    boxShadow:
                                        '0 4px 12px rgba(253,209,0,0.2)'
                                }}
                            >
                                AD
                            </Avatar>

                            <Box
                                sx={{
                                    textAlign: 'left',
                                    display: {
                                        xs: 'none',
                                        lg: 'block'
                                    }
                                }}
                            >

                                <Typography
                                    sx={{
                                        fontSize: '12px',
                                        fontWeight: 700,
                                        lineHeight: 1.2
                                    }}
                                >
                                    Administrador
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: '10px',
                                        color: COLORS.textLight
                                    }}
                                >
                                    Sistema
                                </Typography>

                            </Box>

                        </Button>

                    </Box>

                </Toolbar>

            </AppBar>


            {/* ==================================================
                DRAWER MOBILE
            ================================================== */}

            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                ModalProps={{
                    keepMounted: true
                }}
                sx={{
                    zIndex: 1300,

                    '& .MuiDrawer-paper': {
                        border: 'none'
                    }
                }}
            >
                {drawerContent}
            </Drawer>


            {/* ==================================================
                MENÚ NOTIFICACIONES
            ================================================== */}

            <Menu
                anchorEl={notificationAnchor}
                open={Boolean(notificationAnchor)}
                onClose={handleNotificationClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                PaperProps={{
                    sx: {
                        mt: 1,
                        width: 340,
                        borderRadius: '14px',
                        overflow: 'hidden',

                        boxShadow:
                            '0 15px 45px rgba(4,31,53,0.20)'
                    }
                }}
            >

                <Box
                    sx={{
                        px: 2,
                        py: 1.5,
                        background: COLORS.navy,
                        color: COLORS.white
                    }}
                >

                    <Typography
                        sx={{
                            fontWeight: 800,
                            fontSize: '14px'
                        }}
                    >
                        Notificaciones
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: '11px',
                            color: COLORS.textLight,
                            mt: 0.3
                        }}
                    >
                        Tienes 3 notificaciones pendientes
                    </Typography>

                </Box>


                <MenuItem
                    onClick={handleNotificationClose}
                    sx={{
                        py: 1.5,
                        gap: 1.2,
                        whiteSpace: 'normal'
                    }}
                >

                    <CheckCircle
                        sx={{
                            color: '#2E7D32',
                            fontSize: 22
                        }}
                    />

                    <Box>
                        <Typography
                            sx={{
                                fontSize: '13px',
                                fontWeight: 700
                            }}
                        >
                            Proyecto actualizado
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: '11px',
                                color: 'text.secondary'
                            }}
                        >
                            Se actualizó la información de un proyecto.
                        </Typography>
                    </Box>

                </MenuItem>


                <MenuItem
                    onClick={handleNotificationClose}
                    sx={{
                        py: 1.5,
                        gap: 1.2,
                        whiteSpace: 'normal'
                    }}
                >

                    <Info
                        sx={{
                            color: COLORS.navy,
                            fontSize: 22
                        }}
                    />

                    <Box>
                        <Typography
                            sx={{
                                fontSize: '13px',
                                fontWeight: 700
                            }}
                        >
                            Nuevo empleado
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: '11px',
                                color: 'text.secondary'
                            }}
                        >
                            Se registró un nuevo empleado.
                        </Typography>
                    </Box>

                </MenuItem>


                <MenuItem
                    onClick={handleNotificationClose}
                    sx={{
                        py: 1.5,
                        gap: 1.2,
                        whiteSpace: 'normal'
                    }}
                >

                    <Warning
                        sx={{
                            color: '#ED6C02',
                            fontSize: 22
                        }}
                    />

                    <Box>
                        <Typography
                            sx={{
                                fontSize: '13px',
                                fontWeight: 700
                            }}
                        >
                            Revisión pendiente
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: '11px',
                                color: 'text.secondary'
                            }}
                        >
                            Hay información pendiente de revisión.
                        </Typography>
                    </Box>

                </MenuItem>

            </Menu>


            {/* ==================================================
                MENÚ PERFIL
            ================================================== */}

            <Menu
                anchorEl={profileAnchor}
                open={Boolean(profileAnchor)}
                onClose={handleProfileClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                PaperProps={{
                    sx: {
                        mt: 1,
                        width: 220,
                        borderRadius: '14px',
                        boxShadow:
                            '0 15px 45px rgba(4,31,53,0.20)'
                    }
                }}
            >

                <Box sx={{ px: 2, py: 1.5 }}>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.2
                        }}
                    >

                        <Avatar
                            sx={{
                                width: 40,
                                height: 40,
                                bgcolor: COLORS.yellow,
                                color: COLORS.navyDark,
                                fontWeight: 800
                            }}
                        >
                            AD
                        </Avatar>

                        <Box>

                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    fontSize: '13px'
                                }}
                            >
                                Administrador
                            </Typography>

                            <Chip
                                label="Activo"
                                size="small"
                                sx={{
                                    mt: 0.5,
                                    height: 20,
                                    fontSize: '10px',
                                    fontWeight: 700
                                }}
                            />

                        </Box>

                    </Box>

                </Box>


                <Divider />


                <MenuItem onClick={handleProfileClose}>

                    <ListItemIcon>
                        <Person fontSize="small" />
                    </ListItemIcon>

                    <ListItemText
                        primary="Mi perfil"
                        primaryTypographyProps={{
                            fontSize: '13px'
                        }}
                    />

                </MenuItem>


                <MenuItem onClick={handleProfileClose}>

                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>

                    <ListItemText
                        primary="Configuración"
                        primaryTypographyProps={{
                            fontSize: '13px'
                        }}
                    />

                </MenuItem>


                <Divider />


                <MenuItem
                    onClick={handleProfileClose}
                    sx={{
                        color: '#C62828'
                    }}
                >

                    <ListItemIcon>
                        <Logout
                            fontSize="small"
                            sx={{
                                color: '#C62828'
                            }}
                        />
                    </ListItemIcon>

                    <ListItemText
                        primary="Cerrar sesión"
                        primaryTypographyProps={{
                            fontSize: '13px',
                            fontWeight: 600
                        }}
                    />

                </MenuItem>

            </Menu>

        </>
    );
};


export default Navbar;