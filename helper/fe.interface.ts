export interface LoggedUserInterface {
  id: string;
  email: string;
  name: string;
  organizationName?: string;
  [key: string]: any;
}

export interface BaseState {
  token: string | null;
  user: LoggedUserInterface | null;
  roleDetails: any;
  userConfigs: any;
  sessionApprovalRequest: any;
  pendingSession: any;
  pendingToken: string | null;
}
