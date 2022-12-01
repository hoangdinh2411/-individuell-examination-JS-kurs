const app = {
  variables: {
    BASE_URL: 'https://fathomless-shelf-54969.herokuapp.com',
    // att sätt property name in planet colors arrayen syfter till att märkera vilket planet ska ha denna färg
    planet_colors: [
      {
        name: 'Solen',
        color: '#FFD029',
      },
      {
        name: 'Merkurius',
        color: '#888888',
      },
      {
        name: 'Venus',
        color: '#E7CDCD',
      },
      {
        name: 'Jorden',
        color: '#428ED4',
      },
      {
        name: 'Mars',
        color: '#EF5F5F',
      },
      {
        name: 'Jupiter',
        color: '#E29468',
      },
      {
        name: 'Saturnus',
        color: '#C7AA72',
      },
      {
        name: 'Uranus',
        color: '#C9D4F1',
      },
      {
        name: 'Neptunus',
        color: '#7A91A7',
      },
    ],
  },
  elements: {
    wrapper: document.querySelector('.wrapper'),
    modal: document.querySelector('.modal'),
    modal_body: document.querySelector('.modal__body'),
    modal_overlay: document.querySelector('.modal__overlay'),
    selected_planet: document.querySelector('.selected-planet'),
    rubric: document.querySelector('.planet__rubric'),
    sub_rubric: document.querySelector('.planet__sub-rubric'),
    desc: document.querySelector('.planet__desc'),
    desc: document.querySelector('.planet__desc'),
    detail_container: document.querySelector('.planet__details'),
    others_title: document.querySelector('.others__title'),
    others_content: document.querySelector('.others__content'),
  },

  getKey: async function () {
    const response = await fetch(`${this.variables.BASE_URL}/keys`, {
      method: 'POST',
    })
    const data = await response.json()
    console.log(data)
    return data.key
  },
  getPlanets: async function () {
    const key = await this.getKey()
    const response = await fetch(`${this.variables.BASE_URL}/bodies`, {
      headers: {
        'x-zocom': key,
      },
    })
    const data = await response.json()
    console.log(data)
    return data.bodies
  },
  toggleModal: function () {
    this.elements.modal.classList.add('active')

    this.elements.modal_overlay.addEventListener('click', () => {
      this.elements.modal.classList.remove('active')
      this.elements.modal_body.scrollTop = 0
    })
  },

  handleSelectedPlanet: function (body, bodyIndex) {
    this.toggleModal()

    const selected_planet_color = this.variables.planet_colors[bodyIndex].color

    this.elements.selected_planet.style.backgroundColor = selected_planet_color
    this.elements.selected_planet.style.boxShadow = `0 0 30px 5px ${selected_planet_color}`
    //heading
    this.displayHeading(body, selected_planet_color)

    //detail
    this.displayDetail(body)

    // other info
    this.displayOtherInfo(body)
  },

  // denna funktion visar innehåll till heading av den planet man valde
  displayHeading: function (body, selected_planet_color) {
    this.elements.rubric.innerHTML = body.name
    this.elements.sub_rubric.style.color = selected_planet_color
    this.elements.sub_rubric.innerHTML = body.latinName
    this.elements.desc.innerHTML = body.desc
  },
  // denna funktion visar 4 detaljer :circumference,distance, temp on day, temp on night. Jag giorde så här eftersom jag vill funktionen handleSelectedPlanet ska bli lättare att förstår.
  displayDetail: function (body) {
    const detailsArray = [
      {
        title: 'OMKRETS',
        content: body.circumference,
      },
      {
        title: 'KM FRÅN SOLEN',
        content: body.distance,
      },
      {
        title: 'MAX TEMPERATUR',
        content: body.temp.day,
      },
      {
        title: 'MIN TEMPERATUR',
        content: body.temp.night,
      },
    ]
    const result = detailsArray.map(
      (detail) => `
        <section class="detail">
          <b class="detail__title">${detail.title}</b>
          <p class="detail__content">${detail.content}</p>
        </section>
  `
    )
    this.elements.detail_container.innerHTML = result.join('')
  },
  // denna funktion visar andra information bland annat månar eller rotation
  displayOtherInfo: function (body) {
    this.elements.others_title.innerHTML =
      body.moons.length > 0 ? 'Månar' : 'Rotation'
    this.elements.others_content.innerHTML =
      body.moons.length > 0 ? body.moons.join(', ') : body.rotation
  },
  // denna funktion stylar för sol sjärna genom att sätt class 'sun' på
  styleForSunStar: function (spanElement) {
    spanElement.classList.add('sun')
  },

  // denna funktion stylar för andra planet , skalan mellan på websidan ock  verklighet är 1/2000
  styleForOtherPlanets: function (spanElement, body) {
    const ratio = 2000
    const scaleOnApp = body.circumference / ratio
    spanElement.style.width = scaleOnApp + 'px'
    spanElement.style.height = scaleOnApp + 'px'

    return spanElement
  },
  renderBodies: function (bodies) {
    bodies.forEach((body, bodyIndex) => {
      let spanElement = document.createElement('span')

      if (body.type === 'star') {
        this.styleForSunStar(spanElement)
      } else {
        this.styleForOtherPlanets(spanElement, body)
      }
      const planet_color = this.variables.planet_colors[bodyIndex].color

      spanElement.style.backgroundColor = planet_color
      spanElement.setAttribute('title', body.name)

      spanElement.addEventListener('mouseover', () => {
        spanElement.style.boxShadow = `0 0 30px 5px ${planet_color}`
      })
      spanElement.addEventListener('mouseout', () => {
        spanElement.style.boxShadow = ''
      })
      spanElement.addEventListener('click', () => {
        this.handleSelectedPlanet(body, bodyIndex)
      })

      this.elements.wrapper.appendChild(spanElement)
    })
  },
  start: async function () {
    let bodies = await this.getPlanets()
    this.renderBodies(bodies)
  },
}

app.start()
