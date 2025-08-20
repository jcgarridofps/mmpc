import Pagination from '@/app/ui/aux/pagination';
import Search from '@/app/ui/search';
import DrugQueriesTable from '@/app/ui/drug-queries/table';
import { CreateDrugQuery } from '@/app/ui/drug-queries/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchFilteredDrugQueryPages } from '@/app/lib/data';
import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/variant-analysis/breadcrumbs';

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
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Variant analysis', href: '/dashboard/variant-analysis' },
          {
            label: 'Drug queries', href: `/dashboard/variant-analysis/${variantAnalysisId}/drug-queries`, active: true
          },
        ]}
      />
      <div className="w-full">
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search analysis by patient ID, description, cancer types or state. Separate filters by comma." />
          <CreateDrugQuery variant_analysis_uuid={variantAnalysisId} />
        </div>
        <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
          <DrugQueriesTable query={query} currentPage={currentPage} variant_analysis={variantAnalysisId} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </main>


  );
}