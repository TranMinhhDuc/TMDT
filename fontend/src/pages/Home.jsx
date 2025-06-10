import React from "react";
import Hero from "../component/Hero";
import LatestCollection from "../component/LatestCollection";
import BestSeller from "../component/BestSeller.jsx";
import Policy from "../component/Policy.jsx";

const Home = () => {
    return(
        <div>
            <Hero />
            <LatestCollection />
            <BestSeller />
            <Policy />
        </div>
    );
};

export default Home;