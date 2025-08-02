import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function StatCard({ title, value, icon, index }) {
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { delay: index * 0.1, duration: 0.5, ease: "easeOut" } 
    },
  };

  return (
    <motion.div variants={cardVariants}>
      <Card 
        className="border-2 border-white/30 shadow-lg"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'saturate(180%) blur(10px)',
        }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle 
            className="text-sm font-bold" 
            style={{ color: '#8B4513' }} // SaddleBrown
          >
            {title}
          </CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div 
            className="text-3xl font-bold" 
            style={{ color: '#8B4513' }} // SaddleBrown
          >
            {value}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}