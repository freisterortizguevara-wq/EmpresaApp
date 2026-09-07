import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/common/Navbar';
import Dashboard from './pages/Dashboard';
import DepartamentoList from './components/departamentos/DepartamentoList';
import EmpleadoList from './components/empleados/EmpleadoList';
import ProyectoList from './components/proyectos/ProyectoList';

// 🎨 Colores corporativos Cavipetrol
const cavipetrolTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#003366',      // Azul oscuro Cavipetrol
            light: '#004C99',
            dark: '#002244',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#0077BE',      // Azul marino
            light: '#0099E6',
            dark: '#005588',
            contrastText: '#FFFFFF',
        },
        accent: {
            main: '#FFD700',      // Dorado
            light: '#FFE44D',
            dark: '#CC9900',
        },
        background: {
            default: '#F5F7FA',
            paper: '#FFFFFF',
        },
        success: {
            main: '#28A745',
            light: '#48C774',
            dark: '#1E7E34',
        },
        warning: {
            main: '#FFC107',
            light: '#FFD54F',
            dark: '#FF8F00',
        },
        error: {
            main: '#DC3545',
            light: '#E57373',
            dark: '#C62828',
        },
        info: {
            main: '#0077BE',
            light: '#4FC3F7',
            dark: '#01579B',
        },
        text: {
            primary: '#1A1A2E',
            secondary: '#4A4A5A',
            disabled: '#9E9E9E',
        },
        divider: '#E8ECF0',
    },
    typography: {
        fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 700, color: '#003366' },
        h2: { fontWeight: 700, color: '#003366' },
        h3: { fontWeight: 700, color: '#003366' },
        h4: {
            fontWeight: 700,
            color: '#003366',
            letterSpacing: '-0.5px',
        },
        h5: {
            fontWeight: 600,
            color: '#003366',
            letterSpacing: '-0.3px',
        },
        h6: {
            fontWeight: 600,
            color: '#1A1A2E',
        },
        subtitle1: {
            fontWeight: 500,
            color: '#4A4A5A',
        },
        subtitle2: {
            fontWeight: 400,
            color: '#6B6B7B',
        },
        body1: {
            color: '#1A1A2E',
        },
        body2: {
            color: '#4A4A5A',
        },
        button: {
            fontWeight: 600,
            textTransform: 'none',
            letterSpacing: '0.3px',
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        // AppBar - Barra superior
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#003366',
                    backgroundImage: 'linear-gradient(135deg, #003366 0%, #0077BE 100%)',
                    boxShadow: '0 4px 20px rgba(0,51,102,0.25)',
                },
            },
        },
        // Botones
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '8px 20px',
                    transition: 'all 0.3s ease',
                },
                contained: {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    '&:hover': {
                        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                        transform: 'translateY(-2px)',
                    },
                },
                containedPrimary: {
                    backgroundColor: '#003366',
                    '&:hover': {
                        backgroundColor: '#002244',
                    },
                },
                containedSecondary: {
                    backgroundColor: '#0077BE',
                    '&:hover': {
                        backgroundColor: '#005588',
                    },
                },
                outlinedPrimary: {
                    borderColor: '#003366',
                    color: '#003366',
                    '&:hover': {
                        backgroundColor: 'rgba(0,51,102,0.04)',
                        borderColor: '#002244',
                    },
                },
            },
        },
        // Tarjetas
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid rgba(0,0,0,0.04)',
                    '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.10)',
                    },
                },
            },
        },
        // Tablas
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: '#003366',
                    '& th': {
                        color: '#FFFFFF',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        letterSpacing: '0.5px',
                        padding: '16px 20px',
                    },
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:nth-of-type(even)': {
                        backgroundColor: '#FAFBFC',
                    },
                    '&:hover': {
                        backgroundColor: '#E8F4FD',
                    },
                    transition: 'background-color 0.2s ease',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    padding: '14px 20px',
                    borderBottom: '1px solid #E8ECF0',
                },
            },
        },
        // Diálogos
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 20,
                    padding: '8px',
                },
            },
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#003366',
                    padding: '24px 24px 8px 24px',
                },
            },
        },
        // TextField
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 10,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#003366',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#003366',
                            borderWidth: 2,
                        },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: '#003366',
                    },
                },
            },
        },
        // Select
        MuiSelect: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                },
            },
        },
        // IconButton
        MuiIconButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        backgroundColor: 'rgba(0,51,102,0.08)',
                    },
                },
            },
        },
        // Chip
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 500,
                },
                colorPrimary: {
                    backgroundColor: '#003366',
                    color: '#FFFFFF',
                },
                colorSecondary: {
                    backgroundColor: '#0077BE',
                    color: '#FFFFFF',
                },
            },
        },
        // Paper
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                },
            },
        },
        // LinearProgress
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    backgroundColor: '#E8ECF0',
                },
                bar: {
                    borderRadius: 8,
                    backgroundImage: 'linear-gradient(90deg, #003366, #0077BE)',
                },
            },
        },
        // Avatar
        MuiAvatar: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                },
            },
        },
        // Tabs
        MuiTabs: {
            styleOverrides: {
                root: {
                    backgroundColor: 'transparent',
                },
                indicator: {
                    backgroundColor: '#FFD700',
                    height: 3,
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    '&.Mui-selected': {
                        color: '#003366',
                    },
                },
            },
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={cavipetrolTheme}>
            <CssBaseline />
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/departamentos" element={<DepartamentoList />} />
                    <Route path="/empleados" element={<EmpleadoList />} />
                    <Route path="/proyectos" element={<ProyectoList />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;