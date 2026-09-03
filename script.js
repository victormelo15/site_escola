document.addEventListener('DOMContentLoaded', function () {

  // 1. Menu Mobile
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function () {
      mainNav.classList.toggle('open');
    });
  }

  // 2. Abas do Interclasse (Futsal / Vôlei)
  const sportTabs = document.querySelectorAll('.sport-tab');
  if (sportTabs.length > 0) {
    sportTabs.forEach(tab => {
      tab.addEventListener('click', function () {
        sportTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        const sport = this.getAttribute('data-sport');
        const futsalSec = document.getElementById('futsal');
        const voleiSec = document.getElementById('volei');
        if (futsalSec) futsalSec.style.display = (sport === 'futsal') ? 'block' : 'none';
        if (voleiSec) voleiSec.style.display = (sport === 'volei') ? 'block' : 'none';
      });
    });
  }

  // 3. Filtros na Página Inicial (Posts)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const postCards = document.querySelectorAll('.post-card');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filterValue = this.getAttribute('data-filter');
        postCards.forEach(card => {
          if (filterValue === 'todos' || card.getAttribute('data-category') === filterValue) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  // 4. Seletor de Turma no Calendário
  const turmaSelect = document.getElementById('turmaSelect');
  if (turmaSelect) {
    turmaSelect.addEventListener('change', function () {
      const selectedTurma = this.value;
      const days = document.querySelectorAll('.calendar-day');

      // Limpa eventos específicos de turma anteriores
      document.querySelectorAll('.event-turma-extra').forEach(e => e.remove());

      if (selectedTurma !== 'geral') {
        // Insere um evento dinâmico de exemplo no dia 16 para demonstrar o funcionamento
        const targetDay = days[15]; // 16 de setembro
        if (targetDay) {
          const dot = document.createElement('span');
          dot.className = 'event-dot event-trabalho event-turma-extra';
          dot.textContent = 'Entrega: ' + selectedTurma;
          dot.title = 'Trabalho de Biologia - ' + selectedTurma;
          targetDay.appendChild(dot);
        }
      }
    });
  }

});
  const btnlogin = document.querySelector(".btn-login");

  if (btnlogin && sessionStorage.getItem("adminAutorizado") === "true") {
      btnlogin.textContent = "Painel administrativo";
      btnlogin.href = "admin.html";
}
