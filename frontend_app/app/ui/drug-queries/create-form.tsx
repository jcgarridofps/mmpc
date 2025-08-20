'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CheckIcon,
  ClockIcon,
  TagIcon,
  DocumentArrowUpIcon,
  FolderIcon,
  UserIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createDrugQuery, DrugQueryState } from '@/app/lib/actions';
import { useActionState, useEffect, useRef, useState } from 'react';
import { ClassDictionary } from 'clsx';

export default function Form(
  {id}:{id:string}
) {
  const router = useRouter();
  const initialState: DrugQueryState = { success: false, message: null, errors: {}};
  const [state, formAction] = useActionState(createDrugQuery, initialState);

  const cancer_type: Map<string, boolean> = new Map<string, boolean>([
    ["Adrenal Gland",false],
    ["Bile Duct", false],
    ["Bladder", false],
    ["Blood", false],
    ["Blood And Lymph Vessels", false],
    ["Bone", false],
    ["Bone Marrow", false],
    ["Brain", false],
    ["Breast", false],
    ["Colon", false],
    ["Esophagus", false],
    ["Eye", false],
    ["Fallopian Tube", false],
    ["Fatty Tissue", false],
    ["Head And Neck", false],
    ["Intestine", false],
    ["Kidney", false],
    ["Liver", false],
    ["Lung", false],
    ["Mesothelium", false],
    ["Neuroendocrine System", false],
    ["Ovary", false],
    ["Pancreas", false],
    ["Penis", false],
    ["Peritoneum", false],
    ["Prostate", false],
    ["Rectum", false],
    ["Skin", false],
    ["Smooth Muscle", false],
    ["Soft Tissue", false],
    ["Spinal Cord", false],
    ["Stomach", false],
    ["Suprarenal Gland", false],
    ["Testis", false],
    ["Thyroid", false],
    ["Uterus", false],
    ["Vulva", false]
  ]);

  const [cancerSelection, setCancerSelection] = useState(new Map<string, boolean>(cancer_type));

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setCancerSelection((prev) => new Map(prev).set(value, checked)); // Create a new Map to trigger re-render
  }

  return (
    <form 
      action={formAction}
      //encType='multipart/form-data'
      onKeyDown={(e) => {
        if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") {
          e.preventDefault();
        }
      }}
      >
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* Cancer types */}
        <div className="mb-4">
          <label htmlFor="cancer_selection" className="mb-2 block text-sm font-medium">
            Select one or more cancer types
          </label>
          <div className="relative grid grid-cols-4 grid-flow-row gap-2">
            {[...cancer_type.keys()].map((ctype, index) => (
              <div className="" key={index}>
                <input
                  type="checkbox"
                  id={`${ctype}_${index}`}
                  name="ctype[]"
                  value={ctype}
                  //checked={false}
                  onChange={handleCheckboxChange}
                />
                <label className="ml-2">
                  {ctype}
                </label>
              </div>
            ))}
            {/* <DocumentArrowUpIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" /> */}
          </div>
          {/* <div id="customer-error" aria-live="polite" aria-atomic="true">
            {state.errors?.customerId &&
              state.errors.customerId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div> */}
        </div>

        <input
                  type="hidden"
                  id="variant_analysis_id"
                  name="variant_analysis_id"
                  value={id}               
                />

        <div id="variant-analysis-id-error" aria-live="polite" aria-atomic="true">
          {state.errors?.variant_analysis_id &&
            state.errors.variant_analysis_id.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>

        <div id="cancer-types-error" aria-live="polite" aria-atomic="true">
          {state.errors?.cancer_types &&
            state.errors.cancer_types.map((error: string) => (
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
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Analyze</Button>
      </div>
    </form>
  );
}
