import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/app-shell';
import { LoginPage } from '@/features/auth/login-page';
import { DashboardPage } from '@/features/dashboard/dashboard-page';
import { JobsPage } from '@/features/jobs/jobs-page';
import { CandidatesPage } from '@/features/candidates/candidates-page';
import { PipelinePage } from '@/features/pipeline/pipeline-page';
import { InterviewsPage } from '@/features/interviews/interviews-page';
import { FeedbackPage } from '@/features/feedback/feedback-page';
import { AssessmentsPage } from '@/features/assessments/assessments-page';
import { OffersPage } from '@/features/offers/offers-page';
import { AnalyticsPage } from '@/features/analytics/analytics-page';
import { NotificationsPage } from '@/features/notifications/notifications-page';
import { ReferralsPage } from '@/features/referrals/referrals-page';
import { AdminPage } from '@/features/admin/admin-page';
import { CareersPage } from '@/features/careers/careers-page';
import { CreateJobPage } from '@/features/jobs/create-job-page';
import { JobDetailPage } from '@/features/jobs/job-detail-page';
import { CandidateDetailPage } from '@/features/candidates/candidate-detail-page';
import { CareerJobDetail } from '@/features/careers/career-job-detail';
import { CareerApply } from '@/features/careers/career-apply';
import { CareerLogin } from '@/features/careers/career-login';
import { PortalLayout } from '@/features/candidate-portal/portal-layout';
import { PortalDashboard } from '@/features/candidate-portal/portal-dashboard';
import { PortalDocuments } from '@/features/candidate-portal/portal-documents';
import { PortalProfile } from '@/features/candidate-portal/portal-profile';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/careers/login',
    element: <CareerLogin />,
  },
  {
    path: '/careers/:id/apply',
    element: <CareerApply />,
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
    element: <PortalLayout />,
    children: [
      { index: true, element: <PortalDashboard /> },
      { path: 'documents', element: <PortalDocuments /> },
      { path: 'profile', element: <PortalProfile /> },
    ],
  },
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'jobs', element: <JobsPage /> },
      { path: 'jobs/new', element: <CreateJobPage /> },
      { path: 'jobs/:id', element: <JobDetailPage /> },
      { path: 'candidates', element: <CandidatesPage /> },
      { path: 'candidates/:id', element: <CandidateDetailPage /> },
      { path: 'pipeline', element: <PipelinePage /> },
      { path: 'interviews', element: <InterviewsPage /> },
      { path: 'feedback', element: <FeedbackPage /> },
      { path: 'assessments', element: <AssessmentsPage /> },
      { path: 'offers', element: <OffersPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'referrals', element: <ReferralsPage /> },
      { path: 'admin', element: <AdminPage /> },
      { path: 'admin/settings', element: <AdminPage /> },
    ],
  },
]);
