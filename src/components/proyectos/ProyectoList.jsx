import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Box, Typography, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useApi } from '../../hooks/useApi';

const ProyectoList = () => {
    const { data, loading, error, create, update, remove } = useApi('/proyectos');
    const [openDialog, setOpenDialog] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        presupuesto: '',
        estado: 'Activo'
    });

    const estados = ['Activo', 'En espera', 'Finalizado', 'Cancelado'];

    const handleOpenDialog = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                nombre: item.nombre,
                descripcion: item.descripcion || '',
                presupuesto: item.presupuesto || '',
                estado: item.estado || 'Activo'
            });
        } else {
            setEditingItem(null);
            setFormData({
                nombre: '',
                descripcion: '',
                presupuesto: '',
                estado: 'Activo'
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
                presupuesto: formData.presupuesto ? parseFloat(formData.presupuesto) : null
            };
            if (editingItem) {
                await update(editingItem.idProyecto, dataToSend);
            } else {
                await create(dataToSend);
            }
            handleCloseDialog();
        } catch (error) {
            console.error('Error al guardar:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este proyecto?')) {
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
                <Typography variant="h5">📋 Proyectos</Typography>
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
                            <TableCell>Presupuesto</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.idProyecto}>
                                <TableCell>{item.idProyecto}</TableCell>
                                <TableCell>{item.nombre}</TableCell>
                                <TableCell>${item.presupuesto?.toLocaleString()}</TableCell>
                                <TableCell>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        backgroundColor: item.estado === 'Activo' ? '#4caf50' :
                                                       item.estado === 'En espera' ? '#ff9800' :
                                                       item.estado === 'Finalizado' ? '#2196f3' : '#f44336',
                                        color: 'white'
                                    }}>
                                        {item.estado}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => handleOpenDialog(item)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(item.idProyecto)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{editingItem ? '✏️ Editar' : '➕ Nuevo'} Proyecto</DialogTitle>
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
                        label="Descripción"
                        fullWidth
                        multiline
                        rows={2}
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Presupuesto"
                        fullWidth
                        type="number"
                        value={formData.presupuesto}
                        onChange={(e) => setFormData({ ...formData, presupuesto: e.target.value })}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Estado</InputLabel>
                        <Select
                            value={formData.estado}
                            onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                            label="Estado"
                        >
                            {estados.map((estado) => (
                                <MenuItem key={estado} value={estado}>{estado}</MenuItem>
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

export default ProyectoList;