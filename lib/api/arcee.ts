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
            max_tokens: 2000,
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
  
  1. SIMPLICIDADE E FUNCIONALIDADE:
     - Gere código VBA funcional e testado
     - Evite complexidade desnecessária
     - Use variáveis com nomes descritivos
     - Inclua comentários explicativos em português
  
  2. SEGURANÇA E BOAS PRÁTICAS:
     - Sempre use "Option Explicit" quando relevante
     - Inclua tratamento básico de erros
     - Valide entradas quando necessário
     - Use "Set objeto = Nothing" para limpeza de memória
  
  3. DIDÁTICA PARA USUÁRIOS LEIGOS:
     - Explique PASSO A PASSO como aplicar o código
     - Inclua instruções de onde colar o código (módulo, planilha, etc.)
     - Mencione requisitos ou dependências
     - Adicione dicas de troubleshooting básico
  
  4. ESTRUTURA DA RESPOSTA:
     Sua resposta DEVE seguir exatamente este formato:
  
     EXPLICAÇÃO:
     [Explicação clara do que o código faz e como aplicar]
  
     CÓDIGO:
     \`\`\`vba
     [Código VBA aqui]
     \`\`\`
  
  5. TIPOS DE CÓDIGO PREFERIDOS:
     - Manipulação de dados em Excel
     - Automação de tarefas repetitivas
     - Formulários simples
     - Relatórios básicos
     - Validação de dados
  
  6. EVITAR:
     - Código que acesse sistemas externos sem explicar
     - Manipulação de arquivos de sistema
     - Código que possa causar perda de dados
     - Loops infinitos ou código mal otimizado
  
  EXEMPLO DE RESPOSTA IDEAL:
  
  EXPLICAÇÃO:
  Este código cria uma lista numerada na coluna A, útil para organizar dados. Para usar:
  1. Abra o Excel e pressione Alt+F11
  2. Clique em Inserir > Módulo
  3. Cole o código abaixo
  4. Feche o editor (Alt+Q)
  5. Execute com Alt+F8, escolha "CriarLista" e clique Executar
  
  CÓDIGO:
  \`\`\`vba
  Sub CriarLista()
      ' Declara variáveis
      Dim i As Integer
      Dim ws As Worksheet
      
      ' Define a planilha ativa
      Set ws = ActiveSheet
      
      ' Cria lista de 1 a 10
      For i = 1 To 10
          ws.Cells(i, 1).Value = "Item " & i
      Next i
      
      ' Limpa memória
      Set ws = Nothing
      
      MsgBox "Lista criada com sucesso!"
  End Sub
  \`\`\`
  
  Sempre mantenha este padrão de qualidade e didática.`
    }
  
    private formatVBAUserPrompt(prompt: string): string {
      return `O usuário solicitou: "${prompt}"
  
  Por favor, gere código VBA seguindo as diretrizes do sistema. Lembre-se de:
  - Fazer código funcional e didático
  - Explicar como aplicar passo a passo
  - Incluir comentários no código
  - Manter simplicidade sem perder funcionalidade
  
  Responda EXATAMENTE no formato especificado (EXPLICAÇÃO: seguido de CÓDIGO: com \`\`\`vba).`
    }
  
    private parseVBAResponse(response: string): { explanation: string; code: string } {
      try {
        // Procura por EXPLICAÇÃO:
        const explanationMatch = response.match(/EXPLICAÇÃO:\s*([\s\S]*?)(?=CÓDIGO:|$)/i)
        const explanation = explanationMatch?.[1]?.trim() || 'Código VBA gerado com sucesso.'
  
        // Procura por código VBA entre ```vba e ```
        const codeMatch = response.match(/```vba\s*([\s\S]*?)\s*```/i)
        let code = codeMatch?.[1]?.trim() || ''
  
        // Se não encontrou com ```vba, procura apenas ```
        if (!code) {
          const generalCodeMatch = response.match(/```\s*([\s\S]*?)\s*```/)
          code = generalCodeMatch?.[1]?.trim() || ''
        }
  
        // Se ainda não encontrou código, usa uma parte da resposta
        if (!code) {
          // Procura por CÓDIGO:
          const codeOnlyMatch = response.match(/CÓDIGO:\s*([\s\S]*)/i)
          code = codeOnlyMatch?.[1]?.trim() || response.trim()
        }
  
        // Fallback para código básico se nada foi encontrado
        if (!code || code.length < 10) {
          code = `Sub CodigoGerado()
      ' Código gerado pelo Lynx AI
      ' Baseado na solicitação: ${response.substring(0, 50)}...
      
      MsgBox "Olá! Este é um código VBA básico."
      
  End Sub`
        }
  
        return {
          explanation: explanation || 'Código VBA gerado. Siga as instruções para aplicar.',
          code: code
        }
      } catch (error) {
        console.error('Error parsing VBA response:', error)
        return {
          explanation: 'Código VBA gerado com sucesso. Pressione Alt+F11 no Excel para abrir o editor VBA e cole o código em um novo módulo.',
          code: `Sub CodigoPersonalizado()
      ' Código gerado pelo Lynx AI
      
      MsgBox "Código VBA funcional gerado!"
      
  End Sub`
        }
      }
    }
  }
  
  export const arceeClient = new ArceeClient()