import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Leo Fashion</h3>
            <p className="text-gray-400 mb-4">
              Your ultimate destination for trendy clothing and accessories. We offer a curated selection of high-quality fashion items to elevate your style.
            </p>
            <div className="flex items-center mb-2">
              <MapPin className="mr-2 h-5 w-5 text-gray-400" />
              <p className="text-gray-400">123 Fashion Street, surat, gujrat 345006</p>
            </div>
            <div className="flex items-center mb-2">
              <Phone className="mr-2 h-5 w-5 text-gray-400" />
              <p className="text-gray-400">+1 123 456 7890</p>
            </div>
            <div className="flex items-center mb-2">
              <Mail className="mr-2 h-5 w-5 text-gray-400" />
              <p className="text-gray-400">info@leofashion.com</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop/home" className="text-gray-400 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/shop/products" className="text-gray-400 hover:text-white">Products</Link>
              </li>
              <li>
                <Link to="/shop/account" className="text-gray-400 hover:text-white">My Account</Link>
              </li>
              <li>
                <Link to="/shop/contact" className="text-gray-400 hover:text-white">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/" className="text-gray-400 hover:text-white">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://x.com/?lang=en" className="text-gray-400 hover:text-white">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="https://www.instagram.com/" className="text-gray-400 hover:text-white">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Leo Fashion. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;