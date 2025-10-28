// Centralized API handlers for WeeMeS

/*
Handler summary by function and endpoint (ordered)

1) AUTH
   - login — POST /v1/auth/login
   - register — POST /v1/auth/register
   - changePassword — POST /v1/auth/change-password

2) KYC & CRP
   - saveKYC — POST /v1/kyc
   - validateCRPAnswers — POST /v1/crp/answers/validate
   - saveCRPAnswers — POST /v1/crp/answers/save

3) Goals: create/edit/simulate
   - createRetirementGoal — POST /v1/goals/createdGoalsRetirement
   - createOtherGoal — POST /v1/goals/createdGoalsOther
   - editRetirementGoal — PUT /v1/goals/editGoalsRetirement/{goalId}
   - editOtherGoal — PUT /v1/goals/editGoalsOther/{goalId}
   - simulateRetirementGoal — POST /v1/goals/simulateCreatedGoalsRetirement
   - simulateOtherGoal — POST /v1/goals/simulateCreatedGoalsOther

4) Goals: list/detail/tracking
   - fetchGoalsList — GET /v1/goals/listGoals
   - fetchGoalDetail — GET /v1/goals/detailGoals/{goalId}
   - fetchGoalsTracking — GET /v1/goals/trackingGoals (fallback: /v1/goals//trackingGoals)

5) Products
   - fetchProductsByRisk — GET /v1/products/show-product/{risk}

6) Transactions
   - buyProduct — POST /v1/transaction/buy
   - fetchTransactionHistory — GET /v1/transaction/history/{customerId}

7) Dashboard
   - fetchDashboardSummary — GET /v1/dashboard/summary?customerId={id}
   - fetchDashboardTrend — GET /v1/dashboard/trend?customerId={id}&days={n}
*/

// Vite exposes env via import.meta.env
const BASE_URL: string = (import.meta as any)?.env?.VITE_API_URL ?? 'http://localhost:8080';

export type RiskProfile = 'Conservative' | 'Moderate' | 'Aggressive' | null;

export interface LoginResponseData {
  customerId: string;
  name: string;
  email: string;
  token: string;
  kycComplete?: boolean;
  crpComplete?: boolean;
  riskProfileType?: RiskProfile;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  messages?: string[];
  errors?: string[];
  messageCodes?: string[];
}


async function fetchJson<T>(path: string, init?: RequestInit, authToken?: string): Promise<ApiResponse<T>> {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const url = base + path;
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (init && (init as any).headers) {
    Object.assign(headers as any, (init as any).headers);
  }
  if (authToken) (headers as any)['Authorization'] = `Bearer ${authToken}`;

  const res = await fetch(url, { ...init, headers });
  const json = await res.json().catch(() => ({ success: false, data: null }));
  if (!res.ok) {
    const msg = (json?.messages || json?.errors)?.join(', ') || `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return json as ApiResponse<T>;
}

export async function login(email: string, password: string) {
  return fetchJson<LoginResponseData>(`/v1/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(input: { name: string; email: string; password: string; address: string; }) {
  return fetchJson<unknown>(`/v1/auth/register`, {
    method: 'POST',
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      password: input.password,
      address: input.address,
    }),
  });
}

// Auth: change password (gateway)
export async function changePassword(userId: string, body: { currentPassword: string; newPassword: string; confirmNewPassword: string }, token?: string) {
  const path = `/v1/auth/change-password`;
  return fetchJson<unknown>(path, {
    method: 'POST',
    headers: { 'X-User-Id': userId },
    body: JSON.stringify(body),
  }, token);
}

export interface KYCPayload { nik: string; pob: string; dob: string; }
export interface KYCResponseData {
  kycStatus?: string;
  riskProfileId?: string | null;
  riskProfileName?: RiskProfile;
  riskProfile?: { riskProfileId?: string; riskProfileName?: RiskProfile } | null;
  insight?: string | null;
}

export async function saveKYC(payload: KYCPayload, token: string) {
  return fetchJson<KYCResponseData>(`/v1/kyc`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }, token);
}

export interface CRPAnswer { questionId: string | number; answerId: string | number; }
export interface CRPValidateData {
  totalScore?: number;
  riskProfile?: { riskProfileId?: string; riskProfileName?: RiskProfile } | null;
  riskProfileName?: RiskProfile;
  insight?: string | null;
}

export async function validateCRPAnswers(answers: CRPAnswer[], token: string) {
  return fetchJson<CRPValidateData>(`/v1/crp/answers/validate`, {
    method: 'POST',
    body: JSON.stringify({ answers }),
  }, token);
}

export interface CRPSaveData {
  customerId?: string;
  questionnaireId?: string | null;
  totalScore?: number;
  riskProfile?: { riskProfileId?: string; riskProfileName?: RiskProfile } | null;
  riskProfileId?: string;
  riskProfileName?: RiskProfile;
  insight?: string | null;
}

export async function saveCRPAnswers(answers: CRPAnswer[], token: string) {
  return fetchJson<CRPSaveData>(`/v1/crp/answers/save`, {
    method: 'POST',
    body: JSON.stringify({ answers }),
  }, token);
}

// Utilities
export function normalizeRisk(name?: string | null): RiskProfile {
  if (!name) return null;
  if (name === 'Balanced') return 'Moderate';
  return ['Conservative', 'Moderate', 'Aggressive'].includes(name) ? (name as RiskProfile) : null;
}

// [moved] Products and Transactions sections relocated below Goals tracking

// Goals APIs
export interface CreateRetirementGoalReq {
  goalType: string; // must be uppercase e.g., 'RETIREMENT'
  goalName: string;
  targetAge: number;
  hopeLife: number;
  monthlyExpense: number;
}

export interface CreateOtherGoalReq {
  goalType: string; // must be uppercase e.g., 'OTHER'
  goalName: string;
  targetYear: number;
  targetAmount: number;
}

export async function createRetirementGoal(userId: string, req: CreateRetirementGoalReq, token?: string) {
  const path = `/v1/goals/createdGoalsRetirement`;
  return fetchJson<any>(path, {
    method: 'POST',
    headers: { 'X-User-Id': userId },
    body: JSON.stringify(req),
  }, token);
}

export async function createOtherGoal(userId: string, req: CreateOtherGoalReq, token?: string) {
  const path = `/v1/goals/createdGoalsOther`;
  return fetchJson<any>(path, {
    method: 'POST',
    headers: { 'X-User-Id': userId },
    body: JSON.stringify(req),
  }, token);
}

// Edit Goals APIs
export interface EditOtherGoalReq { targetYear: number; targetAmount: number }
export interface EditRetirementGoalReq { targetAge: number; hopeLife: number; monthlyExpense: number }

export async function editOtherGoal(userId: string, goalId: string, req: EditOtherGoalReq, token?: string) {
  const path = `/v1/goals/editGoalsOther/${encodeURIComponent(goalId)}`;
  return fetchJson<any>(path, {
    method: 'PUT',
    headers: { 'X-User-Id': userId },
    body: JSON.stringify(req),
  }, token);
}

export async function editRetirementGoal(userId: string, goalId: string, req: EditRetirementGoalReq, token?: string) {
  const path = `/v1/goals/editGoalsRetirement/${encodeURIComponent(goalId)}`;
  return fetchJson<any>(path, {
    method: 'PUT',
    headers: { 'X-User-Id': userId },
    body: JSON.stringify(req),
  }, token);
}

export interface SimulationProjection { month: number; date: string; value: number; progress: number; }
export interface SimulationResponse {
  goalId?: string | null;
  goalType: string;
  goalName: string;
  targetAge?: number;
  targetYear?: number;
  targetAmountNeeded?: number;
  assumptions?: Record<string, any>;
  projections: SimulationProjection[];
}

export async function simulateRetirementGoal(userId: string, req: CreateRetirementGoalReq, token?: string) {
  const path = `/v1/goals/simulateCreatedGoalsRetirement`;
  return fetchJson<SimulationResponse>(path, {
    method: 'POST',
    headers: { 'X-User-Id': userId },
    body: JSON.stringify(req),
  }, token);
}

export async function simulateOtherGoal(userId: string, req: CreateOtherGoalReq, token?: string) {
  const path = `/v1/goals/simulateCreatedGoalsOther`;
  return fetchJson<SimulationResponse>(path, {
    method: 'POST',
    headers: { 'X-User-Id': userId },
    body: JSON.stringify(req),
  }, token);
}

// Goals list and detail (gateway)
export interface GoalsListItem {
  goalId: string;
  goalType: string;
  goalName: string;
  targetAmount: number;
  targetDate: string; // YYYY-MM-DD
  riskProfileId?: string;
  createdAt?: string;
}

export async function fetchGoalsList(userId: string, token?: string) {
  const path = `/v1/goals/listGoals`;
  return fetchJson<GoalsListItem[]>(path, { method: 'GET', headers: { 'X-User-Id': userId } }, token);
}

export interface GoalDetail extends GoalsListItem {}

export async function fetchGoalDetail(userId: string, goalId: string, token?: string) {
  const path = `/v1/goals/detailGoals/${encodeURIComponent(goalId)}`;
  return fetchJson<GoalDetail>(path, { method: 'GET', headers: { 'X-User-Id': userId } }, token);
}

// Goals tracking (gateway)
export interface GoalTrackingItem {
  goalId: string;
  goalType: string;
  goalName: string;
  createdDate: string;
  targetDate: string;
  targetAmount: number;
  expectedValueToDate: number;
  actualValueToDate: number;
  shortfallPct: number;
  status: string; // ON_TRACK | OFF_TRACK | etc
  statusMessage?: string;
}

export async function fetchGoalsTracking(userId: string, token?: string) {
  const headers = { 'X-User-Id': userId } as Record<string, string>;
  try {
    const single = await fetchJson<GoalTrackingItem[]>(`/v1/goals/trackingGoals`, { method: 'GET', headers }, token);
    if (single?.success) return single;
  } catch {}
  // Retry with double slash variant if gateway expects it
  return fetchJson<GoalTrackingItem[]>(`/v1/goals//trackingGoals`, { method: 'GET', headers }, token);
}

// Products by risk profile
export interface ProductItem {
  productId: string;
  productName: string;
  productType: string;
  navPrice: number;
  cutOffTime: string; 
  productTypeId: string;
  updatedAt: string;
}

export async function fetchProductsByRisk(risk: Exclude<RiskProfile, null>, token?: string) {
  const path = `/v1/products/show-product/${encodeURIComponent(risk)}`;
  return fetchJson<ProductItem[]>(path, { method: 'GET' }, token);
}

// Buy transaction
export interface BuyRequest {
  customerId: string;
  productId: string;
  goalId: string; 
  amount: number; 
}
export interface BuyResponse {
  transactionId?: string;
}

export async function buyProduct(req: BuyRequest, token?: string) {
  const path = `/v1/transaction/buy`;
  return fetchJson<BuyResponse>(path, {
    method: 'POST',
    body: JSON.stringify(req),
  }, token);
}

// Transaction history (gateway)
export interface TransactionHistoryItem {
  transactionId?: string;
  date?: string; // ISO or YYYY-MM-DD
  type?: 'buy' | 'sell' | string;
  productName?: string;
  amount?: number; // IDR
  units?: number; // up to 6 decimals
  navPrice?: number;
  platform?: string;
  status?: 'pending' | 'settled' | 'rejected' | string;
}

export async function fetchTransactionHistory(customerId: string, token?: string) {
  const path = `/v1/transaction/history/${encodeURIComponent(customerId)}`;
  return fetchJson<TransactionHistoryItem[]>(path, { method: 'GET' }, token);
}

// Dashboard APIs (gateway)
export interface DashboardSummary {
  totalValue: number;
  breakdown: Array<{ productId: string; units: number; nav: number; value: number }>;
}

export async function fetchDashboardSummary(customerId: string, token?: string) {
  const path = `/v1/dashboard/summary?customerId=${encodeURIComponent(customerId)}`;
  return fetchJson<DashboardSummary>(path, { method: 'GET' }, token);
}

export interface DashboardTrendPoint { date: string; value: number }
export interface DashboardTrend { points: DashboardTrendPoint[] }

export async function fetchDashboardTrend(customerId: string, days = 30, token?: string) {
  const path = `/v1/dashboard/trend?customerId=${encodeURIComponent(customerId)}&days=${encodeURIComponent(String(days))}`;
  return fetchJson<DashboardTrend>(path, { method: 'GET' }, token);
}

