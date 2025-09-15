import Image from "next/image";
import Hero from "./components/Hero";
import NextTrip from "./components/NextTrip";
import Services from "./components/Services";
import GetToKnowRussia from "./components/GetToKnowRussia";
import BlogSection from "./components/BlogSection";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="">
     <Hero />
     < NextTrip />
     <Services />
     <GetToKnowRussia />
     <BlogSection />
     <Contact />
     <Footer />
    </div>
  );
}
