import React from "react";
import Hero from "../components/Hero";
import Header from "../components/Header";
import BannerExplore from "../components/BannerExplore";
import BannerDownload from "../components/BannerDownload";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <BannerExplore />
      <BannerDownload />
      <Footer />
    </>
  );
};

export default Home;
