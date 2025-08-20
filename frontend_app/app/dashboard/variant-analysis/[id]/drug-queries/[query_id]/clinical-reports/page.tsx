import Pagination from '@/app/ui/aux/pagination';
import Search from '@/app/ui/search';
import DrugQueriesTable from '@/app/ui/drug-queries/table';
import { CreateClinicalReport } from '@/app/ui/drug-queries/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchFilteredReportPages } from '@/app/lib/data';
import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/variant-analysis/breadcrumbs';
import Table from '@/app/ui/report/table';

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
          { label: 'Variant analysis', href: '/dashboard/variant-analysis' },
          {
            label: 'Drug queries', href: `/dashboard/variant-analysis/${variantAnalysisId}/drug-queries`
          },
          {
            label: 'Drug query', href: `/dashboard/variant-analysis/${variantAnalysisId}/drug-queries/${drugQueryId}/review`
          },
          {
            label: 'Reports', href: `/dashboard/variant-analysis/${variantAnalysisId}/drug-queries/${drugQueryId}/clinical-reports`, active: true
          },
        ]}
      />
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