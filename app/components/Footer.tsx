import { Mail, Phone, MapPin } from "lucide-react";

import {
  FaLinkedin,
  FaInstagram,
  FaGithub,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-gray-300">

      <div className="max-w-7xl mx-auto px-8 py-16 grid md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>

          <h2 className="text-3xl font-extrabold">
            <span className="text-blue-500">Dev</span>
            <span className="text-white">Mech</span>
            <span className="text-orange-500">Lab</span>
          </h2>

          <p className="mt-5 leading-7 text-gray-400">
            India's Engineering Learning Platform dedicated to
            Mechanical Engineering, CAD/CAM, CNC Programming,
            ANSYS, Industrial Refrigeration and Cryogenics.
          </p>

        </div>

        {/* Quick Links */}
        <div>

          <h3 className="text-xl font-bold text-white mb-5">
            Quick Links
          </h3>

          <ul className="space-y-3">
            <li><a href="#" className="hover:text-blue-400">Home</a></li>
            <li><a href="#" className="hover:text-blue-400">Courses</a></li>
            <li><a href="#" className="hover:text-blue-400">Internships</a></li>
            <li><a href="#" className="hover:text-blue-400">Certificates</a></li>
          </ul>

        </div>

        {/* Contact */}
        <div>

          <h3 className="text-xl font-bold text-white mb-5">
            Contact
          </h3>

          <div className="space-y-4">

            <div className="flex items-center gap-3">
              <Mail size={18}/>
              info@devmechlab.com
            </div>

            <div className="flex items-center gap-3">
              <Phone size={18}/>
              +91 XXXXX XXXXX
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={18}/>
              India
            </div>

          </div>

        </div>

        {/* Social */}
        <div>

          <h3 className="text-xl font-bold text-white mb-5">
            Follow Us
          </h3>

          <div className="flex gap-5">

            <a href="#" className="hover:text-blue-400">
              <FaLinkedin size={28}/>
            </a>

            <a href="#" className="hover:text-pink-500">
              <FaInstagram size={28}/>
            </a>

            <a href="#" className="hover:text-white">
              <FaGithub size={28}/>
            </a>

          </div>

        </div>

      </div>

      <div className="border-t border-slate-800 text-center py-6 text-gray-500">

        © 2026 DevMechLab. All Rights Reserved.

      </div>

    </footer>
  );
}