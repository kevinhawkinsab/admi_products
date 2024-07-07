import * as React from 'react';
// import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import Swal from 'sweetalert2';

function createData(
  id: number,
  date: string,
  name: string,
  shipTo: string,
  paymentMethod: string,
  amount: number,
) {
  return { id, date, name, shipTo, paymentMethod, amount };
}

const rows = [
  createData(
    0,
    '16 Mar, 2019',
    'Elvis Presley',
    'Tupelo, MS',
    'VISA ⠀•••• 3719',
    312.44,
  ),
  createData(
    1,
    '16 Mar, 2019',
    'Paul McCartney',
    'London, UK',
    'VISA ⠀•••• 2574',
    866.99,
  ),
  createData(2, '16 Mar, 2019', 'Tom Scholz', 'Boston, MA', 'MC ⠀•••• 1253', 100.81),
  createData(
    3,
    '16 Mar, 2019',
    'Michael Jackson',
    'Gary, IN',
    'AMEX ⠀•••• 2000',
    654.39,
  ),
  createData(
    4,
    '15 Mar, 2019',
    'Bruce Springsteen',
    'Long Branch, NJ',
    'VISA ⠀•••• 5919',
    212.79,
  ),
];

// function preventDefault(event: React.MouseEvent) {
//   event.preventDefault();
// }


const deleteProduct = () => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleted!",
        text: "The product has been deleted.",
        icon: "success"
      });
    }
  });
}

export default function Orders() {
  const [openUpdateModal, setOpenUpdateModal] = React.useState(true);
  
  const editProduct = () => {
    setOpenUpdateModal(true);
  }

  const updateProductClose = () => {
    setOpenUpdateModal(false);
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


  return (
    <React.Fragment>
      <h3>List of Products</h3>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Ship To</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell>Sale Amount</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.shipTo}</TableCell>
              <TableCell>{row.paymentMethod}</TableCell>
              <TableCell>{`$${row.amount}`}</TableCell>
              <TableCell align="right">
                <IconButton aria-label="edit" onClick={editProduct}>
                  <EditNoteIcon />
                </IconButton>
                <IconButton aria-label="delete" onClick={deleteProduct}>
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
        <DialogTitle>New Product</DialogTitle>
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
          <Button type="submit" onClick={updateProductClose} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}