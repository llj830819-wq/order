
let menu = []
let orders = JSON.parse(localStorage.getItem('orders')) || []

/* ===== 載入菜單 ===== */
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

/* ===== 表單送出 ===== */
document.getElementById('orderForm').addEventListener('submit', e => {
  e.preventDefault()

  const order = {
    name: name.value,
    item: item.value,
    sugar: sugar.value,
    ice: ice.value,
    qty: Number(qty.value),
    note: note.value,
    price: menu.find(m => m.name === item.value).price
  }

  if (editingIndex !== null) {
    orders[editingIndex] = order
    editingIndex = null
  } else {
    orders.push(order)
  }

  saveAndRender()
  e.target.reset()
})

/* ===== 儲存 + 重畫 ===== */
function saveAndRender() {
  localStorage.setItem('orders', JSON.stringify(orders))
  renderOrders()
  renderSummary()
}

/* ===== 訂單列表（含刪除&編輯） ===== */
function renderOrders() {
  const ul = document.getElementById('orderList')
  ul.innerHTML = ''

  orders.forEach((o, index) => {
    const li = document.createElement('li')
    li.innerHTML = `
      <div>
        ${o.name} - ${o.item}
        (${o.sugar}/${o.ice}) x${o.qty}
        ${o.note ? `<br><small>備註：${o.note}</small>` : ''}
      </div>
      <button onclick="editOrder(${index})">編輯</button>
      <button onclick="deleteOrder(${index})">刪除</button>
    `
    ul.appendChild(li)
  })
}


/* ===== 刪除訂單 ===== */
function deleteOrder(index) {
  if (!confirm('確定要刪除這筆訂單？')) return
  orders.splice(index, 1)
  saveAndRender()
}

/* ===== 統計 ===== */
function renderSummary() {
  let total = 0
  let count = {}

  orders.forEach(o => {
    total += o.qty * o.price
    count[o.item] = (count[o.item] || 0) + o.qty
  })

  document.getElementById('summary').innerHTML = `
    <p>總金額：$${total}</p>
    <p>
      ${Object.entries(count)
        .map(([item, qty]) => `${item}：${qty} 杯`)
        .join('<br>')}
    </p>
  `
}

/* ===== Excel 匯出 xlsx ===== */
document.getElementById('exportExcel').addEventListener('click', () => {
  if (orders.length === 0) {
    alert('目前沒有訂單')
    return
  }

  const data = orders.map(o => ({
    姓名: o.name,
    品項: o.item,
    甜度: o.sugar,
    冰塊: o.ice,
    數量: o.qty,
    單價: o.price,
    備註: o.note || ''
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '訂單')

  XLSX.writeFile(workbook, '點餐統計.xlsx')
})

/* ===== 編輯邏輯 ===== */
let editingIndex = null

function editOrder(index) {
  const o = orders[index]
  editingIndex = index

  document.getElementById('name').value = o.name
  document.getElementById('item').value = o.item
  document.getElementById('sugar').value = o.sugar
  document.getElementById('ice').value = o.ice
  document.getElementById('qty').value = o.qty
  document.getElementById('note').value = o.note
}


/* ===== 初次載入 ===== */
saveAndRender()
