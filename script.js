
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
    opt.textContent = `${m.name}（M $${m.price.M} / L $${m.price.L}）`
    item.appendChild(opt)
})
  })

document.getElementById('orderForm').addEventListener('submit', e => {
  e.preventDefault()
  
const selectedItem = document.getElementById('item').value
const selectedSize = document.getElementById('size').value

const menuItem = menu.find(m => m.name === selectedItem)
const unitPrice = menuItem.price[selectedSize]

const order = {
  name: document.getElementById('name').value,
  item: selectedItem,
  size: selectedSize,
  sugar: document.getElementById('sugar').value,
  ice: document.getElementById('ice').value,
  qty: Number(document.getElementById('qty').value),
  note: document.getElementById('note').value,
  price: unitPrice
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
       <b>${o.name}</b>｜${o.item} ${o.size}
       (${o.sugar}/${o.ice}) × ${o.qty}
        ${o.note ? `<br><small>備註：${o.note}</small>` : ''}
      </div>
      <div>
        <button onclick="edit(${i})">編輯訂單</button>
        <button onclick="del(${i})">刪除</button>
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
  document.getElementById('size').value = o.size
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
  const data = orders.map(o => ({
    姓名: o.name,
    品項: o.item,
    容量: o.size,
    甜度: o.sugar,
    冰塊: o.ice,
    數量: o.qty,
    單價: o.price,
    備註: o.note || ''
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '訂單')

  XLSX.writeFile(wb, '點餐統計.xlsx')
}


render()
