// English / Arabic dictionaries + language engine (saves choice in localStorage, switches dir=rtl)
(function () {
  const D = {
    en: {
      brand_tag: "Towards a Safer, Cleaner Internet.", skip: "Skip to content", menu: "Menu",
      nav_home: "Home", nav_about: "About", nav_demands: "Demands", nav_blog: "Blog", nav_join: "Join us", nav_contact: "Contact", nav_privacy: "Privacy Policy",
      lang_switch: "العربية", dismiss: "Dismiss", cnt_label: "Supporters who joined the campaign", cnt_goal: "Goal: {goal}", cnt_pct: "{pct}% reached", cnt_zero: "Be the first to join the campaign", cnt_join: "Join now", f_goal: "Supporters goal (number)",
      footer_default: "An independent campaign. Not officially affiliated with any social media platform.", footer_rights: "All rights reserved.",
      hero_kicker: "Independent international campaign", hero_title: "A safer, cleaner internet starts with accountable platforms.",
      hero_sub: "CORN FREE is an independent digital safety campaign promoting better content moderation, transparent reporting, responsible platform policies, and safer online environments.",
      btn_join: "Join the campaign", btn_demands: "Read our demands",
      intro_title: "About the campaign", intro_text: "CORN FREE brings together people from around the world who believe online spaces should be safer for everyone. We push for clear rules, fair enforcement, and open reporting from the platforms that shape our digital lives.",
      mission_title: "Our mission", mission_text: "To promote better content moderation, transparent reporting, and responsible platform policies through public awareness and constructive advocacy.",
      vision_title: "Our vision", vision_text: "An internet where people of every age and background can take part without fear of harm, abuse, or exploitation.",
      obj_title: "Campaign objectives", obj1: "Raise public awareness about online safety.", obj2: "Encourage platforms to publish clear, enforceable policies.", obj3: "Call for transparent reporting on moderation and enforcement.", obj4: "Build an international community of volunteers and advocates.",
      adv_title: "What we advocate for",
      adv1: "Better content moderation", adv1_d: "Effective, consistent review of harmful content, with enough trained moderators and clear escalation paths.",
      adv2: "Transparent reporting", adv2_d: "Regular public reports on removals, appeals, and enforcement outcomes.",
      adv3: "Responsible platform policies", adv3_d: "Plain-language rules that are applied fairly and explained to users.",
      adv4: "Protection of young people", adv4_d: "Stronger safeguards and age-appropriate design for younger users.",
      adv5: "Accessible reporting tools", adv5_d: "Simple ways to report abuse, in every language, with timely responses.",
      adv6: "Fair appeals", adv6_d: "Users can challenge decisions and receive a clear, reasoned answer.",
      latest_title: "Latest from the blog", view_all: "View all posts", cta_title: "Be part of the change", cta_text: "Volunteer your time and skills to help make the internet safer.",
      about_title: "About CORN FREE", about_p1: "CORN FREE is an independent international digital safety campaign promoting better content moderation, transparent reporting, responsible platform policies, and safer online environments.",
      about_p2: "We are volunteers and advocates from different countries working together through awareness, research, and constructive dialogue.", about_p3: "The campaign is independent and is not officially affiliated with any social media platform.",
      about_how_t: "How we work", about_how: "We publish articles, gather volunteer support, and call on platforms and policymakers to adopt practical safety measures.",
      demands_title: "Our demands", demands_intro: "We call on platforms and policymakers to commit to the following.",
      blog_title: "Blog", blog_sub: "News, analysis, and updates from the campaign.", search_ph: "Search articles…", search_btn: "Search", all_cats: "All categories",
      featured: "Featured", featured_title: "Featured articles", no_posts: "No articles found.", loading: "Loading…", load_error: "Could not load content. Please try again.", retry: "Retry",
      prev: "Previous", next: "Next", page_of: "Page {page} of {pages}", read_more: "Read more", back_blog: "← Back to blog", by: "By", article_missing: "This article was not found.",
      join_title: "Join the campaign", join_intro: "Apply to volunteer with CORN FREE. Tell us a little about yourself.",
      j_name: "Full name", j_email: "Email", j_country: "Country", j_lang: "Preferred language", lang_en: "English", lang_ar: "Arabic", j_interests: "Areas of interest",
      int_advocacy: "Advocacy", int_content_moderation: "Content moderation", int_research: "Research", int_translation: "Translation", int_design: "Design", int_development: "Development", int_outreach: "Community outreach", int_legal: "Legal & policy",
      j_intro: "Short introduction", consent: "I agree to the processing of my data as described in the", j_submit: "Submit application", sending: "Sending…",
      j_success_t: "Thank you!", j_success: "Your application was received. We will contact you by email.",
      c_title: "Contact us", c_intro: "Questions, press, or partnerships? Send us a message.", c_name: "Name", c_subject: "Subject", c_message: "Message", c_submit: "Send message", c_success: "Your message was sent. Thank you for contacting us.",
      err_required: "This field is required.", err_invalid: "This value is not valid.", err_too_short: "This is too short.", err_too_long: "This is too long.", err_duplicate: "This value already exists.",
      err_network: "Cannot reach the server. Check your connection and try again.", err_rate: "Too many submissions. Please try again later.", err_generic: "Something went wrong. Please try again.", err_validation: "Please fix the highlighted fields.",
      priv_title: "Privacy Policy", priv_intro: "This policy explains how CORN FREE handles information you submit through this website.",
      priv1_t: "Information we collect", priv1: "When you apply to volunteer or contact us, we collect what you enter: name, email address, country, language, interests, and your message. We do not publish these submissions.",
      priv2_t: "How we use it", priv2: "We use your information only to respond to you and to organise the campaign's volunteer work.",
      priv3_t: "Storage and security", priv3: "Submissions are stored in a protected database that only authorised administrators can access. The site's API runs on Cloudflare, which processes requests on our behalf. To limit abuse, forms apply a rate limit using a salted, hashed form of your IP address; the raw address is not stored.",
      priv4_t: "Sharing", priv4: "We do not sell your information and do not share it with third parties except where required by law.",
      priv5_t: "Local storage", priv5: "Your browser keeps your language choice and dismissed announcements on your device. This is not sent to us.",
      priv6_t: "Your choices", priv6: "You can ask us to access, correct, or delete your information through the contact page.",
      nf_title: "Page not found", nf_text: "The page you are looking for does not exist or has moved.", nf_home: "Back to home",
      // admin
      a_title: "Admin", a_dashboard: "Dashboard", a_blog: "Blog posts", a_announcements: "Announcements", a_forms: "Submissions", a_settings: "Settings", a_site: "View site",
      a_signin_title: "Administrator sign-in", a_signin_text: "Enter the admin password.", a_open_signin: "Sign in with Cloudflare Access instead", a_retry: "Retry", a_checking: "Checking access…",
      a_err_access: "ADMIN IS NOT PROTECTED: no admin login is configured on the API, so the admin is disabled. Set the ADMIN_PASSWORD and SESSION_SECRET secrets (see README) and redeploy.", a_password: "Password", a_login: "Sign in", a_bad_pw: "Wrong password.", a_logout: "Sign out",
      a_err_auth: "You are not signed in, or your session expired.", a_err_forbidden: "This account is not on the administrator allowlist.",
      s_published: "Published posts", s_drafts: "Draft posts", s_volunteers: "Volunteer applications", s_messages: "Contact messages", s_announcements: "Active announcements", s_new: "{n} new",
      a_new: "New", a_edit: "Edit", a_delete: "Delete", a_confirm: "Delete this item permanently?", a_save: "Save", a_saved: "Saved.", a_deleted: "Deleted.", a_cancel: "Cancel", a_all: "All", a_none: "Nothing here yet.", a_actions: "Actions", a_back: "Back",
      a_new_post: "New post", a_publish: "Publish", a_unpublish: "Unpublish", a_feature: "Toggle featured", th_title: "Title", th_status: "Status", th_cat: "Category", th_updated: "Updated", st_draft: "Draft", st_published: "Published",
      a_categories: "Categories", a_cat_form: "Add / update category", f_slug: "Slug", f_name: "Name", a_editor: "Post editor", a_save_draft: "Save as draft", a_no_cat: "— None —",
      f_title: "Title", f_excerpt: "Excerpt", f_content: "Content", f_cover: "Cover image URL (https)", f_category: "Category", f_author: "Author", f_featured: "Featured", f_published_at: "Publication date",
      a_fmt: "Formatting: blank line = new paragraph; start a line with ## for a heading; start lines with - for a list.",
      f_message: "Message", f_type: "Type", ty_info: "Info", ty_attention: "Attention", ty_warning: "Warning", ty_success: "Success", f_cta_text: "Button text", f_cta_url: "Button URL (https or /path)",
      f_active: "Active", f_starts: "Start date", f_expires: "Expiration date", f_priority: "Priority (higher shows first)", th_window: "Window", th_priority: "Priority",
      a_tab_vol: "Volunteer applications", a_tab_msg: "Contact messages", st_new: "New", st_reviewing: "Reviewing", st_accepted: "Accepted", st_rejected: "Rejected", st_archived: "Archived", st_read: "Read", st_replied: "Replied", a_notes: "Internal notes", a_received: "Received",
      f_tagline: "Tagline", f_contact_email: "Public contact email", f_footer: "Footer text"
    },
    ar: {
      brand_tag: "نحو إنترنت أكثر أمانًا ونظافة.", skip: "تخطَّ إلى المحتوى", menu: "القائمة",
      nav_home: "الرئيسية", nav_about: "عن الحملة", nav_demands: "مطالبنا", nav_blog: "المدونة", nav_join: "انضم إلينا", nav_contact: "تواصل معنا", nav_privacy: "سياسة الخصوصية",
      lang_switch: "English", dismiss: "إغلاق", cnt_label: "عدد الداعمين المنضمين إلى الحملة", cnt_goal: "الهدف: {goal}", cnt_pct: "تم تحقيق {pct}٪", cnt_zero: "كن أول المنضمين إلى الحملة", cnt_join: "انضم الآن", f_goal: "هدف الداعمين (رقم)",
      footer_default: "حملة مستقلة وغير تابعة رسميًا لأي منصة تواصل اجتماعي.", footer_rights: "جميع الحقوق محفوظة.",
      hero_kicker: "حملة دولية مستقلة", hero_title: "إنترنت أكثر أمانًا ونظافة يبدأ بمنصات تتحمل مسؤوليتها.",
      hero_sub: "حملة CORN FREE مستقلة للسلامة الرقمية تدعو إلى إشراف أفضل على المحتوى، وتقارير شفافة، وسياسات منصات مسؤولة، وبيئات إلكترونية أكثر أمانًا.",
      btn_join: "انضم إلى الحملة", btn_demands: "اطّلع على مطالبنا",
      intro_title: "عن الحملة", intro_text: "تجمع CORN FREE أشخاصًا من مختلف أنحاء العالم يؤمنون بأن الفضاءات الإلكترونية يجب أن تكون أكثر أمانًا للجميع. ندعو إلى قواعد واضحة، وتطبيق عادل، وتقارير مفتوحة من المنصات التي تشكّل حياتنا الرقمية.",
      mission_title: "مهمتنا", mission_text: "تعزيز الإشراف الأفضل على المحتوى، والتقارير الشفافة، وسياسات المنصات المسؤولة، من خلال التوعية العامة والمناصرة البنّاءة.",
      vision_title: "رؤيتنا", vision_text: "إنترنت يستطيع فيه الناس من كل الأعمار والخلفيات المشاركة دون خوف من الأذى أو الإساءة أو الاستغلال.",
      obj_title: "أهداف الحملة", obj1: "رفع الوعي العام بالسلامة على الإنترنت.", obj2: "تشجيع المنصات على نشر سياسات واضحة وقابلة للتطبيق.", obj3: "المطالبة بتقارير شفافة حول الإشراف وتطبيق القواعد.", obj4: "بناء مجتمع دولي من المتطوعين والمناصرين.",
      adv_title: "ما ندعو إليه",
      adv1: "إشراف أفضل على المحتوى", adv1_d: "مراجعة فعّالة ومتسقة للمحتوى الضار، مع عدد كافٍ من المشرفين المدرَّبين ومسارات تصعيد واضحة.",
      adv2: "تقارير شفافة", adv2_d: "تقارير عامة دورية عن عمليات الإزالة والاستئناف ونتائج تطبيق القواعد.",
      adv3: "سياسات منصات مسؤولة", adv3_d: "قواعد بلغة بسيطة تُطبَّق بعدل ويجري شرحها للمستخدمين.",
      adv4: "حماية الأطفال والشباب", adv4_d: "ضمانات أقوى وتصميم يناسب أعمار المستخدمين الأصغر سنًا.",
      adv5: "أدوات إبلاغ سهلة الوصول", adv5_d: "طرق بسيطة للإبلاغ عن الإساءة بجميع اللغات مع ردود في وقت مناسب.",
      adv6: "استئناف عادل", adv6_d: "يمكن للمستخدمين الاعتراض على القرارات والحصول على إجابة واضحة ومعلَّلة.",
      latest_title: "أحدث المقالات", view_all: "عرض كل المقالات", cta_title: "كن جزءًا من التغيير", cta_text: "تطوّع بوقتك ومهاراتك للمساعدة في جعل الإنترنت أكثر أمانًا.",
      about_title: "عن CORN FREE", about_p1: "CORN FREE حملة دولية مستقلة للسلامة الرقمية تدعو إلى إشراف أفضل على المحتوى، وتقارير شفافة، وسياسات منصات مسؤولة، وبيئات إلكترونية أكثر أمانًا.",
      about_p2: "نحن متطوعون ومناصرون من دول مختلفة نعمل معًا عبر التوعية والبحث والحوار البنّاء.", about_p3: "الحملة مستقلة وغير تابعة رسميًا لأي منصة تواصل اجتماعي.",
      about_how_t: "كيف نعمل", about_how: "ننشر المقالات، ونجمع دعم المتطوعين، ونطالب المنصات وصنّاع السياسات باعتماد إجراءات سلامة عملية.",
      demands_title: "مطالبنا", demands_intro: "ندعو المنصات وصنّاع السياسات إلى الالتزام بما يلي.",
      blog_title: "المدونة", blog_sub: "أخبار وتحليلات ومستجدات من الحملة.", search_ph: "ابحث في المقالات…", search_btn: "بحث", all_cats: "كل التصنيفات",
      featured: "مميز", featured_title: "مقالات مميزة", no_posts: "لا توجد مقالات.", loading: "جارٍ التحميل…", load_error: "تعذّر تحميل المحتوى. يُرجى المحاولة مرة أخرى.", retry: "إعادة المحاولة",
      prev: "السابق", next: "التالي", page_of: "صفحة {page} من {pages}", read_more: "اقرأ المزيد", back_blog: "العودة إلى المدونة →", by: "بقلم", article_missing: "لم يتم العثور على هذا المقال.",
      join_title: "انضم إلى الحملة", join_intro: "قدّم طلب تطوع مع CORN FREE وعرّفنا بنفسك باختصار.",
      j_name: "الاسم الكامل", j_email: "البريد الإلكتروني", j_country: "الدولة", j_lang: "اللغة المفضلة", lang_en: "الإنجليزية", lang_ar: "العربية", j_interests: "مجالات الاهتمام",
      int_advocacy: "المناصرة", int_content_moderation: "الإشراف على المحتوى", int_research: "البحث", int_translation: "الترجمة", int_design: "التصميم", int_development: "البرمجة والتطوير", int_outreach: "التواصل المجتمعي", int_legal: "القانون والسياسات",
      j_intro: "نبذة قصيرة عنك", consent: "أوافق على معالجة بياناتي كما هو موضح في", j_submit: "إرسال الطلب", sending: "جارٍ الإرسال…",
      j_success_t: "شكرًا لك!", j_success: "تم استلام طلبك. سنتواصل معك عبر البريد الإلكتروني.",
      c_title: "تواصل معنا", c_intro: "لديك سؤال أو استفسار صحفي أو اقتراح شراكة؟ أرسل لنا رسالة.", c_name: "الاسم", c_subject: "الموضوع", c_message: "الرسالة", c_submit: "إرسال الرسالة", c_success: "تم إرسال رسالتك. شكرًا لتواصلك معنا.",
      err_required: "هذا الحقل مطلوب.", err_invalid: "هذه القيمة غير صالحة.", err_too_short: "النص قصير جدًا.", err_too_long: "النص طويل جدًا.", err_duplicate: "هذه القيمة موجودة مسبقًا.",
      err_network: "تعذّر الاتصال بالخادم. تحقق من اتصالك وحاول مرة أخرى.", err_rate: "عدد كبير من المحاولات. يُرجى المحاولة لاحقًا.", err_generic: "حدث خطأ ما. يُرجى المحاولة مرة أخرى.", err_validation: "يُرجى تصحيح الحقول المحددة.",
      priv_title: "سياسة الخصوصية", priv_intro: "توضح هذه السياسة كيف تتعامل CORN FREE مع المعلومات التي ترسلها عبر هذا الموقع.",
      priv1_t: "المعلومات التي نجمعها", priv1: "عند تقديم طلب تطوع أو التواصل معنا نجمع ما تدخله: الاسم والبريد الإلكتروني والدولة واللغة والاهتمامات ورسالتك. لا ننشر هذه المعلومات.",
      priv2_t: "كيف نستخدمها", priv2: "نستخدم معلوماتك فقط للرد عليك ولتنظيم عمل المتطوعين في الحملة.",
      priv3_t: "التخزين والأمان", priv3: "تُخزَّن الطلبات في قاعدة بيانات محمية لا يصل إليها إلا المسؤولون المخوَّلون. تعمل واجهة الموقع البرمجية على Cloudflare التي تعالج الطلبات نيابةً عنا. للحد من إساءة الاستخدام تطبّق النماذج حدًّا للمحاولات باستخدام صيغة مشفّرة مملّحة من عنوان IP الخاص بك، ولا نخزّن العنوان الأصلي.",
      priv4_t: "المشاركة", priv4: "لا نبيع معلوماتك ولا نشاركها مع أطراف ثالثة إلا عند الاقتضاء بموجب القانون.",
      priv5_t: "التخزين المحلي", priv5: "يحتفظ متصفحك بلغتك المفضلة والإعلانات التي أغلقتها على جهازك. ولا يُرسل ذلك إلينا.",
      priv6_t: "خياراتك", priv6: "يمكنك طلب الاطلاع على معلوماتك أو تصحيحها أو حذفها عبر صفحة التواصل.",
      nf_title: "الصفحة غير موجودة", nf_text: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.", nf_home: "العودة إلى الرئيسية",
      a_title: "الإدارة", a_dashboard: "لوحة المعلومات", a_blog: "المقالات", a_announcements: "الإعلانات", a_forms: "الطلبات والرسائل", a_settings: "الإعدادات", a_site: "عرض الموقع",
      a_signin_title: "تسجيل دخول المسؤول", a_signin_text: "أدخل كلمة مرور الإدارة.", a_open_signin: "تسجيل الدخول عبر Cloudflare Access بدلًا من ذلك", a_retry: "إعادة المحاولة", a_checking: "جارٍ التحقق من الصلاحية…",
      a_err_access: "لوحة الإدارة غير محمية: لم يتم إعداد تسجيل دخول للمسؤول على واجهة API، لذلك تم تعطيل الإدارة. أضف الأسرار ADMIN_PASSWORD وSESSION_SECRET (راجع README) ثم أعد النشر.", a_password: "كلمة المرور", a_login: "تسجيل الدخول", a_bad_pw: "كلمة المرور غير صحيحة.", a_logout: "تسجيل الخروج",
      a_err_auth: "لم تسجّل الدخول أو انتهت الجلسة.", a_err_forbidden: "هذا الحساب غير مدرج في قائمة المسؤولين المسموح لهم.",
      s_published: "مقالات منشورة", s_drafts: "مسودات", s_volunteers: "طلبات التطوع", s_messages: "رسائل التواصل", s_announcements: "إعلانات نشطة", s_new: "{n} جديد",
      a_new: "جديد", a_edit: "تعديل", a_delete: "حذف", a_confirm: "حذف هذا العنصر نهائيًا؟", a_save: "حفظ", a_saved: "تم الحفظ.", a_deleted: "تم الحذف.", a_cancel: "إلغاء", a_all: "الكل", a_none: "لا يوجد شيء بعد.", a_actions: "إجراءات", a_back: "رجوع",
      a_new_post: "مقال جديد", a_publish: "نشر", a_unpublish: "إلغاء النشر", a_feature: "تبديل التمييز", th_title: "العنوان", th_status: "الحالة", th_cat: "التصنيف", th_updated: "آخر تحديث", st_draft: "مسودة", st_published: "منشور",
      a_categories: "التصنيفات", a_cat_form: "إضافة / تحديث تصنيف", f_slug: "الرابط المختصر", f_name: "الاسم", a_editor: "محرر المقال", a_save_draft: "حفظ كمسودة", a_no_cat: "— بدون —",
      f_title: "العنوان", f_excerpt: "المقتطف", f_content: "المحتوى", f_cover: "رابط صورة الغلاف (https)", f_category: "التصنيف", f_author: "الكاتب", f_featured: "مميز", f_published_at: "تاريخ النشر",
      a_fmt: "التنسيق: سطر فارغ = فقرة جديدة؛ ابدأ السطر بـ ## لعنوان؛ وابدأ الأسطر بـ - لقائمة.",
      f_message: "الرسالة", f_type: "النوع", ty_info: "معلومة", ty_attention: "تنبيه", ty_warning: "تحذير", ty_success: "نجاح", f_cta_text: "نص الزر", f_cta_url: "رابط الزر (https أو /مسار)",
      f_active: "نشط", f_starts: "تاريخ البدء", f_expires: "تاريخ الانتهاء", f_priority: "الأولوية (الأعلى يظهر أولًا)", th_window: "المدة", th_priority: "الأولوية",
      a_tab_vol: "طلبات التطوع", a_tab_msg: "رسائل التواصل", st_new: "جديد", st_reviewing: "قيد المراجعة", st_accepted: "مقبول", st_rejected: "مرفوض", st_archived: "مؤرشف", st_read: "مقروء", st_replied: "تم الرد", a_notes: "ملاحظات داخلية", a_received: "تاريخ الاستلام",
      f_tagline: "الشعار النصي", f_contact_email: "البريد العام للتواصل", f_footer: "نص التذييل"
    }
  };

  const KEY = 'cf_lang', subs = [];
  let lang = 'en';
  try { const s = localStorage.getItem(KEY); if (s === 'ar' || s === 'en') lang = s; } catch { /* storage unavailable */ }

  function t(k, v) {
    let s = (D[lang] && D[lang][k]) ?? D.en[k] ?? k;
    if (v) for (const x in v) s = s.replace('{' + x + '}', v[x]);
    return s;
  }
  function apply(root = document) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    root.querySelectorAll('[data-i18n]').forEach((e) => (e.textContent = t(e.dataset.i18n)));
    root.querySelectorAll('[data-i18n-ph]').forEach((e) => (e.placeholder = t(e.dataset.i18nPh)));
    root.querySelectorAll('[data-i18n-aria]').forEach((e) => e.setAttribute('aria-label', t(e.dataset.i18nAria)));
    const k = document.body && document.body.dataset.title;
    if (k) document.title = t(k) + ' — CORN FREE';
  }
  function set(l) { lang = l; try { localStorage.setItem(KEY, l); } catch { /* ignore */ } apply(); subs.forEach((f) => f(l)); }

  window.i18n = { t, apply, set, lang: () => lang, onChange: (f) => subs.push(f), dict: D };
  apply();
})();
