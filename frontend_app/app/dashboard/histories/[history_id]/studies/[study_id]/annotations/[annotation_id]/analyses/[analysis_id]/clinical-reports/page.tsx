import Pagination from '@/app/ui/aux/pagination';
import Search from '@/app/ui/search';
import DrugQueriesTable from '@/app/ui/analysis/table';
import { CreateClinicalReport } from '@/app/ui/analysis/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchFilteredReportPages } from '@/app/lib/data';
import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/annotations/breadcrumbs';
import Table from '@/app/ui/report/table';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Drug Queries',
};

export default async function Page(props: {
  params: Promise<{ id: string, query_id: string }>;
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {

  const searchParams = await props.searchParams;
  const params = await props.params;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const variantAnalysisId = params.id;
  const drugQueryId = params.query_id;
  const totalPages = await fetchFilteredReportPages(query, drugQueryId);

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
            label: 'Analysis: DXXXXXXXXX', href: `/dashboard4/`
          },
          {
            label: 'Reports', href: `/dashboard5/`, active: true
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
          <Table variant_analysis_id={variantAnalysisId} drug_query_id={drugQueryId} currentPage={currentPage} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </main>


  );
}