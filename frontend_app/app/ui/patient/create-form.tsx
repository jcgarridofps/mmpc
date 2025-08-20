'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CheckIcon,
  ClockIcon,
  TagIcon,
  DocumentArrowUpIcon,
  FolderIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createVariantAnalysis, State } from '@/app/lib/actions';
import { useActionState, useEffect, useRef, useState } from 'react';
import { ClassDictionary } from 'clsx';

export default function Form() {
  const router = useRouter();
  const initialState: State = { success: false, message: null, errors: {}};
  //const [state, formAction] = useActionState(createVariantAnalysis, initialState);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilePickerButton = () => {
    fileInputRef.current?.click();
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setFileName(event.target.files[0].name);
    } else {// Reset if no file is selected
      setFile(null);
      setFileName("");
    }
  }

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
      //encType='multipart/form-data'
      onKeyDown={(e) => {
        if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") {
          e.preventDefault();
        }
      }}
      >
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* PATIENT */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
              Identify the patient
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="description"
                name="description"
                type="text"
                placeholder="EN000000000"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="description-error"
              />
              <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create</Button>
      </div>
    </form>
  );
}
