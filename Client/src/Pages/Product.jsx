import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../Context/ShopContext';
import { products } from '../assets/assets';

const Product = () => {

    const {productId} = useParams();
    const {Products} = useContext(ShopContext);
    const [productData, setProductData] = useState(false);

    const fetchProductData = async () =>{

      products.map((item)=>{
        if(item._id === productId){
          setProductData(item);
          return null;
        }

      })
    }

    useEffect(()=>{
      fetchProductData();
    },[productId, products])

  return (
    <div>Product</div>
  )
}

export default Product