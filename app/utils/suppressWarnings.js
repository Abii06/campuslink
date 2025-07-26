// Utility to suppress browser extension warnings
export const suppressBrowserExtensionWarnings = () => {
  if (typeof window !== 'undefined') {
    // Suppress specific console warnings related to browser extensions
    const originalWarn = console.warn;
    console.warn = (...args) => {
      const message = args.join(' ');
      
      // Filter out browser extension warnings
      if (
        message.includes('fdprocessedid') ||
        message.includes('Extra attributes from the server') ||
        message.includes('browser extension')
      ) {
        return; // Don't log these warnings
      }
      
      // Log all other warnings normally
      originalWarn.apply(console, args);
    };
  }
};

// Input props that help prevent hydration warnings
export const getInputProps = (baseProps) => ({
  ...baseProps,
  suppressHydrationWarning: true,
  autoComplete: baseProps.autoComplete || 'off',
});