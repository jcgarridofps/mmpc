import Pagination from '@/app/ui/aux/pagination';
import Search from '@/app/ui/search';
import DrugQueriesTable from '@/app/ui/analysis/table';
import { CreateClinicalReport, ClinicalReports } from '@/app/ui/analysis/buttons';
import DrugQueryResult from '@/app/ui/analysis/result';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchFilteredAnnotationsPages, fetchPatientByHistoryId, fetchStudyByStudyId, fetchAnnotationByAnnotationId, fetchAnalysisByAnalysisId } from '@/app/lib/data';
import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/annotations/breadcrumbs';
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
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchFilteredAnnotationsPages(query, params.study_id);
  const patient_appId = await fetchPatientByHistoryId(params.history_id);
  const study_appId = await fetchStudyByStudyId(params.study_id);
  const annotation_appId = await fetchAnnotationByAnnotationId(params.annotation_id);
  const analysis_appId = await fetchAnalysisByAnalysisId(params.analysis_id);

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
            label: 'Review', href: `/dashboard/histories/${params.history_id}/studies/${params.study_id}/annotations/${params.annotation_id}/analyses/${params.analysis_id}/review`, active: true
          },
        ]}
      />

      <div className="p-4 pl-4 w-full h-14 bg-gray-50 rounded-xl mb-4 flex justify-between items-center">
        <InformationCircleIcon className="h-[30] w-[30] text-gray-500" />
        <p className="text-left w-full ml-4">Select one analysis to review or request a new one.</p>
        <div className="h-full inline-block flex items-center ">
          <CreateClinicalReport redirection={`/dashboard/histories/${params.history_id}/studies/${params.study_id}/annotations/${params.annotation_id}/analyses/${params.analysis_id}/clinical-reports/create`} />
        </div>
        <div className=" ml-2 h-full inline-block flex items-center ">
          <ClinicalReports redirection={`/dashboard/histories/${params.history_id}/studies/${params.study_id}/annotations/${params.annotation_id}/analyses/${params.analysis_id}/clinical-reports/`} />
        </div>
      </div>
      
      <div className="w-full">
        <div>
          <DrugQueryResult analysis_id={params.analysis_id} annotation_id={params.annotation_id}/>
        </div>
      </div>
    </main>


  );
}