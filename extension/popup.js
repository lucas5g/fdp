document.addEventListener('DOMContentLoaded', function() {
  carregarDados();
  
  document.getElementById('btnAtualizar').addEventListener('click', function() {
    // Envia mensagem para o content script recalcular
    try {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (chrome.runtime.lastError) {
          console.error('Erro ao buscar tabs:', chrome.runtime.lastError);
          return;
        }
        
        if (tabs && tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {action: 'calcular'}, function(response) {
            if (chrome.runtime.lastError) {
              console.error('Erro ao enviar mensagem:', chrome.runtime.lastError);
            }
            setTimeout(carregarDados, 500);
          });
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    }
  });
});

function carregarDados() {
  try {
    chrome.storage.local.get(['ultimoCalculo'], function(result) {
      const conteudo = document.getElementById('conteudo');
      
      if (chrome.runtime.lastError) {
        console.error('Erro ao carregar dados:', chrome.runtime.lastError);
        mostrarSemDados(conteudo);
        return;
      }
      
      if (result.ultimoCalculo) {
        const dados = result.ultimoCalculo;
        mostrarResultado(conteudo, dados);
      } else {
        mostrarSemDados(conteudo);
      }
    });
  } catch (error) {
    console.error('Erro na função carregarDados:', error);
    const conteudo = document.getElementById('conteudo');
    mostrarSemDados(conteudo);
  }
}

function mostrarResultado(container, dados) {
  const resultado = dados.resultado;
  
  let html = '';
  
  if (resultado.periodos && resultado.periodos.length > 0) {
    html += '<div class="marcacoes">';
    html += '<h3>Marcações</h3>';
    
    resultado.periodos.forEach((periodo, index) => {
      html += `
        <div class="periodo">
          <div class="periodo-numero">Período ${index + 1}</div>
          <div class="periodo-horarios">
            <span class="horario entrada">${periodo.entrada}</span>
            <span class="seta">→</span>
            <span class="horario saida">${periodo.saida}</span>
          </div>
          <div class="periodo-duracao">${formatarDuracao(periodo.duracao)}</div>
        </div>
      `;
    });
    
    // Adiciona período em andamento se existir
    if (resultado.periodoEmAndamento) {
      const p = resultado.periodoEmAndamento;
      html += `
        <div class="periodo" style="border: 2px dashed #667eea;">
          <div class="periodo-numero">Período ${resultado.periodos.length + 1} (em andamento) ⏱️</div>
          <div class="periodo-horarios">
            <span class="horario entrada">${p.entrada}</span>
            <span class="seta">→</span>
            <span class="horario saida">${p.saida}</span>
          </div>
          <div class="periodo-duracao">${formatarDuracao(p.duracao)}</div>
        </div>
      `;
    }
    
    html += '</div>';
    
    html += `
      <div class="total">
        <div class="total-label">Total Trabalhado</div>
        <div class="total-valor">${resultado.horas}h ${resultado.minutos.toString().padStart(2, '0')}min</div>
      </div>
    `;
    
    const timestamp = new Date(dados.timestamp);
    html += `
      <div class="info">
        Última atualização: ${timestamp.toLocaleTimeString('pt-BR')}
      </div>
    `;
  } else {
    html = `
      <div class="vazio">
        <div class="vazio-icone">🔍</div>
        <div class="vazio-texto">Nenhuma marcação encontrada</div>
        <div class="vazio-subtexto">Acesse a página de ponto e clique em Atualizar</div>
      </div>
    `;
  }
  
  container.innerHTML = html;
}

function mostrarSemDados(container) {
  container.innerHTML = `
    <div class="vazio">
      <div class="vazio-icone">📊</div>
      <div class="vazio-texto">Nenhum dado disponível</div>
      <div class="vazio-subtexto">Acesse a página de ponto do seu trabalho</div>
    </div>
  `;
}

function formatarDuracao(minutos) {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${h}h ${m}min`;
}
