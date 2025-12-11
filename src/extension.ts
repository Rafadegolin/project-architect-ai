import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "software-architecture-analyzer.analyze",
    async () => {
      await analyzeProject();
    }
  );
  context.subscriptions.push(disposable);
}

async function analyzeProject() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showErrorMessage("❌ Nenhum projeto aberto!");
    return;
  }

  // Verificar API Key
  const config = vscode.workspace.getConfiguration("architectureAnalyzer");
  const apiKey = config.get<string>("apiKey");
  const apiProvider = config.get<string>("provider") || "openai";

  if (!apiKey) {
    vscode.window.showErrorMessage("❌ Configure sua API Key nas settings!");
    return;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "🔍 Analisando arquitetura...",
      cancellable: true,
    },
    async (progress, token) => {
      try {
        // Passo 1: Buscar arquivos
        progress.report({ message: "Escaneando arquivos..." });
        const files = await vscode.workspace.findFiles(
          "**/*.{ts,tsx,js,jsx,py,java,go,rs,json,md,yml,yaml,sql,prisma}",
          "{**/node_modules/**,**/dist/**,**/build/**,**/.next/**,**/venv/**,**/__pycache__/**}"
        );

        if (token.isCancellationRequested) {
          return;
        }
        // Passo 2: Montar estrutura do projeto
        progress.report({ message: `Lendo ${files.length} arquivos...` });
        const projectStructure = await buildProjectStructure(files);

        if (token.isCancellationRequested) {
          return;
        }

        // Passo 3: Enviar para LLM
        progress.report({ message: "Analisando com IA..." });
        const summary = await sendToLLM(projectStructure, apiKey, apiProvider);

        if (token.isCancellationRequested) {
          return;
        }

        // Passo 4: Mostrar resultado
        const doc = await vscode.workspace.openTextDocument({
          content: summary,
          language: "markdown",
        });
        await vscode.window.showTextDocument(doc, { preview: false });

        vscode.window.showInformationMessage("✅ Análise concluída!");
      } catch (error: any) {
        vscode.window.showErrorMessage(`❌ Erro: ${error.message}`);
        console.error(error);
      }
    }
  );
}

async function buildProjectStructure(files: vscode.Uri[]): Promise<string> {
  let structure = "# Estrutura do Projeto\n\n";

  // Agrupar arquivos por tipo/pasta
  const filesByFolder: { [key: string]: string[] } = {};

  for (const file of files) {
    const relativePath = vscode.workspace.asRelativePath(file);
    const folder = relativePath.split("/")[0];

    if (!filesByFolder[folder]) {
      filesByFolder[folder] = [];
    }
    filesByFolder[folder].push(relativePath);
  }

  // Construir estrutura hierárquica
  structure += "## Árvore de Diretórios\n```\n";
  for (const [folder, fileList] of Object.entries(filesByFolder)) {
    structure += `📁 ${folder}/\n`;
    for (const file of fileList.slice(0, 10)) {
      // Limitar para não explodir o token
      structure += `  └─ ${file.split("/").pop()}\n`;
    }
    if (fileList.length > 10) {
      structure += `  └─ ... (+${fileList.length - 10} arquivos)\n`;
    }
  }
  structure += "```\n\n";

  // Ler conteúdo dos arquivos mais importantes
  structure += "## Arquivos Principais\n\n";
  const importantFiles = files.filter((f) => {
    const name = f.path.toLowerCase();
    return (
      name.includes("package.json") ||
      name.includes("tsconfig") ||
      name.includes("docker") ||
      name.includes("readme") ||
      name.includes("prisma") ||
      name.includes(".env.example")
    );
  });

  for (const file of importantFiles.slice(0, 15)) {
    try {
      const content = await vscode.workspace.fs.readFile(file);
      const relativePath = vscode.workspace.asRelativePath(file);
      structure += `### ${relativePath}\n\`\`\`\n${content
        .toString()
        .slice(0, 2000)}\n\`\`\`\n\n`;
    } catch (err) {
      // Ignorar erros de leitura
    }
  }

  return structure;
}

async function sendToLLM(
  projectData: string,
  apiKey: string,
  provider: string
): Promise<string> {
  const prompt = `Você é um arquiteto de software sênior. Analise a estrutura do projeto abaixo e gere um relatório técnico detalhado contendo:

1. **Tipo de Aplicação**: Web, API, Desktop, Mobile, etc.
2. **Stack Tecnológica**: Linguagens, frameworks, bibliotecas principais
3. **Arquitetura**: Padrões arquiteturais identificados (MVC, Clean Architecture, Microservices, etc.)
4. **Estrutura de Pastas**: Organização e convenções
5. **Banco de Dados**: Se houver, qual tipo e ORM usado
6. **APIs e Integrações**: Serviços externos integrados
7. **Build e Deploy**: Ferramentas de build, containerização
8. **Pontos Fortes**: O que está bem arquitetado
9. **Sugestões de Melhoria**: Oportunidades de refatoração ou otimização

${projectData}`;

  if (provider === "openai") {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "Você é um arquiteto de software especializado em análise de código.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = (await response.json()) as any;
      throw new Error(
        `OpenAI API Error: ${error.error?.message || "Unknown error"}`
      );
    }

    interface OpenAIResponse {
      choices: {
        message: {
          content: string;
        };
      }[];
    }

    const data = (await response.json()) as OpenAIResponse;
    return data.choices[0].message.content;
  } else {
    throw new Error('Provider não suportado ainda. Use "openai".');
  }
}

export function deactivate() {}
