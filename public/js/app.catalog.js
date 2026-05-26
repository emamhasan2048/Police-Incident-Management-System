async function renderProductList() {
  const search = document.getElementById("productSearch")?.value || "";
  root.innerHTML = listShell("productSearch", "Search products", "Add Product", search);
  try {
    const payload = await api(`/products?page=${state.pages.products}&limit=${PAGE_SIZE}&search=${encodeURIComponent(search)}`);
    const rows = payload.data.map((product) => `<tr>
      <td><strong>${escapeHtml(product.productName)}</strong></td>
      <td>${escapeHtml(product.productCode)}</td>
      <td>${escapeHtml(product.description)}</td>
      <td class="text-end">
        <button class="btn btn-outline-primary btn-sm action-btn" title="Edit" data-edit-product="${product._id}"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-outline-danger btn-sm action-btn" title="Delete" data-delete-product="${product._id}"><i class="bi bi-trash"></i></button>
      </td>
    </tr>`);
    root.querySelector("#listContent").innerHTML =
      table(["Product", "Code", "Description", ""], rows) + pagination("products", payload, renderProductList);
    bindProductActions();
    bindPagination(renderProductList);
    bindListToolbar("productSearch", renderProductList, () => openProductModal());
  } catch (error) {
    showLoadError(error);
  }
}

function bindProductActions() {
  document.querySelectorAll("[data-edit-product]").forEach((button) => {
    button.addEventListener("click", async () => {
      const { data } = await api(`/products/${button.dataset.editProduct}`);
      openProductModal(data);
    });
  });
  document.querySelectorAll("[data-delete-product]").forEach((button) => {
    button.addEventListener("click", () => removeEntity(`/products/${button.dataset.deleteProduct}`, renderProductList));
  });
}

function openProductModal(product = {}) {
  modalTitle.textContent = product._id ? "Edit Product" : "Add Product";
  modalBody.innerHTML = `
    <input type="hidden" name="_id" value="${product._id || ""}" />
    <div class="row g-3">
      ${field("productName", "Product Name", product.productName, "text", "col-md-6")}
      ${field("productCode", "Product Code", product.productCode, "text", "col-md-6", false)}
      <div class="col-12"><label class="form-label">Description</label><textarea name="description" class="form-control" rows="4">${escapeHtml(product.description)}</textarea></div>
    </div>`;
  entityForm.onsubmit = saveProduct;
  modal.show();
}

async function saveProduct(event) {
  event.preventDefault();
  const payload = formData(entityForm);
  const id = payload._id;
  delete payload._id;
  try {
    await api(id ? `/products/${id}` : "/products", { method: id ? "PUT" : "POST", body: JSON.stringify(payload) });
    modal.hide();
    toast("Product saved");
    await refreshLookups();
    renderProductList();
  } catch (error) {
    toast(error.message, "danger");
  }
}

async function renderOfferList() {
  await refreshLookups();
  const search = document.getElementById("offerSearch")?.value || "";
  root.innerHTML = listShell("offerSearch", "Search offers", "Add Offer", search);
  try {
    const payload = await api(`/offers?page=${state.pages.offers}&limit=${PAGE_SIZE}&search=${encodeURIComponent(search)}`);
    const rows = offerRows(payload.data, true);
    root.querySelector("#listContent").innerHTML =
      table(["Company", "Product", "Country", "Price", "Terms", "Notes", ""], rows) + pagination("offers", payload, renderOfferList);
    bindOfferActions();
    bindPagination(renderOfferList);
    bindListToolbar("offerSearch", renderOfferList, () => openOfferModal());
  } catch (error) {
    showLoadError(error);
  }
}

function offerRows(offers, actions = false) {
  return offers.map((offer) => `<tr>
    <td><strong>${escapeHtml(offer.company?.companyName)}</strong></td>
    <td>${escapeHtml(offer.product?.productName)}</td>
    <td><span class="badge-soft">${escapeHtml(offer.company?.country)}</span></td>
    <td>${money.format(offer.price || 0)}</td>
    <td>${escapeHtml(offer.salesTerms)}</td>
    <td>${escapeHtml(offer.notes)}</td>
    ${actions ? `<td class="text-end">
      <button class="btn btn-outline-primary btn-sm action-btn" title="Edit" data-edit-offer="${offer._id}"><i class="bi bi-pencil"></i></button>
      <button class="btn btn-outline-danger btn-sm action-btn" title="Delete" data-delete-offer="${offer._id}"><i class="bi bi-trash"></i></button>
    </td>` : ""}
  </tr>`);
}

function bindOfferActions() {
  document.querySelectorAll("[data-edit-offer]").forEach((button) => {
    button.addEventListener("click", async () => {
      const { data } = await api(`/offers/${button.dataset.editOffer}`);
      openOfferModal(data);
    });
  });
  document.querySelectorAll("[data-delete-offer]").forEach((button) => {
    button.addEventListener("click", () => removeEntity(`/offers/${button.dataset.deleteOffer}`, renderOfferList));
  });
}

function openOfferModal(offer = {}) {
  modalTitle.textContent = offer._id ? "Edit Offer" : "Add Offer";
  modalBody.innerHTML = `
    <input type="hidden" name="_id" value="${offer._id || ""}" />
    <div class="row g-3">
      <div class="col-md-6"><label class="form-label">Company</label><select name="company" class="form-select" required><option value="">Choose company</option>${optionList(state.companies, "_id", "companyName", offer.company?._id || offer.company)}</select></div>
      <div class="col-md-6"><label class="form-label">Product</label><select name="product" class="form-select" required><option value="">Choose product</option>${optionList(state.products, "_id", "productName", offer.product?._id || offer.product)}</select></div>
      ${field("price", "Price", offer.price, "number", "col-md-4")}
      ${field("salesTerms", "Sales Terms", offer.salesTerms, "text", "col-md-8")}
      <div class="col-12"><label class="form-label">Notes</label><textarea name="notes" class="form-control" rows="4">${escapeHtml(offer.notes)}</textarea></div>
    </div>`;
  entityForm.onsubmit = saveOffer;
  modal.show();
}

async function saveOffer(event) {
  event.preventDefault();
  const payload = formData(entityForm);
  const id = payload._id;
  delete payload._id;
  payload.price = Number(payload.price);
  try {
    await api(id ? `/offers/${id}` : "/offers", { method: id ? "PUT" : "POST", body: JSON.stringify(payload) });
    modal.hide();
    toast("Offer saved");
    renderOfferList();
  } catch (error) {
    toast(error.message, "danger");
  }
}

async function renderProductsByCompany() {
  await refreshLookups();
  root.innerHTML = filterShell("companyFilter", "Choose company", optionList(state.companies, "_id", "companyName"), "Load");
  const load = async () => {
    const id = document.getElementById("companyFilter").value;
    const { data } = await api(`/products/by-company?companyId=${id}`);
    document.getElementById("filterResults").innerHTML = table(["Company", "Product", "Code", "Price", "Terms"], data.map((o) => `<tr><td>${escapeHtml(o.company?.companyName)}</td><td><strong>${escapeHtml(o.product?.productName)}</strong></td><td>${escapeHtml(o.product?.productCode)}</td><td>${money.format(o.price || 0)}</td><td>${escapeHtml(o.salesTerms)}</td></tr>`));
  };
  document.getElementById("companyFilter").addEventListener("change", load);
  load();
}

async function renderProductOffers() {
  await refreshLookups();
  root.innerHTML = filterShell("productFilter", "Choose product", optionList(state.products, "_id", "productName"), "Load");
  const load = async () => {
    const id = document.getElementById("productFilter").value;
    const { data } = await api(`/products/offers?productId=${id}`);
    document.getElementById("filterResults").innerHTML = table(["Product", "Company", "Country", "Price", "Terms"], data.map((o) => `<tr><td><strong>${escapeHtml(o.product?.productName)}</strong></td><td>${escapeHtml(o.company?.companyName)}</td><td>${escapeHtml(o.company?.country)}</td><td>${money.format(o.price || 0)}</td><td>${escapeHtml(o.salesTerms)}</td></tr>`));
  };
  document.getElementById("productFilter").addEventListener("change", load);
  load();
}

async function renderOffersByProduct() {
  await refreshLookups();
  root.innerHTML = filterShell("productFilter", "Choose product", optionList(state.products, "_id", "productName"), "Load");
  const load = async () => {
    const id = document.getElementById("productFilter").value;
    const { data } = await api(`/offers/by-product?productId=${id}`);
    document.getElementById("filterResults").innerHTML = table(["Company", "Product", "Country", "Price", "Terms", "Notes"], offerRows(data));
  };
  document.getElementById("productFilter").addEventListener("change", load);
  load();
}

async function renderOffersByCountry() {
  root.innerHTML = filterShell("countryFilter", "Choose country", countryOptions(), "Load");
  const load = async () => {
    const country = document.getElementById("countryFilter").value;
    const { data } = await api(`/offers/by-country?country=${encodeURIComponent(country)}`);
    document.getElementById("filterResults").innerHTML = table(["Company", "Product", "Country", "Price", "Terms", "Notes"], data.map((o) => `<tr><td><strong>${escapeHtml(o.company?.companyName)}</strong></td><td>${escapeHtml(o.product?.productName)}</td><td>${escapeHtml(o.company?.country)}</td><td>${money.format(o.price || 0)}</td><td>${escapeHtml(o.salesTerms)}</td><td>${escapeHtml(o.notes)}</td></tr>`));
  };
  document.getElementById("countryFilter").addEventListener("change", load);
  load();
}

async function renderSalesTerms() {
  const { data } = await api("/offers?limit=100");
  root.innerHTML = table(["Company", "Product", "Sales Terms", "Notes"], data.map((o) => `<tr><td>${escapeHtml(o.company?.companyName)}</td><td>${escapeHtml(o.product?.productName)}</td><td><strong>${escapeHtml(o.salesTerms)}</strong></td><td>${escapeHtml(o.notes)}</td></tr>`));
}

async function renderCompetitors() {
  const { data } = await api("/reports/competitors");
  root.innerHTML = reportToolbar("competitorExport") + table(["Product", "Competitors", "Count"], data.map((row) => `<tr><td><strong>${escapeHtml(row.productName)}</strong></td><td>${row.competitors.map((c) => `${escapeHtml(c.companyName)} (${escapeHtml(c.country)})`).join("<br>")}</td><td>${row.competitorCount}</td></tr>`), "No competing suppliers yet.");
  bindReportTools(data, "competitors-report");
}

async function renderCompetitorsByProduct() {
  await refreshLookups();
  root.innerHTML = filterShell("productFilter", "Choose product", optionList(state.products, "_id", "productName"), "Load");
  const load = async () => {
    const id = document.getElementById("productFilter").value;
    const { data } = await api(`/queries/products/${id}/competitors`);
    document.getElementById("filterResults").innerHTML = table(["Company", "Country", "Product", "Price", "Terms"], data.map((o) => `<tr><td><strong>${escapeHtml(o.company?.companyName)}</strong></td><td>${escapeHtml(o.company?.country)}</td><td>${escapeHtml(o.product?.productName)}</td><td>${money.format(o.price || 0)}</td><td>${escapeHtml(o.salesTerms)}</td></tr>`), "No competitors for this product.");
  };
  document.getElementById("productFilter").addEventListener("change", load);
  load();
}
