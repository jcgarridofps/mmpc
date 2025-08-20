'use client';
import Link from 'next/link';
import {
  TagIcon,
  DocumentArrowUpIcon,
  FolderIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createVariantAnalysis, State } from '@/app/lib/actions';
import { useActionState, useRef, useState } from 'react';

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

export default function Form() {
  const initialState: State = { success: false, message: null, errors: {}};
  const [state, formAction] = useActionState<State, FormData>(createVariantAnalysis, initialState);
  const [fileName, setFileName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [patientIdentifier, setPatientIdentifier] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileNameRef = useRef<HTMLInputElement>(null);

  const handleFilePickerButton = () => {
    fileInputRef.current?.click();
  }

  //console.log(file?.name);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    } else {// Reset if no file is selected
      setFileName("");
    }
  }

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
    if (event.target.value && event.target.value.length > 0) {
      setDescription(event.target.value);
    } else {// Reset if no file is selected
      setDescription("");
    }
  }

  const handlePatientIdentifierChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
    if (event.target.value && event.target.value.length > 0) {
      setPatientIdentifier(event.target.value);
    } else {// Reset if no file is selected
      setPatientIdentifier("");
    }
  }

  const [cancerSelection, setCancerSelection] = useState<{ [key: string]: boolean }>(() => {
  const obj: { [key: string]: boolean } = {};
  for (const [key, value] of cancer_type.entries()) {
    obj[key] = value;
  }
  return obj;
});

  const handleFormAction = async (formData: FormData)=>{
    setFileName("");
    return formAction(formData);
  }

  return (
    <form 
      action={handleFormAction}
      //encType='multipart/form-data'
      onKeyDown={(e) => {
        if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") {
          e.preventDefault();
        }
      }}
      >
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* VCF file */}
        <div className="mb-4">
          <label htmlFor="file" className="mb-2 block text-sm font-medium">
            Select .vcf variants file
          </label>
          <div className="flex items-center space-x-2">
            <div className="relative w-full">
              <input
                id="file"
                name="fileName"
                type="text"
                placeholder=" "
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="file-error"
                readOnly
                ref={fileNameRef}
                value={fileName}
                
              />

              <input
                type="file"
                name="file"
                accept=".vcf"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />

              <DocumentArrowUpIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div className="relative">
              <button
                type="button"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                onClick={handleFilePickerButton}
              >
                <FolderIcon className="h-5" />
                <span className="mr-2">
                </span> Browse...
              </button>
            </div>

          </div>

        </div>


        <div id="file-error" aria-live="polite" aria-atomic="true">
          {state.errors?.file &&
            state.errors.file.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>

        {/* Analysis description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Set a name or description to the new analysis
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="description"
                name="description"
                type="text"
                placeholder="Description"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="description-error"
                value={description}
                onChange={handleDescriptionChange}
              />
              <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="description-error" aria-live="polite" aria-atomic="true">
            {state.errors?.description &&
              state.errors.description.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* PATIENT */}
        <div className="mb-4">
          <label htmlFor="patient_identifier" className="mb-2 block text-sm font-medium">
              Identify the patient
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="patient_identifier"
                name="patient_identifier"
                type="text"
                placeholder="EN000000000"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="patient_identifier-error"
                value={patientIdentifier}
                onChange={handlePatientIdentifierChange}
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="patient-identifier-error" aria-live="polite" aria-atomic="true">
            {state.errors?.patient_identifier &&
              state.errors.patient_identifier.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>


        {/* Cancer types */}
        <div className="mb-4">
          <label htmlFor="cancer_types" className="mb-2 block text-sm font-medium">
            Select one or more cancer types
          </label>
          <div className="relative grid grid-cols-4 grid-flow-row gap-2">
            {Object.entries(cancerSelection).map(([ctype], index) => (
              <div className="" key={index}>
                <input
                  type="checkbox"
                  id={`ctype-${index}`}
                  name="ctype[]"
                  value={ctype}
                />
                <label className="ml-2">
                  {ctype}
                </label>
              </div>
            ))}
            {/* <DocumentArrowUpIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" /> */}
          </div>
        </div>

        <div id="cancer-types-error" aria-live="polite" aria-atomic="true">
            {state.errors?.cancerTypes &&
              state.errors.cancerTypes.map((error: string) => (
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
          href="/dashboard/variant-analysis"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Analyze</Button>
      </div>
    </form>
  );
}
