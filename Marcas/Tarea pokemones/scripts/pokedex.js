document.addEventListener('DOMContentLoaded', async () => {


  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  mobileMenuBtn.addEventListener('click', function () {
    navLinks.classList.toggle('show');
    mobileMenuBtn.classList.toggle('active');
  });



  // Función para cargar el JSON de Pokemones
  function loadPokemons() {
    try {
      const response = fetch('http://localhost:3000/pokedex.json')

      if (!response.ok) {
        throw new Error(`Error al cargar el JSON: ${response.status}`)
      }
      
      const data = response.json()
      return data
    } catch (error) {
      console.error('Error en fetch: ', error)

      return []
    }
  }

  // Carga el array de Pokemones en una variable
  const pokemonData = await loadPokemons()
  console.log(pokemonData)
  

  // Se trae el contenedor y el template
  const container = document.querySelector('.container')
  const template = document.getElementById('pokemon-card-template')

  // Definición de los iconos para cada tipo de Pokémon
  const typeIcons = {
    Grass: '🌿',
    Poison: '☠️',
    Fire: '🔥',
    Water: '💧',
    Electric: '⚡',
    Normal: '⚪',
    Fighting: '👊',
    Ground: '🌍',
    Flying: '🦅',
    Psychic: '🔮',
    Bug: '🐛',
    Rock: '🪨',
    Ghost: '👻',
    Dark: '🌑',
    Dragon: '🐉',
    Steel: '⚙️',
    Fairy: '✨',
    Ice: '❄️'
  }

  // Función para calcular el porcentaje de una estadística (máximo 255)
  const calculateStatPercentage = (value) => {
    return (parseInt(value) / 255) * 100
  }

  // Función para crear una tarjeta de Pokémon
  const createPokemonCard = (pokemon, index) => {
    // Clonar el template
    const card = template.content.cloneNode(true)
    const cardElement = card.querySelector('.pokemon-card')
    
    // Añadir delay de animación basado en el índice
    cardElement.style.animationDelay = `${index * 0.2}s`
    
    // Establecer el fondo basado en el tipo o si es legendario
    const isLegendary = pokemon.Legendary.toLowerCase() === 'true'
    if (isLegendary) {
      cardElement.classList.add('bg-legendary')
      const legendaryTag = card.querySelector('.legendary-tag')
      legendaryTag.style.display = 'block'
      
      // Añadir efecto de brillo para legendarios
      cardElement.classList.add('legendary-shimmer')
    } else {
      // Añadir clase de fondo según el tipo
      cardElement.classList.add(`bg-${pokemon['Type 1'].toLowerCase()}`)
    }
    
    // Establecer la imagen del sprite
    const sprite = card.querySelector('.sprite');
    sprite.src = `./pokemon/${pokemon.Id}.png`;
    sprite.alt = pokemon.Name;
    sprite.onerror = () => {
      sprite.src = `./pokemon/0.png`; // Placeholder si no se encuentra la imagen
    };
    
    // Establecer el ID
    card.querySelector('.pokemon-id').textContent = `#${pokemon.Id}`
    
    // Establecer el nombre
    card.querySelector('.pokemon-name').textContent = pokemon.Name
    
    // Añadir los tag de tipo
    const typeTagsContainer = card.querySelector('.type-tags')
    
    // Añadir el tipo principal
    const type1Tag = document.createElement('div');
    type1Tag.className = `type-tag ${pokemon['Type 1'].toLowerCase()}`
    type1Tag.innerHTML = `${typeIcons[pokemon['Type 1']] || ''} ${pokemon['Type 1']}`
    typeTagsContainer.appendChild(type1Tag);
    
    // Añadir el tipo secundario si existe
    if (pokemon['Type 2'] && pokemon['Type 2'] !== '') {
      const type2Tag = document.createElement('div');
      type2Tag.className = `type-tag ${pokemon['Type 2'].toLowerCase()}`;
      type2Tag.innerHTML = `${typeIcons[pokemon['Type 2']] || ''} ${pokemon['Type 2']}`
      typeTagsContainer.appendChild(type2Tag)
    }
    
    // Trae las barras de progreso para las estadísticas
    const hpBar = card.querySelector('.hp');
    const attackBar = card.querySelector('.attack');
    const defenseBar = card.querySelector('.defense');
    const spAtkBar = card.querySelector('.sp-atk');
    const spDefBar = card.querySelector('.sp-def');
    const speedBar = card.querySelector('.speed');
    
    // Configurar las anchuras de las barras de progreso con variables CSS
    hpBar.style.setProperty('--progress-width', `${calculateStatPercentage(pokemon.HP)}%`)
    attackBar.style.setProperty('--progress-width', `${calculateStatPercentage(pokemon.Attack)}%`)
    defenseBar.style.setProperty('--progress-width', `${calculateStatPercentage(pokemon.Defense)}%`)
    spAtkBar.style.setProperty('--progress-width', `${calculateStatPercentage(pokemon.Sp[' Atk'])}%`)
    spDefBar.style.setProperty('--progress-width', `${calculateStatPercentage(pokemon.Sp[' Def'])}%`)
    speedBar.style.setProperty('--progress-width', `${calculateStatPercentage(pokemon.Speed)}%`)
    
    // Establecer la información total y generación
    card.querySelector('.total-value').textContent = pokemon.Total
    card.querySelector('.gen-value').textContent = pokemon.Generation
    
    // Añadir la tarjeta al contenedor
    container.appendChild(card)
    
    // Animar las barras de progreso después de un pequeño retraso
    setTimeout(() => {
      hpBar.classList.add('animate-progress')
      attackBar.classList.add('animate-progress')
      defenseBar.classList.add('animate-progress')
      spAtkBar.classList.add('animate-progress')
      spDefBar.classList.add('animate-progress')
      speedBar.classList.add('animate-progress')
      
      // Establecer las anchuras reales
      hpBar.style.width = `${calculateStatPercentage(pokemon.HP)}%`
      attackBar.style.width = `${calculateStatPercentage(pokemon.Attack)}%`
      defenseBar.style.width = `${calculateStatPercentage(pokemon.Defense)}%`
      spAtkBar.style.width = `${calculateStatPercentage(pokemon.Sp[' Atk'])}%`
      spDefBar.style.width = `${calculateStatPercentage(pokemon.Sp[' Def'])}%`
      speedBar.style.width = `${calculateStatPercentage(pokemon.Speed)}%`
    }, 500 + index * 200)
    
    // Añadir efectos de hover adicionales
    cardElement.addEventListener('mouseenter', () => {
      // Añadir clase para efecto de brillo en hover
      if (isLegendary) {
        cardElement.style.boxShadow = '0 15px 30px rgba(255, 215, 0, 0.5)'
      }
      
      // Añadir efecto de rotación 3D suave si es legendario
      if (!isLegendary) {
        cardElement.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease'
      }
      
      // Efecto de seguimiento del cursor
      cardElement.addEventListener('mousemove', (e) => {
        const rect = cardElement.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        
        const rotateX = (y - centerY) / 20
        const rotateY = (centerX - x) / 20
        
        cardElement.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`
      })
    })
    
    // Restablecer efectos al quitar el cursor
    cardElement.addEventListener('mouseleave', () => {
      cardElement.style.transform = ''
      cardElement.style.boxShadow = ''
      
      // Eliminar el evento de seguimiento del cursor
      cardElement.removeEventListener('mousemove', () => {})
    })
  }

  let currentPage = 1
  const cardsPerPage = 9
  const totalPages = Math.ceil(pokemonData.length / cardsPerPage)

  const renderPage = (page) => {
    container.innerHTML = '' // Limpiar tarjetas actuales

    const start = (page - 1) * cardsPerPage
    const end = start + cardsPerPage
    const pageData = pokemonData.slice(start, end)

    pageData.forEach((pokemon, index) => {
      createPokemonCard(pokemon, index)
    })

    // Actualiza la info de página
    document.getElementById('pageInfo').textContent = `Página ${page} de ${totalPages}`

    // Deshabilita botones según sea necesario
    document.getElementById('prevPage').disabled = page === 1
    document.getElementById('nextPage').disabled = page === totalPages
  }

  // Eventos para los botones
  document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--
      renderPage(currentPage)
    }
  })

  document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++
      renderPage(currentPage)
    }
  })

  // Render inicial
  renderPage(currentPage)

})