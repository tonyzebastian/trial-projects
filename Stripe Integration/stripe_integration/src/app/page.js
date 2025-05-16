'use client';

import styles from "./page.module.css";
import ThemeSwitch from "./components/ThemeSwitch";
import CheckoutForm from "./components/CheckoutForm";

export default function Home() {
  return (
    <div className={styles.page}>
      <ThemeSwitch />
      <main className={styles.main}>
        <h1 className={styles.title}>Stripe Checkout Demo</h1>
        <p className={styles.description}>Test Stripe payment integration with customizable themes</p>
        <CheckoutForm />
      </main>
      <footer className={styles.footer}>
        <p>This is a demo for Stripe integration with custom theming</p>
      </footer>
    </div>
  );
}
