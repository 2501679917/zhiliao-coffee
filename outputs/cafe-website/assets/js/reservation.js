const messages = {
  name: '请填写称呼。', phone: '请填写 7–20 位有效电话号码。',
  date: '请选择今天或之后的日期。', time: '预约时间需在 11:00–18:30 之间。', guests: '人数需为 1–20 人。',
};

function validate(data) {
  const errors = {};
  if (!data.name.trim()) errors.name = messages.name;
  if (!/^[0-9+()\s-]{7,20}$/.test(data.phone.trim())) errors.phone = messages.phone;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const date = new Date(`${data.date}T00:00:00`);
  if (!data.date || Number.isNaN(date.valueOf()) || date < today) errors.date = messages.date;
  if (!data.time || data.time < '11:00' || data.time > '18:30') errors.time = messages.time;
  if (!Number.isInteger(Number(data.guests)) || Number(data.guests) < 1 || Number(data.guests) > 20) errors.guests = messages.guests;
  return errors;
}

export function initReservationForm(form) {
  if (!form) return;
  const status = document.querySelector('#reservation-status');
  const submit = form.querySelector('[type="submit"]');
  const dateInput = form.elements.date;
  dateInput.min = new Date().toLocaleDateString('en-CA');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const errors = validate(data);
    form.querySelectorAll('[data-error-for]').forEach((node) => { node.textContent = errors[node.dataset.errorFor] || ''; });
    if (Object.keys(errors).length) { status.textContent = '请检查标出的信息。'; status.className = 'form-status error'; return; }
    submit.disabled = true; submit.firstChild.textContent = '正在提交 '; status.textContent = '';
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch('/api/reservations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, guests: Number(data.guests) }), signal: controller.signal });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.detail || '预约尚未提交成功，请稍后重试。');
      status.textContent = `已收到 ${data.name} 的预约，我们会尽快确认。`;
      status.className = 'form-status success'; form.reset(); dateInput.min = new Date().toLocaleDateString('en-CA');
    } catch (error) {
      status.textContent = error.name === 'AbortError' ? '连接超时，预约尚未成功，请稍后重试。' : (error.message || '网络异常，预约尚未成功。');
      status.className = 'form-status error';
    } finally { clearTimeout(timer); submit.disabled = false; submit.firstChild.textContent = '提交预约 '; }
  });
}
