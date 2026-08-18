import { menuData } from "./menuData";

export const defaultOffers = [
  {
    "badge": "Best Seller",
    "featured": true,
    "title": "Zinger + Fries + Pepsi",
    "desc": "1 Zinger sandwich + Fries 500g + Pepsi",
    "oldPrice": "1,000,000 LBP",
    "newPrice": "830,000 LBP",
    "img": "/images/pexels-1600711.jpg"
  },
  {
    "badge": "Combo",
    "featured": false,
    "title": "2 Fajita + Pepsi",
    "desc": "2 Fajita sandwiches + 1 Pepsi",
    "oldPrice": "900,000 LBP",
    "newPrice": "780,000 LBP",
    "img": "/images/pexels-1640777.jpg"
  },
  {
    "badge": "Refresh",
    "featured": false,
    "title": "Chicken Sub + Diet 7Up",
    "desc": "1 Chicken Sub + 1 Diet 7Up",
    "oldPrice": "500,000 LBP",
    "newPrice": "450,000 LBP",
    "img": "/images/pexels-3219483.jpg"
  }
];

export const defaultRestaurantConfig = {
  contact: {
  "phone": "+961 71 919 234",
  "location": "برعشيت/حديقة الياسمين",
  "hours": "Every day: 12pm - 2am"
},
  menu: {
  "burgers": [
    {
      "name": "Andiamo's Burger",
      "desc": "Our signature double patty with special house sauce & all the trimmings",
      "img": "/images/pexels-4628466.jpg",
      "price": "660,000 LBP"
    },
    {
      "name": "Lebanese Burger",
      "desc": "Juicy beef patty with Lebanese-style spices & fresh toppings",
      "price": "400,000 LBP",
      "img": "/images/pexels-5374420.jpg"
    },
    {
      "name": "American Burger",
      "desc": "Classic all-American beef patty with cheddar, pickles & mustard",
      "price": "400,000 LBP",
      "img": "/images/pexels-36691286.jpg"
    },
    {
      "name": "Mushroom Burger",
      "desc": "Beef patty topped with sautéed mushrooms & Swiss cheese",
      "price": "550,000 LBP",
      "img": "/images/bing-mushroom-burger.jpg"
    },
    {
      "name": "Mozzarella Burger",
      "desc": "Double smash patty smothered in melted mozzarella",
      "price": "600,000 LBP",
      "img": "/images/pexels-34407507.jpg"
    },
    {
      "name": "Grilled Chicken Burger",
      "desc": "Tender grilled chicken breast with fresh toppings in a brioche bun",
      "price": "500,000 LBP",
      "img": "/images/pexels-17300434.jpg"
    }
  ],
  "sandwiches": [
    {
      "name": "Fajita",
      "desc": "Grilled chicken strips with peppers, onions & house sauce in a wrap",
      "price": "400,000 LBP",
      "img": "/images/fajita%20photo.webp"
    },
    {
      "name": "Chicken Sub",
      "desc": "Crispy chicken fillet with fresh toppings in a soft sub roll",
      "price": "400,000 LBP",
      "img": "/images/bing-chicken-sub.jpg"
    },
    {
      "name": "Francisco",
      "desc": "Chicken with a tangy Francisco-style sauce & mixed fillings",
      "price": "400,000 LBP",
      "img": "/images/bing-francisco.jpg"
    },
    {
      "name": "Mexican",
      "desc": "Spiced chicken with jalapeños, salsa & sour cream",
      "price": "400,000 LBP",
      "img": "/images/mexican%20sandwish.webp"
    },
    {
      "name": "Chicken Alfredo",
      "desc": "Tender chicken in a rich creamy Alfredo sauce",
      "price": "450,000 LBP",
      "img": "/images/chicken%20alfredu%20photo.webp"
    },
    {
      "name": "Crispy",
      "desc": "Golden crispy chicken fillet with fresh lettuce & mayo",
      "price": "400,000 LBP",
      "img": "/images/bing-crispy-sandwich.jpg"
    },
    {
      "name": "Chicken BBQ",
      "desc": "Grilled chicken with smoky BBQ sauce & crispy onions",
      "price": "400,000 LBP",
      "img": "/images/pexels-29306505.jpg"
    },
    {
      "name": "Chicken Spicy",
      "desc": "Fiery spiced chicken fillet with jalapeños & spicy mayo",
      "price": "400,000 LBP",
      "img": "/images/spicy%20chicken.webp"
    },
    {
      "name": "Zinger",
      "desc": "Extra-hot crispy chicken fillet with signature zinger sauce",
      "price": "500,000 LBP",
      "img": "/images/bing-zinger.jpg"
    },
    {
      "name": "Zinger Mozzarella",
      "desc": "Spicy crispy chicken topped with melted mozzarella",
      "price": "600,000 LBP",
      "img": "/images/bing-zinger-mozz.jpg"
    },
    {
      "name": "Twister",
      "desc": "Soft tortilla wrap with crispy chicken, lettuce & ranch",
      "price": "500,000 LBP",
      "img": "/images/bing-twister.jpg"
    },
    {
      "name": "Chicken Pesto",
      "desc": "Grilled chicken with house-made basil pesto & fresh greens",
      "price": "500,000 LBP",
      "img": "/images/chicken%20pesto.webp"
    }
  ],
  "pizza": [
    {
      "name": "Pepperoni Lover's",
      "desc": "Loaded with generous layers of classic pepperoni",
      "sizes": {
        "M": "800,000 LBP",
        "L": "1,000,000 LBP"
      },
      "img": "/images/pepperoni-pizza.jpg"
    },
    {
      "name": "Sujuk",
      "desc": "Spiced sujuk sausage on a rich tomato base",
      "sizes": {
        "M": "800,000 LBP",
        "L": "1,000,000 LBP"
      },
      "img": "/images/bing-sujuk.jpg"
    },
    {
      "name": "Trex-Mix",
      "desc": "Mixed meat feast — beef, chicken & sujuk",
      "sizes": {
        "M": "1,000,000 LBP",
        "L": "1,200,000 LBP"
      },
      "img": "/images/pexels-6068718.jpg"
    },
    {
      "name": "Vegetarian",
      "desc": "Garden-fresh vegetables on a classic tomato base",
      "sizes": {
        "M": "800,000 LBP",
        "L": "1,000,000 LBP"
      },
      "img": "/images/bing-veg-pizza.jpg"
    },
    {
      "name": "Chicken BBQ",
      "desc": "Grilled chicken strips with smoky BBQ sauce & onions",
      "sizes": {
        "M": "900,000 LBP",
        "L": "1,100,000 LBP"
      },
      "img": "/images/bing-chicken-bbq-pizza.jpg"
    },
    {
      "name": "Margarita",
      "desc": "Classic tomato sauce with fresh mozzarella & basil",
      "sizes": {
        "M": "700,000 LBP",
        "L": "900,000 LBP"
      },
      "img": "/images/bing-margarita.jpg"
    },
    {
      "name": "4 Cheeses",
      "desc": "Four-cheese blend — mozzarella, cheddar, parmesan & blue cheese",
      "sizes": {
        "M": "900,000 LBP",
        "L": "1,100,000 LBP"
      },
      "img": "/images/4-cheese.jpg"
    },
    {
      "name": "Pesto Rocca",
      "desc": "Basil pesto base topped with rocket & shaved parmesan",
      "sizes": {
        "M": "800,000 LBP",
        "L": "1,000,000 LBP"
      },
      "img": "/images/bing-pesto-rocca.jpg"
    },
    {
      "name": "Chicken Pesto",
      "desc": "Grilled chicken with house-made basil pesto",
      "sizes": {
        "M": "800,000 LBP",
        "L": "1,000,000 LBP"
      },
      "img": "/images/chicken-pesto-pizza.webp"
    },
    {
      "name": "Truffle Mushrooms",
      "desc": "Truffle oil, mixed mushrooms & shaved parmesan",
      "sizes": {
        "M": "1,000,000 LBP",
        "L": "1,400,000 LBP"
      },
      "img": "/images/bing-truffle-mushrooms.jpg"
    },
    {
      "name": "Creamy Alfredo Chicken",
      "desc": "Creamy Alfredo sauce with tender grilled chicken",
      "sizes": {
        "M": "1,000,000 LBP",
        "L": "1,300,000 LBP"
      },
      "img": "/images/bing-alfredo-chicken.jpg"
    },
    {
      "name": "Shrimp Pizza",
      "desc": "Juicy shrimps on a creamy garlic & mozzarella base",
      "sizes": {
        "M": "1,000,000 LBP",
        "L": "1,300,000 LBP"
      },
      "img": "/images/bing-shrimp-pizza.jpg"
    }
  ],
  "mashiweh": [
    {
      "name": "Sandwich La7meh Meshwi",
      "desc": "Grilled beef strips in soft bread with garlic sauce & pickles",
      "price": "350,000 LBP",
      "img": "/images/pexels-37417607.jpg"
    },
    {
      "name": "Sandwich Kafta",
      "desc": "Spiced ground beef kafta in bread with fresh toppings",
      "price": "350,000 LBP",
      "img": "/images/pexels-6089834.jpg"
    },
    {
      "name": "Sandwich Tawook",
      "desc": "Marinated grilled chicken tawook with garlic sauce",
      "price": "350,000 LBP",
      "img": "/images/pexels-37417601.jpg"
    },
    {
      "name": "Grilled Chicken Wings (12 pcs)",
      "desc": "12 smoky grilled chicken wings — served with fries or rice & salad",
      "price": "800,000 LBP",
      "img": "/images/pexels-38366577.jpg"
    },
    {
      "name": "Grilled Chicken Breasts (2 pcs)",
      "desc": "2 juicy grilled chicken breasts — served with fries or rice & salad",
      "price": "900,000 LBP",
      "img": "/images/pexels-36548085.jpg"
    },
    {
      "name": "Nos Faroj (Half Chicken)",
      "desc": "Half a marinated grilled chicken — served with fries or rice & salad",
      "price": "700,000 LBP",
      "img": "/images/bing-grilled-chicken.jpg"
    },
    {
      "name": "Farooj (Whole Chicken)",
      "desc": "A whole marinated grilled chicken — served with fries or rice & salad",
      "price": "1,400,000 LBP",
      "img": "/images/bing-grilled-chicken.jpg"
    },
    {
      "name": "Hummus",
      "desc": "Freshly prepared creamy hummus",
      "price": "400,000 LBP",
      "img": "/images/pexels-1618898.jpg"
    }
  ],
  "crispy": [
    {
      "name": "Crispy (3 pcs)",
      "desc": "3 pieces of golden crispy fried chicken",
      "price": "500,000 LBP",
      "img": "/images/bing-krispy.jpg"
    },
    {
      "name": "Crispy (5 pcs)",
      "desc": "5 pieces of golden crispy fried chicken",
      "price": "800,000 LBP",
      "img": "/images/bing-krispy.jpg"
    },
    {
      "name": "Crispy (8 pcs)",
      "desc": "8 pieces of golden crispy fried chicken",
      "price": "1,000,000 LBP",
      "img": "/images/bing-krispy.jpg"
    },
    {
      "name": "Crispy (20 pcs)",
      "desc": "20 pieces of golden crispy fried chicken — great for sharing",
      "price": "3,000,000 LBP",
      "img": "/images/bing-krispy.jpg"
    },
    {
      "name": "Wings (6 pcs)",
      "desc": "6 crispy fried chicken wings",
      "price": "450,000 LBP",
      "img": "/images/bing-wings.jpg"
    },
    {
      "name": "Wings (12 pcs)",
      "desc": "12 crispy fried chicken wings",
      "price": "800,000 LBP",
      "img": "/images/bing-wings.jpg"
    },
    {
      "name": "Wings (24 pcs)",
      "desc": "24 crispy fried chicken wings — perfect for a crowd",
      "price": "1,400,000 LBP",
      "img": "/images/bing-wings.jpg"
    },
    {
      "name": "Shrimps (10 pcs)",
      "desc": "10 juicy shrimps served with fries & sauce",
      "price": "900,000 LBP",
      "img": "/images/bing-shrimps.jpg"
    },
    {
      "name": "Shrimps (20 pcs)",
      "desc": "20 juicy shrimps served with fries & sauce",
      "price": "1,600,000 LBP",
      "img": "/images/bing-shrimps.jpg"
    },
    {
      "name": "Shrimps (30 pcs)",
      "desc": "30 juicy shrimps served with fries & sauce",
      "price": "2,300,000 LBP",
      "img": "/images/bing-shrimps.jpg"
    },
    {
      "name": "Shrimps (50 pcs)",
      "desc": "50 juicy shrimps served with fries & sauce",
      "price": "3,500,000 LBP",
      "img": "/images/bing-shrimps.jpg"
    }
  ],
  "sides": [
    {
      "name": "Fries 500g",
      "desc": "Golden crispy fries (500g)",
      "price": "400,000 LBP",
      "img": "/images/bing-fries.jpg"
    },
    {
      "name": "Wedges 500g",
      "desc": "Chunky seasoned potato wedges (500g)",
      "price": "400,000 LBP",
      "img": "data:image/webp;base64,UklGRh4nAABXRUJQVlA4IBInAADweACdASqVAOAAPoUykUglIyGhOP0OKKAQiWwAw6NQyA/S/lz7HfHvYZ7o+/bunw/jwe1d8H/req39R+wPz8P7t6Hf3K9bT00f6D1Ff9l6fHq770F/crXB30/rPA3yifP/4P0PMQ9on3Tzp/1PfD8xNQj3H54EBdxN4J88qZxkBeXX/k8LX8r/3fYD8of/f8e/7b6h3lz///3PfvP///dE/cF42/8dht0SOEg1Bp2NUAxASV2f3DekPJcRXF2Uq9AYQTlCIR7YIr4J0msSV1W+SgDWBDxUQxU62bPh7Q01KM6QobO0fynzzyQDQfixS5Kfe+aydqnyc05k4WZiGIKLVnmf9LCKwuLfx1UZVPXzu44TWNDNA323ZrO5sRD7CJH55rqnjQWRugcB46jMZLcWtPdbUlKUuqjrUDbeD+eWofjIRV9HCtrxf8dGCsLDvhrC7Z9yFlb73WcDML7ck2l5ojLFoCOBVj2fLQXG0n1c5zIJTJQ2V6cNqWB6CXoDuoiz65v1WnU+7wPYTehMyWaTmF+CoWBYPPxV4A+Q3jly6IGRLvnpLXgLXuU7gexDrRLC//dzmjOfowQO3Qp7p+kDZ4BcpykjAE0YY8KtxrkdchYpkj8yX6Q/INDk20U6ds+G48yCCYet92aaPu/KwqAGXvbYI4Vh7FiVaSS1icUkK2EZeuSNS8JEDlrqx2OCSuhnpznfclBZYAer4pakdXySTT3U2Vqt2+120h96Qu48jgphMv77RzWLrL1HjLnTXqGvqKaKbb7uAK0AjNENEFl+qTPsfLvvdtJiScm9e0bMz9ND4+Qtwd3snbXLqz/rWLxh+2xoxADvtj5NGwXvCpw7+ePtg+SZeaZellVa19ddGbBLWYvxd5MOvJz8TvaXbeMu4ggxqEaJ7uNpbglODcdYlonOappiq99Tyk8nnuDbYeGmFT1bZJPygr3bOTWn+huzCTT3/iyXvFPxXTIr/65e2ECpuGM1P7VdQuOLXehFUQAqaJowWrj1/dyE6J78le+gYIdsXPXkyglYCXLqORi/Pwr+0w6kU0E/WhYBcXPes5Z0XDxYg/qydU5/t9qd7a2EuARJY7umUo3Q7d4o9RGs1kwyiysec7cttsSgp52m2C6PstflgjZA5NlI6hwAb5V6bHgM98y5+uqRnleTsNktt0Cy1Eo09yMA3yIJKhYBfQaGhmk57FfJd5lUcjtQ9Om4BBX9tqhOtFtKvp0Nu0yO7SOuQ+hvVxvH/UQeQyjJQZ99eHE0smaAKyFh4CYqUh6dY7PERjGi/cUsKwvL7E9AAP7+gcewkywFx4MF9WcGTaUU4uGdIKsT9CrSzKQDAFipqyWmREfb96KSgqv0+wuQxH3QW9JYDUQYKtd2SBzFTCd22SX6f8feVrnPJBsgD+73eFJQqHuBpJU3CFblJ4rJui4IvwKZLLahh5eALtzQ+i0/Nu4VuCFQu/qBl1ISnyMtTG3wEsGwkrLVBP8g3wwks4k3xzsyaW8SpQKmhm3kuo1mz7TOOjIZahFVcyQ9nGSXpTcT2vTPT7QuQeCYqY1Vf5NCwYMGf5V1hGB+frDNkTzMU9ITJeN3IrjQIgm1pc5WcuZhBt/KWpPvZi+cwny3ZFgVX2NL4e4aN8epRZMYc5PVNOe3rsGX6ET9CgbzGMGhgR9CtGmGV9sTqTwbMCnafnJ9/qOOIwy5L504Jql9uCCsJ3zQriCG3h/r1dsgPKoDcepEeKq7u2MfnRHITpqN6JeVZUziXNUciz8rmrLqgwr2nzBZ5oXg6eklx3zAkEGOkbBsICDzFPlm/0JWWAdr21QH5reklJrL8NxfivrBmqz0WJ6vrG7Gk4ksfrndJJ9zHwICnRVU4vyY7oaB+lclgLytHhSFBWwp0X9yotFgGwTRlwoegjG4ccjAmPvEIxNc3o4fbiLj/RHSf3TNZmYeYdjkVrMHVcDVuWFMO15LuG7d9NeR9eiqKgXC69dorKMjHgGfhWA4AvAAM0KHXgEoWQ+XmyFpeO8YbvLca2Pxs+qUMcfRgIqghHXiwUVZdOHQA2qRXfLmugODJtv6ceoP2fC54Hda/cDOeHv5APpGEi281w7XwPsWR1HKg3PVUzNEtZfDH0QZYi7wciLqcmisrlXsDS+b42W+lfHZOp/0lKAa8bh2reKbl6w0RXl5lpwDVA3x2YB4zyGzUOvp5U242pDGkNxOYyBr1dZr/je5ZobUSipIDQ3kYh242oLdXvB5sv89GVeEwFKXQir/B1b+YTPbD0FClQDyMOGmBr26TT6kxh4yhe5ipyq1+4B3YKi8bOMLBFT+D2GCy+gIX6eneNd1Qhobpmx7bDjxdZ5sFdtYS1oEG8aokvYrw07HKP+U6KrRSY+fDIqrFeXOOd5bsKWUQ2oaF0suzmjakjMoHo8zHhvwLyqqt/qqCRo+PJ5r1Yhyqn/KzmuFaKsfdv8uoxmuEadP6FCoZ7iU1q+jnebUkL3mBiRnbcU+Js+7/+GT84GfEZoCnGsh66KEf+Ejurmw6crEObOSRp4Cwgn75M/n+4Za4M+l5dzhgUK4FyrEjaXF2/R8lsIIXl6Lh5j/UGOlt3mPI6VuXCfLfCCrYU+AFZmgAzRHDIk8c2DHUzh2MJogo3Uc4QDDAmceuAmIVAGvKo93QARB+QrH7XNKbw5ry3logE+F2bum9qEElPWDp6znHVjRi607Z4fLMUD8g+dimA6dzEN99Kmqz6uiWI08q3O9l8oU54+aV9ONPIHmH9t1vhpeJAc6JtvH6PFpAW8MauP2+XXpWVQGfWS/5VAeXq6IevT6Sgoyu+iV1kMg2KMGAN07VaENKbA1kOYYqdDtHIPLXwUYKDJNZoj4yRwbt37HEtuLiMIq9N1v7bP4EX899/MCh0a9Nd1R/rKRXleeKvv0mv4nR5uGGZGsebHJjTeK7n307wwICTR8s8ytEHVozprLDxdNigD3UlLRV6qR1TUHOxED2cPKfrRXE+1ms6AB1MK9AKafh2ZmlFcp796f0GB8bSzuPv71AIF/4Oq8rczGTa385W0QasHHCxU/L6IdsEq81BA3JIH8kbpDVpbU8ErVgEOmRhL+bnbcELHVWXTnEaLZ5mfm7K0/GGINikDvt7hFCeCpNdmgfPeLdOuGEJbidEahbSRoXeZbsHM0OcOm5epKB04JdTEbjhowenkvpkxsED3nfUQpw/UmxYlEqHbqESdthLR7z/5Q8kjK6XKvrYkHfSrDsUDb/cDUGpqOiyU7PSX58EBFFeZQQVsUjsMPRvG51Ru+qgc4zzRX9FF4Tb4xTjzb2ijCUn7oLxM3Db1BpjYbyo7APL/5Ns8k8JfaatzxN7AuoWayI+dAiL6KNZCXxrPbeqEB/K4kF3B2xzGB5T97ciNEgBR8G4n1FFG5GqBJYKxJqezowlKXuZXDaKNeNCnVQ6u23cQaB9VDRV1dyZ3asE2e1a6NnwIUUbCKHGlPOLY7e/PhvXhxuQ1I7DXSn8rf02POCzBVr6b2knRWMoNic+rOcYQazBWqm3UkQ4Um4gl3FFoKBeTEtyAdQRkCXcONSH8RfIqAggCeVxi5nJhyxY8JCzVtlPaUtHMkgoPiSru0/WNUks5aalk3Z4rV+nr86biUD9rriDIfu8CFtOPO2g3Bxet1ITzUZd8FszXKTwOZ5oe87n4QXuEdegHmcmFYHwoAt9qvBxcfa1mijoUQuotGu+fhKox1/K3FE25FUkLF4fIup5FUNIa/mrYKkOjy7v3FAyFFocpbu2eB9pSLOUgK+k+4CiJ9mN+GaYnqRX8KdOlyhPfAQ5imK/SYd7zNL8Q7OlD3uJTPBpJoLVECMx2Xhw2rEHUotLvr4hf/UIXs6meRavXZM3XvC9WQeeTyBHAXhZPK31ZzyJK065yf3xkyqDnuMxbeVJ7lC0d0pbWURPV62QguWLZI0bfUNJFylr4xJi7cH5MZp47zv38O4B2DwBljpPBPPtuHgDQIA5iRWEnxvPSdZP8TwiYB32SgIuQ8jJkuh7uEBgisuPEHcKdOjNpn3yxrdm4ZIop4uEIzf3MvvN9gsNN4dW/3Yb3QxXsWlG2xKphSQOgWDr4qw4O5+mBpuOQ7bCH9VAnHm0K4WYXdW4ofaWI33b6A5iHUdXf5sH9ssQHolT5Du8qGcwuEdqHGQZ/yGRj9BpEvD8gyCGoTfbysbnd7M1Nxsg7tMNqIkjSgAfuZB44Cp+1DeOsHHpnxKdkTCiHisYZqQZufYFKt2lWeX/kXF9F/EuA1w3EdArjNQ6Kxbx77m7wwhB91mFwGb37RRQq3oSGJ9kndwUm3Imw6CuPt0Fl7vGEMYZsFYxpKKpZ0pDY990BXULv+TcfU6uveQ6doPbGNefsW4tUzF0L6fYWcM9Wb1paut+n3+H9sDN9spbbCDEOZOT8h8HFL2NDa5yKJprGoR7VwI/N/mRdUykYCJtz9vdIw7Mh9kT+5wdyBS5Q0NipxRPCcwJorJrJaNpoM+G922sg8lSQVO075/8AsFMwNSGJqU0LeIcsSMlgDO7adpCh6dKEo+Nj1kpRg4bf/12hK287ewC9SxlI2kN2C/M2ZLwc017suifX0SelFCuqQaKewgCkK1E90TEbktCx7JLBAyLYEDW/7Qiao8o83DdJ9DdEo30n/KymCIwx8TocIqLgzCU6hZNihKHRgkh0SqHhz3Brw97KP5VlJcdVq8vt5VejFDKIyF++jb+dSUBXdfZuT34Y8P/Lz+TePdAvUs3mFgponl9FvoFcwiPh2FiDED+BW81rQajTZjF+en3jUPMI30Lb3QbuxzPon5Z41sHod8V8w3dlgQmPEYTsXS2wLQQe7rkU8SIUIZWZdtGrhQDsDFducf/+OXlVwLZGcERI4Er8iEmXp0nsNpB3m3UPKxzfearKLfQnExcWYt3z1t9vQp5V4mvbSSBskc5MY11SQ/bjQKZ6cJ+fgODuYpGdXcGLefQugUXsfFfRDVRnRpXJFvz2aaNm3IsLjYxsr8tcV+SwiZSfLu+zmEIOj2euANk3nx2IG024FBeeNa62SXVZxtF/E5bKM7/accSWDdVQWxcWoJpCZZy6V/UEWcXteI/Wnm0CPIkRYwuInh1GBcPyg1jWA4Z/ZA/6EPrln+eqG5OTIE6zd46khDnVGL+wM2DyB0NxSOZNw/h3EfwGyJ9ZMdRDjr/mlV8RIh/oHQJfNLGddRUqAxP0jtJUIre+4Yn2g9HibK7N/6EPhxiXQSCaMVT1MU1c96fOZTRz39kYKdXatosV9HwzbEK86OPllbcKGE2Ght+ASBSfNIMWGDrlGpItw3Eej27vGHMeMdehunLcxhRjy0I0C16eTNK9lb6RvpFodHEP0lUhKu7fCdW6IKi4iiX1XKLBfDzpxgi4r7sSeJjkNovXHtfVqwxXwHd8d5qvNZqY5IQ8YleWO8LrRv41OtgOZLepOHx0j8xcyj4K2CizYWIz2cG9BMCmvoi5aG78j86zTn3B9XAKXaJWnwKmDn3AzAbmp11Wmi7RQwZ9cxOGX/Cud61ID4bWn5aIUT+mbt2uPmXj1pD22S1FafpPRXyMUPCMBfbENSfaikP3q6Zvsb7vdSJdvSWnXw+fHBk2gi20zshWAf6bAvRKuPI8rMYsRgMz6GRYfmqakzCXvxc1pifgvZfleBmvl/QPUa2aWneNx1vO3n3b0RqZyP+rYV/H7IuLK0lYV8kBnZEt5HWJnnf0IJjuSNhXiYp9Ee0GAR5eDiO2kPsWQs3xRjjgVKkRZvXVbbKi4WN/YlEU3OMGV+gaFDnWJZdTrqbxiVauznZa5AkJIuSGDkeK/w6CpgM25f0NwQTkQcXsWkqRdXYm8iOwh8rKKDMCyRRosoq8JlqNlQuEIJm+55ijmcJ2ig3maul1iE/RAPYWDNCllu5avwcOqOy7JrMQh7uKHcYhjHn2UoN8G4jeGKtResnKa/LN4o91cXiOm7t1pU1CkNbYLXvHNdkLB2k+rvU3cFMDV2Z7DDq8iHkr3NQkA8IdMKKcJwSJupVo916wLg6fT7KtxWfcfxf8G4vQJaxiOuTre6UQgfocH2ZORfHAm4nwHjuGJQkZz8a6kJ7+am1swOt362kyFl5QLIptHL9R3pyh+pE9r7gPthY0JGqNuGWnKIRcOSRspR33EO8wJJbCsvYpq1kMtMW/lP/LVFlTL6VsAUmFe0FeR1ITlgpuGQyskv99f6+P+i7wo6RPGaMDG2r10ScZW9qJ94j7K+UNq0CYdMhfw29h0jCrmJ7NsF7cKqSOrqd6+AwkqztSEg7ExEyBPutMhiT0kJUZk+J9DvUL5lov2HGxO+fbhFA3xT3qLIIq3nF/zTGkfWtKzXHdR35zMmIO7VE08GOg8pEtyItmxzpiodYOgJwQEKgCZ/x68ENCqiOZtCQEcZR/lePY4+g7dC6lQdEu9+6XxeTjumKvdBnoWMKCt9pgmtVmo4HdcoVoFVlogDEh9tSa4Yu8BLllWNfgdHCC4EYOCzUOTHbyDw4qrS9WBphYuuiEIcoPmG3nBd5+/BWK69n8xtqJOhYzmjI/tTcyms5n4mGnHxL0I6pvEvF9vCRuV8UWcsgdbpmURyeYWstPkpSj5drQfSb3KfXo/eJcrXZ4c0Jw3J843wRTz3YVDkypfUqJJ3fYkaqQDbrUPQEsOE5Yo1opFEKOFbmVFWHkzRqzzpglGHJdNts3ajDRTSgnO3/85zEETov5v+z2/WvgxwPOfdArXYJoO30PhsWQ4yAlGk/UrzytvBzf09djmpsPq5HVcPDoakP6WFNbYiH2rD2To2uBWYmCyOE3tcT74Jq8w7NpR7Kajcde3fZG3XGFdqC1we/2mpj3hkXTlWn/K+xlB1pm25AjKtIpv0R5jwQm1kjkRG2YWllLEOYORh3d/pp5GJJqJj9wOI8qTrv49162ZABQe6PonuMEPNZJXh+FbkSdWPiCf0FgtSyA3mgUDVpxTBQUaaocP8E1hf89G2FCSxQtnEpmKd5zkj69JnPSpRZLtDRBo4nMn0bhNeHpShyb5Bn5nz9v2WuadrGlJBZxU9U1jrgATtFbOFZVOj6IXGAX+SbB3tjhYs0ROd9/uENFhyzp70+l2ZTzU254q0juq5e8MUQHYfCAB0X3BE1jmZAzj0nRqs0cDcndpK5rXFuMIr190Ez0H++rsPli7ghkOuQbPrrGhyhcLvSO6DhgkwhiMDKJZuPoXiJ9l+gWxtpnWW0M/rwS56c2uWOLDlC45lXFDQJ5n2pmalqlFImPjI+eLo8PLUyY7jJ2419Z6GgzKonuvERwHXKYy1+6MapMi2ZhzyMdcoikLB8ZZtWiJhGMNJmQIshP9hPk7m2fVlPbkpQ1VHRPt8JYbySO7mz+ZxZhqLrYnvC7iXT5zCf8kPpeeeqiLhBHat7GNaehTAk6z5XiJ0YDhPqpx1QbQKZO75AQJVUn4IDC9Ix+oRLLjCIYwWAR2khAW/tl6jUBFviTavVFQykWSEx9rMaY9dnKjDNVLEZlSIX83PZFy5GQasp59IVOxrbF0xbJXrfGKRu54mzpN3ZEah3KG2jUEYDFGdEssRKfTNapM4bz9B8tp/Pbf9OU+ypZPcJ+2NLCdUQ+Eu866jR9zzpw8WnlPYhzJ7DMgHFKv7wnWnaAV3+5q1AdspGwfI/yBpRY+KQ8l3p+jMzvmFa5dO7snQnl6QMQTCtqZfcfxQrIbxcQ5jJ/GSvsfg0ItzjU+9dR10pd/u6Cmx2NwEcUTQ5ofhPeOq3a04dej7ASVM4JaGvRiWGvQk6i9HXr7tFpV9/ckHipq1Md2JixfhsEVqviqhOgnFhCw1aZHdYZmeyvPDbpxs/fBFcTiknvf/rNDsgTReIKspZSQ1mLU5MAQHMMlB4oIjpZJ+AEoDRUs7nVh3bOL1wZM7vOFRB8fMfG8S1ctLI/Zbz2/ViGUXfF+/SwlQP4rcUjCVHn+wLo1bLGP3HMYNsbJ4V4jnDK1gzyegXWXGC4BtaohfsZRw3s/S4L2BfUPujfaGgohJSyYlHP+UXxmjD+mBFJNCHS+Le6klCfP0CuWX+pCvT+pER9dSSAjiKaKzkYdnFXEwOTabwpSNK66dnu2qs0BSoq7L1sOR+OGJekHkSeQiVRybhwcuN2zBLgIrJExa6+YOm+Zv2yMGNtl5IgHOBYrHfVg4bR+6Y+z2ef3kKu5PTmomsp11192eKak0V5vXV2zwNYIpXEJrSZMq3CIGLy4wRoYsHWaPWceTIdqe+SoXmHB8Ouo3xqgkP+McV2CT+Y9XRKM5/loT1p4ZCb5IbdaoD81HHkOJq64hQeDD45vf/ckcgD5vbyg8hdd0IByU5t9HF0+dicIcjFFbQ5MXuID0GjnYJxPr08AnIoCgEtwjl1eupRs5uPtb5E96s6UqKQieOq76B7l+iQMxW47DkLfyJFsD/dHP8u5SGjqT2ZPCuFntGSe7RAZQgQMdsHqRtm0Oz/R7obkjS+dgffP9Anf53ns5+qHyewKmMXdd+hvL4WKeZo+jifg0bTt4oVnBMUa35Wl7rLFpmb1DMuaiAkyYvRQMg87qoXWS5NlUl2WsUPYhgT5Wu5fsHLBsAwC/0w9b6Qw4Z7C8GrIfREIVvYRg/q9uapVBTVIRNd/1Nd8JNUH2ETVtJQbzQVx5rvSVXmDCHw20qb0ESn7PVQ+VV6ygjz/plccMxEFP1729HeVa2DLec6Y3bbv19e2dQrTsfQ62jOzNoN4ITcnVuPd2aFZqiJ2NUyk6eGLTDW4mvWSsZ2M+kEOiaZDqvXJp2UAPm35KqgbmbFZgrCeqK8AAkO9rAYgsz4AIP+Zn8DpQ6MwrXba+MPQj3q2V4RnUqcDZRAbnlKQfAZbvu9NcEWQ07+WKxjUCQs8k0W4DVI7YjhoBSBCIS/qGXROhtcjvyyOCRc/ESy0u//22/34hXoAoeLM6PkCKORqNv+/tBWHyDcjLDnE6RK6/X/Ib5sNIyU8HuI3MC3C73dOkdrCoxncoQq+qtF2dAaGA52bjU71x7vxevT3je1eI72vK898gP+5apLeXn2zofPLlJX6YK7SlbdnkY8HPL789j911CsjRg3YSdDsLyYztxkUO71oLsrZVOSC8qABlR99sn+Fl0KLq6/5X1qdNFTmnsKl2JXNf7e3J07Bqkt7zhbpoK/o1par3ovLeb9baxtmrGXWNxiBJ4DjI2b6vpI2ISxNOnjaY4brjXhCD411biEiy0GZZHWm4jNvtV6m7gXDRvrJUstw/rmVSvI4sWC4efgYt02nTQe32dnraMMUr94PDXrS1mJoQBbI+VMszxiOymlTWJF3QAugucLCTA6fVJ9kBit2qQLhmQ9ZZ7qlkS/H6C1j9AcZpOj0xqp8VKnHQ4uqt26MD1WVKQ6cY2/z4pfn/aSV5ByTbP+H7CQZzHOitZhmqLvlULWleNgA/3/ESsF6VW+76U6B9mchlxvGcVNYeDCtDAOdbKFtXcr9MzhYaoEYV2n9GIu9dSDve1SeKPGuCoG41w/TQkZ3S4E72+FHhOZiFKsL6azRBoeYEQy4XZSUC0aSS6ajMNdwk7zxztdmWryOr1CI7GTxHHd3fmrX/zUJ3WHYO97VF6PJd9rUa1xHtoYtOTyRa/DShasa4Lt70yseYoKfR7HBvTcDWNy8DD0cuui4UKKFI52wa1OdyBbSFGmh5dmKWpQkBft8ka2GXOD4bgsOMGFOppUiQ7UgIBDm2rcOQe5ilsAV9iQHo8OyxC2fCM7aSvVhAyI3i9drOglnnSHoVxeRe0w1orH9PiMStKNiWWKYJR7Z37npoehlvWWx2oYCVC9tBalrEUUwJ6Ud8Mho2vSEC/GT5qMR9qotfZb3bUGV/jv97+Maccz9x/BWtsX0K9z4fk2MRM5VkAvniAIWd7B2ifafgsfzm8+TMpB3WbnYQxgrsY+FSOY1RXMvw/mvCcpbCljG92L+DD/rvKBBFFSxONwTEci/XxRap5gvbUCb9RJ6S0CDcuuN42Tf+d+Le1XDHSHM7iNE/tvOQII9YA1J6O7VDrfUlxasJhUpZ9CNyL7BDRn6mmpV+lKa8pDUsc2Tjfew7Fee8bWMPZeL1S07WUag8tkontTdLstnhPwU9HPnJmP9iI+8472q8uVgOfBcDYOhEcXJYlai+pG2FjsydkfDkVss9WDnkAnH7jJ2u2jWYfSllep7wKUP117K7IWfn+/O9pDVhwXR5lxDMdXXOXBrZH19Qt3z3LezYLcGmcub1jJy0yhwMzHV+exaAg5pvMPSnZ7WCgZc3zjw+88dQJcmS7drcsHCPk6dSemFVjxjUY+lvyUhxyKodod4Bh0iA8tv3Sf4XdUdis7ziK/KiiTtiBU/YncDt7H0Lwyr1DVjD2ITy+MnIlXI42Itnn7oFxODTbhB9r61zZ5BFWXG79CoXjj2xh2AKqHerLqqKwnn6su4gP1jfvLb9S8+5BpEcqKFo1/UXGXuaYeS7MH3yTrTk6t3FK2OxqeCPKJBRQ8+p8j8DyiT86y6QSz26EQExPpx/yCQJ3gn+IL6TWsxAxp51mtcfNyxecGs3lqhrI/EuQr9/J+q7F6SCUx2lQjTNz1Zu3OSZsnrJlCSb+KCVBCD/lfKzpDvfQRQqnNthjae/8iPR65p+org9kZRUBUBmvPJ9EtOnybOBQI7XmtqKHb8pFSaRPL9vqo06noC5nT1yCoWDqqthkhyOgDCwCJSH4z9qGLxjxy257r/cpGM4sfdBfFpf6FCfeGSuxBrRxvw9+fQ2VNU/6vSqkH7D6nJ570kFE0JVaBpZvSa2+nn3R4lxzrvde6Fc6svFk5x60ktLR2YPg/oTdWgCFeYOWgfzwKvj6/zZsJ+Yag/4pNg4fGEucZaSnMD15xv/dxyBCL6zwNUlhmo5RViIoT8Ocr2DbBdAjEutDC4vWsrSbE26dSpjkrnBwmPmZDmUE2hKHgP5N87oE5g7/UluZFpXrwk+J/h7lfTcORJqyQslFN6j2u1LBbCxihox2EwrWtYXh0OtiFISEHA8zKkBMEH+rRNhtCIw8f3fNg2fSQhRwxZYYbHELO6kwMjk2xqIf5lnubRsdzh3g4G2WG0EbDli4J8Munr7D2FN8A3aByJP3tHB6RZkyK4qFO/PxRB6Sph0YgMa+tJLdtJAwn7SxecNo6EFI8/OHHzYaBdd4CGtCUJra9WhI1AxEvoTL/sv/w8ftezaH9GZAnMlNfOhcjFBSTXPcthB19ko0oPqnYTznFfReNEvgw2DecKM6P6YRqXfhGsxLmlra/dVEjjHnwzFeHG2xxc3j6FG4zMOxxOMjMZf44n/C+YM0O7tkrJrx9rbQxPTasAMbefIhIFpBfOAGyyUXUq6uFiLhH4T0bcJAuNXirQH+9rO70Avs0ChGaUO44D15JB7QmuPPDhe3YwxYTL9SQbhu2nlD+3IDDNXILsnMTWDVvlBh/ADiOzcCflRF/aVyPXJ3QuFjd7CQBEcIPeG+2jaITAb4KWfvW4AIGexXSEajRMdpswI1PfCLBMddgGbslsF7GGaLu224yx9Z1OnmHF//O10yeBehLQkomNSrxePxWqvdnvadFzDz3GdUikHr1DMcy2yDEPYdPyIYceTLAjrtDpneakTOX25tkqqBdiISonlJa26MPsM3GhNNxbzxlUj/OCBRBTWcoK8JAkGAAmYo+eH/4lfnxEuarojN2t2cb6CmgBQrRYAOOUjUruekVf5czjPiJYX40+1dsc/OL595v94YCJZxAqYy4NFPHv0tgIPY5OzxMZQ5EsWtJlYQW6/pyrZKuy4+L5zmQdakLbk79TQtHLxCIiOLbopWkcZ1YIwJKx26vF93JY6ucKn4VHOvC9VKsuKigw2HNRpgMaiRRWyL7/a3NKpr4ciQUHkfuMoW48oTb7SCfl+nJyXyAr89RdqkLB/u6hpgkB/J2lfliUAMw3BkHPG8N7NDRE3YlGuiIKbTKm9bmbH9NTC/KqPQ8iuxlbm5rQAnJC9CRGNp4GoZ6gOdDnEqJWKSnlhk1k3cGE4JeUOpXOvH9BDdyQoM3ombQl1SX/BhbKb+agPz50hdAK2405pCtlLPphzDeZYwSzo0xtUDIc7NYm1c02P4svEe/D5xGly4kgIYJ0NjBdUrIJsoSiQxtj+d9bXIYT6cFk7Pldr+FvYyyXbQ6Wb2GLnlSz9TmvA0vuiNhx0+EQfLeB7v9yq9uHGYKXukXRNZXCrCiKbTjpeSy1NoCskcBXDdmRsi6abPUN3Ps5IkjxjrdMgIQk5eP9Sk6AAkPB8kaVGddf+zlb/LxLGfnA+TgPciWHJtlscFg30N8cxki0f9lPnZCfdTcjr6S2p/7XcRX7oeImCgbNy+FPTN6LyhYB3jtsNeZlVMaMTLa/bKo09lg9aexGRjg5qQyce9As0voLwSsPqGsIzso3OWIFcC6YBh6/uMdcNoE5MEbLawOJH8TQS33VT4etaC4YDWnWTbXFyEaglIBnfGe4lVlPqh5GKf7IRJ7ZxxpAEK3ruP+yXK7e9k0cGiywOmNKlPAF2l5CinZvyX4KfMDoOEnKrmlQSX7xSbCUmGyWHKQ0oZHK1jmxRT1SL/oKAgUSqoRyd0a0rEcauYRwQbqZkKO2pYr5EBJUGq1lsEccDAAfGKmk3naV+AAS9siX2b5/uaCyQVQDts/mJpXY0YqAl/2V8t81psMckOLWCCL8ugwiYLtQoA4boA/DECCdXd49ftKIMy7Fta5AKaEbmX81jwVC+Nyh+Rc5j8jcU8UfZ4qZ18ie07oW+xcDC30ErrIrydDBMUxoFCMkxLvBZwIYSHbX6haw83BSWtcfmXjqfr2Loqt2gMfAmy4IMk+7C8EUrKTySB4zl+rmMbzji4Gg1WFq1RUwIhlkoY9xyQGWgwxMZ7LsRyNKJ9VAjokioy3uaUp6CUirO5U9PVQgSBQ2C+8p49fikcJTwYB3zQ3WMbbSD5kkASB+MoVn0jEDp3qANE/x8nRkSXXdsHHyVa6pUJXy4jPlSBM1qsgybcbmr8Eq65VbvZtP2LPsxYPgsPamWqaAmr1aFdZ7omef8j6fumZ1XU+r+CpEzuo6hxxt6YabWiy5dy9+6SwbsfR38UK4zKAhK/XUwS38rbIs37OCerUiW3qmTzhDq5vmirmmMoZRC9gIPK3i7BUc6CsMvCe0kN/uU/r0hbvlZoyrNZJXm8qXtlu0CVcax+fP/+CKgm6EOLY18gvt77r5K2NQsJO7VUpKqm5NPRBnL0MqBN1Paxyqobjndci0dyv5Rz0fSkR8bpHN6kIYv0TSeukyLkobdMDaxJVDb3j/PLOsJp7QnByD84adtD05u/9kVgAAAAA="
    },
    {
      "name": "Curly Fries 250g",
      "desc": "Seasoned curly fries (250g)",
      "price": "600,000 LBP",
      "img": "/images/curly%20fries.webp"
    },
    {
      "name": "Cheese Fries",
      "desc": "Crispy fries smothered in melted cheese sauce",
      "price": "600,000 LBP",
      "img": "/images/bing-cheese-fries.jpg"
    },
    {
      "name": "Andiamo's Salad",
      "desc": "Fresh house salad with Andiamo's special dressing",
      "price": "550,000 LBP",
      "img": "/images/pexels-221057.jpg"
    },
    {
      "name": "Mozzarella Sticks (6 pcs)",
      "desc": "6 golden fried mozzarella sticks with dipping sauce",
      "price": "600,000 LBP",
      "img": "/images/bing-mozz-sticks.jpg"
    },
    {
      "name": "Mozzarella Sticks (3 pcs)",
      "desc": "3 golden fried mozzarella sticks with dipping sauce",
      "price": "300,000 LBP",
      "img": "/images/bing-mozz-sticks.jpg"
    },
    {
      "name": "Garlic Bread",
      "desc": "Toasted bread with herb garlic butter",
      "price": "200,000 LBP",
      "img": "/images/garlic%20bread.webp"
    },
    {
      "name": "Jalapeño Poppers (6 pcs)",
      "desc": "6 crispy jalapeño poppers filled with cream cheese",
      "price": "450,000 LBP",
      "img": "/images/pexels-38366578.jpg"
    }
  ],
  "drinks": [
    {
      "name": "Pepsi",
      "desc": "Chilled Pepsi soft drink",
      "price": "100,000 LBP",
      "img": "/images/pepsi.png"
    },
    {
      "name": "Diet Pepsi",
      "desc": "Chilled Diet Pepsi soft drink",
      "price": "100,000 LBP",
      "img": "/images/pepsi-diet.png"
    },
    {
      "name": "7UP",
      "desc": "Refreshing lemon-lime 7UP",
      "price": "100,000 LBP",
      "img": "/images/7up.png"
    },
    {
      "name": "Diet 7Up",
      "desc": "Refreshing lemon-lime Diet 7Up",
      "price": "100,000 LBP",
      "img": "/images/7up-diet.png"
    },
    {
      "name": "Mirinda",
      "desc": "Cold Mirinda orange soda",
      "price": "100,000 LBP",
      "img": "/images/mirinda.png"
    },
    {
      "name": "Water",
      "desc": "Bottled mineral water",
      "price": "40,000 LBP",
      "img": "/images/water.png"
    }
  ]
},
  offers: defaultOffers,
};

export function getRestaurantConfig() {
  return defaultRestaurantConfig;
}

// Dev-only: writes straight to src/data/restaurantConfig.js via the Vite middleware in vite.config.js.
// Commit and push the updated file to publish changes on Netlify.
export async function saveRestaurantConfig(config) {
  const response = await fetch("/api/save-config", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
  if (!response.ok) throw new Error("Failed to save changes. Make sure 'npm run dev' is running.");
  return response.json();
}
