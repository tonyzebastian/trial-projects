'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import styles from './payment-completion.module.css';
import ThemeSwitch from '../components/ThemeSwitch';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function PaymentCompletion() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const clientSecret = searchParams.get('payment_intent_client_secret');
    
    if (!clientSecret) {
      setStatus('error');
      setMessage('No payment information found.');
      return;
    }

    stripePromise.then(async (stripe) => {
      if (stripe) {
        const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
        
        switch (paymentIntent.status) {
          case 'succeeded':
            setStatus('success');
            setMessage('Your payment was successful!');
            break;
          case 'processing':
            setStatus('processing');
            setMessage('Your payment is still processing.');
            break;
          case 'requires_payment_method':
            setStatus('error');
            setMessage('Your payment was not successful, please try again.');
            break;
          default:
            setStatus('error');
            setMessage('Something went wrong with your payment.');
            break;
        }
      }
    });
  }, [searchParams]);

  return (
    <div className={styles.container}>
      <ThemeSwitch />
      <div className={styles.card}>
          {status === 'success' && (
            <div className={styles.successIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
          )}
          
          {status === 'processing' && (
            <div className={styles.processingIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
          )}
          
          {status === 'error' && (
            <div className={styles.errorIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
          )}
          
          <h1 className={styles.title}>
            {status === 'success' ? 'Payment Successful' : 
             status === 'processing' ? 'Processing Payment' : 
             'Payment Failed'}
          </h1>
          
          <p className={styles.message}>{message}</p>
          
          <Link href="/" className={styles.button}>
            Return to Payment Page
          </Link>
      </div>
    </div>
  );
}
