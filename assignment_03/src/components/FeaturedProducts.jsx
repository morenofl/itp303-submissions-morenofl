import Product from "./Product.jsx"
import "./FeaturedProducts.css"
export default function FeaturedProducts() {

    return (
        <div id="featuredProducts">
            <h2>Featured Products</h2>
            <div id="grid-container">
                <Product productName="M2 iPad Air" productPrice="$549" productImage="iPadAir.png" productRating="5.0 ☆" />
                <Product productName="M2 Macbook Air" productPrice="$1000" productImage="MacbookAir.png" productRating="4.7 ☆" />
                <Product productName="iPhone 16" productPrice="$763" productImage="iPhone.png" productRating="4.8 ☆" />
                <Product productName="AirPods Pro 2" productPrice="$249" productImage="AirPods.png" productRating="4.9 ☆" />
            </div>
        </div>
    );
}