import React, { useState, useEffect } from 'react';
import './home.css';
import BASE_URL from '../../config';
import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating a delay of 1 second
    const delay = setTimeout(() => {
      fetch(`${BASE_URL}/view-products/`)
        .then((response) => response.json())
        .then((data) => {
          setProducts(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }, 100);

    return () => clearTimeout(delay);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginLeft: '48%', height: '100vh', marginTop:'12%' }}>
        <CircularProgress color='secondary' />
      </Box>
    );
  }

  return (
    <div className="home-container">
      <u><h1 className="page-title">Available Products</h1></u>
      {/* Display product images */}
      <div className="product-container">
        {products.map((product) => (
          <img
            key={product.id}
            src={`${BASE_URL}/${product.image}`}
            alt={product.name}
            className="product-image fade-in"
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
