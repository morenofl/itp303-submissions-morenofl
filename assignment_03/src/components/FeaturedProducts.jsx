import Product from "./Product.jsx"
import "./FeaturedProducts.css"
export default function FeaturedProducts() {

    return (
    
        <div id="featuredProducts">
            <h2>Featured Products</h2>
            <div className="container mt-4">
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                    <div className="col">
                       
                        <Product productName="M2 iPad Air" productPrice="$549" productImage="iPadAir.png" productRating="5.0 ☆" />
                        
                    </div>
                    <div className="col">
                        
                        <Product productName="M2 Macbook Air" productPrice="$1000" productImage="MacbookAir.png" productRating="4.7 ☆" />
                        
                    </div>
                    <div className="col">
                        
                        <Product productName="iPhone 16" productPrice="$763" productImage="iPhone.png" productRating="4.8 ☆" />
                        
                    </div>
                    <div className="col">
                        
                        <Product productName="AirPods Pro 2" productPrice="$249" productImage="AirPods.png" productRating="4.9 ☆" />
                        
                    </div>
                    
                    
                </div>
            </div>




            
            
        </div>
    );
}