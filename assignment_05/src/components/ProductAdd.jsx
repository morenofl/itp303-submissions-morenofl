import { useState } from "react"
import './ProductAdd.css'
export default function ProductAdd(props) {

    const [nameInput, setNameInput] = useState('');
    const [priceInput, setPriceInput] = useState('');
    const [imageInput, setImageInput] = useState('');
    const [ratingInput, setRatingInput] = useState('');

    

    
    function handleSubmit(e) {
        //stop default refresh
        e.preventDefault();

        //create new product
        const newProduct = {
            title: nameInput,
            price: parseInt(priceInput),
            images: [imageInput],
            rating: ratingInput

        }
        
        props.onProductAdd(newProduct)
        setNameInput('')
        setPriceInput('')
        setImageInput('')
        setRatingInput('')
    }
    return (
        <>
            <h3>Add a Product</h3>
            <div id="productForm" className="container">

                <form className="row g-3 align-items-center" onSubmit={handleSubmit}>
                    <div className="mb-1">
                        <label htmlFor="nameInput" className="form-label">Product Name:</label>
                        <input type="text" className="form-control" id="nameInput" 
                        onChange={(e) => {
                            setNameInput(e.target.value);
                            
                        }}
                        value={nameInput} 
                        />

                    </div>
                    <div className="mb-3">
                        <label htmlFor="priceInput" className="form-label">Price:</label>
                        <input type="text" className="form-control" id="priceInput" 
                        onChange={(e) => {
                            setPriceInput(e.target.value);
                        }}
                        value={priceInput} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="imageInput" className="form-label">Image:</label>
                        <input type="text" className="form-control" id="imageInput" 
                        onChange={(e) => {
                            setImageInput(e.target.value);
                        }}
                        value={imageInput} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="ratingInput" className="form-label">Rating:</label>
                        <input type="text" className="form-control" id="ratingInput" 
                        onChange={(e) => {
                            setRatingInput(e.target.value);
                        }}
                        value={ratingInput} />
                    </div>

                    <button id="addButton" type="submit" className="btn btn-primary">Add</button>
                </form>
            </div>


        </>

    )
}