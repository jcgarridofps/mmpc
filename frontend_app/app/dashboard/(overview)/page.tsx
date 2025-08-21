import { Card } from '@/app/ui/dashboard/cards';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import LatestVariantAnalysis from '@/app/ui/dashboard/latest-variant-analysis';
import LatestDrugQueries from '@/app/ui/dashboard/latest-drug-queries';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '../../lib/data';
import HistoryBar from '@/app/ui/dashboard/history-bar';
import { Suspense } from 'react';
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton
} from '@/app/ui/skeletons';
import CardWrapper from '@/app/ui/dashboard/cards';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function Page() {

  console.log("DASHBOARD");

  return (
    <main>
      <div className="w-full">
        <HistoryBar/>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestVariantAnalysis />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestDrugQueries />
        </Suspense>
      </div>
    </main>

  );
}