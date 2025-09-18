"use server";
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { auth } from '@/auth';
import { signOut } from '@/auth';

const CreateAnalysisSchema = z.object({
  id: z.string(),
  description: z
    .string({ invalid_type_error:  'Please insert a description.'})
    .max(30, {message: "Description must be at most 30 characters long."}),
  file: z.custom<File>((file) =>{
    if(!(file instanceof File)) return false;
    return file.name.endsWith(".vcf");
  }, {message: "Only -vcf files are allowed"}),
  patient_identifier: z.string({ 
    invalid_type_error:  'Please insert a patient identifier.'})
    .length(11,{message: 'Please insert a correct patient identifier'}),
  cancerTypes: z.custom<string[]>((c_types) =>{
    return c_types.length > 0;
  }, {message: "Please select at least one cancer type"}),
  date: z.string(),
});

const CreateDrugQuerySchema = z.object({
  id: z.string(),
  variant_analysis_id: z.string({ 
    invalid_type_error:  'Please insert a variant analysis identifier.'}),    
  cancer_types: z.custom<string[]>((c_types) =>{
    return c_types.length > 0;
  }, {message: "Please select at least one cancer type"}),
  date: z.string(),
});

const CreateReportSchema = z.object({
  id: z.string(),
  variant_analysis_id: z.string({ 
    invalid_type_error:  'Incorrect type for variant analysis id.'}),
  drug_query_id: z.string({ 
    invalid_type_error:  'Incorrect type for drug query id.'}),
  clinical_report: z.string({ 
    invalid_type_error:  'Incorrect type for clinical report.'}),
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
    invalid_type_error:  'Incorrect type for patient sex.'}),
  patient_date: z.string({ 
    invalid_type_error:  'Incorrect type for patient date.'}),
});

const CreateAnalysis = CreateAnalysisSchema.omit({id: true, date: true});
const CreateDrugQuery = CreateDrugQuerySchema.omit({id: true, date: true});
const CreateReport = CreateReportSchema.omit({id: true, date: true});
const CreateHistory = CreateHistorySchema;

export type ReportState = {
  success:boolean;
  errors?: {
    drug_query?: string[] | null;
    clinical_report?: string[] | null;
  };
  message?: string | null;
}

export type DrugQueryState = {
  success:boolean;
  errors?: {
    variant_analysis_id?: string[] | null;
    cancer_types?: string[] | null;
  };
  message?: string | null;
}

export type HistoryState = {
  success:boolean;
  errors?: {
    patient_id?: string[] | null;
    patient_sex?: string[] | null;
    patient_date?: string[] | null;
  };
  message?: string | null;
}

export type State = {
  success:boolean;
  errors?: {
    file?: string[] | null;
    description?: string[] | null;
    patient_identifier?: string[] | null;
    cancerTypes?: string[] | null;
  };
  message?: string | null;
};

export async function createVariantAnalysis(prevState: State, formData: FormData) {
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

  const validatedFields = CreateAnalysis.safeParse({
    file: file_,
    description: formData.get('description'),
    patient_identifier: formData.get('patient_identifier'),
    cancerTypes: formData.getAll("ctype[]"),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      success:false,
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
          body:formData
      });

      if (!result.ok)
      {
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

export async function createDrugQuery(prevState: DrugQueryState, formData: FormData) {

  const validatedFields = CreateDrugQuery.safeParse({
    variant_analysis_id: formData.get('variant_analysis_id'),
    cancer_types: formData.getAll("ctype[]")
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      success:false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Failed to create drug query'
    };
  }

  const { variant_analysis_id, cancer_types } = validatedFields.data;

//------------------------------------------------------------------------------------

    const session = await auth();
    try {

      const formData = new FormData();
      formData.append("variant_analysis_id", variant_analysis_id);
      formData.append("cancer_types", JSON.stringify(cancer_types));

      await fetch(process.env.API_BASE_URL + 
        "/api/analysis/",
      {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`
          },
          body:formData
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

    const redirectPath = `/dashboard/variant-analysis/${variant_analysis_id}/drug-queries`;
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
      success:false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Failed to create report'
    };
  }

  const { drug_query_id, clinical_report, variant_analysis_id} = validatedFields.data;

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
          body:formData
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

//TODO
export async function createHistory(prevState: HistoryState, formData: FormData) {

  const validatedFields = CreateReport.safeParse({
    variant_analysis_id: formData.get('variant_analysis_id'),
    drug_query_id: formData.get('drug_query_id'),
    clinical_report: formData.get('clinical_report'),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      success:false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Failed to create report'
    };
  }

  const { drug_query_id, clinical_report, variant_analysis_id} = validatedFields.data;

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
          body:formData
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