import { useState } from "react";
import { Link } from "react-router-dom";
import "./Product.css"

export default function Product(props) {
    const [count, setCount] = useState(0);

    function handleRemoveClick() {
        
        if(count <= 0) {
            setCount(0);
        }
        else {
            props.cartDelete(props.product);
            setCount(count - 1);
        }
    }

    function handleAddClick() {
        props.cartAdd(props.product);
        setCount(count + 1);
    }

    return (

        <div className="card h-100 d-flex flex-column">

            
            <img className="product-image mx-auto card-img-top" src={props.product.images[0]} alt={props.product.title} />
            <div className="card-body">
                <h5 className="card-title">
                    <Link className="link-body-emphasis" to={`/details/${props.product.id}`}>
                        {props.product.title}
                    </Link>
                </h5>
                
            </div>
            <ul className="list-group list-group-flush">
                
                <li className="list-group-item">Price: ${props.product.price}</li>
                <li className="list-group-item">Rating: {props.product.rating} ☆</li>

                {props.cart != "false" && 
                    <li className="list-group-item">In Cart:  
                    <button type="button" className="btn btn-outline-danger cartButton" onClick={handleRemoveClick}>-</button>
                    {count} 
                    <button type="button" className="btn btn-outline-success cartButton" onClick={handleAddClick}>+</button>
                    </li>
                }
                
            </ul>
        </div>
    );
}