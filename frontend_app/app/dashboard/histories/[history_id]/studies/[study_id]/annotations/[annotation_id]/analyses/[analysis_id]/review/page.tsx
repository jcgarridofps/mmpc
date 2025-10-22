import Pagination from '@/app/ui/aux/pagination';
import Search from '@/app/ui/search';
import DrugQueriesTable from '@/app/ui/analysis/table';
import { CreateClinicalReport, ClinicalReports } from '@/app/ui/analysis/buttons';
import DrugQueryResult from '@/app/ui/analysis/result';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchFilteredVariantAnalysisPages } from '@/app/lib/data';
import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/annotations/breadcrumbs';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Drug Queries',
};

export default async function Page(props: {
  params: Promise<{ annotation_id: string, analysis_id: string }>;
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {

  const searchParams = await props.searchParams;
  const params = await props.params;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchFilteredVariantAnalysisPages(query);
  const annotationId = params.annotation_id;
  const analysisId = params.analysis_id;
  console.log("QUERY ID: " + analysisId);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Patient: ENXXXXXXXXX', href: '/dashboard/' },
          {
            label: 'Study: SXXXXXXXXX', href: `/dashboard2/`
          },
          {
            label: 'Annotation: AXXXXXXXXX', href: `/dashboard3/`
          },
          {
            label: 'Analysis: QXXXXXXXXX', href: `/dashboard4/`
          },
          {
            label: 'Review', href: `/dashboard5/`, active: true
          },
        ]}
      />

      <div className="p-4 pl-4 w-full h-14 bg-gray-50 rounded-xl mb-4 flex justify-between items-center">
        <InformationCircleIcon className="h-[30] w-[30] text-gray-500" />
        <p className="text-left w-full ml-4">Select one analysis to review or request a new one.</p>
        <div className="h-full inline-block flex items-center ">
          <CreateClinicalReport variant_analysis_uuid={annotationId} drug_query_uuid={analysisId} />
        </div>
        <div className=" ml-2 h-full inline-block flex items-center ">
          <ClinicalReports variant_analysis_uuid={annotationId} drug_query_uuid={analysisId} />
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