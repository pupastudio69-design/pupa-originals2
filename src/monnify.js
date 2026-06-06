// Monnify Payment Module for Pupa Originals
// Replaces flutterwave.js completely

export const MONNIFY_CONFIG = {
  apiKey: import.meta.env.VITE_MONNIFY_API_KEY || '',
  secretKey: import.meta.env.VITE_MONNIFY_SECRET_KEY || '',
  contractCode: import.meta.env.VITE_MONNIFY_CONTRACT_CODE || '',
  isTestMode: import.meta.env.VITE_MONNIFY_TEST_MODE !== 'false',
};

const BASE_URL = MONNIFY_CONFIG.isTestMode 
  ? 'https://sandbox.monnify.com' 
  : 'https://api.monnify.com';

export const SUBSCRIPTION_PLANS = {
  basic: {
    id: 'basic',
    name: 'Basic',
    monthlyPrice: 2500,
    yearlyPrice: 25000,
    period: 'month',
    durationDays: 30,
    features: [
      'Standard Streaming Quality',
      '30-60 Movie Library',
      'Delayed New Releases (7-14 days)',
      'Light Ads & Sponsored Messages',
      'View-Only Comments',
      'No Downloads',
      'No Exclusive Content',
      'No Early Releases',
      'Silver PUPA Badge on Profile'
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
    monthlyPrice: 4000,
    yearlyPrice: 40000,
    period: 'month',
    durationDays: 30,
    features: [
      '4K Ultra HD Streaming',
      'Unlimited Movie Library',
      'Immediate New Releases',
      'No Ads — Ever',
      'Full Comments & Interaction',
      'Unlimited Downloads',
      'Exclusive Content Access',
      'Early Releases & Voting Power',
      'BTS Content & Creator Gifts',
      'Gold PUPA Badge on Profile',
      'Priority Support'
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

export const COIN_PACKAGES = [
  { id: 'coins-100', coins: 100, price: 500, label: '100 Coins', description: 'Small gift' },
  { id: 'coins-250', coins: 250, price: 1000, label: '250 Coins', description: 'Medium gift' },
  { id: 'coins-500', coins: 500, price: 2000, label: '500 Coins', description: 'Big gift' },
  { id: 'coins-1000', coins: 1000, price: 3500, label: '1000 Coins', description: 'Mega gift' }
];

export const generateTxRef = (paymentType) => {
  return `pupa_${paymentType}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
};

export const buildMonnifyPaymentData = ({
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
  const paymentReference = generateTxRef(paymentType);

  return {
    amount: amount,
    currency: 'NGN',
    paymentReference: paymentReference,
    paymentDescription: paymentType === 'subscription' 
      ? `Pupa Originals ${planId?.toUpperCase()} Subscription` 
      : `Pupa Originals ${coinPackage?.label || 'Coins'}`,
    customerEmail: email || user?.email || 'guest@pupaoriginals.com',
    customerName: name || user?.displayName || 'Pupa User',
    customerPhoneNumber: phone || user?.phoneNumber || '08000000000',
    contractCode: MONNIFY_CONFIG.contractCode,
    redirectUrl: callbackUrl || `${window.location.origin}/payment/callback`,
    paymentMethods: ['CARD'],
    metaData: {
      userId: user?.uid || 'guest',
      paymentType: paymentType,
      planId: planId || null,
      coinPackageId: coinPackage?.id || null,
      movieId: movieId || null,
    }
  };
};

let sdkLoaded = false;

const loadMonnifySDK = () => {
  return new Promise((resolve, reject) => {
    if (sdkLoaded || window.MonnifySDK) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://sdk.monnify.com/plugin/monnify.js';
    script.async = true;
    script.onload = () => {
      sdkLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load Monnify SDK'));
    document.head.appendChild(script);
  });
};

export const initializeMonnifyPayment = async (paymentData, onSuccess, onError) => {
  try {
    await loadMonnifySDK();
    const handler = window.MonnifySDK.initialize({
      amount: paymentData.amount,
      currency: paymentData.currency || 'NGN',
      reference: paymentData.paymentReference,
      customerFullName: paymentData.customerName,
      customerEmail: paymentData.customerEmail,
      customerMobileNumber: paymentData.customerPhoneNumber,
      apiKey: MONNIFY_CONFIG.apiKey,
      contractCode: MONNIFY_CONFIG.contractCode,
      paymentDescription: paymentData.paymentDescription,
      isTestMode: MONNIFY_CONFIG.isTestMode,
      paymentMethods: paymentData.paymentMethods || ['CARD'],
      metadata: paymentData.metaData,
      onComplete: (response) => {
        console.log('Monnify Payment Response:', response);
        if (response.paymentStatus === 'PAID' || response.status === 'SUCCESS') {
          onSuccess && onSuccess(response);
        } else {
          onError && onError(new Error(`Payment status: ${response.paymentStatus || 'FAILED'}`));
        }
      },
      onClose: (response) => {
        console.log('Payment modal closed:', response);
      }
    });
    handler.loadPaymentModal();
  } catch (error) {
    console.error('Monnify init error:', error);
    onError && onError(error);
  }
};

export const verifyMonnifyTransaction = async (paymentReference) => {
  try {
    const authString = btoa(`${MONNIFY_CONFIG.apiKey}:${MONNIFY_CONFIG.secretKey}`);
    const response = await fetch(
      `${BASE_URL}/api/v1/merchant/transactions/query?paymentReference=${encodeURIComponent(paymentReference)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const data = await response.json();
    if (data.requestSuccessful && data.responseBody) {
      return {
        success: true,
        status: data.responseBody.paymentStatus,
        amount: data.responseBody.amount,
        paidOn: data.responseBody.paidOn,
        transactionReference: data.responseBody.transactionReference,
        paymentReference: data.responseBody.paymentReference,
        metaData: data.responseBody.metaData
      };
    }
    return { success: false, message: data.responseMessage || 'Verification failed' };
  } catch (error) {
    console.error('Monnify verification error:', error);
    return { success: false, message: error.message };
  }
};

export const getMonnifyAccessToken = async () => {
  try {
    const authString = btoa(`${MONNIFY_CONFIG.apiKey}:${MONNIFY_CONFIG.secretKey}`);
    const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (data.requestSuccessful) {
      return data.responseBody.accessToken;
    }
    throw new Error(data.responseMessage || 'Failed to get access token');
  } catch (error) {
    console.error('Monnify auth error:', error);
    throw error;
  }
};