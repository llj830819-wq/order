
let menu = []
let editingIndex = null

let orders = JSON.parse(localStorage.getItem('orders')) || []
orders = orders.filter(o => typeof o.name === 'string' && o.name.trim() !== '')
localStorage.setItem('orders', JSON.stringify(orders))

fetch('menu.json')
  .then(res => res.json())
  .then(data => {
    menu = data
    const item = document.getElementById('item')
    menu.forEach(m => {
      const opt = document.createElement('option')
      opt.value = m.name
      opt.textContent = `${m.name} $${m.price}`
      item.appendChild(opt)
    })
  })

document.getElementById('orderForm').addEventListener('submit', e => {
  e.preventDefault()

  const order = {
    name: document.getElementById('name').value,
    item: document.getElementById('item').value,
    sugar: document.getElementById('sugar').value,
    ice: document.getElementById('ice').value,
    qty: Number(document.getElementById('qty').value),
    note: document.getElementById('note').value,
    price: menu.find(m => m.name === document.getElementById('item').value).price
  }

  if (editingIndex !== null) {
    orders[editingIndex] = order
    editingIndex = null
  } else {
    orders.push(order)
  }

  save()
  e.target.reset()
})

function save() {
  localStorage.setItem('orders', JSON.stringify(orders))
  render()
}

function render() {
  renderOrders()
  renderSummary()
}

function renderOrders() {
  const ul = document.getElementById('orderList')
  ul.innerHTML = ''

  orders.forEach((o, i) => {
    const li = document.createElement('li')
    li.innerHTML = `
      <div>
        <b>${o.name}</b>｜${o.item} (${o.sugar}/${o.ice}) × ${o.qty}
        ${o.note ? `<br><small>備註：${o.note}</small>` : ''}
      </div>
      <div>
        <button onclick="edit(${i})">編</button>
        <button onclick="del(${i})">×</button>
      </div>
    `
    ul.appendChild(li)
  })
}

function edit(i) {
  const o = orders[i]
  editingIndex = i
  name.value = o.name
  item.value = o.item
  sugar.value = o.sugar
  ice.value = o.ice
  qty.value = o.qty
  note.value = o.note
}

function del(i) {
  if (confirm('確定刪除？')) {
    orders.splice(i, 1)
    save()
  }
}

function renderSummary() {
  let total = 0, map = {}
  orders.forEach(o => {
    total += o.qty * o.price
    map[o.item] = (map[o.item] || 0) + o.qty
  })

  summary.innerHTML = `
    <p>總金額：$${total}</p>
    <p>${Object.entries(map).map(([k,v]) => `${k}：${v} 杯`).join('<br>')}</p>
  `
}

/* 匯出 xlsx */
document.getElementById('exportExcel').onclick = () => {
  const ws = XLSX.utils.json_to_sheet(orders)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '訂單')
  XLSX.writeFile(wb, '點餐統計.xlsx')
}

render()
