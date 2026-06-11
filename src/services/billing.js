import { store, ProductType, Platform } from 'capacitor-plugin-cdv-purchase';

const PRODUCT_IDS = [
  'pupa_basic_monthly',
  'pupa_basic_yearly',
  'pupa_premium_monthly',
  'pupa_premium_yearly'
];

export const initializeBilling = async () => {
  try {
    store.verbosity = store.LogLevel.ERROR;

    // Register products
    PRODUCT_IDS.forEach(id => {
      store.register({
        id: id,
        type: ProductType.PAID_SUBSCRIPTION,
        platform: Platform.GOOGLE_PLAY
      });
    });

    // Initialize
    await store.initialize([Platform.GOOGLE_PLAY]);

    // Get products
    const products = store.products;
    return products.map(p => ({
      productId: p.id,
      price: p.pricing?.price,
      title: p.title,
      description: p.description
    }));
  } catch (error) {
    console.error('Billing init error:', error);
    return [];
  }
};

export const subscribe = async (productId) => {
  try {
    const product = store.get(productId);
    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    const offer = product.getOffer();
    if (!offer) {
      return { success: false, error: 'No offer available' };
    }

    const result = await store.order(offer);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const restorePurchases = async () => {
  try {
    await store.restorePurchases();
    return store.products;
  } catch (error) {
    console.error('Restore error:', error);
    return [];
  }
};