import { PlusIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function CreateDrugQuery({variant_analysis_uuid}:{variant_analysis_uuid:string}) {
  return (
    <Link
      href={`/dashboard/variant-analysis/${variant_analysis_uuid}/drug-queries/create`}
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">New drug query</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function CreateClinicalReport({variant_analysis_uuid, drug_query_uuid}:{variant_analysis_uuid:string, drug_query_uuid: string}) {
  return (
    <Link
      href={`/dashboard/variant-analysis/${variant_analysis_uuid}/drug-queries/${drug_query_uuid}/clinical-reports/create`}
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">New clinical report</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function ClinicalReports({variant_analysis_uuid, drug_query_uuid}:{variant_analysis_uuid:string, drug_query_uuid: string}) {
  return (
    <Link
      href={`/dashboard/variant-analysis/${variant_analysis_uuid}/drug-queries/${drug_query_uuid}/clinical-reports`}
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Clinical reports</span>{' '}
      <EyeIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function ReviewDrugQuery({ id, query_id }: { id: string, query_id: string }) {
  return (
    <Link
      href={ `/dashboard/variant-analysis/${id}/drug-queries/${query_id}/review`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <EyeIcon className="w-5" />
    </Link>
  );
}
