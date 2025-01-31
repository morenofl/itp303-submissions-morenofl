import "./App.css";
import Navbar from "./components/Navbar.jsx";
import Banner from "./components/Banner.jsx";
import Divider from "./components/Divider.jsx";
import FeaturedProducts from "./components/FeaturedProducts.jsx";
import Footer from "./components/Footer.jsx";
function App() {
    return (
        <>
            <Navbar/>
            <Banner/>
            <Divider/>
            <FeaturedProducts/>
            <Footer/>
        </>
    );
}

export default App;
