'use client';

import { useState, useEffect } from 'react';
import {
  Elements,
  PaymentElement,
  AddressElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import styles from './CheckoutForm.module.css';

// Load Stripe outside of component render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Wrapper component
export default function CheckoutWrapper() {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch(err => console.error("Error loading payment intent:", err));
  }, []);

  // Custom appearance for Stripe elements
  const appearance = {
    theme: 'stripe',
    variables: {
      fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      spacingUnit: '4px',
      spacingGridRow: '16px',
      spacingTab: '4px',
      borderRadius: '4px',
      fontWeightNormal: '400',
      fontWeightBold: '600',
      fontSizeBase: '12px',
    },
    rules: {
      '.PaymentElement': {
        boxShadow: 'none',
        border: 'none',
        padding: '0',
        backgroundColor: 'transparent',
      },
      '.Input': {
        border: '1px solid var(--colorTextSecondary)',
        padding: '8px',
        transition: 'border-color 0.2s ease',
        boxSizing: 'border-box'
      },
      '.Input:focus': {
        border: '1px solid var(--colorPrimary)',
        outline: 'none',
        boxShadow: 'none',
      },
      '.Label': {
        fontSize: '12px',
        fontFamily: 'Inter, system-ui',
        fontWeight: '600',
        color: 'var(--colorTextSecondary)',
        marginBottom: 'var(--spacingTab)'
      },
      '.Input--invalid': {
        border: '1px solid var(--colorDanger)'
      },
      '.AddressElement': {
        border: 'none',
        boxShadow: 'none',
        backgroundColor: 'transparent',
      },
      '.TabSeparator': {
        display: 'none'
      },
      '.TabLabel': {
        display: 'none'
      },
      '.Tab--selected': {
        border: 'none',
        boxShadow: 'none'
      },
      '.Tab': {
        border: 'none',
        boxShadow: 'none'
      }
    }
  };
  
  const options = {
    clientSecret,
    appearance,
    loader: 'auto',
  };

  return (
    <div className={styles.wrapper}>
      {!clientSecret ? (
        <div className={styles.loading}>Loading payment details...</div>
      ) : (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}

// Actual form component
function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // No need to manually initialize Google Maps API - Stripe will handle this
  
  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/payment-completion`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Payment Information</h2>
        <p className={styles.sectionSubtitle}>Enter your payment details securely</p>
        <PaymentElement 
          id="payment-element" 
          options={{
            layout: {
              type: 'tabs',
            },
          }}
        />
      </div>
      
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Billing Information</h2>
        <p className={styles.sectionSubtitle}>Your billing address information</p>
        <AddressElement 
          options={{
            mode: 'billing',
            autocomplete: {
              mode: 'automatic',
              apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
            },
          }} 
        />
      </div>

      <button 
        disabled={isLoading || !stripe || !elements} 
        className={styles.payButton}
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </button>
      
      {message && <div className={styles.message}>{message}</div>}
    </form>
  );
}
