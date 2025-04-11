import '@mantine/core/styles.css';

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from './App.tsx'
import Header from "./features/shell/Header.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
          <MantineProvider>
              <Header/>
              <App />
          </MantineProvider>
      </QueryClientProvider>
  </StrictMode>,
)
