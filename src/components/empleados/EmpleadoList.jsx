import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Box, Typography, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useApi } from '../../hooks/useApi';

const EmpleadoList = () => {
    const { data: empleados, loading, error, create, update, remove } = useApi('/empleados');
    const { data: departamentos } = useApi('/departamentos', { autoFetch: true });
    const [openDialog, setOpenDialog] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        salario: '',
        idDepartamento: ''
    });

    const handleOpenDialog = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                nombre: item.nombre,
                apellido: item.apellido,
                email: item.email,
                salario: item.salario || '',
                idDepartamento: item.idDepartamento || ''
            });
        } else {
            setEditingItem(null);
            setFormData({
                nombre: '',
                apellido: '',
                email: '',
                salario: '',
                idDepartamento: ''
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingItem(null);
    };

    const handleSubmit = async () => {
        try {
            const dataToSend = {
                ...formData,
                salario: formData.salario ? parseFloat(formData.salario) : null,
                idDepartamento: formData.idDepartamento ? parseInt(formData.idDepartamento) : null
            };
            if (editingItem) {
                await update(editingItem.idEmpleado, dataToSend);
            } else {
                await create(dataToSend);
            }
            handleCloseDialog();
        } catch (error) {
            console.error('Error al guardar:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este empleado?')) {
            try {
                await remove(id);
            } catch (error) {
                console.error('Error al eliminar:', error);
            }
        }
    };

    if (loading) return <Typography>Cargando...</Typography>;
    if (error) return <Typography color="error">Error: {error}</Typography>;

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5">👥 Empleados</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
                    Nuevo
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Salario</TableCell>
                            <TableCell>Departamento</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {empleados.map((item) => (
                            <TableRow key={item.idEmpleado}>
                                <TableCell>{item.idEmpleado}</TableCell>
                                <TableCell>{item.nombre} {item.apellido}</TableCell>
                                <TableCell>{item.email}</TableCell>
                                <TableCell>${item.salario?.toLocaleString()}</TableCell>
                                <TableCell>{item.departamento?.nombre}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => handleOpenDialog(item)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(item.idEmpleado)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{editingItem ? '✏️ Editar' : '➕ Nuevo'} Empleado</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nombre"
                        fullWidth
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Apellido"
                        fullWidth
                        value={formData.apellido}
                        onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        fullWidth
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Salario"
                        fullWidth
                        type="number"
                        value={formData.salario}
                        onChange={(e) => setFormData({ ...formData, salario: e.target.value })}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Departamento</InputLabel>
                        <Select
                            value={formData.idDepartamento}
                            onChange={(e) => setFormData({ ...formData, idDepartamento: e.target.value })}
                            label="Departamento"
                        >
                            <MenuItem value="">Seleccionar</MenuItem>
                            {departamentos.map((depto) => (
                                <MenuItem key={depto.idDepartamento} value={depto.idDepartamento}>
                                    {depto.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained">Guardar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EmpleadoList;