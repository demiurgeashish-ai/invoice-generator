const company = {
  name: import.meta.env.VITE_COMPANY_NAME || 'My Company',
  logoUrl: import.meta.env.VITE_COMPANY_LOGO_URL || '',
  primaryColor: import.meta.env.VITE_COMPANY_PRIMARY_COLOR || '#000000',
};

export default company;
