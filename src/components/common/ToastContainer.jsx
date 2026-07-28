import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearToast } from '../../redux/slices/uiSlice';
import toast, { Toaster } from 'react-hot-toast';

const ToastContainer = () => {
  const dispatch = useDispatch();
  const toastMessage = useSelector((state) => state.ui.toastMessage);

  useEffect(() => {
    if (toastMessage) {
      const { message, type } = toastMessage;
      if (type === 'success') {
        toast.success(message);
      } else if (type === 'error') {
        toast.error(message);
      } else {
        toast(message);
      }
      dispatch(clearToast());
    }
  }, [toastMessage, dispatch]);

  return (
    <Toaster 
      position="top-right" 
      toastOptions={{
        duration: 3500,
        style: {
          background: '#0f172a',
          color: '#fff',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '12px 18px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          fontSize: '14px',
          fontWeight: 500,
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
  );
};

export default ToastContainer;
