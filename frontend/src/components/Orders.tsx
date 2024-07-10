import React, { useState, useEffect } from 'react';
// import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import Swal from 'sweetalert2';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  categoryId: number;
  price: number;
  quantity: number;
  description: string;
  inventory: string;
}

// function preventDefault(event: React.MouseEvent) {
//   event.preventDefault();
// }


export default function Orders() {
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  
  const editProduct = () => {
    setOpenUpdateModal(true);
  }

  const updateProductClose = () => {
    setOpenUpdateModal(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://localhost:7151/api/Product/Products');
      console.log(response.data);
      setProducts(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const product = {
      name: data.get('name'),
      desc: data.get('desc'),
      category: data.get('category'),
      price: data.get('price'),
      quantity: data.get('quantity'),
    }
    console.log(product);
    Swal.fire({
      title: "Success!",
      text: "The product has been updated.",
      icon: "success"
    });
  };

  const deleteProduct = (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log(id)
        try {
          const response = await axios.delete(`https://localhost:7151/api/Product/Remove/${id}`);
          console.log(response.data);
          Swal.fire({
            title: "Deleted!",
            text: "The product has been deleted.",
            icon: "success"
          });
          fetchData();
        } catch (err) {
          console.error(err);
        }
      }
    });
  }


  return (
    <React.Fragment>
      <h3>List of Products</h3>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Imagen</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Categoría</TableCell>
            <TableCell>Precio</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Inventario</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.categoryId}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>
                {product.inventory === 'En Stock' ? (
                  <p className='stock'><FiberManualRecordIcon /> {product.inventory}</p>
                ) : product.inventory === 'Limitado' ? (
                  <p className='limited'><FiberManualRecordIcon /> {product.inventory}</p>
                ) : (
                  <p className='out-of-stock'><FiberManualRecordIcon /> {product.inventory}</p>
                )}
              </TableCell>
              <TableCell align="right">
                <IconButton aria-label="edit" onClick={editProduct}>
                  <EditNoteIcon />
                </IconButton>
                <IconButton aria-label="delete" onClick={() => deleteProduct(product.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={openUpdateModal} onClose={updateProductClose}
        PaperProps={{
          component: 'form',
          onSubmit: updProduct
        }}
      >
        <DialogTitle>Update Product</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid sx={{paddingTop: '1rem'}} item xs={12} sm={6}>
              <TextField name="name" required fullWidth id="name" label="Name" autoFocus />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth id="category" label="Category" name="category" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth name="price" label="Price" type="price" id="price" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth  name="quantity" label="Quantity" type="quantity" id="quantity" />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField required fullWidth multiline rows={4} id="desc" label="Description" name="desc" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{padding: '0 1.5rem'}}>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Save
          </Button>
          <Button type="submit" color='error' onClick={updateProductClose} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}