import { menuData } from "./menuData";

export const RESTAURANT_CONFIG_KEY = "andiamo.restaurant-config";

export const defaultRestaurantConfig = {
  contact: {
    phone: "+961 71 919 234",
    location: "برعشيت/حديقة الياسمين",
    hours: "Every day: 12pm - 2am",
  },
  menu: menuData,
};

export function getRestaurantConfig() {
  try {
    const savedConfig = window.localStorage.getItem(RESTAURANT_CONFIG_KEY);
    if (!savedConfig) return defaultRestaurantConfig;

    const parsedConfig = JSON.parse(savedConfig);
    return {
      contact: { ...defaultRestaurantConfig.contact, ...parsedConfig.contact },
      menu: { ...defaultRestaurantConfig.menu, ...parsedConfig.menu },
    };
  } catch {
    return defaultRestaurantConfig;
  }
}

export function saveRestaurantConfig(config) {
  window.localStorage.setItem(RESTAURANT_CONFIG_KEY, JSON.stringify(config));
}