# 🔧 Troubleshooting CI/CD

## ⚠️ Avisos de Peer Dependencies

### Status: **NORMAL - NÃO É UM PROBLEMA**

Os avisos sobre `react-i18next`, `react-native`, `i18next` são **normais** e **não afetam o funcionamento** do projeto.

### Por que aparecem?

Esses avisos vêm de dependências transitivas (Metamask SDK, Alchemy) que esperam React/i18next, mas este projeto **não usa React diretamente**. São apenas avisos informativos.

### Exemplos de avisos normais:

```
npm warn ERESOLVE overriding peer dependency
npm warn While resolving: react-i18next@13.5.0
npm warn Found: i18next@22.5.1
```

**✅ Pode ignorar** - Não afeta o build ou funcionamento.

---

## ❌ Erro: `npm ci` - Lock File Desatualizado

### Erro:
```
npm error `npm ci` can only install packages when your package.json and package-lock.json are in sync.
npm error Missing: utf-8-validate@5.0.10 from lock file
npm error Missing: zod@3.25.76 from lock file
```

### Solução:

#### 1. Localmente (já feito):
```bash
npm install
git add package-lock.json
git commit -m "fix: atualizar package-lock.json"
git push
```

#### 2. No CI/CD (GitHub Actions):

Se o erro persistir no CI, adicione ao workflow:

```yaml
- name: Install dependencies
  run: |
    npm install
    # ou use --legacy-peer-deps se necessário
    # npm install --legacy-peer-deps
```

Ou use `npm install` ao invés de `npm ci`:

```yaml
- name: Install dependencies
  run: npm install
```

---

## 🔧 Soluções para CI/CD

### Opção 1: Usar `npm install` (Recomendado)

No seu workflow do GitHub Actions, troque:

```yaml
# ❌ Antes
- run: npm ci

# ✅ Depois
- run: npm install
```

### Opção 2: Usar `--legacy-peer-deps`

```yaml
- name: Install dependencies
  run: npm install --legacy-peer-deps
```

### Opção 3: Atualizar lock file antes do CI

```yaml
- name: Install dependencies
  run: |
    npm install
    npm ci
```

---

## 📋 Checklist para Resolver

- [x] `package-lock.json` atualizado localmente
- [x] Commit e push do `package-lock.json` feito
- [ ] Verificar se CI/CD usa `npm ci` ou `npm install`
- [ ] Ajustar workflow se necessário

---

## ✅ Status Atual

- **Local:** `package-lock.json` está sincronizado ✅
- **Avisos:** Normais, podem ser ignorados ✅
- **CI/CD:** Pode precisar ajustar workflow (ver acima)

---

**💡 Dica:** Se o erro persistir no CI, verifique a versão do Node.js/npm no workflow e garanta que está usando a mesma versão local.

