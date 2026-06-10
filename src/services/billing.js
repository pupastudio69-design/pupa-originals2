import * as InAppPurchase from 'capacitor-plugin-cdv-purchase';

const PRODUCT_IDS = [
  'pupa_basic_monthly',
  'pupa_basic_yearly',
  'pupa_premium_monthly',
  'pupa_premium_yearly'
];

export const initializeBilling = async () => {
  try {
    await InAppPurchase.initialize();
    const products = await InAppPurchase.getProducts(PRODUCT_IDS);
    return products;
  } catch (error) {
    console.error('Billing init error:', error);
    return [];
  }
};

export const subscribe = async (productId) => {
  try {
    const result = await InAppPurchase.order(productId);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const restorePurchases = async () => {
  try {
    const result = await InAppPurchase.restorePurchases();
    return result;
  } catch (error) {
    console.error('Restore error:', error);
    return [];
  }
};