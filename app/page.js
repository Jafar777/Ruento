import Image from "next/image";
import Hero from "./components/Hero";
import NextTrip from "./components/NextTrip";
import Services from "./components/Services";
import GetToKnowRussia from "./components/GetToKnowRussia";

export default function Home() {
  return (
    <div className="">
     <Hero />
     < NextTrip />
     <Services />
     <GetToKnowRussia />
    </div>
  );
}
