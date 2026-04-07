/**
 * Search / Home: Add to basket buttons, floating basket trigger, sidebar.
 * Basket in sessionStorage; "Compare prices" posts to /basket.
 * Sidebar shows total per store and highlights cheapest.
 */
(function () {
    var STORAGE_KEY = "search_basket_items";
    var sidebar = document.getElementById("basket-sidebar");
    var backdrop = document.getElementById("basket-sidebar-backdrop");
    var listEl = document.getElementById("basket-sidebar-list");
    var totalEl = document.getElementById("basket-sidebar-total");
    var totalsBlock = document.getElementById("basket-sidebar-totals");
    var totalsRows = document.getElementById("basket-sidebar-totals-rows");
    var compareForm = document.getElementById("basket-sidebar-form");
    var itemsInput = document.getElementById("basket-sidebar-items-input");
    var closeBtn = document.getElementById("basket-sidebar-close");
    var triggerBtn = document.getElementById("basket-trigger");
    var triggerCountEl = document.getElementById("basket-trigger-count");

    function getBasket() {
        try {
            var raw = sessionStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function setBasket(items) {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (e) {}
        renderSidebar();
        updateTriggerCount();
    }

    function updateTriggerCount() {
        if (!triggerCountEl) return;
        var items = getBasket();
        var n = items.length;
        triggerCountEl.textContent = n;
        if (triggerBtn) {
            if (n > 0) {
                triggerBtn.classList.add("has-items");
                triggerCountEl.style.display = "";
            } else {
                triggerBtn.classList.remove("has-items");
                triggerCountEl.style.display = "none";
            }
        }
    }

    function openSidebar() {
        if (sidebar) {
            sidebar.hidden = false;
            if (backdrop) backdrop.hidden = false;
        }
    }

    function closeSidebar() {
        if (sidebar) sidebar.hidden = true;
        if (backdrop) backdrop.hidden = true;
    }

    function addToBasket(productId, retailerId, retailerName, title, price, url) {
        var items = getBasket();
        items.push({
            product_id: productId,
            retailer_id: retailerId,
            retailer_name: retailerName,
            title: title,
            price: price,
            url: url || ""
        });
        setBasket(items);
        openSidebar();
    }

    function removeFromBasket(index) {
        var items = getBasket();
        items.splice(index, 1);
        setBasket(items);
        if (items.length === 0) closeSidebar();
    }

    function escapeHtml(s) {
        var div = document.createElement("div");
        div.textContent = s;
        return div.innerHTML;
    }

    function renderSidebar() {
        var items = getBasket();
        if (!listEl) return;

        listEl.innerHTML = "";
        var grandTotal = 0;
        var byStore = {};

        items.forEach(function (item, i) {
            grandTotal += item.price;
            var rid = item.retailer_id || "other";
            if (!byStore[rid]) byStore[rid] = { name: item.retailer_name || rid, total: 0 };
            byStore[rid].total += item.price;

            var li = document.createElement("li");
            li.className = "basket-sidebar-item";
            li.innerHTML =
                "<span class=\"basket-sidebar-item-title\">" + escapeHtml(item.title) + "</span>" +
                "<span class=\"basket-sidebar-item-meta\">" + escapeHtml(item.retailer_name) + " · €" + item.price.toFixed(2) + "</span>" +
                "<button type=\"button\" class=\"basket-sidebar-item-remove\" data-index=\"" + i + "\" aria-label=\"Remove\">×</button>";
            listEl.appendChild(li);
        });

        listEl.querySelectorAll(".basket-sidebar-item-remove").forEach(function (btn) {
            btn.addEventListener("click", function () {
                var idx = parseInt(this.getAttribute("data-index"), 10);
                if (!isNaN(idx)) removeFromBasket(idx);
            });
        });

        if (totalEl) {
            if (items.length === 0) {
                totalEl.textContent = "";
            } else {
                totalEl.textContent = "Total: €" + grandTotal.toFixed(2) + " (" + items.length + " item" + (items.length !== 1 ? "s" : "") + ")";
            }
        }

        if (totalsBlock && totalsRows) {
            if (Object.keys(byStore).length > 0) {
                totalsBlock.hidden = false;
                var storeTotals = Object.keys(byStore).map(function (rid) {
                    return { id: rid, name: byStore[rid].name, total: byStore[rid].total };
                });
                var minTotal = Math.min.apply(null, storeTotals.map(function (s) { return s.total; }));
                totalsRows.innerHTML = storeTotals.map(function (s) {
                    var isCheapest = s.total === minTotal;
                    return "<div class=\"basket-sidebar-total-row" + (isCheapest ? " cheapest" : "") + "\">" +
                        "<span class=\"store-name\">" + escapeHtml(s.name) + "</span>" +
                        "<span class=\"store-total\">€" + s.total.toFixed(2) + "</span>" +
                        "</div>";
                }).join("");
            } else {
                totalsBlock.hidden = true;
            }
        }

        if (compareForm && itemsInput && items.length > 0) {
            itemsInput.value = items.map(function (it) { return it.title; }).join("\n");
        }
    }

    document.querySelectorAll(".product-add-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            var id = this.getAttribute("data-product-id");
            var rid = this.getAttribute("data-retailer-id");
            var rname = this.getAttribute("data-retailer-name");
            var title = this.getAttribute("data-title");
            var price = parseFloat(this.getAttribute("data-price"), 10);
            var url = this.getAttribute("data-url") || "";
            if (id && rid && title && !isNaN(price)) {
                addToBasket(parseInt(id, 10), rid, rname || rid, title, price, url);
            }
        });
    });

    if (closeBtn) closeBtn.addEventListener("click", closeSidebar);
    if (backdrop) backdrop.addEventListener("click", closeSidebar);
    if (triggerBtn) triggerBtn.addEventListener("click", openSidebar);

    var items = getBasket();
    if (items.length > 0) {
        openSidebar();
    }
    renderSidebar();
    updateTriggerCount();
})();
