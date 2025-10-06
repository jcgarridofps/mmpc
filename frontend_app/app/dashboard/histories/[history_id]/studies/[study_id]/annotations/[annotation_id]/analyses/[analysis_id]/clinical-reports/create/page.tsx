import Pagination from '@/app/ui/aux/pagination';
import Search from '@/app/ui/search';
import DrugQueriesTable from '@/app/ui/drug-queries/table';
import { CreateDrugQuery } from '@/app/ui/drug-queries/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchFilteredVariantAnalysisPages } from '@/app/lib/data';
import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/variant-analysis/breadcrumbs';
import Form from '@/app/ui/report/create-form';

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
  const totalPages = await fetchFilteredVariantAnalysisPages(query);
  const variantAnalysisId = params.id;
  const drugQueryId = params.query_id;

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
            label: 'Create report', href: `/dashboard/variant-analysis/${variantAnalysisId}/drug-queries/${drugQueryId}/clinical-report/create`, active: true
          },
        ]}
      />
      <Form variant_analysis_id={variantAnalysisId} drug_query_id={drugQueryId} />
    </main>


  );
}