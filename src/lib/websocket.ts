export const validations = {
  // Required field
  required: (value: any, fieldName: string): string | null => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${fieldName} is required`;
    }
    return null;
  },

  // Email validation
  email: (value: string): string | null => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Invalid email address';
    return null;
  },

  // Phone validation
  phone: (value: string): string | null => {
    if (!value) return null;
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(value)) return 'Phone must be at least 10 digits';
    return null;
  },

  // Number validation
  number: (value: any, fieldName: string): string | null => {
    if (value === '' || value === null || value === undefined) return null;
    if (isNaN(Number(value))) return `${fieldName} must be a number`;
    return null;
  },

  // Positive number
  positiveNumber: (value: any, fieldName: string): string | null => {
    if (value === '' || value === null || value === undefined) return null;
    if (isNaN(Number(value)) || Number(value) < 0) {
      return `${fieldName} must be a positive number`;
    }
    return null;
  },

  // Minimum length
  minLength: (value: string, min: number, fieldName: string): string | null => {
    if (!value) return null;
    if (value.length < min) return `${fieldName} must be at least ${min} characters`;
    return null;
  },

  // Maximum length
  maxLength: (value: string, max: number, fieldName: string): string | null => {
    if (!value) return null;
    if (value.length > max) return `${fieldName} must be less than ${max} characters`;
    return null;
  },

  // Date validation
  date: (value: string, fieldName: string): string | null => {
    if (!value) return null;
    const date = new Date(value);
    if (isNaN(date.getTime())) return `${fieldName} is not a valid date`;
    return null;
  },

  // Future date
  futureDate: (value: string, fieldName: string): string | null => {
    if (!value) return null;
    const date = new Date(value);
    if (date <= new Date()) return `${fieldName} must be a future date`;
    return null;
  },

  // Validate all fields
  validateForm: (fields: { value: any; fieldName: string; rules: string[] }[]): string[] => {
    const errors: string[] = [];
    fields.forEach(field => {
      field.rules.forEach(rule => {
        if (rule === 'required') {
          const error = validations.required(field.value, field.fieldName);
          if (error) errors.push(error);
        }
        if (rule === 'email') {
          const error = validations.email(field.value);
          if (error) errors.push(error);
        }
        if (rule === 'phone') {
          const error = validations.phone(field.value);
          if (error) errors.push(error);
        }
        if (rule === 'number') {
          const error = validations.number(field.value, field.fieldName);
          if (error) errors.push(error);
        }
        if (rule === 'positive') {
          const error = validations.positiveNumber(field.value, field.fieldName);
          if (error) errors.push(error);
        }
      });
    });
    return errors;
  }
};