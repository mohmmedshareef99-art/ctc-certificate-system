export interface Course {
  id: string;
  code: string;
  title: { es: string; en: string };
  category: 'first-aid' | 'firefighting' | 'security' | 'survival' | 'advanced';
  categoryLabel: { es: string; en: string };
  durationHours: number;
  durationDays: string;
  stcwRef: string;
  ampApproved: boolean;
  description: { es: string; en: string };
  prerequisites: { es: string; en: string };
  icon: string;
  image: string;
}

export const COURSES_DATA: Course[] = [
  {
    id: 'stcw-bst-01',
    code: 'STCW VI/1-1',
    title: {
      es: 'Técnicas de Supervivencia Personal en el Mar',
      en: 'Personal Survival Techniques at Sea'
    },
    category: 'survival',
    categoryLabel: { es: 'Supervivencia Marítima', en: 'Maritime Survival' },
    durationHours: 16,
    durationDays: '2 Días / Days',
    stcwRef: 'Sección A-VI/1-1',
    ampApproved: true,
    description: {
      es: 'Entrenamiento teórico-práctico en abandono de buque, uso de chalecos salvavidas, balsas salvavidas inflables, botes de rescate y pirotecnia de emergencia.',
      en: 'Theoretical and practical training in ship abandonment, lifejacket use, inflatable liferafts, rescue boats, and emergency pyrotechnics.'
    },
    prerequisites: {
      es: 'Mayor de 18 años, examen médico de aptitud física para embarque.',
      en: '18+ years old, medical fitness certificate for seafarers.'
    },
    icon: 'Anchor',
    image: '/courses/stcw-survival.png'
  },
  {
    id: 'stcw-bff-02',
    code: 'STCW VI/1-2',
    title: {
      es: 'Prevención y Lucha Contra Incendios (Básico)',
      en: 'Basic Fire Prevention and Firefighting'
    },
    category: 'firefighting',
    categoryLabel: { es: 'Lucha Contra Incendios', en: 'Firefighting' },
    durationHours: 20,
    durationDays: '2.5 Días / Days',
    stcwRef: 'Sección A-VI/1-2',
    ampApproved: true,
    description: {
      es: 'Tácticas de extinción de incendios a bordo, manejo de equipos de respiración autónoma (ERA), extintores portátiles y mangueras en campo de fuego simulado.',
      en: 'Onboard firefighting tactics, SCBA breathing apparatus operation, portable extinguishers, and hose lines in live fire simulation field.'
    },
    prerequisites: {
      es: 'Aptitud física y médica para realizar esfuerzos intensos.',
      en: 'Physical and medical fitness for high-intensity exercises.'
    },
    icon: 'Flame',
    image: '/courses/stcw-firefighting.png'
  },
  {
    id: 'stcw-fa-03',
    code: 'STCW VI/1-3',
    title: {
      es: 'Primeros Auxilios Elementales',
      en: 'Elementary First Aid'
    },
    category: 'first-aid',
    categoryLabel: { es: 'Primeros Auxilios', en: 'First Aid & Medical' },
    durationHours: 16,
    durationDays: '2 Días / Days',
    stcwRef: 'Sección A-VI/1-3',
    ampApproved: true,
    description: {
      es: 'Atención primaria de emergencia a bordo, reanimación cardiopulmonar (RCP), inmovilización de fracturas, control de hemorragias y rescate de heridos.',
      en: 'Primary emergency care onboard, CPR, fracture immobilization, hemorrhage control, and casualty transport.'
    },
    prerequisites: {
      es: 'Ninguno. Abierto a tripulación y oficiales.',
      en: 'None. Open to crew members and officers.'
    },
    icon: 'HeartPulse',
    image: '/courses/stcw-firstaid.png'
  },
  {
    id: 'stcw-pssr-04',
    code: 'STCW VI/1-4',
    title: {
      es: 'Seguridad Personal y Responsabilidades Sociales',
      en: 'Personal Safety and Social Responsibilities (PSSR)'
    },
    category: 'survival',
    categoryLabel: { es: 'Supervivencia Marítima', en: 'Maritime Survival' },
    durationHours: 12,
    durationDays: '1.5 Días / Days',
    stcwRef: 'Sección A-VI/1-4',
    ampApproved: true,
    description: {
      es: 'Comprensión de normas de seguridad laboral, prevención de la contaminación marina, relaciones laborales en el mar y trabajo en equipo.',
      en: 'Understanding occupational safety standards, marine pollution prevention, human relations at sea, and teamwork.'
    },
    prerequisites: {
      es: 'Ninguno.',
      en: 'None.'
    },
    icon: 'ShieldCheck',
    image: '/courses/stcw-pssr.png'
  },
  {
    id: 'stcw-aff-05',
    code: 'STCW VI/3',
    title: {
      es: 'Avanzado en Lucha Contra Incendios',
      en: 'Advanced Firefighting'
    },
    category: 'firefighting',
    categoryLabel: { es: 'Lucha Contra Incendios', en: 'Firefighting' },
    durationHours: 32,
    durationDays: '4 Días / Days',
    stcwRef: 'Sección A-VI/3',
    ampApproved: true,
    description: {
      es: 'Comando y control de operaciones de extinción de incendios a bordo, organización de cuadrillas de ataque, inspección de sistemas fijos de CO2/espuma y análisis de riesgos.',
      en: 'Command and control of onboard firefighting operations, squad organization, inspection of fixed CO2/foam systems, and risk analysis.'
    },
    prerequisites: {
      es: 'Certificado de Lucha Contra Incendios Básico (STCW VI/1-2).',
      en: 'Basic Firefighting Certificate (STCW VI/1-2).'
    },
    icon: 'Flame',
    image: '/courses/stcw-advanced-fire.png'
  },
  {
    id: 'stcw-med-06',
    code: 'STCW VI/4-1',
    title: {
      es: 'Primeros Auxilios Médicos a Bordo',
      en: 'Medical First Aid On Board'
    },
    category: 'first-aid',
    categoryLabel: { es: 'Primeros Auxilios', en: 'First Aid & Medical' },
    durationHours: 28,
    durationDays: '3.5 Días / Days',
    stcwRef: 'Sección A-VI/4-1',
    ampApproved: true,
    description: {
      es: 'Aplicación de medicina de urgencia, consulta médica por radio (TMAS), administración de medicamentos del botiquín reglamentario e suturas de emergencia.',
      en: 'Emergency medical care, Telemedical Maritime Assistance Service (TMAS), medicine chest management, and emergency suturing.'
    },
    prerequisites: {
      es: 'Primeros Auxilios Elementales (STCW VI/1-3).',
      en: 'Elementary First Aid (STCW VI/1-3).'
    },
    icon: 'Stethoscope',
    image: '/courses/stcw-medical.png'
  },
  {
    id: 'stcw-sso-07',
    code: 'STCW VI/5',
    title: {
      es: 'Oficial de Protección del Buque (OPB / SSO)',
      en: 'Ship Security Officer (SSO)'
    },
    category: 'security',
    categoryLabel: { es: 'Protección Marítima', en: 'Maritime Security' },
    durationHours: 24,
    durationDays: '3 Días / Days',
    stcwRef: 'Sección A-VI/5 (Código PBIP / ISPS)',
    ampApproved: true,
    description: {
      es: 'Formación para oficiales a cargo de la seguridad del buque, evaluación de riesgos de piratería, planes de protección del buque (PPB) e inspección de equipos de seguridad.',
      en: 'Training for ship security officers, anti-piracy risk assessments, Ship Security Plans (SSP), and security equipment inspections.'
    },
    prerequisites: {
      es: 'Mínimo 12 meses de tiempo de embarque como oficial o marinero cualificado.',
      en: 'Minimum 12 months sea service as officer or qualified rating.'
    },
    icon: 'Lock',
    image: '/courses/stcw-sso.png'
  },
  {
    id: 'stcw-dsd-08',
    code: 'STCW VI/6-2',
    title: {
      es: 'Formación en Protección con Deberes Específicos (DSD)',
      en: 'Designated Security Duties (DSD)'
    },
    category: 'security',
    categoryLabel: { es: 'Protección Marítima', en: 'Maritime Security' },
    durationHours: 16,
    durationDays: '2 Días / Days',
    stcwRef: 'Sección A-VI/6-2',
    ampApproved: true,
    description: {
      es: 'Capacitación para marinos designados para tareas específicas de guardia y protección según el Código Internacional para la Protección de los Buques y de las Instalaciones Portuarias (PBIP).',
      en: 'Training for seafarers with designated security duties under the International Ship and Port Facility Security (ISPS) Code.'
    },
    prerequisites: {
      es: 'Conocimiento general de operaciones a bordo.',
      en: 'General onboard operations knowledge.'
    },
    icon: 'ShieldCheck',
    image: '/courses/stcw-dsd.png'
  },
  {
    id: 'stcw-pscrb-09',
    code: 'STCW VI/2-1',
    title: {
      es: 'Embarcaciones de Supervivencia y Botes de Rescate',
      en: 'Proficiency in Survival Craft and Rescue Boats (PSCRB)'
    },
    category: 'survival',
    categoryLabel: { es: 'Supervivencia Marítima', en: 'Maritime Survival' },
    durationHours: 32,
    durationDays: '4 Días / Days',
    stcwRef: 'Sección A-VI/2-1',
    ampApproved: true,
    description: {
      es: 'Operación, arriado y recuperación de botes salvavidas cerrados, botes de rescate rápidos, maniobras de motores fuera de borda y rescate de náufragos.',
      en: 'Operation, launching, and recovery of totally enclosed lifeboats, fast rescue boats, outboard engine handling, and survivor recovery.'
    },
    prerequisites: {
      es: 'STCW VI/1 (Formación Básica de Seguridad) + 6 meses de embarque.',
      en: 'STCW VI/1 (Basic Safety Training) + 6 months sea service.'
    },
    icon: 'Anchor',
    image: '/courses/stcw-pscrb.png'
  },
  {
    id: 'stcw-brm-10',
    code: 'STCW II/1 - III/1',
    title: {
      es: 'Gestión de Recursos en el Puente y Máquinas (BRM / ERM)',
      en: 'Bridge & Engine Room Resource Management (BRM/ERM)'
    },
    category: 'advanced',
    categoryLabel: { es: 'Cursos Avanzados', en: 'Advanced Courses' },
    durationHours: 40,
    durationDays: '5 Días / Days',
    stcwRef: 'Sección A-II/1 & A-III/1',
    ampApproved: true,
    description: {
      es: 'Capacitación en simulador para oficiales náuticos y de máquinas. Enfoque en liderazgo, toma de decisiones en crisis, fatiga, comunicación efectiva y navegación segura.',
      en: 'Simulator training for deck and engine officers focusing on leadership, crisis decision making, fatigue management, and safe navigation.'
    },
    prerequisites: {
      es: 'Oficial de cubierta o máquinas / Cadete graduado.',
      en: 'Deck or Engine Officer / Graduated Cadet.'
    },
    icon: 'Compass',
    image: '/courses/stcw-brm.png'
  }
];

export interface SampleCertificate {
  certificateNo: string;
  hash: string;
  seafarerName: string;
  passportId: string;
  seamanBookNo: string;
  nationality: string;
  courseCode: string;
  courseTitle: string;
  issueDate: string;
  expiryDate: string;
  ampResolutionNo: string;
  status: 'Valid' | 'Expired' | 'Pending Renewal';
}

export const SAMPLE_CERTIFICATES: SampleCertificate[] = [
  {
    certificateNo: 'CTC-AMP-2025-08492',
    hash: 'a7b8c9d0e1f234567890abcdef123456',
    seafarerName: 'CARLOS EDURADO BENÍTEZ ACOSTA',
    passportId: 'PA-84920194',
    seamanBookNo: 'AMP-SB-49201',
    nationality: 'Panama (PA)',
    courseCode: 'STCW VI/1-2',
    courseTitle: 'Prevención y Lucha Contra Incendios (Basic Firefighting)',
    issueDate: '2024-03-15',
    expiryDate: '2029-03-14',
    ampResolutionNo: 'AMP-DGGM-RES-2023-4819',
    status: 'Valid'
  },
  {
    certificateNo: 'CTC-AMP-2025-11029',
    hash: 'f9e8d7c6b5a432109876fedcba654321',
    seafarerName: 'MARÍA FERNANDA ROJAS MORALES',
    passportId: 'PA-92810482',
    seamanBookNo: 'AMP-SB-92810',
    nationality: 'Panama (PA)',
    courseCode: 'STCW VI/5',
    courseTitle: 'Oficial de Protección del Buque (Ship Security Officer - SSO)',
    issueDate: '2024-06-10',
    expiryDate: '2029-06-09',
    ampResolutionNo: 'AMP-DGGM-RES-2023-4819',
    status: 'Valid'
  },
  {
    certificateNo: 'CTC-AMP-2024-03194',
    hash: '1234567890abcdef1234567890abcdef',
    seafarerName: 'JOHNATHAN ARTHUR SMITH',
    passportId: 'US-93821094',
    seamanBookNo: 'US-SB-84920',
    nationality: 'United States (US)',
    courseCode: 'STCW VI/2-1',
    courseTitle: 'Embarcaciones de Supervivencia y Botes de Rescate (PSCRB)',
    issueDate: '2022-01-20',
    expiryDate: '2027-01-19',
    ampResolutionNo: 'AMP-DGGM-RES-2023-4819',
    status: 'Valid'
  }
];
