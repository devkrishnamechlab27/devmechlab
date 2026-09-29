import { Mail, Phone, MapPin, BadgeCheck } from "lucide-react";

import {
  FaLinkedin,
  FaInstagram,
  FaGithub,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-gray-300">

      <div className="max-w-7xl mx-auto px-8 py-16 grid md:grid-cols-3 gap-10">

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

        {/* Contact */}
        <div>

          <h3 className="text-xl font-bold text-white mb-5">
            Contact
          </h3>

          <div className="space-y-4">

            <div className="flex items-center gap-3">
              <Mail size={18} />
              info@devmechlab.com
            </div>

            <div className="flex items-center gap-3">
              <Phone size={18} />
              +91 9570204678
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={18} />
              India
            </div>

            <div className="flex items-center gap-3">
              <BadgeCheck size={18} />

              <span>
                Designed & Developed by{" "}
                <span className="font-semibold text-blue-400">
                  K.K. Ranjan
                </span>
              </span>
            </div>

          </div>

        </div>

        {/* Social */}
        <div>

          <h3 className="text-xl font-bold text-white mb-5">
            Follow Us
          </h3>

          <div className="flex gap-5">

            {/* LinkedIn */}
            <a
                 href="https://www.linkedin.com/company/devmechlab-official/"
                 target="_blank"
                 rel="noopener noreferrer"
                 aria-label="DevMechLab LinkedIn"
                 className="hover:text-blue-400 transition"
             >
                 <FaLinkedin size={28} />
                </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/devmechlab"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="DevMechLab Instagram"
              className="hover:text-pink-500 transition"
            >
             <FaInstagram size={28} />
             </a>

             {/* GitHub */}
             <a
                 href="https://github.com/devmechlab"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="hover:text-white transition"
                 aria-label="DevMechLab GitHub"
              >
                  <FaGithub size={28} />
                  </a>
               <a
    href="https://www.youtube.com/@devmechlab"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-red-500 transition-colors"
    aria-label="DevMechLab YouTube"
  >
    <FaYoutube size={28} />
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