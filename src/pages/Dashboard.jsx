import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    IconButton,
    LinearProgress,
    Paper,
    Snackbar,
    Stack,
    Tooltip,
    Typography
} from '@mui/material';

import {
    Assignment,
    AttachMoney,
    Business,
    CheckCircle,
    Download,
    Groups,
    MoreVert,
    People,
    Refresh,
    Schedule,
    TrendingUp
} from '@mui/icons-material';

import { Bar, Doughnut, Line } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip as ChartTooltip,
    Legend,
    Filler
} from 'chart.js';

import apiClient from '../api/apiClient';

import * as XLSX from 'xlsx';


// ============================================================
// CHART.JS
// ============================================================

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    ChartTooltip,
    Legend,
    Filler
);


// ============================================================
// DESIGN SYSTEM
// ============================================================

const COLORS = {
    navy: '#082B4C',
    navy2: '#0D3B66',

    teal: '#087F7B',
    tealLight: '#E8F5F4',

    blue: '#2563EB',
    blueLight: '#EFF6FF',

    green: '#15803D',
    greenLight: '#ECFDF3',

    amber: '#B7791F',
    amberLight: '#FFF8E7',

    red: '#C62828',
    redLight: '#FEF2F2',

    background: '#F5F7FA',
    white: '#FFFFFF',

    text: '#102A43',
    muted: '#627D98',

    border: '#E5EAF0',

    grid: '#E9EEF4'
};


// ============================================================
// FORMATTERS
// ============================================================

const formatCOP = value =>
    new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(value || 0);


const formatNumber = value =>
    new Intl.NumberFormat('es-CO').format(value || 0);


// ============================================================
// CARD BASE
// ============================================================

const panelSx = {
    border: `1px solid ${COLORS.border}`,
    borderRadius: '18px',
    boxShadow: '0 2px 10px rgba(16,42,67,0.035)',
    backgroundColor: COLORS.white
};


// ============================================================
// KPI CARD
// ============================================================

const KPICard = ({
    title,
    value,
    subtitle,
    icon,
    color,
    lightColor
}) => (
    <Card
        sx={{
            ...panelSx,
            height: '100%',
            transition: 'all .2s ease',

            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(16,42,67,0.08)'
            }
        }}
    >
        <CardContent sx={{ p: 2.5 }}>

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
            >

                <Box>
                    <Typography
                        sx={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: COLORS.muted,
                            mb: 1
                        }}
                    >
                        {title}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: {
                                xs: 25,
                                md: 29
                            },
                            fontWeight: 800,
                            color: COLORS.text,
                            lineHeight: 1
                        }}
                    >
                        {value}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 12,
                            color: COLORS.muted,
                            mt: 1
                        }}
                    >
                        {subtitle}
                    </Typography>
                </Box>

                <Avatar
                    sx={{
                        width: 44,
                        height: 44,
                        bgcolor: lightColor,
                        color
                    }}
                >
                    {icon}
                </Avatar>

            </Stack>

        </CardContent>
    </Card>
);


// ============================================================
// SECTION HEADER
// ============================================================

const SectionHeader = ({
    title,
    subtitle,
    action
}) => (
    <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2.5 }}
    >

        <Box>

            <Typography
                sx={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: COLORS.text
                }}
            >
                {title}
            </Typography>

            {subtitle && (
                <Typography
                    sx={{
                        fontSize: 12,
                        color: COLORS.muted,
                        mt: .4
                    }}
                >
                    {subtitle}
                </Typography>
            )}

        </Box>

        {action}

    </Stack>
);


// ============================================================
// PROGRESS ROW
// ============================================================

const ProgressRow = ({
    label,
    value,
    percentage,
    color
}) => (

    <Box>

        <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mb: .7 }}
        >

            <Typography
                sx={{
                    fontSize: 13,
                    color: COLORS.muted
                }}
            >
                {label}
            </Typography>

            <Typography
                sx={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: COLORS.text
                }}
            >
                {value}
            </Typography>

        </Stack>

        <LinearProgress
            variant="determinate"
            value={Math.min(percentage, 100)}
            sx={{
                height: 7,
                borderRadius: 10,
                bgcolor: '#EEF2F6',

                '& .MuiLinearProgress-bar': {
                    bgcolor: color,
                    borderRadius: 10
                }
            }}
        />

    </Box>
);


// ============================================================
// DASHBOARD
// ============================================================

const Dashboard = () => {

    const [data, setData] = useState({
        departamentos: [],
        empleados: [],
        proyectos: []
    });

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState('');

    const [notification, setNotification] = useState(false);


    // ========================================================
    // FETCH
    // ========================================================

    const fetchData = useCallback(async () => {

        try {

            setError('');

            const [
                departamentosResponse,
                empleadosResponse,
                proyectosResponse
            ] = await Promise.all([

                apiClient.get('/departamentos'),

                apiClient.get('/empleados'),

                apiClient.get('/proyectos')

            ]);


            setData({

                departamentos:
                    departamentosResponse.data || [],

                empleados:
                    empleadosResponse.data || [],

                proyectos:
                    proyectosResponse.data || []

            });

        } catch (err) {

            console.error(err);

            setError(
                'No fue posible cargar la información del dashboard.'
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }

    }, []);


    useEffect(() => {

        fetchData();

    }, [fetchData]);


    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = async () => {

        setRefreshing(true);

        await fetchData();

        setNotification(true);

    };


    // ========================================================
    // METRICS
    // ========================================================

    const metrics = useMemo(() => {

        const {
            departamentos,
            empleados,
            proyectos
        } = data;


        const activos =
            proyectos.filter(
                p =>
                    String(p.estado || '')
                        .toLowerCase() === 'activo'
            ).length;


        const espera =
            proyectos.filter(
                p =>
                    String(p.estado || '')
                        .toLowerCase() === 'en espera'
            ).length;


        const finalizados =
            proyectos.filter(
                p =>
                    String(p.estado || '')
                        .toLowerCase() === 'finalizado'
            ).length;


        const salarioTotal =
            empleados.reduce(
                (total, empleado) =>
                    total + Number(empleado.salario || 0),
                0
            );


        const salarioPromedio =
            empleados.length
                ? salarioTotal / empleados.length
                : 0;


        const presupuestoTotal =
            proyectos.reduce(
                (total, proyecto) =>
                    total + Number(proyecto.presupuesto || 0),
                0
            );


        const presupuestoActivo =
            proyectos
                .filter(
                    p =>
                        String(p.estado || '')
                            .toLowerCase() !== 'finalizado'
                )
                .reduce(
                    (total, proyecto) =>
                        total + Number(proyecto.presupuesto || 0),
                    0
                );


        const porcentajeActivos =
            proyectos.length
                ? Math.round(
                    (activos / proyectos.length) * 100
                )
                : 0;


        const porcentajePresupuesto =
            presupuestoTotal
                ? Math.round(
                    (presupuestoActivo / presupuestoTotal) * 100
                )
                : 0;


        return {

            totalDepartamentos:
                departamentos.length,

            totalEmpleados:
                empleados.length,

            totalProyectos:
                proyectos.length,

            activos,

            espera,

            finalizados,

            salarioTotal,

            salarioPromedio,

            presupuestoTotal,

            presupuestoActivo,

            porcentajeActivos,

            porcentajePresupuesto

        };

    }, [data]);


    // ========================================================
    // EMPLOYEES BY DEPARTMENT
    // ========================================================

    const empleadosPorDepartamento = useMemo(() => {

        return data.departamentos.map(departamento => {

            const empleados =
                data.empleados.filter(
                    empleado =>
                        empleado.idDepartamento ===
                        departamento.idDepartamento
                );

            return {

                nombre: departamento.nombre,

                cantidad: empleados.length

            };

        });

    }, [data]);


    // ========================================================
    // BAR CHART
    // ========================================================

    const barData = {

        labels:
            empleadosPorDepartamento.map(
                item => item.nombre
            ),

        datasets: [

            {

                label: 'Empleados',

                data:
                    empleadosPorDepartamento.map(
                        item => item.cantidad
                    ),

                backgroundColor: COLORS.navy,

                borderRadius: 7,

                borderSkipped: false,

                maxBarThickness: 42

            }

        ]

    };


    const barOptions = {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {
                display: false
            },

            tooltip: {

                backgroundColor: COLORS.navy,

                padding: 12,

                cornerRadius: 8,

                displayColors: false,

                callbacks: {

                    label: context =>
                        `${context.parsed.y} empleados`

                }

            }

        },

        scales: {

            y: {

                beginAtZero: true,

                ticks: {

                    stepSize: 1,

                    color: COLORS.muted,

                    font: {
                        size: 11
                    }

                },

                grid: {
                    color: COLORS.grid
                },

                border: {
                    display: false
                }

            },

            x: {

                ticks: {

                    color: COLORS.muted,

                    font: {
                        size: 11
                    }

                },

                grid: {
                    display: false
                },

                border: {
                    display: false
                }

            }

        }

    };


    // ========================================================
    // DOUGHNUT
    // ========================================================

    const doughnutData = {

        labels: [
            'Activos',
            'En espera',
            'Finalizados'
        ],

        datasets: [

            {

                data: [
                    metrics.activos,
                    metrics.espera,
                    metrics.finalizados
                ],

                backgroundColor: [
                    COLORS.teal,
                    COLORS.amber,
                    '#DCE3EA'
                ],

                borderWidth: 0,

                hoverOffset: 5

            }

        ]

    };


    const doughnutOptions = {

        responsive: true,

        maintainAspectRatio: false,

        cutout: '76%',

        plugins: {

            legend: {
                display: false
            },

            tooltip: {

                backgroundColor: COLORS.navy,

                padding: 12,

                cornerRadius: 8

            }

        }

    };


    // ========================================================
    // EXPORT EXCEL
    // ========================================================

    const exportarExcel = () => {

        const workbook =
            XLSX.utils.book_new();


        // DEPARTAMENTOS

        const departamentos =
            data.departamentos.map(d => ({

                ID: d.idDepartamento,

                Nombre: d.nombre,

                Descripcion:
                    d.descripcion || '',

                Empleados:
                    data.empleados.filter(
                        e =>
                            e.idDepartamento ===
                            d.idDepartamento
                    ).length

            }));


        XLSX.utils.book_append_sheet(

            workbook,

            XLSX.utils.json_to_sheet(departamentos),

            'Departamentos'

        );


        // EMPLEADOS

        const empleados =
            data.empleados.map(e => ({

                ID: e.idEmpleado,

                Nombre:
                    e.nombre ||
                    e.nombreCompleto ||
                    '',

                Cargo:
                    e.cargo || '',

                Salario:
                    e.salario || 0,

                Departamento:
                    data.departamentos.find(
                        d =>
                            d.idDepartamento ===
                            e.idDepartamento
                    )?.nombre || ''

            }));


        XLSX.utils.book_append_sheet(

            workbook,

            XLSX.utils.json_to_sheet(empleados),

            'Empleados'

        );


        // PROYECTOS

        const proyectos =
            data.proyectos.map(p => ({

                ID: p.idProyecto,

                Nombre:
                    p.nombre || '',

                Estado:
                    p.estado || '',

                Presupuesto:
                    p.presupuesto || 0

            }));


        XLSX.utils.book_append_sheet(

            workbook,

            XLSX.utils.json_to_sheet(proyectos),

            'Proyectos'

        );


        // RESUMEN

        const resumen = [

            {
                Indicador: 'Departamentos',
                Valor: metrics.totalDepartamentos
            },

            {
                Indicador: 'Empleados',
                Valor: metrics.totalEmpleados
            },

            {
                Indicador: 'Proyectos',
                Valor: metrics.totalProyectos
            },

            {
                Indicador: 'Proyectos activos',
                Valor: metrics.activos
            },

            {
                Indicador: 'Salario promedio',
                Valor: metrics.salarioPromedio
            },

            {
                Indicador: 'Presupuesto total',
                Valor: metrics.presupuestoTotal
            }

        ];


        XLSX.utils.book_append_sheet(

            workbook,

            XLSX.utils.json_to_sheet(resumen),

            'Resumen'

        );


        XLSX.writeFile(

            workbook,

            `Reporte_Ejecutivo_${
                new Date()
                    .toISOString()
                    .split('T')[0]
            }.xlsx`

        );

    };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <Box
                sx={{
                    minHeight: '100vh',
                    bgcolor: COLORS.background,
                    p: 4
                }}
            >

                <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        minHeight: '70vh'
                    }}
                >

                    <CircularProgress
                        size={38}
                        sx={{
                            color: COLORS.navy
                        }}
                    />

                    <Typography
                        sx={{
                            mt: 2,
                            fontWeight: 700,
                            color: COLORS.text
                        }}
                    >
                        Cargando dashboard
                    </Typography>

                    <Typography
                        sx={{
                            mt: .5,
                            fontSize: 13,
                            color: COLORS.muted
                        }}
                    >
                        Consultando información empresarial...
                    </Typography>

                </Stack>

            </Box>

        );

    }


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: COLORS.background,

                /*
                 * IMPORTANTE:
                 * evita que el dashboard quede debajo
                 * del navbar superior.
                 */
                pt: {
                    xs: 10,
                    md: 11
                },

                pb: 6
            }}
        >

            <Box
                sx={{
                    width: '100%',
                    maxWidth: 1450,
                    mx: 'auto',
                    px: {
                        xs: 2,
                        sm: 3,
                        lg: 4
                    }
                }}
            >

                {/* =====================================================
                    HEADER
                ====================================================== */}

                <Stack
                    direction={{
                        xs: 'column',
                        md: 'row'
                    }}
                    justifyContent="space-between"
                    alignItems={{
                        xs: 'flex-start',
                        md: 'center'
                    }}
                    gap={2}
                    sx={{
                        mb: 3
                    }}
                >

                    <Box>

                        <Stack
                            direction="row"
                            alignItems="center"
                            gap={1}
                            sx={{ mb: .5 }}
                        >

                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: 24,
                                        md: 29
                                    },
                                    fontWeight: 850,
                                    color: COLORS.text,
                                    letterSpacing: '-.6px'
                                }}
                            >
                                Dashboard ejecutivo
                            </Typography>

                            <Chip
                                label="EN VIVO"
                                size="small"
                                icon={
                                    <Box
                                        component="span"
                                        sx={{
                                            width: 7,
                                            height: 7,
                                            borderRadius: '50%',
                                            bgcolor: COLORS.green
                                        }}
                                    />
                                }
                                sx={{
                                    height: 24,
                                    fontSize: 10,
                                    fontWeight: 800,
                                    bgcolor: COLORS.greenLight,
                                    color: COLORS.green
                                }}
                            />

                        </Stack>

                        <Typography
                            sx={{
                                fontSize: 13,
                                color: COLORS.muted
                            }}
                        >
                            Vista general de la operación empresarial
                        </Typography>

                    </Box>


                    <Stack
                        direction="row"
                        spacing={1}
                    >

                        <Tooltip title="Actualizar información">

                            <Button
                                variant="outlined"
                                startIcon={
                                    refreshing
                                        ? <CircularProgress size={16} />
                                        : <Refresh />
                                }
                                onClick={handleRefresh}
                                disabled={refreshing}
                                sx={{
                                    borderColor: COLORS.border,
                                    color: COLORS.text,
                                    bgcolor: COLORS.white,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    px: 2,

                                    '&:hover': {
                                        borderColor: COLORS.navy,
                                        bgcolor: COLORS.white
                                    }
                                }}
                            >
                                Actualizar
                            </Button>

                        </Tooltip>


                        <Button
                            variant="contained"
                            startIcon={<Download />}
                            onClick={exportarExcel}
                            sx={{
                                bgcolor: COLORS.navy,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 700,
                                px: 2.2,
                                boxShadow: 'none',

                                '&:hover': {
                                    bgcolor: COLORS.navy2,
                                    boxShadow: 'none'
                                }
                            }}
                        >
                            Exportar
                        </Button>

                    </Stack>

                </Stack>


                {/* =====================================================
                    ERROR
                ====================================================== */}

                {error && (

                    <Alert
                        severity="error"
                        sx={{
                            mb: 3,
                            borderRadius: 2
                        }}
                    >
                        {error}
                    </Alert>

                )}


                {/* =====================================================
                    KPI GRID
                ====================================================== */}

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            lg: 'repeat(4, 1fr)'
                        },
                        gap: 2,
                        mb: 3
                    }}
                >

                    <KPICard
                        title="Departamentos"
                        value={formatNumber(
                            metrics.totalDepartamentos
                        )}
                        subtitle="Áreas registradas"
                        icon={<Business />}
                        color={COLORS.navy}
                        lightColor="#EAF0F6"
                    />

                    <KPICard
                        title="Empleados"
                        value={formatNumber(
                            metrics.totalEmpleados
                        )}
                        subtitle="Colaboradores registrados"
                        icon={<People />}
                        color={COLORS.teal}
                        lightColor={COLORS.tealLight}
                    />

                    <KPICard
                        title="Proyectos activos"
                        value={`${metrics.activos} / ${metrics.totalProyectos}`}
                        subtitle={`${metrics.porcentajeActivos}% del portafolio`}
                        icon={<Assignment />}
                        color={COLORS.green}
                        lightColor={COLORS.greenLight}
                    />

                    <KPICard
                        title="Salario promedio"
                        value={formatCOP(
                            metrics.salarioPromedio
                        )}
                        subtitle="Promedio por empleado"
                        icon={<AttachMoney />}
                        color={COLORS.amber}
                        lightColor={COLORS.amberLight}
                    />

                </Box>


                {/* =====================================================
                    MAIN ANALYTICS
                ====================================================== */}

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            lg: 'minmax(0, 1.7fr) minmax(320px, .9fr)'
                        },
                        gap: 2,
                        mb: 2
                    }}
                >

                    {/* EMPLEADOS */}

                    <Card sx={panelSx}>

                        <CardContent sx={{ p: { xs: 2, md: 3 } }}>

                            <SectionHeader
                                title="Empleados por departamento"
                                subtitle="Distribución actual de colaboradores"
                                action={
                                    <Chip
                                        label={`${metrics.totalEmpleados} empleados`}
                                        size="small"
                                        sx={{
                                            bgcolor: COLORS.blueLight,
                                            color: COLORS.blue,
                                            fontWeight: 700
                                        }}
                                    />
                                }
                            />

                            <Box
                                sx={{
                                    height: {
                                        xs: 280,
                                        md: 330
                                    }
                                }}
                            >

                                <Bar
                                    data={barData}
                                    options={barOptions}
                                />

                            </Box>

                        </CardContent>

                    </Card>


                    {/* PROYECTOS */}

                    <Card sx={panelSx}>

                        <CardContent sx={{ p: { xs: 2, md: 3 } }}>

                            <SectionHeader
                                title="Estado de proyectos"
                                subtitle="Situación actual del portafolio"
                            />


                            <Box
                                sx={{
                                    height: 190,
                                    position: 'relative'
                                }}
                            >

                                <Doughnut
                                    data={doughnutData}
                                    options={doughnutOptions}
                                />


                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform:
                                            'translate(-50%, -50%)',
                                        textAlign: 'center'
                                    }}
                                >

                                    <Typography
                                        sx={{
                                            fontSize: 30,
                                            fontWeight: 850,
                                            color: COLORS.text,
                                            lineHeight: 1
                                        }}
                                    >
                                        {metrics.totalProyectos}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 11,
                                            color: COLORS.muted,
                                            mt: .5
                                        }}
                                    >
                                        proyectos
                                    </Typography>

                                </Box>

                            </Box>


                            <Stack
                                spacing={1.4}
                                sx={{ mt: 2 }}
                            >

                                {[
                                    {
                                        label: 'Activos',
                                        value: metrics.activos,
                                        color: COLORS.teal
                                    },

                                    {
                                        label: 'En espera',
                                        value: metrics.espera,
                                        color: COLORS.amber
                                    },

                                    {
                                        label: 'Finalizados',
                                        value: metrics.finalizados,
                                        color: '#9AA7B5'
                                    }

                                ].map(item => (

                                    <Stack
                                        key={item.label}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >

                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            spacing={1}
                                        >

                                            <Box
                                                sx={{
                                                    width: 9,
                                                    height: 9,
                                                    borderRadius: '50%',
                                                    bgcolor: item.color
                                                }}
                                            />

                                            <Typography
                                                sx={{
                                                    fontSize: 13,
                                                    color: COLORS.muted
                                                }}
                                            >
                                                {item.label}
                                            </Typography>

                                        </Stack>

                                        <Typography
                                            sx={{
                                                fontSize: 13,
                                                fontWeight: 800,
                                                color: COLORS.text
                                            }}
                                        >
                                            {item.value}
                                        </Typography>

                                    </Stack>

                                ))}

                            </Stack>

                        </CardContent>

                    </Card>

                </Box>


                {/* =====================================================
                    LOWER AREA
                ====================================================== */}

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            lg: '1.2fr .8fr'
                        },
                        gap: 2
                    }}
                >

                    {/* RESUMEN FINANCIERO */}

                    <Card sx={panelSx}>

                        <CardContent sx={{ p: { xs: 2, md: 3 } }}>

                            <SectionHeader
                                title="Resumen financiero"
                                subtitle="Indicadores principales del periodo"
                            />


                            <Stack spacing={3}>

                                <ProgressRow
                                    label="Presupuesto comprometido"
                                    value={formatCOP(
                                        metrics.presupuestoActivo
                                    )}
                                    percentage={
                                        metrics.porcentajePresupuesto
                                    }
                                    color={COLORS.amber}
                                />


                                <ProgressRow
                                    label="Proyectos activos"
                                    value={`${metrics.activos} de ${metrics.totalProyectos}`}
                                    percentage={
                                        metrics.porcentajeActivos
                                    }
                                    color={COLORS.teal}
                                />


                                <Divider />


                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: {
                                            xs: '1fr 1fr',
                                            md: 'repeat(3, 1fr)'
                                        },
                                        gap: 2
                                    }}
                                >

                                    <Box>

                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                        >

                                            <Avatar
                                                sx={{
                                                    width: 30,
                                                    height: 30,
                                                    bgcolor:
                                                        COLORS.blueLight,
                                                    color:
                                                        COLORS.blue
                                                }}
                                            >
                                                <AttachMoney
                                                    sx={{
                                                        fontSize: 17
                                                    }}
                                                />
                                            </Avatar>

                                            <Typography
                                                sx={{
                                                    fontSize: 11,
                                                    color:
                                                        COLORS.muted
                                                }}
                                            >
                                                Presupuesto total
                                            </Typography>

                                        </Stack>

                                        <Typography
                                            sx={{
                                                mt: 1,
                                                fontSize: 17,
                                                fontWeight: 800,
                                                color: COLORS.text
                                            }}
                                        >
                                            {formatCOP(
                                                metrics.presupuestoTotal
                                            )}
                                        </Typography>

                                    </Box>


                                    <Box>

                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                        >

                                            <Avatar
                                                sx={{
                                                    width: 30,
                                                    height: 30,
                                                    bgcolor:
                                                        COLORS.greenLight,
                                                    color:
                                                        COLORS.green
                                                }}
                                            >
                                                <Groups
                                                    sx={{
                                                        fontSize: 17
                                                    }}
                                                />
                                            </Avatar>

                                            <Typography
                                                sx={{
                                                    fontSize: 11,
                                                    color:
                                                        COLORS.muted
                                                }}
                                            >
                                                Promedio empleados
                                            </Typography>

                                        </Stack>

                                        <Typography
                                            sx={{
                                                mt: 1,
                                                fontSize: 17,
                                                fontWeight: 800,
                                                color: COLORS.text
                                            }}
                                        >
                                            {metrics.totalDepartamentos
                                                ? (
                                                    metrics.totalEmpleados /
                                                    metrics.totalDepartamentos
                                                ).toFixed(1)
                                                : '0'}
                                        </Typography>

                                    </Box>


                                    <Box>

                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                        >

                                            <Avatar
                                                sx={{
                                                    width: 30,
                                                    height: 30,
                                                    bgcolor:
                                                        COLORS.amberLight,
                                                    color:
                                                        COLORS.amber
                                                }}
                                            >
                                                <TrendingUp
                                                    sx={{
                                                        fontSize: 17
                                                    }}
                                                />
                                            </Avatar>

                                            <Typography
                                                sx={{
                                                    fontSize: 11,
                                                    color:
                                                        COLORS.muted
                                                }}
                                            >
                                                Nómina mensual
                                            </Typography>

                                        </Stack>

                                        <Typography
                                            sx={{
                                                mt: 1,
                                                fontSize: 17,
                                                fontWeight: 800,
                                                color: COLORS.text
                                            }}
                                        >
                                            {formatCOP(
                                                metrics.salarioTotal
                                            )}
                                        </Typography>

                                    </Box>

                                </Box>

                            </Stack>

                        </CardContent>

                    </Card>


                    {/* ESTADO GENERAL */}

                    <Card sx={panelSx}>

                        <CardContent sx={{ p: { xs: 2, md: 3 } }}>

                            <SectionHeader
                                title="Estado general"
                                subtitle="Indicadores operativos"
                            />


                            <Stack spacing={2}>

                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >

                                    <Stack
                                        direction="row"
                                        spacing={1.3}
                                        alignItems="center"
                                    >

                                        <Avatar
                                            sx={{
                                                width: 38,
                                                height: 38,
                                                bgcolor:
                                                    COLORS.greenLight,
                                                color:
                                                    COLORS.green
                                            }}
                                        >
                                            <CheckCircle
                                                sx={{
                                                    fontSize: 20
                                                }}
                                            />
                                        </Avatar>

                                        <Box>

                                            <Typography
                                                sx={{
                                                    fontSize: 13,
                                                    fontWeight: 700
                                                }}
                                            >
                                                Proyectos activos
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontSize: 11,
                                                    color:
                                                        COLORS.muted
                                                }}
                                            >
                                                Actualmente en ejecución
                                            </Typography>

                                        </Box>

                                    </Stack>

                                    <Typography
                                        sx={{
                                            fontSize: 20,
                                            fontWeight: 850,
                                            color: COLORS.green
                                        }}
                                    >
                                        {metrics.activos}
                                    </Typography>

                                </Stack>


                                <Divider />


                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >

                                    <Stack
                                        direction="row"
                                        spacing={1.3}
                                        alignItems="center"
                                    >

                                        <Avatar
                                            sx={{
                                                width: 38,
                                                height: 38,
                                                bgcolor:
                                                    COLORS.amberLight,
                                                color:
                                                    COLORS.amber
                                            }}
                                        >
                                            <Schedule
                                                sx={{
                                                    fontSize: 20
                                                }}
                                            />
                                        </Avatar>

                                        <Box>

                                            <Typography
                                                sx={{
                                                    fontSize: 13,
                                                    fontWeight: 700
                                                }}
                                            >
                                                En espera
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontSize: 11,
                                                    color:
                                                        COLORS.muted
                                                }}
                                            >
                                                Proyectos pendientes
                                            </Typography>

                                        </Box>

                                    </Stack>

                                    <Typography
                                        sx={{
                                            fontSize: 20,
                                            fontWeight: 850,
                                            color: COLORS.amber
                                        }}
                                    >
                                        {metrics.espera}
                                    </Typography>

                                </Stack>


                                <Divider />


                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >

                                    <Stack
                                        direction="row"
                                        spacing={1.3}
                                        alignItems="center"
                                    >

                                        <Avatar
                                            sx={{
                                                width: 38,
                                                height: 38,
                                                bgcolor:
                                                    COLORS.blueLight,
                                                color:
                                                    COLORS.blue
                                            }}
                                        >
                                            <Business
                                                sx={{
                                                    fontSize: 20
                                                }}
                                            />
                                        </Avatar>

                                        <Box>

                                            <Typography
                                                sx={{
                                                    fontSize: 13,
                                                    fontWeight: 700
                                                }}
                                            >
                                                Departamentos
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontSize: 11,
                                                    color:
                                                        COLORS.muted
                                                }}
                                            >
                                                Áreas de la organización
                                            </Typography>

                                        </Box>

                                    </Stack>

                                    <Typography
                                        sx={{
                                            fontSize: 20,
                                            fontWeight: 850,
                                            color: COLORS.navy
                                        }}
                                    >
                                        {metrics.totalDepartamentos}
                                    </Typography>

                                </Stack>

                            </Stack>

                        </CardContent>

                    </Card>

                </Box>


                {/* =====================================================
                    FOOTER
                ====================================================== */}

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                        mt: 3,
                        px: .5
                    }}
                >

                    <Typography
                        sx={{
                            fontSize: 11,
                            color: COLORS.muted
                        }}
                    >
                        Sistema de Gestión Empresarial
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 11,
                            color: COLORS.muted
                        }}
                    >
                        Última actualización:{' '}
                        {new Date().toLocaleString(
                            'es-CO',
                            {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                            }
                        )}
                    </Typography>

                </Stack>


            </Box>


            {/* =========================================================
                NOTIFICATION
            ========================================================== */}

            <Snackbar
                open={notification}
                autoHideDuration={2500}
                onClose={() => setNotification(false)}
                message="Información actualizada correctamente"
            />

        </Box>

    );

};


export default Dashboard;