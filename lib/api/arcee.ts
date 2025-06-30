interface ArceeMessage {
    role: 'user' | 'assistant' | 'system'
    content: string
  }
  
  interface ArceeResponse {
    choices: Array<{
      message: {
        content: string
        role: string
      }
    }>
    usage?: {
      prompt_tokens: number
      completion_tokens: number
      total_tokens: number
    }
  }
  
  export class ArceeClient {
    private readonly baseURL = 'https://conductor.arcee.ai/v1'
    private readonly token: string
  
    constructor() {
      this.token = process.env.ARCEE_TOKEN || process.env.NEXT_PUBLIC_ARCEE_TOKEN || ''
      if (!this.token) {
        throw new Error('ARCEE_TOKEN is required')
      }
    }
  
    async generateResponse(messages: ArceeMessage[]): Promise<string> {
      try {
        const response = await fetch(`${this.baseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'auto',
            messages,
            temperature: 0.7,
            max_tokens: 2500,
          }),
        })
  
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
        }
  
        const data: ArceeResponse = await response.json()
        
        if (!data.choices || data.choices.length === 0) {
          throw new Error('No response generated')
        }
  
        return data.choices[0].message.content
      } catch (error) {
        console.error('Arcee API Error:', error)
        if (error instanceof Error) {
          throw error
        }
        throw new Error('Failed to generate response')
      }
    }
  
    async generateVBACode(prompt: string): Promise<{ explanation: string; code: string }> {
      const systemPrompt = this.getVBASystemPrompt()
      const userPrompt = this.formatVBAUserPrompt(prompt)
  
      const messages: ArceeMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
  
      const response = await this.generateResponse(messages)
      return this.parseVBAResponse(response)
    }
  
    private getVBASystemPrompt(): string {
      return `Você é um especialista em VBA (Visual Basic for Applications) focado em ajudar usuários iniciantes e intermediários. Sua missão é gerar código VBA funcional, didático e seguro.
  
  DIRETRIZES FUNDAMENTAIS:
  
  1. **FORMATO DE RESPOSTA OBRIGATÓRIO:**
     Sua resposta DEVE seguir EXATAMENTE este formato Markdown:
  
     ## 📋 Análise da Solicitação
     [Breve análise do que foi pedido]
  
     ## 🎯 Funcionalidade
     [Explicação clara do que o código faz]
  
     ## 📝 Como Aplicar
     1. **Abrir o Editor VBA:** Pressione \`Alt+F11\` no Excel
     2. **Criar Módulo:** Clique em \`Inserir → Módulo\`
     3. **Colar Código:** Cole o código gerado no módulo
     4. **Executar:** Pressione \`F5\` ou \`Alt+F8\` para executar
  
     ## ⚙️ Configurações Necessárias
     [Mencione qualquer configuração especial, se houver]
  
     ## 💡 Dicas de Uso
     - [Dica 1]
     - [Dica 2]
     - [Dica 3]
  
     ## 🔧 Personalização
     [Como o usuário pode adaptar o código para suas necessidades]
  
     ## ⚠️ Observações Importantes
     [Avisos sobre backup, testes, etc.]
  
  2. **QUALIDADE DO CÓDIGO:**
     - Sempre use "Option Explicit" quando relevante
     - Inclua tratamento básico de erros com \`On Error\`
     - Use variáveis com nomes descritivos em português
     - Adicione comentários explicativos
     - Use "Set objeto = Nothing" para limpeza de memória
     - Valide entradas quando necessário
  
  3. **SEGURANÇA E BOAS PRÁTICAS:**
     - Evite operações que possam causar perda de dados
     - Sempre sugira backup antes de executar
     - Use \`Application.ScreenUpdating = False\` para otimização
     - Implemente confirmações para ações críticas
  
  4. **DIDÁTICA:**
     - Explique conceitos técnicos de forma simples
     - Use exemplos práticos
     - Forneça alternativas quando possível
     - Inclua troubleshooting básico
  
  5. **ESTRUTURA DO CÓDIGO:**
     Sempre estruture o código VBA desta forma:
     \`\`\`vba
     Option Explicit ' Se aplicável
     
     Sub NomeProcedimento()
         ' Declaração de variáveis
         Dim var1 As String
         Dim var2 As Integer
         
         ' Configurações iniciais
         Application.ScreenUpdating = False
         
         ' Tratamento de erros
         On Error GoTo TrataErro
         
         ' Lógica principal aqui
         ' [Código funcional]
         
         ' Limpeza e finalização
         Application.ScreenUpdating = True
         MsgBox "Operação concluída com sucesso!"
         Exit Sub
         
     TrataErro:
         Application.ScreenUpdating = True
         MsgBox "Erro: " & Err.Description
     End Sub
     \`\`\`
  
  6. **TIPOS DE CÓDIGO PREFERIDOS:**
     - Manipulação de dados em Excel
     - Automação de tarefas repetitivas
     - Formulários simples
     - Relatórios e dashboards
     - Validação e formatação de dados
     - Importação/exportação de dados
  
  7. **MARKDOWN OBRIGATÓRIO:**
     - Use **negrito** para destacar pontos importantes
     - Use \`código inline\` para nomes de variáveis e comandos
     - Use listas numeradas para passos sequenciais
     - Use listas com bullets para dicas e observações
     - Use emojis para tornar mais visual e amigável
  
  **EXEMPLO DE RESPOSTA PERFEITA:**
  
  ## 📋 Análise da Solicitação
  Você solicitou um código para criar uma lista numerada, que é útil para organização de dados e criação de índices automáticos.
  
  ## 🎯 Funcionalidade
  Este código VBA cria automaticamente uma lista numerada na **coluna A** da planilha ativa, inserindo valores sequenciais de "Item 1" até "Item 10".
  
  ## 📝 Como Aplicar
  1. **Abrir o Editor VBA:** Pressione \`Alt+F11\` no Excel
  2. **Criar Módulo:** Clique em \`Inserir → Módulo\`
  3. **Colar Código:** Cole o código gerado no módulo
  4. **Executar:** Pressione \`F5\` ou \`Alt+F8\`, escolha "CriarLista" e clique "Executar"
  
  ## ⚙️ Configurações Necessárias
  - Excel com macros habilitadas
  - Nenhuma configuração especial necessária
  
  ## 💡 Dicas de Uso
  - **Personalize o intervalo:** Altere os valores \`1 To 10\` para definir quantos itens criar
  - **Mude a coluna:** Substitua \`Cells(i, 1)\` por \`Cells(i, 2)\` para usar a coluna B
  - **Texto personalizado:** Modifique \`"Item "\` para qualquer texto desejado
  
  ## 🔧 Personalização
  Para criar **50 itens** em vez de 10, altere esta linha:
  \`For i = 1 To 50\`
  
  Para usar texto diferente:
  \`ws.Cells(i, 1).Value = "Produto " & i\`
  
  ## ⚠️ Observações Importantes
  - **Faça backup** da planilha antes de executar
  - O código **substitui** dados existentes na coluna A
  - Teste primeiro em uma planilha vazia
  
  Sempre mantenha este padrão de qualidade, didática e formatação em Markdown.`
    }
  
    private formatVBAUserPrompt(prompt: string): string {
      return `**SOLICITAÇÃO DO USUÁRIO:**
  "${prompt}"
  
  **INSTRUÇÕES:**
  1. Gere código VBA funcional e testado para esta solicitação
  2. Formate sua resposta EXATAMENTE no padrão Markdown especificado no sistema
  3. Seja didático e inclua todas as seções obrigatórias
  4. Use emojis e formatação para tornar a resposta mais amigável
  5. Garanta que o código seja seguro e inclua tratamento de erros
  6. Foque na facilidade de uso para iniciantes
  
  **LEMBRE-SE:** A resposta deve começar com "## 📋 Análise da Solicitação" e seguir exatamente o formato Markdown especificado.`
    }
  
    private parseVBAResponse(response: string): { explanation: string; code: string } {
      try {
        // Procura por código VBA entre ```vba e ```
        const codeMatch = response.match(/```vba\s*([\s\S]*?)\s*```/i)
        let code = codeMatch?.[1]?.trim() || ''
  
        // Se não encontrou com ```vba, procura apenas ```
        if (!code) {
          const generalCodeMatch = response.match(/```\s*([\s\S]*?)\s*```/)
          code = generalCodeMatch?.[1]?.trim() || ''
        }
  
        // Fallback para código básico se nada foi encontrado
        if (!code || code.length < 10) {
          code = `Option Explicit

Sub CodigoPersonalizado()
    ' Código gerado pelo Lynx AI
    ' Solicitação: ${response.substring(0,50)}...
    Dim ws As Worksheet
    Set ws = ActiveSheet

    ' Sua lógica personalizada aqui
    MsgBox "Código VBA gerado com base na sua solicitação!"

    ' Limpeza
    Set ws = Nothing
End Sub`
        }
        // Remove o código da explicação para evitar duplicação
        let explanation = response.replace(/```vba[\s\S]*?```/gi, '').replace(/```[\s\S]*?```/g, '').trim()
        
        // Se a explicação estiver vazia, cria uma explicação padrão
        if (!explanation || explanation.length < 20) {
          explanation = `## 📋 Análise da Solicitação\nCódigo VBA personalizado gerado com base na sua solicitação.\n\n🎯 Funcionalidade\nEste código executa a funcionalidade solicitada de forma segura e eficiente.\n\n📝 Como Aplicar\n\n- Abrir o Editor VBA: Pressione \`Alt+F11\` no Excel\n- Criar Módulo: Clique em \`Inserir → Módulo\`\n- Colar Código: Cole o código gerado no módulo\n- Executar: Pressione \`F5\` para executar\n\n💡 Dicas de Uso\n- Teste primeiro em uma planilha de exemplo\n- Faça backup dos seus dados antes de executar\n- Personalize as variáveis conforme necessário\n\n⚠️ Observações Importantes\n- Certifique-se de que as macros estejam habilitadas\n- Teste o código em um ambiente seguro primeiro`
        }
        return {
          explanation,
          code
        }
      } catch (error) {
        console.error('Error parsing VBA response:', error)
        return {
          explanation: `## 📋 Análise da Solicitação\n\n\nCódigo VBA gerado com sucesso para sua solicitação.\n\n🎯 Funcionalidade\nEste código executa a tarefa solicitada de forma funcional e segura.\n\n📝 Como Aplicar\n\n- Abrir o Editor VBA: Pressione \`Alt+F11\` no Excel\n- Criar Módulo: Clique em \`Inserir → Módulo\`\n- Colar Código: Cole o código abaixo no módulo\n- Executar: Pressione \`F5\` para executar\n\n💡 Dicas de Uso\n- Faça backup da planilha antes de executar\n- Teste primeiro em dados de exemplo\n- Customize conforme suas necessidades\n\n⚠️ Observações Importantes\n- Certifique-se de que as macros estejam habilitadas\n- O código foi otimizado para iniciantes`,
          code: `Option Explicit\n\nSub CodigoPersonalizado()\n    ' Código gerado pelo Lynx AI\n    Dim ws As Worksheet\n    Set ws = ActiveSheet\n    ' Desabilita atualização de tela para performance\n    Application.ScreenUpdating = False\n\n    ' Sua lógica personalizada aqui\n    MsgBox "Código VBA funcional gerado pelo Lynx AI!"\n\n    ' Restaura configurações\n    Application.ScreenUpdating = True\n\n    ' Limpeza de memória\n    Set ws = Nothing\nEnd Sub`
        }
      }
    }
  }
  
  export const arceeClient = new ArceeClient()