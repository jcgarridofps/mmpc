'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UserIcon,
  CalendarDaysIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { useState } from 'react';

export default function Form() {

  const [sex, setSex] = useState("");
  const [date, setDate] = useState("");

  return (
    <form 
      //encType='multipart/form-data'
      onKeyDown={(e) => {
        if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") {
          e.preventDefault();
        }
      }}
      >
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        <div className="mb-4">

          {/**PATIENT ID */}
          <label htmlFor="patient" className="mb-2 block text-sm font-medium">
              Patient ID
          </label>
          <div className="relative mt-2 rounded-md mb-4">
            <div className="relative">
              <input
                id="patient"
                name="patient"
                type="text"
                placeholder="Identify the patient to start the history for"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="patient-error"
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
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

          {/**PATIENT DATE OF BIRTH */}
          <label htmlFor="date" className="mb-2 block text-sm font-medium">
              Patient date of birth
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="date"
                name="date"
                type='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="patient-date-error"
              />
              <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
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
