import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Box, Typography
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useApi } from '../../hooks/useApi';

const DepartamentoList = () => {
    const { data, loading, error, create, update, remove } = useApi('/departamentos');
    const [openDialog, setOpenDialog] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ nombre: '', descripcion: '' });

    const handleOpenDialog = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({ nombre: item.nombre, descripcion: item.descripcion });
        } else {
            setEditingItem(null);
            setFormData({ nombre: '', descripcion: '' });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingItem(null);
    };

    const handleSubmit = async () => {
        try {
            if (editingItem) {
                await update(editingItem.idDepartamento, formData);
            } else {
                await create(formData);
            }
            handleCloseDialog();
        } catch (error) {
            console.error('Error al guardar:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este departamento?')) {
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
                <Typography variant="h5">📋 Departamentos</Typography>
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
                            <TableCell>Descripción</TableCell>
                            <TableCell>Fecha Creación</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.idDepartamento}>
                                <TableCell>{item.idDepartamento}</TableCell>
                                <TableCell>{item.nombre}</TableCell>
                                <TableCell>{item.descripcion}</TableCell>
                                <TableCell>{new Date(item.fechaCreacion).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => handleOpenDialog(item)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(item.idDepartamento)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{editingItem ? '✏️ Editar' : '➕ Nuevo'} Departamento</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
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
                        rows={3}
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained">Guardar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DepartamentoList;