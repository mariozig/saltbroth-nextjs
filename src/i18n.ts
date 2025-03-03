import { getRequestConfig } from 'next-intl/server';
import { locales } from './middleware';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  // requestLocale is a Promise that resolves to the locale string or undefined
  let requested;
  try {
    requested = await requestLocale;
  } catch (error) {
    requested = undefined;
  }
  
  // Ensure that the incoming locale is valid
  const locale = requested && locales.includes(requested) ? requested : 'en';
  
  return {
    locale,
    messages: (await import(`./dictionaries/${locale}.json`)).default
  };
}); 