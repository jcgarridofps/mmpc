import Pagination from '@/app/ui/aux/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/variant-analysis/table';
import { CreateInvoice } from '@/app/ui/variant-analysis/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchFilteredVariantAnalysisPages } from '@/app/lib/data';
import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/variant-analysis/breadcrumbs';
import { InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';


export const metadata: Metadata = {
  title: 'Variant Analysis',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {

  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchFilteredVariantAnalysisPages(query);

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
            label: 'Annotations',
            href: `/dashboard3/`,
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
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}