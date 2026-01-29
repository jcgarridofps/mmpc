// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  user: string;
  email: string;
  password: string;
};

export type StudyProcedureType = {
  id: number;
  type: string;
  name: string;
}

export type StudyPhysicalCapture = {
  id: number;
  type: string;
  name: string;
  procedure: string; // id
}

export type StudyVirtualCapture = {
  id: number;
  type: string;
  name: string;
  physical_capture: string; // id
  geneList: string;
}

export type StudyProcedureDictionary = {
  procedure_type_entries: StudyProcedureType[];
  procedure_physical_capture_entries: StudyPhysicalCapture[];
  procedure_virtual_capture_entries: StudyVirtualCapture[];
}