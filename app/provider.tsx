'use client';
import store, { persistor } from '@/store/store';
// import store, { persistor } from '@/lib/store';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ModalProvider } from '../context/modal.context';
// import { WebSocketProvider } from "./components/Socket/webSocketContext";
// import type {} from '@mui/x-date-pickers/themeAugmentation';
// import { WebSocketProvider } from '@/@core/hooks/WebSocketProvider';
// import SessionApprovalDialog from '@/components/dialog/SessionApprovalDialog';
// import type {} from "@mui/x-date-pickers-pro/themeAugmentation";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {/* <SessionProvider> */}
      <PersistGate loading={null} persistor={persistor}>
        {/* <WebSocketProvider>
          <SessionApprovalDialog /> */}
        {/* <ThemeProvider theme={outerTheme}>{children}</ThemeProvider> */}
        <ModalProvider>
          {children}
        </ModalProvider>
        {/* </WebSocketProvider> */}
      </PersistGate>
      {/* // </SessionProvider> */}
    </Provider >
  );
}
