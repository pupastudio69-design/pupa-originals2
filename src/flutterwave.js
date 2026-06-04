// Flutterwave Payment Configuration
// Uses Vite environment variables — NEVER commit .env to Git

export const FLUTTERWAVE_CONFIG = {
  publicKey: import.meta.env.VITE_FLW_PUBLIC_KEY || '',
  secretKey: import.meta.env.VITE_FLW_SECRET_KEY || '',
  encryptionKey: import.meta.env.VITE_FLW_ENCRYPTION_KEY || '',
  isTestMode: true,
};

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 2500,
    period: 'month',
    durationDays: 30,
    flutterwavePlanId: 'basic-monthly-2500',
    features: [
      'Standard Streaming Quality',
      '30-60 Movie Library',
      'Delayed New Releases (7-14 days)',
      'Light Ads & Sponsored Messages',
      'View-Only Comments',
      'No Downloads',
      'No Exclusive Content',
      'No Early Releases'
    ],
    hasAds: true,
    hasDownloads: false,
    maxMovies: 60,
    releaseDelay: '7-14 days',
    quality: 'Standard',
    interaction: 'View Only'
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 4000,
    period: 'month',
    durationDays: 30,
    flutterwavePlanId: 'premium-monthly-4000',
    features: [
      '4K Ultra HD Streaming',
      'Unlimited Movie Library',
      'Immediate New Releases',
      'No Ads — Ever',
      'Full Comments & Interaction',
      'Unlimited Downloads',
      'Exclusive Content Access',
      'Early Releases & Voting Power',
      'BTS Content & Creator Gifts'
    ],
    hasAds: false,
    hasDownloads: true,
    maxMovies: 'Unlimited',
    releaseDelay: 'Immediate',
    quality: '4K Ultra HD',
    interaction: 'Full Access',
    popular: true
  }
};

// Coin Packages
export const COIN_PACKAGES = [
  { id: 'coins-100', coins: 100, price: 500, label: '100 Coins', description: 'Small gift' },
  { id: 'coins-250', coins: 250, price: 1000, label: '250 Coins', description: 'Medium gift' },
  { id: 'coins-500', coins: 500, price: 2000, label: '500 Coins', description: 'Big gift' },
  { id: 'coins-1000', coins: 1000, price: 3500, label: '1000 Coins', description: 'Mega gift' }
];

// Payment metadata builder
export const buildPaymentData = ({
  user,
  amount,
  email,
  phone,
  name,
  paymentType,
  planId,
  coinPackage,
  movieId,
  callbackUrl
}) => {
  const txRef = `pupa_${paymentType}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  return {
    public_key: FLUTTERWAVE_CONFIG.publicKey,
    tx_ref: txRef,
    amount: amount,
    currency: 'NGN',
    payment_options: 'card,ussd,banktransfer,mpesa',
    customer: {
      email: email || user?.email || 'guest@pupaoriginals.com',
      phone_number: phone || user?.phoneNumber || '',
      name: name || user?.displayName || 'Pupa User',
    },
    customizations: {
      title: paymentType === 'subscription' ? 'Pupa Originals Subscription' : 'Pupa Originals Coins',
      description: paymentType === 'subscription'
        ? `Subscribe to ${planId} plan`
        : `Purchase ${coinPackage?.label}`,
      logo: 'https://pupaoriginals.com/logo.png',
    },
    meta: {
      userId: user?.uid || 'guest',
      paymentType: paymentType,
      planId: planId || null,
      coinPackageId: coinPackage?.id || null,
      movieId: movieId || null,
    },
    callback: callbackUrl || window.location.href,
  };
};