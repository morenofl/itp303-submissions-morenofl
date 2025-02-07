import "./Banner.css"

export default function Banner() {
    return (
        <div id="banner">
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <div className="box1">
                            <h1>Apple</h1>
                            <div>
                                <p>
                                    Apple offers a variety of devices and accessories, 
                                    including smartphones, tablets, laptops, and wearables. 
                                    Whether you're looking for cutting-edge technology, 
                                    sleek design, or powerful performance, Apple has 
                                    something for everyone.
                                </p>

                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="box2">
                            <div>
                                <img id="bannerimage" src="bannerimage.png" alt="Apple Products" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}