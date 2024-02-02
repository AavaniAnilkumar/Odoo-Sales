import React, { useState, useEffect } from 'react';
import './home.css';
const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch data from the backend API endpoint
    fetch('http://localhost:8000/product/')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div style={{marginLeft: '200px'}}>
      <h1 style={{marginLeft:'10px',fontFamily:'serif'}}>Available Products</h1>
      {/* Display product images */}
      <div className="product-container" style={{marginTop: '70px'}}>
        {products.map((product) => (
          <img
            key={product.id}
            src={product.product_image}
            alt={product.product_name}
            className="fade-in"
            style={{ maxWidth: '200px', maxHeight: '200px', margin: '30px' ,
           

            borderRadius: '8px',

                
          }}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
