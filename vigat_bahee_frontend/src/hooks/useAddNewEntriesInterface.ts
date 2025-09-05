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
  const [lockedKeys, setLockedKeys] = useState<Record<string, boolean>>({});
  const [selectedBaheeType, setSelectedBaheeType] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // ✅ FIXED: Enhanced data loading with proper error handling
  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      console.log('🔄 Loading all data...');

      // ✅ FIXED: Load bahee details with proper response structure
      try {
        const baheeResponse = await baheeApiService.getAllBaheeDetails();
        console.log('📦 Raw bahee response:', baheeResponse);
        console.log("Dudaram.........data",baheeResponse)

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
          console.log('✅ Bahee details loaded:', formattedBaheeDetails);
        } else {
          console.log('📋 No bahee details found');
          setBaheeDetails([]);
        }
      } catch (baheeError) {
        console.error('❌ Error loading bahee details:', baheeError);
        setBaheeDetails([]);
      }

      // ✅ FIXED: Load bahee entries with enhanced error handling
      try {
        const entriesResponse = await baheeApiService.getAllBaheeEntries();
        console.log('📦 Raw entries response:', entriesResponse);

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
            submittedAt: entry.submittedAt || entry.createdAt || new Date().toISOString()
          }));

          // ✅ FIXED: Filter out invalid entries
          const validEntries = formattedEntries.filter(entry => 
            entry.name && entry.name.trim() !== ''
          );

          setData(validEntries);
          console.log('✅ Entries loaded:', validEntries.length, 'valid entries');
        } else {
          console.log('📋 No entries found');
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
          console.log('⚠️ Return net logs API not available, trying localStorage');
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
        const lockedKeysMap: Record<string, boolean> = {};
        returnNetLogs.forEach((log: ReturnNetLog) => {
          if (log.forKey) {
            lockedKeysMap[log.forKey] = true;
          }
        });
        setLockedKeys(lockedKeysMap);
        
        console.log('✅ Return net logs loaded:', returnNetLogs.length, 'logs');
      } catch (returnNetError) {
        console.error('❌ Error loading return net logs:', returnNetError);
        setReturnNetLogs([]);
        setLockedKeys({});
      }

      // ✅ FIXED: Set default bahee type with validation
      const detectedType = currentBaheeType || detectCurrentBaheeType();
      if (detectedType && detectedType.trim() !== '') {
        setSelectedBaheeType(detectedType);
        console.log('🎯 Set default bahee type:', detectedType);
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
      setLockedKeys({});
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
  const updateEntry = useCallback(async (updatedEntry: DataType): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('🔄 Updating entry:', updatedEntry.name);

      // ✅ FIXED: Prepare data for API with proper field mapping
      const updatePayload = {
        caste: updatedEntry.cast,
        name: updatedEntry.name,
        fatherName: updatedEntry.fathername,
        villageName: updatedEntry.address,
        income: Number(updatedEntry.aavta),
        amount: Number(updatedEntry.uparnet),
        baheeType: updatedEntry.baheeType,
        baheeTypeName: updatedEntry.baheeTypeName,
        headerName: updatedEntry.headerName
      };

      const response = await baheeApiService.updateBaheeEntry(updatedEntry.key, updatePayload);
      
      if (response.success) {
        // ✅ FIXED: Update local state optimistically
        setData(prevData => 
          prevData.map(row => 
            row.key === updatedEntry.key ? { ...row, ...updatedEntry } : row
          )
        );
        
        message.success("रिकॉर्ड सफलतापूर्वक अपडेट हो गया");
        console.log('✅ Entry updated successfully');
        return true;
      } else {
        throw new Error(response.message || 'Update failed');
      }
    } catch (error: any) {
      console.error('❌ Error updating entry:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'रिकॉर्ड अपडेट करने में त्रुटि';
      message.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ FIXED: Enhanced delete entry
  const deleteEntry = useCallback(async (entryKey: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('🗑️ Deleting entry:', entryKey);

      const response = await baheeApiService.deleteBaheeEntry(entryKey);
      
      if (response.success) {
        // ✅ FIXED: Update local state immediately
        setData(prevData => prevData.filter(r => r.key !== entryKey));
        
        message.success("रिकॉर्ड सफलतापूर्वक डिलीट हो गया");
        console.log('✅ Entry deleted successfully');
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
      console.log('🔄 Updating bahee details:', updatedBahee.name);

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
        console.log('✅ Bahee details updated successfully');
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
      console.log('🔄 Adding return net log for:', logData.name);

      const newLog: ReturnNetLog = {
        ...logData,
        createdAt: new Date().toISOString()
      };

      // ✅ FIXED: Try to save to API first, then fallback to localStorage
      try {
        const response = await baheeApiService.addReturnNetLog(newLog);
        if (response.success) {
          console.log('✅ Return net log saved to API');
        } else {
          throw new Error('API save failed');
        }
      } catch (apiError) {
        console.log('⚠️ API not available, saving to localStorage');
        
        // Fallback to localStorage
        const currentLogs = [...returnNetLogs, newLog];
        localStorage.setItem('returnNetLogs', JSON.stringify(currentLogs));
      }

      // ✅ FIXED: Update local state regardless of API result
      setReturnNetLogs(prevLogs => [...prevLogs, newLog]);
      
      // ✅ FIXED: Lock the entry immediately
      if (logData.forKey) {
        setLockedKeys(prev => ({ ...prev, [logData.forKey]: true }));
      }
      
      message.success("विवरण सुरक्षित कर दिया गया");
      console.log('✅ Return net log added successfully');
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
      console.log('🔍 Contextual by ID:', filtered);
      return filtered;
    }
    
    if (!currentBaheeType && selectedBaheeType === "") {
      console.log('🔍 All bahee details:', baheeDetails);
      return baheeDetails;
    }
    
    const target = currentBaheeType || selectedBaheeType;
    if (!target) return baheeDetails;
    
    const filtered = baheeDetails.filter(bd => bd.baheeType === target);
    console.log('🔍 Contextual by type:', target, filtered);
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

  // ✅ Return enhanced hook interface
  return {
    // State
    data,
    baheeDetails,
    returnNetLogs,
    lockedKeys,
    selectedBaheeType,
    setSelectedBaheeType,
    loading,
    error,
    
    // Computed
    contextualBaheeDetails,
    baheeTypeOptions,
    selectedBaheeDetails,
    
    // Functions
    updateEntry,
    deleteEntry,
    updateBaheeDetails,
    addReturnNetLog,
    getReturnNetLogForRecord,
    loadAllData
  };
};