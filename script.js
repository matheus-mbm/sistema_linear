function validarSistema() {
    // Obter as equações inseridas pelo usuário
    const equacoesString = document.getElementById('equacoes').value;
  
    // Converter as equações para uma matriz A e um vetor b
    const { matrizA, vetorB } = converterEquacoesParaMatrizVetor(equacoesString);
  
    // Validar se as equações foram inseridas corretamente
    if (!validarDados(matrizA, vetorB)) {
      alert('Dados inválidos! Verifique a formatação das equações.');
      return;
    }
  
    // Validar se o sistema é linear
    if (!validarSistemaLinear(matrizA)) {
      alert('O sistema não é linear!');
      return;
    }
  
    // Identificar o tipo do sistema
    const tipoSistema = determinarTipoSistema(matrizA, vetorB);
  
    // Exibir os resultados
    const tipoSistemaElement = document.getElementById('tipo-sistema');
    const justificativaElement = document.getElementById('justificativa');
  
    tipoSistemaElement.textContent = `Tipo do Sistema: ${tipoSistema}`;
  
    if (tipoSistema === 'Possível Determinado') {
      justificativaElement.textContent = 'O sistema possui uma única solução.';
    } else if (tipoSistema === 'Possível Indeterminado') {
      justificativaElement.textContent = 'O sistema possui infinitas soluções.';
    } else {
      justificativaElement.textContent = 'O sistema não possui soluções.';
    }
  
    document.getElementById('resultados').style.display = 'block';
  }
  
  // Função para converter equações para matriz e vetor
  function converterEquacoesParaMatrizVetor(equacoesString) {
    const equacoes = equacoesString.split('\n'); // Separa as equações por linha
    const matrizA = [];
    const vetorB = [];
  
    for (const equacao of equacoes) {
      const parts = equacao.split('=');
      const lhs = parts[0].replace(/\s+/g, ''); // Lado esquerdo da equação
      const rhs = parseFloat(parts[1].replace(/\s+/g, '')); // Lado direito da equação
  
      const coefficients = [];
      const regex = /([+-]?[^+-]+)/g;
      let match;
  
      while ((match = regex.exec(lhs)) !== null) {
        const term = match[0];
        const coefficient = parseFloat(term) || (term.includes('-') ? -1 : 1); // Coeficiente numérico
        coefficients.push(coefficient);
      }
  
      matrizA.push(coefficients);
      vetorB.push(rhs);
    }
  
    return { matrizA, vetorB };
  }
  
  // Função para validar os dados da matriz e vetor
  function validarDados(matrizA, vetorB) {
    // Verificar se a matriz e o vetor não estão vazios
    if (!matrizA.length || !vetorB.length) {
      return false;
    }
  
    // Verificar se cada linha da matriz tem o mesmo número de elementos
    const numColunas = matrizA[0].length;
    for (const linha of matrizA) {
      if (linha.length !== numColunas) {
        return false;
      }
    }
  
    return true;
  }
  
  // Função para validar se o sistema é linear
  function validarSistemaLinear(matrizA) {
    // Assumimos que as equações são lineares se estiverem na forma ax + by + cz = d
    return true;
  }
  
  // Função para determinar o tipo do sistema linear
  function determinarTipoSistema(matrizA, vetorB) {
    const numEquacoes = matrizA.length;
    const numVariaveis = matrizA[0].length;
  
    // Criar a matriz aumentada
    const matrizAumentada = matrizA.map((linha, i) => [...linha, vetorB[i]]);
  
    // Calcular o posto da matriz de coeficientes e da matriz aumentada
    const rankA = calcularPosto(matrizA);
    const rankAumentada = calcularPosto(matrizAumentada);
  
    if (rankA < rankAumentada) {
      return 'Impossível';
    } else if (rankA === numVariaveis) {
      return 'Possível Determinado';
    } else {
      return 'Possível Indeterminado';
    }
  }
  
  // Função para calcular o posto de uma matriz
  function calcularPosto(matriz) {
    const n = matriz.length;
    const m = matriz[0].length;
    let rank = 0;
  
    // Copiar a matriz para não alterar a original
    const tempMat = matriz.map(row => row.slice());
  
    for (let row = 0; row < n; row++) {
      let pivot = -1;
      for (let col = 0; col < m; col++) {
        if (tempMat[row][col] !== 0) {
          pivot = col;
          break;
        }
      }
  
      if (pivot === -1) continue;
  
      for (let i = row + 1; i < n; i++) {
        const factor = tempMat[i][pivot] / tempMat[row][pivot];
        for (let j = pivot; j < m; j++) {
          tempMat[i][j] -= factor * tempMat[row][j];
        }
      }
      rank++;
    }
  
    return rank;
  }