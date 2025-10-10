import Pagination from '@/app/ui/aux/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/annotations/table';
import { CreateInvoice } from '@/app/ui/annotations/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchFilteredVariantAnalysisPages, fetchPatientByHistoryId, fetchStudyByStudyId } from '@/app/lib/data';
import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/annotations/breadcrumbs';
import { InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';


export const metadata: Metadata = {
  title: 'Variant Analysis',
};

export default async function Page(props: {
  params: Promise<{ 
    history_id: string,
    study_id: string 
  }>;
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {

  const params = await props.params;
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchFilteredVariantAnalysisPages(query);
  const patientAppId = await fetchPatientByHistoryId(params.history_id);
  const studyAppId = await fetchStudyByStudyId(params.study_id);

  return (
    <div className="w-full">

      <Breadcrumbs
        breadcrumbs={[
          { label: `Patient: ${patientAppId}`, href: `/dashboard/histories/${params.history_id}/studies/` },
          {
            label: `Study: ${studyAppId}`, href: `/dashboard/histories/${params.history_id}/studies/${params.study_id}/annotations/`,
          },
          {
            label: 'Annotations',
            href: `/dashboard/histories/${params.history_id}/studies/${params.study_id}/annotations/`,
            active: true,
          },
        ]}
      />

      <div className="p-4 pl-4 w-full h-14 bg-gray-50 rounded-xl mb-4 flex justify-between items-center">
        <InformationCircleIcon className="h-[30] w-[30] text-gray-500"/>
        <p className="text-left w-full ml-4">Select one variant annotation or request a new one.</p>
        <div className="h-full inline-block flex items-center ">
          <CreateInvoice />
        </div>
      </div>

      <div className="p-4 pl-4 w-full h-14 bg-yellow-100 rounded-xl mb-4 flex justify-between items-center">
        <ExclamationTriangleIcon className="h-[30] w-[30] text-gray-500"/>
        <p className="text-left w-full ml-4">Current variant annotations are outdated. Requesting a new one is recommended</p>
      </div>

      <Search placeholder="Search variant annotation by ID, date or state. Separate filters by comma." />

      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} history_id={params.history_id} study_id={params.study_id}/>
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}