# Stripe Integration Demo

This project demonstrates Stripe integration with themes using Next.js. It includes:

- Stripe Payment Element
- Stripe Address Element with Google Places Autocomplete
- Light/Dark theme switcher

## Getting Started

1. Clone this repository
2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

### Payment Processing

The integration uses Stripe's Payment Element and Address Element to collect payment information and billing details. The Address Element is configured to use Google Places API for address autocomplete.

### Theme Support

The application supports both light and dark themes, with a convenient theme switcher in the top-right corner. The themes include predefined colors for:

- Background
- Foreground (text)
- Primary (accent color)
- Secondary
- Success
- Error
- Border
- Card Background
- Stripe Accent

The UI and Stripe elements automatically adapt to the selected theme.

## Implementation Details

- `/src/app/api/create-payment-intent/route.js` - Server API endpoint for creating a Stripe Payment Intent
- `/src/app/components/CheckoutForm.js` - Stripe Payment and Address elements
- `/src/app/components/ThemeSwitch.js` - Light/Dark theme toggle
- `/src/app/context/ThemeContext.js` - Theme management with React Context

## Customizing Stripe Elements

The Stripe elements are styled to match your brand colors. The styling is applied in the `CheckoutForm.js` file:

```javascript
// Create Stripe appearance from theme colors
const appearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: colors.primary,
    colorBackground: colors.cardBackground,
    colorText: colors.foreground,
    colorDanger: colors.error,
    fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
    borderRadius: '4px',
    fontSizeBase: '16px'
  },
  // Additional rules...
};
```

You can modify these settings to match your brand's visual identity.

## Google Places Integration

The Address Element is configured to use Google Places API for address autocomplete. This provides a better user experience when entering billing addresses.

## Stripe Test Mode

This demo uses Stripe test mode by default. To test payments, you can use Stripe's test card numbers:

- `4242 4242 4242 4242` - Successful payment
- `4000 0000 0000 9995` - Failed payment

For testing 3D Secure:
- `4000 0025 0000 3155` - 3D Secure authentication required
