export const API = {
  login: `/api/auth/login`,
  standardAdd: `/api/standard/add`,
  standardUpdate: `/api/standard/update`,
  sendOTP: `/user/sendOtp`,
  resetPassword: `/user/resetPassword`,
  getClient: `/client`,
  fileUpload: '/uploads/attachments',
  upload: '/api/attachments/upload'
};

// export const SEND_MESSAGE = `sendMessage`;
// export const RECEIVE_MESSAGE = `receiveMessage`;

// export const SOCKET_EVENT = {
//   // 🔐 Authentication
//   getModuleListForEditor: `getModuleListForEditor`,
//   getInwardListForEditor: `getInwardListForEditor`,
//   confirmPassword: `confirmPassword`,
//   changePassword: `changePassword`,
//   getHistoryList: `getHistoryList`,
//   getEditorHistory: `getEditorHistory`,
//   logout: `logout`,

//   // 👤 User & Role Management
//   createUser: `createUser`,
//   getUsersList: `getUsersList`,
//   getRolesList: `getRolesList`,
//   getRole: `getRole`,
//   createRoles: `createRoles`,
//   updateRoles: `updateRoles`,
//   updateUser: `updateUser`,
//   getRoleWiseUserList: `getRoleWiseUserList`,
//   updateProfile: `updateProfile`,
//   updateUserIsBlock: `updateUserIsBlock`,
//   getUser: `getUser`,
//   getModuleList: `getModuleList`,
//   getUserAuditList: `getUserAuditList`,

//   // 👀 Audit
//   getAuditsList: `getAuditsList`,

//   // 🏭 Chemical Master
//   chemicalMasterList: `chemicalMasterList`,

//   // 🧪 Chemical Inward
//   getManufacturerList: `getManufacturerList`,
//   createChemicalName: `createChemicalName`,
//   createChemicalType: `createChemicalType`,
//   createManufacturer: `createManufacturer`,
//   getGradeList: `getGradeList`,
//   createChemicalInward: `createChemicalInward`,
//   getUnitsList: `getUnitsList`,
//   getCultureUsage: `getCultureUsage`,
//   getChemicalInwardList: `getChemicalInwardList`,
//   getChemicalInward: `getChemicalInward`,
//   updateChemicalInward: `updateChemicalInward`,
//   getPhysicalConditionList: `getPhysicalConditionList`,
//   createPhysicalCondition: `createPhysicalCondition`,
//   getChemicalUsageLogList: `getChemicalUsageLogList`,
//   getChemicalUsageLog: `getChemicalUsageLog`,
//   updateChemicalUsageLog: `updateChemicalUsageLog`,
//   getChemicalInwardAuditsList: `getChemicalInwardAuditsList`,

//   // 📦 Chemical Issuance
//   discardContainer: `discardContainer`,
//   containerIssue: `containerIssue`,
//   chemicalInwardContainerDetail: `chemicalInwardContainerDetail`,

//   // Column Master
//   getColumnMaster: `getColumnMaster`,

//   // 🚚 Column Inward
//   createGrade: `createGrade`,
//   createUnit: `createUnit`,
//   createSerialNo: `createSerialNo`,
//   getSerialNoList: `getSerialNoList`,
//   createPartNo: `createPartNo`,
//   getPartNoList: `getPartNoList`,
//   createColumnDescription: `createColumnDescription`,
//   getColumnDescriptionList: `getColumnDescriptionList`,
//   getColumnInwardList: `getColumnInwardList`,
//   createColumnInward: `createColumnInward`,
//   getColumnInward: `getColumnInward`,
//   getCasNoList: `getCasNoList`,
//   createCasNo: `createCasNo`,
//   assignUserToColumnInward: `assignUserToColumnInward`,

//   // 📈 Column Performance
//   getValidationType: `getValidationType`,
//   createColumnPerformance: `createColumnPerformance`,
//   getMyColumnInwardList: `getMyColumnInwardList`,
//   getColumnPerformanceList: `getColumnPerformanceList`,
//   getColumnPerformance: `getColumnPerformance`,
//   columnPerformanceReviewQABy: `columnPerformanceReviewQABy`,
//   columnPerformanceReviewQCBy: `columnPerformanceReviewQCBy`,

//   // 📦 Column Usage
//   getColumnUsageList: `getColumnUsageList`,
//   createColumnUsage: `createColumnUsage`,
//   getColumnUsage: `getColumnUsage`,
//   updateColumnPerformance: `updateColumnPerformance`,
//   getColumnInwardListForUsage: `getColumnInwardListForUsage`,
//   getColumnPerformanceListForUsage: `getColumnPerformanceListForUsage`,
//   updateColumnUsage: `updateColumnUsage`,
//   qaReviewColumnUsage: `qaReviewColumnUsage`,
//   discardColumnInward: `discardColumnInward`,
//   getColumnMasterList: `getColumnMasterList`,

//   // 📦 standard inward
//   getStandardInwardList: `getStandardInwardList`,
//   updateStandardInward: `updateStandardInward`,
//   createStandardName: `createStandardName`,
//   getStandardNameList: `getStandardNameList`,
//   getTypeOfStandardList: `getTypeOfStandardList`,
//   createStandardInward: `createStandardInward`,
//   getStandardInward: `getStandardInward`,
//   updateColumnInward: `updateColumnInward`,
//   standardInwardReviewQCBy: `standardInwardReviewQCBy`,
//   vialIssue: `vialIssue`,
//   discardVial: `discardVial`,
//   discardStandardInward: `discardStandardInward`,
//   vialMasterList: `vialMasterList`,
//   getStandardVial: `getStandardVial`,
//   standerMasterAuditsList: `standerMasterAuditsList`,
//   discardVialReviewByQA: `discardVialReviewByQA`,

//   // 🧬 standard WS qualification
//   getWsQualificationList: `getWsQualificationList`,
//   createWsQualification: `createWsQualification`,
//   updateWsQualification: `updateWsQualification`,
//   wsQualificationReviewQCBy: `wsQualificationReviewQCBy`,
//   wsQualificationReviewQABy: `wsQualificationReviewQABy`,
//   deleteQualificationCriteria: `deleteQualificationCriteria`,

//   // 🧴 standard vial preparation
//   getVialPreparationList: `getVialPreparationList`,
//   createVialPreparation: `createVialPreparation`,
//   updateVialPreparation: `updateVialPreparation`,
//   getVialPreparation: `getVialPreparation`,

//   // 🧪 standard vial usage
//   getVialUsageList: `getVialUsageList`,
//   createVialUsage: `createVialUsage`,
//   getVialUsage: `getVialUsage`,
//   updateVialUsage: `updateVialUsage`,
//   consumptionVerificationByQA: `consumptionVerificationByQA`,
//   getApprovedStandardInward: `getApprovedStandardInward`,
//   getStandardInwardForUsage: `getStandardInwardForUsage`,

//   // 📝 Calibration Document Formate
//   createCalibrationFormat: `createCalibrationFormat`,
//   updateCalibrationFormat: `updateCalibrationFormat`,
//   getCalibrationFormatList: `getCalibrationFormatList`,
//   getCalibrationFormat: `getCalibrationFormat`,
//   reversionCalibrationFormat: `reversionCalibrationFormat`,
//   calibrationFormatReviewQCBy: `calibrationFormatReviewQCBy`,
//   calibrationFormatReviewQABy: `calibrationFormatReviewQABy`,
//   getCalibrationFormatVersions: `getCalibrationFormatVersions`,

//   // 📝 PM Checklist
//   getPmChecklist: `getPmChecklist`,
//   createPmChecklist: `createPmChecklist`,
//   updatePmChecklist: `updatePmChecklist`,
//   getPmChecklistList: `getPmChecklistList`,
//   reversionPmChecklist: `reversionPmChecklist`,
//   pmChecklistReviewQCBy: `pmChecklistReviewQCBy`,
//   pmChecklistReviewQABy: `pmChecklistReviewQABy`,
//   getPmChecklistVersions: `getPmChecklistVersions`,

//   // 📝 instrument inward
//   createInstrumentInward: `createInstrumentInward`,
//   updateInstrumentInward: `updateInstrumentInward`,
//   instrumentInwardReviewQABy: `instrumentInwardReviewQABy`,
//   getInstrumentInwardList: `getInstrumentInwardList`,
//   getInstrumentInward: `getInstrumentInward`,
//   discardReviewByQA: `discardReviewByQA`,
//   assignUserToStandardInward: `assignUserToStandardInward`,

//   // 📝 instrument performance
//   generateArNoChecklistPerformance: `generateArNoChecklistPerformance`,
//   generateArNoCalibrationPerformance: `generateArNoCalibrationPerformance`,
//   cancelCalibrationPerformance: `cancelCalibrationPerformance`,
//   cancelChecklistPerformance: `cancelChecklistPerformance`,
//   addBreakdownReason: `addBreakdownReason`,

//   // 📝 calibration performance
//   getCalibrationPerformanceList: `getCalibrationPerformanceList`,
//   updateCalibrationPerformanceTest: `updateCalibrationPerformanceTest`,
//   calibrationPerformanceTestReviewQABy: `calibrationPerformanceTestReviewQABy`,
//   getCalibrationPerformance: `getCalibrationPerformance`,
//   assignUserToCalibrationPerformance: `assignUserToCalibrationPerformance`,
//   createStorageCondition: `createStorageCondition`,

//   // 📝 checklist performance
//   assignUserToChecklistPerformance: `assignUserToChecklistPerformance`,
//   updateChecklistPerformanceTest: `updateChecklistPerformanceTest`,
//   checklistPerformanceTestReviewQABy: `checklistPerformanceTestReviewQABy`,
//   getPmCheckListPerformance: `getPmCheckListPerformance`,
//   getPmCheckListPerformanceList: `getPmCheckListPerformanceList`,

//   // Culture Master
//   createCultureName: `createCultureName`,
//   getCultureMasterList: `getCultureMasterList`,
//   createCultureMaster: `createCultureMaster`,
//   updateCultureMaster: `updateCultureMaster`,
//   createCultureType: `createCultureType`,
//   cultureMasterReviewMBBy: `cultureMasterReviewMBBy`,
//   getStorageConditionList: `getStorageConditionList`,
//   getCultureMaster: `getCultureMaster`,

//   // Culture Inward
//   createCultureInward: `createCultureInward`,
//   updateCultureInward: `updateCultureInward`,
//   cultureInwardReviewMBBy: `cultureInwardReviewMBBy`,
//   getCultureInwardList: `getCultureInwardList`,
//   getCultureInward: `getCultureInward`,
//   createSupplierMaster: `createSupplierMaster`,

//   qualityCheckIssuanceCulture: `qualityCheckIssuanceCulture`,
//   cultureInwardReviewQCIBy: `cultureInwardReviewQCIBy`,

//   cultureInwardCompletion: `cultureInwardCompletion`,
//   cultureInwardReviewUCPBy: `cultureInwardReviewUCPBy`,

//   discardCultureInward: `discardCultureInward`,

//   // Culture Usage
//   createCultureUsage: `createCultureUsage`,
//   consumeCultureUsage: `consumeCultureUsage`,
//   getCultureUsageList: `getCultureUsageList`,
//   cultureUsageReviewMBBy: `cultureUsageReviewMBBy`,

//   // Media Master
//   createMediaName: `createMediaName`,
//   getMediaNameList: `getMediaNameList`,
//   createMediaMaster: `createMediaMaster`,
//   updateMediaMaster: `updateMediaMaster`,
//   createMediaType: `createMediaType`,
//   getMediaTypeList: `getMediaTypeList`,
//   mediaMasterReviewMBBy: `mediaMasterReviewMBBy`,
//   getMediaMasterList: `getMediaMasterList`,
//   // getStorageConditionList: `getStorageConditionList`,
//   getMediaMaster: `getMediaMaster`,

//   // Media Inward
//   createMediaInward: `createMediaInward`,
//   updateMediaInward: `updateMediaInward`,
//   mediaInwardReviewMBBy: `mediaInwardReviewMBBy`,
//   getMediaInwardList: `getMediaInwardList`,
//   getMediaInward: `getMediaInward`,

//   qualityCheckIssuanceMedia: `qualityCheckIssuanceMedia`,
//   mediaInwardReviewQCIBy: `mediaInwardReviewQCIBy`,

//   mediaInwardCompletion: `mediaInwardCompletion`,
//   mediaInwardReviewUCPBy: `mediaInwardReviewUCPBy`,
//   discardMediaInward: `discardMediaInward`,

//   // Media Usage
//   createMediaUsage: `createMediaUsage`,
//   getMediaUsage: `getMediaUsage`,
//   consumeMediaUsage: `consumeMediaUsage`,
//   getMediaUsageList: `getMediaUsageList`,
//   mediaUsageReviewMBBy: `mediaUsageReviewMBBy`,

//   // Create Custom Rule
//   createCustomRule: `createCustomRule`,
//   updateCustomRule: `updateCustomRule`,
//   getCustomRuleList: `getCustomRuleList`,
//   deleteCustomRule: `deleteCustomRule`,
//   getRuleValidationType: `getRuleValidationType`,
//   getCustomRule: `getCustomRule`,
//   deleteCustomFilter: `deleteCustomFilter`,

//   // Solution Master
//   createSolutionMaster: `createSolutionMaster`,
//   updateSolutionMaster: `updateSolutionMaster`,
//   solutionMasterReviewQABy: `solutionMasterReviewQABy`,
//   getSolutionMasterList: `getSolutionMasterList`,
//   getSolutionMaster: `getSolutionMaster`,

//   // Solution Preparation
//   createSolutionPreparation: `createSolutionPreparation`,
//   updateSolutionPreparation: `updateSolutionPreparation`,
//   solutionPreparationReviewQABy: `solutionPreparationReviewQABy`,
//   getSolutionPreparationList: `getSolutionPreparationList`,
//   getSolutionPreparation: `getSolutionPreparation`,
//   solutionReStandardization: `solutionReStandardization`,
//   discardSolution: `discardSolution`,
//   discardSolutionReviewByQA: `discardSolutionReviewByQA`,

//   // Solution Usage
//   createSolutionUsage: `createSolutionUsage`,
//   updateSolutionUsage: `updateSolutionUsage`,
//   getSolutionUsageList: `getSolutionUsageList`,
//   getSolutionUsage: `getSolutionUsage`,

//   // Analyst Qualification Technique
//   getTechniqueInwardList: `getTechniqueInwardList`,
//   createTechniqueInward: `createTechniqueInward`,
//   updateTechniqueInward: `updateTechniqueInward`,
//   getTechniqueInward: `getTechniqueInward`,
//   techniqueInwardReviewQCBy: `techniqueInwardReviewQCBy`,
//   techniqueInwardReviewQABy: `techniqueInwardReviewQABy`,

//   // Sample Inward
//   createSampleInward: `createSampleInward`,
//   updateSampleInward: `updateSampleInward`,
//   getSampleInwardList: `getSampleInwardList`,
//   getSampleInward: `getSampleInward`,
//   sampleInwardReviewQCBy: `sampleInwardReviewQCBy`,
//   discardSampleInward: `discardSampleInward`,
//   discardSampleInwardReviewByQA: `discardSampleInwardReviewByQA`,

//   // AQ Onjob Training
//   getOnJobTrainingList: `getOnJobTrainingList`,
//   createOnJobTraining: `createOnJobTraining`,
//   updateOnJobTraining: `updateOnJobTraining`,
//   onJobTrainingReviewQCBy: `onJobTrainingReviewQCBy`,
//   getOnJobTraining: `getOnJobTraining`,

//   // AQ Assign Sample
//   createQualificationPerformance: `createQualificationPerformance`,
//   updateQualificationPerformance: `updateQualificationPerformance`,
//   qualificationPerformanceReviewQCBy: `qualificationPerformanceReviewQCBy`,
//   qualificationPerformanceReviewQABy: `qualificationPerformanceReviewQABy`,
//   qualificationPerformanceApprovalQCBy: `qualificationPerformanceApprovalQCBy`,
//   qualificationPerformanceApprovalQABy: `qualificationPerformanceApprovalQABy`,
//   getQualificationPerformanceList: `getQualificationPerformanceList`,
//   getQualificationPerformance: `getQualificationPerformance`,
//   getDueQualificationPerformanceList: `getDueQualificationPerformanceList`,
//   getQualificationPerformanceMasterList: `getQualificationPerformanceMasterList`,
//   getQualificationPerformanceMaster: `getQualificationPerformanceMaster`,

//   // Packaging Master
//   createMaterialMaster: `createMaterialMaster`,
//   updateMaterialMaster: `updateMaterialMaster`,
//   materialMasterReviewQCBy: `materialMasterReviewQCBy`,
//   getMaterialMasterList: `getMaterialMasterList`,
//   getMaterialMaster: `getMaterialMaster`,

//   // PM TDS Preparation
//   updateMaterialTdsPreparation: `updateMaterialTdsPreparation`,
//   materialTdsPreparationReviewQCBy: `materialTdsPreparationReviewQCBy`,
//   materialTdsPreparationReviewQABy: `materialTdsPreparationReviewQABy`,
//   materialTdsPreparationReviewQAApprovalBy: `materialTdsPreparationReviewQAApprovalBy`,
//   getMaterialTdsPreparation: `getMaterialTdsPreparation`,
//   getMaterialTdsPreparationList: `getMaterialTdsPreparationList`,
//   getMaterialAnalysisTestsByInwardId: `getMaterialAnalysisTestsByInwardId`,

//   // PM Inward
//   createMaterialInward: `createMaterialInward`,
//   updateMaterialInward: `updateMaterialInward`,
//   getMaterialInwardList: `getMaterialInwardList`,
//   getMaterialInward: `getMaterialInward`,

//   // RM Inward
//   createRmInward: `createRmInward`,
//   updateRmInward: `updateRmInward`,
//   getRmInwardList: `getRmInwardList`,
//   getRmInward: `getRmInward`,

//   // PM Sampling
//   assignMaterialSampling: `assignMaterialSampling`,
//   getMaterialSamplingList: `getMaterialSamplingList`,
//   updateMaterialSampling: `updateMaterialSampling`,
//   getMaterialSampling: `getMaterialSampling`,
//   getSamplingChecklist: `getSamplingChecklist`,
//   getAqlChecklist: `getAqlChecklist`,
//   materialSamplingReviewQCBy: `materialSamplingReviewQCBy`,

//   // RM Sampling
//   assignRmSampling: `assignRmSampling`,
//   getRmSamplingList: `getRmSamplingList`,
//   updateRmSampling: `updateRmSampling`,
//   getRmSampling: `getRmSampling`,
//   getRmSamplingChecklist: `getRmSamplingChecklist`,

//   rmSamplingReviewQCBy: `rmSamplingReviewQCBy`,

//   // PM Analysis
//   getMaterialAnalysisList: `getMaterialAnalysisList`,
//   getMaterialAnalysis: `getMaterialAnalysis`,
//   materialAnalysisTestReviewQCBy: `materialAnalysisTestReviewQCBy`,
//   materialAnalysisTestReviewQABy: `materialAnalysisTestReviewQABy`,
//   updateAnalysisTest: `updateAnalysisTest`,
//   assignUserToAnalysisTest: `assignUserToAnalysisTest`,
//   getMaterialAnalysisAssignmentList: `getMaterialAnalysisAssignmentList`,


//   // RM Analysis
//   getRmAnalysisList: `getRmAnalysisList`,
//   getRmAnalysis: `getRmAnalysis`,
//   rmAnalysisTestReviewQCBy: `rmAnalysisTestReviewQCBy`,
//   rmAnalysisTestReviewQABy: `rmAnalysisTestReviewQABy`,
//   updateRmAnalysisTest: `updateRmAnalysisTest`,
//   assignUserToRmAnalysisTest: `assignUserToRmAnalysisTest`,
//   getRmAnalysisAssignmentList: `getRmAnalysisAssignmentList`,

//   // PM Batch Approval
//   materialInwardBatchApproval: `materialInwardBatchApproval`,

//   // RM Batch Approval
//   rmInwardBatchApproval: `rmInwardBatchApproval`,

//   // PM COA
//   createMaterialCoa: `createMaterialCoa`,
//   updateMaterialCoa: `updateMaterialCoa`,
//   getMaterialCoaList: `getMaterialCoaList`,
//   getMaterialCoa: `getMaterialCoa`,
//   MaterialCoaQCReviewBy: `MaterialCoaQCReviewBy`,
//   MaterialCoaQAReviewBy: `MaterialCoaQAReviewBy`,

//   // RM COA
//   createRmCoa: `createRmCoa`,
//   updateRmCoa: `updateRmCoa`,
//   getRmCoaList: `getRmCoaList`,
//   getRmCoa: `getRmCoa`,
//   rmCoaQCReviewBy: `rmCoaQCReviewBy`,
//   rmCoaQAReviewBy: `rmCoaQAReviewBy`,
//   getRmAnalysisTestsByInwardId: `getRmAnalysisTestsByInwardId`,

//   // RM Master
//   createRmMaster: `createRmMaster`,
//   updateRmMaster: `updateRmMaster`,
//   rmMasterReviewQCBy: `rmMasterReviewQCBy`,
//   getRmMasterList: `getRmMasterList`,
//   getRmMaster: `getRmMaster`,
//   getrmMasterCodeList: `getrmMasterCodeList`,

//   // RM TDS Preparation
//   updateRmTdsPreparation: `updateRmTdsPreparation`,
//   rmTdsPreparationReviewQCBy: `rmTdsPreparationReviewQCBy`,
//   rmTdsPreparationReviewQABy: `rmTdsPreparationReviewQABy`,
//   rmTdsPreparationReviewQAApprovalBy: `rmTdsPreparationReviewQAApprovalBy`,
//   getRmTdsPreparation: `getRmTdsPreparation`,
//   getRmTdsPreparationList: `getRmTdsPreparationList`,

//   // Inprocess Sample Master
//   createIpMaster: `createIpMaster`,
//   updateIpMaster: `updateIpMaster`,
//   ipMasterReviewQCBy: `ipMasterReviewQCBy`,
//   ipMasterReviewQABy: `ipMasterReviewQABy`,
//   getIpMasterList: `getIpMasterList`,
//   getIpMaster: `getIpMaster`,
//   getIpCodeList: `getIpCodeList`,

//   // IP TDS Preparation
//   updateIpTdsPreparation: `updateIpTdsPreparation`,
//   ipTdsPreparationReviewQCBy: `ipTdsPreparationReviewQCBy`,
//   ipTdsPreparationReviewQABy: `ipTdsPreparationReviewQABy`,
//   ipTdsPreparationReviewQAApprovalBy: `ipTdsPreparationReviewQAApprovalBy`,
//   getIpTdsPreparation: `getIpTdsPreparation`,
//   getIpTdsPreparationList: `getIpTdsPreparationList`,
//   getIpAnalysisTestsByInwardId: `getIpAnalysisTestsByInwardId`,

//   // IP Inward
//   createIpInward: `createIpInward`,
//   updateIpInward: `updateIpInward`,
//   getIpInwardList: `getIpInwardList`,
//   getIpInward: `getIpInward`,

//   // IP Sampling
//   assignIpSampling: `assignIpSampling`,
//   getIpSamplingList: `getIpSamplingList`,
//   updateIpSampling: `updateIpSampling`,
//   getIpSampling: `getIpSampling`,
//   getIpSamplingChecklist: `getIpSamplingChecklist`,
//   ipSamplingReviewQCBy: `ipSamplingReviewQCBy`,

//   // IP Analysis
//   getIpAnalysisList: `getIpAnalysisList`,
//   getIpAnalysis: `getIpAnalysis`,
//   ipAnalysisTestReviewQCBy: `ipAnalysisTestReviewQCBy`,
//   ipAnalysisTestReviewQABy: `ipAnalysisTestReviewQABy`,
//   updateIpAnalysisTest: `updateIpAnalysisTest`,
//   assignUserToIpAnalysisTest: `assignUserToIpAnalysisTest`,
//   getIpAnalysisAssignmentList: `getIpAnalysisAssignmentList`,

//   // IP Batch Approval
//   ipInwardBatchApproval: `ipInwardBatchApproval`,

//   // IP COA
//   createIpCoa: `createIpCoa`,
//   updateIpCoa: `updateIpCoa`,
//   getIpCoaList: `getIpCoaList`,
//   getIpCoa: `getIpCoa`,
//   ipCoaQAReviewBy: `ipCoaQAReviewBy`,
//   ipCoaQCReviewBy: `ipCoaQCReviewBy`,

//   // Finished Product
//   createFpMaster: `createFpMaster`,
//   updateFpMaster: `updateFpMaster`,
//   fpMasterReviewQCBy: `fpMasterReviewQCBy`,
//   fpMasterReviewQABy: `fpMasterReviewQABy`,
//   getFpMasterList: `getFpMasterList`,
//   getFpMaster: `getFpMaster`,
//   getFpCodeList: `getFpCodeList`,

//   // FP TDS Preparation
//   updateFpTdsPreparation: `updateFpTdsPreparation`,
//   fpTdsPreparationReviewQCBy: `fpTdsPreparationReviewQCBy`,
//   fpTdsPreparationReviewQABy: `fpTdsPreparationReviewQABy`,
//   fpTdsPreparationReviewQAApprovalBy: `fpTdsPreparationReviewQAApprovalBy`,
//   getFpTdsPreparation: `getFpTdsPreparation`,
//   getFpTdsPreparationList: `getFpTdsPreparationList`,
//   getFpAnalysisTestsByInwardId: `getFpAnalysisTestsByInwardId`,

//   // FP Inward
//   createFpInward: `createFpInward`,
//   updateFpInward: `updateFpInward`,
//   getFpInwardList: `getFpInwardList`,
//   getFpInward: `getFpInward`,

//   // FP Sampling
//   assignFpSampling: `assignFpSampling`,
//   getFpSamplingList: `getFpSamplingList`,
//   updateFpSampling: `updateFpSampling`,
//   getFpSampling: `getFpSampling`,
//   getFpSamplingChecklist: `getFpSamplingChecklist`,
//   fpSamplingReviewQCBy: `fpSamplingReviewQCBy`,

//   // FP Analysis
//   getFpAnalysisList: `getFpAnalysisList`,
//   getFpAnalysis: `getFpAnalysis`,
//   fpAnalysisTestReviewQCBy: `fpAnalysisTestReviewQCBy`,
//   fpAnalysisTestReviewQABy: `fpAnalysisTestReviewQABy`,
//   updateFpAnalysisTest: `updateFpAnalysisTest`,
//   assignUserToFpAnalysisTest: `assignUserToFpAnalysisTest`,
//   getFpAnalysisAssignmentList: `getFpAnalysisAssignmentList`,

//   // FP Batch Approval
//   fpInwardBatchApproval: `fpInwardBatchApproval`,

//   // FP COA
//   createFpCoa: `createFpCoa`,
//   updateFpCoa: `updateFpCoa`,
//   getFpCoaList: `getFpCoaList`,
//   getFpCoa: `getFpCoa`,
//   FpCoaQCReviewBy: `FpCoaQCReviewBy`,
//   FpCoaQAReviewBy: `FpCoaQAReviewBy`,
//   fpCoaQAReviewBy: `fpCoaQAReviewBy`,
//   fpCoaQCReviewBy: `fpCoaQCReviewBy`,


//   // dataBackup
//   dataBackup: `dataBackup`,
//   dataRestore: `dataRestore`,
//   getBackupFilesList: `getBackupFilesList`,
//   getBackupFolderList: `getBackupFolderList`,

//   // Global Setting
//   updateConfiguration: `updateConfiguration`,

//   onlineVerification: `onlineVerification`,
// };

