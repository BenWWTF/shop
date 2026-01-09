import { loadStripe } from '@stripe/stripe-js';

let stripePromise: ReturnType<typeof loadStripe>;

export const getStripePromise = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || '');
  }
  return stripePromise;
};

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  postal_code: string;
  province?: string;
  country_code: string;
  phone?: string;
}

export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  addressLine2?: string;
  city: string;
  zipCode: string;
  state?: string;
  country: string;
  phone?: string;
}

export const formatAddressForMedusa = (
  formData: CheckoutFormData
): ShippingAddress => {
  return {
    first_name: formData.firstName,
    last_name: formData.lastName,
    address_1: formData.address,
    address_2: formData.addressLine2,
    city: formData.city,
    postal_code: formData.zipCode,
    province: formData.state,
    country_code: formData.country,
    phone: formData.phone,
  };
};

export const validateCheckoutForm = (formData: CheckoutFormData): string[] => {
  const errors: string[] = [];

  if (!formData.email) errors.push('Email is required');
  if (!formData.firstName) errors.push('First name is required');
  if (!formData.lastName) errors.push('Last name is required');
  if (!formData.address) errors.push('Address is required');
  if (!formData.city) errors.push('City is required');
  if (!formData.zipCode) errors.push('ZIP/Postal code is required');
  if (!formData.country) errors.push('Country is required');

  // Basic email validation
  if (formData.email && !formData.email.includes('@')) {
    errors.push('Valid email is required');
  }

  return errors;
};
