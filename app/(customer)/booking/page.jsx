'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, PartyPopper, Utensils } from 'lucide-react';

export default function BookingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [date, setDate] = useState(new Date());
  const [bookingType, setBookingType] = useState('');
  const [partySize, setPartySize] = useState(1);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (status === 'loading') {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return (
      <div className="container mx-auto py-20 text-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-bold" style={{ color: '#8B4513' }}>Please Log In</h2>
          <p className="mt-2 text-muted-foreground">You need to be logged in to make a booking.</p>
          <Button asChild className="mt-6" style={{ backgroundColor: '#8B4513' }}>
            <Link href="/login?callbackUrl=/booking">Login to Continue</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    if (!bookingType || !date || !partySize || partySize < 1) {
        toast.error("Please fill in all required fields correctly.");
        setIsSubmitting(false);
        return;
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingType,
          eventDate: date,
          partySize,
          notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit booking.');
      }
      
      toast.success("Booking request sent! We will confirm it shortly.");
      router.push('/');

    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const bookingTypes = [
      { value: 'TABLE', label: 'Table Reservation', icon: Utensils },
      { value: 'BIRTHDAY', label: 'Birthday Celebration', icon: PartyPopper },
      { value: 'PARTY', label: 'Party / Event', icon: Users }
  ];

  return (
    <div className="min-h-screen py-12 md:py-20" style={{ background: 'linear-gradient(to bottom, #F5F5F5, #FFF8E1)'}}>
      <div className="container mx-auto max-w-4xl">
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
        >
            <Card 
                className="w-full shadow-2xl rounded-2xl border-2"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'saturate(180%) blur(10px)',
                    borderColor: 'rgba(200, 200, 200, 0.4)'
                }}
            >
                <CardContent className="p-8 md:p-12">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: '#8B4513' }}>
                        Reserve Your Spot
                        </h1>
                        <p className="mt-3 text-lg text-muted-foreground">
                        We can't wait to host you at Gloryland!
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 items-start">
                        {/* Left Column: Details */}
                        <div className="space-y-8">
                            <div>
                                <Label className="font-semibold text-base" style={{ color: '#8B4513' }}>1. What's the occasion?</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                                {bookingTypes.map(type => (
                                    <motion.button
                                        key={type.value}
                                        type="button"
                                        onClick={() => setBookingType(type.value)}
                                        className={`p-3 rounded-lg border-2 text-sm flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
                                            bookingType === type.value ? 'border-amber-500 bg-amber-500/10 shadow-lg' : 'border-gray-200 bg-white'
                                        }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <type.icon className={`w-6 h-6 transition-colors ${bookingType === type.value ? 'text-amber-600' : 'text-gray-500'}`} />
                                        <span className={`font-medium ${bookingType === type.value ? 'text-amber-700' : 'text-gray-600'}`}>{type.label}</span>
                                    </motion.button>
                                ))}
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="party-size" className="font-semibold text-base" style={{ color: '#8B4513' }}>2. How many guests?</Label>
                                <Input 
                                    id="party-size"
                                    type="number"
                                    value={partySize}
                                    onChange={(e) => {
                                        const num = parseInt(e.target.value, 10);
                                        setPartySize(isNaN(num) ? '' : num);
                                    }}
                                    min="1"
                                    className="mt-2 text-base p-6 rounded-lg bg-white/80"
                                />
                            </div>
                            <div>
                                <Label htmlFor="notes" className="font-semibold text-base" style={{ color: '#8B4513' }}>3. Any special requests?</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="e.g. wheelchair access, specific table..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="mt-2 text-base rounded-lg bg-white/80"
                                    rows={3}
                                />
                            </div>
                        </div>
                        
                        {/* Right Column: Calendar */}
                        <div className="flex flex-col items-center">
                            <Label className="font-semibold text-base mb-3" style={{ color: '#8B4513' }}>4. Select your date</Label>
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                disabled={(day) => day < new Date(new Date().setDate(new Date().getDate() - 1))}
                            />
                            <p className="text-xs text-muted-foreground mt-2 text-center">Final time will be confirmed via phone after your request is approved.</p>
                        </div>

                        {/* Submit Button */}
                        <div className="md:col-span-2 mt-4">
                            <motion.div whileTap={{ scale: 0.98 }}>
                                <Button 
                                    type="submit" 
                                    className="w-full text-lg font-bold py-7 rounded-lg shadow-lg" 
                                    disabled={isSubmitting || status !== 'authenticated'}
                                    style={{ backgroundColor: '#8B4513', color: 'white' }}
                                >
                                    {isSubmitting ? 'Sending Request...' : 'Confirm Booking Request'}
                                </Button>
                            </motion.div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
      </div>
    </div>
  );
}