import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { FormControl,InputLabel,TextField,Select } from '@mui/material';
import { useState, useEffect } from 'react';
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

export default function SaleOrderForm() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [formData, setFormData] = useState({
    customer: '',
    product: '',
    invoiceAddress: '',
    deliveryAddress: '',
    expiration_date: '',
    customer_id: ''

  });
  const [customers, setCustomers] = useState([]);
  const [products,setProducts] =useState([]);

  


  return (
    <div>
      <h1 style={{marginLeft:'10px',fontFamily:'serif'}}> Sales Order </h1>
      
      <Button onClick={handleOpen} style={{ marginLeft: '1000px', backgroundColor: 'blue', color: 'white' }}>
        Add Sales Order
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            Add Sale Order
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }} style={{ backgroundColor: 'white', color: 'black' }}>
            {/* <TextField
              id="outlined-basic"
              label="Enter Customer"
              variant="outlined"
              style={{ marginBottom: '10px' }}
              
            />

           */}

            <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
              <InputLabel id="demo-select-small-label">Select Customer</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                
               
              >
                {/* {PRODUCT_TYPES.map((productType) => (
                  <MenuItem key={productType} value={productType}>
                    {productType}
                  </MenuItem>
                ))} */}
              </Select>
            </FormControl>


            <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
              <InputLabel id="demo-select-small-label">Select Product</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                
               
              >
                {/* {PRODUCT_TYPES.map((productType) => (
                  <MenuItem key={productType} value={productType}>
                    {productType}
                  </MenuItem>
                ))} */}
              </Select>
            </FormControl>


            <TextField fullWidth label="Enter Invoice Address" 
            id="fullWidth" 
            style={{marginBottom: '10px'}}
            
            
            />

            <TextField fullWidth label="Enter Delivery Address" 
                        id="fullWidth" 
                        style={{marginBottom: '10px'}}
                        
                        
                        />
                    <TextField
                    id="outlined-basic"
                    label="Enter Expiration Date"
                    variant="outlined"
                    style={{ marginBottom: '10px' }}
                    type="date"
                    />




            <TextField
              id="outlined-basic"
              label="Enter Sales Price"
              variant="outlined"
              style={{ marginBottom: '10px' }}
             
            />
            
        
        <TextField
  id="outlined-basic"
  label="Enter Payment Term"
  variant="outlined"
  style={{ marginBottom: '10px' }}

/>

           <div>
           <Button variant="contained" color="success" >
              Submit
            </Button>
            <Button variant="outlined" color="error" style={{ marginLeft: '50px' }} onClick={handleClose}>
              Close
            </Button>

           </div>
           
          </Typography>
      




        </Box>
      </Modal>

      <div>
      
      </div>

    
    </div>
  );
}
