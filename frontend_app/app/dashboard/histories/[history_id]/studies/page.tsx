import Pagination from '@/app/ui/aux/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/studies/table';
import { CreateStudy } from '@/app/ui/studies/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchFilteredVariantAnalysisPages } from '@/app/lib/data';
import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/variant-analysis/breadcrumbs';
import { InformationCircleIcon } from '@heroicons/react/24/outline';


export const metadata: Metadata = {
  title: 'Variant Analysis',
};
  

export default async function Page(props: {
  params: Promise<{ history_id: string }>;
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

  return (
    <div className="w-full">

      <Breadcrumbs
        breadcrumbs={[
          { label: 'Patient: ENXXXXXXXXX', href: '/dashboard1/' },
          {
            label: 'Studies',
            href: `/dashboard2/`,
            active: true,
          },
        ]}
      />

      <div className="p-4 pl-4 w-full h-14 bg-gray-50 rounded-xl mb-4 flex justify-between items-center">
        <InformationCircleIcon className="h-[30] w-[30] text-gray-500"/>
        <p className="text-left w-full ml-4">Select one study or create a new study for the patient.</p>
        <div className="h-full inline-block flex items-center ">
          <CreateStudy history_id={params.history_id} />
        </div>
      </div>

      <Search placeholder="Search study by ID, description or date. Separate filters by comma." />

      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}