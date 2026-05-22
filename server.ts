import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DB_PATH = path.join(process.cwd(), "projects-db.json");

// Default projects list to seed the DB if it doesn't exist
const DEFAULT_PROJECTS = [
  {
    id: "med-1",
    titleAr: "حملة إشراقة لعيادات ديرما التجميلية",
    titleEn: "Derma Glow Aesthetic Clinic Campaign",
    category: "medical",
    image: "/src/assets/images/medical_design_1779476750626.png",
    descriptionAr: "سلسلة منشورات إبداعية على إنستغرام لتعزيز مبيعات عيادات تجميل وجلدية رائدة في الرياض. تبرز جودة الخدمة بأسلوب فاخر يجمع بين البساطة والخطوط الذهبية.",
    descriptionEn: "A high-converting Instagram series for a premier dermatology clinic in Riyadh. Combining gold metallic accents with minimalist layout to convey luxury clinical care.",
    tagsAr: ["تجميل ديرما", "تصميم سوشيال ميديا", "رموز تجميلية", "هوية عيادات"],
    tagsEn: ["Dermatology Feed", "Social Media Ads", "Clinical Marketing", "Luxury Themes"],
    clientAr: "عيادات ديرما كير - السعودية",
    clientEn: "DermaCare Clinics - KSA",
    year: "2026"
  },
  {
    id: "med-2",
    titleAr: "ابتسامة هوليوود - لمركز المدار لطب الأسنان",
    titleEn: "Perfect Smile - Al-Madar Dental Center",
    category: "medical",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800",
    descriptionAr: "تصميم بوستات إعلانية احترافية لعروض زراعة وتقويم الأسنان بتركيز مكثف على تناسق الألوان وسهولة قراءتها لرفع نسبة الحجوزات.",
    descriptionEn: "Ad campaign showcasing comprehensive orthodontics and dental implant proposals, designed with a focus on trust, clear spacing, and strong call-to-actions.",
    tagsAr: ["طبيب أسنان", "إعلانات تفاعلية", "عروض طبية", "أزرق ملكي"],
    tagsEn: ["Dental Braces", "Ad Conversions", "Trust Blue Theme", "Offer Layouts"],
    clientAr: "مجمع عيادات المدار - الرياض",
    clientEn: "Al-Madar Dental Group - Riyadh",
    year: "2025"
  },
  {
    id: "med-3",
    titleAr: "دليل المنتجات لمجمع الشفاء الطبي",
    titleEn: "Pharma Product Guide - Al-Shifa Complex",
    category: "medical",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    descriptionAr: "بوسترات رقمية داخلية ومطبوعات لعرض المنتجات الطبية الصيدلانية بتنظيم هيكلي يسهل الفهم ويبث الأمان لدى المراجعين.",
    descriptionEn: "Digital pharmaceutical layout and interior posters designed with sharp visual hierarchy to convey medical accuracy and client security.",
    tagsAr: ["دليل مرئي", "مواد إعلانية", "بوسترات جدارية"],
    tagsEn: ["Medical Catalog", "Clinical Info", "Wall Posters"],
    clientAr: "شركة الشفاء الطبية",
    clientEn: "Al Shifa Healthcare Group",
    year: "2025"
  },
  {
    id: "food-1",
    titleAr: "إعلانات اللهب - همبرغر كرافت بريميوم",
    titleEn: "Fire Grilled - Gourmet Burger Ads",
    category: "food",
    image: "/src/assets/images/food_design_1779476770594.png",
    descriptionAr: "تطوير الحملة البصرية الكاملة لبرجر مشوي على الفحم مع تفاعل حيوي للحليب والخضار المتطايرة لإثارة جاذبية المنتج.",
    descriptionEn: "An immersive social campaign focusing on dynamic action shots with dairy splashes and fire-grilled elements to spark visual appetite.",
    tagsAr: ["مطعم برغر", "تصميم حركي", "دعاية أطعمة", "مؤثرات بصرية"],
    tagsEn: ["Gourmet Burger", "Action Shot Ads", "Sensory Splash", "Gastronomy"],
    clientAr: "مطعم كرافت هاوس - جدة",
    clientEn: "Craft House Burgers - Jeddah",
    year: "2026"
  },
  {
    id: "food-2",
    titleAr: "سلسلة سوشيال ميديا لمقهى دوز رويال",
    titleEn: "Instagram Grid for Dose Royal Specialty Coffee",
    category: "food",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800",
    descriptionAr: "إنستغرام منسق بأسلوب التون البارد الراقي يعكس هيبة المذاق الخاص بقهوة دوز بمزيج من الصور المدمجة والعبارات التحفيزية الصباحية.",
    descriptionEn: "A high-contrast moody warm-brown Instagram template series tailored to specialty dark roast enthusiasts and early-morning coffee culture.",
    tagsAr: ["صناع القهوة", "إنستغرام منظم", "بني كلاسيكي", "تفاعل يومي"],
    tagsEn: ["Barista Craft", "Visual Grid", "Warm Aesthetic", "Coffee Lovers"],
    clientAr: "دوز رويال كافيه",
    clientEn: "Dose Royal Cafe",
    year: "2025"
  },
  {
    id: "food-3",
    titleAr: "افتتاح مطعم تيرّا ستيك الإيطالي",
    titleEn: "Terra Italian Steakhouse Launch Visuals",
    category: "food",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800",
    descriptionAr: "كتيب رقمي وقائمة طعام فاخرة تبرز جودة شرائح اللحم المطهية بجرأة، مع تنسيق ألوان مشبعة توحي بالفخامة والأصالة.",
    descriptionEn: "Digital menus and social flyers capturing wood-smoked beef prime cuts with saturated, premium palettes that evoke classic culinary prestige.",
    tagsAr: ["قائمة طعام ستيك", "تصاميم سوشيال", "فانسي داينينج"],
    tagsEn: ["Steak Menu", "Gourmet Flyers", "Elegant Dining"],
    clientAr: "مجموعة تيرا للأغذية",
    clientEn: "Terra Gastronomy Group",
    year: "2025"
  },
  {
    id: "beauty-1",
    titleAr: "أوركيد بيوتي - سيروم نضارة فاخر",
    titleEn: "Orchid Pure Glow - Luxury Serum Ad",
    category: "beauty",
    image: "/src/assets/images/beauty_design_1779476787969.png",
    descriptionAr: "إعلان مستحضر تجميلي فاخر من خلال دمج ثلاثي الأبعاد لزجاجة السيروم فوق رخام دافئ وزهور الأوركيد البيضاء لتأكيد المكونات الطبيعية الراقية.",
    descriptionEn: "Luxury cosmetic banner incorporating natural element layouts with marble backdrops and orchids, emphasizing biological premium quality.",
    tagsAr: ["سيروم تجميلي", "نعومة ناتشورال", "أوركيد بيضاء", "إعلانات عطور"],
    tagsEn: ["Luxury Serum", "Earth Softness", "Cosmetic Product Study", "Beige Elegance"],
    clientAr: "علامة أوركيد فارما - الكويت",
    clientEn: "Orchid Premium Pharma - Kuwait",
    year: "2026"
  },
  {
    id: "beauty-2",
    titleAr: "هوية صالون إيفا سكين كير كيت",
    titleEn: "Eva Skin Spa Branding Kit & Visuals",
    category: "beauty",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800",
    descriptionAr: "بوستات مخصصة تدمج بين الهدوء النفسي وألوان الباستيل الهادئة لعرض جلسات الاسترخاء والمساج والعناية بالبشرة.",
    descriptionEn: "Pastel calming visual design guidelines for high-end boutique spa, conveying holistic mental wellness and organic skin care.",
    tagsAr: ["صالون تجميل", "مساج واستشفاء", "هيلثي الوان", 'رايسينج بوست'],
    tagsEn: ["Beauty Salon", "Spa Treatment", "Wellness Vibe", "Flyer Concept"],
    clientAr: "بوابة إيفا التجميلية - الدمام",
    clientEn: "Eva Wellness Center - Dammam",
    year: "2025"
  },
  {
    id: "beauty-3",
    titleAr: "مستخلص الورد - إطلاق عطر روز نوبل",
    titleEn: "Rose Noble - Fine Perfume Visual Campaign",
    category: "beauty",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800",
    descriptionAr: "تصميم فوتوغرافي مدمج رقمياً لعطر روز نوبل الشهير مع خلفية من بتلات الورد الأحمر والضباب المتطاير لتمثيل التركيز الفرنسي الثقيل.",
    descriptionEn: "Digital composite focusing on Rose Noble Fine Perfume with scattered red petals and heavy ambient mist, expressing concentrated intensity.",
    tagsAr: ["إعلانات عطور", "دمج احترافي", "ورد أحمر", "سحر العطر"],
    tagsEn: ["Fragrance Banner", "Advanced Composites", "Deep Rose Mist", "French Scent"],
    clientAr: "لافندر للعطور الفاخرة",
    clientEn: "Lavender Haute Fragrance",
    year: "2025"
  },
  {
    id: "brand-1",
    titleAr: "سمارت تراست - الهوية المؤسسية الكاملة",
    titleEn: "Smart Trust - Integrated Corporate Identity",
    category: "branding",
    image: "/src/assets/images/branding_design_1779476806307.png",
    descriptionAr: "تصميم الشعار وأوراق المراسلات والعمل لشركة تقنية متطورة، تعتمد على دمج البساطة والرموز الهندسية المعبرة عن الثقة والأمان.",
    descriptionEn: "A masterfully structured corporate brand kit featuring geometric iconography and streamlined stationery, conveying high cybersecurity trust.",
    tagsAr: ["شعار شركة", "هوية متكاملة", "تقنية هندسية", "بزنس كارد"],
    tagsEn: ["Corporate Logo", "Visual Guidelines", "Geometric Concept", "Collateral Stationery"],
    clientAr: "سمارت تراست التقنية - الرياض",
    clientEn: "Smart Trust Technologies - KSA",
    year: "2026"
  },
  {
    id: "brand-2",
    titleAr: "لوجو ورؤية شركة تمكين اللوجستية",
    titleEn: "Tamkeen Express Logo & Guidelines",
    category: "branding",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    descriptionAr: "ابتكار شعار معاصر يجمع بين خطوط الحركة وخدمات الشحن السريع في قالب أنيق يعتمد على لوني الكحلي والبرتقالي النشط.",
    descriptionEn: "A contemporary visual mark merging swift logistics arrow vectors and structured professional typeface in dynamic Navy & Amber tones.",
    tagsAr: ["لوجو شحن لوجيستي", "دليل الاستخدام", "ألوان متناسقة"],
    tagsEn: ["Logistics Vector", "Slick Logo", "Dynamic Identity"],
    clientAr: "تمكين لخدمات الشحن السريع",
    clientEn: "Tamkeen Logistics - Egypt",
    year: "2025"
  },
  {
    id: "brand-3",
    titleAr: "هوية كوفى كافيين هاب المميز",
    titleEn: "Coffee Hub Cafe Full Visual Guidelines",
    category: "branding",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=800",
    descriptionAr: "تصميم الكؤوس، أكياس التغليف، زي الموظفين، واللوجو المفرغ بدقة عالية يعكس جمال الطابع العصري الموجه للشباب وعاشقي الدراسة والمذاكرة.",
    descriptionEn: "Full identity suite covering eco-friendly cups, custom typography badges, uniform apparel, and die-cut logos representing hipster cafe workspace.",
    tagsAr: ["تغليف منتجات كافيه", "لوجو شبابي", "خطوط فريدة"],
    tagsEn: ["Packaging Concept", "Hipster Brand Icon", "Bespoke Font Setup"],
    clientAr: "مقهى كافيين هاب - قنا",
    clientEn: "Caffeine Hub Shop - Qena",
    year: "2025"
  }
];

// Seed db if missing
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_PROJECTS, null, 2), "utf-8");
}

function getProjects() {
  try {
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read projects database:", error);
    return DEFAULT_PROJECTS;
  }
}

function saveProjects(projects: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(projects, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to save projects database:", error);
  }
}

async function startServer() {
  app.use(express.json());

  // API 1: Fetch list of projects
  app.get("/api/projects", (req, res) => {
    res.json(getProjects());
  });

  // API 2: Add a new project
  app.post("/api/projects", (req, res) => {
    const {
      titleAr,
      titleEn,
      category,
      image,
      descriptionAr,
      descriptionEn,
      tagsAr,
      tagsEn,
      clientAr,
      clientEn,
      year
    } = req.body;

    // Validate parameters
    if (!titleAr || !titleEn || !category) {
      return res.status(400).json({ error: "Title and category are required fields." });
    }

    const projects = getProjects();
    
    const newProject = {
      id: "custom-" + Date.now(),
      titleAr,
      titleEn,
      category,
      image: image || "https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&q=80&w=800",
      descriptionAr: descriptionAr || "",
      descriptionEn: descriptionEn || "",
      tagsAr: Array.isArray(tagsAr) ? tagsAr : (tagsAr ? tagsAr.split(",").map((s: string) => s.trim()) : []),
      tagsEn: Array.isArray(tagsEn) ? tagsEn : (tagsEn ? tagsEn.split(",").map((s: string) => s.trim()) : []),
      clientAr: clientAr || "بيشوه فوكس للهويات - مصر",
      clientEn: clientEn || "BeshoFocus Creative - Egypt",
      year: year || "2026"
    };

    projects.unshift(newProject); // Add at the beginning of the list
    saveProjects(projects);

    res.status(201).json(projects);
  });

  // API 3: Delete custom project (for maintenance)
  app.delete("/api/projects/:id", (req, res) => {
    const { id } = req.params;
    let projects = getProjects();
    projects = projects.filter((p: any) => p.id !== id);
    saveProjects(projects);
    res.json(projects);
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Beshoy Portfolio Server running on http://localhost:${PORT}`);
  });
}

startServer();
