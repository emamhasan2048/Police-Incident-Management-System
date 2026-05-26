function render() {
  const renderer = {
    home: renderHome,
    "company-list": renderCompanyList,
    "company-details": renderCompanyDetails,
    "companies-country": renderCompaniesByCountry,
    "product-list": renderProductList,
    "products-company": renderProductsByCompany,
    "product-offers": renderProductOffers,
    "offer-list": renderOfferList,
    "offers-product": renderOffersByProduct,
    "offers-country": renderOffersByCountry,
    "sales-terms": renderSalesTerms,
    competitors: renderCompetitors,
    "competitors-product": renderCompetitorsByProduct,
    "report-company": () => renderReport("company-offers"),
    "report-product": () => renderReport("product-offers"),
    "report-country": () => renderReport("country-offers"),
    "report-competitor": () => renderReport("competitors"),
  }[state.view];
  renderer();
}

async function renderHome() {
  root.innerHTML = `<div class="empty-state"><div class="spinner-border text-primary"></div></div>`;
  try {
    const { data } = await api("/reports/dashboard");
    root.innerHTML = `
      <div class="stat-grid mb-4">
        ${statCard("bi-buildings", data.companies, "Companies")}
        ${statCard("bi-box-seam", data.products, "Products")}
        ${statCard("bi-tags", data.offers, "Offers")}
        ${statCard("bi-geo-alt", data.countries, "Countries")}
      </div>
      <div class="panel">
        <h2 class="panel-title">Recent Offers</h2>
        ${table(
          ["Company", "Country", "Product", "Price", "Terms"],
          data.recentOffers.map(
            (offer) => `<tr>
              <td>${escapeHtml(offer.company?.companyName)}</td>
              <td><span class="badge-soft">${escapeHtml(offer.company?.country)}</span></td>
              <td>${escapeHtml(offer.product?.productName)}</td>
              <td>${money.format(offer.price || 0)}</td>
              <td>${escapeHtml(offer.salesTerms)}</td>
            </tr>`
          ),
          "No offers yet."
        )}
      </div>`;
  } catch (error) {
    showLoadError(error);
  }
}

function statCard(icon, value, label) {
  return `<div class="stat-card"><span class="icon"><i class="bi ${icon}"></i></span><div><div class="value">${value}</div><div class="label">${label}</div></div></div>`;
}

