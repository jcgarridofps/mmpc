'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UserIcon,
  CalendarDaysIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { useActionState, useState } from 'react';
import { createHistory, HistoryState } from '@/app/lib/actions';

export default function Form() {

  const [patientId, setPatientId] = useState("");
  const [sex, setSex] = useState("");
  const [date, setDate] = useState("");

  const initialState: HistoryState = { success: false, message: null, errors: {} };
  const [state, formAction] = useActionState<HistoryState, FormData>(createHistory, initialState);

  const handleFormAction = async (formData: FormData) => {
    return formAction(formData);
  }

  return (
    <form
      action={handleFormAction}
      onKeyDown={(e) => {
        if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") {
          e.preventDefault();
        }
      }}
    >
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        <div className="mb-4">

          {/**PATIENT ID */}
          <label htmlFor="patient_id" className="mb-2 block text-sm font-medium">
            Patient ID
          </label>
          <div className="relative mt-2 rounded-md mb-4">
            <div className="relative">
              <input
                id="patient_id"
                name="patient_id"
                type="text"
                placeholder="Identify the patient to start the history for"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="patient-id-error"
                onChange={(e) => setPatientId(e.target.value)}
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <div id="patient-id-error" aria-live="polite" aria-atomic="true">
            {state.errors?.patient_id &&
              state.errors.patient_id.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>

          {/**PATIENT SEX */}
          <label htmlFor="patient_sex" className="mb-2 block text-sm font-medium">
            Patient sex
          </label>
          <div className="relative mt-2 rounded-md mb-4">
            <div className="relative">
              <select
                id="patient_sex"
                name="patient_sex"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="patient-sex-error"
              >
                <option value="" disabled>
                  -- Select an option --
                </option>
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
              </select>
            </div>
          </div>

          <div id="patient-sex-error" aria-live="polite" aria-atomic="true">
            {state.errors?.patient_sex &&
              state.errors.patient_sex.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>

          {/**PATIENT DATE OF BIRTH */}
          <label htmlFor="patient_date" className="mb-2 block text-sm font-medium">
            Patient date of birth
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="patient_date"
                name="patient_date"
                type='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="patient-date-error"
              />
              <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <div id="patient-date-error" aria-live="polite" aria-atomic="true">
            {state.errors?.patient_date &&
              state.errors.patient_date.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>

          <div id="form-error" aria-live="polite" aria-atomic="true">
          <p className="mt-2 text-sm text-red-500">
            {state.message || ''}
          </p>
        </div>

        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">

        <Button type="submit">
          <PaperAirplaneIcon className="h-5 md:mr-[8]" />
          Create
        </Button>
      </div>
    </form>
  );
}
