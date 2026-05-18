
function criarSistemaEscolar() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Remove todas as abas existentes exceto a primeira
  var sheets = ss.getSheets();
  
  // Criar ou obter abas
  var nomesAbas = ['LOGIN', 'DASHBOARD', 'TURMAS', 'ALUNOS', 'OCORRENCIAS', 'USUARIOS'];
  
  // Primeiro, criar todas as abas necessárias
  nomesAbas.forEach(function(nome) {
    if (!ss.getSheetByName(nome)) {
      ss.insertSheet(nome);
    }
  });
  
  // Remover abas não listadas (exceto as nossas)
  ss.getSheets().forEach(function(sheet) {
    if (nomesAbas.indexOf(sheet.getName()) === -1) {
      if (ss.getSheets().length > 1) {
        ss.deleteSheet(sheet);
      }
    }
  });
  
  configurarLogin(ss);
  configurarDashboard(ss);
  configurarTurmas(ss);
  configurarAlunos(ss);
  configurarOcorrencias(ss);
  configurarUsuarios(ss);
  
  // Nomear planilha
  ss.rename('Sistema Disciplinar Escolar');
  
  SpreadsheetApp.getUi().alert('✅ Sistema criado com sucesso! Vá para a aba LOGIN para começar.');
}

function configurarLogin(ss) {
  var sheet = ss.getSheetByName('LOGIN');
  sheet.clear();
  sheet.clearFormats();
  
  // Definir largura das colunas
  sheet.setColumnWidth(1, 80);
  sheet.setColumnWidth(2, 80);
  sheet.setColumnWidth(3, 200);
  sheet.setColumnWidth(4, 200);
  sheet.setColumnWidth(5, 200);
  sheet.setColumnWidth(6, 200);
  sheet.setColumnWidth(7, 80);
  
  // Definir altura das linhas
  for (var i = 1; i <= 30; i++) {
    sheet.setRowHeight(i, 35);
  }
  sheet.setRowHeight(3, 60);
  sheet.setRowHeight(10, 50);
  sheet.setRowHeight(11, 50);
  sheet.setRowHeight(12, 50);
  
  // Fundo geral da página - azul escuro
  sheet.getRange('A1:G30').setBackground('#1a237e');
  
  // Painel central (branco)
  sheet.getRange('B5:F22').setBackground('#ffffff');
  
  // Cabeçalho
  sheet.getRange('B3:F4').setBackground('#283593');
  sheet.getRange('B3:F3').merge();
  sheet.getRange('B3').setValue('🏫 SISTEMA DE GESTÃO DISCIPLINAR ESCOLAR');
  sheet.getRange('B3').setFontSize(16)
       .setFontWeight('bold')
       .setFontColor('#ffffff')
       .setHorizontalAlignment('center')
       .setVerticalAlignment('middle');
  
  sheet.getRange('B4:F4').merge();
  sheet.getRange('B4').setValue('Controle de Turmas, Alunos e Ocorrências');
  sheet.getRange('B4').setFontSize(11)
       .setFontColor('#90caf9')
       .setHorizontalAlignment('center')
       .setVerticalAlignment('middle');
  
  // Título do formulário
  sheet.getRange('B6:F6').merge();
  sheet.getRange('B6').setValue('ACESSO AO SISTEMA');
  sheet.getRange('B6').setFontSize(14)
       .setFontWeight('bold')
       .setFontColor('#1a237e')
       .setHorizontalAlignment('center');
  
  // Linha separadora
  sheet.getRange('C7:E7').merge();
  sheet.getRange('C7').setBackground('#3f51b5');
  sheet.getRange('C7').setValue('');
  
  // Label Usuário
  sheet.getRange('C9:E9').merge();
  sheet.getRange('C9').setValue('👤  Usuário:');
  sheet.getRange('C9').setFontSize(11).setFontWeight('bold').setFontColor('#333333');
  
  // Campo Usuário
  sheet.getRange('C10:E10').merge();
  sheet.getRange('C10').setValue('');
  sheet.getRange('C10').setBackground('#e8eaf6').setBorder(true, true, true, true, false, false, '#3f51b5', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  sheet.getRange('C10').setFontSize(12).setHorizontalAlignment('left').setFontColor('#000000');
  sheet.setRowHeight(10, 40);
  
  // Label Senha
  sheet.getRange('C12:E12').merge();
  sheet.getRange('C12').setValue('🔒  Senha:');
  sheet.getRange('C12').setFontSize(11).setFontWeight('bold').setFontColor('#333333');
  
  // Campo Senha
  sheet.getRange('C13:E13').merge();
  sheet.getRange('C13').setValue('');
  sheet.getRange('C13').setBackground('#e8eaf6').setBorder(true, true, true, true, false, false, '#3f51b5', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  sheet.getRange('C13').setFontSize(12).setHorizontalAlignment('left').setFontColor('#000000');
  sheet.setRowHeight(13, 40);
  
  // Botão de Login (simulado com cor)
  sheet.getRange('C15:E15').merge();
  sheet.getRange('C15').setValue('▶  ENTRAR NO SISTEMA');
  sheet.getRange('C15').setBackground('#3f51b5')
       .setFontColor('#ffffff')
       .setFontSize(13)
       .setFontWeight('bold')
       .setHorizontalAlignment('center')
       .setVerticalAlignment('middle');
  sheet.setRowHeight(15, 45);
  
  // Resultado do login
  sheet.getRange('C17:E17').merge();
  sheet.getRange('C17').setValue('');
  sheet.getRange('C17').setFontSize(11).setHorizontalAlignment('center');
  
  // Info padrão
  sheet.getRange('B19:F19').merge();
  sheet.getRange('B19').setValue('💡 Credenciais padrão: usuário = admin | senha = escola123');
  sheet.getRange('B19').setFontSize(9).setFontColor('#757575').setHorizontalAlignment('center');
  
  sheet.getRange('B20:F20').merge();
  sheet.getRange('B20').setValue('Para verificar login, use: Ferramentas > Macros > Verificar Login');
  sheet.getRange('B20').setFontSize(9).setFontColor('#9e9e9e').setHorizontalAlignment('center');
  
  // Rodapé
  sheet.getRange('B22:F22').setBackground('#283593');
  sheet.getRange('B22:F22').merge();
  sheet.getRange('B22').setValue('Sistema Disciplinar Escolar v1.0 © 2025');
  sheet.getRange('B22').setFontColor('#90caf9').setFontSize(9).setHorizontalAlignment('center').setVerticalAlignment('middle');
  
  // Ocultar grade
  sheet.setHiddenGridlines(true);
  
  // Congelar para melhor visual
  sheet.setFrozenRows(0);
  sheet.setFrozenColumns(0);
}

function configurarUsuarios(ss) {
  var sheet = ss.getSheetByName('USUARIOS');
  sheet.clear();
  sheet.clearFormats();
  sheet.getRange('A1:G1').setBackground('#1a237e');
  sheet.getRange('A1:G1').merge();
  sheet.getRange('A1').setValue('USUÁRIOS DO SISTEMA').setFontColor('#ffffff').setFontWeight('bold').setFontSize(13).setHorizontalAlignment('center');
  
  var headers = ['ID', 'NOME', 'USUÁRIO', 'SENHA', 'PERFIL', 'STATUS', 'DATA CRIAÇÃO'];
  sheet.getRange(2, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(2, 1, 1, headers.length).setBackground('#3f51b5').setFontColor('#ffffff').setFontWeight('bold').setHorizontalAlignment('center');
  
  // Usuário admin padrão
  var dados = [
    [1, 'Administrador', 'admin', 'escola123', 'ADMIN', 'ATIVO', new Date()],
    [2, 'Prof. Maria Silva', 'maria', 'prof123', 'PROFESSOR', 'ATIVO', new Date()],
    [3, 'Coord. João Santos', 'joao', 'coord123', 'COORDENADOR', 'ATIVO', new Date()]
  ];
  sheet.getRange(3, 1, dados.length, headers.length).setValues(dados);
  
  // Formatar
  sheet.getRange('A2:G2').setFontWeight('bold');
  sheet.setColumnWidth(1, 50);
  sheet.setColumnWidth(2, 180);
  sheet.setColumnWidth(3, 120);
  sheet.setColumnWidth(4, 120);
  sheet.setColumnWidth(5, 120);
  sheet.setColumnWidth(6, 100);
  sheet.setColumnWidth(7, 140);
  
  // Alternância de cores
  sheet.getRange('A3:G3').setBackground('#e8eaf6');
  sheet.getRange('A4:G4').setBackground('#ffffff');
  sheet.getRange('A5:G5').setBackground('#e8eaf6');
  
  sheet.setHiddenGridlines(false);
  sheet.getRange('A1:G10').setBorder(true, true, true, true, true, true);
}

function configurarTurmas(ss) {
  var sheet = ss.getSheetByName('TURMAS');
  sheet.clear();
  sheet.clearFormats();
  sheet.getRange('A1:H1').setBackground('#1a237e');
  sheet.getRange('A1:H1').merge();
  sheet.getRange('A1').setValue('🏫 CADASTRO DE TURMAS').setFontColor('#ffffff').setFontWeight('bold').setFontSize(13).setHorizontalAlignment('center');
  
  var headers = ['ID', 'TURMA', 'ANO/SÉRIE', 'TURNO', 'PROFESSOR RESP.', 'SALA', 'QTD ALUNOS', 'STATUS'];
  sheet.getRange(2, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(2, 1, 1, headers.length).setBackground('#3f51b5').setFontColor('#ffffff').setFontWeight('bold').setHorizontalAlignment('center');
  
  var turmas = [
    [1, '6A', '6º Ano', 'Manhã', 'Prof. Maria Silva', 'Sala 01', 30, 'ATIVA'],
    [2, '6B', '6º Ano', 'Tarde', 'Prof. Carlos Lima', 'Sala 02', 28, 'ATIVA'],
    [3, '7A', '7º Ano', 'Manhã', 'Prof. Ana Souza', 'Sala 03', 32, 'ATIVA'],
    [4, '7B', '7º Ano', 'Tarde', 'Prof. Pedro Alves', 'Sala 04', 29, 'ATIVA'],
    [5, '8A', '8º Ano', 'Manhã', 'Prof. Julia Costa', 'Sala 05', 31, 'ATIVA'],
    [6, '9A', '9º Ano', 'Manhã', 'Prof. Ricardo Nunes', 'Sala 06', 27, 'ATIVA']
  ];
  sheet.getRange(3, 1, turmas.length, headers.length).setValues(turmas);
  
  // Alternância de cores
  for (var i = 0; i < turmas.length; i++) {
    if (i % 2 === 0) {
      sheet.getRange(3 + i, 1, 1, headers.length).setBackground('#e8eaf6');
    } else {
      sheet.getRange(3 + i, 1, 1, headers.length).setBackground('#ffffff');
    }
  }
  
  sheet.setColumnWidth(1, 50);
  sheet.setColumnWidth(2, 80);
  sheet.setColumnWidth(3, 100);
  sheet.setColumnWidth(4, 100);
  sheet.setColumnWidth(5, 180);
  sheet.setColumnWidth(6, 80);
  sheet.setColumnWidth(7, 100);
  sheet.setColumnWidth(8, 80);
  
  sheet.getRange('A1:H10').setBorder(true, true, true, true, true, true);
  
  // Status verde para ATIVA
  sheet.getRange('H3:H8').setFontColor('#1b5e20').setFontWeight('bold');
  
  sheet.setHiddenGridlines(false);
}

function configurarAlunos(ss) {
  var sheet = ss.getSheetByName('ALUNOS');
  sheet.clear();
  sheet.clearFormats();
  sheet.getRange('A1:I1').setBackground('#1a237e');
  sheet.getRange('A1:I1').merge();
  sheet.getRange('A1').setValue('👨‍🎓 CADASTRO DE ALUNOS').setFontColor('#ffffff').setFontWeight('bold').setFontSize(13).setHorizontalAlignment('center');
  
  var headers = ['ID', 'NOME DO ALUNO', 'TURMA', 'DATA NASC.', 'RESPONSÁVEL', 'TELEFONE', 'EMAIL', 'TOTAL OCORR.', 'STATUS'];
  sheet.getRange(2, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(2, 1, 1, headers.length).setBackground('#3f51b5').setFontColor('#ffffff').setFontWeight('bold').setHorizontalAlignment('center');
  
  var alunos = [
    [1, 'Noel Ferreira Santos', '6A', '12/03/2013', 'José Santos', '(11) 98765-4321', 'jose@email.com', '=COUNTIF(OCORRENCIAS!B:B,"Noel Ferreira Santos")', 'ATIVO'],
    [2, 'Lucas Mendes Costa', '6A', '05/07/2012', 'Ana Costa', '(11) 91234-5678', 'ana@email.com', '=COUNTIF(OCORRENCIAS!B:B,"Lucas Mendes Costa")', 'ATIVO'],
    [3, 'Gabriel Rocha Lima', '6A', '22/11/2012', 'Maria Lima', '(11) 99876-5432', 'maria.l@email.com', '=COUNTIF(OCORRENCIAS!B:B,"Gabriel Rocha Lima")', 'ATIVO'],
    [4, 'Pedro Alves Nunes', '7A', '14/04/2011', 'Carlos Nunes', '(11) 97654-3210', 'carlos@email.com', '=COUNTIF(OCORRENCIAS!B:B,"Pedro Alves Nunes")', 'ATIVO'],
    [5, 'Felipe Souza Torres', '7A', '30/08/2011', 'Lucia Torres', '(11) 96543-2109', 'lucia@email.com', '=COUNTIF(OCORRENCIAS!B:B,"Felipe Souza Torres")', 'ATIVO'],
    [6, 'Beatriz Gomes Pinto', '6B', '18/01/2013', 'Roberto Pinto', '(11) 95432-1098', 'rob@email.com', '=COUNTIF(OCORRENCIAS!B:B,"Beatriz Gomes Pinto")', 'ATIVO']
  ];
  sheet.getRange(3, 1, alunos.length, headers.length).setValues(alunos);
  
  for (var i = 0; i < alunos.length; i++) {
    if (i % 2 === 0) {
      sheet.getRange(3 + i, 1, 1, headers.length).setBackground('#e8eaf6');
    } else {
      sheet.getRange(3 + i, 1, 1, headers.length).setBackground('#ffffff');
    }
  }
  
  sheet.setColumnWidth(1, 50);
  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(3, 80);
  sheet.setColumnWidth(4, 100);
  sheet.setColumnWidth(5, 180);
  sheet.setColumnWidth(6, 140);
  sheet.setColumnWidth(7, 160);
  sheet.setColumnWidth(8, 100);
  sheet.setColumnWidth(9, 80);
  
  sheet.getRange('A1:I10').setBorder(true, true, true, true, true, true);
  sheet.getRange('I3:I8').setFontColor('#1b5e20').setFontWeight('bold');
  
  sheet.setHiddenGridlines(false);
}

function configurarOcorrencias(ss) {
  var sheet = ss.getSheetByName('OCORRENCIAS');
  sheet.clear();
  sheet.clearFormats();
  sheet.getRange('A1:J1').setBackground('#b71c1c');
  sheet.getRange('A1:J1').merge();
  sheet.getRange('A1').setValue('⚠️ REGISTRO DE OCORRÊNCIAS DISCIPLINARES').setFontColor('#ffffff').setFontWeight('bold').setFontSize(13).setHorizontalAlignment('center');
  
  var headers = ['ID', 'ALUNO', 'TURMA', 'DATA', 'TIPO', 'DESCRIÇÃO', 'MEDIDA TOMADA', 'RESP. NOTIFICADO', 'REGISTRADO POR', 'STATUS'];
  sheet.getRange(2, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(2, 1, 1, headers.length).setBackground('#c62828').setFontColor('#ffffff').setFontWeight('bold').setHorizontalAlignment('center');
  
  var ocorrencias = [
    [1, 'Noel Ferreira Santos', '6A', '10/05/2025', 'BRIGA', 'Briga com o colega Lucas durante o recreio. Agressão física mútua.', 'ADVERTÊNCIA VERBAL', 'SIM', 'Prof. Maria Silva', 'RESOLVIDO'],
    [2, 'Noel Ferreira Santos', '6A', '25/03/2025', 'DESOBEDIÊNCIA', 'Recusou-se a realizar atividade em sala de aula.', 'ADVERTÊNCIA ESCRITA', 'SIM', 'Prof. Maria Silva', 'RESOLVIDO'],
    [3, 'Noel Ferreira Santos', '6A', '12/02/2025', 'DESRESPEITO', 'Linguagem inadequada com colega de sala.', 'ADVERTÊNCIA VERBAL', 'NÃO', 'Prof. Maria Silva', 'RESOLVIDO'],
    [4, 'Lucas Mendes Costa', '6A', '10/05/2025', 'BRIGA', 'Briga com o colega Noel durante o recreio. Agressão física mútua.', 'ADVERTÊNCIA VERBAL', 'SIM', 'Prof. Maria Silva', 'RESOLVIDO'],
    [5, 'Gabriel Rocha Lima', '6A', '05/04/2025', 'VANDALISMO', 'Dano ao material da escola - cadeira danificada.', 'SUSPENSÃO 1 DIA', 'SIM', 'Coord. João Santos', 'RESOLVIDO'],
    [6, 'Pedro Alves Nunes', '7A', '20/04/2025', 'AGRESSÃO VERBAL', 'Ofensas a colega durante jogo de futebol.', 'ADVERTÊNCIA ESCRITA', 'SIM', 'Prof. Ana Souza', 'ABERTO'],
    [7, 'Noel Ferreira Santos', '6A', '08/01/2025', 'USO DE CELULAR', 'Uso de celular proibido durante aula.', 'ADVERTÊNCIA VERBAL', 'NÃO', 'Prof. Carlos Lima', 'RESOLVIDO']
  ];
  sheet.getRange(3, 1, ocorrencias.length, headers.length).setValues(ocorrencias);
  
  // Cores por tipo de ocorrência
  var cores = {
    'BRIGA': '#ffcdd2',
    'DESOBEDIÊNCIA': '#fff9c4',
    'DESRESPEITO': '#fff9c4',
    'VANDALISMO': '#ffccbc',
    'AGRESSÃO VERBAL': '#ffcdd2',
    'USO DE CELULAR': '#f3e5f5',
    'SUSPENSÃO': '#ef9a9a'
  };
  
  for (var i = 0; i < ocorrencias.length; i++) {
    var tipo = ocorrencias[i][4];
    var cor = cores[tipo] || '#ffffff';
    sheet.getRange(3 + i, 1, 1, headers.length).setBackground(cor);
  }
  
  sheet.setColumnWidth(1, 50);
  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(3, 70);
  sheet.setColumnWidth(4, 100);
  sheet.setColumnWidth(5, 140);
  sheet.setColumnWidth(6, 300);
  sheet.setColumnWidth(7, 160);
  sheet.setColumnWidth(8, 130);
  sheet.setColumnWidth(9, 160);
  sheet.setColumnWidth(10, 100);
  
  sheet.getRange('A1:J10').setBorder(true, true, true, true, true, true);
  sheet.setHiddenGridlines(false);
  
  // Status
  for (var i = 0; i < ocorrencias.length; i++) {
    var status = ocorrencias[i][9];
    if (status === 'RESOLVIDO') {
      sheet.getRange(3 + i, 10).setFontColor('#1b5e20').setFontWeight('bold');
    } else {
      sheet.getRange(3 + i, 10).setFontColor('#b71c1c').setFontWeight('bold');
    }
  }
}

function configurarDashboard(ss) {
  var sheet = ss.getSheetByName('DASHBOARD');
  sheet.clear();
  sheet.clearFormats();
  sheet.setHiddenGridlines(true);
  
  // Fundo
  sheet.getRange('A1:L40').setBackground('#f5f5f5');
  
  // Cabeçalho
  sheet.getRange('A1:L3').setBackground('#1a237e');
  sheet.getRange('B2:K2').merge();
  sheet.getRange('B2').setValue('🏫 SISTEMA DE GESTÃO DISCIPLINAR ESCOLAR - PAINEL DE CONTROLE');
  sheet.getRange('B2').setFontSize(16).setFontWeight('bold').setFontColor('#ffffff').setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(2, 50);
  
  // Cards de resumo
  // Card 1 - Total Turmas
  sheet.getRange('B5:C7').merge();
  sheet.getRange('B5').setValue('TURMAS ATIVAS');
  sheet.getRange('B5').setBackground('#3f51b5').setFontColor('#ffffff').setFontSize(11).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.getRange('B8:C9').merge();
  sheet.getRange('B8').setValue('=COUNTA(TURMAS!B3:B100)-COUNTIF(TURMAS!H3:H100,"INATIVA")');
  sheet.getRange('B8').setFontSize(28).setFontWeight('bold').setFontColor('#3f51b5').setHorizontalAlignment('center').setBackground('#e8eaf6');
  
  // Card 2 - Total Alunos
  sheet.getRange('E5:F7').merge();
  sheet.getRange('E5').setValue('TOTAL DE ALUNOS');
  sheet.getRange('E5').setBackground('#4caf50').setFontColor('#ffffff').setFontSize(11).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.getRange('E8:F9').merge();
  sheet.getRange('E8').setValue('=COUNTA(ALUNOS!B3:B100)');
  sheet.getRange('E8').setFontSize(28).setFontWeight('bold').setFontColor('#4caf50').setHorizontalAlignment('center').setBackground('#e8f5e9');
  
  // Card 3 - Total Ocorrencias
  sheet.getRange('H5:I7').merge();
  sheet.getRange('H5').setValue('OCORRÊNCIAS TOTAL');
  sheet.getRange('H5').setBackground('#f44336').setFontColor('#ffffff').setFontSize(11).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.getRange('H8:I9').merge();
  sheet.getRange('H8').setValue('=COUNTA(OCORRENCIAS!A3:A100)');
  sheet.getRange('H8').setFontSize(28).setFontWeight('bold').setFontColor('#f44336').setHorizontalAlignment('center').setBackground('#ffebee');
  
  // Card 4 - Ocorrencias Abertas
  sheet.getRange('K5:L7').merge();
  sheet.getRange('K5').setValue('EM ABERTO');
  sheet.getRange('K5').setBackground('#ff9800').setFontColor('#ffffff').setFontSize(11).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.getRange('K8:L9').merge();
  sheet.getRange('K8').setValue('=COUNTIF(OCORRENCIAS!J3:J100,"ABERTO")');
  sheet.getRange('K8').setFontSize(28).setFontWeight('bold').setFontColor('#ff9800').setHorizontalAlignment('center').setBackground('#fff3e0');
  
  // Seção histórico Noel
  sheet.getRange('B11:L11').merge();
  sheet.getRange('B11').setValue('📋 HISTÓRICO DO ALUNO - BUSCA RÁPIDA');
  sheet.getRange('B11').setBackground('#37474f').setFontColor('#ffffff').setFontSize(12).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(11, 35);
  
  sheet.getRange('B12:C12').merge();
  sheet.getRange('B12').setValue('Nome do Aluno:');
  sheet.getRange('B12').setFontWeight('bold').setFontSize(11);
  
  sheet.getRange('D12:G12').merge();
  sheet.getRange('D12').setValue('Noel Ferreira Santos');
  sheet.getRange('D12').setBackground('#fff9c4').setBorder(true, true, true, true, false, false).setFontSize(11);
  
  sheet.getRange('H12:I12').merge();
  sheet.getRange('H12').setValue('Total de Ocorrências:');
  sheet.getRange('H12').setFontWeight('bold').setFontSize(11);
  
  sheet.getRange('J12:L12').merge();
  sheet.getRange('J12').setValue('=COUNTIF(OCORRENCIAS!B:B,D12)');
  sheet.getRange('J12').setBackground('#ffcdd2').setFontSize(14).setFontWeight('bold').setHorizontalAlignment('center');
  
  // Tabela de ocorrências do aluno buscado
  var hdrOc = ['DATA', 'TIPO', 'DESCRIÇÃO', 'MEDIDA TOMADA', 'STATUS'];
  sheet.getRange('B14:F14').setValues([hdrOc]);
  sheet.getRange('B14:F14').setBackground('#37474f').setFontColor('#ffffff').setFontWeight('bold').setHorizontalAlignment('center');
  
  // Fórmula para listar ocorrências do aluno
  sheet.getRange('B15').setFormula('=IFERROR(FILTER(OCORRENCIAS!D3:D100,OCORRENCIAS!B3:B100=D12),"Sem ocorrências")');
  sheet.getRange('C15').setFormula('=IFERROR(FILTER(OCORRENCIAS!E3:E100,OCORRENCIAS!B3:B100=D12),"")');
  sheet.getRange('D15').setFormula('=IFERROR(FILTER(OCORRENCIAS!F3:F100,OCORRENCIAS!B3:B100=D12),"")');
  sheet.getRange('E15').setFormula('=IFERROR(FILTER(OCORRENCIAS!G3:G100,OCORRENCIAS!B3:B100=D12),"")');
  sheet.getRange('F15').setFormula('=IFERROR(FILTER(OCORRENCIAS!J3:J100,OCORRENCIAS!B3:B100=D12),"")');
  
  sheet.getRange('B15:F25').setBackground('#ffffff').setBorder(true, true, true, true, true, true);
  
  // Navegação
  sheet.getRange('B27:L27').merge();
  sheet.getRange('B27').setValue('📌 NAVEGAÇÃO: LOGIN  |  DASHBOARD  |  TURMAS  |  ALUNOS  |  OCORRÊNCIAS  |  USUÁRIOS');
  sheet.getRange('B27').setBackground('#283593').setFontColor('#ffffff').setFontSize(11).setFontWeight('bold').setHorizontalAlignment('center');
  
  // Larguras
  for (var c = 1; c <= 12; c++) {
    sheet.setColumnWidth(c, 130);
  }
  sheet.setColumnWidth(1, 30);
}

function verificarLogin() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var loginSheet = ss.getSheetByName('LOGIN');
  var usuariosSheet = ss.getSheetByName('USUARIOS');
  
  var usuario = loginSheet.getRange('C10').getValue().toString().trim();
  var senha = loginSheet.getRange('C13').getValue().toString().trim();
  
  if (!usuario || !senha) {
    loginSheet.getRange('C17').setValue('⚠️ Preencha usuário e senha!');
    loginSheet.getRange('C17').setFontColor('#ff6600').setBackground('#fff3e0');
    return;
  }
  
  var dados = usuariosSheet.getRange('C3:F20').getValues();
  var acesso = false;
  var nomeUsuario = '';
  var perfil = '';
  
  for (var i = 0; i < dados.length; i++) {
    if (dados[i][0].toString() === usuario && dados[i][1].toString() === senha && dados[i][3].toString() === 'ATIVO') {
      acesso = true;
      nomeUsuario = usuariosSheet.getRange(3 + i, 2).getValue();
      perfil = dados[i][2];
      break;
    }
  }
  
  if (acesso) {
    loginSheet.getRange('C17').setValue('✅ Bem-vindo(a), ' + nomeUsuario + '! [' + perfil + ']');
    loginSheet.getRange('C17').setFontColor('#1b5e20').setBackground('#e8f5e9').setFontWeight('bold');
    SpreadsheetApp.getUi().alert('✅ Login realizado com sucesso!\nBem-vindo(a), ' + nomeUsuario + '\nPerfil: ' + perfil + '\n\nRedirecionando para o Dashboard...');
    ss.setActiveSheet(ss.getSheetByName('DASHBOARD'));
  } else {
    loginSheet.getRange('C17').setValue('❌ Usuário ou senha incorretos!');
    loginSheet.getRange('C17').setFontColor('#b71c1c').setBackground('#ffebee').setFontWeight('bold');
    SpreadsheetApp.getUi().alert('❌ Acesso negado! Verifique usuário e senha.');
  }
}

function novaOcorrencia() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  
  var nomeAluno = ui.prompt('Nova Ocorrência', 'Nome do aluno:', ui.ButtonSet.OK_CANCEL);
  if (nomeAluno.getSelectedButton() !== ui.Button.OK) return;
  
  var turma = ui.prompt('Nova Ocorrência', 'Turma:', ui.ButtonSet.OK_CANCEL);
  if (turma.getSelectedButton() !== ui.Button.OK) return;
  
  var tipo = ui.prompt('Nova Ocorrência', 'Tipo (BRIGA/DESOBEDIÊNCIA/DESRESPEITO/AGRESSÃO VERBAL/VANDALISMO/OUTRO):', ui.ButtonSet.OK_CANCEL);
  if (tipo.getSelectedButton() !== ui.Button.OK) return;
  
  var descricao = ui.prompt('Nova Ocorrência', 'Descrição detalhada:', ui.ButtonSet.OK_CANCEL);
  if (descricao.getSelectedButton() !== ui.Button.OK) return;
  
  var medida = ui.prompt('Nova Ocorrência', 'Medida tomada (ADVERTÊNCIA VERBAL/ADVERTÊNCIA ESCRITA/SUSPENSÃO/OUTRO):', ui.ButtonSet.OK_CANCEL);
  if (medida.getSelectedButton() !== ui.Button.OK) return;
  
  var sheet = ss.getSheetByName('OCORRENCIAS');
  var ultimaLinha = sheet.getLastRow() + 1;
  var id = ultimaLinha - 2;
  var data = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy');
  
  sheet.getRange(ultimaLinha, 1, 1, 10).setValues([[
    id,
    nomeAluno.getResponseText(),
    turma.getResponseText(),
    data,
    tipo.getResponseText().toUpperCase(),
    descricao.getResponseText(),
    medida.getResponseText().toUpperCase(),
    'NÃO',
    Session.getActiveUser().getEmail(),
    'ABERTO'
  ]]);
  
  if (ultimaLinha % 2 === 0) {
    sheet.getRange(ultimaLinha, 1, 1, 10).setBackground('#fff9c4');
  } else {
    sheet.getRange(ultimaLinha, 1, 1, 10).setBackground('#ffffff');
  }
  
  ui.alert('✅ Ocorrência registrada com sucesso!\nAluno: ' + nomeAluno.getResponseText() + '\nData: ' + data);
}

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🏫 Sistema Escolar')
    .addItem('🔐 Verificar Login', 'verificarLogin')
    .addSeparator()
    .addItem('⚠️ Nova Ocorrência', 'novaOcorrencia')
    .addSeparator()
    .addItem('🔄 Recriar Sistema', 'criarSistemaEscolar')
    .addToUi();
}



function corrigirDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('DASHBOARD');
  
  // Corrigir fórmulas do card de Turmas Ativas
  sheet.getRange('B8').setFormula('=COUNTA(TURMAS!B3:B100)');
  
  // Corrigir fórmulas FILTER para usar ponto-e-vírgula (pt-BR)
  sheet.getRange('B15').setFormula('=IFERROR(FILTER(OCORRENCIAS!D3:D100,OCORRENCIAS!B3:B100=D12),"Sem ocorrências")');
  sheet.getRange('C15').setFormula('=IFERROR(FILTER(OCORRENCIAS!E3:E100,OCORRENCIAS!B3:B100=D12),"")');
  sheet.getRange('D15').setFormula('=IFERROR(FILTER(OCORRENCIAS!F3:F100,OCORRENCIAS!B3:B100=D12),"")');
  sheet.getRange('E15').setFormula('=IFERROR(FILTER(OCORRENCIAS!G3:G100,OCORRENCIAS!B3:B100=D12),"")');
  sheet.getRange('F15').setFormula('=IFERROR(FILTER(OCORRENCIAS!J3:J100,OCORRENCIAS!B3:B100=D12),"")');
  
  // Adicionar fórmulas de alunos na aba ALUNOS (colunas H e I)
  var alunosSheet = ss.getSheetByName('ALUNOS');
  for (var i = 3; i <= 8; i++) {
    var nomeCelula = 'B' + i;
    alunosSheet.getRange('H' + i).setFormula('=COUNTIF(OCORRENCIAS!B:B,B' + i + ')');
    alunosSheet.getRange('I' + i).setValue('ATIVO');
    alunosSheet.getRange('I' + i).setFontColor('#1b5e20').setFontWeight('bold');
  }
  
  // Adicionar cabeçalhos H e I na aba ALUNOS se não tiver
  if (alunosSheet.getRange('H2').getValue() === '') {
    alunosSheet.getRange('H2').setValue('TOTAL OCORR.');
    alunosSheet.getRange('I2').setValue('STATUS');
    alunosSheet.getRange('H2:I2').setBackground('#3f51b5').setFontColor('#ffffff').setFontWeight('bold').setHorizontalAlignment('center');
  }
  
  SpreadsheetApp.getUi().alert('✅ Dashboard corrigido com sucesso!');
}

// ===================== WEB APP BACKEND =====================

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Sistema Disciplinar Escolar')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function fazerLogin(usuario, senha) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('USUARIOS');
  var dados = sheet.getRange('B3:F20').getValues();
  for (var i = 0; i < dados.length; i++) {
    if (dados[i][1] === usuario && dados[i][2] === senha && dados[i][4] === 'ATIVO') {
      return { ok: true, nome: dados[i][0], perfil: dados[i][3] };
    }
  }
  return { ok: false, msg: 'Usuário ou senha incorretos!' };
}

function getDashboardData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var turmas = ss.getSheetByName('TURMAS').getLastRow() - 2;
  var alunos = ss.getSheetByName('ALUNOS').getLastRow() - 2;
  var ocSheet = ss.getSheetByName('OCORRENCIAS');
  var totalOc = ocSheet.getLastRow() - 2;
  var statusCol = ocSheet.getRange('J3:J' + Math.max(ocSheet.getLastRow(), 3)).getValues();
  var abertos = statusCol.filter(function(r){ return r[0] === 'ABERTO'; }).length;
  return { turmas: Math.max(turmas,0), alunos: Math.max(alunos,0), ocorrencias: Math.max(totalOc,0), abertos: abertos };
}

function getHistoricoAluno(nome) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('OCORRENCIAS');
  var last = sheet.getLastRow();
  if (last < 3) return [];
  var dados = sheet.getRange('B3:J' + last).getValues();
  return dados.filter(function(r){ 
    return r[0].toString().toLowerCase() === nome.toString().toLowerCase(); 
  }).map(function(r){
    return [r[2], r[3], r[4], r[5], r[6], r[8]]; // data, tipo, desc, medida, notificado, status
  });
}

function getOcorrencias() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('OCORRENCIAS');
  var last = sheet.getLastRow();
  if (last < 3) return [];
  return sheet.getRange('A3:J' + last).getValues().filter(function(r){ return r[0] !== ''; });
}

function getAlunos() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var alunosSheet = ss.getSheetByName('ALUNOS');
  var ocSheet = ss.getSheetByName('OCORRENCIAS');
  var last = alunosSheet.getLastRow();
  if (last < 3) return [];
  var alunos = alunosSheet.getRange('A3:I' + last).getValues().filter(function(r){ return r[0] !== ''; });
  var ocLast = ocSheet.getLastRow();
  var ocDados = ocLast >= 3 ? ocSheet.getRange('B3:B' + ocLast).getValues() : [];
  return alunos.map(function(r){
    var count = ocDados.filter(function(o){ return o[0] === r[1]; }).length;
    return [r[0], r[1], r[2], r[3], r[4], r[5], r[6], count, 'ATIVO'];
  });
}

function getTurmas() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('TURMAS');
  var last = sheet.getLastRow();
  if (last < 3) return [];
  return sheet.getRange('A3:H' + last).getValues().filter(function(r){ return r[0] !== ''; });
}

function getUsuarios() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('USUARIOS');
  var last = sheet.getLastRow();
  if (last < 3) return [];
  return sheet.getRange('A3:G' + last).getValues().filter(function(r){ return r[0] !== ''; }).map(function(r){
    return [r[0], r[1], r[2], r[3], r[4], r[5], r[6] ? Utilities.formatDate(new Date(r[6]), Session.getScriptTimeZone(), 'dd/MM/yyyy') : '-'];
  });
}

function salvarNovaOcorrencia(aluno, turma, tipo, descricao, medida, notificado) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('OCORRENCIAS');
  var lastRow = sheet.getLastRow() + 1;
  var id = lastRow - 2;
  var data = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy');
  sheet.getRange(lastRow, 1, 1, 10).setValues([[
    id, aluno, turma, data, tipo, descricao, medida, notificado, 'Sistema Web', 'ABERTO'
  ]]);
  sheet.getRange(lastRow, 1, 1, 10).setBackground(lastRow % 2 === 0 ? '#fff9c4' : '#ffffff');
  return true;
}
