document.addEventListener('DOMContentLoaded', () => {
  // Menú móvil
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('show');
      mobileMenuBtn.classList.toggle('active');
    });
  }
  
  /**
   * Función para obtener 4 Pokémon aleatorios del array
   * @param {Array} pokemonArray - Array de datos de Pokémon
   * @param {Number} count - Cantidad de Pokémon a seleccionar
   * @returns {Array} - Array con los Pokémon seleccionados aleatoriamente
   */
  function getRandomPokemon(pokemonArray, count = 4) {
    // Crear una copia del array para no modificar el original
    const shuffled = [...pokemonArray];

    // Mezclar el array usando el algoritmo Fisher-Yates
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Devolver los primeros 'count' elementos
    return shuffled.slice(0, count);
  }

  /**
   * Función para calcular el porcentaje de una estadística (máximo 255)
   * @param {String} value - Valor de la estadística
   * @returns {Number} - Porcentaje calculado
   */
  function calculateStatPercentage(value) {
    return (parseInt(value) / 255) * 100;
  }

  /**
   * Función para crear una tarjeta de Pokémon horizontal
   * @param {Object} pokemon - Datos del Pokémon
   * @param {Number} index - Índice para el delay de animación
   */
  counter = 1;
  function createHorizontalPokemonCard(pokemon, index) {
    const showCase = document.getElementById('show-case');
    if (!showCase) return;

    // Determinar si es legendario
    const isLegendary = pokemon.Legendary.toLowerCase() === 'true';

    // Crear la tarjeta
    const card = document.createElement('div');
    card.className = `card${counter++} pokemon-card-horizontal ${isLegendary ? 'bg-legendary' : `bg-${pokemon['Type 1'].toLowerCase()}`}`;
    card.style.animationDelay = `${index * 0.2}s`;

    // Sección izquierda (imagen y nombre)
    const leftSection = document.createElement('div');
    leftSection.className = 'card-left';

    // ID del Pokémon
    const idElement = document.createElement('div');
    idElement.className = 'pokemon-id';
    idElement.textContent = `#${pokemon.Id}`;

    // Contenedor del sprite
    const spriteContainer = document.createElement('div');
    spriteContainer.className = 'sprite-container';

    // Imagen del Pokémon
    const sprite = document.createElement('img');
    sprite.className = 'sprite';
    sprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.Id}.png`;
    sprite.alt = pokemon.Name;
    sprite.onerror = () => {
      sprite.src = `https://via.placeholder.com/60?text=${pokemon.Name}`;
    };

    // Nombre del Pokémon
    const nameElement = document.createElement('div');
    nameElement.className = 'pokemon-name';
    nameElement.textContent = pokemon.Name;

    // Ensamblar la sección izquierda
    spriteContainer.appendChild(sprite);
    leftSection.appendChild(idElement);
    leftSection.appendChild(spriteContainer);
    leftSection.appendChild(nameElement);

    // Sección derecha (tipos y estadísticas)
    const rightSection = document.createElement('div');
    rightSection.className = 'card-right';

    // Badges de tipo
    const typeBadges = document.createElement('div');
    typeBadges.className = 'type-badges';

    // Tipo primario
    const type1Badge = document.createElement('div');
    type1Badge.className = `type-badge ${pokemon['Type 1'].toLowerCase()}`;
    type1Badge.textContent = pokemon['Type 1'];
    typeBadges.appendChild(type1Badge);

    // Tipo secundario (si existe)
    if (pokemon['Type 2'] && pokemon['Type 2'] !== '') {
      const type2Badge = document.createElement('div');
      type2Badge.className = `type-badge ${pokemon['Type 2'].toLowerCase()}`;
      type2Badge.textContent = pokemon['Type 2'];
      typeBadges.appendChild(type2Badge);
    }

    // Contenedor de estadísticas
    const statsContainer = document.createElement('div');
    statsContainer.className = 'stats-container';

    // Función para crear una fila de estadística
    const createStatRow = (label, value, statClass) => {
      const row = document.createElement('div');
      row.className = 'stat-row';

      const labelElement = document.createElement('span');
      labelElement.className = 'stat-label';
      labelElement.textContent = label + ':';

      const progressContainer = document.createElement('div');
      progressContainer.className = 'progress-container';

      const progressBar = document.createElement('div');
      progressBar.className = `progress-bar ${statClass}`;

      progressContainer.appendChild(progressBar);
      row.appendChild(labelElement);
      row.appendChild(progressContainer);

      // Guardar el porcentaje para animarlo después
      const percentage = calculateStatPercentage(value);
      progressBar.dataset.percentage = percentage;

      return row;
    };

    // Crear filas de estadísticas
    statsContainer.appendChild(createStatRow('HP', pokemon.HP, 'hp'));
    statsContainer.appendChild(createStatRow('Ataque', pokemon.Attack, 'attack'));
    statsContainer.appendChild(createStatRow('Defensa', pokemon.Defense, 'defense'));
    statsContainer.appendChild(createStatRow('Atq.Esp', pokemon.Sp[' Atk'], 'sp-atk'));
    statsContainer.appendChild(createStatRow('Def.Esp', pokemon.Sp[' Def'], 'sp-def'));
    statsContainer.appendChild(createStatRow('Vel', pokemon.Speed, 'speed'));

    // Información total
    const totalInfo = document.createElement('div');
    totalInfo.className = 'total-info';
    totalInfo.innerHTML = `<span>Total: ${pokemon.Total}</span> • <span>Gen: ${pokemon.Generation}</span>`;

    // Ensamblar la sección derecha
    rightSection.appendChild(typeBadges);
    rightSection.appendChild(statsContainer);
    rightSection.appendChild(totalInfo);

    // Ensamblar la tarjeta completa
    card.appendChild(leftSection);
    card.appendChild(rightSection);

    // Añadir la tarjeta al contenedor
    showCase.appendChild(card);

    // Animar las barras de progreso después de un pequeño retraso
    setTimeout(() => {
      const progressBars = card.querySelectorAll('.progress-bar');
      progressBars.forEach(bar => {
        bar.style.width = `${bar.dataset.percentage}%`;
      });
    }, 300 + index * 200);
  }

  /**
   * Función principal para mostrar 4 Pokémon aleatorios
   */
  function showRandomPokemon() {
    // Obtener 4 Pokémon aleatorios
    const randomPokemon = getRandomPokemon(pokemonData, 4);

    // Crear una tarjeta para cada Pokémon
    randomPokemon.forEach((pokemon, index) => {
      createHorizontalPokemonCard(pokemon, index);
    });
  }

  // Iniciar la aplicación
  showRandomPokemon();

  // Botón para refrescar los Pokémon
  const refreshButton = document.getElementById('refresh-button');
  refreshButton.addEventListener('click', () => {
    const showCase = document.getElementById('show-case');
    showCase.innerHTML = ''; // Limpiar el contenedor
    showRandomPokemon(); // Mostrar nuevos Pokémon aleatorios
  });

  document.querySelector('.container').appendChild(refreshButton);


  // Animaciones al hacer scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-card, .step, .section-header h2');

    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementBottom = element.getBoundingClientRect().bottom;
      const isVisible = (elementTop < window.innerHeight - 100) && (elementBottom > 0);

      if (isVisible) {
        element.classList.add('animated');
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };

  // Configurar elementos para animación
  const setupAnimations = () => {
    const elements = document.querySelectorAll('.feature-card, .step, .section-header h2');

    elements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Ejecutar animación inicial
    animateOnScroll();

    // Añadir evento de scroll
    window.addEventListener('scroll', animateOnScroll);
  };

  // Inicializar animaciones
  setupAnimations();

  // Efecto de parallax en la sección hero
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const heroSection = document.querySelector('.hero');

    if (heroSection) {
      const floatingPokemon1 = document.getElementById('floating-pokemon-1');
      const floatingPokemon2 = document.getElementById('floating-pokemon-2');
      const floatingPokemon3 = document.getElementById('floating-pokemon-3');

      if (floatingPokemon1) floatingPokemon1.style.transform = `translateY(${scrollPosition * 0.1}px)`;
      if (floatingPokemon2) floatingPokemon2.style.transform = `translateY(${scrollPosition * -0.05}px)`;
      if (floatingPokemon3) floatingPokemon3.style.transform = `translateY(${scrollPosition * 0.08}px)`;
    }
  });

  // Smooth scroll para los enlaces de navegación
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });

        // Cerrar el menú móvil si está abierto
        if (navLinks.classList.contains('show')) {
          navLinks.classList.remove('show');
          mobileMenuBtn.classList.remove('active');
        }
      }
    });
  });
});