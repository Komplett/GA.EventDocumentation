/**
 * API configuration constants
 * These values are loaded from environment variables for security
 */
export const API_URL = import.meta.env.VITE_API_URL || "https://func-komplett-ga-eventdocumentation.azurewebsites.net/api/";
export const API_TOKEN = import.meta.env.VITE_API_TOKEN || "";