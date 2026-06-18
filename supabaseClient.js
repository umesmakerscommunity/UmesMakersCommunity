import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// Cliente publico de Supabase para el frontend.
// Pega aqui tu SUPABASE_URL y SUPABASE_PUBLISHABLE_KEY si cambian en el futuro.
// Nunca uses service_role keys, secret keys ni credenciales privadas en este archivo.
const SUPABASE_URL = "https://opcbcimnpskhemhfetln.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_ViLOrdLJir6KeNoeMiCZSQ_AU5WWltm";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
