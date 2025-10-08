import Pagination from '@/app/ui/aux/pagination';
import Search from '@/app/ui/search';
import DrugQueriesTable from '@/app/ui/drug-queries/table';
import { CreateDrugQuery } from '@/app/ui/drug-queries/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchFilteredDrugQueryPages } from '@/app/lib/data';
import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/annotations/breadcrumbs';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Drug Queries',
};

export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {

  const searchParams = await props.searchParams;
  const params = await props.params;
  const query = searchParams?.query || '';
  const variantAnalysisId = params.id;
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchFilteredDrugQueryPages(query, variantAnalysisId);

  return (
    <div className="w-full">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Patient: ENXXXXXXXXX', href: '/dashboard1/' },
          {
            label: 'Study: SXXXXXXXXX',
            href: `/dashboard2/`,
          },
          {
            label: 'Annotation: AXXXXXXXXX',
            href: `/dashboard3/`,
          },
          {
            label: 'Analyses',
            href: `/dashboard4/`,
            active: true,
          },
        ]}
      />

      <div className="p-4 pl-4 w-full h-14 bg-gray-50 rounded-xl mb-4 flex justify-between items-center">
        <InformationCircleIcon className="h-[30] w-[30] text-gray-500" />
        <p className="text-left w-full ml-4">Select one analysis to review or request a new one.</p>
        <div className="h-full inline-block flex items-center ">
          <CreateDrugQuery variant_analysis_uuid={variantAnalysisId} />
        </div>
      </div>

      <div className=" pb-4 w-full bg-gray-50 rounded-xl mb-4 flex-col items-center">
        <p
          className={`px-4 py-8 text-left text-l font-medium `}
        >
          Drug queries
        </p>

        <div className="ml-2 mr-2">
          <Search placeholder="Search analysis by patient ID, description, cancer types or state. Separate filters by comma." />
        </div>

        <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
          <DrugQueriesTable query={query} currentPage={currentPage} variant_analysis={variantAnalysisId} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </div>



  );
}