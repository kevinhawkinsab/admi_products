import React, { useState, useEffect } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AddIcon from '@mui/icons-material/Add';
import { Button, FormControl, InputAdornment, InputLabel, ListItemButton, ListItemIcon, ListItemText, MenuItem, Select, TextField } from '@mui/material';
import Orders from './Orders';
import SearchIcon from '@mui/icons-material/Search';
import Swal from 'sweetalert2';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://www.vhla.net/">
        Kevin Hawkins From Valhalla Cybernetics
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

interface Category {
  id: number,
  name: string
}

interface Product {
  id: number;
  name: string;
  categoryId: number;
  price: number;
  quantity: number;
  description: string;
  inventory: string;
}


const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const defaultTheme = createTheme();

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openCatModal, setOpenCatModal] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const addProduct = () => {
    setOpenAddModal(true);
  }

  const addProductClose = () => {
    setOpenAddModal(false);
  };

  const catProductClose = () => {
    setOpenCatModal(false);
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const handleChange = (event: any) => {
    console.log('Cat: ', event.target.value);
    setCategory(event.target.value);
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://localhost:7151/api/Category/Categories');
      console.log(response.data);
      setCategories(response.data);
      localStorage.setItem('categories', JSON.stringify(response.data));
    } catch (err) {
      console.error(err);
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://localhost:7151/api/Product/Products');
      console.log(response.data);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const searchProduct = (event: any) => {
    const product = event.target.value;    
    const productList = products.filter(item => item.name.toLowerCase().includes(product.toLowerCase()));
    
    console.log(productList);

    if(product){
      setFilteredProducts(productList);
    }else {
      setFilteredProducts(products);
    }

  };

  const saveCategory = async (event: React.FormEvent<HTMLFormElement>)  => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const category = {
      name: data.get('catName')
    }
    console.log(category);

    try {
      const response = await axios.post('https://localhost:7151/api/Category/Create', category, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      setOpenCatModal(false);
      Swal.fire({
        title: "Exito!",
        text: "La categoría fue creada exitosamente.",
        icon: "success"
      });
      fetchCategories();

    } catch (error: any) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: error.response.data,
        icon: "error"
      });
    }
  }

  const saveProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const product = {
      name: data.get('name'),
      description: data.get('desc'),
      categoryId: category,
      price: Number(data.get('price')),
      quantity: Number(data.get('quantity')),
    }
    console.log(product);
    try {
      const response = await axios.post('https://localhost:7151/api/Product/Create', product, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setOpenAddModal(false);
      console.log(response.data);
      fetchProducts();
      Swal.fire({
        title: "Exito!",
        text: "El producto fue creado exitosamente.",
        icon: "success"
      });

    } catch (err: any) {
      setOpenAddModal(false);
      console.error(err);

      const nestedData = err.response.data;
      console.log(nestedData)

      const value: any = Object.values(nestedData)[0];
      const message = value[0];

      Swal.fire({
        title: "Error!",
        text: message,
        icon: "error"
      });
    }
  };


  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar sx={{ pr: '24px' }}>
            <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
              Prueba Técnica Fullstack
            </Typography>
            <IconButton color="inherit" onClick={(()=> setOpenCatModal(true))}>
              <Badge color="secondary">
                <AddCircleIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: [1] }}>
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <ListItemButton>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </List>
        </Drawer>
        <Box component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1, height: '100vh', overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12} lg={12}>
                <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <h2>Productos</h2>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
                    <TextField id="input-with-icon-textfield" placeholder='Buscar productos' onChange={searchProduct}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                    />
                    <Button variant="contained" sx={{textTransform: 'capitalize'}} startIcon={<AddIcon />} onClick={addProduct}>Añadir Producto</Button>
                  </div>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <Orders products={filteredProducts} onProductsUpdate={fetchProducts}/>
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
      <Dialog open={openAddModal} onClose={addProductClose} PaperProps={{component: 'form', onSubmit: saveProduct}}>
        <DialogTitle>Nuevo Producto</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid sx={{paddingTop: '1rem'}} item xs={12} sm={6}>
              <TextField name="name" required fullWidth id="name" label="Nombre" autoFocus />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Categoria</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={category}
                  label="Category"
                  onChange={handleChange}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* <TextField required fullWidth id="category" label="Category" name="category" /> */}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField  required fullWidth name="price" label="Precio" id="price" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth  name="quantity" label="Cantidad" id="quantity" />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField fullWidth multiline rows={4} id="desc" label="Descripción" name="desc" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{padding: '0 1.5rem'}}>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Guardar
          </Button>
          <Button type="submit" color='error' onClick={addProductClose} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>


      {/* CATEGORY MODAL */}
      <Dialog open={openCatModal} onClose={catProductClose} PaperProps={{component: 'form', onSubmit: saveCategory}}>
        <DialogTitle>Nueva Categoria</DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid sx={{paddingTop: '1rem'}} item xs={12}>
              <TextField name="catName" required fullWidth id="catName" label="Categoria" autoFocus />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{padding: '0 1.5rem'}}>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Guardar
          </Button>
          <Button type="submit" color='error' onClick={catProductClose} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}