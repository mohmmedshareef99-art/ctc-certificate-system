'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en';

export const dictionary = {
  navHome: { es: 'Home', en: 'Home' },
  navAbout: { es: 'Who We Are', en: 'Who We Are' },
  navCourses: { es: 'Courses', en: 'Courses' },
  navVerify: { es: 'Verification', en: 'Verification' },
  navAMP: { es: 'Maritime Authority', en: 'Maritime Authority' },
  navContact: { es: 'Contact Us', en: 'Contact Us' },
  
  heroTag: { es: 'Accredited by the Maritime Authority of Panama (AMP)', en: 'Accredited by the Maritime Authority of Panama (AMP)' },
  heroTitle: { es: 'International Maritime Training Center', en: 'International Maritime Training Center' },
  heroSub: { es: 'Certified STCW courses, official seafarer endorsements, and instant digital certificate verification.', en: 'Certified STCW courses, official seafarer endorsements, and instant digital certificate verification.' },
  
  searchPlaceholder: { es: 'Enter Certificate No. / Hash / ID / Passport...', en: 'Enter Certificate No. / Hash / ID / Passport...' },
  verifyButton: { es: 'Verify Now', en: 'Verify Now' },
  
  ampBadgeTitle: { es: 'Official AMP Accreditation', en: 'Official AMP Accreditation' },
  ampBadgeDesc: { es: 'Approved under STCW 78/95 with Manila Amendments and ISO 9001:2015 Certification.', en: 'Approved under STCW 78/95 with Manila Amendments and ISO 9001:2015 Certification.' },

  featuredCourses: { es: 'Featured STCW Courses', en: 'Featured STCW Courses' },
  featuredSub: { es: 'Professional training for seafarers with international certification recognized by AMP.', en: 'Professional training for seafarers with international certification recognized by AMP.' },

  catAll: { es: 'All Courses', en: 'All Courses' },
  catBasic: { es: 'First Aid & Survival', en: 'First Aid & Survival' },
  catFire: { es: 'Firefighting', en: 'Firefighting' },
  catSecurity: { es: 'Maritime Security', en: 'Maritime Security' },
  catAdvanced: { es: 'Advanced Courses', en: 'Advanced Courses' },

  viewAllCourses: { es: 'View All Courses', en: 'View All Courses' },
  duration: { es: 'Duration', en: 'Duration' },
  hours: { es: 'hours', en: 'hours' },
  code: { es: 'STCW Code', en: 'STCW Code' },
  details: { es: 'View Details', en: 'View Details' },

  contactHeader: { es: 'Contact & Location', en: 'Contact & Location' },
  contactSub: { es: 'Visit our offices in Panama or get in touch with our support team.', en: 'Visit our offices in Panama or get in touch with our support team.' },
  phone: { es: 'Phone', en: 'Phone' },
  email: { es: 'Email', en: 'Email' },
  location: { es: 'Location', en: 'Location' },
  panamaAddress: { es: 'Panama City, Republic of Panama. Canal Area / Bella Vista.', en: 'Panama City, Republic of Panama. Canal Area / Bella Vista.' },
  workingHours: { es: 'Working Hours', en: 'Working Hours' },
  hoursVal: { es: 'Mon to Fri: 8:00 AM - 5:00 PM | Saturday: 8:00 AM - 12:00 PM', en: 'Mon to Fri: 8:00 AM - 5:00 PM | Saturday: 8:00 AM - 12:00 PM' },

  nameLabel: { es: 'Full Name', en: 'Full Name' },
  emailLabel: { es: 'Email Address', en: 'Email Address' },
  subjectLabel: { es: 'Subject', en: 'Subject' },
  messageLabel: { es: 'Message', en: 'Message' },
  sendButton: { es: 'Send Message', en: 'Send Message' },
  msgSent: { es: 'Message sent successfully! We will get in touch shortly.', en: 'Message sent successfully! We will get in touch shortly.' },

  footerRights: { es: 'All rights reserved.', en: 'All rights reserved.' },
  footerAccreditation: { es: 'Training Center Authorized by the Maritime Authority of Panama.', en: 'Training Center Authorized by the Maritime Authority of Panama.' }
};

interface LanguageContextType {
  lang: 'en';
  toggleLanguage: () => void;
  setLanguage: (lang: 'en') => void;
  t: (key: keyof typeof dictionary) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const lang = 'en';

  const toggleLanguage = () => {
    // English only mode enabled - language toggle disabled
  };

  const setLanguage = () => {
    // English only mode enabled
  };

  const t = (key: keyof typeof dictionary): string => {
    if (dictionary[key]) {
      return dictionary[key].en;
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ lang: 'en', toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
