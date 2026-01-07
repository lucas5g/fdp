// Script que roda na página do sistema de ponto
// Identifica as marcações e calcula as horas trabalhadas

// Função para mostrar debug na tela
function mostrarDebug(mensagem) {
  let debugDiv = document.getElementById('debug-extensao');
  
  if (!debugDiv) {
    debugDiv = document.createElement('div');
    debugDiv.id = 'debug-extensao';
    debugDiv.style.cssText = `
      position: fixed;
      bottom: 10px;
      left: 10px;
      background: rgba(0, 0, 0, 0.9);
      color: #00ff00;
      padding: 10px;
      border-radius: 5px;
      font-family: monospace;
      font-size: 12px;
      z-index: 99999;
      max-width: 400px;
      max-height: 300px;
      overflow-y: auto;
    `;
    document.body.appendChild(debugDiv);
  }
  
  const timestamp = new Date().toLocaleTimeString();
  debugDiv.innerHTML += `<div>[${timestamp}] ${mensagem}</div>`;
  debugDiv.scrollTop = debugDiv.scrollHeight;
}

function calcularHorasTrabalhadas() {
  // Busca o iframe específico do sistema
  const iframe = document.getElementById('iFrameArteWeb');
  
  if (!iframe) {
    mostrarDebug('❌ Iframe iFrameArteWeb não encontrado');
    console.log('Iframe iFrameArteWeb não encontrado');
    return [];
  }
  
  mostrarDebug('✅ Iframe encontrado');
  console.log('Iframe encontrado:', iframe);
  
  // Acessa o documento dentro do iframe
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  
  if (!iframeDoc) {
    mostrarDebug('❌ Não foi possível acessar o conteúdo do iframe');
    console.log('Não foi possível acessar o conteúdo do iframe');
    return [];
  }
  
  mostrarDebug('✅ Documento do iframe acessado');
  console.log('Documento do iframe acessado');
  
  // Busca a tabela e os elementos td dentro do tbody
  const table = iframeDoc.querySelector('table');
  
  if (!table) {
    mostrarDebug('❌ Tabela não encontrada no iframe');
    console.log('Tabela não encontrada no iframe');
    console.log('Conteúdo do iframe:', iframeDoc.body.innerHTML.substring(0, 500));
    return [];
  }
  
  mostrarDebug('✅ Tabela encontrada');
  console.log('Tabela encontrada:', table);
  
  const cells = table.querySelectorAll('tbody > tr > td');
  
  if (!cells || cells.length === 0) {
    mostrarDebug('⚠️ Células tbody > tr > td não encontradas');
    mostrarDebug('Tentando buscar todos os td...');
    console.log('Células da tabela não encontradas');
    console.log('Tentando buscar todos os td...');
    const allCells = table.querySelectorAll('td');
    mostrarDebug(`Total de td encontrados: ${allCells.length}`);
    console.log('Total de td encontrados:', allCells.length);
    if (allCells.length > 0) {
      mostrarDebug(`Primeiro td: ${allCells[0].textContent}`);
      console.log('Primeiro td:', allCells[0].textContent);
    }
    return [];
  }
  
  mostrarDebug(`✅ ${cells.length} células encontradas`);
  console.log('Total de células encontradas:', cells.length);
  
  // Regex para encontrar horários no formato HH:MM
  const regexHorario = /\b(\d{1,2}):(\d{2})\b/g;
  const horarios = [];
  
  // Extrai texto de todas as células
  cells.forEach(cell => {
    const texto = cell.textContent.trim();
    mostrarDebug(`Célula: "${texto}"`);
    console.log('Texto da célula:', texto);
    let match;
    
    // Busca horários em cada célula
    while ((match = regexHorario.exec(texto)) !== null) {
      const hora = parseInt(match[1]);
      const minuto = parseInt(match[2]);
      
      // Valida se é um horário válido
      if (hora >= 0 && hora < 24 && minuto >= 0 && minuto < 60) {
        horarios.push({ hora, minuto, texto: match[0] });
        mostrarDebug(`🕐 Horário encontrado: ${match[0]}`);
      }
    }
    
    // Reseta o regex para próxima célula
    regexHorario.lastIndex = 0;
  });
  
  mostrarDebug(`✅ Total: ${horarios.length} horários encontrados`);
  console.log('Horários encontrados:', horarios);
  return horarios;
}

function converterParaMinutos(horario) {
  return horario.hora * 60 + horario.minuto;
}

function calcularTotalHoras(horarios) {
  if (horarios.length < 2) {
    return { totalMinutos: 0, mensagem: "Menos de 2 marcações encontradas" };
  }
  
  // Assume que os horários vêm em pares: entrada e saída
  let totalMinutos = 0;
  let periodos = [];
  
  for (let i = 0; i < horarios.length - 1; i += 2) {
    const entrada = converterParaMinutos(horarios[i]);
    const saida = converterParaMinutos(horarios[i + 1]);
    
    if (saida > entrada) {
      const minutosTrabalhados = saida - entrada;
      totalMinutos += minutosTrabalhados;
      periodos.push({
        entrada: horarios[i].texto,
        saida: horarios[i + 1].texto,
        duracao: minutosTrabalhados
      });
    }
  }
  
  // Se tiver número ímpar de marcações, adiciona período em andamento
  let periodoEmAndamento = null;
  if (horarios.length % 2 !== 0) {
    const ultimaEntrada = horarios[horarios.length - 1];
    const agora = new Date();
    const minutosEntrada = converterParaMinutos(ultimaEntrada);
    const minutosAgora = agora.getHours() * 60 + agora.getMinutes();
    
    if (minutosAgora > minutosEntrada) {
      const minutosTrabalhados = minutosAgora - minutosEntrada;
      periodoEmAndamento = {
        entrada: ultimaEntrada.texto,
        saida: `${agora.getHours()}:${agora.getMinutes().toString().padStart(2, '0')}`,
        duracao: minutosTrabalhados,
        emAndamento: true
      };
      totalMinutos += minutosTrabalhados;
    }
  }
  
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;
  
  return {
    totalMinutos,
    horas,
    minutos,
    periodos,
    periodoEmAndamento,
    mensagem: `${horas}h ${minutos}min trabalhadas`
  };
}

function formatarDuracao(minutos) {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${h}h ${m}min`;
}

function adicionarResumo() {
  console.log('=== Iniciando cálculo de horas ===');
  
  // Remove resumo anterior se existir
  const resumoExistente = document.getElementById('resumo-horas-trabalhadas');
  if (resumoExistente) {
    resumoExistente.remove();
  }
  
  const horarios = calcularHorasTrabalhadas();
  console.log('Horários extraídos:', horarios);
  
  const resultado = calcularTotalHoras(horarios);
  console.log('Resultado do cálculo:', resultado);
  
  // Cria elemento para mostrar o resumo
  const resumoDiv = document.createElement('div');
  resumoDiv.id = 'resumo-horas-trabalhadas';
  resumoDiv.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    min-width: 300px;
    max-width: 400px;
  `;
  
  let html = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
      <h3 style="margin: 0; font-size: 18px; font-weight: 600;">⏱️ Horas Trabalhadas</h3>
      <button id="fechar-resumo" style="background: rgba(255,255,255,0.2); border: none; color: white; cursor: pointer; border-radius: 50%; width: 24px; height: 24px; font-size: 16px;">✕</button>
    </div>
  `;
  
  if (resultado.periodos && resultado.periodos.length > 0) {
    html += '<div style="margin-bottom: 15px;">';
    resultado.periodos.forEach((periodo, index) => {
      html += `
        <div style="background: rgba(255,255,255,0.15); padding: 10px; border-radius: 6px; margin-bottom: 8px;">
          <div style="font-size: 14px; opacity: 0.9;">Período ${index + 1}</div>
          <div style="font-size: 16px; font-weight: 500; margin-top: 4px;">
            ${periodo.entrada} → ${periodo.saida}
            <span style="opacity: 0.8; font-size: 14px; margin-left: 8px;">(${formatarDuracao(periodo.duracao)})</span>
          </div>
        </div>
      `;
    });
    
    // Adiciona período em andamento se existir
    if (resultado.periodoEmAndamento) {
      const p = resultado.periodoEmAndamento;
      html += `
        <div style="background: rgba(255,255,255,0.25); padding: 10px; border-radius: 6px; margin-bottom: 8px; border: 2px dashed rgba(255,255,255,0.5);">
          <div style="font-size: 14px; opacity: 0.9;">Período ${resultado.periodos.length + 1} (em andamento)</div>
          <div style="font-size: 16px; font-weight: 500; margin-top: 4px;">
            ${p.entrada} → ${p.saida} ⏱️
            <span style="opacity: 0.8; font-size: 14px; margin-left: 8px;">(${formatarDuracao(p.duracao)})</span>
          </div>
        </div>
      `;
    }
    
    html += '</div>';
    
    html += `
      <div style="background: rgba(255,255,255,0.25); padding: 15px; border-radius: 8px; text-align: center;">
        <div style="font-size: 14px; opacity: 0.9; margin-bottom: 5px;">Total</div>
        <div style="font-size: 28px; font-weight: 700;">${resultado.horas}h ${resultado.minutos.toString().padStart(2, '0')}min</div>
      </div>
    `;
  } else {
    html += `
      <div style="text-align: center; padding: 20px; opacity: 0.9;">
        <div style="font-size: 40px; margin-bottom: 10px;">🔍</div>
        <div>Nenhuma marcação encontrada</div>
        <div style="font-size: 12px; margin-top: 8px; opacity: 0.8;">Verifique se está na página correta</div>
      </div>
    `;
  }
  
  resumoDiv.innerHTML = html;
  document.body.appendChild(resumoDiv);
  
  // Adiciona evento para fechar
  const botaoFechar = document.getElementById('fechar-resumo');
  if (botaoFechar) {
    botaoFechar.addEventListener('click', () => {
      resumoDiv.remove();
    });
  }
  
  // Armazena dados para o popup
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({
        ultimoCalculo: {
          horarios: horarios.map(h => h.texto),
          resultado: resultado,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      console.log('chrome.storage não disponível');
    }
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
  }
}

// Função para esperar o iframe e tentar calcular
function tentarCalcular() {
  mostrarDebug('🔄 Tentando calcular...');
  console.log('Tentando calcular...');
  const iframe = document.getElementById('iFrameArteWeb');
  
  if (!iframe) {
    mostrarDebug('⏳ Iframe ainda não encontrado, aguardando...');
    console.log('Iframe ainda não encontrado, aguardando...');
    return;
  }
  
  mostrarDebug('🎯 Iframe encontrado! Iniciando cálculo...');
  console.log('Iframe encontrado!');
  adicionarResumo();
}

// Executa imediatamente
setTimeout(tentarCalcular, 2000);

// Também adiciona listener para mudanças no DOM
const observer = new MutationObserver(() => {
  const iframe = document.getElementById('iFrameArteWeb');
  if (iframe) {
    console.log('Iframe detectado via MutationObserver');
    // Aguarda um pouco para garantir que o conteúdo do iframe carregou
    setTimeout(tentarCalcular, 1000);
    observer.disconnect(); // Para de observar após encontrar o iframe
  }
});

// Observa mudanças no body
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Permite que o popup solicite atualização
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'calcular') {
    tentarCalcular();
    sendResponse({ success: true });
  }
});
