import { IntervalE } from '../types/enums';

const configuration = {
  products: [
    {
      name: 'Basic',
      description: 'Best for hobby or individual Projects',
      features: ['Unlimited Posts', '10 Users', '1000 API requests', 'Email Support'],
      plans: [
        {
          name: 'Basic Monthly',
          interval: IntervalE.MONTHLY,
          price: '10',
          price_id: process.env.NEXT_PUBLIC_PRICE_ID_BASIC_MONTHLY,
          isPopular: true
        },
        {
          name: 'Basic Annual',
          interval: IntervalE.YEARLY,
          price: '100',
          price_id: process.env.NEXT_PUBLIC_PRICE_ID_BASIC_YEARLY,
          isPopular: false
        }
      ]
    },
    {
      name: 'Pro',
      description: 'Best for Teams or organizations',
      features: [
        'Unlimited Posts',
        'Unlimited Users',
        'Unlimited API Requests',
        'Priority Support'
      ],
      plans: [
        {
          name: 'Pro Monthly',
          interval: IntervalE.MONTHLY,
          price: '20',
          price_id: process.env.NEXT_PUBLIC_PRICE_ID_PREMIUM_MONTHLY,
          isPopular: false
        },
        {
          name: 'Pro Annual',
          interval: IntervalE.YEARLY,
          price: '200',
          price_id: process.env.NEXT_PUBLIC_PRICE_ID_PREMIUM_YEARLY,
          isPopular: false
        }
      ]
    }
  ]
};

export default configuration;
