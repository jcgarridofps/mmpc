'use client';
import Link from 'next/link';
import {
  TagIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createReport, ReportState } from '@/app/lib/actions';
import { useActionState } from 'react';

export default function Form(
  {history_id, study_id, annotation_id, analysis_id}:{history_id:string, study_id:string, annotation_id:string, analysis_id:string},
) {
  const initialState: ReportState = { success: false, message: null, errors: {}};
  const [state, formAction] = useActionState<ReportState, FormData>(createReport, initialState);

  return (
    <form 
      action={formAction}
      onKeyDown={(e) => {
        if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") {
          e.preventDefault();
        }
      }}
      >
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* Analysis description */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Clinical report
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="clinical-report"
                name="clinical_report"
                type="text"
                placeholder="Description"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="description-error"
              />
              <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <input
                  type="hidden"
                  id="history_id"
                  name="history_id"
                  value={history_id}               
                />
          <input
                  type="hidden"
                  id="study_id"
                  name="study_id"
                  value={study_id}               
                />
          <input
                  type="hidden"
                  id="annotation_id"
                  name="annotation_id"
                  value={annotation_id}               
                />
          <input
                  type="hidden"
                  id="analysis_id"
                  name="analysis_id"
                  value={analysis_id}               
                />
          <div id="clinical-report-error" aria-live="polite" aria-atomic="true">
            {state.errors?.clinical_report &&
              state.errors.clinical_report.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div id="form-error" aria-live="polite" aria-atomic="true">
          <p className="mt-2 text-sm text-red-500">
            {state.message || ''}
          </p>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Send report</Button>
      </div>
    </form>
  );
}
