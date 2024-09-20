import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Container, List, ListItem, ListItemText, Modal, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App() {
  const [gasto, setGasto] = useState({ nome: '', data: '', valor: '' });
  const [gastos, setGastos] = useState([]);
  const [total, setTotal] = useState(0);
  const [filteredGastos, setFilteredGastos] = useState([]);
  const [mesFiltro, setMesFiltro] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const getMesAtual = () => {
    const hoje = new Date();
    return hoje.toISOString().substring(0, 7); 
  };

  useEffect(() => {
    const data = localStorage.getItem('gastos');
    if (data) {
      const parsedData = JSON.parse(data);
      setGastos(parsedData);
      calcularTotal(parsedData);
    }
    setMesFiltro(getMesAtual()); 
  }, []);

  useEffect(() => {
    filtrarGastosPorMes();
  }, [mesFiltro, gastos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGasto({ ...gasto, [name]: value });
  };

  const adicionarGasto = () => {
    if (gasto.nome && gasto.data && gasto.valor) {
      const novosGastos = [...gastos, gasto];
      setGastos(novosGastos);
      calcularTotal(novosGastos);
      setGasto({ nome: '', data: '', valor: '' });
      localStorage.setItem('gastos', JSON.stringify(novosGastos));
      setModalOpen(false);
    }
  };

  const removerGasto = (index) => {
    const novosGastos = gastos.filter((_, i) => i !== index);
    setGastos(novosGastos);
    calcularTotal(novosGastos);
    localStorage.setItem('gastos', JSON.stringify(novosGastos));
  };

  const editarGasto = (index) => {
    const gastoEditado = gastos[index];
    setGasto(gastoEditado);
    setModalOpen(true);
    removerGasto(index); 
  };

  const calcularTotal = (gastos) => {
    const total = gastos.reduce((acc, curr) => acc + parseFloat(curr.valor), 0);
    setTotal(total);
  };

  const filtrarGastosPorMes = () => {
    if (mesFiltro) {
      const gastosFiltrados = gastos.filter((g) => {
        const mesGasto = new Date(g.data).toISOString().substring(0, 7);
        return mesGasto === mesFiltro;
      });
      setFilteredGastos(gastosFiltrados);
      calcularTotal(gastosFiltrados);
    } else {
      setFilteredGastos(gastos);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Registro de Gastos
      </Typography>
      <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
        Adicionar Gasto
      </Button>

      <TextField
        label="Filtrar por mês"
        type="month"
        value={mesFiltro}
        onChange={(e) => setMesFiltro(e.target.value)}
        fullWidth
        margin="normal"
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={style}>
          <IconButton onClick={() => setModalOpen(false)} style={{ float: 'right' }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" gutterBottom>
            Adicionar/Editar Gasto
          </Typography>
          <TextField
            label="Descrição"
            name="nome"
            value={gasto.nome}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="data"
            value={gasto.data}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="date"
          />
          <TextField
            label="Valor"
            name="valor"
            value={gasto.valor}
            onChange={handleChange}
            type="number"
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={adicionarGasto}>
            Salvar
          </Button>
        </Box>
      </Modal>

      <Typography variant="h6" style={{ marginTop: '20px' }}>
        Lista de Gastos
      </Typography>
      <List>
        {filteredGastos.map((g, index) => (
          <ListItem key={index} secondaryAction={
            <>
              <IconButton color="primary" onClick={() => editarGasto(index)}>
                <EditIcon />
              </IconButton>
              <IconButton color="secondary" onClick={() => removerGasto(index)}>
                <DeleteIcon />
              </IconButton>
            </>
          }>
            <ListItemText primary={`${g.nome} - ${g.data} - R$${g.valor}`} />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6">
        Total Gasto: R${total.toFixed(2)}
      </Typography>
    </Container>
  );
}

export default App;
