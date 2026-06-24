import { createClient } from '@supabase/supabase-js';

// ATENÇÃO: Para conectar o aplicativo ao seu próprio projeto do Supabase:
// Opção A: Substitua os valores abaixo diretamente com os dados do seu projeto Supabase.
// Opção B: Crie variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no seu provedor de deploy (Vercel, GitHub, etc.)
const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL || 'https://flnzycipcdqtwcyujzqe.supabase.co';
const SUPABASE_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsbnp5Y2lwY2RxdHdjeXVqenFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MjA5MzcsImV4cCI6MjA5NzE5NjkzN30.plqw_CtlaJmChDlnkTfHN9MUPVn0IK7Ty_WfujM3ICo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

