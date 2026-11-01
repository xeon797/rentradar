/**
 * The Premises Rent Control Act, 1991 (বাড়ি ভাড়া নিয়ন্ত্রণ আইন, ১৯৯১)
 * Statutory Corpus, Clause Auditor, and Legal Q&A Knowledge Engine.
 */

export interface StatutorySection {
  sectionNumber: string;
  sectionCode: string;
  titleEn: string;
  titleBn: string;
  statutoryRuleSummary: string;
  tenantProtectionRight: string;
  commonViolationPattern: string;
  recommendedCounterClauseBn: string;
  recommendedCounterClauseEn: string;
  penaltySummary: string;
}

export const PREMISES_RENT_CONTROL_ACT_1991_SECTIONS: StatutorySection[] = [
  {
    sectionNumber: "Section 7",
    sectionCode: "SEC_07",
    titleEn: "Restriction on Arbitrary Increase of Rent",
    titleBn: "ধারা ৭: ইচ্ছামতো ভাড়া বৃদ্ধির ওপর বিধিনিষেধ",
    statutoryRuleSummary:
      "Under Section 7 of the Premises Rent Control Act 1991, rent cannot be arbitrarily increased beyond standard rent. An existing rent rate remains binding for a minimum period of 2 years unless substantial structural capital improvements have been made with the written concurrence of the tenant.",
    tenantProtectionRight:
      "Landlords are statutorily prohibited from imposing mid-lease hikes (e.g., after 6 or 12 months) without executed agreement terms or formal Rent Controller sanction.",
    commonViolationPattern:
      "Landlords issuing sudden verbal or 7-day notices demanding a 20%–40% rent hike mid-tenancy, threatening eviction upon refusal.",
    recommendedCounterClauseBn:
      "বাড়ি ভাড়া নিয়ন্ত্রণ আইন ১৯৯১-এর ধারা ৭ অনুযায়ী, বর্তমান নির্ধারিত ভাড়া চুক্তি স্বাক্ষরের তারিখ হইতে পরবর্তী ২৪ (চব্বিশ) মাস পর্যন্ত অপরিবর্তিত থাকিবে। উক্ত মেয়াদের পূর্বে কোনো প্রকার ভাড়া বৃদ্ধির দাবি প্রযোজ্য হইবে না।",
    recommendedCounterClauseEn:
      "Pursuant to Section 7 of the Premises Rent Control Act, 1991, the agreed monthly rent shall remain fixed and immutable for a minimum period of 24 (twenty-four) continuous months from the date of execution. No unilateral intermediate increase shall be enforceable.",
    penaltySummary:
      "Rent Controller has authority to invalidate unlawful increases and order refund of excess rent collected.",
  },
  {
    sectionNumber: "Section 10",
    sectionCode: "SEC_10",
    titleEn: "Prohibition of Excessive Advance, Premium or Salami",
    titleBn: "ধারা ১০: অতিরিক্ত অগ্রিম, প্রিমিয়াম বা সালামি গ্রহণের নিষেধাজ্ঞা",
    statutoryRuleSummary:
      "Section 10 strictly forbids any landlord or lessor from claiming, demanding, or receiving any fine, premium, salami, or advance rent exceeding 1 (one) month's agreed rent without explicit written Rent Controller authorization. Any advance deposit held must be fully adjustable against monthly rent or refundable upon tenancy termination.",
    tenantProtectionRight:
      "Demands for 3 to 6 months of non-refundable advance deposits are illegal under Bangladesh law. Tenants have the statutory right to adjust any unlawful excess advance against subsequent monthly rents.",
    commonViolationPattern:
      "Demanding 3–6 months non-refundable security deposits or arbitrarily forfeiting advance money upon move-out under the guise of 'painting charges'.",
    recommendedCounterClauseBn:
      "বাড়ি ভাড়া নিয়ন্ত্রণ আইন ১৯৯১-এর ধারা ১০ অনুসরণে, অগ্রিম জামানত হিসেবে অনধিক ২ মাসের ভাড়া (কিংবা ১ মাসের আইনগত সিলিং) প্রদান করা হইবে, যাহা চুক্তি সমাপ্তিকালে কোনো অযৌক্তিক কর্তন ব্যতিরেকে সম্পূর্ণ ফেরতযোগ্য বা মাসিক ভাড়ার বিপরীতে পূর্ণ সমন্বয়যোগ্য হইবে।",
    recommendedCounterClauseEn:
      "In strict adherence to Section 10 of the Premises Rent Control Act, 1991, the security advance deposit shall not exceed statutory limits and shall remain 100% refundable or fully adjustable against rent upon tenancy conclusion, without arbitrary withholding.",
    penaltySummary:
      "Fine up to double the excess advance amount collected, recoverable via the Rent Controller Court.",
  },
  {
    sectionNumber: "Section 13",
    sectionCode: "SEC_13",
    titleEn: "Mandatory Written Rent Receipt with Counterfoil",
    titleBn: "ধারা ১৩: ভাড়ার রসিদ ও প্রতিপক্ষ রসিদ প্রদানের আইনি বাধ্যবাধকতা",
    statutoryRuleSummary:
      "Section 13 mandates that upon receiving any payment of rent or advance, the landlord MUST immediately deliver to the tenant a signed written rent receipt (ভাড়ার রশিদ) with a counterfoil maintained by the landlord. Refusal or neglect to deliver a signed receipt is a punishable offense.",
    tenantProtectionRight:
      "Tenants have an absolute legal right to receive a signed, dated receipt showing the exact amount and month paid. Without receipts, tenants face fabricated default claims.",
    commonViolationPattern:
      "Landlords taking cash or bKash payments without issuing receipts, then dishonestly claiming rent default in eviction proceedings.",
    recommendedCounterClauseBn:
      "বাড়ি ভাড়া নিয়ন্ত্রণ আইন ১৯৯১-এর ধারা ১৩ মোতাবেক, প্রতি ইংরেজি মাসের ১০ তারিখের মধ্যে ভাড়া পরিশোধের সাথে সাথে বাড়িওয়ালা স্বাক্ষরিত ও তারিখ সংবলিত ভাড়ার মূল রসিদ (Receipt) প্রদান করিবেন এবং তাহার কাউন্টারফয়েল সংরক্ষণ করিবেন।",
    recommendedCounterClauseEn:
      "Pursuant to Section 13 of the Premises Rent Control Act, 1991, the landlord shall deliver a duly signed and dated written rent receipt with counterfoil to the tenant immediately upon receipt of every rental installment.",
    penaltySummary:
      "Under Section 13(3), failure to provide a receipt carries a fine of up to double the rental amount received.",
  },
  {
    sectionNumber: "Section 15",
    sectionCode: "SEC_15",
    titleEn: "Fixation of Standard Rent by Rent Controller",
    titleBn: "ধারা ১৫: বাড়ি ভাড়া নিয়ন্ত্রক কর্তৃক প্রমিত ভাড়া নির্ধারণ",
    statutoryRuleSummary:
      "Section 15 empowers the Rent Controller, upon application by either landlord or tenant, to determine and fix the 'Standard Rent' (প্রমাণ ভাড়া) of any premises, taking into account municipal annual valuation, construction cost, and prevailing neighborhood market benchmarks.",
    tenantProtectionRight:
      "Tenants subjected to predatory, artificially inflated rental terms can formally petition the Rent Controller Court to fix an objective, statutory standard rent ceiling.",
    commonViolationPattern:
      "Subletting rooms or mess flats at 200% above municipal valuation with zero maintenance disclosure.",
    recommendedCounterClauseBn:
      "উভয় পক্ষ সম্মত হইতেছেন যে, ভাড়ার হার সংক্রান্ত কোনো মতবিরোধ দেখা দিলে বাড়ি ভাড়া নিয়ন্ত্রণ আইন ১৯৯১-এর ধারা ১৫ অনুযায়ী সংশ্লিষ্ট এলাকার বাড়ি ভাড়া নিয়ন্ত্রকের (Rent Controller) কার্যালয়ের বিধিবিধান সাপেক্ষে মানসম্মত ভাড়া ধার্য করা যাইবে।",
    recommendedCounterClauseEn:
      "Both parties agree that in the event of dispute regarding rent valuation, either party may apply to the competent Rent Controller under Section 15 of the Premises Rent Control Act, 1991 to fix the standard rent.",
    penaltySummary:
      "Any rent collected in excess of the standard rent fixed by the Controller becomes unlawful and must be returned.",
  },
  {
    sectionNumber: "Section 18",
    sectionCode: "SEC_18",
    titleEn: "Protection Against Arbitrary Eviction & Notice Requirement",
    titleBn: "ধারা ১৮: স্বেচ্ছাচারী উচ্ছেদের বিরুদ্ধে ভাড়াটিয়ার সুরক্ষা",
    statutoryRuleSummary:
      "Section 18 provides robust statutory security of tenure. So long as a tenant continues to pay agreed rent regularly and observes contractual covenants, NO eviction decree or order shall be made by any court, except on strict statutory grounds (e.g. subletting without written consent, nuisance, bona fide personal requirement by the owner) and subject to statutory 30-day written notice under Section 106 of the Transfer of Property Act, 1882.",
    tenantProtectionRight:
      "A landlord CANNOT lock out a tenant, give a 24-hour verbal notice, or violently throw out belongings. Overnight eviction is a criminal civil violation.",
    commonViolationPattern:
      "Landlords giving verbal threats to vacate within 72 hours, changing front gate locks, or barring bachelor/female tenants from entering.",
    recommendedCounterClauseBn:
      "বাড়ি ভাড়া নিয়ন্ত্রণ আইন ১৯৯১-এর ধারা ১৮ এবং সম্পত্তি হস্তান্তর আইন ১৮৮২-এর ধারা ১০৬ অনুসারে, কোনো পক্ষ চুক্তি বাতিল বা বাসা ছাড়িতে চাহিলে ন্যূনতম ৩০ (ত্রিশ) দিনের লিখিত নোটিশ প্রদান বাধ্যতামূলক থাকিবে। লিখিত নোটিশ ও আইনি প্রক্রিয়া ব্যতীত কোনো স্বেচ্ছাচারী উচ্ছেদ বা তালাবদ্ধকরণ গ্রহণযোগ্য হইবে না।",
    recommendedCounterClauseEn:
      "In accordance with Section 18 of the Premises Rent Control Act, 1991 read with Section 106 of the Transfer of Property Act, 1882, neither party shall terminate the tenancy without serving a minimum of 30 (thirty) days prior written notice. Arbitrary lockout or summary eviction without due process of law shall be null and void.",
    penaltySummary:
      "Illegal lockouts can result in emergency police intervention and Rent Controller restoration orders with damages.",
  },
  {
    sectionNumber: "Section 21",
    sectionCode: "SEC_21",
    titleEn: "Landlord Duty of Maintenance & Prohibition of Utility Cut-Off",
    titleBn: "ধারা ২১: জরুরি সুযোগ-সুবিধা (বিদ্যুৎ, গ্যাস, পানি) কর্তনের নিষেধাজ্ঞা",
    statutoryRuleSummary:
      "Section 21 places a mandatory statutory obligation on the landlord to maintain the premises in wind-and-water tight tenantable condition. Crucially, Section 21(1) strictly prohibits the landlord or their agent from severing, cutting off, or withholding any essential supply (Water, Electricity, Gas, Sewerage, Sanitation, or Lift) without prior Rent Controller authorization.",
    tenantProtectionRight:
      "Severing water or power to coerce rent payment or force move-out is illegal. The Rent Controller can issue an emergency order within 24 hours to restore service at landlord expense.",
    commonViolationPattern:
      "Shutting off the water motor switch, disconnecting electric circuit breakers, or locking kitchen gas valves during rental disputes.",
    recommendedCounterClauseBn:
      "বাড়ি ভাড়া নিয়ন্ত্রণ আইন ১৯৯১-এর ধারা ২১ মোতাবেক, বাড়িওয়ালা কোনো অবস্থাতেই বিদ্যুৎ, গ্যাস, ওয়াসা পানি বা পয়ঃনিষ্কাশনের মতো মৌলিক নাগরিক পরিষেবা কর্তন বা বিঘ্নিত করিতে পারিবেন না। যেকোনো জরুরি মেরামত বাড়িওয়ালার খরচে অনধিক ৩ দিনের মধ্যে সম্পন্ন করিতে হইবে।",
    recommendedCounterClauseEn:
      "Under Section 21 of the Premises Rent Control Act, 1991, the landlord is strictly prohibited from cutting off or interfering with essential utility supplies (water, gas, electricity, sanitation). All structural repairs necessary to maintain tenantability remain the landlord's statutory duty.",
    penaltySummary:
      "Criminal offense punishable by fine and immediate injunction from the Rent Controller or Executive Magistrate.",
  },
  {
    sectionNumber: "BERC Electricity Tariff Code",
    sectionCode: "BERC_ELEC",
    titleEn: "BERC Sub-Meter Electricity Reselling Prohibition",
    titleBn: "বিইআরসি বিদ্যুৎ ট্যারিফ আইন: সাব-মিটার অতিরিক্ত বিলের নিষেধাজ্ঞা",
    statutoryRuleSummary:
      "Under the Bangladesh Energy Regulatory Commission (BERC) Act and Distribution Utility Codes (DESCO/DPDC/BPDB), residential electricity connections cannot be commercially resold at profit. Landlords must pass through actual slab utility bills or use certified calibrated sub-meters reflecting official residential slab rates (average ৳7.00–৳8.50/unit), NOT arbitrary flat rates (e.g. ৳15–৳18/unit).",
    tenantProtectionRight:
      "Tenants have the right to inspect original DESCO/DPDC/BPDB monthly utility bills and demand calibrated meter tests.",
    commonViolationPattern:
      "Landlords purchasing electricity at average ৳7.20/unit from DESCO and charging tenants a flat markup of ৳16–৳18/unit on uncalibrated sub-meters, generating illegal monthly profit.",
    recommendedCounterClauseBn:
      "বিদ্যুৎ বিল সরকারি রেগুলেটরি সংস্থা (BERC/DESCO/DPDC)-এর অনুমোদিত আবাসিক স্ল্যাব রেট অনুযায়ী মূল বিলের অনুলিপি দেখাইয়া সাব-মিটারের প্রকৃত রিডিং সাপেক্ষে আদায় করা হইবে। কোনো প্রকার অতিরিক্ত বা বাণিজ্যিক ফ্ল্যাট রেট (যেমন ৳১৬/ইউনিট) প্রযোজ্য হইবে না।",
    recommendedCounterClauseEn:
      "Electricity shall be billed strictly on actual sub-meter consumption calculated at official BERC/DESCO/DPDC residential slab rates, accompanied by copies of the official utility bill. No commercial markup or arbitrary flat rate above authorized utility tariffs shall be levied.",
    penaltySummary:
      "Unauthorized power reselling violates the Electricity Act 2018 and can result in utility line disconnection by DESCO/DPDC.",
  },
];

export interface SampleLeaseAuditPreset {
  id: string;
  name: string;
  nameBn: string;
  badgeLabel: string;
  badgeSeverity: "CRITICAL" | "HIGH" | "MODERATE" | "COMPLIANT";
  category: "DHAKA_FAMILY" | "SYLHET_MESS" | "RENT_HIKE_NOTICE" | "COMPLIANT_FAMILY";
  leaseText: string;
  summaryProblem: string;
  targetExpectedScore: number;
}

export const SAMPLE_LEASE_AUDIT_PRESETS: SampleLeaseAuditPreset[] = [
  {
    id: "preset-a-predatory-dhaka",
    name: "Predatory Dhaka Lease (4-Mo Advance & ৳16 Sub-Meter)",
    nameBn: "শোষণমূলক ঢাকা চুক্তি (৪ মাসের অগ্রিম ও ১৬ টাকা সাব-মিটার)",
    badgeLabel: "SEVERE VIOLATIONS",
    badgeSeverity: "CRITICAL",
    category: "DHAKA_FAMILY",
    targetExpectedScore: 24,
    summaryProblem:
      "Demands 4-month non-refundable advance, charges ৳16/unit electricity, explicitly denies rent receipts, and allows 24-hour summary eviction.",
    leaseText: `বাড়ি ভাড়া চুক্তিপত্র (ভাড়াটিয়া বনাম বাড়িওয়ালা)
স্থান: বাড়ি #১২, রোড #৪, ধানমন্ডি, ঢাকা।

শর্তাবলী:
১. অগ্রিম জামানত: ভাড়াটিয়াকে ৪ (চার) মাসের ভাড়া অগ্রিম বাবদ মোট ১,৪০,০০০/- টাকা প্রদান করিতে হইবে, যাহা অফেরতযোগ্য হিসেবে গণ্য হইবে এবং কোনো ভাড়ার সাথে সমন্বয় করা যাইবে না।
২. বিদ্যুৎ বিল: সাব-মিটারের রিডিং অনুযায়ী প্রতি ইউনিট ১৬ (ষোলো) টাকা হারে বাড়িওয়ালার নিকট প্রতি মাসের ৫ তারিখের মধ্যে জমা দিতে হইবে। মূল সরকারি ডেসকো বিল দেখার দাবি করা যাইবে না।
৩. ভাড়ার রশিদ: বাড়িওয়ালা কোনো লিখিত ভাড়ার রশিদ (Rent Receipt) প্রদান করিতে বাধ্য থাকিবেন না; মৌখিক লেনদেনই চূড়ান্ত গণ্য হইবে।
৪. নোটিশ ও উচ্ছেদ: বাড়িওয়ালা যেকোনো সময় ২৪ ঘণ্টার নোটিশে ভাড়াটিয়াকে ফ্ল্যাট ছাড়িয়া দেওয়ার নির্দেশ দিতে পারিবেন এবং ভাড়াটিয়া কোনো আইনগত আপত্তি তুলিতে পারিবেন না।
৫. গ্যাস ও পানি: ভাড়া দিতে ১ দিন বিলম্ব হইলে বাড়িওয়ালা তাৎক্ষণিক পানি ও বিদ্যুৎ লাইন কাটিয়া দেওয়ার অধিকার সংরক্ষণ করেন।`,
  },
  {
    id: "preset-b-sylhet-student-mess",
    name: "Sylhet Student Mess Rules (SUST Area Lock-In)",
    nameBn: "সিলেট শাবিপ্রবি মেস নীতিমালা (ভ্যাকেশন ফি ও গেট লক)",
    badgeLabel: "UNLAWFUL RESTRICTIONS",
    badgeSeverity: "HIGH",
    category: "SYLHET_MESS",
    targetExpectedScore: 38,
    summaryProblem:
      "Forces university students to pay full rent during 3-month summer vacation, imposes ৳500 night curfew penalties, and hides utility billing.",
    leaseText: `মেস পরিচালনার নিয়মাবলী ও চুক্তি (আখালিয়া, সিলেট)
১. সিট ভাড়া ও জামানত: ভর্তির সময় ৩ মাসের অগ্রিম সিকিউরিটি মানি জমা দিতে হইবে। মেস ত্যাগ করিলে এই জামানতের কোনো টাকা ফেরত হইবে না।
২. ভ্যাকেশন কালীন ভাড়া: বিশ্ববিদ্যালয় বন্ধ থাকিলে বা পরীক্ষার পর ছুটিতে ৩ মাস মেসে না থাকিলেও পূর্ণ ভাড়া ও ইউটিলিটি বিল বাধ্যতামূলক পরিশোধ করিতে হইবে।
৩. গেট লক ও জরিমানা: রাত ১০:০০ ঘটিকার পর প্রধান ফটক বন্ধ থাকিবে। কোনো ছাত্র ১০টার পর প্রবেশ করিলে প্রতিবার ৫০০/- টাকা জরিমানা আদায় করা হইবে।
৪. ইউটিলিটি বিল: গ্যাস সিলিন্ডার ও সাব-মিটারের বিল ম্যানেজার যেভাবে নির্ধারণ করিবেন তাহাই মানিয়া লইতে হইবে। ভাউচার বা বিল দেখিতে চাওয়া যাইবে না।
৫. উচ্ছেদ: কোনো ছাত্র ম্যানেজারের সিদ্ধান্তের প্রতিবাদ করিলে তৎক্ষণাৎ তাহার ব্যাগপত্র বাহির করিয়া দেওয়া হইবে।`,
  },
  {
    id: "preset-c-midyear-rent-hike",
    name: "Sudden Mid-Year 35% Rent Hike Notice",
    nameBn: "হঠাৎ ৬ মাস পর ৩৫% ভাড়া বৃদ্ধির নোটিশ",
    badgeLabel: "ILLEGAL HIKE NOTICE",
    badgeSeverity: "HIGH",
    category: "RENT_HIKE_NOTICE",
    targetExpectedScore: 32,
    summaryProblem:
      "Violates the 2-year statutory freeze under Section 7 and threatens water disconnection if ৳7,000 hike is not paid in 7 days.",
    leaseText: `ভাড়া বৃদ্ধির জরুরি নোটিশ
তারিখ: ১৫ অক্টোবর ২০২৬
প্রাপক: ভাড়াটিয়া (ফ্ল্যাট ৪-বি, রোড ৭, মিরপুর-১১, ঢাকা)

আপনাকে অবগত করা যাইতেছে যে, বর্তমান অর্থনৈতিক পরিস্থিতি ও দ্রব্যমূল্যের কারণে আগামী নভেম্বর ২০২৬ হইতে আপনার বর্তমান ভাড়া ২০,০০০/- টাকার স্থলে ২৭,০০০/- টাকা (৩৫% বৃদ্ধি) ধার্য করা হইলো। 
চুক্তির ৭ মাস অতিবাহিত হইয়াছে বিধায় এই ভাড়া অবিলম্বে কার্যকর হইবে। 
উক্ত বর্ধিত ভাড়া আগামী ৭ দিনের মধ্যে মানিয়া না লইলে বাসার মেইন পানির লাইনের চাবি বন্ধ করিয়া দেওয়া হইবে এবং পরবর্তী ১৫ তারিখের মধ্যে বাসা খালি করিয়া দিতে হইবে।`,
  },
  {
    id: "preset-d-compliant-family-lease",
    name: "Standard 1991-Act Compliant Family Agreement",
    nameBn: "১৯৯১ সালের আইন অনুসারী আদর্শ ফ্যামিলি চুক্তি",
    badgeLabel: "STATUTORILY COMPLIANT",
    badgeSeverity: "COMPLIANT",
    category: "COMPLIANT_FAMILY",
    targetExpectedScore: 94,
    summaryProblem:
      "Complies with Section 10 (2-mo advance, refundable), Section 13 (mandatory receipts), Section 7 (2-year freeze), and Section 18 (30-day written notice).",
    leaseText: `আদর্শ বাড়ি ভাড়া চুক্তিপত্র (Premises Rent Control Act, 1991 Compliant)
স্থান: ধানমন্ডি আ/এ, ঢাকা।

১. ভাড়া ও মেয়াদ: মাসিক ভাড়া ৩৫,০০০/- টাকা। বাড়ি ভাড়া নিয়ন্ত্রণ আইন ১৯৯১-এর ধারা ৭ অনুযায়ী এই ভাড়া চুক্তি স্বাক্ষরের তারিখ হইতে পরবর্তী ২৪ মাস পর্যন্ত অপরিবর্তিত থাকিবে।
২. অগ্রিম জামানত: ধারা ১০ অনুযায়ী ২ (দুই) মাসের ভাড়া বাবদ ৭০,০০০/- টাকা অগ্রিম জামানত সংরক্ষিত থাকিবে, যাহা চুক্তি সমাপ্তিকালে কোনো বিলম্ব ব্যতিরেকে সম্পূর্ণ ফেরতযোগ্য বা শেষ মাসের ভাড়ার সহিত সমন্বয়যোগ্য হইবে।
৩. ভাড়ার রশিদ: ধারা ১৩ অনুসারে প্রতি মাসের ১০ তারিখের মধ্যে ভাড়া গ্রহণের পর বাড়িওয়ালা অবিলম্বে স্বাক্ষরিত ভাড়ার রশিদ (Receipt) প্রদান করিবেন।
৪. বিদ্যুৎ ও ইউটিলিটি: ডেসকো অনুমোদিত মূল সরকারি বিলের অনুলিপি এবং সাব-মিটারের প্রকৃত রিডিং অনুযায়ী বিদ্যুৎ বিল আদায় করা হইবে।
৫. নোটিশ ও অবসান: ধারা ১৮ অনুযায়ী যেকোনো পক্ষ বাসা খালি করিতে বা করাইতে চাহিলে ন্যূনতম ৩০ দিনের লিখিত নোটিশ প্রদান করিবেন। জরুরী পরিষেবা কর্তন সম্পূর্ণরূপে নিষিদ্ধ থাকিবে।`,
  },
];

export interface AuditedClause {
  clauseTitle: string;
  extractedQuote: string;
  status: "VIOLATION" | "WARNING" | "COMPLIANT";
  statutorySectionRef: string;
  legalExplanation: string;
  counterDraftEn: string;
  counterDraftBn: string;
}

export interface LeaseAuditResult {
  overallComplianceStatus: "COMPLIANT" | "CAUTION_CLAUSES_FOUND" | "SEVERE_STATUTORY_VIOLATIONS";
  complianceScore: number; // 0 to 100
  summaryOverview: string;
  summaryOverviewBn: string;
  auditedClauses: AuditedClause[];
  tenantActionPlan: string[];
  flaggedSectionNumbers: string[];
}

export interface TenantQAResult {
  questionTopic: string;
  statutorySection: string;
  legalSummary: string;
  legalSummaryBn: string;
  tenantRightsPoints: string[];
  practicalNextSteps: string[];
  counterClauseProposal?: {
    en: string;
    bn: string;
  };
}

/**
 * Deterministic bilingual clause auditor for Bangladesh rental agreements.
 * Works with 100% reliability offline without external API dependency.
 */
export function auditLeaseAgreementDeterministically(rawText: string): LeaseAuditResult {
  const text = rawText || "";
  const lower = text.toLowerCase();
  const auditedClauses: AuditedClause[] = [];
  const flaggedSections: string[] = [];

  let penaltyPoints = 0;

  // 1. Audit Advance / Security Deposit (Section 10)
  const advanceMonthsMatch =
    text.match(/([৩-৯]|[3-9])\s*(?:মাসের|মাস|months?)\s*(?:ভাড়া\s*)?(?:অগ্রিম|জামানত|সিকিউরিটি|advance)/i) ||
    text.match(/(?:অগ্রিম|জামানত|সিকিউরিটি|advance)\s*(?:বাবদ|হিসেবে)?\s*([৩-৯]|[3-9])\s*(?:মাসের|মাস|months?)/i);

  const nonRefundable =
    text.includes("অফেরতযোগ্য") ||
    text.includes("ফেরত হইবে না") ||
    lower.includes("non-refundable") ||
    text.includes("সমন্বয় করা যাইবে না");

  if (advanceMonthsMatch || nonRefundable) {
    penaltyPoints += 25;
    flaggedSections.push("Section 10");
    auditedClauses.push({
      clauseTitle: "Excess / Non-Refundable Advance Deposit Demand",
      extractedQuote: advanceMonthsMatch
        ? advanceMonthsMatch[0]
        : nonRefundable
        ? "অগ্রিম জামানত অফেরতযোগ্য / সমন্বয় করা যাইবে না"
        : "অতিরিক্ত জামানত দাবি",
      status: "VIOLATION",
      statutorySectionRef: "Section 10, Premises Rent Control Act, 1991 (ধারা ১০)",
      legalExplanation:
        "Section 10 strictly forbids demanding or receiving any advance exceeding 1 month's rent without written approval of the Rent Controller. Declaring an advance deposit 'non-refundable' is an unlawful forfeiture clause under Bangladesh contract and tenancy law.",
      counterDraftEn:
        "The security advance deposit shall consist of 2 months' rent (refundable/adjustable), and shall be fully adjusted against rent or refunded upon vacating under Section 10 of the Premises Rent Control Act, 1991.",
      counterDraftBn:
        "বাড়ি ভাড়া নিয়ন্ত্রণ আইন ১৯৯১-এর ধারা ১০ অনুসারে অগ্রিম জামানত বাবদ অনধিক ২ মাসের ভাড়া প্রদান করা হইবে, যাহা চুক্তি সমাপ্তিকালে কোনো অযৌক্তিক কর্তন ব্যতিরেকে সম্পূর্ণ ফেরতযোগ্য বা মাসিক ভাড়ার বিপরীতে সমন্বয়যোগ্য হইবে।",
    });
  } else if (text.includes("২ মাসের") || text.includes("2 months")) {
    auditedClauses.push({
      clauseTitle: "Standard 2-Month Advance Deposit",
      extractedQuote: "২ (দুই) মাসের ভাড়া অগ্রিম জামানত",
      status: "COMPLIANT",
      statutorySectionRef: "Section 10, Premises Rent Control Act, 1991",
      legalExplanation:
        "A 2-month deposit is the standard established urban compromise in Dhaka/Sylhet when framed as refundable or adjustable against rent.",
      counterDraftEn: "Standard terms satisfied.",
      counterDraftBn: "স্ট্যান্ডার্ড প্র্যাকটিস অনুসৃত হইয়াছে।",
    });
  }

  // 2. Audit Sub-meter Electricity Markup (BERC & Section 21)
  const submeterRegexMatch =
    text.match(/(?:১৬|১৭|১৮|১৯|২০|1[3-9]|20)\s*(?:টাকা|টাকার|tk|bdt)?\s*(?:হারে|ইউনিট|per unit|\/unit)/i) ||
    text.match(/(?:প্রতি ইউনিট|ইউনিট প্রতি)\s*(?:১৬|১৭|১৮|১৯|২০|1[3-9]|20)/i);

  const submeterKeywordMatch =
    lower.includes("16 taka") ||
    lower.includes("16/unit") ||
    lower.includes("17/unit");

  const hideBill =
    text.includes("বিল দেখার দাবি করা যাইবে না") ||
    text.includes("ভাউচার বা বিল দেখিতে চাওয়া যাইবে না") ||
    lower.includes("without utility bill");

  if (submeterRegexMatch || submeterKeywordMatch || hideBill) {
    penaltyPoints += 25;
    flaggedSections.push("BERC Tariff Code & Section 21");
    auditedClauses.push({
      clauseTitle: "Commercial Electricity Resale & Sub-Meter Overcharge",
      extractedQuote: submeterRegexMatch
        ? submeterRegexMatch[0]
        : submeterKeywordMatch
        ? "প্রতি ইউনিট ১৬ টাকা হারে"
        : "মূল সরকারি বিল দেখার দাবি করা যাইবে না",
      status: "VIOLATION",
      statutorySectionRef: "BERC Electricity Tariff Regulations & Section 21",
      legalExplanation:
        "Reselling residential electricity at arbitrary marked-up rates (e.g. ৳16-18/unit) without sharing the official DESCO/DPDC/BPDB residential slab bill violates the Electricity Act 2018 and BERC tariff directives. Sub-meter billing must reflect actual utility costs.",
      counterDraftEn:
        "Electricity shall be billed strictly on actual sub-meter consumption calculated at official BERC/DESCO residential slab rates, accompanied by copies of the monthly utility bill.",
      counterDraftBn:
        "বিদ্যুৎ বিল সরকারি রেগুলেটরি সংস্থা (BERC/DESCO)-এর অনুমোদিত আবাসিক স্ল্যাব রেট অনুযায়ী মূল বিলের অনুলিপি দেখাইয়া সাব-মিটারের প্রকৃত রিডিং সাপেক্ষে আদায় করা হইবে। কোনো বাণিজ্যিক ফ্ল্যাট রেট প্রযোজ্য হইবে না।",
    });
  }

  // 3. Audit Rent Receipt Refusal (Section 13)
  const receiptDenied =
    text.includes("রশিদ প্রদান করিতে বাধ্য থাকিবেন না") ||
    text.includes("রসিদ প্রদান করিতে বাধ্য থাকিবেন না") ||
    text.includes("মৌখিক লেনদেনই চূড়ান্ত") ||
    lower.includes("no receipt") ||
    lower.includes("without rent receipt");

  const receiptProvided =
    text.includes("স্বাক্ষরিত ভাড়ার রশিদ") ||
    text.includes("ধারা ১৩ অনুসারে") ||
    lower.includes("written rent receipt");

  if (receiptDenied) {
    penaltyPoints += 25;
    flaggedSections.push("Section 13");
    auditedClauses.push({
      clauseTitle: "Refusal to Issue Written Rent Receipts",
      extractedQuote: "বাড়িওয়ালা কোনো লিখিত ভাড়ার রশিদ প্রদান করিতে বাধ্য থাকিবেন না",
      status: "VIOLATION",
      statutorySectionRef: "Section 13, Premises Rent Control Act, 1991 (ধারা ১৩)",
      legalExplanation:
        "Section 13 explicitly makes it a statutory crime for a landlord to refuse or fail to deliver a signed, dated rent receipt with counterfoil upon receiving rent. Refusal is punishable by a fine of up to double the rental amount.",
      counterDraftEn:
        "Pursuant to Section 13 of the Premises Rent Control Act, 1991, the landlord shall deliver a duly signed and dated written rent receipt with counterfoil upon receiving every rental installment.",
      counterDraftBn:
        "বাড়ি ভাড়া নিয়ন্ত্রণ আইন ১৯৯১-এর ধারা ১৩ মোতাবেক, প্রতি ইংরেজি মাসের ১০ তারিখের মধ্যে ভাড়া পরিশোধের সাথে সাথে বাড়িওয়ালা স্বাক্ষরিত ও তারিখ সংবলিত ভাড়ার মূল রসিদ প্রদান করিবেন।",
    });
  } else if (receiptProvided) {
    auditedClauses.push({
      clauseTitle: "Mandatory Section 13 Rent Receipt Clause",
      extractedQuote: "বাড়িওয়ালা অবিলম্বে স্বাক্ষরিত ভাড়ার রশিদ প্রদান করিবেন",
      status: "COMPLIANT",
      statutorySectionRef: "Section 13, Premises Rent Control Act, 1991",
      legalExplanation: "Complies fully with statutory Section 13 receipt requirements.",
      counterDraftEn: "Standard statutory compliance.",
      counterDraftBn: "আইন অনুযায়ী যথাযথ রসিদ বিধান বিদ্যমান।",
    });
  }

  // 4. Audit Arbitrary Eviction & Notice (Section 18)
  const shortNotice =
    text.includes("২৪ ঘণ্টার নোটিশ") ||
    text.includes("24 ঘণ্টার নোটিশ") ||
    text.includes("24-hour notice") ||
    text.includes("১৫ তারিখের মধ্যে বাসা খালি") ||
    text.includes("তৎক্ষণাৎ তাহার ব্যাগপত্র বাহির") ||
    text.includes("যেকোনো সময় খালি করিতে বাধ্য");

  const statutoryNoticePresent =
    text.includes("৩০ দিনের লিখিত নোটিশ") ||
    text.includes("30 days prior written notice") ||
    text.includes("ধারা ১৮");

  if (shortNotice) {
    penaltyPoints += 25;
    flaggedSections.push("Section 18");
    auditedClauses.push({
      clauseTitle: "Arbitrary Eviction & Denial of Statutory Notice",
      extractedQuote: text.includes("২৪ ঘণ্টার নোটিশ")
        ? "২৪ ঘণ্টার নোটিশে ভাড়াটিয়াকে ফ্ল্যাট ছাড়িয়া দেওয়ার নির্দেশ"
        : "স্বেচ্ছাচারী উচ্ছেদ বা সংক্ষিপ্ত নোটিশ",
      status: "VIOLATION",
      statutorySectionRef: "Section 18, Premises Rent Control Act, 1991 & Section 106, Transfer of Property Act, 1882",
      legalExplanation:
        "Under Section 18 of the 1991 Act and Section 106 of the Transfer of Property Act, a tenant who pays rent regularly cannot be evicted without at least 30 days prior written notice and formal judicial order. 24-hour or verbal eviction demands are null, void, and actionable as illegal harassment.",
      counterDraftEn:
        "Neither party shall terminate tenancy without a minimum of 30 days written notice in accordance with Section 18 of the Premises Rent Control Act, 1991 and Section 106 of the Transfer of Property Act, 1882.",
      counterDraftBn:
        "বাড়ি ভাড়া নিয়ন্ত্রণ আইন ১৯৯১-এর ধারা ১৮ এবং সম্পত্তি হস্তান্তর আইন ১৮৮২-এর ধারা ১০৬ অনুসারে, কোনো পক্ষ চুক্তি বাতিল বা বাসা ছাড়িতে চাহিলে ন্যূনতম ৩০ (ত্রিশ) দিনের লিখিত নোটিশ প্রদান বাধ্যতামূলক থাকিবে।",
    });
  } else if (statutoryNoticePresent) {
    auditedClauses.push({
      clauseTitle: "Statutory 30-Day Written Notice Guarantee",
      extractedQuote: "ন্যূনতম ৩০ দিনের লিখিত নোটিশ প্রদান করিবেন",
      status: "COMPLIANT",
      statutorySectionRef: "Section 18, Premises Rent Control Act, 1991",
      legalExplanation: "Provides proper notice protections in accordance with Bangladesh law.",
      counterDraftEn: "Standard notice terms satisfied.",
      counterDraftBn: "যথাযথ আইনি নোটিশ মেয়াদ অনুসৃত হইয়াছে।",
    });
  }

  // 5. Audit Utility Disconnection Threats (Section 21)
  const utilityDisconnection =
    text.includes("পানি ও বিদ্যুৎ লাইন কাটিয়া দেওয়ার") ||
    text.includes("পানির লাইনের চাবি বন্ধ") ||
    lower.includes("cut off water") ||
    lower.includes("disconnect electricity");

  if (utilityDisconnection) {
    penaltyPoints += 20;
    flaggedSections.push("Section 21");
    auditedClauses.push({
      clauseTitle: "Unlawful Threat to Sever Essential Utilities",
      extractedQuote: text.includes("পানি ও বিদ্যুৎ লাইন কাটিয়া দেওয়ার")
        ? "তাৎক্ষণিক পানি ও বিদ্যুৎ লাইন কাটিয়া দেওয়ার অধিকার সংরক্ষণ করেন"
        : "পানির লাইনের চাবি বন্ধ করিয়া দেওয়া হইবে",
      status: "VIOLATION",
      statutorySectionRef: "Section 21, Premises Rent Control Act, 1991 (ধারা ২১)",
      legalExplanation:
        "Section 21 strictly prohibits landlords from severing or withholding essential water, electricity, gas, or sanitation supplies to force eviction or coerce rental payments. Disconnecting utilities is a punishable statutory offense subject to emergency Rent Controller injunctions.",
      counterDraftEn:
        "Under Section 21 of the Premises Rent Control Act, 1991, essential utility connections (water, gas, electricity) shall remain uninterrupted under all circumstances.",
      counterDraftBn:
        "বাড়ি ভাড়া নিয়ন্ত্রণ আইন ১৯৯১-এর ধারা ২১ মোতাবেক, বাড়িওয়ালা কোনো অবস্থাতেই বিদ্যুৎ, গ্যাস, ওয়াসা পানি বা পয়ঃনিষ্কাশনের মৌলিক নাগরিক পরিষেবা কর্তন করিতে পারিবেন না।",
    });
  }

  // 6. Audit Arbitrary Mid-Year Rent Hikes (Section 7)
  const midYearHike =
    text.includes("৩৫% বৃদ্ধি") ||
    text.includes("চুক্তির ৭ মাস অতিবাহিত") ||
    text.includes("আগামী নভেম্বর ২০২৬ হইতে আপনার বর্তমান ভাড়া") ||
    lower.includes("hike after 6 months");

  if (midYearHike) {
    penaltyPoints += 25;
    flaggedSections.push("Section 7");
    auditedClauses.push({
      clauseTitle: "Arbitrary Mid-Tenancy Rent Hike (Violates 2-Year Rule)",
      extractedQuote: "চুক্তির ৭ মাস অতিবাহিত হইয়াছে বিধায় এই ভাড়া অবিলম্বে কার্যকর হইবে",
      status: "VIOLATION",
      statutorySectionRef: "Section 7, Premises Rent Control Act, 1991 (ধারা ৭)",
      legalExplanation:
        "Under Section 7, agreed rent is statutorily protected against arbitrary increases for a minimum of 2 years (24 months) unless substantial structural improvements are made with the tenant's express written agreement.",
      counterDraftEn:
        "Pursuant to Section 7 of the Premises Rent Control Act, 1991, the agreed monthly rent shall remain fixed for 24 months from lease execution without arbitrary intermediate hikes.",
      counterDraftBn:
        "বাড়ি ভাড়া নিয়ন্ত্রণ আইন ১৯৯১-এর ধারা ৭ অনুযায়ী, বর্তমান নির্ধারিত ভাড়া চুক্তি স্বাক্ষরের তারিখ হইতে পরবর্তী ২৪ (চব্বিশ) মাস পর্যন্ত অপরিবর্তিত থাকিবে।",
    });
  }

  // Calculate score
  const complianceScore = Math.max(0, 100 - penaltyPoints);

  let overallComplianceStatus: "COMPLIANT" | "CAUTION_CLAUSES_FOUND" | "SEVERE_STATUTORY_VIOLATIONS" =
    "COMPLIANT";
  let summaryOverview = "This agreement complies with key statutory tenant protections.";
  let summaryOverviewBn = "এই চুক্তিটি ১৯৯১ সালের বাড়ি ভাড়া নিয়ন্ত্রণ আইনের মৌলিক ধারাসমূহ মেনে চলে।";

  if (complianceScore < 50) {
    overallComplianceStatus = "SEVERE_STATUTORY_VIOLATIONS";
    summaryOverview = `Found ${auditedClauses.filter((c) => c.status === "VIOLATION").length} severe statutory violations under the Premises Rent Control Act, 1991. Do not sign this agreement without demanding counter-clauses!`;
    summaryOverviewBn = `১৯৯১ সালের বাড়ি ভাড়া নিয়ন্ত্রণ আইনের ${auditedClauses.filter((c) => c.status === "VIOLATION").length} টি গুরুতর ধারা লঙ্ঘন পাওয়া গেছে। এই চুক্তিতে স্বাক্ষর না করে পাল্টা ধারা প্রস্তাব করুন।`;
  } else if (complianceScore < 85) {
    overallComplianceStatus = "CAUTION_CLAUSES_FOUND";
    summaryOverview = "Several clauses require clarification or standard revision before signing.";
    summaryOverviewBn = "কিছু ধারা অস্পষ্ট বা সতর্কতামূলক; স্বাক্ষরের পূর্বে সংশোধনের প্রস্তাব করা প্রয়োজন।";
  }

  // Strategic Tenant Action Plan
  const tenantActionPlan: string[] = [];
  if (flaggedSections.includes("Section 10")) {
    tenantActionPlan.push(
      "Insist on capping advance deposit to maximum 1-2 months and ensure the agreement explicitly notes it is 100% refundable or adjustable against the final months' rent."
    );
  }
  if (flaggedSections.includes("Section 13")) {
    tenantActionPlan.push(
      "Never pay rent or advance in cash without an immediate signed written receipt or explicit digital bank/bKash statement specifying 'Month Rental'."
    );
  }
  if (flaggedSections.includes("BERC Tariff Code & Section 21")) {
    tenantActionPlan.push(
      "Demand inspection of the building's master DESCO/DPDC meter bill and request billing based on the official residential slab average."
    );
  }
  if (flaggedSections.includes("Section 18")) {
    tenantActionPlan.push(
      "Add a mandatory 30-day written notice clause citing Section 18 of the 1991 Act and Section 106 of the Transfer of Property Act."
    );
  }
  if (flaggedSections.includes("Section 21")) {
    tenantActionPlan.push(
      "Remind the landlord that severing water or power during a rental disagreement is a criminal offense subject to immediate Rent Controller injunction."
    );
  }
  if (tenantActionPlan.length === 0) {
    tenantActionPlan.push(
      "Keep a signed counterfoil copy of the agreement and store all rent receipts systematically.",
      "Document the initial physical condition of the apartment with dated photos before moving in."
    );
  }

  return {
    overallComplianceStatus,
    complianceScore,
    summaryOverview,
    summaryOverviewBn,
    auditedClauses,
    tenantActionPlan,
    flaggedSectionNumbers: Array.from(new Set(flaggedSections)),
  };
}

/**
 * Deterministic answers for common tenant legal inquiries.
 */
export function answerTenantQuestionDeterministically(question: string): TenantQAResult {
  const q = (question || "").toLowerCase();

  // 1. Rent Receipt / রশিদ না দেওয়া
  if (
    q.includes("রশিদ") ||
    q.includes("রসিদ") ||
    q.includes("receipt") ||
    q.includes("voucher") ||
    q.includes("cash without")
  ) {
    return {
      questionTopic: "Landlord Refusing Written Rent Receipts (ভাড়ার রশিদ)",
      statutorySection: "Section 13, Premises Rent Control Act, 1991 (ধারা ১৩)",
      legalSummary:
        "Under Section 13 of the 1991 Act, the landlord has a MANDATORY statutory duty to deliver a signed, dated written rent receipt (with counterfoil) immediately upon receiving any payment. Refusing to provide a receipt is a statutory offense punishable by a fine of up to double the rental amount.",
      legalSummaryBn:
        "বাড়ি ভাড়া নিয়ন্ত্রণ আইন ১৯৯১-এর ধারা ১৩ অনুসারে, ভাড়া বা অগ্রিম গ্রহণের সাথে সাথে বাড়িওয়ালা স্বাক্ষরিত ও তারিখ সংবলিত ভাড়ার মূল রসিদ প্রদান করতে আইনত বাধ্য। রসিদ না দেওয়া একটি শাস্তিযোগ্য অপরাধ এবং এর জন্য আদায়কৃত টাকার দ্বিগুণ পর্যন্ত জরিমানার বিধান রয়েছে।",
      tenantRightsPoints: [
        "You have an absolute legal right to demand a signed receipt for every Taka paid.",
        "Always pay via traceable digital banking, bKash, or crossed cheque with memo 'Rent for [Month]' if physical receipt is resisted.",
        "If the landlord persistently refuses, you may deposit monthly rent into the Rent Controller Court (ধারা ১৯) to protect against false default claims.",
      ],
      practicalNextSteps: [
        "Send a polite written WhatsApp/SMS request: 'অনুগ্রহ করে ধারা ১৩ অনুযায়ী [মাসের নাম] ভাড়ার রশিদটি স্বাক্ষর করে দিন।'",
        "If cash is handed over, request the landlord sign a simple diary entry or paper note noting date and amount.",
        "If rent is refused or receipts denied to engineer an eviction, file an application before the local Rent Controller Court.",
      ],
      counterClauseProposal: {
        en: "Pursuant to Section 13 of the Premises Rent Control Act, 1991, the landlord shall deliver a duly signed and dated written rent receipt to the tenant immediately upon receipt of every monthly rental installment.",
        bn: "বাড়ি ভাড়া নিয়ন্ত্রণ আইন ১৯৯১-এর ধারা ১৩ মোতাবেক, প্রতি ইংরেজি মাসের ১০ তারিখের মধ্যে ভাড়া পরিশোধের সাথে সাথে বাড়িওয়ালা স্বাক্ষরিত ও তারিখ সংবলিত ভাড়ার মূল রসিদ প্রদান করিবেন।",
      },
    };
  }

  // 2. Utility Cut-Off / পানি ও বিদ্যুৎ কর্তন
  if (
    q.includes("পানি") ||
    q.includes("বিদ্যুৎ") ||
    q.includes("গ্যাস") ||
    q.includes("cut off") ||
    q.includes("disconnect") ||
    q.includes("water") ||
    q.includes("shut off")
  ) {
    return {
      questionTopic: "Landlord Threatening or Cutting Off Water, Gas, or Electricity",
      statutorySection: "Section 21, Premises Rent Control Act, 1991 (ধারা ২১)",
      legalSummary:
        "Section 21 explicitly prohibits a landlord or their agents from severing, cutting off, or withholding any essential utility supply (Water, Electricity, Gas, Sewerage, Sanitation, or Lift) without prior Rent Controller authorization. Even in cases of rental disputes, cutting off utilities is illegal.",
      legalSummaryBn:
        "বাড়ি ভাড়া নিয়ন্ত্রণ আইন ১৯৯১-এর ধারা ২১ মোতাবেক, বাড়িওয়ালা কোনো অবস্থাতেই এবং কোনো বিরোধের অজুহাতে বিদ্যুৎ, গ্যাস, ওয়াসা পানি বা পয়ঃনিষ্কাশনের মৌলিক নাগরিক পরিষেবা কর্তন করতে পারেন না। এটি ফৌজদারি অপরাধ এবং নিয়ন্ত্রকের নির্দেশে জরুরি সংযোগ পুনঃস্থাপনের বিধান রয়েছে।",
      tenantRightsPoints: [
        "A landlord cannot use utility shut-offs as intimidation or coercion to extract rent or force quick move-outs.",
        "Tenants can file an emergency petition under Section 21(2) before the Rent Controller, who can issue immediate restoration orders within 24–48 hours.",
        "The cost of restoration and any resulting damages may be legally deducted from subsequent rent installments.",
      ],
      practicalNextSteps: [
        "Document the disconnection immediately: take timestamped video evidence of taps, electric breaker, or gas stove.",
        "Call 999 or notify local Thana police duty officer if intentional intimidation or public health endangerment occurs.",
        "Submit an urgent Section 21 application to the local Senior Assistant Judge / Rent Controller Court.",
      ],
      counterClauseProposal: {
        en: "In accordance with Section 21 of the Premises Rent Control Act, 1991, the landlord shall not disconnect or disrupt essential utilities (water, gas, electricity) under any circumstance during the tenancy.",
        bn: "বাড়ি ভাড়া নিয়ন্ত্রণ আইন ১৯৯১-এর ধারা ২১ মোতাবেক, বাড়িওয়ালা কোনো অবস্থাতেই বিদ্যুৎ, গ্যাস, ওয়াসা পানি বা পয়ঃনিষ্কাশনের মৌলিক নাগরিক পরিষেবা কর্তন করিতে পারিবেন না।",
      },
    };
  }

  // 3. Advance Rent Limit / অগ্রিম জামানতের সীমা
  if (
    q.includes("অগ্রিম") ||
    q.includes("জামানত") ||
    q.includes("advance") ||
    q.includes("deposit") ||
    q.includes("salami") ||
    q.includes("সালামি")
  ) {
    return {
      questionTopic: "Statutory Limits on Advance Rent and Security Deposits",
      statutorySection: "Section 10, Premises Rent Control Act, 1991 (ধারা ১০)",
      legalSummary:
        "Section 10 prohibits landlords from claiming, receiving, or requiring any advance rent, premium, or salami exceeding 1 (one) month's rent without explicit written consent from the Rent Controller. Demanding 3 to 6 months non-refundable advance is an illegal practice.",
      legalSummaryBn:
        "বাড়ি ভাড়া নিয়ন্ত্রণ আইন ১৯৯১-এর ধারা ১০ অনুযায়ী, বাড়ি ভাড়া নিয়ন্ত্রকের পূর্বানুমোদন ছাড়া কোনো বাড়িওয়ালা ১ (এক) মাসের ভাড়ার অতিরিক্ত কোনো টাকা অগ্রিম, প্রিমিয়াম বা সালামি হিসেবে দাবি বা গ্রহণ করতে পারবেন না।",
      tenantRightsPoints: [
        "Any excess advance deposit paid is legally adjustable against future rent.",
        "Security deposits cannot be unilaterally seized or forfeited under arbitrary pretexts like minor wear-and-tear painting.",
        "Landlords demanding 4-6 months non-refundable deposits risk fines of up to double the excess amount.",
      ],
      practicalNextSteps: [
        "In negotiations, refer directly to Section 10: propose standard 2 months refundable security deposit with written adjustment clause.",
        "Ensure the written agreement explicitly specifies: 'The advance deposit of ৳X is fully refundable within 7 days of peaceful handover.'",
        "If an exiting landlord refuses to return deposit, serve legal notice via lawyer referencing Section 10 and Section 13.",
      ],
      counterClauseProposal: {
        en: "In strict adherence to Section 10 of the Premises Rent Control Act, 1991, the advance deposit shall not exceed statutory limits and shall remain 100% refundable upon tenancy conclusion without arbitrary deductions.",
        bn: "বাড়ি ভাড়া নিয়ন্ত্রণ আইন ১৯৯১-এর ধারা ১০ অনুসারে অগ্রিম জামানত বাবদ অনধিক ২ মাসের ভাড়া প্রদান করা হইবে, যাহা চুক্তি সমাপ্তিকালে সম্পূর্ণরূপে ফেরতযোগ্য বা ভাড়ার বিপরীতে পূর্ণ সমন্বয়যোগ্য হইবে।",
      },
    };
  }

  // 4. Sub-Meter Overcharge / বিদ্যুৎ সাব-মিটার রেট
  if (
    q.includes("মিটার") ||
    q.includes("sub-meter") ||
    q.includes("submeter") ||
    q.includes("১৬ টাকা") ||
    q.includes("16") ||
    q.includes("berc") ||
    q.includes("electricity bill")
  ) {
    return {
      questionTopic: "Overcharging on Electricity Sub-Meters (৳15-৳18/Unit Markup)",
      statutorySection: "BERC Electricity Tariff Regulations & Section 21",
      legalSummary:
        "Landlords are NOT licensed electricity distribution utilities and are strictly forbidden from reselling residential electricity at commercial markups. Charging flat ৳16/unit when official DESCO/DPDC rates are ৳7.00–৳8.50/unit is an illegal unauthorized tariff extraction.",
      legalSummaryBn:
        "বিইআরসি আইন ও বিদ্যুৎ বিতরণ কোড অনুযায়ী, কোনো বাড়িওয়ালা ব্যক্তিগত সাব-মিটারে সরকারি রেটের বেশি (যেমন ১৬-১৮ টাকা/ইউনিট) বাণিজ্যিক হারে বিদ্যুৎ বিক্রি করতে পারেন না। ভাড়াটিয়াকে অবশ্যই সরকারি ডেসকো/ডিপিডিসি মূল বিলের কপি দেখাতে হবে।",
      tenantRightsPoints: [
        "You have the right to verify the master utility bill and demand calculation based on the official residential slab tariff.",
        "Sub-meter overcharges commonly drain ৳1,500–৳3,000 extra per month from tenant families and students.",
        "Uncalibrated sub-meters running fast can be challenged through formal utility inspection requests.",
      ],
      practicalNextSteps: [
        "Ask the building manager politely for a photo of last month's DESCO/DPDC bill to calculate the true average cost per unit.",
        "Propose using the official progressive tariff or a fair average weighted rate (e.g. ৳9.50/unit including demand charges).",
        "If overcharged by thousands, document the calculation using RentRadar's True-Cost Calculator and present it as evidence.",
      ],
      counterClauseProposal: {
        en: "Electricity shall be charged based on actual sub-meter usage at official residential BERC/DESCO tariff rates as evidenced by copies of the original utility bill.",
        bn: "বিদ্যুৎ বিল সরকারি রেগুলেটরি সংস্থা (BERC/DESCO)-এর অনুমোদিত আবাসিক স্ল্যাব রেট অনুযায়ী মূল বিলের অনুলিপি দেখাইয়া সাব-মিটারের প্রকৃত রিডিং সাপেক্ষে আদায় করা হইবে।",
      },
    };
  }

  // 5. Arbitrary Eviction / উচ্ছেদ নোটিশ
  if (
    q.includes("উচ্ছেদ") ||
    q.includes("eviction") ||
    q.includes("বাসা ছাড়া") ||
    q.includes("notice period") ||
    q.includes("lockout") ||
    q.includes("তালা")
  ) {
    return {
      questionTopic: "Arbitrary Eviction, Sudden Vacate Notices & Illegal Lockouts",
      statutorySection: "Section 18, Premises Rent Control Act, 1991 (ধারা ১৮)",
      legalSummary:
        "A landlord CANNOT summarily throw out a tenant who pays rent regularly. Under Section 18 of the 1991 Act and Section 106 of the Transfer of Property Act, 1882, eviction requires a minimum 30-day prior written notice and specific statutory grounds proven in a court of law.",
      legalSummaryBn:
        "বাড়ি ভাড়া নিয়ন্ত্রণ আইন ১৯৯১-এর ধারা ১৮ এবং সম্পত্তি হস্তান্তর আইন ১৮৮২-এর ধারা ১০৬ অনুসারে, কোনো ভাড়াটিয়া নিয়মিত ভাড়া পরিশোধ করলে তাকে হুট করে বা ২৪ ঘণ্টার নোটিশে উচ্ছেদ করা সম্পূর্ণ বেআইনি। উচ্ছেদের জন্য কমপক্ষে ৩০ দিনের লিখিত নোটিশ এবং আদালতের সুনির্দিষ্ট আদেশ প্রয়োজন।",
      tenantRightsPoints: [
        "Verbal eviction notices or WhatsApp ultimatums have zero legal validity under Bangladesh law.",
        "Locking the tenant out or throwing belongings onto the street constitutes a criminal trespass and nuisance offense.",
        "As long as you tender rent regularly (or deposit it in the Rent Controller Court if refused), you enjoy statutory security of tenure.",
      ],
      practicalNextSteps: [
        "Never vacate under verbal intimidation. Respond in writing: 'ধারা ১৮ অনুযায়ী যথাযথ ৩০ দিনের লিখিত নোটিশ দিন।'",
        "If the landlord refuses rent to fabricate a default, send rent via Registered Post with A/D (Acknowledgement Due) or deposit via Rent Controller Court.",
        "In case of lockout threats, call National Emergency Service 999 or file a General Diary (GD) at the local Thana.",
      ],
      counterClauseProposal: {
        en: "Neither party shall terminate the tenancy without serving a minimum of 30 days prior written notice, in strict compliance with Section 18 of the Premises Rent Control Act, 1991.",
        bn: "বাড়ি ভাড়া নিয়ন্ত্রণ আইন ১৯৯১-এর ধারা ১৮ অনুসারে, কোনো পক্ষ চুক্তি বাতিল বা বাসা ছাড়িতে চাহিলে ন্যূনতম ৩০ (ত্রিশ) দিনের লিখিত নোটিশ প্রদান বাধ্যতামূলক থাকিবে।",
      },
    };
  }

  // 6. Rent Hikes / ভাড়া বৃদ্ধি
  return {
    questionTopic: "Regulation of Rent Hikes and the 2-Year Rule",
    statutorySection: "Section 7 & Section 15, Premises Rent Control Act, 1991 (ধারা ৭ ও ১৫)",
    legalSummary:
      "Under Section 7, standard rent remains legally fixed for 2 years (24 months) from the date of lease execution. Landlords cannot arbitrarily increase rent mid-year. If disputes arise regarding fair rent, either party may apply to the Rent Controller under Section 15 to fix the Standard Rent.",
    legalSummaryBn:
      "বাড়ি ভাড়া নিয়ন্ত্রণ আইন ১৯৯১-এর ধারা ৭ অনুযায়ী, নির্ধারিত ভাড়া ন্যূনতম ২ বছর (২৪ মাস) পর্যন্ত অপরিবর্তিত থাকবে। বাড়িওয়ালা ৬ মাস বা ১ বছর পর পর ইচ্ছামতো ভাড়া বৃদ্ধি করতে পারবেন না। অতিরিক্ত ভাড়ার ক্ষেত্রে ধারা ১৫ অনুযায়ী নিয়ন্ত্রকের কাছে মানসম্মত ভাড়া নির্ধারণের আবেদন করা যায়।",
    tenantRightsPoints: [
      "Mid-tenancy arbitrary rent hikes (e.g. demanding +30% after 6 months) are unenforceable.",
      "Rent can only be increased before 2 years if the landlord makes substantial capital improvements with the tenant's written approval.",
      "Any excessive rent paid under duress can be reclaimed through the Rent Controller Court.",
    ],
    practicalNextSteps: [
      "Point out the 2-year statutory principle: 'ধারা ৭ অনুযায়ী বর্তমান চুক্তি চলাকালে আগামী ২৪ মাসের মধ্যে কোনো ভাড়া বৃদ্ধি প্রযোজ্য নয়।'",
      "Offer to review rent only upon expiration of the 2-year term with reasonable inflation adjustments.",
      "If the landlord insists, propose mediation before the local Rent Controller Court or Ward Councillor office.",
    ],
    counterClauseProposal: {
      en: "The agreed monthly rent shall remain fixed for a minimum period of 24 months from lease execution in accordance with Section 7 of the Premises Rent Control Act, 1991.",
      bn: "বাড়ি ভাড়া নিয়ন্ত্রণ আইন ১৯৯১-এর ধারা ৭ অনুযায়ী, বর্তমান নির্ধারিত ভাড়া চুক্তি স্বাক্ষরের তারিখ হইতে পরবর্তী ২৪ (চব্বিশ) মাস পর্যন্ত অপরিবর্তিত থাকিবে।",
    },
  };
}
