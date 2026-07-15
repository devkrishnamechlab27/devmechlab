import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Courses from "./components/Courses";
import Internship from "./components/Internship";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <Courses />
      <Internship/>
    </>
  );
}