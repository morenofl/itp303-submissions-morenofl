import { useState } from 'react';

import Product from './Product.jsx'

import './ProductSearch.css'

export default function ProductSearch() {

	const [nameInput, setNameInput] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [searched, setSearched] = useState(false);
	async function handleSubmit(e) {
		//stop default refresh
		e.preventDefault();

		const response = await fetch(`https://dummyjson.com/products/search?q=${nameInput}`);
		const results = await response.json();

		const filteredResults = results.products.filter(product => product.category == "smartphones")

		setSearchResults(filteredResults);
		setNameInput("");
		setSearched(true);
	}

	return (

		<>
			<div id='productSearch'>
				<h3 id='searchTitle'>Search Products</h3>
				<div id="productForm" className="container">

					<form className="row g-3 align-items-center" onSubmit={handleSubmit}>
						<div className="mb-1" id="searchForm">
							<label htmlFor="nameInput" className="form-label">Product Name:</label>
							<input type="text" className="form-control" id="nameInput"
								onChange={(e) => {
									setNameInput(e.target.value);

								}}
								value={nameInput}
							/>

						</div>



						<div id='searchButton'>
							<button id="addButton" type="submit" className="btn btn-primary">Search</button>
						</div>
						
					</form>

					<div id='noResultsMessage'>
						{searchResults == 0 && searched == true && (
							<p>No results for this search</p>
						)

						}
					</div>
				</div>



				<div className="container mt-4">
					<div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">

						{searchResults != 0 && searchResults.map((item, index) => {

							return (
								<div key={index} className="col">

									<Product

										product={item}
										cart="false"
									/>

								</div>
							)
						})}

					</div>
				</div>
			</div>


		</>
	);
}