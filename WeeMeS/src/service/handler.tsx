// Centralized API handlers for WeeMeS
// Endpoints used across pages: auth, KYC, CRP validate/save

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

// Products by risk profile (8086 service)
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

// Buy transaction (8086 service)
export interface BuyRequest {
  customerId: string;
  productId: string;
  goalId: string; // temporary dummy
  amount: number; // in currency units
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

async function fetchSimulate<T>(path: string, init?: RequestInit, token?: string) {
  const base = import.meta.env.VITE_SIM_API_URL || 'http://localhost:8084';
  const url = base + path;
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (init && (init as any).headers) Object.assign(headers as any, (init as any).headers);
  if (token) (headers as any)['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { ...init, headers });
  const json = await res.json().catch(() => ({ success: false, data: null }));
  if (!res.ok) {
    const msg = (json?.messages || json?.errors)?.join(', ') || `Request failed: ${res.status}`;
    throw new Error(msg);
  }
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
  const path = `/v1/goals/SimulateCreatedGoalsOther`;
  return fetchJson<SimulationResponse>(path, {
    method: 'POST',
    headers: { 'X-User-Id': userId },
    body: JSON.stringify(req),
  }, token);
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
