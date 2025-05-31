'use client';

import React from 'react';
import Link from 'next/link'; // <--- Import Link dari next/link
import { FaInstagram } from 'react-icons/fa';

const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center py-5 px-6">
      <div className="flex items-center gap-2">
        {/* Menggunakan Link untuk logo agar bisa kembali ke homepage */}
        <Link href="/">
          <img
            src="https://ik.imagekit.io/4hotelsolution/ChatGPT%20Image%20May%2022,%202025,%2005_35_44%20PM.webp?updatedAt=1747910289562"
            alt="Citradigi Hotel Logo"
            className="h-16 w-auto cursor-pointer" // Tambahkan cursor-pointer untuk indikasi klik
          />
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {/* Ganti button dengan Link dan tambahkan hash ke href */}
        <Link href="/#benefits" className="text-sm hover:text-lime-500 transition-colors">Services</Link>
        <Link href="/#ai-customer" className="text-sm hover:text-lime-500 transition-colors">AI Customer</Link>
        <Link href="/#portfolio" className="text-sm hover:text-lime-500 transition-colors">Portfolio</Link>
        {/* Asumsi 'Pricing' juga merujuk ke bagian 'benefits' atau bagian lain di homepage */}
        <Link href="/#benefits" className="text-sm hover:text-lime-500 transition-colors">Pricing</Link>
        <Link href="/#faq" className="text-sm hover:text-lime-500 transition-colors">FAQ</Link>
      </div>

      {/* Bagian ini TIDAK PERNAH DIHAPUS, saya hanya salah copy-paste sebelumnya. Maaf! */}
      <a
        href="https://www.instagram.com/citradigitalhotel/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-500 text-white rounded-full px-4 py-2 text-sm hover:opacity-90 transition-opacity"
      >
        <FaInstagram className="text-lg" />
        Ikuti Kami
      </a>
    </nav>
  );
};

export default Navbar;