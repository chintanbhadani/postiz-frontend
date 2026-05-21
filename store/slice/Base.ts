import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { BaseState, LoggedUserInterface } from '../../helper/fe.interface';

const initialState: BaseState = {
  token: null,
  user: null,
  roleDetails: null,
  userConfigs: null,

  sessionApprovalRequest: null,
  pendingSession: null,
  pendingToken: null
};

const baseSlice = createSlice({
  name: 'base',
  initialState,
  reducers: {
    setLoggedUser(state, action: PayloadAction<LoggedUserInterface | null>) {
      state.user = action.payload;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    setRoleDetails(state, action: PayloadAction<any>) {
      state.roleDetails = action.payload;
    },
    setUserConfigs(state, action: PayloadAction<any>) {
      state.userConfigs = action.payload;
    },

    setSessionApprovalRequest(state, action: PayloadAction<any>) {
      state.sessionApprovalRequest = action.payload;
    },
    setPendingSession(state, action: PayloadAction<any>) {
      state.pendingSession = action.payload;
    },
    setPendingToken(state, action: PayloadAction<string | null>) {
      state.pendingToken = action.payload;
    }
  }
});

export const {
  setToken,
  setLoggedUser,
  setRoleDetails,
  setUserConfigs,
  setSessionApprovalRequest,
  setPendingSession,
  setPendingToken
} = baseSlice.actions;

export default baseSlice.reducer;
