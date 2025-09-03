// hooks/useAddNewEntriesInterface.ts
import { useState, useEffect, useMemo } from 'react';
import { message } from 'antd';
import baheeApiService from '../services/baheeApiService';
import type { DataType, BaheeDetails, ReturnNetLog } from '../types/addNewEntriesInterface.types';

export const useAddNewEntriesInterface = (currentBaheeType?: string, selectedBaheeId?: string) => {
  // State management
  const [data, setData] = useState<DataType[]>([]);
  const [baheeDetails, setBaheeDetails] = useState<BaheeDetails[]>([]);
  const [returnNetLogs, setReturnNetLogs] = useState<ReturnNetLog[]>([]);
  const [lockedKeys, setLockedKeys] = useState<Record<string, boolean>>({});
  const [selectedBaheeType, setSelectedBaheeType] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    loadAllData();
  }, [currentBaheeType, selectedBaheeId]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading all data...');

      // Load all bahee details first
      const baheeResponse = await baheeApiService.getAllBaheeDetails();
      if (baheeResponse.success && baheeResponse.data) {
        const formattedBaheeDetails = baheeResponse.data.map((item: any) => ({
          id: item._id || item.id,
          baheeType: item.baheeType,
          baheeTypeName: item.baheeTypeName,
          name: item.name,
          date: item.date,
          tithi: item.tithi,
          createdAt: item.createdAt || new Date().toISOString()
        }));
        setBaheeDetails(formattedBaheeDetails);
        console.log('✅ Bahee details loaded:', formattedBaheeDetails);
      }

      // Load all bahee entries
      const entriesResponse = await baheeApiService.getAllBaheeEntries();
      if (entriesResponse.success && entriesResponse.data) {
        const formattedEntries = entriesResponse.data.map((entry: any, index: number) => ({
          key: entry._id || entry.submittedAt || `entry-${index}`,
          sno: (index + 1).toString(),
          cast: entry.caste || entry.cast || '',
          name: entry.name || '',
          fathername: entry.fatherName || entry.fathername || '',
          address: entry.villageName || entry.address || '',
          aavta: Number(entry.income) || Number(entry.aavta) || 0,
          uparnet: Number(entry.amount) || Number(entry.uparnet) || 0,
          baheeType: entry.baheeType || '',
          baheeTypeName: entry.baheeTypeName || '',
          headerName: entry.headerName || '',
          submittedAt: entry.submittedAt || ''
        }));
        setData(formattedEntries);
        console.log('✅ Entries loaded:', formattedEntries);
      } else {
        // No entries found, start with empty array
        setData([]);
        console.log('📋 No entries found, starting with empty array');
      }

      // Load return net logs (this might need to be updated based on your API)
      try {
        const returnNetResponse = await baheeApiService.getAllReturnNetLogs();
        if (returnNetResponse.success && returnNetResponse.data) {
          setReturnNetLogs(returnNetResponse.data);
          
          // Set locked keys
          const lockedKeysMap: Record<string, boolean> = {};
          returnNetResponse.data.forEach((log: ReturnNetLog) => {
            if (log.forKey) {
              lockedKeysMap[log.forKey] = true;
            }
          });
          setLockedKeys(lockedKeysMap);
          console.log('✅ Return net logs loaded:', returnNetResponse.data);
        }
      } catch (error) {
        console.log('⚠️ Return net logs not available, using empty array');
        setReturnNetLogs([]);
      }

      // Set default bahee type
      const detectedType = currentBaheeType || detectCurrentBaheeType();
      if (detectedType) {
        setSelectedBaheeType(detectedType);
      }

    } catch (error) {
      console.error('❌ Error loading data:', error);
      message.error('डेटा लोड करने में त्रुटि');
      
      // Start with empty arrays instead of sample data
      setData([]);
      setBaheeDetails([]);
      setReturnNetLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const detectCurrentBaheeType = (): string | null => {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/vivah')) return 'vivah';
    if (currentPath.includes('/muklawa')) return 'muklawa';
    const currentPageContext = localStorage.getItem('currentBaheeContext');
    return currentPageContext || null;
  };

  // Update entry
  const updateEntry = async (updatedEntry: DataType) => {
    try {
      setLoading(true);
      console.log('🔄 Updating entry:', updatedEntry);

      const response = await baheeApiService.updateBaheeEntry(updatedEntry.key, {
        caste: updatedEntry.cast,
        name: updatedEntry.name,
        fatherName: updatedEntry.fathername,
        villageName: updatedEntry.address,
        income: updatedEntry.aavta,
        amount: updatedEntry.uparnet,
        baheeType: updatedEntry.baheeType,
        baheeTypeName: updatedEntry.baheeTypeName,
        headerName: updatedEntry.headerName
      });
      
      if (response.success) {
        const updatedData = data.map(row => 
          row.key === updatedEntry.key ? { ...row, ...updatedEntry } : row
        );
        setData(updatedData);
        
        message.success("रिकॉर्ड सफलतापूर्वक अपडेट हो गया");
        console.log('✅ Entry updated successfully');
        return true;
      }
    } catch (error) {
      console.error('❌ Error updating entry:', error);
      message.error('रिकॉर्ड अपडेट करने में त्रुटि');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete entry
  const deleteEntry = async (entryKey: string) => {
    try {
      setLoading(true);
      console.log('🗑️ Deleting entry:', entryKey);

      const response = await baheeApiService.deleteBaheeEntry(entryKey);
      
      if (response.success) {
        const updatedData = data.filter(r => r.key !== entryKey);
        setData(updatedData);
        
        message.success("रिकॉर्ड सफलतापूर्वक डिलीट हो गया");
        console.log('✅ Entry deleted successfully');
        return true;
      }
    } catch (error) {
      console.error('❌ Error deleting entry:', error);
      message.error('रिकॉर्ड डिलीट करने में त्रुटि');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update bahee details
  const updateBaheeDetails = async (updatedBahee: BaheeDetails) => {
    try {
      setLoading(true);
      console.log('🔄 Updating bahee details:', updatedBahee);

      const response = await baheeApiService.updateBaheeDetails(updatedBahee.id, {
        baheeType: updatedBahee.baheeType,
        baheeTypeName: updatedBahee.baheeTypeName,
        name: updatedBahee.name,
        date: updatedBahee.date,
        tithi: updatedBahee.tithi
      });
      
      if (response.success) {
        const updatedBaheeDetails = baheeDetails.map(b => 
          b.id === updatedBahee.id ? updatedBahee : b
        );
        setBaheeDetails(updatedBaheeDetails);
        
        // Update related entries if bahee type name changed
        const updatedData = data.map(entry =>
          entry.baheeType === updatedBahee.baheeType && entry.headerName === updatedBahee.name
            ? { ...entry, baheeTypeName: updatedBahee.baheeTypeName } 
            : entry
        );
        setData(updatedData);
        
        message.success("बही विवरण सफलतापूर्वक अपडेट हो गया");
        console.log('✅ Bahee details updated successfully');
        return true;
      }
    } catch (error) {
      console.error('❌ Error updating bahee details:', error);
      message.error('बही विवरण अपडेट करने में त्रुटि');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Add return net log
  const addReturnNetLog = async (logData: Omit<ReturnNetLog, 'createdAt'>) => {
    try {
      setLoading(true);
      console.log('🔄 Adding return net log:', logData);

      // For now, store in localStorage until API is ready
      const newLog: ReturnNetLog = {
        ...logData,
        createdAt: new Date().toISOString()
      };

      const updatedLogs = [...returnNetLogs, newLog];
      setReturnNetLogs(updatedLogs);
      
      // Lock the entry
      if (logData.forKey) {
        setLockedKeys(prev => ({ ...prev, [logData.forKey]: true }));
      }
      
      // Store in localStorage as backup
      localStorage.setItem('returnNetLogs', JSON.stringify(updatedLogs));
      
      message.success("विवरण सुरक्षित कर दिया गया");
      console.log('✅ Return net log added successfully');
      return true;
    } catch (error) {
      console.error('❌ Error adding return net log:', error);
      message.error('रिटर्न नेट लॉग सेव करने में त्रुटि');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Computed values
  const contextualBaheeDetails = useMemo(() => {
    if (selectedBaheeId) {
      // Filter by specific bahee ID
      return baheeDetails.filter(bd => bd.id === selectedBaheeId);
    }
    if (!currentBaheeType && selectedBaheeType === "") return baheeDetails;
    const target = currentBaheeType || selectedBaheeType;
    if (!target) return baheeDetails;
    return baheeDetails.filter(bd => bd.baheeType === target);
  }, [baheeDetails, currentBaheeType, selectedBaheeType, selectedBaheeId]);

  const baheeTypeOptions = useMemo(() => {
    const uniqueTypes = [...new Set(baheeDetails.map(bd => bd.baheeType))];
    return uniqueTypes.map(type => {
      const bahee = baheeDetails.find(bd => bd.baheeType === type);
      return { value: type, label: bahee?.baheeTypeName || type };
    });
  }, [baheeDetails]);

  const selectedBaheeDetails = useMemo(() => {
    if (selectedBaheeId) {
      return baheeDetails.find(bd => bd.id === selectedBaheeId) || null;
    }
    return null;
  }, [baheeDetails, selectedBaheeId]);

  const getReturnNetLogForRecord = (recordKey: string): ReturnNetLog | null => {
    return returnNetLogs.find(log => log.forKey === recordKey) || null;
  };

  return {
    // State
    data,
    baheeDetails,
    returnNetLogs,
    lockedKeys,
    selectedBaheeType,
    setSelectedBaheeType,
    loading,
    
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