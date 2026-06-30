"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Hospital, Users, Calendar, FileText, Pill, FlaskConical, 
  DollarSign, Shield, ArrowRight, CheckCircle, Activity, 
  Heart, Stethoscope, ChevronRight, Star, Clock, Building2,
  Menu, X, BedDouble, Package, BarChart3, UserCheck
} from "lucide-react";
import { useState } from "react";

export default function HomePage() {
  const [mobileMenu, setMobileMenu] = useState(false);

  const features = [
    { icon: Users, title: "Patient Management", desc: "Complete patient records, history, and tracking system", color: "from-blue-500 to-cyan-500" },
    { icon: Calendar, title: "Appointment Scheduling", desc: "Smart calendar with conflict detection and reminders", color: "from-purple-500 to-pink-500" },
    { icon: FileText, title: "Medical Records", desc: "Secure digital records with full audit trail", color: "from-green-500 to-emerald-500" },
    { icon: Pill, title: "Pharmacy Management", desc: "Inventory tracking and automated dispensing", color: "from-orange-500 to-red-500" },
    { icon: FlaskConical, title: "Laboratory", desc: "Test ordering, results, and reporting system", color: "from-indigo-500 to-purple-500" },
    { icon: DollarSign, title: "Billing System", desc: "Automated invoicing and payment processing", color: "from-teal-500 to-green-500" },
    { icon: Shield, title: "Security & Compliance", desc: "HIPAA compliant with role-based access control", color: "from-red-500 to-pink-500" },
    { icon: BarChart3, title: "Analytics Dashboard", desc: "Real-time insights and comprehensive reporting", color: "from-yellow-500 to-orange-500" },
    { icon: BedDouble, title: "Inpatient Management", desc: "Bed allocation, vitals tracking, and discharge", color: "from-cyan-500 to-blue-500" },
  ];

  const stats = [
    { value: "10,000+", label: "Patients Managed", icon: Users },
    { value: "500+", label: "Healthcare Providers", icon: UserCheck },
    { value: "99.9%", label: "System Uptime", icon: Activity },
    { value: "24/7", label: "Support Available", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Hospital className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
              Hospital MIS
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#stats" className="text-sm text-gray-300 hover:text-white transition-colors">Stats</a>
            <Link href="/login">
              <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="md:hidden border-t border-white/5 bg-slate-950/95 backdrop-blur-xl">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-300 py-2">Features</a>
              <a href="#stats" className="block text-gray-300 py-2">Stats</a>
              <Link href="/login"><Button variant="outline" className="w-full border-white/10 text-white">Sign In</Button></Link>
              <Link href="/register"><Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">Get Started</Button></Link>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm mb-8">
              <Star className="h-4 w-4 fill-current" />
              Trusted by healthcare professionals worldwide
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Complete Hospital
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Management System
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Streamline your hospital operations with our comprehensive platform.
              From patient records to billing, everything you need in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-lg px-8 py-6 rounded-2xl shadow-xl shadow-blue-500/25 group">
                  Get Started Now
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-2xl border-white/10 hover:bg-white/5 text-white">
                  Learn More
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to manage your hospital efficiently
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 px-4 bg-white/5">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <stat.icon className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{stat.value}</p>
                <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="max-w-2xl mx-auto p-12 rounded-3xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 backdrop-blur-sm"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mx-auto mb-6">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Hospital?</h2>
            <p className="text-gray-400 mb-8">Join thousands of healthcare providers using our platform.</p>
            <Link href="/login">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-lg px-8 py-6 rounded-2xl shadow-xl shadow-blue-500/25">
                Get Started Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/5">
        <div className="container mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © 2024 Hospital MIS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}