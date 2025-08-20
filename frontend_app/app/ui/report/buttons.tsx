import { EyeIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

/* export function CreateReport() {
  return (
    <Link
      href="/dashboard/variant-analysis/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">New analysis</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
} */

export function ReviewReport({ variant_analysis_id, drug_query_id, report_id }: { variant_analysis_id: string, drug_query_id: string, report_id: string }) {
  return (
    <Link
      href={`/dashboard/variant-analysis/${variant_analysis_id}/drug-queries/${drug_query_id}/clinical-reports/${report_id}/review/`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <EyeIcon className="w-5" />
    </Link>
  );
}
