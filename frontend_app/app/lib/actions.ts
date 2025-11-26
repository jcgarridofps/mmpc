"use server";
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { auth } from '@/auth';
import { signOut } from '@/auth';
import { Result } from 'postcss';
import { json } from 'stream/consumers';
import { StudyProcedureDictionary } from './definitions';

const CreateAnnotationSchema = z.object({
  id: z.string(),
  description: z
    .string({ invalid_type_error: 'Please insert a description.' })
    .max(30, { message: "Description must be at most 30 characters long." }),
  file: z.custom<File>((file) => {
    if (!(file instanceof File)) return false;
    return file.name.endsWith(".vcf");
  }, { message: "Only -vcf files are allowed" }),
  patient_identifier: z.string({
    invalid_type_error: 'Please insert a patient identifier.'
  })
    .length(11, { message: 'Please insert a correct patient identifier' }),
  cancerTypes: z.custom<string[]>((c_types) => {
    return c_types.length > 0;
  }, { message: "Please select at least one cancer type" }),
  date: z.string(),
});

const CreateStudySchema = z.object({
  description: z
    .string({ invalid_type_error: 'Please insert a description.' })
    .max(200, { message: "Description must be at most 200 characters long." }),
  sample_kind: z
    .string().min(1,'Please select sample kind.' )
    .max(30, { message: "Sample kind must be at most 30 characters long." }),
  procedure: z
    .string().min(1, 'Please select procedure.' )
    .max(64, { message: "Procedure must be at most 30 characters long." }),
  physical_capture: z
    .string({ invalid_type_error: 'Please select physical capture.' })
    .max(64, { message: "Physical capture must be at most 30 characters long." }),
  virtual_capture: z
    .string({ invalid_type_error: 'Please select virtual capture.' })
    .max(64, { message: "Virtual capture version must be at most 30 characters long." }),
  file_vcf: z
    .string().min(1, 'Missing file ID.' )
    .max(128, { message: "File ID too long." }),
});

const CreateAnalysisSchema = z.object({
  id: z.string(),
  annotation_id: z.string({
    invalid_type_error: 'Please insert an annotation ID.'
  }),
  cancer_types: z.custom<string[]>((c_types) => {
    return c_types.length > 0;
  }, { message: "Please select at least one cancer type" }),
  date: z.string(),
});

const CreateReportSchema = z.object({
  id: z.string(),
  variant_analysis_id: z.string({
    invalid_type_error: 'Incorrect type for variant analysis id.'
  }),
  drug_query_id: z.string({
    invalid_type_error: 'Incorrect type for drug query id.'
  }),
  clinical_report: z.string({
    invalid_type_error: 'Incorrect type for clinical report.'
  }),
  date: z.string(),
});

const CreateHistorySchema = z.object({
  patient_id: z
    .string({
      invalid_type_error: "Incorrect type for patient_id.",
      required_error: "Patient ID is required.",
    })
    .regex(/^EN\d{10}$/, {
      message: "Patient ID must start with 'EN' followed by 10 digits.",
    }),
  patient_sex: z.string({
    invalid_type_error: 'Incorrect type for patient sex.'
  }),
  patient_date: z.string({
    invalid_type_error: 'Incorrect type for patient date.'
  }),
});

const CreateAnnotation = CreateAnnotationSchema.omit({ id: true, date: true });
const CreateStudy = CreateStudySchema;
const CreateAnalysis = CreateAnalysisSchema.omit({ id: true, date: true });
const CreateReport = CreateReportSchema.omit({ id: true, date: true });
const CreateHistory = CreateHistorySchema;

export type ReportState = {
  success: boolean;
  errors?: {
    drug_query?: string[] | null;
    clinical_report?: string[] | null;
  };
  message?: string | null;
}

export type AnalysisState = {
  success: boolean;
  errors?: {
    annotation_id?: string[] | null;
    cancer_types?: string[] | null;
  };
  message?: string | null;
}

export type HistoryState = {
  success: boolean;
  errors?: {
    patient_id?: string[] | null;
    patient_sex?: string[] | null;
    patient_date?: string[] | null;
  };
  message?: string | null;
}

export type StudyState = {
  success: boolean;
  errors?: {
    description?: string[];
    sample_kind?: string[];
    procedure?: string[];
    physical_capture?: string[];
    virtual_capture?: string[];
    file?: string[]; //Only the file ID
  };
  message?: string | null;
  history_id: string;
  sample: string;
  procedure: string;
  physical_capture: string;
  virtual_capture: string;
}

export type State = {
  success: boolean;
  errors?: {
    file?: string[] | null;
    description?: string[] | null;
    patient_identifier?: string[] | null;
    cancerTypes?: string[] | null;
  };
  message?: string | null;
};

export async function createAnnotation(prevState: State, formData: FormData) {
  //console.log("Received FormData:", Object.fromEntries(formData.entries()));
  let file_ = formData.get("file"); //This data is loaded as a Blob, not a File instance

  let actualFileName = "uploaded.vcf"; // Default name
  for (const [key, value] of formData.entries()) {
    if (key === "file" && value instanceof File) {
      actualFileName = value.name; // Extract correct filename
    }
  }

  // Convert Blob to File if needed
  if (file_ instanceof Blob) {
    file_ = new File([file_], actualFileName, { type: file_.type });
  }

  const validatedFields = CreateAnnotation.safeParse({
    file: file_,
    description: formData.get('description'),
    patient_identifier: formData.get('patient_identifier'),
    cancerTypes: formData.getAll("ctype[]"),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Failed to create Invoice'
    };
  }

  const { file, description, patient_identifier, cancerTypes } = validatedFields.data;

  //------------------------------------------------------------------------------------

  const session = await auth();
  try {

    const formData = new FormData();
    formData.append("withPharmcat", "false");
    formData.append("vcf_file", file);
    formData.append("file_name", actualFileName);
    formData.append("patient_identifier", patient_identifier);
    formData.append("cancer_types", JSON.stringify(cancerTypes));

    const urlSafeDescription = encodeURIComponent(description);
    const result = await fetch(process.env.API_BASE_URL +
      "/api/analysis/new/?" +
      "name=" + urlSafeDescription,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`
        },
        body: formData
      });

    if (!result.ok) {
      const errorMessage = await result.json();
      console.error('Create variant analysis error:', errorMessage.message);
      return {
        ...prevState,
        success: false,
        message: errorMessage.message
      };
    }

  } catch (error) {
    console.error('Create variant analysis error:', error);
    return {
      ...prevState,
      success: false,
      message: 'Error creating variant analysis'
    };
  }

  revalidatePath('/dashboard/variant-analysis');
  redirect('/dashboard/variant-analysis/');

  //-------------------------------------------------------------------------------------------

}


export async function createStudy(prevState: StudyState, formData: FormData) {

  console.warn("ACTION CALLED");

  console.log(">>> FormData entries:");
for (const [key, value] of formData.entries()) {
  console.log(key, "=>", value);
}

  //console.log("Received FormData:", Object.fromEntries(formData.entries()));
  let vcf_file = formData.get("file_vcf"); //The file UUID

  const data2validate = {
    description: formData.get('description'),
    sample_kind: formData.get('sample_kind'),
    procedure: formData.get('procedure'),
    physical_capture: formData.get('physical_capture'),
    virtual_capture: formData.get('virtual_capture'),
    file_vcf: vcf_file,
  }

  //console.log(JSON.stringify(data2validate));

  const validatedFields = CreateStudy.safeParse(data2validate);


  console.warn("VALIDATION SUCCESS:", validatedFields.success);

  if (!validatedFields.success) {
    console.error("Zod validation failed:", validatedFields.error.format());
    return {
      ...prevState,
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Failed to create Study',
      sample: formData.get("sample_kind") as string ?? prevState.sample,
      procedure: formData.get("procedure") as string ?? prevState.procedure,
      physical_capture: formData.get("physical_capture") as string ?? prevState.sample,
      virtual_capture: formData.get("virtual_capture") as string ?? prevState.sample,
    };
  }

  const {
    description,
    sample_kind,
    procedure,
    physical_capture,
    virtual_capture,
    file_vcf,
  } = validatedFields.data;

  //------------------------------------------------------------------------------------

  const session = await auth();


  const newFormData = new FormData();
  newFormData.append("description", description);
  newFormData.append("sample_kind", sample_kind);
  newFormData.append("procedure", procedure);
  newFormData.append("physical_capture", physical_capture);
  newFormData.append("virtual_capture", virtual_capture);
  newFormData.append("sample", file_vcf); //File UUID
  newFormData.append("history_id", prevState.history_id);

  const urlSafeDescription = encodeURIComponent(description);

  let result: Response;

  try {
    result = await fetch(process.env.API_BASE_URL +
      "/api/study/new/?" +
      "name=" + urlSafeDescription,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`
        },
        body: newFormData
      });
  } catch (error) {
    //console.error('Create study error:', error);
    return {
      ...prevState,
      success: false,
      message: 'Error creating variant analysis',
      sample: prevState.sample,
      procedure: prevState.procedure,
      physical_capture: prevState.physical_capture,
      virtual_capture: prevState.virtual_capture
    };
  }

  if (!result.ok) {
    const errorMessage = await result.text();
    console.error('Create study error:', errorMessage);
    return {
      ...prevState,
      success: false,
      message: errorMessage,
      sample: prevState.sample,
      procedure: prevState.procedure,
      physical_capture: prevState.physical_capture,
      virtual_capture: prevState.virtual_capture
    };
  }
  
  const study_id: string = (await result.json()).study_id;
  console.warn("REDIRECTING NOW");
  revalidatePath(`/dashboard/histories/${prevState.history_id}/studies/${study_id}/anotations/`);
  redirect(`/dashboard/histories/${prevState.history_id}/studies/${study_id}/annotations/`);

  //-------------------------------------------------------------------------------------------

}

export async function createAnalysis(prevState: AnalysisState, formData: FormData) {

  const history_id = formData.get('history_id');
  const study_id = formData.get('study_id');

  const validatedFields = CreateAnalysis.safeParse({
    annotation_id: formData.get('annotation_id'),
    cancer_types: formData.getAll("ctype[]")
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Failed to create drug query'
    };
  }

  const { annotation_id, cancer_types } = validatedFields.data;

  //------------------------------------------------------------------------------------

  const session = await auth();
  try {

    const formData = new FormData();
    formData.append("annotation_id", annotation_id);
    formData.append("cancer_types", JSON.stringify(cancer_types));

    await fetch(process.env.API_BASE_URL +
      "/api/analysis/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`
        },
        body: formData
      });

  } catch (error) {
    console.error('Create drug query error:', error);
    //throw new Error('Failed to fetch variant analysis.');
    return {
      ...prevState,
      success: false,
      message: 'Error creating drug query'
    };
  }

  const redirectPath = `/dashboard/histories/${history_id}/studies/${study_id}/annotations/${annotation_id}/analyses/`;
  revalidatePath(redirectPath);
  redirect(redirectPath);

  //-------------------------------------------------------------------------------------------

}

export async function createReport(prevState: ReportState, formData: FormData) {

  const validatedFields = CreateReport.safeParse({
    variant_analysis_id: formData.get('variant_analysis_id'),
    drug_query_id: formData.get('drug_query_id'),
    clinical_report: formData.get('clinical_report'),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Failed to create report'
    };
  }

  const { drug_query_id, clinical_report, variant_analysis_id } = validatedFields.data;

  //------------------------------------------------------------------------------------

  const session = await auth();
  try {

    const formData = new FormData();
    formData.append("drug_query", drug_query_id);
    formData.append("clinical_prescription", clinical_report);
    formData.append("clinical_report", clinical_report);

    const result = await fetch(process.env.API_BASE_URL +
      "/api/report/new/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`
        },
        body: formData
      });

  } catch (error) {
    console.error('Create report error:', error);
    return {
      ...prevState,
      success: false,
      message: 'Error creating report'
    };
  }

  const newPath: string = `/dashboard/variant-analysis/${variant_analysis_id}/drug-queries/${drug_query_id}/clinical-reports`;
  revalidatePath(newPath);
  redirect(newPath);

  //-------------------------------------------------------------------------------------------

}

export async function createHistory(prevState: HistoryState, formData: FormData) {

  const validatedFields = CreateHistory.safeParse({
    patient_id: formData.get('patient_id'),
    patient_sex: formData.get('patient_sex'),
    patient_date: formData.get('patient_date'),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Failed to create history',
    };
  }

  const { patient_id, patient_sex, patient_date } = validatedFields.data;

  //------------------------------------------------------------------------------------

  const session = await auth();


  const newFormData = new FormData();
  newFormData.append('patient_id', patient_id);
  newFormData.append('patient_sex', patient_sex);
  newFormData.append('patient_date', patient_date);

  let result: Response;

  try {
    result = await fetch(process.env.API_BASE_URL +
      "/api/history/new/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`
        },
        body: newFormData
      });

  } catch (error) {
    console.error('Create history error:', error);
    return {
      ...prevState,
      success: false,
      message: 'Error creating history',
    };
  }

  console.error('Create history error:', result.status);

  if (result.ok) {
    const history_id: string = (await result.json()).history_id;
    const newPath: string = `/dashboard/histories/${history_id}/studies`;
    revalidatePath(newPath);
    redirect(newPath);
  }
  else {
    const server_message = await result.json();
    console.error('Create history error:', server_message);
    return {
      ...prevState,
      success: false,
      message: 'Error creating history. ' + server_message.message,
    };
  }







  //-------------------------------------------------------------------------------------------

}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: '/' });
}