import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { footer } from '@/lib/constants/landing';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 px-4 py-10" id="contact">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">

        {/* Logo */}
        <div className="relative h-16 w-34">
          <Image src={footer.icon} alt="logo" fill className="object-contain" />
        </div>

        {/* Nav links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {Object.entries(footer.links).map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="text-xs text-gray-500 hover:text-gray-900 transition-colors font-medium"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Social icons */}
        <div className="flex items-center gap-3">
          {footer.contact.map((item) => (
            <a
              key={item.platform}
              href={item.link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              {item.platform === 'WhatsApp' ? (
                <img src="/logos/icons8-whatsapp.gif" alt="WhatsApp icon" className="w-6 h-6" />
              ) : (
                <img src="/logos/icons8-instagram.gif" alt="Instagram icon" className="w-6 h-6" />
              )}
            </a>
          ))}
        </div>


        {/* Copyright */}
        <p className="text-xs text-gray-400 text-center">{footer.copy}</p>

      </div>
    </footer>
  );
}