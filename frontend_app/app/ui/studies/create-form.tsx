'use client';
import Link from 'next/link';
import {
  TagIcon,
  DocumentArrowUpIcon,
  DocumentTextIcon,
  FolderIcon,
  UserIcon,
  PaperAirplaneIcon,
  EyeDropperIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createStudy, StudyState } from '@/app/lib/actions';
import { useActionState, useRef, useState } from 'react';
import { json } from 'stream/consumers';
import { startTransition } from "react";


export default function Form({
  patient_appId,
  history_id,
}: {
  patient_appId: string;
  history_id: string;
}) {
  const initialState: StudyState = { success: false, message: null, errors: {}, history_id: history_id };
  const [state, formAction] = useActionState<StudyState, FormData>(createStudy, initialState);
  const [fileName, setFileName] = useState<string>("");
  const [geneFileName, setGeneFileName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");


  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileNameRef = useRef<HTMLInputElement>(null);
  const geneFileInputRef = useRef<HTMLInputElement>(null);
  const geneFileNameRef = useRef<HTMLInputElement>(null);

  const handleVCFFileButton = () => {
    fileInputRef.current?.click();
  }

  const handleGENEFileButton = () => {
    geneFileInputRef.current?.click();
  }

  const [description, setDescription] = useState<string>("");
  const [sampleKind, setSampleKind] = useState("DEFAULT");
  const [procedure, setProcedure] = useState("DEFAULT");
  const [panelVersion, setPanelVersion] = useState("DEFAULT");
  const [exomeCapture, setExomeCapture] = useState("DEFAULT");
  const [name, setName] = useState("");

  //console.log(file?.name);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handle file change");
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
      setFile(event.target.files[0]);
      console.log("file selected");
    } else {// Reset if no file is selected
      setFileName("");
      setFile(null);
      console.log("file not selected");
    }
  }

  const handleGeneFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setGeneFileName(event.target.files[0].name);
    } else {// Reset if no file is selected
      setGeneFileName("");
    }
  }

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value && event.target.value.length > 0) {
      setDescription(event.target.value);
    } else {// Reset if no file is selected
      setDescription("");
    }
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value && event.target.value.length > 0) {
      setName(event.target.value);
    } else {// Reset if no file is selected
      setDescription("");
    }
  }

  const handleSampleKindChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value) {
      setSampleKind(event.target.value);
    }
  }

  const handlePanelVersionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value) {
      setPanelVersion(event.target.value);
    }
  }

  const handleExomeCaptureChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value) {
      setExomeCapture(event.target.value);
    }
  }

  const handleProcedureChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value) {
      setProcedure(event.target.value);
    }
  }

  async function hashFileSHA256(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);

    // Convert ArrayBuffer → hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    return hashHex;
  }

  const handleFormAction = async (formData: FormData) => {
    setFileName("");

    // UPLOAD FILE
    let sha = '';

    if (file) {
      setIsUploading(true);
      setMessage("Uploading file...");

      sha = await hashFileSHA256(file);
    }


    let upload_res: Response = new Response();
    let updated_form_data: FormData = new FormData();

    try {
      const uploadFormData = new FormData();
      if (file) uploadFormData.append("file", file);
      const headers = {
        "x-file-sha256": sha,
      }

      upload_res = await fetch("/api/upload-proxy", {
        method: "POST",
        body: uploadFormData,
        headers: headers,
      });

      let uploaded_file_id = '';
      if (upload_res.ok) {
        setMessage("✅ Upload successful!");

        const res_json = await upload_res.json();
        uploaded_file_id = res_json.file_id;
      }

      //let updated_form_data = formData;
      //updated_form_data.append("file_vcf", uploaded_file_id);
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) continue; // do NOT forward files
        updated_form_data.append(key, value.toString());
      }
      updated_form_data.append("file_vcf", uploaded_file_id);

    } catch (err) {
      setMessage("❌ Upload failed");
    } finally {
      setIsUploading(false);
    }

    startTransition(() => {
      formAction(updated_form_data);
    });
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

        <div className="text-sm block w-full flex mb-4">
          <p className="font-medium">Patient ID:</p>
          <p className="text-gray-500 ml-1">{patient_appId}</p>
        </div>

        {/* Study description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Study description
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <textarea
                id="description"
                name="description"
                placeholder="Give the study a brief description."
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 min-h-[6rem]"
                aria-describedby="description-error"
                value={description}
                onChange={handleDescriptionChange}
              />
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-5 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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

        {/**SAMPLE */}
        <label htmlFor="sample_kind" className="mb-2 block text-sm font-medium">
          Sample
        </label>
        <div className="relative mt-2 rounded-md mb-4">
          <div className="relative">
            <select
              id="sample_kind"
              name="sample_kind"
              value={sampleKind}
              onChange={handleSampleKindChange}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="sample-kind-error"
            >
              <option value="DEFAULT" disabled>--Select sample kind--</option>
              <option value="BLOOD">BLOOD</option>
              <option value="BIOPSY">BIOPSY</option>
            </select>
            <EyeDropperIcon className="pointer-events-none absolute left-3 top-5 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>

        {/**PROCEDURE */}
        <label htmlFor="procedure" className="mb-2 block text-sm font-medium">
          Procedure
        </label>
        <div className="relative mt-2 rounded-md mb-4">
          <div className="relative">
            <select
              id="procedure"
              name="procedure"
              value={procedure}
              onChange={handleProcedureChange}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="sample-kind-error"
            >
              <option value="DEFAULT" disabled>--Select procedure--</option>
              <option value="GENOME">GENOME</option>
              <option value="WHOLE_EXOME">WHOLE EXOME</option>
              <option value="CLINICAL_EXOME">CLINICAL EXOME</option>
              <option value="PANEL">PANEL</option>
            </select>
            <FunnelIcon className="pointer-events-none absolute left-3 top-5 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>

        {/**PANEL VERSION (ONLY FOR PANEL) */}
        {procedure === "PANEL" &&
          (
            <div>
              <label htmlFor="panel_version" className="mb-2 block text-sm font-medium">
                Panel version
              </label>
              <div className="relative mt-2 rounded-md mb-4">
                <div className="relative">
                  <select
                    id="panel_version"
                    name="panel_version"
                    value={panelVersion}
                    onChange={handlePanelVersionChange}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    aria-describedby="sample-kind-error"
                  >
                    <option value="DEFAULT" disabled>--Select panel version--</option>
                    <option value="VERSION X1">VERSION X1</option>
                    <option value="VERSION X2">VERSION X2</option>
                    <option value="VERSION X3">VERSION X3</option>
                  </select>
                  {/* <FunnelIcon className="pointer-events-none absolute left-3 top-5 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
                </div>
              </div>
            </div>
          )
        }


        {/**EXOME CAPTURE (ONLY FOR WHOLE EXOME AND CLINICAL EXOME) */}
        {(procedure === "WHOLE_EXOME" || procedure === "CLINICAL_EXOME") &&
          (
            <div>
              <label htmlFor="exome_capture" className="mb-2 block text-sm font-medium">
                Exome capture
              </label>
              <div className="relative mt-2 rounded-md mb-4">
                <div className="relative">
                  <select
                    id="exome_capture"
                    name="exome_capture"
                    value={exomeCapture}
                    onChange={handleExomeCaptureChange}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    aria-describedby="sample-kind-error"
                  >
                    <option value="DEFAULT" disabled>--Select procedure--</option>
                    <option value="OPT1">OPT1</option>
                    <option value="OPT2">OPT2</option>
                    <option value="OPT3">OPT3</option>
                  </select>
                  {/* <FunnelIcon className="pointer-events-none absolute left-3 top-5 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
                </div>
              </div>
            </div>
          )
        }

        {/* CSV GENE LIST FILE (ONLY FOR CLINICAL EXOME AND PANEL) */}
        {(procedure === "CLINICAL_EXOME" || procedure === "PANEL") &&
          (
            <div>
              <div className="mb-4">
                <label htmlFor="file" className="mb-2 block text-sm font-medium">
                  .csv gene list file
                </label>
                <div className="flex items-center space-x-2">
                  <div className="relative w-full">
                    <input
                      id="gene_list_file_name"
                      name="gene_list_file_name"
                      type="text"
                      placeholder="Upload file"
                      className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                      aria-describedby="file-error"
                      readOnly
                      ref={geneFileNameRef}
                      value={geneFileName}

                    />

                    <input
                      type="file"
                      name="gene_list_file"
                      accept=".csv"
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full hidden"
                      ref={geneFileInputRef}
                      onChange={handleGeneFileChange}
                    />

                    <DocumentArrowUpIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                      onClick={handleGENEFileButton}
                    >
                      <FolderIcon className="h-5" />
                      <span className="mr-2">
                      </span> Browse...
                    </button>
                  </div>

                </div>

              </div>
            </div>
          )
        }


        {/* VCF file */}
        <div className="mb-4">
          <label htmlFor="file" className="mb-2 block text-sm font-medium">
            .vcf variants file
          </label>
          <div className="flex items-center space-x-2">
            <div className="relative w-full">
              <input
                id="file_name"
                type="text"
                placeholder="Upload file"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="file-error"
                readOnly
                ref={fileNameRef}
                value={fileName}

              />

              <input
                type="file"
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
                onClick={handleVCFFileButton}
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

        {/* NAME */}
        {/*
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Set a name or identifier to the new analysis"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="description-error"
                value={name}
                onChange={handleNameChange}
              />
              <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.description &&
              state.errors.description.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div> */}

        <div id="form-error" aria-live="polite" aria-atomic="true">
          <p className="mt-2 text-sm text-red-500">
            {state.message || ''}
          </p>
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
