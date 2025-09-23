import {PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function CreateStudy({ history_id }: { history_id: string }) {
  return (
    <Link
      href={`/dashboard/histories/${history_id}/studies/create`}
      className="flex inline-block h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <PlusIcon className="h-5 md:mr-[8]" />
      <span className="hidden md:inline whitespace-nowrap">New study</span>{' '}
    </Link>
  );
}
