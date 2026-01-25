/**
 * Supabase 클라이언트 export
 */

export { createClient as createBrowserClient } from './client';
export { createClient as createServerClient } from './server';
export { updateSession } from './middleware';
export { signOut, getCurrentUser, getSession } from './auth';
export { 
  createProposal, 
  getMyProposals, 
  getProposal, 
  updateProposal, 
  deleteProposal 
} from './proposals';
export type { Database, User, Proposal, ProposalStatus } from './types';
