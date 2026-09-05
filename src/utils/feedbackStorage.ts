import { TeacherFeedback } from '../types';

const STORAGE_KEY = 'sindh_arrears_teacher_feedbacks';

export const INITIAL_TEACHER_FEEDBACKS: TeacherFeedback[] = [
  {
    id: 'fb-001',
    name: 'Muhammad Tariq Memon',
    designation: 'PST (BPS-14)',
    schoolAndDistrict: 'GBPS Qasimabad, Hyderabad',
    rating: 5,
    comments: 'Alhamdulillah, our 18 months IBA PST arrears bill passed the District Accounts Office Hyderabad without any objection! The TR-22 and DAO adjustment proforma calculations were 100% accurate.',
    tag: 'PST Arrears',
    published: true,
    createdAt: '2026-02-18',
  },
  {
    id: 'fb-002',
    name: 'Abdul Rasheed Soomro',
    designation: 'JEST (BPS-14)',
    schoolAndDistrict: 'GBHS Rohri, Sukkur',
    rating: 5,
    comments: 'Differential allowance 34.35% and Adhoc 2023 35% calculation was causing confusion in our Taluka office. This bill maker solved the exact broken period issue in minutes.',
    tag: 'JEST Arrears',
    published: true,
    createdAt: '2026-02-22',
  },
  {
    id: 'fb-003',
    name: 'Farzana Parveen',
    designation: 'PST (BPS-14)',
    schoolAndDistrict: 'GGPS Ratodero, Larkana',
    rating: 5,
    comments: 'Very easy to use on mobile and PDF export gave clean official 6 pages with covering letter and DDO signature space. Highly recommended for all newly appointed teachers.',
    tag: 'TR-22 Bill',
    published: true,
    createdAt: '2026-02-27',
  },
  {
    id: 'fb-004',
    name: 'Imran Ali Chandio',
    designation: 'Senior Clerk / DDO Assistant',
    schoolAndDistrict: 'Taluka Education Office (Male), Mirpurkhas',
    rating: 5,
    comments: 'I prepared arrears bills for 42 teachers in our cluster using this tool and exported Excel backups. Saved us days of manual ledger calculations.',
    tag: 'DAO Adjustment',
    published: true,
    createdAt: '2026-03-01',
  },
];

export function getTeacherFeedbacks(): TeacherFeedback[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TEACHER_FEEDBACKS));
      return INITIAL_TEACHER_FEEDBACKS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_TEACHER_FEEDBACKS;
  } catch (err) {
    console.error('Failed to load teacher feedbacks from storage:', err);
    return INITIAL_TEACHER_FEEDBACKS;
  }
}

export function saveTeacherFeedback(feedback: Omit<TeacherFeedback, 'id' | 'createdAt'>): TeacherFeedback {
  const list = getTeacherFeedbacks();
  const newEntry: TeacherFeedback = {
    ...feedback,
    id: `fb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString().split('T')[0],
  };

  const updatedList = [newEntry, ...list];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  } catch (err) {
    console.error('Failed to save feedback to localStorage:', err);
  }
  return newEntry;
}

export function deleteTeacherFeedback(id: string): void {
  const list = getTeacherFeedbacks();
  const updatedList = list.filter((item) => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  } catch (err) {
    console.error('Failed to delete feedback:', err);
  }
}

export function toggleTeacherFeedbackPublish(id: string): void {
  const list = getTeacherFeedbacks();
  const updatedList = list.map((item) =>
    item.id === id ? { ...item, published: !item.published } : item
  );
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  } catch (err) {
    console.error('Failed to toggle feedback publish state:', err);
  }
}
