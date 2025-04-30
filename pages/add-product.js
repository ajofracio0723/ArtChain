

import React from 'react';
import AddProductForm from '../components/AddProductForm';

const AddProductPage = () => {
  const handleAddProduct = (newProduct) => {
    // Handle adding the new product (e.g., send data to backend)
    console.log('New product added:', newProduct);
  };

  return (
    <div>
     
      <AddProductForm onAdd={handleAddProduct} />
    </div>
  );
};

export default AddProductPage;
