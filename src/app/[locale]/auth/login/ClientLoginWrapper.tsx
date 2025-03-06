"use client";

import { Suspense } from 'react';
import VerificationMessage from './VerificationMessage';

export default function ClientLoginWrapper() {
  return (
    <Suspense fallback={null}>
      <VerificationMessage />
    </Suspense>
  );
}
