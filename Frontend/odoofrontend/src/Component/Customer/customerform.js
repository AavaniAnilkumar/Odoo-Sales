

import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Paper } from '@mui/material';
import CustomerTable from './customertable';



const CustomerForm = () => {
  const [customer, setCustomer] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    photo: null,
    email:'',
    mobile:'' // Add photo field to the state
  });

  const [shouldRefreshTable, setShouldRefreshTable] = useState(false);
  const [submitted, setSubmitted] = useState(false); // Track if form is submitted

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setCustomer(prevCustomer => ({
        ...prevCustomer,
        [name]: files[0] // Store the selected file
      }));
    } else {
      setCustomer(prevCustomer => ({
        ...prevCustomer,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    formData.append('name', customer.name);
    formData.append('address', customer.address);
    formData.append('city', customer.city);
    formData.append('state', customer.state);
    formData.append('zip_code', customer.zip_code);
    formData.append('country', customer.country);
    formData.append('photo', customer.photo);
    formData.append('email', customer.email);
    formData.append('mobile', customer.mobile);

    const response = await fetch('http://localhost:8000/create-customer/', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      console.log('Customer created successfully');
      setShouldRefreshTable(true);
      setSubmitted(true); // Set submitted to true after successful submission
      setCustomer({
        name: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        country: '',
        photo: null,
        email: '',
        mobile: ''
      });
      window.location.reload();
      

    } else {
      console.error('Failed to create customer:', response.statusText);
      throw new Error('Failed to create customer');
    }
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to fetch');
  }
};

  return (
    <Paper elevation={3} style={{ padding: 20 }}>
      <Typography variant="h5" gutterBottom style={{marginLeft:'50px',fontFamily:'serif'}}>
        Customer Form
      </Typography>
      {!submitted ? ( // Render form if not submitted

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Name"
              fullWidth
              value={customer.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="address"
              label="Address"
              fullWidth
              multiline
              rows={2}
              value={customer.address}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="city"
              label="City"
              fullWidth
              value={customer.city}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="state"
              label="State"
              fullWidth
              value={customer.state}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="zip_code"
              label="Zip Code"
              fullWidth
              value={customer.zip_code}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="country"
              label="Country"
              fullWidth
              value={customer.country}
              onChange={handleChange}
            />
          </Grid>
          {/* <Grid item xs={12}>
            <input
              type="file"
              accept="image/*"
              name="photo"
              onChange={handleChange}
            />
          </Grid> */}
          <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                fullWidth
                value={customer.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="mobile"
                label="Mobile"
                fullWidth
                value={customer.mobile}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} style={{marginRight:'700px'}}>
            <label htmlFor="photo" style={{marginRight:'100px'}}>Upload Photo</label>
            <br/>
            <input
              type="file"
              accept="image/*"
              name="photo"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
      ) : (
       
<CustomerTable shouldRefreshTable={shouldRefreshTable} setShouldRefreshTable={setShouldRefreshTable} />

      )}

    </Paper>
    
  );
};

export default CustomerForm;