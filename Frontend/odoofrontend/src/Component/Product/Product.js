
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import CollapsibleTable from './ProductTable';
import CustomizedTables from './ProductTable';
import BASE_URL from '../../config';
import { PRODUCT_TYPES } from '../../utils/product';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

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

export default function Product() {
  const [open, setOpen] = React.useState(false);
  const [productData, setProductData] = useState({
    productName: '',
    productImage: null,
    productType: '',
    salesPrice: '',
    customerTax: '',
    productCategory: '',
    company: '',
  });

  // const [categories, setCategories] = useState([]);
  // const [companies, setCompanies] = useState([]);

  const [productTypes, setProductTypes] = useState([]);
  const [updatedProducts, setUpdatedProducts] = useState([]);



  const handleSubmit = async () => {
    console.log("Submitting data", productData);
  
    const formData = new FormData();
formData.append('product_name', productData.productName);
formData.append('product_image', productData.productImage);
formData.append('product_type', productData.productType);
formData.append('sales_price', productData.salesPrice);
formData.append('customer_tax', productData.customerTax);
formData.append('cost',productData.cost);

formData.append('product_category', productData.productCategory);  // Ensure this is a valid ID or value
formData.append('company', productData.company);  // Ensure this is a valid ID or value

  
    try {
      console.log('Sending request');
      const response = await axios.post('http://localhost:8000/product/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Response:', response);
  
      if (response.status === 201) {
        console.log('Product Added Successfully');
        
        handleClose();
        // Clear the form fields
        setProductData({
          productName: '',
          productImage: null,
          productType: '',
          salesPrice: '',
          customerTax: '',
          cost: '',  // Add other fields as needed
          productCategory: '',
          company: '',
        });
        const updatedProducts = await axios.get('http://localhost:8000/product/');
        setUpdatedProducts(response.data);
        // Optionally, you can refresh the product list or perform other actions after successful submission.
      } else {
        console.log('Failed to add Product');
      }
    } catch (error) {
      console.error('Error', error);
      console.log('Error response:', error.response.data);
      console.log("Full Error Message", error.response);
    }
  };
  

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (key, value) => {
    setProductData((prevData) => ({
      ...prevData,
      [key]: value,
    }));

    if (key === 'cost' || key === 'customerTax') {
      const cost = key === 'cost' ? value : productData.cost;
      const customerTax = key ==='customerTax' ? value : productData.customerTax;
      const calculatedSalePrice = (parseFloat(cost) + parseFloat(cost) * parseFloat(customerTax)).toFixed(2);
      setProductData((prevData) => ({
        ...prevData,
        salesPrice: calculatedSalePrice,
      }));
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setProductData((prevData) => ({
        ...prevData,
        productImage: file,
      }));
    }
  };
  

  const goBack = () => {
    // Redirect to the customer page or any other page you want
    window.location.href = '/customers'; // Update this URL
  };

  return (
    <div>
      <h1 style={{marginLeft:'10px',fontFamily:'serif'}}> Products </h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '800px' }}>
  <Button onClick={handleOpen} style={{ backgroundColor: 'blue', color: 'white', marginRight: '10px' }}>
    Add Products
  </Button>
  <Button onClick={goBack} style={{ backgroundColor: 'blue', color: 'white' }}>
    Back
  </Button>
</div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            Add Products
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }} style={{ backgroundColor: 'white', color: 'black' }}>
            <TextField
              id="outlined-basic"
              label="Enter Product Name"
              variant="outlined"
              style={{ marginBottom: '10px' }}
              value={productData.productName}
              onChange={(e) => handleInputChange('productName', e.target.value)}
            />

            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} style={{ marginBottom: '10px' }}>
              Upload file
              <VisuallyHiddenInput
                type="file"
                // value={productData.productImage}
                onChange={handleFileChange}
              />
            </Button>

            <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
              <InputLabel id="demo-select-small-label">Select Product Type</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={productData.productType}
                label="Select Product Type "
                onChange={(e) => handleInputChange('productType', e.target.value)}
              >
                {PRODUCT_TYPES.map((productType) => (
                  <MenuItem key={productType} value={productType}>
                    {productType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              id="outlined-basic"
              label="Enter Cost"
              variant="outlined"
              style={{ marginBottom: '10px' }}
              value={productData.cost}
              onChange={(e) => handleInputChange('cost', e.target.value)}
            />
             <TextField
              id="outlined-basic"
              label="Enter customer_tax"
              variant="outlined"
              style={{ marginBottom: '10px' }}
              value={productData.customerTax}
              onChange={(e) => handleInputChange('customerTax', e.target.value)}
            />


            <TextField
              id="outlined-basic"
              label="Enter Sales Price"
              variant="outlined"
              style={{ marginBottom: '10px' }}
              value={productData.salesPrice}
              onChange={(e) => handleInputChange('salesPrice', e.target.value)}
            />
            
        
        <TextField
  id="outlined-basic"
  label="Enter Product Category"
  variant="outlined"
  style={{ marginBottom: '10px' }}
  value={productData.productCategory}
  onChange={(e) => handleInputChange('productCategory', e.target.value)}
/>


<TextField
  id="outlined-basic"
  label="Enter Company"
  variant="outlined"
  style={{ marginBottom: '10px' }}
  value={productData.company}
  onChange={(e) => handleInputChange('company', e.target.value)}
/>
            <br />
            <Button variant="contained" color="success" onClick={handleSubmit}>
              Submit
            </Button>
            <Button variant="outlined" color="error" style={{ marginLeft: '50px' }} onClick={handleClose}>
              Close
            </Button>
          </Typography>
      




        </Box>
      </Modal>
     
      <div>
        <CustomizedTables updatedProducts={updatedProducts}/>
      </div>

    
    </div>
    
  );
}





