
let menu = []
let orders = []

fetch('menu.json')
  .then(res => res.json())
  .then(data => {
    menu = data
    const itemSelect = document.getElementById('item')

    menu.forEach(m => {
      const opt = document.createElement('option')
      opt.value = m.name
      opt.textContent = `${m.name} $${m.price}`
      itemSelect.appendChild(opt)
    })
  })
