"use client";

import { EthersProvider } from '../lib/EthersProvider';

export function Providers({ children }) {
  return <EthersProvider>{children}</EthersProvider>;
} 