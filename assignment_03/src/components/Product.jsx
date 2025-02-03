import "./Product.css"

export default function Product(props) {
    return (

        <div class="card h-100 d-flex flex-column">

            <img class="product-image mx-auto card-img-top" src={props.productImage} alt={props.productName} />
            <div class="card-body">
                <h5 class="card-title">{props.productName}</h5>
                
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">Price: {props.productPrice}</li>
                <li class="list-group-item">Rating: {props.productRating}</li>
                
            </ul>
        </div>
    );
}