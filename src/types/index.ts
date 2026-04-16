import { Role, DeviceType, FormType, Shift } from "@prisma/client";

// ─── Session types ───
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

// ─── API types ───
export interface CreateEntryPayload {
  schemaId: string;
  deviceId: string;
  shift?: Shift;
  dayNumber?: number;
  responses: Record<string, any>;
  syncId?: string; // UUID from client (offline)
}

export interface CreateDevicePayload {
  patientId: string;
  type: DeviceType;
  unit: string;
  bed: string;
  insertionDate: string;
  insertionSite?: string;
  laterality?: string;
  cvcType?: string;
}

// ─── Form field types ───
export interface FieldDef {
  id: string;
  label: string;
  type: "text" | "date" | "select" | "radio" | "check" | "yesno" | "cnc" | "tristate_group";
  required?: boolean;
  hint?: string;
  options?: string[];
  items?: string[];
  conditional?: {
    field: string;
    equals?: string;
    includes?: string;
  };
}

export interface SectionDef {
  id: string;
  title: string;
  fields: FieldDef[];
}

export interface SchemaFields {
  sections: SectionDef[];
  adherenceRules: any;
  requiresShift?: boolean;
}

// ─── Re-exports ───
export { Role, DeviceType, FormType, Shift };
