import { Card, CardContent } from '@/components/ui/card';
import { Car, Shield, Users, Clock } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight">About AutoMarket</h1>
        <p className="mb-12 text-lg text-muted-foreground">
          AutoMarket is your trusted destination for buying and selling vehicles. We connect car enthusiasts, 
          dealers, and private sellers in a secure and user-friendly marketplace.
        </p>
      </div>

      <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: <Car className="h-8 w-8" />,
            title: 'Wide Selection',
            description: 'Browse thousands of vehicles from trusted sellers across the country.',
          },
          {
            icon: <Shield className="h-8 w-8" />,
            title: 'Secure Platform',
            description: 'Advanced security measures to protect your data and transactions.',
          },
          {
            icon: <Users className="h-8 w-8" />,
            title: 'Verified Users',
            description: 'All sellers are verified to ensure a safe buying experience.',
          },
          {
            icon: <Clock className="h-8 w-8" />,
            title: '24/7 Support',
            description: 'Our dedicated team is always here to help you.',
          },
        ].map((feature, index) => (
          <Card key={index} className="text-center">
            <CardContent className="pt-6">
              <div className="mb-4 flex justify-center text-primary">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mx-auto max-w-3xl rounded-lg bg-slate-50 p-8 dark:bg-slate-900">
        <h2 className="mb-6 text-2xl font-bold">Our Mission</h2>
        <p className="mb-4 text-muted-foreground">
          At AutoMarket, we're passionate about making car buying and selling as simple and secure as possible. 
          Our platform is built on the principles of transparency, security, and exceptional user experience.
        </p>
        <p className="text-muted-foreground">
          Whether you're looking to find your dream car or sell your current vehicle, AutoMarket provides 
          all the tools and support you need to make it happen.
        </p>
      </div>
    </div>
  );
}