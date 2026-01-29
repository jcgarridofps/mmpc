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
  UserCircleIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createAnalysis, AnalysisState } from '@/app/lib/actions';
import { useActionState, useEffect, useRef, useState } from 'react';
import { ClassDictionary } from 'clsx';

export default function Form(
  { history_id, study_id, annotation_id }: { history_id: string, study_id: string, annotation_id: string }
) {
  const router = useRouter();
  const initialState: AnalysisState = { success: false, message: null, errors: {} };
  const [state, formAction] = useActionState(createAnalysis, initialState);
  const [typeOfAnalysis, setTypeOfAnalysis] = useState("DRUG QUERY");

  const cancer_type: Map<string, boolean> = new Map<string, boolean>([
    ["Adrenal Gland", false],
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
    ["Vulva", false],
    ["Unknown type (all)", false],
  ]);

  const [cancerSelection, setCancerSelection] = useState(new Map<string, boolean>(cancer_type));
  const drugQuerySubmitButton = useRef<HTMLButtonElement | null>(null);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setCancerSelection((prev) => new Map(prev).set(value, checked)); // Create a new Map to trigger re-render
  }

  const handleSubmit = () => {
    console.log("BLANCANIEVES");
    drugQuerySubmitButton.current?.click();
  }

  return (

    <div>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/**PATIENT SEX */}
        <label htmlFor="patient_sex" className="mb-2 block text-sm font-medium">
          Type of analysis
        </label>
        <div className="relative mt-2 rounded-md mb-4">
          <div className="relative">
            <select
              id="patype_of_analysistient_sex"
              name="type_of_analysis"
              value={typeOfAnalysis}
              onChange={() => { }}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="patient-sex-error"
            >
              <option value="DRUG QUERY" disabled>
                DRUG QUERY
              </option>
              {/* <option value="DRUG QUERY">DRUG QUERY</option> */}
            </select>
          </div>
        </div>

        <form
          action={formAction}
          //encType='multipart/form-data'
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") {
              e.preventDefault();
            }
          }}
        >


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

          <div id="annotation-id-error" aria-live="polite" aria-atomic="true">
            {state.errors?.annotation_id &&
              state.errors.annotation_id.map((error: string) => (
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

          <div className="mt-6 flex justify-end gap-4 hidden">
            <button ref={drugQuerySubmitButton} type="submit">Analyze</button>
          </div>
        </form>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Button type="button" onClick={handleSubmit}>
          <PaperAirplaneIcon className="h-5 md:mr-[8]" />
          Create
        </Button>
      </div>
    </div>


  );
}
