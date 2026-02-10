'use client'

import { PlusIcon, TrashIcon, EyeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export function CreateAnalysis({ history_id, study_id, annotation_id }: { history_id: string, study_id: string, annotation_id: string }) {
  return (
    <Link
      href={`/dashboard/histories/${history_id}/studies/${study_id}/annotations/${annotation_id}/analyses/create/`}
      className="flex inline-block h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <PlusIcon className="h-5 md:mr-[8]" />
      <span className="hidden md:inline whitespace-nowrap">New analysis</span>{' '}
    </Link>
  );
}

export function CreateClinicalReport({ redirection }: { redirection: string }) {

  const router = useRouter();

  const handleRedirect = () => {
    router.push(redirection);
  }

  return (
    <button
      type="button"
      className="h-10 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex justify-between items-center"
      title='New report'
      onClick={handleRedirect}
    >
      <PlusIcon className="h-5 mr-2" />
      <span className="inline whitespace-nowrap mr-2 flex block text-center">
        New report
      </span>
    </button>
  );
}

export function ClinicalReports({ redirection }: { redirection: string, }) {

  const router = useRouter();

  const handleRedirect = () => {
    router.push(redirection);
  }

  return (
    <button
      type="button"
      className="w-10 h-10 aspect-square bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
      title='Clinical reports'
      onClick={handleRedirect}
    >
      <DocumentTextIcon className="h-5 w-5" />
    </button>
  );
}

export function ReviewAnalysis({ history_id, study_id, annotation_id, analysis_id }: { history_id: string, study_id: string, annotation_id: string, analysis_id:string }) {
  return (
    <Link
      href={`/dashboard/histories/${history_id}/studies/${study_id}/annotations/${annotation_id}/analyses/${analysis_id}/review/`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <EyeIcon className="w-5" />
    </Link>
  );
}
