import Pagination from '@/app/ui/aux/pagination';
import Search from '@/app/ui/search';
import DrugQueriesTable from '@/app/ui/analysis/table';
import { CreateAnalysis } from '@/app/ui/analysis/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchAnalysisByAnalysisId, fetchAnnotationByAnnotationId, fetchFilteredAnnotationsPages, fetchPatientByHistoryId, fetchStudyByStudyId } from '@/app/lib/data';
import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/annotations/breadcrumbs';
import Form from '@/app/ui/report/create-form';

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
  const patient_appId = await fetchPatientByHistoryId(params.history_id);
  const study_appId = await fetchStudyByStudyId(params.study_id);
  const annotation_appId = await fetchAnnotationByAnnotationId(params.annotation_id);
  const analysis_appId = await fetchAnalysisByAnalysisId(params.analysis_id);
  const totalPages = await fetchFilteredAnnotationsPages(query, params.study_id);

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
            label: 'Create report', href: `/dashboard/histories/${params.history_id}/studies/${params.study_id}/annotations/${params.annotation_id}/analyses/${params.analysis_id}/clinical-reports/create`, active: true
          },
        ]}
      />
      <Form history_id={params.history_id} study_id={params.study_id} annotation_id={params.annotation_id} analysis_id={params.analysis_id} />
    </main>


  );
}