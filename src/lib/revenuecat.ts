import { Purchases, Package } from '@revenuecat/purchases-js';

export const initializeRevenueCat = () => {
  if (typeof window !== 'undefined') {
    const apiKey = process.env.NEXT_PUBLIC_REVENUECAT_API_KEY || '';
    
    if (apiKey) {
      try {
        Purchases.configure(apiKey, '');
      } catch (error) {
        console.error('Error configuring RevenueCat:', error);
      }
    } else {
      console.warn('RevenueCat API key is not defined');
    }
  }
};

export const getSubscriptionStatus = async () => {
  try {
    const customerInfo = await Purchases.getSharedInstance().getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return null;
  }
};

export const identifyUser = async (userId: string) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_REVENUECAT_API_KEY || '';
    if (!apiKey) {
      throw new Error('RevenueCat API key is not defined');
    }
    
    Purchases.configure(apiKey, userId);
    const customerInfo = await Purchases.getSharedInstance().getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.error('Error identifying user:', error);
    throw error;
  }
};

export const purchasePackage = async (pkg: Package) => {
  try {
    const { customerInfo } = await Purchases.getSharedInstance().purchasePackage(pkg);
    return customerInfo;
  } catch (error) {
    console.error('Error purchasing package:', error);
    throw error;
  }
};

// Note: The RevenueCat Web SDK doesn't have a restorePurchases method like the mobile SDKs
// For web, purchases are automatically restored when the user logs in 