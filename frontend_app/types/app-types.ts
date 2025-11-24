export type AnalysisType = {
  analysis_type: string;
};

export type ComputationStatus = {
  computationStatus: string;
};

export type ComputationVersion = {
  state: string;
};

export type Analysis = {
  id: string;
  appId: string;
  cancerTypes: string;
  date: string;
  type: AnalysisType;
  //annotation: Annotation;
  status: string;
  version: string;
};

export type StudyProcedureType = {
  type: string;
  name: string;
}

export type StudyPhysicalCapture = {
  type: string;
  name: string;
  procedure: StudyProcedureType;
}

export type StudyVirtualCapture = {
  type: string;
  name: string;
  physical_capture: StudyPhysicalCapture;
  geneList: string;
}

export type StudyProcedureDictionary = {
  studyProcedureType: StudyProcedureType;
  studyPhysicalCapture: StudyPhysicalCapture;
  studyVirtualCapture: StudyVirtualCapture;
}