import "./App.css";
import Navbar from "./components/Navbar.jsx";
import Banner from "./components/Banner.jsx";
import Divider from "./components/Divider.jsx";
import FeaturedProducts from "./components/FeaturedProducts.jsx";
import Footer from "./components/Footer.jsx";
import ProductSearch from "./components/ProductSearch.jsx";
import ProductDetails from "./components/ProductDetails.jsx";
import { HashRouter, Routes, Route } from 'react-router-dom';
function App() {
    return (
        <>

            <HashRouter>
                <Navbar />


                <Routes>
                    <Route path="/" element={<Banner />}></Route>
                    <Route path="/featured" element={<FeaturedProducts />}></Route>
                    <Route path="/search" element={<ProductSearch />}></Route>
                    <Route path="/details/:productId" element={<ProductDetails/>}></Route>
                </Routes>

                <Footer />
            </HashRouter>



        </>
    );
}

export default App;
