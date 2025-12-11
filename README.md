# 🏗️ Software Architecture Analyzer

> Analise a arquitetura de qualquer projeto usando Inteligência Artificial

![VS Code Version](https://img.shields.io/badge/VS%20Code-1.85.0+-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Sobre

Software Architecture Analyzer é uma extensão para VS Code que utiliza modelos de linguagem (LLMs) para analisar automaticamente a estrutura e arquitetura de seus projetos de software, gerando relatórios técnicos detalhados em segundos.

## ✨ Funcionalidades

- 🔍 **Varredura Automática**: Escaneia todo o projeto identificando arquivos relevantes
- 🤖 **Análise com IA**: Utiliza GPT-4 para análise profunda da arquitetura
- 📊 **Relatório Detalhado**: Gera documentação técnica completa incluindo:
  - Stack tecnológica utilizada
  - Padrões arquiteturais identificados
  - Estrutura de pastas e organização
  - Integrações e dependências
  - Sugestões de melhoria
- ⚡ **Rápido e Eficiente**: Análise completa em poucos segundos
- 🎯 **Suporte Multi-linguagem**: TypeScript, JavaScript, Python, Java, Go, Rust e mais

## 🚀 Como Usar

1. Abra qualquer projeto no VS Code
2. Pressione `Ctrl+Shift+P` (ou `Cmd+Shift+P` no Mac)
3. Digite: **"Analisar Arquitetura do Projeto"**
4. Aguarde a análise e visualize o relatório em Markdown

![Demo](https://via.placeholder.com/800x450/1e1e1e/ffffff?text=Demo+em+breve)

## ⚙️ Configuração

### Requisitos

- VS Code 1.85.0 ou superior
- API Key da OpenAI ([obtenha aqui](https://platform.openai.com/api-keys))

### Configurar API Key

1. Abra as Settings (`Ctrl+,`)
2. Busque por "Architecture Analyzer"
3. Cole sua API Key da OpenAI no campo **"Api Key"**

Ou adicione diretamente no `settings.json`:

{
"architectureAnalyzer.apiKey": "sk-proj-sua-chave-aqui",
"architectureAnalyzer.provider": "openai"
}

## 📦 Instalação

### Via Marketplace (em breve)

1. Abra a aba de Extensions no VS Code (`Ctrl+Shift+X`)
2. Busque por "Software Architecture Analyzer"
3. Clique em "Install"

### Manual (VSIX)

1. Baixe o arquivo `.vsix` da [página de releases](https://github.com/seu-usuario/software-architecture-analyzer/releases)
2. No VS Code: `Ctrl+Shift+P` → "Install from VSIX..."
3. Selecione o arquivo baixado

## 🛠️ Tecnologias

- TypeScript
- VS Code Extension API
- OpenAI GPT-4
- esbuild

## 🤝 Contribuindo

Contribuições são bem-vindas! Veja como você pode ajudar:

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Commit suas mudanças: `git commit -m 'feat: minha nova feature'`
4. Push para a branch: `git push origin feature/minha-feature`
5. Abra um Pull Request

## 📝 Roadmap

- [ ] Suporte para Claude (Anthropic)
- [ ] Suporte para modelos locais (Ollama)
- [ ] Exportar relatório em PDF
- [ ] Comparação de arquiteturas entre versões
- [ ] Dashboard interativo
- [ ] Análise de performance e complexidade ciclomática

## 📄 Licença

MIT © 2025 [Seu Nome]

## 🔗 Links

- [Repositório GitHub](https://github.com/seu-usuario/software-architecture-analyzer)
- [Reportar Bug](https://github.com/seu-usuario/software-architecture-analyzer/issues)
- [Solicitar Feature](https://github.com/seu-usuario/software-architecture-analyzer/issues/new)

---

**Desenvolvido com ❤️ no Brasil 🇧🇷**
