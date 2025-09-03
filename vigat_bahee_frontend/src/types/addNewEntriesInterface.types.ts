// types/addNewEntriesInterface.types.ts
export interface DataType {
  key: string;
  sno: string;
  cast: string;
  name: string;
  fathername: string;
  address: string;
  aavta: number;
  uparnet: number;
  baheeType?: string;
  baheeTypeName?: string;
  headerName?: string; // Add this for linking with bahee details
  submittedAt?: string;
}

export interface BaheeDetails {
  id: string;
  baheeType: string;
  baheeTypeName: string;
  name: string;
  date: string;
  tithi: string;
  createdAt: string;
}

export interface ReturnNetLog {
  forKey: string;
  baheeType: string;
  name: string;
  date: string;
  description: string;
  confirmToggle: boolean;
  createdAt: string;
}

export interface AddNewEntriesInterfaceProps {
  currentBaheeType?: string;
  selectedBaheeId?: string; // Add this for specific bahee selection
}

export interface BaheeTypeOption {
  value: string;
  label: string;
}