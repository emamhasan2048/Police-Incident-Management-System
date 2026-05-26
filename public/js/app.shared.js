const API = "/api";
const PAGE_SIZE = 8;

const locationData = {
  Germany: {
    Berlin: ["Friedrichstrasse", "Unter den Linden", "Kurfurstendamm"],
    Hamburg: ["Reeperbahn", "Jungfernstieg", "Monckebergstrasse"],
    Munich: ["Leopoldstrasse", "Maximilianstrasse", "Sendlinger Strasse"],
  },
  China: {
    Shanghai: ["Nanjing Road", "Huaihai Road", "Xizang Road"],
    Shenzhen: ["Shennan Avenue", "Huaqiang Road", "Nanshan Avenue"],
    Guangzhou: ["Beijing Road", "Tianhe Road", "Zhongshan Avenue"],
  },
  Japan: {
    Tokyo: ["Chuo Dori", "Meiji Dori", "Yasukuni Dori"],
    Osaka: ["Midosuji", "Sakaisuji", "Sennichimae"],
    Yokohama: ["Minato Mirai", "Bashamichi", "Kannai"],
  },
  "United States": {
    "New York": ["Broadway", "Madison Avenue", "Wall Street"],
    Chicago: ["Michigan Avenue", "Wacker Drive", "State Street"],
    Houston: ["Main Street", "Westheimer Road", "Kirby Drive"],
  },
  Italy: {
    Milan: ["Via Torino", "Corso Buenos Aires", "Via Manzoni"],
    Rome: ["Via del Corso", "Via Veneto", "Via Nazionale"],
    Turin: ["Via Roma", "Corso Francia", "Via Po"],
  },
  India: {
    Mumbai: ["Marine Drive", "Linking Road", "MG Road"],
    Delhi: ["Janpath", "Connaught Place", "Ring Road"],
    Chennai: ["Anna Salai", "Mount Road", "Cathedral Road"],
  },
};

const state = {
  view: "home",
  companies: [],
  products: [],
  countries: Object.keys(locationData),
  pages: {
    companies: 1,
    products: 1,
    offers: 1,
  },
};

const viewMeta = {
  home: ["Dashboard", "At-a-glance supplier intelligence and recent offers."],
  "company-list": ["Company List", "Create, edit, delete, search, and paginate supplier companies."],
  "company-details": ["Company Details", "Search companies by partial name and view complete records."],
  "companies-country": ["Companies by Country", "Filter registered suppliers by country."],
  "product-list": ["Product List", "Maintain product catalog records."],
  "products-company": ["Products by Company", "Answer which products a company offers."],
  "product-offers": ["Product Offers", "Review all offers attached to selected products."],
  "offer-list": ["Offer List", "Create and manage supplier product offers."],
  "offers-product": ["Offers by Product", "Find companies offering a selected product."],
  "offers-country": ["Offers by Country", "Review offers from companies in a specific country."],
  "sales-terms": ["Sales Terms", "Scan offer terms and commercial notes."],
  competitors: ["Competitor List", "Companies selling the same product are treated as competitors."],
  "competitors-product": ["Competitors by Product", "Compare suppliers for one product."],
  "report-company": ["Company Offers Report", "Grouped report of products and offers per company."],
  "report-product": ["Product Offers Report", "Grouped report of companies and price range per product."],
  "report-country": ["Country Offers Report", "Grouped report of offers by supplier country."],
  "report-competitor": ["Competitor Report", "Competitive landscape by product."],
};

const root = document.getElementById("viewRoot");
const alerts = document.getElementById("alerts");
const sidebar = document.getElementById("sidebar");
const modal = new bootstrap.Modal(document.getElementById("entityModal"));
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const entityForm = document.getElementById("entityForm");

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

document.getElementById("sidebarToggle").addEventListener("click", () => {
  if (window.innerWidth <= 992) sidebar.classList.toggle("open");
  else sidebar.classList.toggle("collapsed");
});

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => navigate(button.dataset.view));
});

async function api(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || "Request failed");
  return payload;
}

function toast(message, type = "success") {
  const item = document.createElement("div");
  item.className = `alert alert-${type} shadow-sm`;
  item.textContent = message;
  alerts.appendChild(item);
  setTimeout(() => item.remove(), 4200);
}

function navigate(view) {
  state.view = view;
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
  sidebar.classList.remove("open");
  const [title, subtitle] = viewMeta[view] || viewMeta.home;
  document.getElementById("pageTitle").textContent = title;
  document.getElementById("pageSubtitle").textContent = subtitle;
  render();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function table(headers, rows, empty = "No records found.") {
  if (!rows.length) {
    return `<div class="table-panel empty-state"><div><i class="bi bi-inbox fs-2"></i><p class="mt-2">${empty}</p></div></div>`;
  }
  return `
    <div class="table-panel">
      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead>
          <tbody>${rows.join("")}</tbody>
        </table>
      </div>
    </div>`;
}

function pagination(entity, payload) {
  const page = payload.page || 1;
  const pages = Math.max(payload.pages || 1, 1);
  return `
    <div class="pagination-bar">
      <span class="text-muted">Page ${page} of ${pages} • ${payload.total || 0} records</span>
      <div class="btn-group">
        <button class="btn btn-outline-primary btn-sm" ${page <= 1 ? "disabled" : ""} data-page="${entity}" data-target-page="${page - 1}">
          <i class="bi bi-chevron-left"></i>
        </button>
        <button class="btn btn-outline-primary btn-sm" ${page >= pages ? "disabled" : ""} data-page="${entity}" data-target-page="${page + 1}">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>`;
}

function bindPagination(reload) {
  document.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => {
      state.pages[button.dataset.page] = Number(button.dataset.targetPage);
      reload();
    });
  });
}

async function refreshLookups() {
  const [companies, products] = await Promise.all([
    api("/companies?limit=100"),
    api("/products?limit=100"),
  ]);
  state.companies = companies.data;
  state.products = products.data;
}

function optionList(items, valueKey = "_id", labelKey = "name", selected = "") {
  return items
    .map((item) => {
      const value = item[valueKey];
      const label = item[labelKey];
      return `<option value="${escapeHtml(value)}" ${value === selected ? "selected" : ""}>${escapeHtml(label)}</option>`;
    })
    .join("");
}

function countryOptions(selected = "") {
  return state.countries
    .map((country) => `<option value="${country}" ${country === selected ? "selected" : ""}>${country}</option>`)
    .join("");
}
