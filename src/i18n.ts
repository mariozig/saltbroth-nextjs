import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, isValidLocale } from './config/i18n';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  // requestLocale is a Promise that resolves to the locale string or undefined
  let requested;
  try {
    requested = await requestLocale;
  } catch {
    requested = undefined;
  }
  
  // Ensure that the incoming locale is valid
  const locale = requested && isValidLocale(requested) ? requested : defaultLocale;
  
  return {
    locale,
    messages: (await import(`./dictionaries/${locale}.json`)).default
  };
}); 