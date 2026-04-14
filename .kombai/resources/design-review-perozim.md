# Design Review: PEROZIM Sociedade de Advogados

**Data da Revisão:** 13 de Abril de 2026  
**Rota:** `/index.html` (Single-Page) + `/artigo-clausulas.html` + `/artigo-desconsideracao.html`  
**Áreas de Foco:** Design Visual · UX/Usabilidade · Responsivo/Mobile · Micro-interações · Consistência · Performance

---

## Resumo Executivo

O site possui uma identidade visual forte e profissional (paleta azul-marinho + laranja, tipografia Playfair/Inter) com boa estrutura geral. Contudo, foram encontrados **26 problemas** — incluindo 2 críticos que comprometem diretamente a conversão mobile, além de falhas de consistência entre a página principal e os artigos, ausência de favicon e práticas de performance que podem ser melhoradas.

---

## Tabela de Issues

| # | Problema | Criticidade | Categoria | Localização |
|---|----------|-------------|-----------|-------------|
| 1 | Banner de cookies cobre quase 50% do viewport mobile no carregamento, tornando o hero invisível. Combinado com a navbar fixa, não resta conteúdo visível acima do banner. | 🔴 Crítico | Responsivo/Mobile | `style.css:928-932` (padding-bottom: 100px no mobile) |
| 2 | Tag `</footer>` duplicada — HTML inválido que pode causar comportamento inesperado em parsers de navegadores e ferramentas SEO. | 🔴 Crítico | Consistência | `index.html:372` |
| 3 | Favicon ausente — gera erro 404 no console e prejudica a percepção de marca e SEO em dispositivos móveis. | 🟠 Alto | Performance | `index.html` — falta `<link rel="icon">` no `<head>` |
| 4 | `og:image` usa caminho relativo (`assets/...`). Shares via WhatsApp e LinkedIn não carregarão a imagem prévia pois requerem URL absoluta. | 🟠 Alto | UX/Usabilidade | `index.html:29` |
| 5 | Imagens sem atributo `loading="lazy"` abaixo do fold (Dr. Eduardo, insight cards, artigo). O site carrega ~2.9MB de imagens no inicio. | 🟠 Alto | Performance | `index.html:265`, `index.html:283`, `index.html:296` |
| 6 | Páginas de artigos não incluem `<script src="script.js">`. O menu hamburger não funciona em mobile nas páginas de artigo. | 🟠 Alto | Responsivo/Mobile | `artigo-clausulas.html`, `artigo-desconsideracao.html` — ausência de `<script>` |
| 7 | Páginas de artigos não possuem o botão `.mobile-menu-btn` (hamburger). Os links de nav transbordam horizontalmente em viewports estreitos. | 🟠 Alto | Responsivo/Mobile | `artigo-clausulas.html:62-75`, `artigo-desconsideracao.html:62-75` |
| 8 | Animação do hambúrguer para "X" incompleta. O JS apenas oculta a barra central; os pseudo-elementos `::before` e `::after` não se cruzam em diagonal. O feedback visual ao abrir o menu é pobre. | 🟠 Alto | Micro-interações | `script.js:31-39`, `style.css:240-254` |
| 9 | `background-attachment: fixed` no hero não funciona em iOS (Safari trata como `scroll`), gerando inconsistência visual. Em desktop causa repaint a cada frame de scroll, impactando performance. | 🟠 Alto | Performance / Responsivo | `style.css:265-269` |
| 10 | Blocos `<style>` idênticos duplicados nos dois arquivos de artigos. Qualquer alteração precisa ser replicada manualmente em dois lugares — violação do princípio DRY. | 🟡 Médio | Consistência | `artigo-clausulas.html:17-58`, `artigo-desconsideracao.html:17-58` |
| 11 | Hierarquia semântica de headings incorreta: `<h1>` está dentro do `<a class="brand">` na navbar; o título principal do hero usa `<h2>`. O heading mais importante da página deveria ser `<h1>`. | 🟡 Médio | UX/Usabilidade | `index.html:71-72`, `index.html:91` |
| 12 | Ausência de estilos `:focus-visible` explícitos. Usuários que navegam pelo teclado não veem indicadores de foco nos links, botões e cards. | 🟡 Médio | UX/Usabilidade | `style.css` — ausente globalmente |
| 13 | Rótulo do CTA da navbar inconsistente entre páginas: `index.html` usa "Contato e Localização"; artigos usam "Contato". | 🟡 Médio | Consistência | `index.html:82`, `artigo-*.html:72` |
| 14 | Estilos inline extensivos no HTML — `border-color`, `color`, `display`, `margin-left`, `width`, `height`, `font-size` etc. Dificulta manutenção e override responsivo. | 🟡 Médio | Consistência | `index.html:97`, `index.html:266`, `index.html:345`, `index.html:355-356` |
| 15 | `card-icon` tem `margin-bottom: var(--space-md)` (40px). Espaçamento excessivo entre ícone e título do card — deveria ser `var(--space-sm)` (16px) para manter proporção visual. | 🟡 Médio | Design Visual | `style.css:386-387` |
| 16 | Scroll suave duplicado: `scroll-behavior: smooth` no CSS + implementação manual via JS com `window.scrollTo({ behavior: 'smooth' })`. Em alguns navegadores causa efeito duplo ou conflito. | 🟡 Médio | Performance | `style.css:44`, `script.js:76-98` |
| 17 | Botão WhatsApp float sobrepõe visualmente o banner de cookies no mobile, mesmo com `padding-bottom: 100px`. A sobreposição persiste ao rolar a página enquanto o banner está ativo. | 🟡 Médio | Responsivo/Mobile | `style.css:874-885`, `style.css:928-932` |
| 18 | `--color-white-ice: #D9D9D9` — o nome "white-ice" sugere quase-branco, mas o valor é cinza médio (85% cinza). Nomenclatura enganosa prejudica a legibilidade do design system. | 🟡 Médio | Consistência | `style.css:9` |
| 19 | Botão "Nosso Escritório" no hero usa `style` inline para cor e borda em vez de uma variante de classe (`btn-secondary--light`). | 🟡 Médio | Consistência | `index.html:96-98` |
| 20 | Assets não referenciados: `media__1776022899172.png` e `perozim_hero_1776023893108.png` existem na pasta `/assets/` mas não são usados em nenhum HTML. Aumentam o peso do repositório. | ⚪ Baixo | Performance | `assets/media__1776022899172.png`, `assets/perozim_hero_1776023893108.png` |
| 21 | Imagem dos artigos usa `aspect-ratio: 21/9` (ultra-wide). Em mobile isso resulta em uma fatia muito fina da imagem, prejudicando a legibilidade visual do artigo. | ⚪ Baixo | Design Visual | `artigo-clausulas.html:93`, `artigo-desconsideracao.html:93` |
| 22 | Nenhum link "Pular para o conteúdo" (`skip-to-content`) implementado. Usuários de leitores de tela precisam percorrer toda a navbar antes do conteúdo em cada carregamento de página. | ⚪ Baixo | UX/Usabilidade | `index.html:67` — ausente antes do `<header>` |
| 23 | `<em>` usado no hero apenas para estilização itálica, sem semântica de ênfase. Leitores de tela irão enfatizar o texto desnecessariamente. | ⚪ Baixo | UX/Usabilidade | `index.html:91` |
| 24 | `.developer-credit` definido no CSS mas não existe em nenhum HTML. CSS morto que aumenta o tamanho do arquivo de estilos. | ⚪ Baixo | Performance | `style.css:671-678` |
| 25 | Ausência de `<meta name="theme-color">` — oportunidade perdida de mostrar a cor da marca (#031732) na barra de Chrome/Safari mobile. | ⚪ Baixo | Design Visual | `index.html` — ausente no `<head>` |
| 26 | Seção de insights não possui um estado visual claro de "card" — `.insight-card` tem `background-color: transparent` e se mistura com o fundo. Falta delimitação visual para distinguir os artigos entre si. | ⚪ Baixo | Design Visual | `style.css:506-513` |

---

## Legenda de Criticidade

- 🔴 **Crítico**: Quebra funcionalidade ou prejudica diretamente conversão
- 🟠 **Alto**: Impacta significativamente a experiência do usuário ou qualidade de design
- 🟡 **Médio**: Problema visível que deve ser corrigido
- ⚪ **Baixo**: Melhoria desejável (nice-to-have)

---

## Resumo por Categoria

| Categoria | Crítico | Alto | Médio | Baixo | Total |
|-----------|---------|------|-------|-------|-------|
| Responsivo/Mobile | 1 | 3 | 1 | — | 5 |
| Consistência | 1 | — | 4 | — | 5 |
| Performance | — | 3 | 1 | 2 | 6 |
| UX/Usabilidade | — | 1 | 2 | 2 | 5 |
| Design Visual | — | — | 1 | 3 | 4 |
| Micro-interações | — | 1 | — | — | 1 |
| **Total** | **2** | **8** | **9** | **7** | **26** |

---

## Próximos Passos Recomendados

**Prioridade Imediata (Crítico + Alto):**
1. Corrigir o banner de cookies para não cobrir o hero no mobile (reduzir altura ou implementar slideup após interação)
2. Remover a tag `</footer>` duplicada em `index.html:372`
3. Adicionar favicon (`/assets/` ou criar um SVG simples)
4. Corrigir a URL do `og:image` para URL absoluta
5. Adicionar `loading="lazy"` nas imagens abaixo do fold
6. Incluir `script.js` e o botão hamburger nos artigos
7. Completar a animação X do hamburger via CSS puro
8. Substituir `background-attachment: fixed` por solução alternativa (parallax JS leve ou remoção)

**Médio Prazo:**
9. Mover estilos duplicados dos artigos para `style.css`
10. Corrigir hierarquia semântica de headings
11. Adicionar `:focus-visible` global
12. Padronizar rótulo do CTA da navbar
13. Eliminar estilos inline — criar classes CSS adequadas
14. Renomear `--color-white-ice` para `--color-gray-light` ou similar

**Baixa Prioridade:**
15. Remover assets não utilizados
16. Adicionar `<meta name="theme-color">`
17. Implementar link de acessibilidade skip-to-content
18. Limpar CSS morto (`.developer-credit`)
