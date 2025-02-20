import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function ProductDetails(props) {
	const [product, setProduct] = useState({});
	const param = useParams();

	const id = param.productId;
	

	useEffect(() => {
		getProduct();
	}, []);
	async function getProduct() {
		const response = await fetch(`https://dummyjson.com/products/${id}`);
		const results = await response.json();
		
		setProduct(results);
	}

	return (
		<>
			<div className='container py-5'>
				<div className='row justify-content-center'>
					<h2 className='col-12 mb-3'>Product Details</h2>
				</div>

				<div className='row justify-content-center'>
					<div className='col-6 col-md-4'>
						<img
							className='img-fluid'
							src={product.images?.[0]}
							alt={product.title}
						/>
					</div>

					<div className='mt-3 col-12 col-md-8'>
						<h4 className='mb-3'>
							{product.title}
						</h4>

						<p>
							<strong>Price: </strong>
							${product.price}
						</p>

						<p>
							<strong>Rating: </strong>
							<span>{product.rating} ☆</span>
						</p>

						<p >
							<strong>Description: </strong>
							<span>{product.description}</span>
						</p>

						

						

						
						
					</div>
				</div>

			</div>




		</>



	);

}
