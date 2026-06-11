// AdMob integration for Pupa Originals
// Shows ads only for free tier users
// NOTE: Install @capacitor-community/admob when ready for production

let AdMob = null;
let bannerVisible = false;

// Try to import AdMob, but don't crash if not installed
try {
  // This will work once @capacitor-community/admob is installed
  const admobModule = await import('@capacitor-community/admob');
  AdMob = admobModule.AdMob;
} catch (e) {
  console.log('AdMob not installed yet. Ads will be placeholders.');
}

const AD_IDS = {
  banner: 'ca-app-pub-3940256099942544/6300978111',      // Test ID
  interstitial: 'ca-app-pub-3940256099942544/1033173712', // Test ID
  rewarded: 'ca-app-pub-3940256099942544/5224354917',     // Test ID
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
  if (!AdMob) {
    console.log('AdMob not available - skipping init');
    return;
  }
  try {
    await AdMob.initialize({
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
  if (!AdMob) {
    console.log('AdMob not available - banner is placeholder');
    return;
  }
  if (bannerVisible) return;
  try {
    await AdMob.showBanner({
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
  if (!AdMob) return;
  try {
    await AdMob.hideBanner();
    bannerVisible = false;
  } catch (error) {
    console.log('Hide banner error:', error);
  }
};

// Show interstitial ad (between content)
export const showInterstitialAd = async () => {
  if (!isFreeTier()) return;
  if (!AdMob) {
    console.log('AdMob not available - interstitial skipped');
    return;
  }
  try {
    await AdMob.prepareInterstitial({
      adId: AD_IDS.interstitial,
    });
    await AdMob.showInterstitial();
  } catch (error) {
    console.log('Interstitial ad error:', error);
  }
};

// Show rewarded ad (for coins)
export const showRewardedAd = async () => {
  if (!AdMob) {
    console.log('AdMob not available - rewarded ad skipped');
    return { success: false, error: 'AdMob not installed' };
  }
  try {
    await AdMob.prepareRewardVideoAd({
      adId: AD_IDS.rewarded,
    });
    const reward = await AdMob.showRewardVideoAd();
    return { success: true, reward };
  } catch (error) {
    console.log('Rewarded ad error:', error);
    return { success: false, error: error.message };
  }
};

// Remove banner when component unmounts
export const removeBannerAd = async () => {
  if (!bannerVisible) return;
  if (!AdMob) return;
  try {
    await AdMob.removeBanner();
    bannerVisible = false;
  } catch (error) {
    console.log('Remove banner error:', error);
  }
};