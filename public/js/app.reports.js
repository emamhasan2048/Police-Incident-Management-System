async function renderReport(type) {
  const { data } = await api(`/reports/${type}`);
  const reportMap = {
    "company-offers": {
      headers: ["Company", "Country", "Products", "Offers", "Avg. Price"],
      rows: data.map((r) => `<tr><td><strong>${escapeHtml(r.companyName)}</strong></td><td>${escapeHtml(r.country)}</td><td>${escapeHtml(r.products.join(", "))}</td><td>${r.offerCount}</td><td>${money.format(r.averagePrice || 0)}</td></tr>`),
    },
    "product-offers": {
      headers: ["Product", "Code", "Companies", "Countries", "Offers", "Price Range"],
      rows: data.map((r) => `<tr><td><strong>${escapeHtml(r.productName)}</strong></td><td>${escapeHtml(r.productCode)}</td><td>${escapeHtml(r.companies.join(", "))}</td><td>${escapeHtml(r.countries.join(", "))}</td><td>${r.offerCount}</td><td>${money.format(r.minPrice || 0)} - ${money.format(r.maxPrice || 0)}</td></tr>`),
    },
    "country-offers": {
      headers: ["Country", "Companies", "Products", "Offers", "Avg. Price"],
      rows: data.map((r) => `<tr><td><strong>${escapeHtml(r._id)}</strong></td><td>${escapeHtml(r.companies.join(", "))}</td><td>${escapeHtml(r.products.join(", "))}</td><td>${r.offerCount}</td><td>${money.format(r.averagePrice || 0)}</td></tr>`),
    },
    competitors: {
      headers: ["Product", "Competitors", "Count"],
      rows: data.map((r) => `<tr><td><strong>${escapeHtml(r.productName)}</strong></td><td>${r.competitors.map((c) => `${escapeHtml(c.companyName)} (${escapeHtml(c.country)})`).join("<br>")}</td><td>${r.competitorCount}</td></tr>`),
    },
  };
  const report = reportMap[type];
  root.innerHTML = reportToolbar(type) + `<div id="reportTable">${table(report.headers, report.rows, "No report data found.")}</div>`;
  bindReportTools(data, `${type}-report`);
}

function reportToolbar() {
  return `
    <div class="toolbar">
      <div class="filters"><input id="reportSearch" class="form-control" placeholder="Search report" /></div>
      <div class="d-flex gap-2">
        <button id="exportReport" class="btn btn-outline-primary"><i class="bi bi-download"></i> Export CSV</button>
        <button id="printReport" class="btn btn-primary"><i class="bi bi-printer"></i> Print</button>
      </div>
    </div>`;
}

function bindReportTools(data, filename) {
  document.getElementById("printReport")?.addEventListener("click", () => window.print());
  document.getElementById("exportReport")?.addEventListener("click", () => exportCsv(filename, data));
  document.getElementById("reportSearch")?.addEventListener("input", (event) => {
    const term = event.target.value.toLowerCase();
    document.querySelectorAll("tbody tr").forEach((row) => {
      row.style.display = row.textContent.toLowerCase().includes(term) ? "" : "none";
    });
  });
}

function filterShell(id, placeholder, options, buttonText) {
  return `
    <div class="panel">
      <div class="toolbar">
        <select id="${id}" class="form-select"><option value="">${placeholder}</option>${options}</select>
        <button class="btn btn-primary" onclick="document.getElementById('${id}').dispatchEvent(new Event('change'))">${buttonText}</button>
      </div>
      <div id="filterResults"></div>
    </div>`;
}

function field(name, label, value = "", type = "text", col = "col-12", required = true) {
  return `<div class="${col}"><label class="form-label">${label}</label><input name="${name}" type="${type}" class="form-control" value="${escapeHtml(value)}" ${required ? "required" : ""} /></div>`;
}

function formData(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString();
}

function dateInput(value) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

async function removeEntity(path, reload) {
  if (!confirm("Delete this record?")) return;
  try {
    await api(path, { method: "DELETE" });
    toast("Record deleted");
    await refreshLookups();
    reload();
  } catch (error) {
    toast(error.message, "danger");
  }
}

function exportCsv(filename, rows) {
  const flatRows = rows.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([key, value]) => [key, Array.isArray(value) ? JSON.stringify(value) : value])
    )
  );
  const headers = [...new Set(flatRows.flatMap((row) => Object.keys(row)))];
  const csv = [
    headers.join(","),
    ...flatRows.map((row) =>
      headers.map((header) => `"${String(row[header] ?? "").replaceAll('"', '""')}"`).join(",")
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function debounce(fn, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
}

function showLoadError(error) {
  root.innerHTML = `<div class="alert alert-danger">${escapeHtml(error.message)}</div>`;
}

refreshLookups().catch(() => {}).finally(() => navigate("home"));
