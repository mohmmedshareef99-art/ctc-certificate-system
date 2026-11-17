'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Users,
  BookOpen,
  FileCheck2,
  Search,
  Plus,
  QrCode as QrIcon,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  UserPlus,
  BookPlus,
  Printer,
  RefreshCw,
  LogOut,
  UserCheck,
  User,
  Sparkles,
  Copy,
  Check,
  Award,
  FileText,
  Download,
  X,
  Share2,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Power,
  Wand2,
  Eye
} from 'lucide-react';
import {
  getCandidates,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  getCourses,
  createCourse,
  updateCourse,
  toggleCourseStatus,
  deleteCourse,
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  createCandidateAndCertificate,
  updateCertificateStatus,
  Candidate,
  CourseRecord,
  CertificateRecord,
  CertificateStatus
} from '@/lib/certificateManager';
import { generateQRCodeDataURL, downloadQRCodePNG } from '@/lib/qrcode';
import { downloadCertificatePDF } from '@/lib/pdfExport';
import OfficialCertificatePDF from '@/components/OfficialCertificatePDF';
import AdminLoginForm from '@/components/AdminLoginForm';
import { getAdminSession, fetchAdminSession, logoutAdmin, AdminUser } from '@/lib/adminAuthManager';

export default function AdminPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<'quick_add' | 'candidates' | 'courses' | 'issuer' | 'directory'>('quick_add');

  // State collections
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Candidate Registration Form State
  const [candName, setCandName] = useState('');
  const [candPassport, setCandPassport] = useState('');
  const [candIdentityNumber, setCandIdentityNumber] = useState('');
  const [candSeamanBook, setCandSeamanBook] = useState('');
  const [candRankPosition, setCandRankPosition] = useState('');
  const [candNationality, setCandNationality] = useState('');
  const [candDob, setCandDob] = useState('');
  const [candPlaceOfBirth, setCandPlaceOfBirth] = useState('');
  const [candGender, setCandGender] = useState('');
  const [candEmail, setCandEmail] = useState('');
  const [candPhone, setCandPhone] = useState('');
  const [candAddress, setCandAddress] = useState('');
  const [candEmergencyContact, setCandEmergencyContact] = useState('');
  const [candPhoto, setCandPhoto] = useState('');
  const [isSavingCand, setIsSavingCand] = useState(false);
  const [candError, setCandError] = useState<string | null>(null);

  // Candidate Directory Filter State
  const [candSearch, setCandSearch] = useState('');

  // Edit Candidate Modal State
  const [editingCand, setEditingCand] = useState<Candidate | null>(null);
  const [editCandName, setEditCandName] = useState('');
  const [editCandPassport, setEditCandPassport] = useState('');
  const [editCandIdentityNumber, setEditCandIdentityNumber] = useState('');
  const [editCandSeamanBook, setEditCandSeamanBook] = useState('');
  const [editCandRankPosition, setEditCandRankPosition] = useState('');
  const [editCandNationality, setEditCandNationality] = useState('');
  const [editCandDob, setEditCandDob] = useState('');
  const [editCandPlaceOfBirth, setEditCandPlaceOfBirth] = useState('');
  const [editCandGender, setEditCandGender] = useState('');
  const [editCandEmail, setEditCandEmail] = useState('');
  const [editCandPhone, setEditCandPhone] = useState('');
  const [editCandAddress, setEditCandAddress] = useState('');
  const [editCandEmergencyContact, setEditCandEmergencyContact] = useState('');
  const [editCandPhoto, setEditCandPhoto] = useState('');
  const [isUpdatingCand, setIsUpdatingCand] = useState(false);
  const [editCandError, setEditCandError] = useState<string | null>(null);

  // Delete Candidate Modal State
  const [deletingCand, setDeletingCand] = useState<Candidate | null>(null);
  const [isDeletingCand, setIsDeletingCand] = useState(false);
  const [deleteCandError, setDeleteCandError] = useState<string | null>(null);

  // Course Form & Action State
  const [courseCode, setCourseCode] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState('STCW');
  const [courseDesc, setCourseDesc] = useState('');
  const [isSavingCourse, setIsSavingCourse] = useState(false);

  // Edit Course Modal State
  const [editingCourse, setEditingCourse] = useState<CourseRecord | null>(null);
  const [editCourseCode, setEditCourseCode] = useState('');
  const [editCourseTitle, setEditCourseTitle] = useState('');
  const [editCourseCategory, setEditCourseCategory] = useState('STCW');
  const [editCourseDesc, setEditCourseDesc] = useState('');
  const [isUpdatingCourse, setIsUpdatingCourse] = useState(false);

  // Delete & Toggle Course State
  const [deletingCourse, setDeletingCourse] = useState<CourseRecord | null>(null);
  const [isDeletingCourse, setIsDeletingCourse] = useState(false);
  const [togglingCourseId, setTogglingCourseId] = useState<string | null>(null);

  // Standard Issuer Form State
  const [selectedCandId, setSelectedCandId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [issueDate, setIssueDate] = useState('2026-04-11');
  const [expiryDate, setExpiryDate] = useState('2031-04-10');
  const [isIssuing, setIsIssuing] = useState(false);
  const [issuedCert, setIssuedCert] = useState<CertificateRecord | null>(null);
  const [issuedQr, setIssuedQr] = useState('');

  // Directory Filter State
  const [directorySearch, setDirectorySearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | CertificateStatus>('ALL');

  // Preview Certificate Modal State
  const [previewCert, setPreviewCert] = useState<CertificateRecord | null>(null);

  // Edit Certificate Modal State
  const [editingCert, setEditingCert] = useState<CertificateRecord | null>(null);
  const [editCertName, setEditCertName] = useState('');
  const [editCertPassport, setEditCertPassport] = useState('');
  const [editCertNo, setEditCertNo] = useState('');
  const [editCertCourseId, setEditCertCourseId] = useState('');
  const [editCertSalutation, setEditCertSalutation] = useState('Mr.');
  const [editCertIssueDate, setEditCertIssueDate] = useState('');
  const [editCertExpiryDate, setEditCertExpiryDate] = useState('');
  const [editCertStcw, setEditCertStcw] = useState('');
  const [editCertResolutionNo, setEditCertResolutionNo] = useState('');
  const [editCertResolutionDate, setEditCertResolutionDate] = useState('');
  const [editCertResolutionExpiry, setEditCertResolutionExpiry] = useState('');
  const [editCertStatus, setEditCertStatus] = useState<CertificateStatus>('VALID');
  const [isUpdatingCert, setIsUpdatingCert] = useState(false);

  // Delete Certificate Modal State
  const [deletingCert, setDeletingCert] = useState<CertificateRecord | null>(null);
  const [isDeletingCert, setIsDeletingCert] = useState(false);

  // Comprehensive Quick Add & Certificate Generator State
  const [quickSalutation, setQuickSalutation] = useState('Mr.');
  const [quickCandName, setQuickCandName] = useState('BRIJESH KUMAR KUSHWAHA');
  const [quickCandPassport, setQuickCandPassport] = useState('AB483436');
  const [quickCandPhoto, setQuickCandPhoto] = useState('');
  const [quickCourseId, setQuickCourseId] = useState('');
  const [quickCustomCertNo, setQuickCustomCertNo] = useState('UAG-TC-26-ASE-00417');

  const [quickStcwRegulation, setQuickStcwRegulation] = useState(
    'Regulation III/5, Section A-III/5, Table III/5 of the IMO International Convention on Standards of Training, Certification and Watchkeeping for Seafarers STCW 1978, as amended'
  );
  const [quickResolutionNo, setQuickResolutionNo] = useState('DGGM-CFM-005-2025');
  const [quickResolutionDate, setQuickResolutionDate] = useState('2024-02-06');
  const [quickResolutionExpiry, setQuickResolutionExpiry] = useState('2026-06-12');

  const [quickHeldFrom, setQuickHeldFrom] = useState('2026-03-10');
  const [quickHeldTo, setQuickHeldTo] = useState('2026-04-10');
  const [quickCourseMode, setQuickCourseMode] = useState('Presential');
  const [quickConductedAt, setQuickConductedAt] = useState('AZERBAIJAN');

  const [quickIssueDate, setQuickIssueDate] = useState('2026-04-11');
  const [quickExpiryDate, setQuickExpiryDate] = useState('2031-04-10');
  const [quickValidityText, setQuickValidityText] = useState('(THIS CERTIFICATE IS VALID FOR FIVE (5) YEARS)');
  const [quickRevisionCode, setQuickRevisionCode] = useState('REV. 2/2025');
  const [quickNumericHash, setQuickNumericHash] = useState('35830462448604');

  const [isQuickIssuing, setIsQuickIssuing] = useState(false);
  const [quickIssuedCert, setQuickIssuedCert] = useState<CertificateRecord | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showIssuedModal, setShowIssuedModal] = useState(false);

  // Auto Generator Toast / Feedback state
  const [certNoNotice, setCertNoNotice] = useState<string | null>(null);
  const [resNoNotice, setResNoNotice] = useState<string | null>(null);

  // Helper function to derive course suffix from course record
  const deriveCourseSuffix = (course?: CourseRecord): string => {
    if (!course) return 'ASE';
    const title = course.title || '';
    const code = course.course_code || '';

    // Check if code contains acronym (e.g. ASE from STCW III/5 ASE)
    const codeParts = code.split(/[\s/]+/);
    const alphabeticCodePart = codeParts.find(
      (p) => /^[A-Z]{2,5}$/i.test(p) && p.toUpperCase() !== 'STCW'
    );
    if (alphabeticCodePart) return alphabeticCodePart.toUpperCase();

    // Create acronym from title words
    const stopWords = new Set(['OF', 'AND', 'IN', 'THE', 'FOR', 'WITH', 'BY', 'ON', 'AT', 'TO', 'BASIC', 'ADVANCED', 'STCW']);
    const words = title
      .replace(/[^a-zA-R0-9\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 0 && !stopWords.has(w.toUpperCase()));

    if (words.length >= 2) {
      const initials = words.map((w) => w[0].toUpperCase()).join('');
      if (initials.length >= 2 && initials.length <= 5) return initials;
    } else if (words.length === 1) {
      const single = words[0].toUpperCase();
      if (single.length >= 2) return single.slice(0, 4);
    }

    return 'ASE';
  };

  // Certificate Reference Code Auto-Generator: UAG-TC-[YEAR_YY]-[COURSE_SUFFIX]-[5_DIGIT_SEQ]
  const handleGenerateCertCode = () => {
    const yearYY = new Date().getFullYear().toString().slice(-2);

    const selectedCourseObj = courses.find((c) => c.id === quickCourseId) || courses[0];
    const courseSuffix = deriveCourseSuffix(selectedCourseObj);
    const sequence5Digit = Math.floor(1 + Math.random() * 99999).toString().padStart(5, '0');


    const generatedCode = `UAG-TC-${yearYY}-${courseSuffix}-${sequence5Digit}`;
    setQuickCustomCertNo(generatedCode);
    setCertNoNotice('Generated!');
    setTimeout(() => setCertNoNotice(null), 2500);
  };

  // Resolution No Auto-Generator: DGGM-CFM-[3_DIGIT_SEQ]-[YEAR]
  const handleGenerateResolutionNo = () => {
    const sequence3Digit = Math.floor(1 + Math.random() * 999).toString().padStart(3, '0');
    let resYear = '2024';
    if (quickResolutionDate && !isNaN(new Date(quickResolutionDate).getTime())) {
      resYear = new Date(quickResolutionDate).getFullYear().toString();
    } else {
      resYear = new Date().getFullYear().toString();
    }

    const generatedResNo = `DGGM-CFM-${sequence3Digit}-${resYear}`;
    setQuickResolutionNo(generatedResNo);
    setResNoNotice('Generated!');
    setTimeout(() => setResNoNotice(null), 2500);
  };

  useEffect(() => {
    (async () => {
      const session = await fetchAdminSession();
      if (session) {
        setCurrentUser(session);
        loadAllData();
      } else {
        router.push('/login');
      }
      setCheckingAuth(false);
    })();
  }, []);

  const handleLogout = async () => {
    await logoutAdmin();
    setCurrentUser(null);
    router.push('/login');
    router.refresh();
  };

  const deduplicateCandidates = (list: Candidate[]): Candidate[] => {
    return Array.from(
      new Map(
        list
          .filter(Boolean)
          .map((item) => [item.id || `${item.full_name}-${item.passport_id}`, item])
      ).values()
    );
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [cands, crs, certs] = await Promise.all([
        getCandidates(),
        getCourses(),
        getCertificates()
      ]);
      const uniqueCandidates = Array.from(
        new Map(cands.map((item) => [item.id, item])).values()
      );
      setCandidates(uniqueCandidates);
      setCourses(crs);
      setCertificates(certs);

      if (uniqueCandidates.length > 0) setSelectedCandId(uniqueCandidates[0].id);
      const activeCrs = crs.filter((c) => c.is_active !== false);
      if (activeCrs.length > 0) {
        setSelectedCourseId(activeCrs[0].id);
        setQuickCourseId(activeCrs[0].id);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Construct Live Preview Certificate Object
  const selectedCourseObj = courses.find((c) => c.id === quickCourseId) || courses[0];
  const livePreviewCert: CertificateRecord = {
    id: quickIssuedCert?.id || 'live-preview-cert',
    certificate_number: quickCustomCertNo.trim() || 'UAG-TC-26-ASE-00417',
    candidate_id: 'live-cand',
    course_id: quickCourseId,
    salutation: quickSalutation,
    issue_date: quickIssueDate,
    expiry_date: quickExpiryDate,
    status: 'VALID',
    verification_hash: quickIssuedCert?.verification_hash || '35830462448604a7b8c9d0e1f2345678',
    stcw_regulation: quickStcwRegulation,
    resolution_number: quickResolutionNo,
    resolution_date: quickResolutionDate,
    resolution_expiry: quickResolutionExpiry,
    held_from: quickHeldFrom,
    held_to: quickHeldTo,
    course_mode: quickCourseMode,
    conducted_at: quickConductedAt,
    validity_years_text: quickValidityText,
    revision_code: quickRevisionCode,
    numeric_hash: quickNumericHash,
    candidate: {
      id: 'live-cand',
      full_name: quickCandName || 'BRIJESH KUMAR KUSHWAHA',
      passport_id: quickCandPassport || 'AB483436',
      photo_url: quickCandPhoto
    },
    course: selectedCourseObj || {
      id: 'course-0',
      course_code: 'STCW III/5',
      title: 'ABLE SEAFARER ENGINE',
      category: 'STCW Engine'
    }
  };

  // Handle Unified Candidate Registration & Comprehensive Certificate Generation
  const handleQuickIssueCandidateAndCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCandName.trim() || !quickCandPassport.trim() || !quickCourseId) {
      alert('Please complete Candidate Name, Passport ID, and select a course.');
      return;
    }

    setIsQuickIssuing(true);
    try {
      const { candidate: createdCand, certificate: createdCert } = await createCandidateAndCertificate(
        {
          full_name: quickCandName.trim().toUpperCase(),
          passport_id: quickCandPassport.trim().toUpperCase(),
          photo_url: quickCandPhoto.trim() || undefined
        },
        quickCourseId,
        quickIssueDate,
        quickExpiryDate,
        {
          certificate_number: quickCustomCertNo.trim() || undefined,
          salutation: quickSalutation,
          stcw_regulation: quickStcwRegulation,
          resolution_number: quickResolutionNo,
          resolution_date: quickResolutionDate,
          resolution_expiry: quickResolutionExpiry,
          held_from: quickHeldFrom,
          held_to: quickHeldTo,
          course_mode: quickCourseMode,
          conducted_at: quickConductedAt,
          validity_years_text: quickValidityText,
          revision_code: quickRevisionCode,
          numeric_hash: quickNumericHash
        }
      );

      setCandidates((prev) => deduplicateCandidates([createdCand, ...prev]));
      setCertificates((prev) => [createdCert, ...prev]);
      setQuickIssuedCert(createdCert);
      setIsQuickIssuing(false);
      setShowIssuedModal(true);
    } catch (err: any) {
      console.error('CRITICAL SUPABASE INSERT ERROR:', err);
      alert(`Failed to store certificate: ${err?.message || 'Error generating certificate.'}`);
      setIsQuickIssuing(false);
    } finally {
      setIsQuickIssuing(false);
    }
  };

  // Helper to open candidate form pre-populated from existing candidate list
  const handleSelectCandidateForCert = (cand: Candidate) => {
    setQuickCandName(cand.full_name);
    setQuickCandPassport(cand.passport_id);
    setQuickCandPhoto(cand.photo_url || '');
    setQuickIssuedCert(null);
    setActiveTab('quick_add');
  };

  // Helper to copy verification link to clipboard
  const handleCopyVerificationLink = (hash: string) => {
    if (typeof window === 'undefined') return;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://panama-ctc.com');
    const url = `${baseUrl.replace(/\/$/, '')}/verify/${hash}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Handle Candidate Creation
  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candName.trim() || !candPassport.trim()) return;

    setIsSavingCand(true);
    setCandError(null);
    try {
      const created = await createCandidate({
        full_name: candName.trim(),
        passport_id: candPassport.trim(),
        identity_number: candIdentityNumber.trim(),
        seaman_book_number: candSeamanBook.trim(),
        rank_position: candRankPosition.trim(),
        nationality: candNationality.trim(),
        date_of_birth: candDob,
        place_of_birth: candPlaceOfBirth.trim(),
        gender: candGender.trim(),
        email: candEmail.trim(),
        phone: candPhone.trim(),
        address: candAddress.trim(),
        emergency_contact: candEmergencyContact.trim(),
        photo_url: candPhoto.trim() || undefined
      });
      setCandidates(deduplicateCandidates([created, ...candidates]));
      setCandName('');
      setCandPassport('');
      setCandIdentityNumber('');
      setCandSeamanBook('');
      setCandRankPosition('');
      setCandNationality('');
      setCandDob('');
      setCandPlaceOfBirth('');
      setCandGender('');
      setCandEmail('');
      setCandPhone('');
      setCandAddress('');
      setCandEmergencyContact('');
      setCandPhoto('');
      alert(`Seafarer registered successfully: ${created.full_name}`);
    } catch (err: any) {
      console.error('Error creating candidate:', err);
      setCandError(err?.message || 'Failed to register seafarer.');
    } finally {
      setIsSavingCand(false);
    }
  };

  // Open Edit Candidate Modal
  const handleOpenEditCandidate = (cand: Candidate) => {
    setEditingCand(cand);
    setEditCandName(cand.full_name || '');
    setEditCandPassport(cand.passport_id || '');
    setEditCandIdentityNumber(cand.identity_number || '');
    setEditCandSeamanBook(cand.seaman_book_number || '');
    setEditCandRankPosition(cand.rank_position || '');
    setEditCandNationality(cand.nationality || '');
    setEditCandDob(cand.date_of_birth || '');
    setEditCandPlaceOfBirth(cand.place_of_birth || '');
    setEditCandGender(cand.gender || '');
    setEditCandEmail(cand.email || '');
    setEditCandPhone(cand.phone || '');
    setEditCandAddress(cand.address || '');
    setEditCandEmergencyContact(cand.emergency_contact || '');
    setEditCandPhoto(cand.photo_url || '');
    setEditCandError(null);
  };

  // Save Candidate Edits
  const handleSaveEditCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCand || !editCandName.trim() || !editCandPassport.trim()) return;

    setIsUpdatingCand(true);
    setEditCandError(null);
    try {
      const updated = await updateCandidate(editingCand.id, {
        full_name: editCandName.trim(),
        passport_id: editCandPassport.trim(),
        identity_number: editCandIdentityNumber.trim(),
        seaman_book_number: editCandSeamanBook.trim(),
        rank_position: editCandRankPosition.trim(),
        nationality: editCandNationality.trim(),
        date_of_birth: editCandDob,
        place_of_birth: editCandPlaceOfBirth.trim(),
        gender: editCandGender.trim(),
        email: editCandEmail.trim(),
        phone: editCandPhone.trim(),
        address: editCandAddress.trim(),
        emergency_contact: editCandEmergencyContact.trim(),
        photo_url: editCandPhoto.trim()
      });

      setCandidates(candidates.map((c) => (c.id === editingCand.id ? { ...c, ...updated } : c)));
      setEditingCand(null);
      alert(`Seafarer details updated successfully for ${updated.full_name}`);
    } catch (err: any) {
      console.error('Error updating candidate:', err);
      setEditCandError(err?.message || 'Failed to update candidate details.');
    } finally {
      setIsUpdatingCand(false);
    }
  };

  // Confirm Delete Candidate
  const handleConfirmDeleteCandidate = async () => {
    if (!deletingCand) return;

    setIsDeletingCand(true);
    setDeleteCandError(null);
    try {
      await deleteCandidate(deletingCand.id);
      setCandidates(candidates.filter((c) => c.id !== deletingCand.id));
      setDeletingCand(null);
      alert(`Seafarer record deleted successfully.`);
    } catch (err: any) {
      console.error('Error deleting candidate:', err);
      setDeleteCandError(err?.message || 'Failed to delete candidate.');
    } finally {
      setIsDeletingCand(false);
    }
  };


  // Handle Course Creation
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode.trim() || !courseTitle.trim()) return;

    setIsSavingCourse(true);
    try {
      const created = await createCourse({
        course_code: courseCode.trim(),
        title: courseTitle.trim(),
        category: courseCategory,
        description: courseDesc.trim()
      });
      setCourses([created, ...courses]);
      setCourseCode('');
      setCourseTitle('');
      setCourseDesc('');
      alert(`STCW course registered successfully: ${created.course_code}`);
    } catch (err) {
      console.error('Error creating course:', err);
    } finally {
      setIsSavingCourse(false);
    }
  };

  // Open Edit Course Modal
  const handleOpenEditCourse = (crs: CourseRecord) => {
    setEditingCourse(crs);
    setEditCourseCode(crs.course_code);
    setEditCourseTitle(crs.title);
    setEditCourseCategory(crs.category || 'STCW');
    setEditCourseDesc(crs.description || '');
  };

  // Save Course Edits
  const handleSaveEditCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse || !editCourseCode.trim() || !editCourseTitle.trim()) return;

    setIsUpdatingCourse(true);
    try {
      const updated = await updateCourse(editingCourse.id, {
        course_code: editCourseCode.trim(),
        title: editCourseTitle.trim(),
        category: editCourseCategory.trim(),
        description: editCourseDesc.trim()
      });

      setCourses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setEditingCourse(null);
    } catch (err: any) {
      console.error('Error updating course:', err);
      alert(`Failed to update course: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsUpdatingCourse(false);
    }
  };

  // Toggle Course Active State (Enable / Disable)
  const handleToggleCourseStatus = async (crs: CourseRecord) => {
    setTogglingCourseId(crs.id);
    try {
      const updated = await toggleCourseStatus(crs.id);
      setCourses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    } catch (err: any) {
      console.error('Error toggling course status:', err);
      alert(`Failed to change status: ${err?.message || 'Unknown error'}`);
    } finally {
      setTogglingCourseId(null);
    }
  };

  // Confirm Delete Course
  const handleConfirmDeleteCourse = async () => {
    if (!deletingCourse) return;

    setIsDeletingCourse(true);
    try {
      await deleteCourse(deletingCourse.id);
      setCourses((prev) => prev.filter((c) => c.id !== deletingCourse.id));

      if (quickCourseId === deletingCourse.id) {
        const remainingActive = courses.filter((c) => c.id !== deletingCourse.id && c.is_active !== false);
        if (remainingActive.length > 0) setQuickCourseId(remainingActive[0].id);
      }
      setDeletingCourse(null);
    } catch (err: any) {
      console.error('Error deleting course:', err);
      alert(`Failed to delete course: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsDeletingCourse(false);
    }
  };

  // Handle Standard Certificate Issue
  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandId || !selectedCourseId) return;

    setIsIssuing(true);
    try {
      const cert = await createCertificate(selectedCandId, selectedCourseId, issueDate, expiryDate);
      const qr = await generateQRCodeDataURL(cert.verification_hash);
      setIssuedCert(cert);
      setIssuedQr(qr);
      setCertificates([cert, ...certificates]);
      setIsIssuing(false);
      setShowIssuedModal(true);
    } catch (err: any) {
      console.error('CRITICAL SUPABASE INSERT ERROR:', err);
      alert(`Failed to store certificate: ${err?.message || 'Failed to issue certificate.'}`);
      setIsIssuing(false);
    } finally {
      setIsIssuing(false);
    }
  };

  // Handle Status Update
  const handleStatusChange = async (id: string, newStatus: CertificateStatus) => {
    try {
      await updateCertificateStatus(id, newStatus);
      setCertificates(
        certificates.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
      if (issuedCert && issuedCert.id === id) {
        setIssuedCert({ ...issuedCert, status: newStatus });
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Open Edit Certificate Modal
  const handleOpenEditCert = (cert: CertificateRecord) => {
    setEditingCert(cert);
    setEditCertName(cert.candidate?.full_name || '');
    setEditCertPassport(cert.candidate?.passport_id || '');
    setEditCertNo(cert.certificate_number || '');
    setEditCertCourseId(cert.course_id || (courses[0]?.id || ''));
    setEditCertSalutation(cert.salutation || 'Mr.');
    setEditCertIssueDate(cert.issue_date || '');
    setEditCertExpiryDate(cert.expiry_date || '');
    setEditCertStcw(cert.stcw_regulation || '');
    setEditCertResolutionNo(cert.resolution_number || '');
    setEditCertResolutionDate(cert.resolution_date || '');
    setEditCertResolutionExpiry(cert.resolution_expiry || '');
    setEditCertStatus(cert.status || 'VALID');
  };

  // Save Edit Certificate Changes
  const handleSaveEditCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;

    setIsUpdatingCert(true);
    try {
      const updated = await updateCertificate(editingCert.id, {
        candidate_name: editCertName.trim().toUpperCase(),
        candidate_passport: editCertPassport.trim().toUpperCase(),
        certificate_number: editCertNo.trim(),
        course_id: editCertCourseId,
        salutation: editCertSalutation,
        issue_date: editCertIssueDate,
        expiry_date: editCertExpiryDate,
        stcw_regulation: editCertStcw.trim(),
        resolution_number: editCertResolutionNo.trim(),
        resolution_date: editCertResolutionDate,
        resolution_expiry: editCertResolutionExpiry,
        status: editCertStatus
      });

      setCertificates((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setEditingCert(null);
    } catch (err: any) {
      console.error('Error updating certificate:', err);
      alert(`Failed to update certificate: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsUpdatingCert(false);
    }
  };

  // Confirm Delete Certificate
  const handleConfirmDeleteCert = async () => {
    if (!deletingCert) return;

    setIsDeletingCert(true);
    try {
      await deleteCertificate(deletingCert.id);
      setCertificates((prev) => prev.filter((c) => c.id !== deletingCert.id));
      setDeletingCert(null);
    } catch (err: any) {
      console.error('Error deleting certificate:', err);
      alert(`Failed to delete certificate: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsDeletingCert(false);
    }
  };

  // Filtered Certificates
  const filteredCertificates = certificates.filter((cert) => {
    const matchesStatus = statusFilter === 'ALL' || cert.status === statusFilter;
    const query = directorySearch.toLowerCase().trim();
    const candNameMatch = cert.candidate?.full_name?.toLowerCase().includes(query) || false;
    const candPassMatch = cert.candidate?.passport_id?.toLowerCase().includes(query) || false;
    const certNoMatch = cert.certificate_number?.toLowerCase().includes(query) || false;
    const hashMatch = cert.verification_hash?.toLowerCase().includes(query) || false;
    const courseMatch = cert.course?.title?.toLowerCase().includes(query) || cert.course?.course_code?.toLowerCase().includes(query) || false;

    return matchesStatus && (!query || candNameMatch || candPassMatch || certNoMatch || hashMatch || courseMatch);
  });

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#001D33] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-sky-400">
          <div className="w-10 h-10 border-4 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Verifying credentials...
          </span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <AdminLoginForm
        onSuccess={(user) => {
          setCurrentUser(user);
          loadAllData();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Top Admin Navigation Bar */}
      <div className="bg-[#002B49] text-white shadow-xl border-b border-sky-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-sky-300 block">
                Maritime Administration Portal
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Continental Training Center S.A. & UAG
              </h1>
            </div>
          </div>

          {/* Quick Stat Badges & User Logout */}
          <div className="flex items-center gap-3 text-xs flex-wrap">
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-400" />
              <span className="text-slate-300">Seafarers:</span>
              <strong className="text-white font-mono">{candidates.length}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300">Courses:</span>
              <strong className="text-white font-mono">{courses.length}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">Certificates:</span>
              <strong className="text-white font-mono">{certificates.length}</strong>
            </div>

            {/* Admin User Profile & Logout */}
            <div className="pl-2 border-l border-slate-700/80 flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-950/80 border border-sky-800/60">
                <UserCheck className="w-4 h-4 text-sky-400" />
                <div className="text-left">
                  <span className="text-white font-bold text-xs block leading-none">
                    {currentUser.full_name}
                  </span>
                  <span className="text-[10px] text-sky-300 font-mono">
                    {currentUser.email}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Controls Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto space-x-1 border-t border-sky-900/50">
          <button
            onClick={() => setActiveTab('quick_add')}
            className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'quick_add'
              ? 'border-emerald-400 text-emerald-400 bg-emerald-950/50 font-extrabold shadow-inner'
              : 'border-transparent text-emerald-300 hover:text-white hover:bg-emerald-900/20'
              }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            Add Candidate & Generate Cert
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'directory'
              ? 'border-sky-400 text-sky-400 bg-sky-900/30'
              : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
          >
            <FileCheck2 className="w-4 h-4" />
            Certificate Directory ({certificates.length})
          </button>

          <button
            onClick={() => setActiveTab('issuer')}
            className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'issuer'
              ? 'border-sky-400 text-sky-400 bg-sky-900/30'
              : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
          >
            <QrIcon className="w-4 h-4 text-emerald-400" />
            Issue Certificate / Generate QR
          </button>

          <button
            onClick={() => setActiveTab('candidates')}
            className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'candidates'
              ? 'border-sky-400 text-sky-400 bg-sky-900/30'
              : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
          >
            <Users className="w-4 h-4" />
            Seafarers Management ({candidates.length})
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'courses'
              ? 'border-sky-400 text-sky-400 bg-sky-900/30'
              : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
          >
            <BookOpen className="w-4 h-4" />
            Courses Management ({courses.length})
          </button>
        </div>

      </div>

      {/* Main Admin Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#0088CC] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-600">Loading administrative database...</p>
          </div>
        ) : (
          <>
            {/* TAB 0: COMPREHENSIVE CANDIDATE & CERTIFICATE GENERATOR */}
            {activeTab === 'quick_add' && (
              <div className="space-y-6">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-[#002B49] via-[#003C66] to-[#0088CC] p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">
                      <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                      Comprehensive Certificate Generator (Mirroring Official PDF)
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                      Add Candidate Details & Generate Official Certificate
                    </h2>
                    <p className="text-xs text-sky-200 mt-1 max-w-2xl">
                      Fill all seafarer personal details, STCW regulations, Panama resolution numbers, course execution dates, mode, and location. Live preview updates dynamically.
                    </p>
                  </div>
                  {quickIssuedCert && (
                    <button
                      onClick={() => {
                        setQuickIssuedCert(null);
                        setQuickCandName('');
                        setQuickCandPassport('');
                        setQuickCandPhoto('');
                        setQuickCustomCertNo('');
                      }}
                      className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md transition-all shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      Issue Another Certificate
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Form Inputs (5 cols) */}
                  <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6 max-h-[85vh] overflow-y-auto">
                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-[#0088CC]" />
                        Certificate Form Details
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Live Preview Active
                      </span>
                    </div>

                    <form onSubmit={handleQuickIssueCandidateAndCert} className="space-y-4 text-xs">
                      {/* Section 1: Seafarer Personal Details */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                        <div className="text-slate-800 font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
                          <Users className="w-3.5 h-3.5 text-[#0088CC]" />
                          1. Seafarer Candidate Personal Details
                        </div>

                        <div className="space-y-2">
                          <label className="block font-bold text-slate-700">
                            Select Existing Seafarer / Candidate from Database:
                          </label>
                          <select
                            onChange={(e) => {
                              const candId = e.target.value;
                              if (!candId) return;
                              const cand = candidates.find((c) => c.id === candId);
                              if (cand) {
                                setQuickCandName(cand.full_name || '');
                                setQuickCandPassport(cand.passport_id || '');
                                setQuickCandPhoto(cand.photo_url || '');
                              }
                            }}
                            defaultValue=""
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-[#0088CC]"
                          >
                            <option value="">-- Pick Candidate from DB --</option>
                            {candidates.map((cand, idx) => (
                              <option key={cand.id ? `${cand.id}-${idx}` : `cand-${idx}`} value={cand.id}>
                                {cand.full_name} ({cand.passport_id})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-1">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Prefix:</label>
                            <select
                              value={quickSalutation}
                              onChange={(e) => setQuickSalutation(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#0088CC]"
                            >
                              <option value="Mr.">Mr.</option>
                              <option value="Ms.">Ms.</option>
                              <option value="Capt.">Capt.</option>
                              <option value="Eng.">Eng.</option>
                            </select>
                          </div>
                          <div className="col-span-2">
                            <label className="block font-bold text-slate-700 mb-1">
                              Full Candidate Name <span className="text-rose-500">*</span>:
                            </label>
                            <input
                              type="text"
                              value={quickCandName}
                              onChange={(e) => setQuickCandName(e.target.value)}
                              placeholder="e.g. BRIJESH KUMAR KUSHWAHA"
                              required
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold uppercase text-slate-900 focus:outline-none focus:border-[#0088CC]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Passport Number <span className="text-rose-500">*</span>:
                          </label>
                          <input
                            type="text"
                            value={quickCandPassport}
                            onChange={(e) => setQuickCandPassport(e.target.value)}
                            placeholder="e.g. AB483436"
                            required
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-[#0088CC]"
                          />
                        </div>
                      </div>

                      {/* Section 2: Course & Certificate Identification */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                        <div className="text-slate-800 font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
                          <BookOpen className="w-3.5 h-3.5 text-[#0088CC]" />
                          2. STCW Course & Certificate Number
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Training Course Title <span className="text-rose-500">*</span>:
                          </label>
                          <select
                            value={quickCourseId}
                            onChange={(e) => {
                              const newCourseId = e.target.value;
                              setQuickCourseId(newCourseId);
                              const selectedCrs = courses.find((c) => c.id === newCourseId);
                              if (selectedCrs && selectedCrs.description) {
                                setQuickStcwRegulation(selectedCrs.description);
                              }
                            }}
                            required
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-[#0088CC]"
                          >
                            {courses
                              .filter((crs) => crs.is_active !== false)
                              .map((crs) => (
                                <option key={crs.id} value={crs.id}>
                                  [{crs.course_code}] {crs.title}
                                </option>
                              ))}
                          </select>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block font-bold text-slate-700">
                              Certificate Reference Code:
                            </label>
                            {certNoNotice && (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 animate-fade-in flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-600" />
                                {certNoNotice}
                              </span>
                            )}
                          </div>
                          <div className="relative flex items-center">
                            <input
                              type="text"
                              value={quickCustomCertNo}
                              onChange={(e) => setQuickCustomCertNo(e.target.value)}
                              placeholder="e.g. UAG-TC-26-ASE-00417"
                              className="w-full pl-3 pr-24 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-[#0088CC] focus:ring-1 focus:ring-[#0088CC] transition-all"
                            />
                            <button
                              type="button"
                              onClick={handleGenerateCertCode}
                              title="Auto-generate Certificate Reference Code"
                              className="absolute right-1.5 px-3 py-1 bg-gradient-to-r from-[#0088CC] to-[#006699] hover:from-[#0077BB] hover:to-[#005588] text-white font-bold text-[11px] rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border border-sky-400/30"
                            >
                              <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                              <span>Auto</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Panama Resolutions & STCW Regulations */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                        <div className="text-slate-800 font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
                          <Award className="w-3.5 h-3.5 text-[#0088CC]" />
                          3. IMO STCW Regulations & Approval Resolution
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">IMO STCW Regulation Clause:</label>
                          <textarea
                            rows={2}
                            value={quickStcwRegulation}
                            onChange={(e) => setQuickStcwRegulation(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-[#0088CC]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block font-bold text-slate-700">Resolution No:</label>
                              {resNoNotice && (
                                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 animate-fade-in flex items-center gap-1">
                                  <Check className="w-2.5 h-2.5 text-emerald-600" />
                                  {resNoNotice}
                                </span>
                              )}
                            </div>
                            <div className="relative flex items-center">
                              <input
                                type="text"
                                value={quickResolutionNo}
                                onChange={(e) => setQuickResolutionNo(e.target.value)}
                                placeholder="DGGM-CFM-005-2025"
                                className="w-full pl-2.5 pr-20 py-2 bg-white border border-slate-300 rounded-xl font-mono text-slate-900 text-xs focus:outline-none focus:border-[#0088CC] focus:ring-1 focus:ring-[#0088CC] transition-all"
                              />
                              <button
                                type="button"
                                onClick={handleGenerateResolutionNo}
                                title="Auto-generate Resolution No"
                                className="absolute right-1 px-2.5 py-1 bg-gradient-to-r from-[#0088CC] to-[#006699] hover:from-[#0077BB] hover:to-[#005588] text-white font-bold text-[11px] rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1 cursor-pointer active:scale-95 border border-sky-400/30"
                              >
                                <Wand2 className="w-3 h-3 text-amber-300" />
                                <span>Auto</span>
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Resolution Date:</label>
                            <input
                              type="date"
                              value={quickResolutionDate}
                              onChange={(e) => setQuickResolutionDate(e.target.value)}
                              className="w-full px-2 py-2 bg-white border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-[#0088CC]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Resolution Valid Until:</label>
                            <input
                              type="date"
                              value={quickResolutionExpiry}
                              onChange={(e) => setQuickResolutionExpiry(e.target.value)}
                              className="w-full px-2 py-2 bg-white border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-[#0088CC]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 4: Course Execution & Venue Parameters */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                        <div className="text-slate-800 font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
                          <FileText className="w-3.5 h-3.5 text-[#0088CC]" />
                          4. Course Execution Dates, Mode & Location
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Held From Date:</label>
                            <input
                              type="date"
                              value={quickHeldFrom}
                              onChange={(e) => setQuickHeldFrom(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-[#0088CC]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Held To Date:</label>
                            <input
                              type="date"
                              value={quickHeldTo}
                              onChange={(e) => setQuickHeldTo(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-[#0088CC]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Course Mode:</label>
                            <select
                              value={quickCourseMode}
                              onChange={(e) => setQuickCourseMode(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#0088CC]"
                            >
                              <option value="Presential">Presential</option>
                              <option value="Online / Distance">Online / Distance</option>
                              <option value="Blended Learning">Blended Learning</option>
                            </select>
                          </div>
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Conducted At Location:</label>
                            <input
                              type="text"
                              value={quickConductedAt}
                              onChange={(e) => setQuickConductedAt(e.target.value)}
                              placeholder="e.g. AZERBAIJAN"
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold uppercase text-slate-900 focus:outline-none focus:border-[#0088CC]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 5: Issuance Dates & Validity Note */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                        <div className="text-slate-800 font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0088CC]" />
                          5. Issuance Dates, Validity & Barcode Hash
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Issued Date:</label>
                            <input
                              type="date"
                              value={quickIssueDate}
                              onChange={(e) => setQuickIssueDate(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-[#0088CC]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Valid Until Date:</label>
                            <input
                              type="date"
                              value={quickExpiryDate}
                              onChange={(e) => setQuickExpiryDate(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-[#0088CC]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Revision Code:</label>
                            <input
                              type="text"
                              value={quickRevisionCode}
                              onChange={(e) => setQuickRevisionCode(e.target.value)}
                              placeholder="REV. 2/2025"
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-[#0088CC]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Numeric Barcode Code:</label>
                            <input
                              type="text"
                              value={quickNumericHash}
                              onChange={(e) => setQuickNumericHash(e.target.value)}
                              placeholder="35830462448604"
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-[#0088CC]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Submit Action Button */}
                      <button
                        type="submit"
                        disabled={isQuickIssuing}
                        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-[#0088CC] hover:from-emerald-700 hover:to-[#0077BB] text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="flex items-center justify-center gap-2">
                          {isQuickIssuing ? (
                            <>
                              <RefreshCw className="w-5 h-5 animate-spin" />
                              <span>Registering Candidate & Generating Certificate...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                              <span>Save Seafarer & Issue Certificate</span>
                            </>
                          )}
                        </span>
                      </button>
                    </form>
                  </div>

                  {/* Right Column: Dynamic Live Certificate Preview (7 cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Printer className="w-5 h-5 text-sky-400" />
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider block text-sky-300">
                            Live Certificate Document Preview
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Exact mirror matching the CTC & UAG PDF specs
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => downloadCertificatePDF('live-certificate-export', livePreviewCert.certificate_number || 'Certificate')}
                          className="px-3 py-1.5 bg-gradient-to-r from-[#0088CC] to-[#0066AA] hover:from-[#0077BB] hover:to-[#005599] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer transition-all active:scale-95"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download PDF
                        </button>

                        {quickIssuedCert && (
                          <>
                            <button
                              onClick={() => handleCopyVerificationLink(quickIssuedCert.verification_hash)}
                              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                            >
                              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              {copiedLink ? 'Copied!' : 'Copy Verify URL'}
                            </button>
                            <Link
                              href={`/verify/${quickIssuedCert.verification_hash}`}
                              target="_blank"
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              View Public URL
                            </Link>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Official Certificate Component Render */}
                    <div className="bg-slate-300 p-2 sm:p-4 rounded-3xl overflow-x-auto shadow-inner border border-slate-300">
                      <OfficialCertificatePDF cert={quickIssuedCert || livePreviewCert} id="live-certificate-export" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 1: CERTIFICATE DIRECTORY */}
            {activeTab === 'directory' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      Master Maritime Certificate Registry
                    </h2>
                    <p className="text-xs text-slate-600">
                      Manage, search, revoke, or inspect all issued CTC certificates and cryptographic QR verification hashes.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Search Bar */}
                    <div className="relative flex-1 md:w-72">
                      <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={directorySearch}
                        onChange={(e) => setDirectorySearch(e.target.value)}
                        placeholder="Search candidate, passport, cert #..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0088CC]"
                      />
                    </div>

                    {/* Status Filter Dropdown */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0088CC]"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="VALID">VALID</option>
                      <option value="EXPIRED">EXPIRED</option>
                      <option value="REVOKED">REVOKED</option>
                    </select>
                  </div>
                </div>

                {/* Directory Table */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="p-4">Cert # / Hash</th>
                          <th className="p-4">Seafarer Candidate</th>
                          <th className="p-4">STCW Course</th>
                          <th className="p-4">Issue & Expiry</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {filteredCertificates.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-10 text-center text-slate-500">
                              No certificates found matching query.
                            </td>
                          </tr>
                        ) : (
                          filteredCertificates.map((cert) => (
                            <tr key={cert.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-4">
                                <span className="font-mono font-bold text-[#0088CC] block">
                                  {cert.certificate_number}
                                </span>
                                <span className="font-mono text-[10px] text-slate-400">
                                  {cert.verification_hash.substring(0, 14)}...
                                </span>
                              </td>
                              <td className="p-4">
                                <span className="font-bold text-slate-900 block uppercase">
                                  {cert.candidate?.full_name || 'N/A'}
                                </span>
                                <span className="text-[11px] font-mono text-slate-500">
                                  Passport: {cert.candidate?.passport_id || 'N/A'}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className="font-semibold text-slate-800 block">
                                  {cert.course?.title || 'STCW Course'}
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-50 text-[#0088CC] border border-sky-200 inline-block mt-0.5">
                                  {cert.course?.course_code}
                                </span>
                              </td>
                              <td className="p-4 font-mono text-[11px]">
                                <div>Issued: <strong className="text-emerald-700">{cert.issue_date}</strong></div>
                                <div>Expires: <strong className="text-[#0088CC]">{cert.expiry_date || 'N/A'}</strong></div>
                              </td>
                              <td className="p-4">
                                <select
                                  value={cert.status}
                                  onChange={(e) => handleStatusChange(cert.id, e.target.value as CertificateStatus)}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border cursor-pointer ${cert.status === 'VALID'
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : cert.status === 'EXPIRED'
                                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                                      : 'bg-rose-100 text-rose-800 border-rose-300'
                                    }`}
                                >
                                  <option value="VALID">VALID</option>
                                  <option value="EXPIRED">EXPIRED</option>
                                  <option value="REVOKED">REVOKED</option>
                                </select>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Preview / View Modal Button */}
                                  <button
                                    type="button"
                                    onClick={() => setPreviewCert(cert)}
                                    title="View / Preview Certificate"
                                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>

                                  {/* Edit Modal Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditCert(cert)}
                                    title="Edit Certificate Details"
                                    className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors cursor-pointer"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>

                                  {/* Delete / Revoke Modal Button */}
                                  <button
                                    type="button"
                                    onClick={() => setDeletingCert(cert)}
                                    title="Delete / Revoke Certificate"
                                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>

                                  {/* Public Verification URL */}
                                  <Link
                                    href={`/verify/${cert.verification_hash}`}
                                    target="_blank"
                                    title="Public Verification Page"
                                    className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#0088CC] border border-sky-200 transition-colors inline-flex items-center"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ISSUER / GENERATE QR */}
            {activeTab === 'issuer' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <QrIcon className="w-6 h-6 text-emerald-500" />
                      Issue Certificate to Registered Seafarer
                    </h2>
                    <p className="text-xs text-slate-600 mt-1">
                      Select an existing candidate and course to generate a unique digital certificate & verification hash.
                    </p>
                  </div>

                  <form onSubmit={handleIssueCertificate} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Select Candidate:</label>
                      <select
                        value={selectedCandId}
                        onChange={(e) => setSelectedCandId(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-[#0088CC]"
                      >
                        {candidates.map((cand, idx) => (
                          <option key={cand.id ? `${cand.id}-${idx}` : `cand-${idx}`} value={cand.id}>
                            {cand.full_name} ({cand.passport_id})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Select STCW Course:</label>
                      <select
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-[#0088CC]"
                      >
                        {courses
                          .filter((crs) => crs.is_active !== false)
                          .map((crs) => (
                            <option key={crs.id} value={crs.id}>
                              [{crs.course_code}] {crs.title}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Issue Date:</label>
                        <input
                          type="date"
                          value={issueDate}
                          onChange={(e) => setIssueDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Expiry Date:</label>
                        <input
                          type="date"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isIssuing}
                      className="w-full py-3.5 bg-[#0088CC] hover:bg-[#0077BB] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="flex items-center gap-2">
                        {isIssuing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <QrIcon className="w-4 h-4" />}
                        <span>{isIssuing ? "Generating Certificate..." : "Generate Certificate & QR Code"}</span>
                      </span>
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-7">
                  {issuedCert ? (
                    <div className="space-y-4">
                      <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                          <div>
                            <h3 className="text-base font-bold text-emerald-900">Certificate Generated Successfully</h3>
                            <p className="text-xs font-mono text-emerald-700">{issuedCert.certificate_number}</p>
                          </div>
                        </div>

                        <Link
                          href={`/verify/${issuedCert.verification_hash}`}
                          target="_blank"
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Public Verification URL
                        </Link>
                      </div>

                      <OfficialCertificatePDF cert={issuedCert} />
                    </div>
                  ) : (
                    <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center text-slate-400 space-y-3">
                      <QrIcon className="w-12 h-12 stroke-[1.5] mx-auto text-slate-300" />
                      <p className="text-sm font-medium">Select candidate and course on the left to issue a certificate.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: SEAFARERS MANAGEMENT */}
            {activeTab === 'candidates' && (() => {
              const filteredCandidates = candidates.filter((cand) => {
                if (!candSearch.trim()) return true;
                const q = candSearch.toLowerCase();
                return (
                  cand.full_name?.toLowerCase().includes(q) ||
                  cand.passport_id?.toLowerCase().includes(q) ||
                  cand.identity_number?.toLowerCase().includes(q) ||
                  cand.seaman_book_number?.toLowerCase().includes(q) ||
                  cand.rank_position?.toLowerCase().includes(q) ||
                  cand.nationality?.toLowerCase().includes(q) ||
                  cand.place_of_birth?.toLowerCase().includes(q)
                );
              });

              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Register Seafarer Form */}
                  <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <div className="border-b border-slate-100 pb-4">
                      <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-[#0088CC]" />
                        Register Seafarer
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Create a complete Maritime Seafarer profile in Supabase database.
                      </p>
                    </div>

                    {candError && (
                      <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-medium flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>{candError}</span>
                      </div>
                    )}

                    <form onSubmit={handleAddCandidate} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Full Name <span className="text-rose-500">*</span>:
                        </label>
                        <input
                          type="text"
                          value={candName}
                          onChange={(e) => setCandName(e.target.value)}
                          placeholder="e.g. BRIJESH KUMAR KUSHWAHA"
                          required
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold uppercase text-slate-900 focus:outline-none focus:border-[#0088CC]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Passport Number <span className="text-rose-500">*</span>:
                          </label>
                          <input
                            type="text"
                            value={candPassport}
                            onChange={(e) => setCandPassport(e.target.value)}
                            placeholder="e.g. AB483436"
                            required
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-[#0088CC]"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Seaman's Book / CDC No:
                          </label>
                          <input
                            type="text"
                            value={candSeamanBook}
                            onChange={(e) => setCandSeamanBook(e.target.value)}
                            placeholder="e.g. CDC-928104"
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-[#0088CC]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Identity Number:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={candIdentityNumber}
                            onChange={(e) => setCandIdentityNumber(e.target.value)}
                            placeholder="Auto-generated 9-digit ID"
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-[#0088CC]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const random9Digit = Math.floor(100000000 + Math.random() * 900000000).toString();
                              setCandIdentityNumber(random9Digit);
                            }}
                            className="shrink-0 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#0088CC]" />
                            Auto / Generate
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Rank / Position:</label>
                          <input
                            type="text"
                            value={candRankPosition}
                            onChange={(e) => setCandRankPosition(e.target.value)}
                            placeholder="e.g. Able Seafarer Engine"
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-[#0088CC]"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Nationality:</label>
                          <input
                            type="text"
                            value={candNationality}
                            onChange={(e) => setCandNationality(e.target.value)}
                            placeholder="e.g. Panamanian"
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-[#0088CC]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Date of Birth:</label>
                          <input
                            type="date"
                            value={candDob}
                            onChange={(e) => setCandDob(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-[#0088CC]"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Place of Birth:</label>
                          <input
                            type="text"
                            value={candPlaceOfBirth}
                            onChange={(e) => setCandPlaceOfBirth(e.target.value)}
                            placeholder="e.g. Panama City"
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-[#0088CC]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Gender:</label>
                          <select
                            value={candGender}
                            onChange={(e) => setCandGender(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-[#0088CC]"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Phone Number:</label>
                          <input
                            type="tel"
                            value={candPhone}
                            onChange={(e) => setCandPhone(e.target.value)}
                            placeholder="+507 6000-0000"
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-[#0088CC]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Email Address:</label>
                        <input
                          type="email"
                          value={candEmail}
                          onChange={(e) => setCandEmail(e.target.value)}
                          placeholder="seafarer@maritime.com"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-[#0088CC]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Residential Address:</label>
                        <input
                          type="text"
                          value={candAddress}
                          onChange={(e) => setCandAddress(e.target.value)}
                          placeholder="Full Street Address / City / Country"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-[#0088CC]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Emergency Contact:</label>
                        <input
                          type="text"
                          value={candEmergencyContact}
                          onChange={(e) => setCandEmergencyContact(e.target.value)}
                          placeholder="Name & Contact Phone"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-[#0088CC]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Photo URL (Optional):</label>
                        <input
                          type="url"
                          value={candPhoto}
                          onChange={(e) => setCandPhoto(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-[#0088CC]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSavingCand}
                        className="w-full py-3.5 bg-[#0088CC] hover:bg-[#0077BB] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isSavingCand ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Registering Seafarer...</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            <span>Register Seafarer</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  {/* Right Column: Registered Seafarers Directory */}
                  <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                          <Users className="w-5 h-5 text-[#0088CC]" />
                          Registered Seafarers Directory
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Manage live candidate profiles from Supabase, edit details, or issue certificates.
                        </p>
                      </div>

                      <span className="px-3 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-full border border-slate-200 shrink-0">
                        {filteredCandidates.length} Seafarer{filteredCandidates.length === 1 ? '' : 's'}
                      </span>
                    </div>

                    {/* Real-time Search Input */}
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={candSearch}
                        onChange={(e) => setCandSearch(e.target.value)}
                        placeholder="Search seafarers by Name, Passport, CDC No, Identity No, Rank / Position, or Nationality..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0088CC]"
                      />
                      {candSearch && (
                        <button
                          onClick={() => setCandSearch('')}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {/* Seafarer Directory Cards / Table */}
                    {filteredCandidates.length === 0 ? (
                      <div className="p-12 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400 space-y-2">
                        <Users className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5]" />
                        <p className="text-xs font-semibold text-slate-600">No seafarers found matching your search.</p>
                        <p className="text-[11px] text-slate-400">Try adjusting your search criteria or register a new seafarer on the left.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                        {filteredCandidates.map((cand, idx) => (
                          <div key={cand.id ? `${cand.id}-${idx}` : `cand-${idx}`} className="p-4 bg-white hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                              {cand.photo_url && cand.photo_url.trim() !== '' ? (
                                <img
                                  src={cand.photo_url}
                                  alt={cand.full_name}
                                  className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0"
                                />
                              ) : (
                                <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 shadow-inner">
                                  <User className="w-6 h-6 text-slate-400" />
                                </div>
                              )}

                              <div className="min-w-0 space-y-0.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-extrabold text-slate-900 text-sm uppercase truncate">
                                    {cand.full_name}
                                  </span>
                                  {cand.rank_position && (
                                    <span className="px-2 py-0.5 bg-blue-50 text-[#0088CC] font-bold text-[10px] rounded-md border border-blue-100 truncate">
                                      {cand.rank_position}
                                    </span>
                                  )}
                                  {cand.gender && (
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-medium text-[10px] rounded-md border border-slate-200">
                                      {cand.gender}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-2.5 text-xs text-slate-500 flex-wrap">
                                  <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-bold">
                                    Passport: {cand.passport_id}
                                  </span>
                                  {cand.seaman_book_number && (
                                    <span className="font-mono bg-emerald-50 px-2 py-0.5 rounded text-emerald-700 font-bold border border-emerald-100">
                                      CDC: {cand.seaman_book_number}
                                    </span>
                                  )}
                                  {cand.identity_number && (
                                    <span className="font-mono bg-blue-50 px-2 py-0.5 rounded text-[#0088CC] font-bold border border-blue-100">
                                      ID: {cand.identity_number}
                                    </span>
                                  )}
                                  {cand.nationality && <span>Nationality: {cand.nationality}</span>}
                                  {cand.date_of_birth && <span>DOB: {cand.date_of_birth}</span>}
                                  {cand.place_of_birth && <span>POB: {cand.place_of_birth}</span>}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                              {/* Certificates Count Badge */}
                              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px] border border-slate-200 flex items-center gap-1">
                                <Award className="w-3.5 h-3.5 text-[#0088CC]" />
                                {cand.certificates_count ?? 0} Certs
                              </span>

                              {/* Quick Link: Issue Certificate */}
                              <button
                                onClick={() => handleSelectCandidateForCert(cand)}
                                title="Issue Certificate to this Candidate"
                                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 cursor-pointer flex items-center gap-1.5 transition-all"
                              >
                                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Issue Cert</span>
                              </button>

                              {/* Edit Button */}
                              <button
                                onClick={() => handleOpenEditCandidate(cand)}
                                title="Edit Candidate Details"
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-[#0088CC] border border-slate-200 cursor-pointer transition-all"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => {
                                  setDeletingCand(cand);
                                  setDeleteCandError(null);
                                }}
                                title="Delete Candidate Record"
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 cursor-pointer transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* TAB 4: COURSES MANAGEMENT */}
            {activeTab === 'courses' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Register New Course Form */}
                <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <BookPlus className="w-5 h-5 text-[#0088CC]" />
                      Add STCW Course
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Register new maritime training course definitions directly to Supabase DB.
                    </p>
                  </div>

                  <form onSubmit={handleAddCourse} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        STCW Code <span className="text-rose-500">*</span>:
                      </label>
                      <input
                        type="text"
                        value={courseCode}
                        onChange={(e) => setCourseCode(e.target.value)}
                        placeholder="e.g. STCW III/5"
                        required
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-[#0088CC]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Course Title <span className="text-rose-500">*</span>:
                      </label>
                      <input
                        type="text"
                        value={courseTitle}
                        onChange={(e) => setCourseTitle(e.target.value)}
                        placeholder="e.g. ABLE SEAFARER ENGINE"
                        required
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold uppercase text-slate-900 focus:outline-none focus:border-[#0088CC]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Category:</label>
                      <select
                        value={courseCategory}
                        onChange={(e) => setCourseCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-[#0088CC]"
                      >
                        <option value="STCW">STCW Standard</option>
                        <option value="STCW Engine">STCW Engine</option>
                        <option value="STCW Deck">STCW Deck</option>
                        <option value="STCW Firefighting">STCW Firefighting</option>
                        <option value="STCW Survival">STCW Survival</option>
                        <option value="STCW Security">STCW Security</option>
                        <option value="STCW Medical">STCW Medical</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Course Description:</label>
                      <textarea
                        rows={3}
                        value={courseDesc}
                        onChange={(e) => setCourseDesc(e.target.value)}
                        placeholder="Detailed description of STCW regulations & competencies..."
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#0088CC]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSavingCourse}
                      className="w-full py-3.5 bg-[#0088CC] hover:bg-[#0077BB] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSavingCourse ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Saving to Supabase...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Add STCW Course</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Right Column: Registered STCW Courses Table */}
                <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-lg font-black text-slate-900">Registered STCW Courses</h2>
                      <p className="text-xs text-slate-500">
                        Manage course definitions, toggle availability for certificate generation, or edit details.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        {courses.filter((c) => c.is_active !== false).length} Active
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold">
                        {courses.filter((c) => c.is_active === false).length} Disabled
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="p-3.5">Course Code</th>
                          <th className="p-3.5">Course Title</th>
                          <th className="p-3.5">Category</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {courses.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-500">
                              No courses found in database.
                            </td>
                          </tr>
                        ) : (
                          courses.map((crs) => {
                            const isActive = crs.is_active !== false;
                            const isToggling = togglingCourseId === crs.id;

                            return (
                              <tr key={crs.id} className={`hover:bg-slate-50/80 transition-colors ${!isActive ? 'bg-slate-50/50' : ''}`}>
                                <td className="p-3.5 font-mono font-bold text-[#0088CC] whitespace-nowrap">
                                  {crs.course_code}
                                </td>
                                <td className="p-3.5 font-bold text-slate-900">
                                  {crs.title}
                                  {crs.description && (
                                    <span className="block text-[11px] font-normal text-slate-500 line-clamp-1 mt-0.5">
                                      {crs.description}
                                    </span>
                                  )}
                                </td>
                                <td className="p-3.5 whitespace-nowrap">
                                  <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 text-[10px] font-bold border border-sky-200 inline-block">
                                    {crs.category || 'STCW'}
                                  </span>
                                </td>
                                <td className="p-3.5 whitespace-nowrap">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${isActive
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                      : 'bg-slate-200 text-slate-700 border border-slate-300'
                                      }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-600 animate-pulse' : 'bg-slate-500'
                                        }`}
                                    />
                                    {isActive ? 'Active' : 'Disabled'}
                                  </span>
                                </td>
                                <td className="p-3.5 text-right whitespace-nowrap">
                                  <div className="inline-flex items-center gap-1.5">
                                    {/* Disable / Enable Toggle Switch */}
                                    <button
                                      type="button"
                                      onClick={() => handleToggleCourseStatus(crs)}
                                      disabled={isToggling}
                                      title={isActive ? 'Disable course for certificate issuance' : 'Enable course'}
                                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border flex items-center gap-1 transition-all cursor-pointer ${isActive
                                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300'
                                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                                        }`}
                                    >
                                      {isToggling ? (
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                      ) : isActive ? (
                                        <ToggleRight className="w-4 h-4 text-emerald-600" />
                                      ) : (
                                        <ToggleLeft className="w-4 h-4 text-slate-400" />
                                      )}
                                      <span>{isActive ? 'Disable' : 'Enable'}</span>
                                    </button>

                                    {/* Edit Button */}
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditCourse(crs)}
                                      title="Edit course details"
                                      className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#0088CC] font-bold border border-sky-200 cursor-pointer transition-all"
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                      type="button"
                                      onClick={() => setDeletingCourse(crs)}
                                      title="Delete course from database"
                                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold border border-rose-200 cursor-pointer transition-all"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Certificate Generation Success & Candidate Sharing Action Modal */}
        {showIssuedModal && (quickIssuedCert || issuedCert) && (() => {
          const activeCert = quickIssuedCert || issuedCert!;
          const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://panama-ctc.com');
          const verifyUrl = `${baseUrl.replace(/\/$/, '')}/verify/${activeCert.verification_hash}`;

          return (
            <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full p-6 sm:p-8 space-y-6 my-8 print:border-none print:shadow-none print:p-0 print:my-0">

                {/* Modal Header (Hidden when printing) */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-4 print:hidden">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                          Official Certificate Issued
                        </span>
                      </div>
                      <h2 className="text-xl font-black text-slate-900 mt-1">
                        Certificate Registered & Ready to Share
                      </h2>
                      <p className="text-xs text-slate-500 font-mono">
                        {activeCert.certificate_number} &bull; {activeCert.candidate?.full_name}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowIssuedModal(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Sharing & Action Box (Hidden when printing) */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 print:hidden">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Direct Candidate Verification Link (Shareable URL):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={verifyUrl}
                        className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none"
                      />
                      <button
                        onClick={() => handleCopyVerificationLink(activeCert.verification_hash)}
                        className="px-4 py-2.5 bg-[#0088CC] hover:bg-[#0077BB] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition-all active:scale-95"
                      >
                        {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                        {copiedLink ? 'Copied!' : 'Copy Link'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {/* Action 1: Download QR PNG */}
                    <button
                      onClick={() => downloadQRCodePNG(activeCert.verification_hash, activeCert.certificate_number)}
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      Download QR Code PNG
                    </button>

                    {/* Action 2: Download PDF */}
                    <button
                      onClick={() => downloadCertificatePDF('admin-certificate-export', activeCert.certificate_number || 'Certificate')}
                      className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all active:scale-95"
                    >
                      <Download className="w-4 h-4 text-sky-400" />
                      Download PDF
                    </button>

                    {/* Action 3: Open Public Page */}
                    <Link
                      href={`/verify/${activeCert.verification_hash}`}
                      target="_blank"
                      className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-[#0088CC] font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-slate-300 shadow-xs cursor-pointer transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open Verification Page
                    </Link>
                  </div>
                </div>

                {/* Rendered Official Certificate Preview Component */}
                <div className="bg-slate-200 p-2 sm:p-4 rounded-3xl overflow-x-auto shadow-inner border border-slate-300 print:bg-white print:border-none print:p-0 print:shadow-none">
                  <OfficialCertificatePDF cert={activeCert} id="admin-certificate-export" />
                </div>

                {/* Modal Footer (Hidden when printing) */}
                <div className="flex justify-end pt-2 border-t border-slate-100 print:hidden">
                  <button
                    onClick={() => setShowIssuedModal(false)}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-all"
                  >
                    Done / Close Window
                  </button>
                </div>

              </div>
            </div>
          );
        })()}

        {/* EDIT COURSE MODAL */}
        {editingCourse && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-100 border border-sky-200 text-[#0088CC]">
                    <Pencil className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Edit STCW Course</h3>
                    <p className="text-xs text-slate-500 font-mono">{editingCourse.course_code}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditCourse} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    STCW Course Code <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    value={editCourseCode}
                    onChange={(e) => setEditCourseCode(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-[#0088CC]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Course Title <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    value={editCourseTitle}
                    onChange={(e) => setEditCourseTitle(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold uppercase text-slate-900 focus:outline-none focus:border-[#0088CC]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category:</label>
                  <select
                    value={editCourseCategory}
                    onChange={(e) => setEditCourseCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-[#0088CC]"
                  >
                    <option value="STCW">STCW Standard</option>
                    <option value="STCW Engine">STCW Engine</option>
                    <option value="STCW Deck">STCW Deck</option>
                    <option value="STCW Firefighting">STCW Firefighting</option>
                    <option value="STCW Survival">STCW Survival</option>
                    <option value="STCW Security">STCW Security</option>
                    <option value="STCW Medical">STCW Medical</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Course Description:</label>
                  <textarea
                    rows={3}
                    value={editCourseDesc}
                    onChange={(e) => setEditCourseDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#0088CC]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingCourse(null)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingCourse}
                    className="px-5 py-2.5 rounded-xl bg-[#0088CC] hover:bg-[#0077BB] text-white font-extrabold text-xs cursor-pointer transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                  >
                    {isUpdatingCourse ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Updating Supabase...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE COURSE CONFIRMATION MODAL */}
        {deletingCourse && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900">Delete STCW Course?</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Are you sure you want to permanently delete course{' '}
                  <strong className="text-slate-900 font-mono">[{deletingCourse.course_code}] {deletingCourse.title}</strong>?
                </p>
                <p className="text-[11px] text-rose-600 font-semibold bg-rose-50 p-2.5 rounded-xl border border-rose-200 mt-2">
                  This action will remove the course record from Supabase database.
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingCourse(null)}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteCourse}
                  disabled={isDeletingCourse}
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs cursor-pointer transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDeletingCourse ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Course</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CERTIFICATE PREVIEW MODAL */}
        {previewCert && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#0088CC]" />
                    Certificate Preview & Actions
                  </h3>
                  <p className="text-xs font-mono text-slate-500 mt-0.5">
                    {previewCert.certificate_number} • Seafarer: {previewCert.candidate?.full_name}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => downloadCertificatePDF('cert-preview-pdf-content', previewCert.certificate_number)}
                    className="px-3 py-1.5 bg-[#0088CC] hover:bg-[#0077BB] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => downloadQRCodePNG(previewCert.verification_hash, previewCert.certificate_number)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <QrIcon className="w-3.5 h-3.5" />
                    <span>QR</span>
                  </button>

                  <Link
                    href={`/verify/${previewCert.verification_hash}`}
                    target="_blank"
                    className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#0088CC] font-bold text-xs border border-sky-200 rounded-xl flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Verify</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setPreviewCert(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer ml-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto bg-slate-50 p-4 rounded-2xl border border-slate-200 flex justify-center">
                <OfficialCertificatePDF cert={previewCert} id="cert-preview-pdf-content" />
              </div>
            </div>
          </div>
        )}

        {/* EDIT CERTIFICATE MODAL */}
        {editingCert && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Pencil className="w-5 h-5 text-amber-600" />
                    Edit Certificate & Candidate Details
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Cert #: {editingCert.certificate_number}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingCert(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditCert} className="space-y-4 text-xs">
                {/* Seafarer Info */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-[#0088CC]">
                    1. Seafarer Candidate Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Full Candidate Name *:</label>
                      <input
                        type="text"
                        value={editCertName}
                        onChange={(e) => setEditCertName(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold uppercase text-slate-900 focus:outline-none focus:border-[#0088CC]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Passport Number *:</label>
                      <input
                        type="text"
                        value={editCertPassport}
                        onChange={(e) => setEditCertPassport(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-[#0088CC]"
                      />
                    </div>
                  </div>
                </div>

                {/* Certificate Core Details */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-[#0088CC]">
                    2. Certificate Specifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Certificate Reference #:</label>
                      <input
                        type="text"
                        value={editCertNo}
                        onChange={(e) => setEditCertNo(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-mono font-bold text-[#0088CC] focus:outline-none focus:border-[#0088CC]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">STCW Course:</label>
                      <select
                        value={editCertCourseId}
                        onChange={(e) => setEditCertCourseId(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-[#0088CC]"
                      >
                        {courses.map((crs) => (
                          <option key={crs.id} value={crs.id}>
                            [{crs.course_code}] {crs.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Issue Date:</label>
                      <input
                        type="date"
                        value={editCertIssueDate}
                        onChange={(e) => setEditCertIssueDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-[#0088CC]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Expiry Date:</label>
                      <input
                        type="date"
                        value={editCertExpiryDate}
                        onChange={(e) => setEditCertExpiryDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-[#0088CC]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">STCW Regulation Text:</label>
                    <textarea
                      rows={2}
                      value={editCertStcw}
                      onChange={(e) => setEditCertStcw(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#0088CC]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Resolution No:</label>
                      <input
                        type="text"
                        value={editCertResolutionNo}
                        onChange={(e) => setEditCertResolutionNo(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-[#0088CC]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Resolution Date:</label>
                      <input
                        type="date"
                        value={editCertResolutionDate}
                        onChange={(e) => setEditCertResolutionDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-[#0088CC]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Resolution Expiry:</label>
                      <input
                        type="date"
                        value={editCertResolutionExpiry}
                        onChange={(e) => setEditCertResolutionExpiry(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-[#0088CC]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Status:</label>
                    <select
                      value={editCertStatus}
                      onChange={(e) => setEditCertStatus(e.target.value as CertificateStatus)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold uppercase text-slate-900 focus:outline-none focus:border-[#0088CC]"
                    >
                      <option value="VALID">VALID</option>
                      <option value="EXPIRED">EXPIRED</option>
                      <option value="REVOKED">REVOKED</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingCert(null)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingCert}
                    className="px-5 py-2.5 rounded-xl bg-[#0088CC] hover:bg-[#0077BB] text-white font-extrabold text-xs cursor-pointer transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                  >
                    {isUpdatingCert ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Updating Supabase DB...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE CERTIFICATE CONFIRMATION MODAL */}
        {deletingCert && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900">Delete Certificate Record?</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Are you sure you want to permanently delete certificate{' '}
                  <strong className="text-slate-900 font-mono">{deletingCert.certificate_number}</strong> issued to seafarer{' '}
                  <strong className="text-slate-900">{deletingCert.candidate?.full_name}</strong>?
                </p>
                <div className="text-[11px] text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200 text-left space-y-1 mt-2">
                  <div className="font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Permanent Action:</span>
                  </div>
                  <p>This action removes the record directly from Supabase database. Alternatively, you can revoke its validity by setting status to REVOKED.</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingCert(null)}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-all"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await handleStatusChange(deletingCert.id, 'REVOKED');
                    setDeletingCert(null);
                  }}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs cursor-pointer transition-all shadow-md"
                >
                  Mark REVOKED
                </button>

                <button
                  type="button"
                  onClick={handleConfirmDeleteCert}
                  disabled={isDeletingCert}
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs cursor-pointer transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDeletingCert ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Delete DB</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT CANDIDATE MODAL */}
        {editingCand && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Pencil className="w-5 h-5 text-[#0088CC]" />
                  Edit Seafarer Details
                </h3>
                <button
                  onClick={() => setEditingCand(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {editCandError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-medium flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{editCandError}</span>
                </div>
              )}

              <form onSubmit={handleSaveEditCandidate} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Full Candidate Name <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    value={editCandName}
                    onChange={(e) => setEditCandName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold uppercase text-slate-900 focus:outline-none focus:border-[#0088CC]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Passport ID <span className="text-rose-500">*</span>:
                    </label>
                    <input
                      type="text"
                      value={editCandPassport}
                      onChange={(e) => setEditCandPassport(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-[#0088CC]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Seaman's Book / CDC No:
                    </label>
                    <input
                      type="text"
                      value={editCandSeamanBook}
                      onChange={(e) => setEditCandSeamanBook(e.target.value)}
                      placeholder="e.g. CDC-928104"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-[#0088CC]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Identity Number:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editCandIdentityNumber}
                      onChange={(e) => setEditCandIdentityNumber(e.target.value)}
                      placeholder="e.g. 839201"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-[#0088CC]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const random9Digit = Math.floor(100000000 + Math.random() * 900000000).toString();
                        setEditCandIdentityNumber(random9Digit);
                      }}
                      className="shrink-0 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#0088CC]" />
                      Auto / Generate
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Rank / Position:</label>
                    <input
                      type="text"
                      value={editCandRankPosition}
                      onChange={(e) => setEditCandRankPosition(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-[#0088CC]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nationality:</label>
                    <input
                      type="text"
                      value={editCandNationality}
                      onChange={(e) => setEditCandNationality(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-[#0088CC]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Date of Birth:</label>
                    <input
                      type="date"
                      value={editCandDob}
                      onChange={(e) => setEditCandDob(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-[#0088CC]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Place of Birth:</label>
                    <input
                      type="text"
                      value={editCandPlaceOfBirth}
                      onChange={(e) => setEditCandPlaceOfBirth(e.target.value)}
                      placeholder="e.g. Panama City"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-[#0088CC]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Gender:</label>
                    <select
                      value={editCandGender}
                      onChange={(e) => setEditCandGender(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-[#0088CC]"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone Number:</label>
                    <input
                      type="tel"
                      value={editCandPhone}
                      onChange={(e) => setEditCandPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-[#0088CC]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address:</label>
                  <input
                    type="email"
                    value={editCandEmail}
                    onChange={(e) => setEditCandEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-[#0088CC]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Residential Address:</label>
                  <input
                    type="text"
                    value={editCandAddress}
                    onChange={(e) => setEditCandAddress(e.target.value)}
                    placeholder="Full Street Address / City / Country"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-[#0088CC]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Emergency Contact:</label>
                  <input
                    type="text"
                    value={editCandEmergencyContact}
                    onChange={(e) => setEditCandEmergencyContact(e.target.value)}
                    placeholder="Name & Contact Phone"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-[#0088CC]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Photo URL:</label>
                  <input
                    type="url"
                    value={editCandPhoto}
                    onChange={(e) => setEditCandPhoto(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-[#0088CC]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingCand(null)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingCand}
                    className="px-5 py-2.5 rounded-xl bg-[#0088CC] hover:bg-[#0077BB] text-white font-extrabold text-xs cursor-pointer transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                  >
                    {isUpdatingCand ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Updating DB...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE CANDIDATE CONFIRMATION MODAL */}
        {deletingCand && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900">Delete Seafarer Record?</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Are you sure you want to permanently delete candidate{' '}
                  <strong className="text-slate-900">{deletingCand.full_name}</strong> (Passport:{' '}
                  <span className="font-mono text-slate-900 font-bold">{deletingCand.passport_id}</span>)?
                </p>
              </div>

              {deleteCandError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-medium text-left flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{deleteCandError}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingCand(null)}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-all"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmDeleteCandidate}
                  disabled={isDeletingCand}
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs cursor-pointer transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDeletingCand ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Confirm Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ISSUED CERTIFICATE SUCCESS NOTIFICATION MODAL */}
        {showIssuedModal && (quickIssuedCert || issuedCert) && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs uppercase tracking-widest inline-block">
                  Saved Live to Supabase DB
                </span>
                <h3 className="text-2xl font-black text-slate-900">Certificate Issued Successfully!</h3>
                <p className="text-xs text-slate-600">
                  Ref Code: <strong className="font-mono text-slate-900 font-bold">{(quickIssuedCert || issuedCert)?.certificate_number}</strong>
                  <br />
                  Seafarer: <strong className="text-slate-900 uppercase font-bold">{(quickIssuedCert || issuedCert)?.candidate?.full_name}</strong>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowIssuedModal(false);
                    setPreviewCert(quickIssuedCert || issuedCert);
                  }}
                  className="py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all border border-slate-200"
                >
                  <Eye className="w-4 h-4 text-[#0088CC]" />
                  <span>Preview PDF</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    const certToExport = quickIssuedCert || issuedCert;
                    if (certToExport) {
                      await downloadCertificatePDF('live-certificate-export', certToExport.certificate_number);
                    }
                  }}
                  className="py-3 px-3 rounded-xl bg-[#0088CC] hover:bg-[#0077BB] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowIssuedModal(false);
                    setActiveTab('directory');
                  }}
                  className="py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Go to Directory</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

