import "./App.css";
import Navbar from "./components/Navbar.jsx";
import Banner from "./components/Banner.jsx";
import Divider from "./components/Divider.jsx";
import FeaturedProducts from "./components/FeaturedProducts.jsx";
import Footer from "./components/Footer.jsx";
import ProductSearch from "./components/ProductSearch.jsx";

function App() {
    return (
        <>
            <Navbar/>
            <Banner/>
            <Divider/>
            <FeaturedProducts/>
            <ProductSearch/>
            <Footer/>
        </>
    );
}

export default App;
