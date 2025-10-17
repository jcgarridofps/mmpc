'use client';

import { EyeIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { newAnnotation } from '@/app/lib/data';
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export type Annotation = {
  id: string;
  appId: string;
  date: string;
  status: string;
  version: string
};

export function CreateAnnotation({ history_id, study_id }: { history_id: string, study_id:string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAction = async () => {
    startTransition(async () => {
      try {
        await newAnnotation(study_id);
        // After successful creation, navigate to annotation creation page
        router.push(
          `/dashboard/histories/${history_id}/studies/${study_id}/annotations/`
        );
      } catch (error) {
        console.error("Failed to create annotation:", error);
      }
    });
  };

  return (
    <button
      onClick={handleAction}
      disabled={isPending}
      type="button"
      className="flex inline-block h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-70"
    >
      <PlusIcon className="h-5 md:mr-[8]" />
      <span className="hidden md:inline whitespace-nowrap">
        {isPending ? "Creating..." : "New annotation"}
      </span>
    </button>
  );
}

export function ReviewAnalysis({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/variant-analysis/${id}/drug-queries`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <EyeIcon className="w-5" />
    </Link>
  );
}

export function ReviewAnnotation({ historyId, studyId, annotationId }: { historyId: string, studyId: string, annotationId: string }) {
  return (
    <Link
      href={`/dashboard/histories/${historyId}/studies/${studyId}/annotations/${annotationId}/analyses/`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <EyeIcon className="w-5" />
    </Link>
  );
}
