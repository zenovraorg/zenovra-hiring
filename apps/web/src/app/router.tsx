import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/app-shell';

// Public-facing — eagerly loaded for fast first paint
import { CareersPage } from '@/features/careers/careers-page';
import { CareerJobDetail } from '@/features/careers/career-job-detail';

// Lazy-loaded pages
const LoginPage = lazy(() => import('@/features/auth/login-page').then(m => ({ default: m.LoginPage })));
const CareerApply = lazy(() => import('@/features/careers/career-apply').then(m => ({ default: m.CareerApply })));
const CareerLogin = lazy(() => import('@/features/careers/career-login').then(m => ({ default: m.CareerLogin })));
const DashboardPage = lazy(() => import('@/features/dashboard/dashboard-page').then(m => ({ default: m.DashboardPage })));
const JobsPage = lazy(() => import('@/features/jobs/jobs-page').then(m => ({ default: m.JobsPage })));
const CreateJobPage = lazy(() => import('@/features/jobs/create-job-page').then(m => ({ default: m.CreateJobPage })));
const JobDetailPage = lazy(() => import('@/features/jobs/job-detail-page').then(m => ({ default: m.JobDetailPage })));
const CandidatesPage = lazy(() => import('@/features/candidates/candidates-page').then(m => ({ default: m.CandidatesPage })));
const CandidateDetailPage = lazy(() => import('@/features/candidates/candidate-detail-page').then(m => ({ default: m.CandidateDetailPage })));
const PipelinePage = lazy(() => import('@/features/pipeline/pipeline-page').then(m => ({ default: m.PipelinePage })));
const InterviewsPage = lazy(() => import('@/features/interviews/interviews-page').then(m => ({ default: m.InterviewsPage })));
const FeedbackPage = lazy(() => import('@/features/feedback/feedback-page').then(m => ({ default: m.FeedbackPage })));
const AssessmentsPage = lazy(() => import('@/features/assessments/assessments-page').then(m => ({ default: m.AssessmentsPage })));
const OffersPage = lazy(() => import('@/features/offers/offers-page').then(m => ({ default: m.OffersPage })));
const AnalyticsPage = lazy(() => import('@/features/analytics/analytics-page').then(m => ({ default: m.AnalyticsPage })));
const NotificationsPage = lazy(() => import('@/features/notifications/notifications-page').then(m => ({ default: m.NotificationsPage })));
const ReferralsPage = lazy(() => import('@/features/referrals/referrals-page').then(m => ({ default: m.ReferralsPage })));
const AdminPage = lazy(() => import('@/features/admin/admin-page').then(m => ({ default: m.AdminPage })));
const PortalLayout = lazy(() => import('@/features/candidate-portal/portal-layout').then(m => ({ default: m.PortalLayout })));
const PortalDashboard = lazy(() => import('@/features/candidate-portal/portal-dashboard').then(m => ({ default: m.PortalDashboard })));
const PortalDocuments = lazy(() => import('@/features/candidate-portal/portal-documents').then(m => ({ default: m.PortalDocuments })));
const PortalProfile = lazy(() => import('@/features/candidate-portal/portal-profile').then(m => ({ default: m.PortalProfile })));

// Loading fallback
function PageSkeleton() {
  return (
    <div className="flex items-center justify-center h-full min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-white/10 border-t-indigo-400 animate-spin" />
        <span className="text-sm text-white/30">Loading...</span>
      </div>
    </div>
  );
}

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageSkeleton />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <SuspenseWrapper><LoginPage /></SuspenseWrapper>,
  },
  {
    path: '/careers/login',
    element: <SuspenseWrapper><CareerLogin /></SuspenseWrapper>,
  },
  {
    path: '/careers/:id/apply',
    element: <SuspenseWrapper><CareerApply /></SuspenseWrapper>,
  },
  {
    path: '/careers/:id',
    element: <CareerJobDetail />,
  },
  {
    path: '/careers',
    element: <CareersPage />,
  },
  {
    path: '/portal',
    element: <SuspenseWrapper><PortalLayout /></SuspenseWrapper>,
    children: [
      { index: true, element: <SuspenseWrapper><PortalDashboard /></SuspenseWrapper> },
      { path: 'documents', element: <SuspenseWrapper><PortalDocuments /></SuspenseWrapper> },
      { path: 'profile', element: <SuspenseWrapper><PortalProfile /></SuspenseWrapper> },
    ],
  },
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/careers" replace /> },
      { path: 'dashboard', element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper> },
      { path: 'jobs', element: <SuspenseWrapper><JobsPage /></SuspenseWrapper> },
      { path: 'jobs/new', element: <SuspenseWrapper><CreateJobPage /></SuspenseWrapper> },
      { path: 'jobs/:id', element: <SuspenseWrapper><JobDetailPage /></SuspenseWrapper> },
      { path: 'candidates', element: <SuspenseWrapper><CandidatesPage /></SuspenseWrapper> },
      { path: 'candidates/:id', element: <SuspenseWrapper><CandidateDetailPage /></SuspenseWrapper> },
      { path: 'pipeline', element: <SuspenseWrapper><PipelinePage /></SuspenseWrapper> },
      { path: 'interviews', element: <SuspenseWrapper><InterviewsPage /></SuspenseWrapper> },
      { path: 'feedback', element: <SuspenseWrapper><FeedbackPage /></SuspenseWrapper> },
      { path: 'assessments', element: <SuspenseWrapper><AssessmentsPage /></SuspenseWrapper> },
      { path: 'offers', element: <SuspenseWrapper><OffersPage /></SuspenseWrapper> },
      { path: 'analytics', element: <SuspenseWrapper><AnalyticsPage /></SuspenseWrapper> },
      { path: 'notifications', element: <SuspenseWrapper><NotificationsPage /></SuspenseWrapper> },
      { path: 'referrals', element: <SuspenseWrapper><ReferralsPage /></SuspenseWrapper> },
      { path: 'admin', element: <SuspenseWrapper><AdminPage /></SuspenseWrapper> },
      { path: 'admin/settings', element: <SuspenseWrapper><AdminPage /></SuspenseWrapper> },
    ],
  },
]);
