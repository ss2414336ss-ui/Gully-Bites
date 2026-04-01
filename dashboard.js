let currentVendorId = null;

document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const phone = document.getElementById("loginPhone").value;
  const pass = document.getElementById("loginPassword").value;

  db.ref("vendors/" + phone).once("value", snap => {
    if (!snap.exists()) {
      alert("Vendor nahi mila! Register karo pehle.");
      return;
    }
    const vendor = snap.val();
    if (vendor.password !== pass) {
      alert("Password galat hai!");
      return;
    }
    currentVendorId = phone;
    localStorage.setItem("gb_vendor_phone", phone);
    showDashboard(vendor);
  });
});

function showDashboard(vendor) {
  document.getElementById("loginSection").classList.add("hidden");
  document.getElementById("dashboardSection").classList.remove("hidden");
  document.getElementById("dashWelcome").textContent = `Namaste ${vendor.ownerName}! 👋`;

  const toggle = document.getElementById("openToggle");
  toggle.checked = vendor.isOpen;
  updateStatusLabel(vendor.isOpen);

  loadMenu();
  loadOrders();
}

function toggleOpenStatus() {
  const isOpen = document.getElementById("openToggle").checked;
  updateStatusLabel(isOpen);
  db.ref("vendors/" + currentVendorId).update({ isOpen });
}

function updateStatusLabel(isOpen) {
  const label = document.getElementById("statusLabel");
  label.textContent = isOpen ? "Open 🟢" : "Closed 🔴";
  label.className = "status-badge " + (isOpen ? "open" : "closed");
}

function shareLocation() {
  if (!navigator.geolocation) {
    alert("Location support nahi hai is browser mein");
    return;
  }
  document.getElementById("locationStatus").textContent = "📍 Location detect ho rahi hai...";
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    db.ref("vendors/" + currentVendorId).update({ lat, lng, lastLocationUpdate: Date.now() });
    document.getElementById("locationStatus").textContent = `✅ Location update ho gayi! (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  }, err => {
    document.getElementById("locationStatus").textContent = "❌ Location nahi mili. Permission dena hoga.";
  });
}

function loadMenu() {
  db.ref(`vendors/${currentVendorId}/menu`).on("value", snap => {
    const menuList = document.getElementById("menuList");
    let html = '';
    snap.forEach(item => {
      const i = item.val();
      html += `
        <div class="menu-item-dash">
          <b>${i.name}</b> - ₹${i.price}
          <span class="${i.available === 'yes' ? 'avail' : 'unavail'}">${i.available === 'yes' ? '✅' : '❌'}</span>
          <button onclick="toggleItemAvail('${item.key}', '${i.available}')">Toggle</button>
          <button onclick="deleteItem('${item.key}')">🗑️</button>
        </div>`;
    });
    menuList.innerHTML = html || '<p>Koi item nahi. Neeche add karo.</p>';
  });
}

function addMenuItem() {
  const name = document.getElementById("itemName").value;
  const price = document.getElementById("itemPrice").value;
  const desc = document.getElementById("itemDesc").value;
  const available = document.getElementById("itemAvailable").value;

  if (!name || !price) { alert("Naam aur price dena zaroori hai!"); return; }

  db.ref(`vendors/${currentVendorId}/menu`).push({ name, price: parseInt(price), desc, available });
  document.getElementById("itemName").value = '';
  document.getElementById("itemPrice").value = '';
  document.getElementById("itemDesc").value = '';
}

function toggleItemAvail(itemId, current) {
  const newVal = current === 'yes' ? 'no' : 'yes';
  db.ref(`vendors/${currentVendorId}/menu/${itemId}`).update({ available: newVal });
}

function deleteItem(itemId) {
  db.ref(`vendors/${currentVendorId}/menu/${itemId}`).remove();
}

function updateOffer() {
  const offer = document.getElementById("specialOffer").value;
  db.ref("vendors/" + currentVendorId).update({ specialOffer: offer });
  alert("Offer update ho gayi! 🎉");
}

function loadOrders() {
  db.ref("orders").orderByChild("vendorId").equalTo(currentVendorId).on("value", snap => {
    const ordersList = document.getElementById("ordersList");
    let html = '';
    let count = 0;
    snap.forEach(order => {
      const o = order.val();
      const time = new Date(o.timestamp).toLocaleTimeString('hi-IN');
      html = `
        <div class="order-card">
          <b>${o.customerName}</b> - ₹${o.total}
          <p>📱 ${o.customerPhone}</p>
          <p>📍 ${o.address || 'Pickup'}</p>
          <p>🕐 ${time}</p>
          <p>${o.items.map(i => `${i.name} x${i.qty}`).join(', ')}</p>
          <span class="order-status ${o.status}">${o.status}</span>
          <button onclick="updateOrderStatus('${order.key}', 'confirmed')">✅ Confirm</button>
          <button onclick="updateOrderStatus('${order.key}', 'delivered')">🛵 Delivered</button>
        </div>` + html;
      count++;
    });
    ordersList.innerHTML = count > 0 ? html : '<p class="hint">Abhi koi order nahi...</p>';
  });
}

function updateOrderStatus(orderId, status) {
  db.ref("orders/" + orderId).update({ status });
}

function logout() {
  currentVendorId = null;
  localStorage.removeItem("gb_vendor_phone");
  document.getElementById("dashboardSection").classList.add("hidden");
  document.getElementById("loginSection").classList.remove("hidden");
}

// Auto-login if saved
window.onload = function() {
  const savedPhone = localStorage.getItem("gb_vendor_phone");
  const savedPass = localStorage.getItem("gb_vendor_pass");
  if (savedPhone && savedPass) {
    document.getElementById("loginPhone").value = savedPhone;
    document.getElementById("loginPassword").value = savedPass;
  }
};
