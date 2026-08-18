import { menuData } from "./menuData";

export const RESTAURANT_CONFIG_KEY = "andiamo.restaurant-config";

export const defaultOffers = [
  { badge: "Best Seller", featured: true, title: "Zinger + Fries + Pepsi", desc: "1 Zinger sandwich + Fries 500g + Pepsi", oldPrice: "1,000,000 LBP", newPrice: "850,000 LBP", img: "/images/pexels-1600711.jpg" },
  { badge: "Combo", featured: false, title: "2 Fajita + Pepsi", desc: "2 Fajita sandwiches + 1 Pepsi", oldPrice: "900,000 LBP", newPrice: "780,000 LBP", img: "/images/pexels-1640777.jpg" },
  { badge: "Refresh", featured: false, title: "Chicken Sub + Diet 7Up", desc: "1 Chicken Sub + 1 Diet 7Up", oldPrice: "500,000 LBP", newPrice: "450,000 LBP", img: "/images/pexels-3219483.jpg" },
];

export const defaultRestaurantConfig = {
  contact: {
    phone: "+961 71 919 234",
    location: "برعشيت/حديقة الياسمين",
    hours: "Every day: 12pm - 2am",
  },
  menu: menuData,
  offers: defaultOffers,
};

export function getRestaurantConfig() {
  try {
    const savedConfig = window.localStorage.getItem(RESTAURANT_CONFIG_KEY);
    if (!savedConfig) return defaultRestaurantConfig;

    const parsedConfig = JSON.parse(savedConfig);
    return {
      contact: { ...defaultRestaurantConfig.contact, ...parsedConfig.contact },
      menu: { ...defaultRestaurantConfig.menu, ...parsedConfig.menu },
      offers: parsedConfig.offers || defaultRestaurantConfig.offers,
    };
  } catch {
    return defaultRestaurantConfig;
  }
}

export function saveRestaurantConfig(config) {
  window.localStorage.setItem(RESTAURANT_CONFIG_KEY, JSON.stringify(config));
}