// src/config/routes.ts

export const ROUTES = {
  home: "/",
  services: "#services",
  pricing: "#pricing",
  about: "#about",
  faq: "#faq",
  gazette: "/gazette",
  gazetteArticle: (id: string) => `/gazette/${id}`,
  login: "/login",
  forgotPassword: "/forgot-password",
  verifyOtp: "/verify-otp",
  verifyEmail: "/verify-email",
  checkEmail: "/check-email",
  resetPassword: "/reset-password",
  dashboard: "/dashboard"
};

export const SOCIAL_LINKS = {
  twitter: "https://twitter.com",
  linkedin: "https://linkedin.com",
  github: "https://github.com/ALi-Maher-Mohamed/Legal-Mind-front"
};
