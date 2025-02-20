import { useState, useEffect } from "react";
import Product from "./Product.jsx"
import "./FeaturedProducts.css"
export default function FeaturedProducts() {
    
    const [numProducts, setNumProducts] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [productList, setProductList] = useState([]);

    

    function handleCartAdd(product) {
        setNumProducts(numProducts + 1);
        setTotalPrice(totalPrice + (product.price));
    }
    function handleCartDelete(product) {
        setNumProducts(numProducts - 1);
        setTotalPrice(totalPrice - (product.price));
    }
    
    useEffect(() => {
        getProducts()
      }, []);

    async function getProducts() {
        const response = await fetch('https://dummyjson.com/products/category/smartphones?limit=8')
        
        const result = await response.json();
        
        const newProductList = [
            ... productList, 
            ...result.products
        ]
        
        setProductList(newProductList);
    }



    return (

        <div id="featuredProducts">
            <div id="headers">
                <h2>Featured Products</h2>
                <h6>Products in Cart: {numProducts}</h6>
                <h6>Total: $ {totalPrice}</h6>
            </div>
            
            <div className="container mt-4">
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">

                    {productList.map((item) => {
                        
                        return (
                            <div key={item.id} className="col">
                                
                                <Product 
                                    
                                    product={item}
                                    cartDelete={handleCartDelete}
                                    cartAdd={handleCartAdd}
                                />

                            </div>
                        )
                    })}
                    
                </div>
            </div>



           


        </div>
    );
}