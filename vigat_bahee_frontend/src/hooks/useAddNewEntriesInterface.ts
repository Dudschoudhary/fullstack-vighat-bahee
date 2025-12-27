// hooks/useAddNewEntriesInterface.ts
import { useState, useEffect, useMemo, useCallback } from 'react';
import { message } from 'antd';
import baheeApiService from '../services/baheeApiService';
import type { DataType, BaheeDetails, ReturnNetLog } from '../types/addNewEntriesInterface.types';

export const useAddNewEntriesInterface = (currentBaheeType?: string, selectedBaheeId?: string) => {
  // ✅ Enhanced State Management
  const [data, setData] = useState<DataType[]>([]);
  const [baheeDetails, setBaheeDetails] = useState<BaheeDetails[]>([]);
  const [returnNetLogs, setReturnNetLogs] = useState<ReturnNetLog[]>([]);
  const [selectedBaheeType, setSelectedBaheeType] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // ✅ FIXED: Enhanced data loading with proper error handling
  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // ✅ FIXED: Load bahee details with proper response structure
      try {
        const baheeResponse = await baheeApiService.getAllBaheeDetails();

        if (baheeResponse.success && baheeResponse.data) {
          // ✅ FIXED: Handle both array and object responses
          let baheeArray = [];
          if (Array.isArray(baheeResponse.data)) {
            baheeArray = baheeResponse.data;
          } else if (baheeResponse.data.baheeDetails_ids) {
            baheeArray = baheeResponse.data.baheeDetails_ids;
          } else {
            baheeArray = [];
          }

          const formattedBaheeDetails = baheeArray.map((item: any, index: number) => ({
            id: item._id || item.id || `bahee-${index}`,
            baheeType: item.baheeType || '',
            baheeTypeName: item.baheeTypeName || item.baheeType || 'अज्ञात प्रकार',
            name: item.name || `बिना नाम ${index + 1}`,
            date: item.date || new Date().toISOString().split('T')[0],
            tithi: item.tithi || '',
            createdAt: item.createdAt || new Date().toISOString()
          }));

          setBaheeDetails(formattedBaheeDetails);
        } else {
          setBaheeDetails([]);
        }
      } catch (baheeError) {
        console.error('❌ Error loading bahee details:', baheeError);
        setBaheeDetails([]);
      }

      // ✅ FIXED: Load bahee entries with enhanced error handling
      try {
        const entriesResponse = await baheeApiService.getAllBaheeEntries();

        if (entriesResponse.success && entriesResponse.data) {
          // ✅ FIXED: Handle different response structures
          let entriesArray = [];
          if (Array.isArray(entriesResponse.data)) {
            entriesArray = entriesResponse.data;
          } else if (entriesResponse.data.entries) {
            entriesArray = entriesResponse.data.entries;
          } else if (entriesResponse.data.baheeEntries) {
            entriesArray = entriesResponse.data.baheeEntries;
          } else {
            entriesArray = [];
          }

          const formattedEntries = entriesArray.map((entry: any, index: number) => ({
            key: entry._id || entry.id || entry.submittedAt || `entry-${Date.now()}-${index}`,
            sno: (index + 1).toString(),
            // ✅ FIXED: Enhanced field mapping with fallbacks
            cast: entry.caste || entry.cast || entry.jati || '',
            name: entry.name || entry.personName || '',
            fathername: entry.fatherName || entry.fathername || entry.pitaName || '',
            address: entry.villageName || entry.address || entry.village || entry.gaon || '',
            aavta: Number(entry.income || entry.aavta || entry.amount1 || 0),
            uparnet: Number(entry.amount || entry.uparnet || entry.amount2 || 0),
            baheeType: entry.baheeType || '',
            baheeTypeName: entry.baheeTypeName || entry.baheeType || '',
            headerName: entry.headerName || entry.baheeHeaderName || '',
            isLocked: entry.isLocked === true,
            lockDate: entry.lockDate || null,
            lockDescription: entry.lockDescription || "",
            submittedAt: entry.submittedAt || entry.createdAt || new Date().toISOString()
          }));

          // ✅ FIXED: Filter out invalid entries
          const validEntries = formattedEntries.filter((entry:any)=> 
            entry.name && entry.name.trim() !== ''
          );

          setData(validEntries);
        } else {
          setData([]);
        }
      } catch (entriesError) {
        console.error('❌ Error loading entries:', entriesError);
        setData([]);
      }

      // ✅ FIXED: Load return net logs with fallback
      try {
        // Try to get from API first
        let returnNetLogs: ReturnNetLog[] = [];
        
        try {
          const returnNetResponse = await baheeApiService.getAllReturnNetLogs();
          if (returnNetResponse.success && returnNetResponse.data) {
            returnNetLogs = Array.isArray(returnNetResponse.data) 
              ? returnNetResponse.data 
              : [];
          }
        } catch (apiError) {
        }

        // Fallback to localStorage
        if (returnNetLogs.length === 0) {
          const storedLogs = localStorage.getItem('returnNetLogs');
          if (storedLogs) {
            try {
              returnNetLogs = JSON.parse(storedLogs);
            } catch (parseError) {
              console.error('❌ Error parsing stored return net logs:', parseError);
              returnNetLogs = [];
            }
          }
        }

        setReturnNetLogs(returnNetLogs);
        
        // ✅ FIXED: Set locked keys properly
        
      } catch (returnNetError) {
        console.error('❌ Error loading return net logs:', returnNetError);
        setReturnNetLogs([]);
      }

      // ✅ FIXED: Set default bahee type with validation
      const detectedType = currentBaheeType || detectCurrentBaheeType();
      if (detectedType && detectedType.trim() !== '') {
        setSelectedBaheeType(detectedType);
      }

    } catch (error: any) {
      console.error('❌ Critical error loading data:', error);
      const errorMessage = error?.message || 'डेटा लोड करने में त्रुटि';
      setError(errorMessage);
      message.error(errorMessage);
      
      // ✅ FIXED: Ensure clean state on error
      setData([]);
      setBaheeDetails([]);
      setReturnNetLogs([]);
    } finally {
      setLoading(false);
    }
  }, [currentBaheeType]);

  // ✅ FIXED: Enhanced bahee type detection
  const detectCurrentBaheeType = (): string | null => {
    try {
      // Check URL first
      const currentPath = window.location.pathname;
      if (currentPath.includes('/vivah')) return 'vivah';
      if (currentPath.includes('/muklawa')) return 'muklawa';
      if (currentPath.includes('/odhawani')) return 'odhawani';
      if (currentPath.includes('/mahera')) return 'mahera';
      if (currentPath.includes('/anya')) return 'anya';

      // Check localStorage
      const currentPageContext = localStorage.getItem('currentBaheeContext');
      if (currentPageContext) return currentPageContext;

      // Check sessionStorage
      const sessionContext = sessionStorage.getItem('selectedBaheeType');
      if (sessionContext) return sessionContext;

      return null;
    } catch (error) {
      console.error('❌ Error detecting bahee type:', error);
      return null;
    }
  };

  // ✅ Load data on mount and when dependencies change
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // ✅ FIXED: Enhanced update entry with better error handling
  const updateEntry = useCallback(
    async (updatedEntry: DataType): Promise<boolean> => {
      try {
        setLoading(true);
  
        const updatePayload = {
          caste: updatedEntry.cast,
          name: updatedEntry.name,
          fatherName: updatedEntry.fathername,
          villageName: updatedEntry.address,
          income: Number(updatedEntry.aavta),
          amount: Number(updatedEntry.uparnet),
          baheeType: updatedEntry.baheeType,
          baheeTypeName: updatedEntry.baheeTypeName,
          headerName: updatedEntry.headerName,
          isLocked: updatedEntry.isLocked,
          lockDate: updatedEntry.lockDate,
          lockDescription: updatedEntry.lockDescription,
        };
  
        const response = await baheeApiService.updateBaheeEntry(
          updatedEntry.key,
          updatePayload
        );
  
        if (response.success) {
          setData(prevData =>
            prevData.map(row =>
              row.key === updatedEntry.key
                ? { ...row, ...updatedEntry }
                : row
            )
          );
  
          message.success("रिकॉर्ड सफलतापूर्वक अपडेट हो गया");
          return true;
        } else {
          throw new Error(response.message || "Update failed");
        }
      } catch (error: any) {
        console.error("❌ Error updating entry:", error);
        message.error(
          error?.response?.data?.message ||
            error?.message ||
            "रिकॉर्ड अपडेट करने में त्रुटि"
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ✅ FIXED: Enhanced delete entry
  const deleteEntry = useCallback(async (entryKey: string): Promise<boolean> => {
    try {
      setLoading(true);

      const response = await baheeApiService.deleteBaheeEntry(entryKey);
      
      if (response.success) {
        // ✅ FIXED: Update local state immediately
        setData(prevData => prevData.filter(r => r.key !== entryKey));
        
        message.success("रिकॉर्ड सफलतापूर्वक डिलीट हो गया");
        return true;
      } else {
        throw new Error(response.message || 'Delete failed');
      }
    } catch (error: any) {
      console.error('❌ Error deleting entry:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'रिकॉर्ड डिलीट करने में त्रुटि';
      message.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ FIXED: Enhanced update bahee details
  const updateBaheeDetails = useCallback(async (updatedBahee: BaheeDetails): Promise<boolean> => {
    try {
      setLoading(true);

      const updatePayload = {
        baheeType: updatedBahee.baheeType,
        baheeTypeName: updatedBahee.baheeTypeName,
        name: updatedBahee.name,
        date: updatedBahee.date,
        tithi: updatedBahee.tithi
      };

      const response = await baheeApiService.updateBaheeDetails(updatedBahee.id, updatePayload);
      
      if (response.success) {
        // ✅ FIXED: Update bahee details state
        setBaheeDetails(prevDetails => 
          prevDetails.map(b => b.id === updatedBahee.id ? updatedBahee : b)
        );
        
        // ✅ FIXED: Update related entries
        setData(prevData =>
          prevData.map(entry =>
            entry.baheeType === updatedBahee.baheeType && entry.headerName === updatedBahee.name
              ? { ...entry, baheeTypeName: updatedBahee.baheeTypeName }
              : entry
          )
        );
        
        message.success("बही विवरण सफलतापूर्वक अपडेट हो गया");
        return true;
      } else {
        throw new Error(response.message || 'Update failed');
      }
    } catch (error: any) {
      console.error('❌ Error updating bahee details:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'बही विवरण अपडेट करने में त्रुटि';
      message.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ FIXED: Enhanced add return net log
  const addReturnNetLog = useCallback(async (logData: Omit<ReturnNetLog, 'createdAt'>): Promise<boolean> => {
    try {
      setLoading(true);

      const newLog: ReturnNetLog = {
        ...logData,
        createdAt: new Date().toISOString()
      };

      // ✅ FIXED: Try to save to API first, then fallback to localStorage
      try {
        const response = await baheeApiService.addReturnNetLog(newLog);
        if (response.success) {
        } else {
          throw new Error('API save failed');
        }
      } catch (apiError) {
        
        // Fallback to localStorage
        const currentLogs = [...returnNetLogs, newLog];
        localStorage.setItem('returnNetLogs', JSON.stringify(currentLogs));
      }

      // ✅ FIXED: Update local state regardless of API result
      setReturnNetLogs(prevLogs => [...prevLogs, newLog]);
      
      message.success("विवरण सुरक्षित कर दिया गया");
      return true;
    } catch (error: any) {
      console.error('❌ Error adding return net log:', error);
      const errorMessage = error?.message || 'रिटर्न नेत लॉग सेव करने में त्रुटि';
      message.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [returnNetLogs]);

  // ✅ FIXED: Enhanced computed values with proper dependencies
  const contextualBaheeDetails = useMemo(() => {
    if (!baheeDetails || baheeDetails.length === 0) return [];
    
    if (selectedBaheeId) {
      const filtered = baheeDetails.filter(bd => bd.id === selectedBaheeId);
      return filtered;
    }
    
    if (!currentBaheeType && selectedBaheeType === "") {
      return baheeDetails;
    }
    
    const target = currentBaheeType || selectedBaheeType;
    if (!target) return baheeDetails;
    
    const filtered = baheeDetails.filter(bd => bd.baheeType === target);
    return filtered;
  }, [baheeDetails, currentBaheeType, selectedBaheeType, selectedBaheeId]);

  const baheeTypeOptions = useMemo(() => {
    if (!baheeDetails || baheeDetails.length === 0) return [];
    
    const uniqueTypes = [...new Set(baheeDetails.map(bd => bd.baheeType))].filter(Boolean);
    return uniqueTypes.map(type => {
      const bahee = baheeDetails.find(bd => bd.baheeType === type);
      return { 
        value: type, 
        label: bahee?.baheeTypeName || type || 'अज्ञात प्रकार'
      };
    });
  }, [baheeDetails]);

  const selectedBaheeDetails = useMemo(() => {
    if (!selectedBaheeId || !baheeDetails) return null;
    return baheeDetails.find(bd => bd.id === selectedBaheeId) || null;
  }, [baheeDetails, selectedBaheeId]);

  // ✅ FIXED: Enhanced get return net log function
  const getReturnNetLogForRecord = useCallback((recordKey: string): ReturnNetLog | null => {
    if (!returnNetLogs || returnNetLogs.length === 0) return null;
    return returnNetLogs.find(log => log.forKey === recordKey) || null;
  }, [returnNetLogs]);

  return {
    data,
  baheeDetails,
  returnNetLogs,
  selectedBaheeType,
  setSelectedBaheeType,
  loading,
  error,
  contextualBaheeDetails,
  baheeTypeOptions,
  selectedBaheeDetails,
  updateEntry,
  deleteEntry,
  updateBaheeDetails,
  addReturnNetLog,
  getReturnNetLogForRecord,
  loadAllData
  };
};