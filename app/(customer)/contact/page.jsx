'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message. Please try again later.");
      }
      
      toast.success("Thank you for your message! We'll get back to you soon.");
      setFormData({ name: '', email: '', message: '' }); // Clear form
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    viewport: { once: true, amount: 0.2 }
  };

  return (
    <div className="bg-[#F8F8F8] py-20 md:py-32">
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: '#8B4513' }}>
            Get In Touch
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            We'd love to hear from you. Whether it's a question about our menu, a booking inquiry, or just to say hello, please don't hesitate to reach out.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Left Column: Contact Form */}
          <motion.div className="lg:col-span-2" variants={fadeIn} initial="initial" whileInView="whileInView" viewport={fadeIn.viewport}>
            <Card className="shadow-2xl rounded-2xl border-none">
              <CardContent className="p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-semibold">Full Name</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="p-6 rounded-lg" required/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-semibold">Email Address</Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className="p-6 rounded-lg" required/>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="font-semibold">Message</Label>
                    <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Your message..." rows={6} className="rounded-lg" required/>
                  </div>
                  <Button type="submit" className="w-full font-bold text-lg py-7 rounded-lg" style={{ backgroundColor: '#8B4513' }} disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column: Details & Map */}
          <motion.div className="space-y-8" variants={fadeIn} initial="initial" whileInView="whileInView" viewport={fadeIn.viewport}>
            <Card className="shadow-lg rounded-2xl border-none">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4" style={{ color: '#8B4513' }}>Contact Information</h3>
                <div className="space-y-4 text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <MapPin className="h-5 w-5 text-[#8B4513]" />
                    <span>Aburi Hills, Eastern Region, Ghana</span>
                  </div>
                   <div className="flex items-center gap-4">
                    <Phone className="h-5 w-5 text-[#8B4513]" />
                    <span>+233 12 345 6789</span>
                  </div>
                   <div className="flex items-center gap-4">
                    <Mail className="h-5 w-5 text-[#8B4513]" />
                    <span>reservations@gloryland.com</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg rounded-2xl border-none overflow-hidden aspect-square">
                {/* Google Maps Embed - Centered on Aburi Botanical Gardens as a placeholder */}
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3968.428983803045!2d-0.1751111857317378!3d5.854388931980281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf2196317e3357%3A0x6cf2d74a7d65b53!2sAburi%20Botanical%20Gardens!5e0!3m2!1sen!2sgh!4v1691123456789"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}