import { useState } from "react";
import Product from "./Product.jsx"
import ProductAdd from './ProductAdd.jsx'
import "./FeaturedProducts.css"
export default function FeaturedProducts() {
    const [nextId, setNextId] = useState(5);
    const [numProducts, setNumProducts] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [productList, setProductList] = useState([
        {
            id: 1,
            productName: "M2 iPad Air",
            productPrice: 549,
            productImage: "iPadAir.png",
            productRating: "5.0" 
        },
        {
            id: 2,
            productName: "M2 Macbook Air",
            productPrice: 1000,
            productImage: "MacbookAir.png",
            productRating: "4.7" 
        },
        {
            id: 3,
            productName: "iPhone 16",
            productPrice: 763,
            productImage: "iPhone.png",
            productRating: "4.8" 
        },
        {
            id: 4,
            productName: "AirPods Pro 2",
            productPrice: 249,
            productImage: "AirPods.png",
            productRating: "4.9" 
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
        setTotalPrice(totalPrice + (product.productPrice));
    }
    function handleCartDelete(product) {
        setNumProducts(numProducts - 1);
        setTotalPrice(totalPrice - (product.productPrice));
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



            <ProductAdd onProductAdd={handleProductAdd}/>


        </div>
    );
}