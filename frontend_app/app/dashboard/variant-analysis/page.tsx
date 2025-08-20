import Pagination from '@/app/ui/aux/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/variant-analysis/table';
import { CreateInvoice } from '@/app/ui/variant-analysis/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchFilteredVariantAnalysisPages } from '@/app/lib/data';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Variant Analysis',
};
 
export default async function Page(props:{
    searchParams?: Promise<{
        query?: string;
        page?:string;
    }>;
}) {

    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchFilteredVariantAnalysisPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Variant analysis</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search analysis by patient ID, description, cancer types or state. Separate filters by comma." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}