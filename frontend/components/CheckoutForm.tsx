'use client';

import { useState } from 'react';
import { CheckoutFormData, validateCheckoutForm } from '@/lib/stripe-utils';

interface CheckoutFormProps {
  onSubmit: (formData: CheckoutFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function CheckoutForm({ onSubmit, isLoading = false }: CheckoutFormProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'US',
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateCheckoutForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setErrors([errorMessage]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isLoading || isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Display */}
      {errors.length > 0 && (
        <div className="neon-card border-neon-pink bg-red-900 bg-opacity-20">
          <h3 className="text-neon-pink font-bold mb-2">✗ Form Errors</h3>
          <ul className="text-red-300 text-sm space-y-1">
            {errors.map((error, idx) => (
              <li key={idx}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Email Section */}
      <div>
        <label className="block text-neon-blue font-bold mb-2">
          EMAIL ADDRESS
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="neon-input w-full"
          placeholder="your@email.com"
          disabled={isDisabled}
        />
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-blue font-bold mb-2">
            FIRST NAME
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="neon-input w-full"
            placeholder="John"
            disabled={isDisabled}
          />
        </div>
        <div>
          <label className="block text-neon-blue font-bold mb-2">
            LAST NAME
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="neon-input w-full"
            placeholder="Doe"
            disabled={isDisabled}
          />
        </div>
      </div>

      {/* Address Fields */}
      <div>
        <label className="block text-neon-blue font-bold mb-2">
          STREET ADDRESS
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="neon-input w-full"
          placeholder="123 Main Street"
          disabled={isDisabled}
        />
      </div>

      <div>
        <label className="block text-neon-blue font-bold mb-2">
          APARTMENT, SUITE, ETC. (OPTIONAL)
        </label>
        <input
          type="text"
          name="addressLine2"
          value={formData.addressLine2 || ''}
          onChange={handleChange}
          className="neon-input w-full"
          placeholder="Apt 4B"
          disabled={isDisabled}
        />
      </div>

      {/* City, State, ZIP */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-neon-blue font-bold mb-2">CITY</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="neon-input w-full"
            placeholder="New York"
            disabled={isDisabled}
          />
        </div>
        <div>
          <label className="block text-neon-blue font-bold mb-2">STATE</label>
          <input
            type="text"
            name="state"
            value={formData.state || ''}
            onChange={handleChange}
            className="neon-input w-full"
            placeholder="NY"
            disabled={isDisabled}
          />
        </div>
        <div>
          <label className="block text-neon-blue font-bold mb-2">ZIP CODE</label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            className="neon-input w-full"
            placeholder="10001"
            disabled={isDisabled}
          />
        </div>
      </div>

      {/* Country */}
      <div>
        <label className="block text-neon-blue font-bold mb-2">COUNTRY</label>
        <select
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="neon-input w-full"
          disabled={isDisabled}
        >
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="GB">United Kingdom</option>
          <option value="AU">Australia</option>
          <option value="AT">Austria</option>
          <option value="BE">Belgium</option>
          <option value="DE">Germany</option>
          <option value="FR">France</option>
          <option value="IT">Italy</option>
          <option value="ES">Spain</option>
          <option value="NL">Netherlands</option>
          <option value="CH">Switzerland</option>
          <option value="SE">Sweden</option>
          <option value="NO">Norway</option>
          <option value="DK">Denmark</option>
          <option value="JP">Japan</option>
          <option value="AU">Australia</option>
          <option value="NZ">New Zealand</option>
        </select>
      </div>

      {/* Phone (Optional) */}
      <div>
        <label className="block text-neon-blue font-bold mb-2">
          PHONE (OPTIONAL)
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone || ''}
          onChange={handleChange}
          className="neon-input w-full"
          placeholder="+1 (555) 000-0000"
          disabled={isDisabled}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isDisabled}
        className={`neon-btn w-full py-3 text-lg font-bold transition ${
          isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-neon-pink'
        }`}
      >
        {isSubmitting ? 'PROCESSING...' : 'CONTINUE TO PAYMENT'}
      </button>
    </form>
  );
}
