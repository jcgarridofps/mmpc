"use server";

import postgres from 'postgres';
import { auth } from '@/auth';

const ITEMS_PER_PAGE = 6;

const LATEST_VARIANT_ANALYSIS_ITEMS = 5;

export async function newAnnotation(studyId: string) {

  const session = await auth();

  try {

    const res = await fetch(process.env.API_BASE_URL +
      "/api/annotation/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "Application/json"
      },
      body: JSON.stringify({
        study_id: studyId,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch external data`);
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error('Annotation could not be created: ', error);
    throw new Error('Annotation could not be created.');
  }



}

export async function fetchLatestAnnotations() {
  /**
   * Fetch latest 5 variant analysis for the user's entity group
   */
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  const session = await auth();

  try {

    const variant_analysis = await fetch(process.env.API_BASE_URL +
      "/api/annotations/?" +
      "page=1&" +
      "elements=" + LATEST_VARIANT_ANALYSIS_ITEMS,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "Application/json"
        },
      });

    let res = await variant_analysis.json();

    return res;
  } catch (error) {
    console.error('Failed to fetch latest variant analysis: ', error);
    throw new Error('Failed to fetch latest variant analysis.');
  }
}

// Fetch history by given history_appId or patient_appId
export async function fetchHistory(query: string) {
  /**
   * Fetch history by given history_appId or patient_appId
   */
  // await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log("FETCH HISTORY");

  const session = await auth();

  try {

    const history = await fetch(process.env.API_BASE_URL +
      "/api/history/?" +
      `query=${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "Application/json"
        },
      });

    let res = await history.json();

    return res;
  } catch (error) {
    console.error(`Failed to fetch history with appID ${query}.`, error);
    throw new Error(`Failed to fetch history with appID ${query}.`);
  }
}

const LATEST_ANALYSES_ITEMS = 5;
export async function fetchLatestAnalyses() {
  /**
   * Fetch latest 5 variant analysis for the user's entity group
   */
  //await new Promise((resolve) => setTimeout(resolve, 2000));
  const session = await auth();

  try {

    const drug_queries = await fetch(process.env.API_BASE_URL +
      "/api/analyses/?" +
      "page=1&" +
      "elements=" + LATEST_ANALYSES_ITEMS,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "Application/json"
        },
      });

    let res = await drug_queries.json();
    console.log(res);
    return res;
  } catch (error) {
    console.error('Failed to fetch latest analyses: ' + error);
    throw new Error('Failed to fetch latest analyses.');
  }
}

export async function fetchCardData() {
  try {

    const numberOfVariantAnalysis = await fetchAnnotationCount();
    const numberOfDrugQueries = await fetchAnalysisCount();
    const numberOfPatients = await fetchPatientCount();
    const totalReports = await fetchReportCount();
    const totalPendingAnalysis = await fetchPendingAnnotationCount();

    return {
      numberOfPatients,
      numberOfVariantAnalysis,
      numberOfDrugQueries,
      totalReports,
      totalPendingAnalysis,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

export async function fetchFilteredStudiesPages(query: string, history_id: string) {
  const session = await auth();
  const safeQuery = encodeURIComponent(query);
  try {
    const data = await fetch(process.env.API_BASE_URL +
      "/api/studies/count?" +
      "query=" + safeQuery + "&history_id=" + history_id,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "Application/json"
        },
      });
    const json_data = await data.json();

    const totalPages = Math.ceil(Number(json_data ? json_data['entry_count'] : 0) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of studies.');
  }
}

export async function fetchFilteredAnnotationsPages(query: string, study_id: string) {
  const session = await auth();
  const safeQuery = encodeURIComponent(query);
  try {
    const data = await fetch(process.env.API_BASE_URL +
      "/api/annotations/count?" +
      "query=" + safeQuery + "&study_id=" + study_id,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "Application/json"
        },
      });
    const json_data = await data.json();

    const totalPages = Math.ceil(Number(json_data ? json_data['entry_count'] : 0) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of annotations.');
  }
}

export async function fetchFilteredAnalysesPages(query: string, annotation_id: string) {
  const session = await auth();
  const safeQuery = encodeURIComponent(query);
  try {
    const data = await fetch(process.env.API_BASE_URL +
      "/api/analysis/count?" +
      "query=" + safeQuery + "&annotation_id=" + annotation_id,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "Application/json"
        },
      });
    const json_data = await data.json();

    const totalPages = Math.ceil(Number(json_data ? json_data['entry_count'] : 0) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of analyses.');
  }
}

export async function fetchFilteredReportPages(query: string, drug_query_id: string) {
  const session = await auth();
  const safeQuery = encodeURIComponent(query);
  try {
    const data = await fetch(process.env.API_BASE_URL +
      "/api/report/count?" +
      "query=" + safeQuery + "&drug_query=" + drug_query_id,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "Application/json"
        },
      });
    const json_data = await data.json();

    const totalPages = Math.ceil(Number(json_data ? json_data['entry_count'] : 0) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch number of reports for a given drug query .');
  }
}

export async function fetchFilteredAnnotations(
  query: string,
  currentPage: number,
  studyId: string
) {
  const session = await auth();
  const safeQuery = encodeURIComponent(query);
  try {
    const annotations = await fetch(process.env.API_BASE_URL +
      "/api/annotations/?" +
      "page=" + currentPage + "&" +
      "query=" + safeQuery + "&" +
      "elements=" + ITEMS_PER_PAGE + "&" +
      "studyId=" + studyId,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "Application/json"
        },
      });

    let res = await annotations.json();
    return res;
  } catch (error) {
    console.error('Fetch filtered variant analysis error:', error);
    throw new Error('Failed to fetch variant analysis.');
  }
}

export async function fetchFilteredStudies(
  query: string,
  currentPage: number,
  historyId: string,
) {
  const session = await auth();
  const safeQuery = encodeURIComponent(query);
  try {
    const studies = await fetch(process.env.API_BASE_URL +
      "/api/studies/?" +
      "page=" + currentPage + "&" +
      "query=" + safeQuery + "&" +
      "elements=" + ITEMS_PER_PAGE + "&" +
      "historyId=" + historyId,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "Application/json"
        },
      });

    let res = await studies.json();
    return res;
  } catch (error) {
    console.error('Fetch filtered studies error:', error);
    throw new Error('Failed to fetch studies.');
  }
}

export async function fetchFilteredReports(
  drug_query_id: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const session = await auth();
  try {
    const uri: string = process.env.API_BASE_URL +
      "/api/report/?" +
      "page=" + currentPage + "&" +
      "drug_query_id=" + drug_query_id + "&" +
      "elements=" + ITEMS_PER_PAGE;

    console.log("MACARENO ECHA EL FRENO:" + uri);

    const reports = await fetch(process.env.API_BASE_URL +
      "/api/report/?" +
      "page=" + currentPage + "&" +
      "drug_query_id=" + drug_query_id + "&" +
      "elements=" + ITEMS_PER_PAGE,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "Application/json"
        },
      });

    let res = await reports.json();
    return res;
  } catch (error) {
    console.error('Fetch filtered reports error:', error);
    throw new Error('Failed to fetch reports.');
  }
}

export async function fetchAnnotationCount() {
  const session = await auth();
  try {
    const annotation_count = await fetch(process.env.API_BASE_URL +
      "/api/annotations/count/",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "Application/json"
        },
      });

    try {
      let res = await annotation_count.json();
      return res['entry_count'];
    }
    catch (error) {
      console.error("ERROR: " + error);
    }

  } catch (error) {
    console.error('Fetch variant analysis count error:', error);
    throw new Error('Failed to fetch variant analysis count.');
  }
}

export async function fetchAnalysisCount() {
  const session = await auth();
  try {
    const variant_analysis_count = await fetch(process.env.API_BASE_URL +
      "/api/analysis/count/",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "Application/json"
        },
      });

    try {
      let res = await variant_analysis_count.json();
      return res['entry_count'];
    }
    catch (error) {
      console.error("ERROR: " + error);
    }

  } catch (error) {
    console.error('Fetch analysis count error:', error);
    throw new Error('Failed to fetch analysis count.');
  }
}

export async function fetchReportCount() {
  const session = await auth();
  try {
    const report_count = await fetch(process.env.API_BASE_URL +
      "/api/report/count/",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "Application/json"
        },
      });

    try {
      let res = await report_count.json();
      return res['entry_count'];
    }
    catch (error) {
      console.error("ERROR: " + error);
    }

  } catch (error) {
    console.error('Fetch report count error:', error);
    throw new Error('Failed to fetch report count.');
  }
}

export async function fetchDrugQueryResult(id: string) {
  console.log("FETCH DRUG QUERY RESULT: " + id);
  const session = await auth();
  try {
    const drug_query_result = await fetch(process.env.API_BASE_URL +
      `/api/analysis/result/?id=${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "Application/json"
        },
      });

    try {
      let res = await drug_query_result.json();
      return res;
    }
    catch (error) {
      console.error("ERROR: " + error);
    }

  } catch (error) {
    console.error('Error fetching variant analysis result:', error);
    throw new Error('Failed to fetch variant analysis result.');
  }
}

export async function fetchVariantAnalysisResult(analysis_id: string) {
  const session = await auth();
  try {
    const variant_analysis_result = await fetch(process.env.API_BASE_URL +
      `/api/annotation/result/?id=${analysis_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "Application/json"
        },
      });

    try {
      let res = await variant_analysis_result.json();
      return res;
    }
    catch (error) {
      console.error("ERROR: " + error);
    }

  } catch (error) {
    console.error('Error fetching variant analysis result:', error);
    throw new Error('Failed to fetch variant analysis result.');
  }
}

export async function fetchReportResult(id: string) {
  const session = await auth();
  try {
    const report_result = await fetch(process.env.API_BASE_URL +
      `/api/report/result/?id=${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "Application/json"
        },
      });

    try {
      let res = await report_result.json();
      return res;
    }
    catch (error) {
      console.error("ERROR: " + error);
    }

  } catch (error) {
    console.error('Error fetching report result:', error);
    throw new Error('Failed to fetch variant analysis result.');
  }
}

export async function fetchPendingAnnotationCount() {
  const session = await auth();
  try {
    const variant_analysis_count = await fetch(process.env.API_BASE_URL +
      "/api/annotations/pending/count/",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "Application/json"
        },
      });

    let res = await variant_analysis_count.json();
    return res['entry_count'];
  } catch (error) {
    console.error('Fetch pending variant analysis count error:', error);
    throw new Error('Failed to fetch pending variant analysis count.');
  }
}

export async function fetchFilteredAnalyses(
  query: string,
  currentPage: number,
  annotationId: string
) {
  const session = await auth();
  const safeQuery = encodeURIComponent(query);
  try {
    const analyses = await fetch(process.env.API_BASE_URL +
      "/api/analyses/?" +
      "page=" + currentPage + "&" +
      "query=" + safeQuery + "&" +
      "elements=" + ITEMS_PER_PAGE + "&" +
      "annotation_id=" + annotationId,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "Application/json"
        },
      });

    let res = await analyses.json();
    return res;
  } catch (error) {
    console.error('Fetch filtered drug queries error:', error);
    throw new Error('Failed to fetch drug queries.');
  }
}

export async function fetchPatientCount() {
  const session = await auth();
  try {
    const patient_count = await fetch(process.env.API_BASE_URL +
      "/api/patient/count/",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "Application/json"
        },
      });

    let res = await patient_count.json();
    return res['entry_count'];
  } catch (error) {
    console.error('Fetch patient count error:', error);
    throw new Error('Failed to fetch patient count.');
  }
}

export async function fetchPresence(gene_list: string[]) {
  let params: string = "";
  gene_list.forEach((gene) => {
    params += "gene=" + gene + '&';
  });
  params = params.substring(0, params.length - 1);

  const session = await auth();
  try {
    const presence_result = await fetch(process.env.API_BASE_URL +
      "/api/annotation/presence/?" + params,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "Application/json"
        },
      });

    let res = await presence_result.json();
    return res;
  } catch (error) {
    console.error('Fetch presence error:', error);
    throw new Error('Failed to fetch presence.');
  }
}

export async function fetchPatientByHistoryId(history_id: string) {
  const session = await auth();
  try {
    const patient_appId = await fetch(process.env.API_BASE_URL +
      `/api/history/patient/?history_id=${history_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "Application/json",
        },
      });

    let res = await patient_appId.json();
    return res['patient_appId'];
  } catch (error) {
    console.error('Fetch patient by history id error:', error);
    throw new Error('Failed to fetch patient by history id.');
  }
}

export async function fetchStudyByStudyId(study_id: string) {
  const session = await auth();
  try {
    const study = await fetch(process.env.API_BASE_URL +
      `/api/study/?study_id=${study_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "Application/json",
        },
      });

    let res = await study.json();
    return res['appId'];
  } catch (error) {
    console.error('Fetch patient by history id error:', error);
    throw new Error('Failed to fetch patient by history id.');
  }
}

export async function fetchAnnotationByAnnotationId(annotation_id: string) {
  const session = await auth();
  try {
    const annotation = await fetch(process.env.API_BASE_URL +
      `/api/annotation/?annotation_id=${annotation_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "Application/json",
        },
      });

    let res = await annotation.json();
    return res['appId'];
  } catch (error) {
    console.error('Fetch annotation by annotation id error:', error);
    throw new Error('Failed to fetch annotation by annotation id.');
  }
}

export async function fetchAnalysisByAnalysisId(analysis_id: string) {
  const session = await auth();
  try {
    const analysis = await fetch(process.env.API_BASE_URL +
      `/api/analysis/?analysis_id=${analysis_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "Application/json",
        },
      });

    let res = await analysis.json();
    return res['appId'];
  } catch (error) {
    console.error('Fetch analysis by analysis id error:', error);
    throw new Error('Failed to fetch analysis by analysis id.');
  }
}

export async function fetchPatientByHistoryAppId(history_appId: string) {
  const session = await auth();
  try {
    const patient_appId = await fetch(process.env.API_BASE_URL +
      `/api/history/patient/?history_appId=${history_appId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "Application/json",
        },
      });

    let res = await patient_appId.json();
    return res['patient_appId'];
  } catch (error) {
    console.error('Fetch patient by history appId error:', error);
    throw new Error('Failed to fetch patient by history appId.');
  }
}
