import Pagination from '@/app/ui/aux/pagination';
import Search from '@/app/ui/search';
import DrugQueriesTable from '@/app/ui/analysis/table';
import { CreateClinicalReport } from '@/app/ui/analysis/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchAnalysisByAnalysisId, fetchAnnotationByAnnotationId, fetchFilteredReportPages, fetchPatientByHistoryId, fetchStudyByStudyId } from '@/app/lib/data';
import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/annotations/breadcrumbs';
import Table from '@/app/ui/report/table';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Drug Queries',
};

export default async function Page(props: {
  params: Promise<{ 
    history_id: string,
    study_id: string,
    annotation_id: string, 
    analysis_id: string 
  }>;
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {

  const searchParams = await props.searchParams;
  const params = await props.params;
  const patient_appId = await fetchPatientByHistoryId(params.history_id);
  const study_appId = await fetchStudyByStudyId(params.study_id);
  const annotation_appId = await fetchAnnotationByAnnotationId(params.annotation_id);
  const analysis_appId = await fetchAnalysisByAnalysisId(params.analysis_id);
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchFilteredReportPages(query, params.analysis_id);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: `Patient: ${patient_appId}`, href: `/dashboard/histories/${params.history_id}/studies/` },
          {
            label: `Study: ${study_appId}`, href: `/dashboard/histories/${params.history_id}/studies/${params.study_id}/annotations/`
          },
          {
            label: `Annotation: ${annotation_appId}`, href: `/dashboard/histories/${params.history_id}/studies/${params.study_id}/annotations/${params.annotation_id}/analyses/`
          },
          {
            label: `Analysis: ${analysis_appId}`, href: `/dashboard/histories/${params.history_id}/studies/${params.study_id}/annotations/${params.annotation_id}/analyses/${params.analysis_id}/review`
          },
          {
            label: 'Reports', href: `/dashboard/histories/${params.history_id}/studies/${params.study_id}/annotations/${params.annotation_id}/analyses/${params.analysis_id}/clinical-reports`, active: true
          },
        ]}
      />

      <div className="p-4 pl-4 w-full h-14 bg-gray-50 rounded-xl mb-4 flex justify-between items-center">
        <InformationCircleIcon className="h-[30] w-[30] text-gray-500" />
        <p className="text-left w-full ml-4">Select one report to review.</p>
      </div>

      <div className="ml-2 mr-2">
        <Search placeholder="Search report by ID or date. Separate filters by comma." />
      </div>

      <div className="w-full">
        <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
          <Table annotation_id={params.annotation_id} analysis_id={params.analysis_id} currentPage={currentPage} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </main>


  );
}