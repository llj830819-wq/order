
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

document.getElementById('orderForm').addEventListener('submit', e => {
  e.preventDefault()

  const name = document.getElementById('name').value
  const item = document.getElementById('item').value
  const sugar = document.getElementById('sugar').value
  const ice = document.getElementById('ice').value
  const qty = Number(document.getElementById('qty').value)
  const price = menu.find(m => m.name === item).price
  const note = document.getElementById('note').value
  
  orders.push({ name, item, sugar, ice, qty, price, note })
  ``

  renderOrders()
  renderSummary()
})

function renderOrders() {
  const ul = document.getElementById('orderList')
  ul.innerHTML = ''

  orders.forEach(o => {
    const li = document.createElement('li')

li.textContent =
  `${o.name} - ${o.item} (${o.sugar}/${o.ice}) x${o.qty}` +
  (o.note ? `【備註：${o.note}】` : '')
    ul.appendChild(li)
  })
}

function renderSummary() {
  let total = 0
  let count = {}

  orders.forEach(o => {
    total += o.qty * o.price
    count[o.item] = (count[o.item] || 0) + o.qty
  })

  const div = document.getElementById('summary')
  div.innerHTML = `
    <p>總金額：$${total}</p>
    <p>
      ${Object.entries(count)
        .map(([item, qty]) => `${item}：${qty} 杯`)
        .join('<br>')}
    </p>
  `
}
