
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

  const name = document.getElementById('name').value
  const item = document.getElementById('item').value
  const sugar = document.getElementById('sugar').value
  const ice = document.getElementById('ice').value
  const qty = Number(document.getElementById('qty').value)
  const note = document.getElementById('note').value
  const price = menu.find(m => m.name === item).price

  orders.push({ name, item, sugar, ice, qty, price, note })

  saveAndRender()
  e.target.reset()
})

/* ===== 儲存 + 重畫 ===== */
function saveAndRender() {
  localStorage.setItem('orders', JSON.stringify(orders))
  renderOrders()
  renderSummary()
}

/* ===== 訂單列表（含刪除） ===== */
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

/* ===== Excel 匯出 ===== */
document.getElementById('exportExcel').addEventListener('click', () => {
  if (orders.length === 0) {
    alert('目前沒有訂單')
    return
  }

  let csv = '姓名,品項,甜度,冰塊,數量,單價,備註\n'

  orders.forEach(o => {
    csv += `${o.name},${o.item},${o.sugar},${o.ice},${o.qty},${o.price},"${o.note}"\n`
  })

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')

  link.href = URL.createObjectURL(blob)
  link.download = 'orders.csv'
  link.click()
})

/* ===== 初次載入 ===== */
saveAndRender()
