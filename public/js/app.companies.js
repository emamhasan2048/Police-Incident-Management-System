async function renderCompanyList() {
  const search = document.getElementById("companySearch")?.value || "";
  root.innerHTML = listShell("companySearch", "Search companies", "Add Company", search);
  try {
    const payload = await api(`/companies?page=${state.pages.companies}&limit=${PAGE_SIZE}&search=${encodeURIComponent(search)}`);
    const rows = payload.data.map(
      (company) => `<tr>
        <td><strong>${escapeHtml(company.companyName)}</strong></td>
        <td>${escapeHtml(company.country)}</td>
        <td>${escapeHtml(company.city)}</td>
        <td>${escapeHtml(company.street)} ${escapeHtml(company.houseNumber)}</td>
        <td>${formatDate(company.registrationDate)}</td>
        <td>${escapeHtml(company.managerSurname)}</td>
        <td class="text-end">
          <button class="btn btn-outline-primary btn-sm action-btn" title="Edit" data-edit-company="${company._id}"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-outline-danger btn-sm action-btn" title="Delete" data-delete-company="${company._id}"><i class="bi bi-trash"></i></button>
        </td>
      </tr>`
    );
    root.querySelector("#listContent").innerHTML =
      table(["Company", "Country", "City", "Address", "Registered", "Manager", ""], rows) +
      pagination("companies", payload, renderCompanyList);
    bindCompanyActions();
    bindPagination(renderCompanyList);
    bindListToolbar("companySearch", renderCompanyList, () => openCompanyModal());
  } catch (error) {
    showLoadError(error);
  }
}

function listShell(searchId, placeholder, buttonLabel, value = "") {
  return `
    <div class="toolbar">
      <div class="filters">
        <input id="${searchId}" class="form-control" placeholder="${placeholder}" value="${escapeHtml(value)}" />
      </div>
      <button id="addEntity" class="btn btn-primary"><i class="bi bi-plus-lg"></i> ${buttonLabel}</button>
    </div>
    <div id="listContent"></div>`;
}

function bindListToolbar(inputId, reload, addHandler) {
  document.getElementById(inputId).addEventListener("input", debounce(() => {
    state.pages.companies = 1;
    state.pages.products = 1;
    state.pages.offers = 1;
    reload();
  }, 300));
  document.getElementById("addEntity").addEventListener("click", addHandler);
}

function bindCompanyActions() {
  document.querySelectorAll("[data-edit-company]").forEach((button) => {
    button.addEventListener("click", async () => {
      const { data } = await api(`/companies/${button.dataset.editCompany}`);
      openCompanyModal(data);
    });
  });
  document.querySelectorAll("[data-delete-company]").forEach((button) => {
    button.addEventListener("click", () => removeEntity(`/companies/${button.dataset.deleteCompany}`, renderCompanyList));
  });
}

function openCompanyModal(company = {}) {
  modalTitle.textContent = company._id ? "Edit Company" : "Add Company";
  modalBody.innerHTML = `
    <input type="hidden" name="_id" value="${company._id || ""}" />
    <div class="row g-3">
      ${field("companyName", "Company Name", company.companyName, "text", "col-md-6")}
      <div class="col-md-6"><label class="form-label">Country</label><select name="country" id="countrySelect" class="form-select" required><option value="">Choose country</option>${countryOptions(company.country)}</select></div>
      <div class="col-md-6"><label class="form-label">City</label><select name="city" id="citySelect" class="form-select" required></select></div>
      <div class="col-md-6"><label class="form-label">Street</label><select name="street" id="streetSelect" class="form-select" required></select></div>
      ${field("houseNumber", "House Number", company.houseNumber, "text", "col-md-4")}
      ${field("registrationDate", "Company Registration Date", dateInput(company.registrationDate), "date", "col-md-4")}
      ${field("managerSurname", "Manager Surname", company.managerSurname, "text", "col-md-4")}
    </div>`;
  setupDependentDropdowns(company);
  entityForm.onsubmit = (event) => saveCompany(event);
  modal.show();
}

function setupDependentDropdowns(company = {}) {
  const country = document.getElementById("countrySelect");
  const city = document.getElementById("citySelect");
  const street = document.getElementById("streetSelect");

  const refreshCities = () => {
    const cities = Object.keys(locationData[country.value] || {});
    city.innerHTML = `<option value="">Choose city</option>${cities.map((item) => `<option ${item === company.city ? "selected" : ""}>${item}</option>`).join("")}`;
    refreshStreets();
  };

  const refreshStreets = () => {
    const streets = (locationData[country.value] || {})[city.value] || [];
    street.innerHTML = `<option value="">Choose street</option>${streets.map((item) => `<option ${item === company.street ? "selected" : ""}>${item}</option>`).join("")}`;
  };

  country.addEventListener("change", refreshCities);
  city.addEventListener("change", refreshStreets);
  refreshCities();
}

async function saveCompany(event) {
  event.preventDefault();
  const payload = formData(entityForm);
  const id = payload._id;
  delete payload._id;
  try {
    await api(id ? `/companies/${id}` : "/companies", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(payload),
    });
    modal.hide();
    toast("Company saved");
    renderCompanyList();
  } catch (error) {
    toast(error.message, "danger");
  }
}

async function renderCompanyDetails() {
  root.innerHTML = `
    <div class="panel">
      <div class="toolbar">
        <input id="detailSearch" class="form-control" placeholder="Search by partial company name" />
      </div>
      <div id="detailResults"></div>
    </div>`;
  const load = async () => {
    const q = document.getElementById("detailSearch").value;
    const { data } = await api(`/companies/details/search?q=${encodeURIComponent(q)}`);
    document.getElementById("detailResults").innerHTML = table(
      ["Company", "Country", "City", "Street", "House No.", "Registered", "Manager"],
      data.map((c) => `<tr><td><strong>${escapeHtml(c.companyName)}</strong></td><td>${escapeHtml(c.country)}</td><td>${escapeHtml(c.city)}</td><td>${escapeHtml(c.street)}</td><td>${escapeHtml(c.houseNumber)}</td><td>${formatDate(c.registrationDate)}</td><td>${escapeHtml(c.managerSurname)}</td></tr>`),
      "No matching companies."
    );
  };
  document.getElementById("detailSearch").addEventListener("input", debounce(load, 250));
  load();
}

async function renderCompaniesByCountry() {
  root.innerHTML = filterShell("countryFilter", "Choose country", countryOptions(), "Filter");
  const load = async () => {
    const country = document.getElementById("countryFilter").value;
    const { data } = await api(`/companies/by-country?country=${encodeURIComponent(country)}`);
    document.getElementById("filterResults").innerHTML = table(
      ["Company", "City", "Address", "Manager"],
      data.map((c) => `<tr><td><strong>${escapeHtml(c.companyName)}</strong></td><td>${escapeHtml(c.city)}</td><td>${escapeHtml(c.street)} ${escapeHtml(c.houseNumber)}</td><td>${escapeHtml(c.managerSurname)}</td></tr>`),
      "No companies for this country."
    );
  };
  document.getElementById("countryFilter").addEventListener("change", load);
  load();
}
