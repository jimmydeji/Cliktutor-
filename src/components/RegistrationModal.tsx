import React, { useState, useEffect, useRef } from 'react';
import { StudentProfile, GradeLevel, ExamType } from '../types';
import { NIGERIAN_STATES, POPULAR_SCHOOLS, POPULAR_UNIVERSITIES, POPULAR_COURSES } from '../data/nigeriaLocations';
import {
  X,
  CheckCircle,
  Sparkles,
  School,
  MapPin,
  Phone,
  User,
  GraduationCap,
  Camera,
  LogOut,
  Trash2,
  Home,
  Landmark,
  BookOpen,
  Target,
  HeartHandshake,
  Check
} from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: StudentProfile;
  onSaveProfile: (profile: StudentProfile) => void;
  onLogout: () => void;
  isInitialSetup?: boolean;
}

type ProfileTab = 'student' | 'parent' | 'aspirations';

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
  onLogout,
  isInitialSetup = false,
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('student');

  // Student Identity
  const [name, setName] = useState(currentProfile.name || '');
  const [phoneNumber, setPhoneNumber] = useState(currentProfile.phoneNumber || '');
  const [email, setEmail] = useState(currentProfile.email || '');
  const [selectedState, setSelectedState] = useState(currentProfile.state || 'Lagos');
  const [selectedLga, setSelectedLga] = useState(currentProfile.lga || 'Ikeja');
  const [schoolName, setSchoolName] = useState(currentProfile.schoolName || '');
  const [grade, setGrade] = useState<GradeLevel>(currentProfile.grade || 'SS2');
  const [targetExam, setTargetExam] = useState<ExamType>(currentProfile.targetExam || 'ALL');

  // Photo
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(currentProfile.avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parent Information
  const [parentName, setParentName] = useState(currentProfile.parentName || '');
  const [parentPhone, setParentPhone] = useState(currentProfile.parentPhone || '');
  const [parentAddress, setParentAddress] = useState(currentProfile.parentAddress || '');

  // Higher Education Aspirations
  const [targetUniversity, setTargetUniversity] = useState(currentProfile.targetUniversity || '');
  const [proposedCourse, setProposedCourse] = useState(currentProfile.proposedCourse || '');
  const [targetJambScore, setTargetJambScore] = useState<number>(currentProfile.targetJambScore || 300);

  const [errorMsg, setErrorMsg] = useState('');
  const [successSaved, setSuccessSaved] = useState(false);

  // Sync state if currentProfile changes
  useEffect(() => {
    if (isOpen) {
      setName(currentProfile.name || '');
      setPhoneNumber(currentProfile.phoneNumber || '');
      setEmail(currentProfile.email || '');
      setSelectedState(currentProfile.state || 'Lagos');
      setSelectedLga(currentProfile.lga || 'Ikeja');
      setSchoolName(currentProfile.schoolName || '');
      setGrade(currentProfile.grade || 'SS2');
      setTargetExam(currentProfile.targetExam || 'ALL');
      setAvatarUrl(currentProfile.avatarUrl);
      setParentName(currentProfile.parentName || '');
      setParentPhone(currentProfile.parentPhone || '');
      setParentAddress(currentProfile.parentAddress || '');
      setTargetUniversity(currentProfile.targetUniversity || '');
      setProposedCourse(currentProfile.proposedCourse || '');
      setTargetJambScore(currentProfile.targetJambScore || 300);
      setErrorMsg('');
      setSuccessSaved(false);
    }
  }, [isOpen, currentProfile]);

  // Update LGAs when State changes
  const currentStateObj = NIGERIAN_STATES.find(s => s.state === selectedState);
  const availableLgas = currentStateObj ? currentStateObj.lgas : [];

  useEffect(() => {
    if (availableLgas.length > 0 && !availableLgas.includes(selectedLga)) {
      setSelectedLga(availableLgas[0]);
    }
  }, [selectedState]);

  if (!isOpen) return null;

  // Handle Image Upload & Client-Side Resizing
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Image file size should be less than 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize to standard 320x320 square max for efficient localStorage storage
        const canvas = document.createElement('canvas');
        const maxDim = 320;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setAvatarUrl(compressedDataUrl);
          setErrorMsg('');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarUrl(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setActiveTab('student');
      setErrorMsg('Please enter your full student name.');
      return;
    }

    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setActiveTab('student');
      setErrorMsg('Please enter a valid 11-digit Nigerian phone number (e.g., 08012345678).');
      return;
    }

    if (!schoolName.trim()) {
      setActiveTab('student');
      setErrorMsg('Please enter or select your secondary school name.');
      return;
    }

    const updatedProfile: StudentProfile = {
      ...currentProfile,
      name: name.trim(),
      phoneNumber: cleanPhone,
      email: email.trim(),
      state: selectedState,
      lga: selectedLga,
      schoolName: schoolName.trim(),
      grade,
      targetExam,
      avatarUrl: avatarUrl || undefined,
      parentName: parentName.trim() || undefined,
      parentPhone: parentPhone.trim() || undefined,
      parentAddress: parentAddress.trim() || undefined,
      targetUniversity: targetUniversity.trim() || undefined,
      proposedCourse: proposedCourse.trim() || undefined,
      targetJambScore: targetJambScore || 300,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };

    onSaveProfile(updatedProfile);
    setSuccessSaved(true);
    setTimeout(() => {
      onClose();
    }, 450);
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-4 sm:my-6 transition-all">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-950 dark:to-slate-900 p-5 border-b border-emerald-500/20 relative text-white">
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            {!isInitialSetup && (
              <button
                onClick={() => {
                  console.log('Logout button clicked');
                  onLogout();
                }}
                className="p-1.5 rounded-full text-rose-200 hover:text-white hover:bg-black/20 transition cursor-pointer"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
            {!isInitialSetup && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-black/20 transition cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>{isInitialSetup ? 'Welcome to EasyBook' : 'Student Academic Profile'}</span>
          </div>

          <h2 className="text-xl font-extrabold text-white">
            {isInitialSetup ? 'Set Up Your Academic Profile' : 'Student & Aspirations Profile'}
          </h2>
          <p className="text-xs text-emerald-100/90 mt-1">
            Manage your personal details, guardian contact, photo, and university targets.
          </p>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1.5 mt-4 pt-3 border-t border-white/20">
            <button
              type="button"
              onClick={() => setActiveTab('student')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer ${
                activeTab === 'student'
                  ? 'bg-white text-emerald-800 dark:bg-emerald-500/30 dark:text-emerald-200 shadow-xs'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Student Details</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('parent')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer ${
                activeTab === 'parent'
                  ? 'bg-white text-emerald-800 dark:bg-emerald-500/30 dark:text-emerald-200 shadow-xs'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Parent / Guardian</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('aspirations')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer ${
                activeTab === 'aspirations'
                  ? 'bg-white text-emerald-800 dark:bg-emerald-500/30 dark:text-emerald-200 shadow-xs'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>University Choice</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[72vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successSaved && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {/* TAB 1: STUDENT DETAILS & PHOTO UPLOAD */}
          {activeTab === 'student' && (
            <div className="space-y-4">
              {/* Photo Upload Section */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2.5 flex items-center space-x-1.5">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span>Student Profile Photo</span>
                </span>

                <div className="flex items-center space-x-4">
                  {/* Photo Display Preview */}
                  <div className="relative group shrink-0">
                    <div className="w-20 h-20 rounded-full border-2 border-emerald-500/40 dark:border-emerald-500/60 bg-emerald-100 dark:bg-emerald-950/80 overflow-hidden flex items-center justify-center shadow-md">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Student Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-emerald-700 dark:text-emerald-300">
                          <User className="w-8 h-8 opacity-80" />
                          <span className="text-[10px] font-bold mt-0.5">No Photo</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Camera Overlay */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md transition cursor-pointer active:scale-95"
                      title="Upload or Change Photo"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="space-y-1.5 flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition active:scale-95 cursor-pointer flex items-center space-x-1.5"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{avatarUrl ? 'Change Photo' : 'Upload Image'}</span>
                      </button>

                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition cursor-pointer flex items-center space-x-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      Upload your passport or student picture (JPG, PNG). Automatically optimized for offline study.
                    </p>
                  </div>
                </div>
              </div>

              {/* Student Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Full Name of Student *</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrorMsg(''); }}
                  placeholder="e.g. Babatunde Adeleke"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Student Phone Number *</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => { setPhoneNumber(e.target.value); setErrorMsg(''); }}
                  placeholder="e.g. 0803 123 4567"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">Used for your personalized offline-sync key & dashboard recovery.</span>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
                  <span className="w-3.5 h-3.5 flex items-center justify-center font-bold text-emerald-600">@</span>
                  <span>Student Email Address *</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                  placeholder="e.g. student@example.com"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>

              {/* Class / Grade Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Senior Secondary Class *</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['SS1', 'SS2', 'SS3'] as GradeLevel[]).map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setGrade(g)}
                      className={`py-2 text-center rounded-xl text-xs font-bold border transition cursor-pointer ${
                        grade === g
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      {g} Science
                    </button>
                  ))}
                </div>
              </div>

              {/* State & LGA Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>State *</span>
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {NIGERIAN_STATES.map((s) => (
                      <option key={s.state} value={s.state} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        {s.state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Local Govt (LGA) *
                  </label>
                  <select
                    value={selectedLga}
                    onChange={(e) => setSelectedLga(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {availableLgas.map((l) => (
                      <option key={l} value={l} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Secondary School Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
                  <School className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Secondary School Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => { setSchoolName(e.target.value); setErrorMsg(''); }}
                  placeholder="e.g. King's College, Lagos"
                  list="popular-schools-list"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
                <datalist id="popular-schools-list">
                  {POPULAR_SCHOOLS.map((sch) => (
                    <option key={sch} value={sch} />
                  ))}
                </datalist>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Used for School and Inter-College leaderboard rankings.</span>
              </div>

              {/* Target Exam */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Examination Target
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'WAEC', label: 'WAEC' },
                    { id: 'JAMB', label: 'JAMB' },
                    { id: 'NECO', label: 'NECO' },
                    { id: 'ALL', label: 'All 3' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setTargetExam(item.id as ExamType)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        targetExam === item.id
                          ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-400'
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PARENT / GUARDIAN INFORMATION */}
          {activeTab === 'parent' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start space-x-3">
                <HeartHandshake className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-200">Parent / Guardian Information</h4>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-0.5">
                    Enables automated performance reports, score progress updates, and emergency communication for the scholar.
                  </p>
                </div>
              </div>

              {/* Parent / Guardian Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Parent / Guardian Full Name</span>
                </label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="e.g. Engr. Olabode Adebayo / Mrs. Funke Adeleke"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>

              {/* Parent Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Parent / Guardian Phone Number</span>
                </label>
                <input
                  type="tel"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  placeholder="e.g. 0802 345 6789"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Weekly study streak and mock examination scores can be shared with this contact.
                </span>
              </div>

              {/* Parent Residential Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
                  <Home className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Parent / Residential Address</span>
                </label>
                <textarea
                  rows={3}
                  value={parentAddress}
                  onChange={(e) => setParentAddress(e.target.value)}
                  placeholder="e.g. Plot 12, Adekunle Fajuyi Crescent, Ikeja GRA, Lagos State"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition resize-none"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Official home address for academic records and school correspondence.
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: HIGHER EDUCATION ASPIRATIONS */}
          {activeTab === 'aspirations' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 flex items-start space-x-3">
                <Landmark className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-teal-950 dark:text-teal-200">Higher Education Aspirations</h4>
                  <p className="text-[11px] text-teal-800 dark:text-teal-300 mt-0.5">
                    Align your secondary science preparation directly with your dream university cutoff mark and course requirements.
                  </p>
                </div>
              </div>

              {/* Choice of University */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
                  <Landmark className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Choice of University / Higher Institution</span>
                </label>
                <input
                  type="text"
                  value={targetUniversity}
                  onChange={(e) => setTargetUniversity(e.target.value)}
                  placeholder="e.g. University of Lagos (UNILAG)"
                  list="popular-universities-list"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
                <datalist id="popular-universities-list">
                  {POPULAR_UNIVERSITIES.map((uni) => (
                    <option key={uni} value={uni} />
                  ))}
                </datalist>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Choose from top Nigerian Federal, State, and Private universities or enter your institution.
                </span>
              </div>

              {/* Proposed Course of Study */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Proposed Course of Study</span>
                </label>
                <input
                  type="text"
                  value={proposedCourse}
                  onChange={(e) => setProposedCourse(e.target.value)}
                  placeholder="e.g. Computer Science / Software Engineering"
                  list="popular-courses-list"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
                <datalist id="popular-courses-list">
                  {POPULAR_COURSES.map((course) => (
                    <option key={course} value={course} />
                  ))}
                </datalist>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Select your desired degree programme (Medicine, Engineering, Computing, Pharmacy, Law, etc.).
                </span>
              </div>

              {/* Target UTME / JAMB Score */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center space-x-1">
                    <Target className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Target UTME / JAMB Score (Out of 400)</span>
                  </span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-400 font-mono text-sm">
                    {targetJambScore} / 400
                  </span>
                </label>
                <input
                  type="range"
                  min="200"
                  max="380"
                  step="5"
                  value={targetJambScore}
                  onChange={(e) => setTargetJambScore(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>200 (Cut-off)</span>
                  <span>280 (High Merit)</span>
                  <span>340+ (Top 1% National)</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation / Action Footer */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2">
            {activeTab !== 'student' && (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'aspirations') setActiveTab('parent');
                  else if (activeTab === 'parent') setActiveTab('student');
                }}
                className="py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs transition cursor-pointer"
              >
                Back
              </button>
            )}

            {activeTab !== 'aspirations' ? (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'student') {
                    if (!name.trim()) {
                      setErrorMsg('Please enter your full student name.');
                      return;
                    }
                    if (!schoolName.trim()) {
                      setErrorMsg('Please enter your school name.');
                      return;
                    }
                    setErrorMsg('');
                    setActiveTab('parent');
                  } else if (activeTab === 'parent') {
                    setActiveTab('aspirations');
                  }
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>Next: {activeTab === 'student' ? 'Parent / Guardian Info' : 'University Aspirations'}</span>
              </button>
            ) : null}

            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-bold text-xs shadow-sm active:scale-[0.99] transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isInitialSetup ? 'Save & Start Learning' : 'Save & Update Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
