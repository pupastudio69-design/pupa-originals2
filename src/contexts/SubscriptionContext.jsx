import React, { createContext, useContext, useState, useEffect } from 'react';

const SubscriptionContext = createContext();

export function SubscriptionProvider({ children }) {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = () => {
    const sub = localStorage.getItem('pupa_subscription');
    if (sub) {
      try {
        const data = JSON.parse(sub);
        const expiry = new Date(data.expiryDate);
        const now = new Date();
        if (expiry > now) {
          setSubscription(data);
          setLoading(false);
          return { active: true, data };
        } else {
          localStorage.removeItem('pupa_subscription');
        }
      } catch {
        localStorage.removeItem('pupa_subscription');
      }
    }
    setSubscription(null);
    setLoading(false);
    return { active: false };
  };

  const startTrial = (planId) => {
    const trialData = {
      plan: planId,
      period: 'trial',
      startDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'trial',
      paymentReference: 'trial_' + Date.now(),
      paymentMethod: 'free_trial',
      amountPaid: 0
    };
    localStorage.setItem('pupa_subscription', JSON.stringify(trialData));
    setSubscription(trialData);
    return trialData;
  };

  const savePaidSubscription = (planId, period, amount, paymentRef, transactionRef) => {
    const duration = period === 'yearly' ? 365 : 30;
    const subData = {
      plan: planId,
      period: period,
      startDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      paymentReference: paymentRef,
      transactionReference: transactionRef,
      paymentMethod: 'monnify_card',
      amountPaid: amount
    };
    localStorage.setItem('pupa_subscription', JSON.stringify(subData));
    setSubscription(subData);
    return subData;
  };

  const isSubscribed = () => {
    if (!subscription) return false;
    const expiry = new Date(subscription.expiryDate);
    return expiry > new Date();
  };

  const isPremium = () => isSubscribed() && subscription?.plan === 'premium';
  const isTrial = () => isSubscribed() && subscription?.status === 'trial';
  
  const daysLeft = () => {
    if (!subscription) return 0;
    const expiry = new Date(subscription.expiryDate);
    const now = new Date();
    return Math.max(0, Math.ceil((expiry - now) / (1000 * 60 * 60 * 24)));
  };

  const value = {
    subscription,
    loading,
    checkSubscription,
    startTrial,
    savePaidSubscription,
    isSubscribed,
    isPremium,
    isTrial,
    daysLeft
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) throw new Error('useSubscription must be used within SubscriptionProvider');
  return context;
}