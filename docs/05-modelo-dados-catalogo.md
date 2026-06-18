# Especificação do Modelo de Dados — Catálogo de Plantas (GrowGreens)

**Versão:** 1.0 · **Data:** junho 2026 · **Stack:** Vue 3 + Supabase (Postgres 15+) · **Mercado:** Portugal (litoral atlântico, calibrado a Ovar/Aveiro)

Desenhado para o objetivo *"pesquisar tudo o que existe"*: escala de ~20 culturas (MVP) para centenas/milhares de fichas, sem refactor de raiz.

---

## 1. Taxonomia e âmbito

### 1.1 Três eixos de classificação independentes
Uma planta deve ser encontrável por vários caminhos mentais:

| Eixo | Para quê | Exemplos | Cardinalidade |
|---|---|---|---|
| **Categoria de uso** (`plant_category`) | Filtro do leigo | hortícola, aromática, fruto, flor comestível, microgreen, leguminosa | 1 (dominante) |
| **Tipo/parte colhida** (`plant_part_type`) | Agrupa práticas de cultivo | folha, raiz/tubérculo, fruto, leguminosa, brássica, bolbo, caule, flor, semente | 1..N |
| **Família botânica** (`plant_family`) | Rotação, pragas/doenças partilhadas | Solanaceae, Brassicaceae, Fabaceae, Apiaceae... | 1 |

A família é a base da **rotação de culturas** e da herança de pragas (tomate e batata, ambas Solanaceae, partilham míldio). A redundância categoria/tipo é intencional: o leigo procura "couves", o agrónomo "Brassicaceae", ambos chegam à mesma ficha.

### 1.2 Escala por fase
| Fase | Nº fichas | Profundidade | Origem |
|---|---|---|---|
| MVP | 20-30 | Completas e curadas | Curado / IA-com-revisão |
| Fase 2 | 80-150 | Comuns em PT, com calendário | Curado + import seletivo |
| Fase 3 | 400-800 | "Quase tudo em PT" | Import + curadoria por lotes |
| Longo prazo | 3.000-10.000+ | Enciclopédico (muitas só com dados base) | Import em massa + enriquecimento |

**Conceito-chave — `data_completeness`** (`stub` → `basic` → `curated` → `verified`): nem toda a ficha precisa de estar completa para ser pesquisável. Um stub importado (nome científico + comum + família + foto) já satisfaz "pesquisar tudo"; enriquece-se depois as que importam. Resolve a tensão entre "completo" e "curado de qualidade".

---

## 2. Schema Postgres (DDL)

### 2.1 Extensões e enums
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent";   -- pesquisa PT sem acentos
CREATE EXTENSION IF NOT EXISTS "pg_trgm";     -- fuzzy / typo-tolerant

CREATE TEXT SEARCH CONFIGURATION pt_unaccent ( COPY = portuguese );
ALTER TEXT SEARCH CONFIGURATION pt_unaccent
  ALTER MAPPING FOR hword, hword_part, word WITH unaccent, portuguese_stem;

CREATE TYPE plant_category AS ENUM (
  'horticola','aromatica','fruto','flor_comestivel','leguminosa','microgreen','cereal_pseudocereal','cogumelo','outro');
CREATE TYPE plant_part_type AS ENUM (
  'folha','raiz_tuberculo','fruto','leguminosa','brassica','bolbo','caule','flor','semente_grao','aromatica');
CREATE TYPE difficulty_level AS ENUM ('facil','medio','dificil');
CREATE TYPE grow_location AS ENUM ('interior','exterior','ambos','estufa');
CREATE TYPE sowing_method AS ENUM ('sementeira_direta','transplante','ambos','estaca','divisao','bolbo_tuberculo');
CREATE TYPE life_cycle AS ENUM ('anual','bienal','perene');
CREATE TYPE sun_exposure AS ENUM ('sol_pleno','meia_sombra','sombra');
CREATE TYPE water_need AS ENUM ('baixa','moderada','alta');
CREATE TYPE data_completeness AS ENUM ('stub','basic','curated','verified');
CREATE TYPE companion_relation AS ENUM ('benefica','prejudicial','neutra');
CREATE TYPE calendar_action AS ENUM ('sementeira_interior','sementeira_direta','transplante','colheita','plantacao_bolbo');
CREATE TYPE growth_stage_code AS ENUM ('germinacao','plantula','vegetativo','floracao','frutificacao','colheita');
```

### 2.2 Famílias botânicas
```sql
CREATE TABLE plant_families (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  scientific_name text NOT NULL UNIQUE,
  common_name_pt text,
  description_pt text,
  rotation_group smallint,          -- agrupamento p/ rotação
  created_at timestamptz NOT NULL DEFAULT now()
);
```

### 2.3 Tabela central `plants`
```sql
CREATE TABLE plants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text NOT NULL UNIQUE,
  common_name_pt text NOT NULL,
  scientific_name text,
  cultivar text,
  family_id uuid REFERENCES plant_families(id) ON DELETE SET NULL,
  category plant_category NOT NULL DEFAULT 'outro',
  difficulty difficulty_level,
  grow_location grow_location,
  life_cycle life_cycle,
  sowing_method sowing_method,
  sun_exposure sun_exposure,
  days_to_harvest_min smallint CHECK (days_to_harvest_min >= 0),
  days_to_harvest_max smallint CHECK (days_to_harvest_max >= days_to_harvest_min),
  days_to_germinate_min smallint,
  days_to_germinate_max smallint,
  ph_min numeric(3,1) CHECK (ph_min BETWEEN 0 AND 14),
  ph_max numeric(3,1) CHECK (ph_max BETWEEN 0 AND 14),
  soil_notes_pt text,
  sun_hours_min smallint CHECK (sun_hours_min BETWEEN 0 AND 24),
  temp_germ_min_c smallint, temp_germ_max_c smallint,
  frost_tolerant boolean,                       -- crítico p/ PT interior
  spacing_in_row_cm smallint, spacing_between_rows_cm smallint,
  sowing_depth_cm numeric(4,1),
  pot_volume_min_l numeric(5,1),
  mature_height_cm smallint, mature_spread_cm smallint,
  water_need water_need, watering_notes_pt text,
  description_pt text, growing_tips_pt text, harvest_notes_pt text,
  portugal_notes_pt text,                        -- nota clima atlântico
  health_summary_pt text,
  is_beginner_friendly boolean DEFAULT false,
  is_microgreen boolean DEFAULT false,
  data_completeness data_completeness NOT NULL DEFAULT 'stub',
  source_attribution text,                       -- crédito de licença
  external_ids jsonb DEFAULT '{}'::jsonb,        -- {gbif, wikidata, permapeople, usda}
  search_vector tsvector,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```
`external_ids` (jsonb) permite reconciliar com qualquer fonte futura sem alterar o schema. `source_attribution` cumpre a obrigação de atribuição CC BY-SA.

### 2.4 Tipos/partes (N:N) e i18n
```sql
CREATE TABLE plant_part_types (
  plant_id uuid NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  part_type plant_part_type NOT NULL,
  is_primary boolean DEFAULT false,
  PRIMARY KEY (plant_id, part_type)
);
CREATE TABLE plant_names (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  plant_id uuid NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  locale text NOT NULL DEFAULT 'pt-PT',
  name text NOT NULL,
  is_primary boolean DEFAULT false,
  name_type text DEFAULT 'comum',                -- comum|cientifico|regional|sinonimo
  UNIQUE (plant_id, locale, name)
);
CREATE INDEX idx_plant_names_trgm ON plant_names USING gin (unaccent(name) gin_trgm_ops);
```
**i18n pragmático:** texto longo em colunas `_pt` na Fase 1 (PT-PT é o único idioma); nomes em `plant_names` (já multilíngue). Futuro EN/ES → migrar texto longo para `plant_translations(plant_id, locale, field, value)`, sem pagar esse custo agora.

### 2.5 Fotos
```sql
CREATE TABLE plant_photos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  plant_id uuid NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  alt_text_pt text, credit text, license text,   -- atribuição obrigatória
  is_cover boolean DEFAULT false,
  growth_stage growth_stage_code,
  sort_order smallint DEFAULT 0
);
```

### 2.6 Fases de crescimento (reutilizáveis + parametrização)
```sql
CREATE TABLE growth_stages (
  code growth_stage_code PRIMARY KEY,
  name_pt text NOT NULL,
  sort_order smallint NOT NULL,
  generic_description_pt text
);
CREATE TABLE plant_growth_stages (
  plant_id uuid NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  stage_code growth_stage_code NOT NULL REFERENCES growth_stages(code),
  duration_days_min smallint, duration_days_max smallint,
  watering_pt text, light_pt text, nutrients_pt text,
  actions_pt text, warnings_pt text,
  PRIMARY KEY (plant_id, stage_code)
);
```

### 2.7 Calendário de sementeira por mês e região
```sql
CREATE TABLE climate_zones (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  code text NOT NULL UNIQUE,                      -- 'litoral_norte', 'interior_norte'...
  name_pt text NOT NULL,                          -- 'Litoral Norte (Ovar/Aveiro)'
  description_pt text,
  last_frost_month smallint, first_frost_month smallint
);
CREATE TABLE sowing_calendar (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  plant_id uuid NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  zone_id uuid NOT NULL REFERENCES climate_zones(id) ON DELETE CASCADE,
  month smallint NOT NULL CHECK (month BETWEEN 1 AND 12),
  action calendar_action NOT NULL,
  is_optimal boolean DEFAULT true,                -- janela ótima vs possível
  notes_pt text,
  UNIQUE (plant_id, zone_id, month, action)
);
CREATE INDEX idx_calendar_zone_month ON sowing_calendar (zone_id, month, action);
CREATE INDEX idx_calendar_plant ON sowing_calendar (plant_id);
```
Responde a "o que posso semear este mês em Ovar": `WHERE zone_id=:ovar AND month=:mes AND action IN ('sementeira_direta','sementeira_interior')`.

### 2.8 Consociação (auto-relação N:N direcional)
```sql
CREATE TABLE plant_companions (
  plant_id uuid NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  companion_id uuid NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  relation companion_relation NOT NULL,
  reason_pt text,
  PRIMARY KEY (plant_id, companion_id),
  CHECK (plant_id <> companion_id)
);
```

### 2.9 Pragas e doenças (catálogo + N:N)
```sql
CREATE TABLE pests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), slug text NOT NULL UNIQUE,
  common_name_pt text NOT NULL, scientific_name text,
  description_pt text, symptoms_pt text, treatment_pt text, prevention_pt text);
CREATE TABLE diseases (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), slug text NOT NULL UNIQUE,
  common_name_pt text NOT NULL, pathogen_type text,
  description_pt text, symptoms_pt text, treatment_pt text, prevention_pt text,
  is_fungal boolean DEFAULT false);               -- destaque clima atlântico
CREATE TABLE plant_pests (
  plant_id uuid NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  pest_id uuid NOT NULL REFERENCES pests(id) ON DELETE CASCADE,
  severity smallint CHECK (severity BETWEEN 1 AND 5), notes_pt text,
  PRIMARY KEY (plant_id, pest_id));
CREATE TABLE plant_diseases (
  plant_id uuid NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  disease_id uuid NOT NULL REFERENCES diseases(id) ON DELETE CASCADE,
  severity smallint CHECK (severity BETWEEN 1 AND 5), notes_pt text,
  PRIMARY KEY (plant_id, disease_id));
```
Catálogo próprio (não texto livre) permite "doença do míldio: que plantas afeta" e filtro inverso. Flag `is_fungal` porque no litoral atlântico o maior risco é o fungo.

### 2.10 Saúde / nutrição
```sql
CREATE TABLE nutrient_groups (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), code text NOT NULL UNIQUE,
  name_pt text NOT NULL, benefits_pt text);
CREATE TABLE health_benefits (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  plant_id uuid NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  group_id uuid REFERENCES nutrient_groups(id) ON DELETE SET NULL,
  nutrient_pt text, benefit_pt text,
  evidence_note text,                             -- origem/força da evidência
  sort_order smallint DEFAULT 0);
CREATE INDEX idx_health_plant ON health_benefits (plant_id);
```
`evidence_note` protege contra risco regulatório de alegações de saúde e permite "com base em…".

### 2.11 Receitas
```sql
CREATE TABLE recipes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), slug text NOT NULL UNIQUE,
  title_pt text NOT NULL, description_pt text,
  prep_minutes smallint, difficulty difficulty_level, body_pt text);
CREATE TABLE plant_recipes (
  plant_id uuid NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  recipe_id uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  is_primary_ingredient boolean DEFAULT false,
  PRIMARY KEY (plant_id, recipe_id));
```

### 2.12 Full-text search + índices
```sql
CREATE FUNCTION plants_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
      setweight(to_tsvector('pt_unaccent', coalesce(NEW.common_name_pt,'')), 'A')
    || setweight(to_tsvector('pt_unaccent', coalesce(NEW.scientific_name,'')), 'B')
    || setweight(to_tsvector('pt_unaccent', coalesce(NEW.description_pt,'')), 'C')
    || setweight(to_tsvector('pt_unaccent', coalesce(NEW.growing_tips_pt,'')), 'D');
  NEW.updated_at := now();
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_plants_search BEFORE INSERT OR UPDATE ON plants
  FOR EACH ROW EXECUTE FUNCTION plants_search_vector_update();

CREATE INDEX idx_plants_search ON plants USING gin (search_vector);
CREATE INDEX idx_plants_name_trgm ON plants USING gin (unaccent(common_name_pt) gin_trgm_ops);
CREATE INDEX idx_plants_category ON plants (category);
CREATE INDEX idx_plants_difficulty ON plants (difficulty);
CREATE INDEX idx_plants_location ON plants (grow_location);
CREATE INDEX idx_plants_harvest ON plants (days_to_harvest_max);
CREATE INDEX idx_plants_family ON plants (family_id);
CREATE INDEX idx_plants_completeness ON plants (data_completeness);
CREATE INDEX idx_plants_beginner ON plants (is_beginner_friendly) WHERE is_beginner_friendly;
```

---

## 3. Pesquisa e filtros

### 3.1 Pesquisa por nome (PT, tolerante a acentos/erros)
Três camadas: **full-text** (`websearch_to_tsquery('pt_unaccent', :q)` + `ts_rank`); **fuzzy** (`pg_trgm` sobre `unaccent(...)`); **prefixo** (autocomplete). Com `unaccent` em todo o lado, "acafrao" encontra "açafrão" e "alfaca" encontra "alface".
```sql
CREATE FUNCTION search_plants(q text) RETURNS SETOF plants AS $$
  SELECT DISTINCT p.* FROM plants p
  LEFT JOIN plant_names n ON n.plant_id = p.id
  WHERE p.search_vector @@ websearch_to_tsquery('pt_unaccent', q)
     OR unaccent(p.common_name_pt) % unaccent(q)
     OR unaccent(n.name) % unaccent(q)
  ORDER BY ts_rank(p.search_vector, websearch_to_tsquery('pt_unaccent', q)) DESC NULLS LAST;
$$ LANGUAGE sql STABLE;
```

### 3.2 Filtros facetados (o "pesquisar tudo")
| Faceta | Coluna/relação |
|---|---|
| Categoria | `plants.category` |
| Tipo/parte | `plant_part_types` (EXISTS) |
| Família | `plants.family_id` |
| Dificuldade | `plants.difficulty` |
| Interior/exterior | `plants.grow_location` |
| **Época ("este mês em Ovar")** | `sowing_calendar` (EXISTS zone+month+action) |
| Tempo até colheita | `days_to_harvest_max <= :dias` |
| Espaço (vaso) | `pot_volume_min_l <= :litros` |
| Tolera geada | `frost_tolerant` |
| Objetivo nutricional | `health_benefits.group_id` (EXISTS) |
| Nível de detalhe | `data_completeness >= 'curated'` |

Facetas `AND` entre si, `IN`/`OR` dentro de cada. Contagens via `COUNT(*) GROUP BY`. Recomenda-se RPC única `catalog_search(q, filtros jsonb)` que devolve página + contagens — lógica no Postgres, app fina.

---

## 4. Fontes de dados para popular o catálogo

### 4.1 Estado das fontes (2025/26, verificado)
| Fonte | Estado | Licença | Veredicto |
|---|---|---|---|
| **OpenFarm** | ❌ Encerrada (abr 2025) | CC BY-SA (era) | Não usar |
| **Trefle** | ⚠️ Instável | CC, token | Não depender |
| **Permapeople** | ✅ Ativa | **CC BY-SA 4.0** | **Recomendada** (factos) |
| **GBIF** | ✅ Robusta (`api.gbif.org`) | Maioria **CC0** | **Recomendada** (taxonomia) |
| **Wikidata** | ✅ Ativa (SPARQL) | **CC0** | **Recomendada** (stubs, i18n) |
| **USDA PLANTS** | ✅ Ativa | Domínio público (US) | Traços; viés EUA no calendário |
| **Perenual** | ✅ Freemium | Uso comercial só pago | Opcional, cuidado |
| **Flora-On** | ✅ Ativa | **CC BY-NC 4.0** | Só referência manual |
| **Flora Digital UTAD** | ✅ Ativa | Verificar | Referência PT manual |

### 4.2 Aviso de licenciamento (crítico se a app for comercial)
1. **CC BY-SA (Permapeople)** é share-alike: usar sobretudo para **factos numéricos** (dias até colheita, pH, espaçamento — factos isolados não têm copyright); texto original escrito por nós/IA. Atribuir sempre.
2. **CC BY-NC (Flora-On):** não comercial → **não importar**, só verificação humana de nomes PT.
3. **CC0 (Wikidata, maioria GBIF) e Domínio Público (USDA):** base segura para import em massa.
Campo `source_attribution` por ficha + página "Fontes e créditos".

### 4.3 Pipeline de povoamento (4 camadas)
1. **Espinha taxonómica (stubs, CC0):** Wikidata (SPARQL) + GBIF → nome científico, família, nomes PT, IDs externos, imagem Commons. `data_completeness='stub'`. Já cumpre "pesquisar tudo".
2. **Enriquecimento de cultivo (factos):** Permapeople + USDA → números (dias, pH, sol, espaçamento). `'basic'`.
3. **Curadoria PT-PT (o valor):** descrições, dicas, fases, **calendário de Ovar/zonas**, clima atlântico, saúde, consociação. IA rascunha → **revisão humana**. MVP todo assim → `'curated'`.
4. **Verificação:** contra Flora-On/UTAD (nomes) + experiência real → `'verified'`.

**Regra IA:** pode rascunhar e propor valores, mas **nunca** publicar alegação de saúde ou número de calendário sem revisão humana. Nunca expor stub/basic não revisto como "conselho oficial".

---

## 5. Qualidade e manutenção

**Versionamento:**
```sql
CREATE TABLE plant_revisions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  plant_id uuid NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  snapshot jsonb NOT NULL, changed_by uuid, change_note text,
  created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX idx_revisions_plant ON plant_revisions (plant_id, created_at DESC);
```
Com RLS: catálogo legível por todos (`SELECT` público); escrita só por `editor`/`admin`.

**Validação:** `CHECK` na BD (pH 0-14, `harvest_max >= harvest_min`, sol 0-24, severidade 1-5); regra de negócio — não passar a `curated` sem `common_name_pt`, `category`, `difficulty`, ≥1 `sowing_calendar` e ≥1 foto; imports discordantes → registar ambos + marcar para revisão.

**Adaptação a Portugal (vantagem competitiva, modelada de propósito):** `climate_zones` com meses de geada (Ovar entre litoral suave e interior com geada até meados de abril); `frost_tolerant` cruza com zona para alertas ("não semeies manjericão antes de maio"); `is_fungal` + `portugal_notes_pt`/`watering_notes_pt` materializam o aviso-mestre (risco = fungo → espaçamento, rega de manhã pela base, ventilação); `sowing_calendar.is_optimal` distingue janela ótima de possível. Rever calendário anualmente.

---

## Resumo
3 eixos de classificação; `plants` rica; fases reutilizáveis parametrizadas; **calendário por zona×mês×ação**; companion/pragas/doenças/saúde/receitas como catálogos próprios + N:N; pesquisa PT com `tsvector` (`pt_unaccent`) + `pg_trgm`. "Pesquisar tudo" resolvido por `data_completeness` (stubs CC0 tornam tudo pesquisável já; curadoria onde gera valor). Import seguro: **Wikidata/GBIF (CC0)**, **USDA (domínio público)**; Permapeople (CC BY-SA) só factos; Flora-On (NC) só referência. OpenFarm morta, Trefle instável.

## Fontes
- Permapeople API + CC BY-SA — https://permapeople.org/knowledgebase/api-docs/
- OpenFarm (encerrada) — https://github.com/openfarmcc/OpenFarm
- GBIF API + licenciamento — https://techdocs.gbif.org/en/openapi/ · https://www.gbif.org/terms
- Wikidata SPARQL + CC0 — https://query.wikidata.org/sparql
- USDA PLANTS — https://plants.usda.gov/downloads
- Perenual pricing — https://perenual.com/subscription-api-pricing
- Flora-On (CC BY-NC) — https://flora-on.pt/
- Flora Digital de Portugal (UTAD) — https://jb.utad.pt/flora
