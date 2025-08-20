import Pagination from '@/app/ui/aux/pagination';
import Search from '@/app/ui/search';
import DrugQueriesTable from '@/app/ui/drug-queries/table';
import { CreateClinicalReport, ClinicalReports } from '@/app/ui/drug-queries/buttons';
import DrugQueryResult from '@/app/ui/drug-queries/result';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchFilteredVariantAnalysisPages } from '@/app/lib/data';
import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/variant-analysis/breadcrumbs';

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
  console.log("QUERY ID: " + drugQueryId);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Variant analysis', href: '/dashboard/variant-analysis' },
          {
            label: 'Drug queries', href: `/dashboard/variant-analysis/${variantAnalysisId}/drug-queries`
          },
          {
            label: 'Review', href: `/dashboard/variant-analysis/${variantAnalysisId}/drug-queries/${drugQueryId}/review`, active: true
          },
        ]}
      />
      <div className="w-full">
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <CreateClinicalReport variant_analysis_uuid={variantAnalysisId} drug_query_uuid={drugQueryId} />
          <ClinicalReports variant_analysis_uuid={variantAnalysisId} drug_query_uuid={drugQueryId} />
        </div>
        <div>
        <DrugQueryResult query_id={params.query_id} analysis_id={params.id}/>
        </div>
      </div>
    </main>


  );
}