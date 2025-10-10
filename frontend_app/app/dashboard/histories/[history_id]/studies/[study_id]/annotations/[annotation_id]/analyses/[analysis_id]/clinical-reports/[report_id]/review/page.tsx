import Pagination from '@/app/ui/aux/pagination';
import Search from '@/app/ui/search';
import DrugQueriesTable from '@/app/ui/analysis/table';
import { CreateClinicalReport } from '@/app/ui/analysis/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchFilteredVariantAnalysisPages } from '@/app/lib/data';
import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/annotations/breadcrumbs';
import ReportResult from '@/app/ui/report/result';

export const metadata: Metadata = {
  title: 'Drug Queries',
};

export default async function Page(props: {
  params: Promise<{ id: string, query_id: string, report_id: string }>;
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
  const reportId = params.report_id;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Variant analysis', href: '/dashboard/variant-analysis' },
          {
            label: 'Drug queries', href: `/dashboard/variant-analysis/${variantAnalysisId}/drug-queries`
          },
          {
            label: 'Reports', href: `/dashboard/variant-analysis/${variantAnalysisId}/drug-queries/${drugQueryId}/clinical-reports`
          },
          {
            label: 'Review', href: `/dashboard/variant-analysis/${variantAnalysisId}/drug-queries/${drugQueryId}/clinical-reports/${reportId}/review`
          },
        ]}
      />
      <div className="w-full">
        <div>
          <ReportResult report_id={reportId} />
        </div>
      </div>
    </main>


  );
}