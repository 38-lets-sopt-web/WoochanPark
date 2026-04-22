import './data.js';

const STORAGE_KEY = 'expenseData';

let expenseList = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let checkedIds = [];

const filterTitleEl = document.getElementById('filter-title');
const filterDateEl = document.getElementById('filter-date');
const filterCategoryEl = document.getElementById('filter-category');
const filterPaymentEl = document.getElementById('filter-payment');
const searchBtn = document.getElementById('search-btn');
const resetBtn = document.getElementById('reset-btn');

const sortSelect = document.getElementById('sort-select');
const deleteBtn = document.getElementById('delete-btn');
const addBtn = document.getElementById('add-btn');
const checkAllEl = document.getElementById('check-all');
const tbody = document.getElementById('expense-tbody');
const totalAmountEl = document.getElementById('total-amount');

const refreshBtn = document.getElementById('refresh-btn');

const addModal = document.getElementById('add-modal');
const detailModal = document.getElementById('detail-modal');
const addForm = document.getElementById('add-form');
const detailContent = document.getElementById('detail-content');

let appliedFilter = { title: '', date: '', category: '', payment: '' };

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenseList));
}

function formatAmount(amount) {
  const sign = amount >= 0 ? '+' : '-';
  const absValue = Math.abs(amount).toLocaleString();
  return `${sign}${absValue}원`;
}

function getFilteredList() {
  return expenseList.filter((item) => {
    if (appliedFilter.title && !item.title.includes(appliedFilter.title)) return false;
    if (appliedFilter.date && item.date !== appliedFilter.date) return false;
    if (appliedFilter.category && item.category !== appliedFilter.category) return false;
    if (appliedFilter.payment && item.payment !== appliedFilter.payment) return false;
    return true;
  });
}

function getSortedList(list) {
  const sorted = [...list];
  if (sortSelect.value === 'date-asc') {
    sorted.sort((a, b) => a.date.localeCompare(b.date));
  } else {
    sorted.sort((a, b) => b.date.localeCompare(a.date));
  }
  return sorted;
}

function renderTable() {
  const filtered = getFilteredList();
  const sorted = getSortedList(filtered);

  tbody.innerHTML = '';

  if (sorted.length === 0) {
    const emptyRow = document.createElement('tr');
    emptyRow.className = 'empty-row';
    emptyRow.innerHTML = '<td colspan="6">내역이 없습니다.</td>';
    tbody.appendChild(emptyRow);
  } else {
    sorted.forEach((item) => {
      const tr = document.createElement('tr');
      const amountClass = item.amount > 0 ? 'amount-plus' : 'amount-minus';
      const isChecked = checkedIds.includes(item.id) ? 'checked' : '';

      tr.innerHTML = `
        <td><input type="checkbox" class="row-check" data-id="${item.id}" ${isChecked}></td>
        <td><span class="title-cell" data-id="${item.id}">${item.title}</span></td>
        <td>${item.date}</td>
        <td>${item.category}</td>
        <td>${item.payment}</td>
        <td class="amount-cell ${amountClass}">${formatAmount(item.amount)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  const totalSum = sorted.reduce((sum, item) => sum + item.amount, 0);
  totalAmountEl.textContent = formatAmount(totalSum);
  totalAmountEl.className = 'total-amount ' + (totalSum >= 0 ? 'amount-plus' : 'amount-minus');

  updateCheckAllState();
}

function updateCheckAllState() {
  const rowChecks = tbody.querySelectorAll('.row-check');
  if (rowChecks.length === 0) {
    checkAllEl.checked = false;
    return;
  }
  const allChecked = Array.from(rowChecks).every((el) => el.checked);
  checkAllEl.checked = allChecked;
}

searchBtn.addEventListener('click', () => {
  appliedFilter = {
    title: filterTitleEl.value.trim(),
    date: filterDateEl.value,
    category: filterCategoryEl.value,
    payment: filterPaymentEl.value,
  };
  checkedIds = [];
  renderTable();
});

resetBtn.addEventListener('click', () => {
  filterTitleEl.value = '';
  filterDateEl.value = '';
  filterCategoryEl.value = '';
  filterPaymentEl.value = '';
  appliedFilter = { title: '', date: '', category: '', payment: '' };
  checkedIds = [];
  renderTable();
});

sortSelect.addEventListener('change', renderTable);

tbody.addEventListener('change', (e) => {
  if (!e.target.classList.contains('row-check')) return;
  const id = Number(e.target.dataset.id);
  if (e.target.checked) {
    if (!checkedIds.includes(id)) checkedIds.push(id);
  } else {
    checkedIds = checkedIds.filter((x) => x !== id);
  }
  updateCheckAllState();
});

checkAllEl.addEventListener('change', () => {
  const rowChecks = tbody.querySelectorAll('.row-check');
  rowChecks.forEach((el) => {
    el.checked = checkAllEl.checked;
    const id = Number(el.dataset.id);
    if (checkAllEl.checked) {
      if (!checkedIds.includes(id)) checkedIds.push(id);
    } else {
      checkedIds = checkedIds.filter((x) => x !== id);
    }
  });
});

deleteBtn.addEventListener('click', () => {
  if (checkedIds.length === 0) {
    alert('삭제할 항목을 선택해주세요.');
    return;
  }
  expenseList = expenseList.filter((item) => !checkedIds.includes(item.id));
  checkedIds = [];
  saveData();
  renderTable();
});

addBtn.addEventListener('click', () => {
  addForm.reset();
  addModal.classList.add('open');
});

addForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('add-title').value.trim();
  const type = document.getElementById('add-type').value;
  const amountValue = document.getElementById('add-amount').value;
  const date = document.getElementById('add-date').value;
  const category = document.getElementById('add-category').value;
  const payment = document.getElementById('add-payment').value;

  if (!title || !type || amountValue === '' || !date || !category || !payment) {
    alert('모든 항목을 입력해주세요.');
    return;
  }

  const absAmount = Math.abs(Number(amountValue));
  const signedAmount = type === 'expense' ? -absAmount : absAmount;

  const newItem = {
    id: Date.now(),
    title: title,
    date: date,
    category: category,
    payment: payment,
    amount: signedAmount,
  };

  expenseList.push(newItem);
  saveData();
  addModal.classList.remove('open');
  renderTable();
});

tbody.addEventListener('click', (e) => {
  if (!e.target.classList.contains('title-cell')) return;
  const id = Number(e.target.dataset.id);
  const item = expenseList.find((exp) => exp.id === id);
  if (!item) return;

  detailContent.innerHTML = `
    <div class="detail-item"><dt>제목</dt><dd>${item.title}</dd></div>
    <div class="detail-item"><dt>금액</dt><dd>${formatAmount(item.amount)}</dd></div>
    <div class="detail-item"><dt>날짜</dt><dd>${item.date}</dd></div>
    <div class="detail-item"><dt>카테고리</dt><dd>${item.category}</dd></div>
    <div class="detail-item"><dt>결제수단</dt><dd>${item.payment}</dd></div>
  `;
  detailModal.classList.add('open');
});

document.getElementById('add-modal-close').addEventListener('click', () => {
  addModal.classList.remove('open');
});

document.getElementById('detail-modal-close').addEventListener('click', () => {
  detailModal.classList.remove('open');
});

addModal.addEventListener('click', (e) => {
  if (e.target === addModal) {
    addModal.classList.remove('open');
  }
});

detailModal.addEventListener('click', (e) => {
  if (e.target === detailModal) {
    detailModal.classList.remove('open');
  }
});

refreshBtn.addEventListener('click', () => {
  location.reload();
});

renderTable();
