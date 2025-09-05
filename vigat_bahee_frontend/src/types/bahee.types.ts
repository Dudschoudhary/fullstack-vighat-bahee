// types/bahee.types.ts
export interface BaheeDetails {
    _id?: string;
    baheeType: string;
    baheeTypeName: string;
    name: string;
    date: string;
    tithi: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface BaheeEntry {
    _id?: string;
    baheeType: string;
    baheeTypeName: string;
    headerName: string;
    sno?: string;
    caste: string;
    name: string;
    fatherName: string;
    villageName: string;
    income: number;
    amount?: number | null;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
    baheeDetails_ids?:string
  }
  
  export interface BaheeDetailsCreateRequest {
    baheeType: string;
    baheeTypeName: string;
    name: string;
    date: string;
    tithi: string;
  }
  
  export interface BaheeEntryCreateRequest {
    baheeType: string;
    baheeTypeName: string;
    headerName: string;
    sno?: string;
    caste: string;
    name: string;
    fatherName: string;
    villageName: string;
    income: number;
    amount?: number;
  }
  
  export interface FormData {
    sno: string;
    caste: string;
    name: string;
    fatherName: string;
    villageName: string;
    income: string;
    amount: string;
  }
  
  export interface FormErrors {
    [key: string]: string;
  }
  
  export interface LocationState {
    baheeType?: string;
    baheeTypeName?: string;
    existingBaheeData?: BaheeDetails;
  }