# NILASYA AGRO FOODS — B2B Pulses, Grains & Agricultural Commodities Exporter from Türkiye

**Official Domain:** [www.nilasyaagrofoods.com.tr](https://www.nilasyaagrofoods.com.tr)  
**Live Firebase Hosting:** [nilasyaagrofoods.web.app](https://nilasyaagrofoods.web.app)  
**GitHub Repository:** [https://github.com/Highlife01/nilasyaagro](https://github.com/Highlife01/nilasyaagro)  
**Brand Positioning:** *Premium Turkish Pulses & Grains. Delivered Worldwide.*  
**Primary Export Terminal:** Mersin International Port (MIP), Türkiye  
**Trade Desk WhatsApp / Phone:** +90 532 505 58 33  
**Export Inquiries Email:** [export@nilasyaagrofoods.com.tr](mailto:export@nilasyaagrofoods.com.tr)

---

## 🌟 Overview

Nilasya Agro Foods is an enterprise B2B agricultural commodity processor, packer, and exporter of high-grade Turkish pulses, grains, durum wheat, bulgur, and oilseeds. Operating directly from Türkiye's premier maritime export gate at Mersin International Port (MIP) and inland aggregation centers across Central and Southeastern Anatolia, Nilasya Agro Foods supplies international supermarket chains, canneries, dal millers, and bulk commodity distributors across 50+ countries.

### Core Export Commodities (6 Categories)

1. **Chickpeas (Nohut):** Large-caliber Turkish Kabuli (Koçbaşı) chickpeas (8mm, 9mm, 10mm, 11mm+). Thin-skinned, buttery texture, high water absorption, and Bühler Sortex optical sorting (purity 99.8%).
2. **Red Lentils (Kırmızı Mercimek):** Machine-dressed and Sortex-cleaned whole dehulled (Football) and split red lentils with natural high-beta-carotene orange-red color.
3. **Green Lentils (Yeşil Mercimek):** Central Anatolian Laird (6.5mm-7.0mm) and Eston (5.0mm-5.5mm) green lentils with firm cellular structure and rich earthy flavor.
4. **Dry White Beans (Kuru Fasulye):** Premium Anatolian Dermason (canning grade), Horoz (long), and giant Bombay white beans with tender skins that remain intact during industrial boiling.
5. **Dry Peas (Kuru Bezelye):** Divided yellow split peas and whole polished green dry peas, calibrated for soup bases, puree manufacturing, and canning.
6. **Durum Wheat & Bulgur (Makarnalık Buğday & Bulgur):** High-protein amber durum wheat (protein 14.5%+, vitreous >80%) and pre-cooked stone-milled Turkish bulgur (pilavlık, köftelik, mid-coarse).

---

## 🚀 Technology Stack & Architecture

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) + React 19 |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v4, custom agricultural design tokens (forest green, harvest gold, linen cream), glassmorphism |
| Typography | Google Fonts (*Plus Jakarta Sans*) |
| Icons | Lucide React |
| Internationalization | **30 fully functional languages** via `[lang]` route segment (incl. RTL: Arabic, Persian, Urdu) |
| Rendering | Fully static export (`output: 'export'`), `trailingSlash: true`, unoptimized images |
| PWA | Web app manifest, service worker (`sw.js`), offline fallback page |
| SEO / GEO | JSON-LD structured data (`Organization`, `Product`, `BreadcrumbList`, `Article`), `llms.txt`, `llms-full.txt`, dynamic `robots.txt` & `sitemap.xml` |
| Hosting | Firebase Hosting — project `ajansonline`, site `nilasyaagrofoods` |

---

## 🛠️ Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Local Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Test Suite

```bash
npm run test
```

### 4. Build Static Production Bundle

```bash
npm run build
```

Runs `next build` followed by [`scripts/postprocess-export.mjs`](scripts/postprocess-export.mjs), which validates every exported HTML file for locale/canonical consistency against `https://www.nilasyaagrofoods.com.tr`.

### 5. Deploy to Firebase Hosting

```bash
firebase deploy --only hosting:nilasyaagrofoods
```

---

## 📦 Packaging Standards

- **25kg & 50kg PP Woven Bags:** Double-stitched, UV-stabilized, high-tenacity polypropylene bags with buyer labeling.
- **1,000kg FIBC Jumbo Big Bags:** With top fill spout and bottom discharge valve for automated industrial lines.
- **24 MT Container Bulk Liners (Sea Bulk):** Polyethylene liners fitted into 20ft dry containers for maximum payload efficiency.
- **Private Label Retail Packs (500g – 5kg):** Customized multi-language pillow packs, stand-up pouches, or Kraft packs for supermarket shelves.

---

## 🛡️ Certifications & Standards

- **ISO 22000 & HACCP:** Food safety management systems in grain processing.
- **Bühler Sortex Optical Quality:** Laser multi-camera color sorting for min 99.8% purity.
- **Non-GMO Project:** 100% Anatolian heritage non-genetically modified seeds.
- **Phytosanitary & Fumigation:** Turkish Ministry of Agriculture pre-export inspection and container fumigation.
- **Halal & Kosher Standards:** Compliant with international religious food dietary laws.
- **Independent Inspection:** Pre-shipment weight, grade, and quality audits by SGS or GAFTA accredited surveyors.

---

© 2026 Nilasya Agro Foods Tarım Ürünleri Dış Ticaret Ltd. Şti. All rights reserved.
