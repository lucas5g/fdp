# Calculadora de Horas Trabalhadas - Extensão do Navegador

Extensão do Chrome/Edge que calcula automaticamente as horas trabalhadas a partir das marcações de ponto exibidas no site do seu trabalho.

## 📋 Funcionalidades

- 🕐 Detecta automaticamente os horários de entrada e saída
- ⏱️ Calcula o total de horas trabalhadas
- 📊 Exibe períodos de trabalho individualmente
- 🎨 Interface moderna e intuitiva
- 🔄 Atualização em tempo real

## 📦 Instalação

### Chrome/Edge (Modo Desenvolvedor)

1. Abra o Chrome/Edge e acesse `chrome://extensions/` (ou `edge://extensions/`)
2. Ative o **Modo do desenvolvedor** no canto superior direito
3. Clique em **Carregar sem compactação**
4. Selecione a pasta `extension` deste projeto
5. A extensão será instalada e aparecerá na barra de ferramentas

## 🚀 Como Usar

1. Acesse a página de ponto do seu trabalho que mostra as marcações
2. A extensão automaticamente:
   - Detectará os horários no formato HH:MM
   - Calculará as horas trabalhadas em pares (entrada → saída)
   - Mostrará um resumo flutuante no canto superior direito da página
3. Clique no ícone da extensão para ver detalhes no popup
4. Use o botão "🔄 Atualizar" para recalcular

## 📝 Exemplo

Se a página mostrar:
```
Marcações Registradas
09:22   13:20   14:22   18:30
```

A extensão calculará:
- **Período 1:** 09:22 → 13:20 (3h 58min)
- **Período 2:** 14:22 → 18:30 (4h 08min)
- **Total:** 8h 06min

## ⚙️ Personalização

Se os horários não forem detectados corretamente, você pode precisar ajustar o código em `content.js`:

1. Abra `content.js`
2. Localize a função `calcularHorasTrabalhadas()`
3. Ajuste os seletores CSS ou regex conforme necessário para o seu site

### Exemplo de Ajuste por Seletor CSS

```javascript
function calcularHorasTrabalhadas() {
  // Busca em elemento específico
  const tabelaMarcacoes = document.querySelector('.tabela-ponto'); // ajuste aqui
  if (!tabelaMarcacoes) return [];
  
  const marcacoesTexto = tabelaMarcacoes.innerText;
  // ... resto do código
}
```

## 🎨 Ícones

A extensão precisa de ícones nos seguintes tamanhos:
- `images/icon16.png` (16x16)
- `images/icon48.png` (48x48)
- `images/icon128.png` (128x128)

Você pode criar ícones simples com qualquer editor de imagens ou usar ferramentas online como:
- [Favicon.io](https://favicon.io/)
- [Canva](https://www.canva.com/)

## 🛠️ Estrutura do Projeto

```
extension/
├── manifest.json       # Configuração da extensão
├── content.js         # Script que roda nas páginas
├── popup.html         # Interface do popup
├── popup.js          # Lógica do popup
├── popup.css         # Estilos do popup
├── images/           # Ícones da extensão
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md         # Este arquivo
```

## 🔧 Desenvolvimento

### Tecnologias Utilizadas
- JavaScript Vanilla
- Chrome Extension Manifest V3
- Chrome Storage API
- CSS3 com gradientes

### Fazer Alterações

1. Edite os arquivos na pasta `extension/`
2. Volte em `chrome://extensions/`
3. Clique no botão de recarregar (🔄) na extensão
4. Recarregue a página do site de ponto

## 📄 Permissões

A extensão solicita as seguintes permissões:
- **activeTab**: Para acessar a aba atual
- **scripting**: Para injetar o script de cálculo
- **storage**: Para salvar os últimos cálculos

## ⚠️ Observações

- A extensão funciona detectando padrões de horário (HH:MM)
- Assume que os horários aparecem em pares (entrada, saída)
- Se houver número ímpar de marcações, a última será ignorada
- Os horários devem estar no formato 24h

## 🐛 Solução de Problemas

**Problema:** Nenhuma marcação detectada
- Verifique se está na página correta
- Inspecione o HTML da página (F12) e ajuste os seletores em `content.js`

**Problema:** Cálculo incorreto
- Verifique se os horários estão no formato HH:MM
- Confirme que aparecem na ordem correta (entrada antes da saída)

**Problema:** Resumo não aparece na página
- Verifique se há algum bloqueador de scripts
- Abra o Console (F12) e procure por erros

## 📞 Suporte

Em caso de dúvidas ou problemas, você pode:
- Verificar o console do navegador (F12 → Console)
- Editar o código para se adequar ao seu site específico
- Abrir uma issue no repositório

---

Desenvolvido para facilitar o controle de horas trabalhadas! ⏰
