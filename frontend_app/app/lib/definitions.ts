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

export type ProcedureType = {
  type: string;
  name: string;
};

export type ProcedurePhysicalCapture = {
  type: string;
  name: string;
  procedure: ProcedureType;
}

export type ProcedureVirtualCapture = {
  type: string;
  name: string;
  physical_capture: ProcedurePhysicalCapture;
  geneList: string[];
}

export type StudyDataDictionary ={
  procedure_type_entries: ProcedureType[],
  procedure_physical_capture_entries: ProcedurePhysicalCapture[],
  procedure_virtual_capture_entries: ProcedureVirtualCapture[]
}
