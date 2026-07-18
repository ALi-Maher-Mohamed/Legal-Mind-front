// src/config/translations.ts

export type Locale = 'en' | 'ar';

export const translations = {
  en: {
    common: {
      getStarted: "Get Started",
      login: "Login",
      learnMore: "Learn More",
      startNow: "Start Now",
      subscribing: "Subscribing...",
      subscribe: "Subscribe",
      emailPlaceholder: "Enter your email",
      loading: "Processing...",
      uploadFile: "Upload Contract/Document",
      searchPlaceholder: "Search frequently asked questions...",
      monthly: "Monthly",
      yearly: "Yearly",
      save20: "Save 20%",
      active: "Active",
      popular: "Most Popular",
      send: "Send",
      attachmentLabel: "Attached file: ",
      brandName: "LegalMind",
      brandSuffix: "AI",
    },
    nav: {
      services: "Services",
      pricing: "Pricing",
      about: "About Us",
      faq: "FAQ",
      dashboard: "Dashboard"
    },
    hero: {
      titlePrefix: "Your Premium AI ",
      titleHighlight: "Legal Assistant",
      titleSuffix: "",
      arabicHeading: "مستقبلك القانوني مدعوم بالذكاء الاصطناعي",
      description: "Analyze complex contracts, draft bulletproof legal documents, track court cases, and receive instant, expert legal insights in seconds. Powered by state-of-the-art neural legal intelligence.",
      ctaStart: "Start Free Now",
      ctaDemo: "Book a Live Demo",
      features: {
        analyzeDocs: "Analyze Documents",
        generateContracts: "Generate Contracts",
        legalConsultation: "Legal Consultation",
        govGuide: "Government Guide",
        explainTerms: "Explain Terms",
        caseTracking: "Case Tracking"
      }
    },
    aiPreview: {
      badge: "AI Simulator",
      title: "Experience Legal Intelligence In Action",
      description: "Upload any agreement, lease, or complex commercial contract. Our AI instantly surfaces liabilities, alerts you to hidden risks, and translates obscure legalese into plain language.",
      ctaText: "Try Full Platform",
      chatHeader: "LegalMind Assistant",
      onlineStatus: "Online | AI Lawyer v4.2",
      promptOne: "Analyze this commercial lease agreement.",
      promptTwo: "Draft a freelance software developer contract.",
      welcomeMessage: "Hello! I am your AI Legal Assistant. You can upload any legal document or ask me a legal question. How can I assist you today?",
      uploadSuccess: "Document uploaded successfully! Click Send to analyze.",
      typing: "LegalMind is analyzing your request..."
    },
    services: {
      title: "Comprehensive Legal Capabilities",
      subtitle: "Supercharge your legal workflow with modular, industry-specific AI solutions built for legal professionals and modern enterprises.",
      docAnalysis: {
        title: "AI Document Analysis",
        desc: "Scan PDFs and Word documents to identify hidden clauses, severe liabilities, and compliance issues automatically."
      },
      contractGen: {
        title: "Smart Contract Generator",
        desc: "Draft highly tailored contracts, employment agreements, or NDAs by answering a few guided prompts."
      },
      consultation: {
        title: "Instant Legal Consultation",
        desc: "Ask complex legal questions and receive structured citations, general advisories, and step-by-step guidance."
      },
      govGuide: {
        title: "Government Guide",
        desc: "Navigate local regulatory frameworks, corporate registration steps, and state licensing procedures easily."
      },
      termExplainer: {
        title: "Legalese Explainer",
        desc: "Convert dense, highly technical legal paragraphs into simple, executive-level summaries anyone can digest."
      },
      caseTracker: {
        title: "Active Case Tracking",
        desc: "Monitor court hearings, regulatory filings, and legal deadlines with intelligent notification triggers."
      }
    },
    stats: {
      users: "Active Global Users",
      consultations: "Legal Audits & Consultations",
      satisfaction: "Client Satisfaction Rate"
    },
    faq: {
      title: "Frequently Asked Questions",
      subtitle: "Got questions? We've got answers. If you need custom consultation, feel free to start a chat with our AI.",
      ctaTitle: "Still have specific legal questions?",
      ctaDesc: "Start a private session with LegalMind AI and analyze up to 3 documents for free.",
      ctaBtn: "Start Chatting Now",
      q1: "Is LegalMind AI a replacement for a human lawyer?",
      a1: "No. LegalMind AI provides general information, document analysis, and drafting assistance. It is designed to act as an assistant to speed up legal research and review, not to provide binding legal representation.",
      q2: "How secure are my uploaded legal documents?",
      a2: "Security is our highest priority. All documents are encrypted in transit and at rest using AES-256 standards. We do not use your private documents to train our public models.",
      q3: "Can I draft custom, legally-binding contracts?",
      a3: "Yes. The contracts generated are based on standard legal templates compliant with general laws. However, we always recommend having a final version reviewed by qualified legal counsel in your jurisdiction.",
      q4: "How accurate is the contract analysis?",
      a4: "Our specialized neural legal models achieve up to 98% accuracy in identifying standard commercial lease, NDA, and service agreement issues when compared to junior paralegal reviews."
    },
    pricing: {
      title: "Simple, Transparent Pricing",
      subtitle: "Choose a plan that matches your volume. No hidden fees. Upgrade or downgrade at any time.",
      freeName: "Starter",
      proName: "Professional",
      enterpriseName: "Enterprise",
      freePrice: "0",
      proPrice: "49",
      enterprisePrice: "Custom",
      monthlyLabel: "/ month",
      yearlyLabel: "/ month (billed annually)",
      ctaFree: "Get Started Free",
      ctaPro: "Upgrade to Pro",
      ctaEnterprise: "Contact Sales",
      features: {
        f1: "3 document uploads per month",
        f2: "Basic AI chat assistant",
        f3: "Standard contract templates",
        f4: "Unlimited document uploads",
        f5: "Advanced deep risk analysis",
        f6: "Custom contract drafting",
        f7: "Priority case tracking alerts",
        f8: "Multi-user team dashboard",
        f9: "Dedicated AI node hosting",
        f10: "Custom legal model fine-tuning",
        f11: "API integration & webhook logs",
        f12: "24/7 legal counsel phone support"
      }
    },
    testimonials: {
      title: "Endorsed by Industry Leaders",
      subtitle: "Hear how corporate teams, legal firms, and freelancers rely on LegalMind AI to speed up reviews.",
      t1: {
        name: "Sarah Jenkins",
        role: "Corporate Counsel at FinTech Corp",
        text: "LegalMind reduced our contract review cycle from days to minutes. The AI highlights critical liabilities that we used to spend hours searching for."
      },
      t2: {
        name: "Ali Al-Mansoori",
        role: "Managing Director, Al-Mansoori Associates",
        text: "Outstanding accuracy! Using it in both English and Arabic is incredibly smooth. The terminology translations are precise and contextually correct."
      },
      t3: {
        name: "David Chen",
        role: "Co-Founder, SaaSify",
        text: "As a fast-growing startup, we draft a lot of NDAs and offer letters. LegalMind lets us generate clean templates and sign partnerships with confidence."
      }
    },
    footer: {
      desc: "LegalMind AI is a state-of-the-art legal assistant platform automating document reviews, contract drafting, and regulatory research.",
      product: "Product",
      company: "Company",
      resources: "Resources",
      legal: "Legal",
      newsletterTitle: "Subscribe to Legal Updates",
      newsletterDesc: "Get monthly summaries of AI legal compliance trends directly in your inbox.",
      newsletterBtn: "Subscribe",
      copyright: "© 2026 LegalMind AI. All rights reserved."
    },
    dashboard: {
      chambersOf: "Chambers of",
      goodMorning: "Good morning, Counselor {name}",
      toggleDesk: "Toggle desk state",
      deskFilled: "FILLED",
      deskClear: "CLEAR",
      emptyTitle: "Your desk is clear, Counselor",
      uploadFirst: "Upload your first instrument to begin AI-assisted review and drafting.",
      enterEvidence: "Open evidence locker",
      activeCases: "Active instruments",
      viewLibrary: "View library",
      noDocuments: "No registered active legal instruments.",
      audited: "AUDITED",
      pending: "PENDING",
      activityLog: "Chambers daily log",
      expand: "[Expand details]",
      collapse: "[Collapse]",
      calendarTitle: "Obligations calendar",
      calendarMonth: "July 2026",
      bulletinLabel: "Cognitive bulletin",
      bulletinTitle: "Regulatory alert: Egyptian Civil Code Article 147",
      bulletinDesc: "Review force-majeure and good-faith performance clauses before mid-quarter filings.",
      inspectGazette: "Inspect gazette articles →",
      stat1Title: "Docs analyzed",
      stat2Title: "Active matters",
      stat3Title: "Generated drafts",
      logout: "Sign out",
      workspace: "Workspace",
      comingSoon: "This module is coming soon.",
      backDesk: "Back to desk",
      navDashboard: "Desk",
      navConsultation: "Counsel",
      navEvidence: "Evidence",
      navDrafter: "Drafter",
      navGazette: "Gazette",
      navSettings: "Settings",
    },
    auth: {
      backHome: "Back to home",
      welcome: "Welcome back",
      subtitle: "Sign in to your LegalMind workspace",
      emailPlaceholder: "Professional email...",
      passwordPlaceholder: "Password...",
      rememberMe: "Keep me signed in",
      forgotPassword: "Forgot password?",
      forgotAlert: "Password recovery must be initiated from your admin panel.",
      loginBtn: "Sign in",
      noAccount: "New to LegalMind? ",
      registerBtn: "Create account",
      registerTitle: "Create your account",
      stepOf: "Step {step} of 3",
      namePlaceholder: "Full name...",
      regEmailPlaceholder: "Work email...",
      regPasswordPlaceholder: "Create a password...",
      firmPlaceholder: "Firm or legal department...",
      barIdPlaceholder: "Bar license ID (optional)...",
      teamSizeLabel: "Team size",
      teamSolo: "Solo practice (1)",
      teamBoutique: "Boutique (2–10)",
      teamRegional: "Regional firm (11–50)",
      teamCorporate: "Large firm (50+)",
      practicesLabel: "Primary practice areas",
      priorStep: "Back",
      loginInstead: "Sign in instead",
      nextStep: "Continue",
      enrollBtn: "Enroll & continue",
      onboardBadge: "Getting started",
      onboardTitle: "Welcome to LegalMind",
      continue: "Continue",
      enterApp: "Enter workspace",
      secureFooter: "Secure attorney-client environment · AES-256 encrypted",
      brandQuote: "Automate the drafting so counsel can master the argument.",
      brandCite: "LegalMind AI",
      brandCiteSub: "Precision legal intelligence",
      portalVer: "PORTAL VER. 1.0",
      slides: {
        aiCounsel: {
          title: "Your AI Legal Counsel",
          desc: "Grounded in statutory authority and case indexes. Converse on complex doctrines, obtain citations, and draft legal work instantly."
        },
        docAudit: {
          title: "Secure Document Audits",
          desc: "Uploads stay in your encrypted session. Inspect agreements, map deadlines, and surface liabilities with confidence."
        },
        firmBrand: {
          title: "Configure Your Workspace",
          desc: "Set disclaimers, citation preferences, custom templates, and switch seamlessly between Arabic and English."
        }
      }
    }
  },
  ar: {
    common: {
      getStarted: "ابدأ الآن",
      login: "تسجيل الدخول",
      learnMore: "معرفة المزيد",
      startNow: "ابدأ اليوم",
      subscribing: "جاري الاشتراك...",
      subscribe: "اشترك الآن",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      loading: "جاري المعالجة...",
      uploadFile: "رفع عقد / مستند قانوني",
      searchPlaceholder: "ابحث في الأسئلة الشائعة...",
      monthly: "شهرياً",
      yearly: "سنوياً",
      save20: "وفر 20%",
      active: "نشط",
      popular: "الأكثر شيوعاً",
      send: "إرسال",
      attachmentLabel: "الملف المرفق: ",
      brandName: "ليجال مايند",
      brandSuffix: "AI",
    },
    nav: {
      services: "خدماتنا",
      pricing: "الأسعار",
      about: "من نحن",
      faq: "الأسئلة الشائعة",
      dashboard: "لوحة التحكم"
    },
    hero: {
      titlePrefix: "مستشارك القانوني ",
      titleHighlight: "بالذكاء الاصطناعي",
      titleSuffix: " في متناول يدك",
      arabicHeading: "مستقبلك القانوني مدعوم بالذكاء الاصطناعي",
      description: "قم بتحليل العقود المعقدة، وصياغة المستندات القانونية الخالية من الثغرات، ومتابعة القضايا في المحاكم، والحصول على إجابات قانونية فورية في ثوانٍ معدودة باستخدام الذكاء الاصطناعي.",
      ctaStart: "ابدأ الآن مجاناً",
      ctaDemo: "احجز عرضاً مباشراً",
      features: {
        analyzeDocs: "تحليل المستندات",
        generateContracts: "توليد العقود",
        legalConsultation: "استشارة قانونية",
        govGuide: "الدليل الحكومي",
        explainTerms: "شرح المصطلحات",
        caseTracking: "متابعة القضايا"
      }
    },
    aiPreview: {
      badge: "محاكي الذكاء الاصطناعي",
      title: "شاهد الذكاء القانوني في الواقع",
      description: "قم برفع أي اتفاقية، عقد إيجار، أو عقد تجاري معقد. سيقوم نظامنا فوراً بتحديد المسؤوليات القانونية، والتحذير من المخاطر المخفية، وتبسيط الصياغات الصعبة إلى لغة بسيطة وواضحة.",
      ctaText: "تجربة المنصة الكاملة",
      chatHeader: "مساعد ليجال مايند الذكي",
      onlineStatus: "متصل | المحامي الآلي الإصدار 4.2",
      promptOne: "حلل عقد إيجار تجاري.",
      promptTwo: "صِغ عقد عمل لمطور برمجيات مستقل.",
      welcomeMessage: "مرحباً بك! أنا مساعدك القانوني الذكي. يمكنك رفع أي مستند قانوني أو طرح أسئلة قانونية. كيف يمكنني مساعدتك اليوم؟",
      uploadSuccess: "تم رفع المستند بنجاح! اضغط إرسال للبدء بالتحليل.",
      typing: "ليجال مايند يقوم بتحليل طلبك الآن..."
    },
    services: {
      title: "قدرات قانونية شاملة",
      subtitle: "ارتقِ بأعمالك القانونية بفضل حلول الذكاء الاصطناعي المصممة خصيصاً للمحامين، الشركات، ورواد الأعمال.",
      docAnalysis: {
        title: "تحليل المستندات بالذكاء الاصطناعي",
        desc: "افحص ملفات PDF و Word لاكتشاف الشروط المخفية، الالتزامات المالية، ومسائل عدم الامتثال تلقائياً."
      },
      contractGen: {
        title: "توليد العقود الذكية",
        desc: "صِغ عقوداً مخصصة، اتفاقيات توظيف، أو اتفاقيات عدم الإفصاح عبر الإجابة عن بضعة أسئلة بسيطة."
      },
      consultation: {
        title: "استشارات قانونية فورية",
        desc: "اطرح أسئلة قانونية معقدة واحصل على إجابات واضحة مدعومة بنصوص القوانين والمراجع المتاحة."
      },
      govGuide: {
        title: "الدليل الحكومي المعرفي",
        desc: "تصفح الأنظمة اللائحية، وإجراءات تأسيس الشركات، ومتطلبات التراخيص الحكومية بيسر وسهولة."
      },
      termExplainer: {
        title: "تبسيط المصطلحات القانونية",
        desc: "حوّل الفقرات القانونية المعقدة والمصطلحات الجافة إلى ملخصات تنفيذية سهلة الفهم للجميع."
      },
      caseTracker: {
        title: "متابعة القضايا والملفات",
        desc: "راقب جلسات المحاكم، المعاملات التنظيمية، والمواعيد النهائية مع التنبيه التلقائي للمستجدات."
      }
    },
    stats: {
      users: "مستخدم نشط حول العالم",
      consultations: "استشارة وتحليل مستند منجز",
      satisfaction: "نسبة رضا العملاء والشركاء"
    },
    faq: {
      title: "الأسئلة الشائعة",
      subtitle: "هل لديك استفسارات؟ لقد قمنا بالإجابة على أكثر الأسئلة شيوعاً. وإذا كنت بحاجة للمزيد، يمكنك بدء محادثة فورية مع مساعدنا الذكي.",
      ctaTitle: "هل لا تزال لديك أسئلة قانونية محددة؟",
      ctaDesc: "ابدأ جلسة خاصة مغلقة مع ليجال مايند وحلل ما يصل إلى 3 مستندات مجاناً.",
      ctaBtn: "ابدأ المحادثة الآن",
      q1: "هل يعتبر ليجال مايند بديلاً للمحامي البشري؟",
      a1: "لا. يقدم ليجال مايند معلومات عامة وتحليلات للمستندات ومساعدات صياغة. صمم ليكون مساعداً لتسريع البحث والمراجعة، وليس لتقديم تمثيل قانوني ملزم قانوناً.",
      q2: "ما مدى أمان مستنداتي المرفوعة على المنصة؟",
      a2: "الأمان هو أولويتنا القصوى. يتم تشفير جميع المستندات أثناء النقل وحفظها باستخدام معايير التشفير العالية AES-256. نحن لا نستخدم ملفاتك الخاصة لتدريب النماذج العامة.",
      q3: "هل يمكنني صياغة عقود ملزمة قانوناً؟",
      a3: "نعم. تستند العقود المولدة إلى قوالب قانونية قياسية متوافقة مع القوانين العامة. ومع ذلك، نوصي دائماً بعرض النسخة النهائية على مستشار قانوني مؤهل في منطقتك.",
      q4: "ما مدى دقة تحليل العقود بالذكاء الاصطناعي؟",
      a4: "تصل دقة نماذجنا القانونية المتخصصة إلى 98% في تحديد البنود الخطرة والمشكلات في عقود الإيجار واتفاقيات السرية مقارنة بمراجعة المساعدين القانونيين المبتدئين."
    },
    pricing: {
      title: "خطط أسعار واضحة ومرنة",
      subtitle: "اختر الباقة المناسبة لاحتياجاتك. بدون تكاليف خفية، ويمكنك ترقية أو إلغاء الاشتراك في أي وقت.",
      freeName: "الباقة الأساسية",
      proName: "الباقة الاحترافية",
      enterpriseName: "باقة الشركات",
      freePrice: "٠",
      proPrice: "٤٩",
      enterprisePrice: "مخصص",
      monthlyLabel: "/ شهرياً",
      yearlyLabel: "/ شهرياً (فاتورة سنوية)",
      ctaFree: "ابدأ مجاناً",
      ctaPro: "ترقية إلى الاحترافية",
      ctaEnterprise: "تواصل مع المبيعات",
      features: {
        f1: "تحليل ٣ مستندات شهرياً",
        f2: "المساعد الذكي الأساسي",
        f3: "قوالب عقود قياسية محدودة",
        f4: "تحليل غير محدود للمستندات",
        f5: "تحليل متقدم للمخاطر والثغرات",
        f6: "صياغة وتعديل العقود الذكية",
        f7: "تنبيهات فورية لمتابعة القضايا",
        f8: "لوحة تحكم للفريق وتعدد المستخدمين",
        f9: "استضافة منفصلة وسريعة للذكاء الاصطناعي",
        f10: "ضبط وتدريب خاص للنماذج القانونية",
        f11: "ربط برمجيات API وسجلات كاملة",
        f12: "دعم هاتفي مباشر من مستشارين ٢٤/٧"
      }
    },
    testimonials: {
      title: "حاز على ثقة كبار الرواد",
      subtitle: "تعرف على آراء الشركات والمستشارين القانونيين والمستقلين الذين يعتمدون على ليجال مايند لتسريع أعمالهم.",
      t1: {
        name: "سارة جينكينز",
        role: "المستشار القانوني لشركة FinTech Corp",
        text: "لقد اختصر ليجال مايند وقت مراجعة العقود من أيام إلى دقائق معدودة. يكتشف النظام الالتزامات والبنود الخطرة التي كنا نقضي ساعات للبحث عنها."
      },
      t2: {
        name: "علي المنصوري",
        role: "المدير التنفيذي لـ المنصوري وشركاه",
        text: "دقة استثنائية! استخدام النظام باللغتين العربية والإنجليزية سلس للغاية. الترجمة والمصطلحات سياقية ودقيقة جداً من الناحية القانونية."
      },
      t3: {
        name: "ديفيد شين",
        role: "مؤسس مشارك لشركة SaaSify",
        text: "بصفتنا شركة ناشئة سريعة النمو، نصيغ الكثير من اتفاقيات عدم الإفصاح. ليجال مايند يمكننا من صياغة قوالب نظيفة وتوقيع الشراكات بثقة تامة."
      }
    },
    footer: {
      desc: "ليجال مايند هو منصة رائدة بالذكاء الاصطناعي لأتمتة مراجعة العقود، الصياغة القانونية، والبحث التنظيمي وتسهيل أعمال المحاماة والشركات.",
      product: "المنتج",
      company: "الشركة",
      resources: "الموارد",
      legal: "قانوني",
      newsletterTitle: "اشترك في النشرة البريدية القانونية",
      newsletterDesc: "احصل على ملخص شهري لأبرز توجهات القوانين والامتثال بالذكاء الاصطناعي في بريدك.",
      newsletterBtn: "اشترك",
      copyright: "© ٢٠٢٦ ليجال مايند. جميع الحقوق محفوظة."
    },
    dashboard: {
      chambersOf: "غرف مكتب",
      goodMorning: "طاب يومك سيادة المستشار {name}",
      toggleDesk: "تبديل حالة المكتب",
      deskFilled: "نشط",
      deskClear: "خالٍ",
      emptyTitle: "مكتبك خالٍ تماماً، سيادة المستشار",
      uploadFirst: "ارفع أول مستند قانوني لبدء المراجعة والصياغة بمساعدة الذكاء الاصطناعي.",
      enterEvidence: "فتح خزانة الأدلة",
      activeCases: "الصكوك النشطة",
      viewLibrary: "عرض المكتبة",
      noDocuments: "لا يوجد مستندات أو صكوك قانونية نشطة مسجلة.",
      audited: "تم التدقيق",
      pending: "قيد التدقيق",
      activityLog: "سجلات النشاطات اليومية لغرف المكتب",
      expand: "[تفصيل السجل]",
      collapse: "[طي]",
      calendarTitle: "مفكرة المواعيد والالتزامات",
      calendarMonth: "يوليو ٢٠٢٦",
      bulletinLabel: "النشرة الاستشارية والتعميم",
      bulletinTitle: "تنبيه تنظيمي: تفعيل المادة ١٤٧ من القانون المدني المصري",
      bulletinDesc: "راجع بنود القوة القاهرة وحسن النية قبل تقديمات منتصف الربع.",
      inspectGazette: "تصفح بنود الجريدة الرسمية ←",
      stat1Title: "مستندات محللة",
      stat2Title: "قضايا نشطة",
      stat3Title: "مسودات جاهزة",
      logout: "تسجيل الخروج",
      workspace: "مساحة العمل",
      comingSoon: "هذه الوحدة قيد التطوير قريباً.",
      backDesk: "العودة للمكتب",
      navDashboard: "المكتب",
      navConsultation: "المشورة",
      navEvidence: "الأدلة",
      navDrafter: "الصياغة",
      navGazette: "الجريدة",
      navSettings: "الإعدادات",
    },
    auth: {
      backHome: "العودة للرئيسية",
      welcome: "مرحباً بعودتك",
      subtitle: "سجّل الدخول إلى مساحة عمل ليجال مايند",
      emailPlaceholder: "البريد الإلكتروني المهني...",
      passwordPlaceholder: "كلمة المرور...",
      rememberMe: "البقاء متصلاً",
      forgotPassword: "نسيت كلمة المرور؟",
      forgotAlert: "يجب استعادة كلمة المرور عبر لوحة الإدارة.",
      loginBtn: "تسجيل الدخول",
      noAccount: "جديد على ليجال مايند؟ ",
      registerBtn: "إنشاء حساب",
      registerTitle: "إنشاء حسابك",
      stepOf: "الخطوة {step} من ٣",
      namePlaceholder: "الاسم الكامل...",
      regEmailPlaceholder: "البريد الإلكتروني للعمل...",
      regPasswordPlaceholder: "إنشاء كلمة مرور...",
      firmPlaceholder: "اسم المكتب أو القسم القانوني...",
      barIdPlaceholder: "رقم قيد النقابة (اختياري)...",
      teamSizeLabel: "حجم الفريق",
      teamSolo: "مكتب مستقل (١)",
      teamBoutique: "شركاء متخصصون (٢–١٠)",
      teamRegional: "شركة إقليمية (١١–٥٠)",
      teamCorporate: "مؤسسة كبرى (+٥٠)",
      practicesLabel: "مجالات التركيز الرئيسية",
      priorStep: "السابق",
      loginInstead: "تسجيل الدخول بدلاً من ذلك",
      nextStep: "التالي",
      enrollBtn: "التسجيل والمتابعة",
      onboardBadge: "البدء",
      onboardTitle: "أهلاً بك في ليجال مايند",
      continue: "متابعة",
      enterApp: "الدخول للمساحة",
      secureFooter: "بيئة آمنة للمحامي والموكل · تشفير AES-256",
      brandQuote: "دعنا نؤتمت الصياغة ليتفرغ المستشار لإتقان الحجة.",
      brandCite: "ليجال مايند",
      brandCiteSub: "ذكاء قانوني دقيق",
      portalVer: "PORTAL VER. 1.0",
      slides: {
        aiCounsel: {
          title: "مستشارك القانوني بالذكاء الاصطناعي",
          desc: "مربوط بالنصوص التشريعية والأحكام. حاور حول النظريات المعقدة، واحصل على استشهادات، وصغ مذكراتك فوراً."
        },
        docAudit: {
          title: "تدقيق المستندات الآمن",
          desc: "تبقى الملفات داخل جلستك المشفرة. دقق العقود، وتتبع المواعيد، واكشف الالتزامات بثقة."
        },
        firmBrand: {
          title: "اضبط مساحة عملك",
          desc: "حدد إخلاء المسؤولية، بروتوكول الاقتباس، القوالب المخصصة، والتبديل السلس بين العربية والإنجليزية."
        }
      }
    }
  }
};
