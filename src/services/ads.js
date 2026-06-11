// AdMob integration for Pupa Originals
// Shows ads only for free tier users
// NOTE: Install @capacitor-community/admob and replace this file when ready

let bannerVisible = false;

// Stub AdMob object - does nothing but logs
const AdMobStub = {
  initialize: async () => console.log('[AdMob Stub] initialize called'),
  showBanner: async () => console.log('[AdMob Stub] showBanner called'),
  hideBanner: async () => console.log('[AdMob Stub] hideBanner called'),
  removeBanner: async () => console.log('[AdMob Stub] removeBanner called'),
  prepareInterstitial: async () => console.log('[AdMob Stub] prepareInterstitial called'),
  showInterstitial: async () => console.log('[AdMob Stub] showInterstitial called'),
  prepareRewardVideoAd: async () => console.log('[AdMob Stub] prepareRewardVideoAd called'),
  showRewardVideoAd: async () => {
    console.log('[AdMob Stub] showRewardVideoAd called');
    return { amount: 50 };
  },
};

// Try to get real AdMob, fallback to stub
const getAdMob = async () => {
  // When you install @capacitor-community/admob, uncomment below:
  // try {
  //   const { AdMob } = await import('@capacitor-community/admob');
  //   return AdMob;
  // } catch (e) {
  //   return AdMobStub;
  // }
  return AdMobStub;
};

const AD_IDS = {
  banner: 'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
  rewarded: 'ca-app-pub-3940256099942544/5224354917',
};

// Check if user is on free tier
export const isFreeTier = () => {
  const sub = localStorage.getItem('pupa_subscription');
  if (!sub) return true;
  try {
    const data = JSON.parse(sub);
    return !data.planId || data.planId === 'free';
  } catch {
    return true;
  }
};

// Initialize AdMob
export const initializeAds = async () => {
  if (!isFreeTier()) return;
  const admob = await getAdMob();
  try {
    await admob.initialize({
      requestTrackingAuthorization: true,
      testingDevices: [],
      initializeForTesting: true,
    });
  } catch (error) {
    console.log('AdMob init error:', error);
  }
};

// Show banner ad
export const showBannerAd = async () => {
  if (!isFreeTier()) return;
  const admob = await getAdMob();
  if (bannerVisible) return;
  try {
    await admob.showBanner({
      adId: AD_IDS.banner,
      position: 'bottom',
      margin: 60,
    });
    bannerVisible = true;
  } catch (error) {
    console.log('Banner ad error:', error);
  }
};

// Hide banner ad
export const hideBannerAd = async () => {
  if (!bannerVisible) return;
  const admob = await getAdMob();
  try {
    await admob.hideBanner();
    bannerVisible = false;
  } catch (error) {
    console.log('Hide banner error:', error);
  }
};

// Show interstitial ad
export const showInterstitialAd = async () => {
  if (!isFreeTier()) return;
  const admob = await getAdMob();
  try {
    await admob.prepareInterstitial({
      adId: AD_IDS.interstitial,
    });
    await admob.showInterstitial();
  } catch (error) {
    console.log('Interstitial ad error:', error);
  }
};

// Show rewarded ad
export const showRewardedAd = async () => {
  const admob = await getAdMob();
  try {
    await admob.prepareRewardVideoAd({
      adId: AD_IDS.rewarded,
    });
    const reward = await admob.showRewardVideoAd();
    return { success: true, reward };
  } catch (error) {
    console.log('Rewarded ad error:', error);
    return { success: false, error: error.message };
  }
};

// Remove banner
export const removeBannerAd = async () => {
  if (!bannerVisible) return;
  const admob = await getAdMob();
  try {
    await admob.removeBanner();
    bannerVisible = false;
  } catch (error) {
    console.log('Remove banner error:', error);
  }
};