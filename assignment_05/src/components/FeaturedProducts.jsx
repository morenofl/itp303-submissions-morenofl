import { useState, useEffect } from "react";
import Product from "./Product.jsx"
import ProductAdd from './ProductAdd.jsx'
import "./FeaturedProducts.css"
export default function FeaturedProducts() {
    const [nextId, setNextId] = useState(5);
    const [numProducts, setNumProducts] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [productList, setProductList] = useState([{
        id: 4448,
        title: "M2 iPad Air",
        price: 549,
        images: ["iPadAir.png"],
        rating: "5.0"
    },
    {
        id: 4449,
        title: "M2 Macbook Air",
        price: 1000,
        images: ["MacbookAir.png"],
        rating: "4.7"
    },
    {
        id: 34449,
        title: "iPhone 16",
        price: 763,
        images: ["iPhone.png"],
        rating: "4.8"
    },
    {
        id: 56789,
        title: "AirPods Pro 2",
        price: 249,
        images: ["AirPods.png"],
        rating: "4.9"
    }
    ]);

    function handleProductAdd(product) {
        const newProduct = {
            ... product,
            id: nextId
        }
        const newProductList = [
            ... productList, 
            newProduct
        ]

        setNextId(nextId + 1);
        setProductList(newProductList);
    }

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
        const response = await fetch('https://dummyjson.com/products/category/smartphones')
        
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

                    {productList.map((item, index) => {
                        
                        return (
                            <div key={index} className="col">
                                
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



            <ProductAdd onProductAdd={handleProductAdd}/>


        </div>
    );
}