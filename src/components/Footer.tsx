import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Facebook, Twitter, Instagram, Linkedin, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-brand-600 p-2 rounded-lg">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-lg leading-tight">BINGO</div>
                <div className="text-brand-500 text-xs font-semibold tracking-widest">COURIERS</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Fast, reliable cross-border delivery across Southern Africa. Connecting communities, delivering trust.
            </p>
            <div className="flex gap-3">
              <a href="#" className="hover:text-brand-500 transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-brand-500 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-brand-500 transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-brand-500 transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="https://wa.me/27000000000" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-brand-500 transition-colors">Home</Link></li>
              <li><Link to="/track" className="hover:text-brand-500 transition-colors">Track Package</Link></li>
              <li><Link to="/pricing" className="hover:text-brand-500 transition-colors">Pricing</Link></li>
              <li><Link to="/routes" className="hover:text-brand-500 transition-colors">Routes</Link></li>
              <li><Link to="/faq" className="hover:text-brand-500 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-brand-500 transition-colors cursor-pointer">Express Delivery</span></li>
              <li><span className="hover:text-brand-500 transition-colors cursor-pointer">Package Tracking</span></li>
              <li><span className="hover:text-brand-500 transition-colors cursor-pointer">Customs Clearance</span></li>
              <li><span className="hover:text-brand-500 transition-colors cursor-pointer">Truck Rental</span></li>
              <li><span className="hover:text-brand-500 transition-colors cursor-pointer">Cross-Border Shipping</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                <span>123 Main Street, Johannesburg, 2000, South Africa</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <span>+27 00 000 0000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <span>info@bingocouriers.co.za</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <a href="https://wa.me/27000000000?text=Hello+Bingo+Couriers" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">
                  WhatsApp: +27 00 000 0000
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; 2024 Bingo Couriers. All rights reserved.</p>
          <div className="flex gap-4 mt-3 sm:mt-0">
            <a href="#" className="hover:text-brand-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-brand-500 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
