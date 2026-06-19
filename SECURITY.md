# Política de Segurança

## Reportar uma vulnerabilidade

Se encontrares um problema de segurança no GrowGreens, por favor **não** abras uma issue pública.

Em vez disso, usa o **GitHub Security Advisories** (separador "Security" → "Report a vulnerability") deste repositório, ou contacta o responsável em privado.

Inclui, se possível:
- Descrição do problema e impacto
- Passos para reproduzir
- Versão / commit afetado

## Âmbito

O GrowGreens é uma PWA **local-first**: os dados do utilizador ficam no dispositivo (IndexedDB) e não há servidor próprio por defeito. As áreas mais relevantes para segurança são:

- A sincronização cloud **opcional** (Supabase), quando ativada — ver `.env.example` e `supabase/`.
- As Edge Functions de diagnóstico por IA (chaves geridas via `supabase secrets`, nunca no cliente).

Agradecemos divulgação responsável. 🌱
