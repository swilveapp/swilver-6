// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  // Nigerian phone number format
  const phoneRegex = /^(\+?234|0)[789][01]\d{8}$/;
  return phoneRegex.test(phone);
};

export const sanitizePhone = (phone: string): string => {
  // Remove any non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Convert to Nigerian format if needed
  if (digits.startsWith('0')) {
    return '234' + digits.substring(1);
  } else if (digits.startsWith('234')) {
    return digits;
  }
  
  return '234' + digits;
};

export const validateWithdrawalAmount = (amount: number): boolean => {
  return typeof amount === 'number' && 
         amount > 0 && 
         amount <= 1000000 && // Maximum withdrawal limit
         Number.isFinite(amount) &&
         Math.floor(amount) === amount; // Must be whole number
};