const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "public", "images");
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const images = [
  // Hero
  { url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop", file: "hero-burger.jpg" },
  // Offers
  { url: "https://images.pexels.com/photos/1600711/pexels-photo-1600711.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-1600711.jpg" },
  { url: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-1640777.jpg" },
  { url: "https://images.pexels.com/photos/3219483/pexels-photo-3219483.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-3219483.jpg" },
  // Burgers
  { url: "https://images.pexels.com/photos/4628466/pexels-photo-4628466.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-4628466.jpg" },
  { url: "https://images.pexels.com/photos/5374420/pexels-photo-5374420.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-5374420.jpg" },
  { url: "https://images.pexels.com/photos/36691286/pexels-photo-36691286.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-36691286.jpg" },
  { url: "https://images.pexels.com/photos/34407507/pexels-photo-34407507.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-34407507.jpg" },
  { url: "https://images.pexels.com/photos/17300434/pexels-photo-17300434.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-17300434.jpg" },
  // Sandwiches
  { url: "https://images.pexels.com/photos/17200355/pexels-photo-17200355.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-17200355.jpg" },
  { url: "https://images.pexels.com/photos/14866627/pexels-photo-14866627.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-14866627.jpg" },
  { url: "https://images.pexels.com/photos/34644340/pexels-photo-34644340.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-34644340.jpg" },
  { url: "https://images.pexels.com/photos/29306505/pexels-photo-29306505.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-29306505.jpg" },
  { url: "https://images.pexels.com/photos/14774690/pexels-photo-14774690.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-14774690.jpg" },
  { url: "https://images.pexels.com/photos/860620/pexels-photo-860620.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-860620.jpg" },
  // Pizza
  { url: "https://images.pexels.com/photos/31094832/pexels-photo-31094832.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-31094832.jpg" },
  { url: "https://images.pexels.com/photos/6068718/pexels-photo-6068718.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-6068718.jpg" },
  { url: "https://images.pexels.com/photos/5903315/pexels-photo-5903315.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-5903315.jpg" },
  { url: "https://images.pexels.com/photos/5903382/pexels-photo-5903382.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-5903382.jpg" },
  // Mashiweh
  { url: "https://images.pexels.com/photos/37417607/pexels-photo-37417607.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-37417607.jpg" },
  { url: "https://images.pexels.com/photos/6089834/pexels-photo-6089834.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-6089834.jpg" },
  { url: "https://images.pexels.com/photos/37417601/pexels-photo-37417601.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-37417601.jpg" },
  { url: "https://images.pexels.com/photos/38366577/pexels-photo-38366577.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-38366577.jpg" },
  { url: "https://images.pexels.com/photos/36548085/pexels-photo-36548085.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-36548085.jpg" },
  { url: "https://images.pexels.com/photos/16423838/pexels-photo-16423838.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-16423838.jpg" },
  { url: "https://images.pexels.com/photos/37322777/pexels-photo-37322777.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-37322777.jpg" },
  { url: "https://images.pexels.com/photos/1618898/pexels-photo-1618898.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-1618898.jpg" },
  // Crispy
  { url: "https://images.pexels.com/photos/33254639/pexels-photo-33254639.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-33254639.jpg" },
  { url: "https://images.pexels.com/photos/5652257/pexels-photo-5652257.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-5652257.jpg" },
  { url: "https://images.pexels.com/photos/36879172/pexels-photo-36879172.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-36879172.jpg" },
  { url: "https://images.pexels.com/photos/5652263/pexels-photo-5652263.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-5652263.jpg" },
  { url: "https://images.pexels.com/photos/36617209/pexels-photo-36617209.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-36617209.jpg" },
  { url: "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-2338407.jpg" },
  { url: "https://images.pexels.com/photos/36782573/pexels-photo-36782573.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-36782573.jpg" },
  { url: "https://images.pexels.com/photos/17628580/pexels-photo-17628580.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-17628580.jpg" },
  { url: "https://images.pexels.com/photos/36750236/pexels-photo-36750236.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-36750236.jpg" },
  { url: "https://images.pexels.com/photos/33261412/pexels-photo-33261412.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-33261412.jpg" },
  { url: "https://images.pexels.com/photos/4870440/pexels-photo-4870440.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-4870440.jpg" },
  // Sides
  { url: "https://images.pexels.com/photos/8272622/pexels-photo-8272622.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-8272622.jpg" },
  { url: "https://images.pexels.com/photos/5836999/pexels-photo-5836999.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-5836999.jpg" },
  { url: "https://images.pexels.com/photos/5779487/pexels-photo-5779487.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-5779487.jpg" },
  { url: "https://images.pexels.com/photos/221057/pexels-photo-221057.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-221057.jpg" },
  { url: "https://images.pexels.com/photos/27668690/pexels-photo-27668690.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-27668690.jpg" },
  { url: "https://images.pexels.com/photos/36863569/pexels-photo-36863569.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-36863569.jpg" },
  { url: "https://images.pexels.com/photos/1586540/pexels-photo-1586540.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-1586540.jpg" },
  { url: "https://images.pexels.com/photos/38366578/pexels-photo-38366578.jpeg?auto=compress&cs=tinysrgb&w=400", file: "pexels-38366578.jpg" },
  // Bing images
  { url: "https://th.bing.com/th/id/OIP.bv4EGK8__tzrOSKeiJpttwHaHa?w=177&h=180&c=7&o=7&dpr=1.1&pid=1.7&rm=3&retry=2", file: "bing-mushroom-burger.jpg" },
  { url: "https://th.bing.com/th/id/OIP.BQK__dn17Uh1YAQ35VtLUwHaHa?w=170&h=180&c=7&r=0&o=7&dpr=1.1&pid=1.7&rm=3", file: "bing-chicken-sub.jpg" },
  { url: "https://th.bing.com/th/id/OIP.QGZB1qJU5D96PO6DhArdowHaE8?w=246&h=180&c=7&r=0&o=7&dpr=1.1&pid=1.7&rm=3", file: "bing-francisco.jpg" },
  { url: "https://th.bing.com/th/id/OIP.e6uVOBB7Cb1uJRoBxFuvkwHaDu?w=296&h=176&c=7&r=0&o=7&dpr=1.1&pid=1.7&rm=3", file: "bing-crispy-sandwich.jpg" },
  { url: "https://th.bing.com/th/id/OIP.6q1UNLBc7OQL7merlUraDgHaHa?w=170&h=180&c=7&r=0&o=7&dpr=1.1&pid=1.7&rm=3", file: "bing-zinger.jpg" },
  { url: "https://th.bing.com/th/id/OIP.WnHmMd-n3Zm9taZ_3kgbVwHaGB?w=205&h=180&c=7&r=0&o=7&dpr=1.1&pid=1.7&rm=3", file: "bing-zinger-mozz.jpg" },
  { url: "https://th.bing.com/th/id/OIP.mzpfDkoU3tkfRVMsyAJGHQHaFj?w=240&h=180&c=7&r=0&o=7&dpr=1.1&pid=1.7&rm=3", file: "bing-twister.jpg" },
  { url: "https://th.bing.com/th/id/OIP.J0wkBivce4aFuuMOQdtL-QHaE7?w=260&h=180&c=7&r=0&o=7&dpr=1.1&pid=1.7&rm=3", file: "bing-sujuk.jpg" },
  { url: "https://th.bing.com/th/id/OIP.7QlTWJtn2oIaQkvEXqj13gHaHa?w=207&h=207&c=7&r=0&o=7&dpr=1.1&pid=1.7&rm=3", file: "bing-veg-pizza.jpg" },
  { url: "https://th.bing.com/th/id/OIP.KpIKOAsXBPCwG1P-mij6cwHaHa?w=202&h=202&c=7&r=0&o=7&dpr=1.1&pid=1.7&rm=3", file: "bing-chicken-bbq-pizza.jpg" },
  { url: "https://th.bing.com/th/id/OIP.iHeeLwetIATROIQdBfpvLAHaKs?w=200&h=288&c=7&r=0&o=7&dpr=1.1&pid=1.7&rm=3", file: "bing-margarita.jpg" },
  { url: "https://th.bing.com/th/id/OIP.2BMLY5LC77S5-7xnU3s_kwHaEJ?w=310&h=180&c=7&r=0&o=7&dpr=1.1&pid=1.7&rm=3", file: "bing-pesto-rocca.jpg" },
  { url: "https://th.bing.com/th/id/OIP.Cn7_va06Dxu9wL0YWNZ6XwHaHa?w=202&h=202&c=7&r=0&o=7&dpr=1.1&pid=1.7&rm=3", file: "bing-truffle-mushrooms.jpg" },
  { url: "https://th.bing.com/th/id/OIP.M7ecShC98MOctnKxde3fjwHaJ4?w=202&h=269&c=7&r=0&o=7&dpr=1.1&pid=1.7&rm=3", file: "bing-alfredo-chicken.jpg" },
  { url: "https://th.bing.com/th/id/OIP.6H4oZtD6kfC8gK8BigSz-AHaE7?w=295&h=196&c=7&r=0&o=7&dpr=1.1&pid=1.7&rm=3", file: "bing-shrimp-pizza.jpg" },
  // Drinks
  { url: "https://bklebanon.com/Content/pictures/pepsi2026.png", file: "pepsi.png" },
  { url: "https://bklebanon.com/Content/pictures/pepsidiet2026.png", file: "pepsi-diet.png" },
  { url: "https://bklebanon.com/Content/pictures/7upnodiet2026.png", file: "7up.png" },
  { url: "https://bklebanon.com/Content/pictures/7up2026.png", file: "7up-diet.png" },
  { url: "https://bklebanon.com/Content/pictures/mirinda2026.png", file: "mirinda.png" },
  { url: "https://bklebanon.com/Content/pictures/MINIRAL%20WATER.png", file: "water.png" },
];

function download(url, filename, redirectCount = 0) {
  return new Promise((resolve) => {
    if (redirectCount > 5) { console.error(`REDIRECT LOOP ${filename}`); return resolve(); }
    const filepath = path.join(OUT, filename);
    if (fs.existsSync(filepath) && fs.statSync(filepath).size > 500) {
      console.log(`SKIP ${filename}`);
      return resolve();
    }
    const proto = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(filepath);
    proto.get(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
        file.close();
        try { fs.unlinkSync(filepath); } catch {}
        return download(res.headers.location, filename, redirectCount + 1).then(resolve);
      }
      if (res.statusCode !== 200) {
        file.close();
        try { fs.unlinkSync(filepath); } catch {}
        console.error(`FAIL ${filename} (HTTP ${res.statusCode})`);
        return resolve();
      }
      res.pipe(file);
      file.on("finish", () => { file.close(); console.log(`OK   ${filename}`); resolve(); });
      file.on("error", (e) => { console.error(`WRITE ERR ${filename}: ${e.message}`); resolve(); });
    }).on("error", (e) => {
      try { fs.unlinkSync(filepath); } catch {}
      console.error(`NET ERR ${filename}: ${e.message}`);
      resolve();
    });
  });
}

(async () => {
  for (const img of images) {
    await download(img.url, img.file);
  }
  console.log("\nAll done.");
})();
