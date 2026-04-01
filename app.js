let allVendors = [];
let map, markers = [];
let cart = [];
let currentVendor = null;
const PLATFORM_FEE = 5;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 28.4595, lng: 77.0266 },
    zoom: 13,
    styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }]
  });
  loadVendors();
}

function loadVendors() {
  db.ref("vendors").on("value", snapshot => {
    allVendors = [];
    markers.forEach(m => m.setMap(null));
    markers = [];

    snapshot.forEach(child => {
      const v = { id: child.key, ...child.val() };
      if (v.isOpen && v.lat && v.lng) {
        allVendors.push(v);
        addMapMarker(v);
      }
    });
    renderCards(allVendors);
  });
}

function addMapMarker(vendor) {
  const marker = new google.maps.Marker({
    position: { lat: vendor.lat, lng: vendor.lng },
    map,
    title: vendor.stallName,
    icon: {
      url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
    }
  });

  const infoWindow = new google.maps.InfoWindow({
    content: `
      <div style="font-family:Poppins,sans-serif;padding:8px;">
        <b>${vendor.stallName}</b><br/>
        📍 ${vendor.area}<br/>
        🍽️ ${vendor.category}<br/>
        ${vendor.delivery === 'yes' ? '🛵 Delivery Available' : '🚶 Pickup Only'}<br/>
        <a href="#" onclick="openVendorModal('${vendor.id}')" style="color:#e65c00;">Order Now →</a>
      </div>`
  });

  marker.addListener("click", () => infoWindow.open(map, marker));
  markers.push(marker);
}

function renderCards(vendors) {
  const container = document.getElementById("vendorCards");
  if (vendors.length === 0) {
    container.innerHTML = `<p class="no-vendor">Koi vendor nahi mila... Try different area!</p>`;
    return;
  }
  container.innerHTML = vendors.map(v => `
    <div class="vendor-card" onclick="openVendorModal('${v.id}')">
      <div class="vendor-top">
        <span class="vendor-emoji">${getCategoryEmoji(v.category)}</span>
        <span class="open-badge ${v.isOpen ? 'open' : 'closed'}">${v.isOpen ? '🟢 Open' : '🔴 Closed'}</span>
      </div>
      <h3>${v.stallName}</h3>
      <p>👤 ${v.ownerName}</p>
      <p>📍 ${v.area}</p>
      <p>🍽️ ${v.speciality || v.category}</p>
      ${v.specialOffer ? `<p class="offer-tag">🎉 ${v.specialOffer}</p>` : ''}
      ${v.delivery === 'yes' ? `<p class="delivery-tag">🛵 Home Delivery ₹${v.deliveryCharge || 20}</p>` : ''}
      <button class="btn-order-card">Order Now →</button>
    </div>
  `).join('');
}

function getCategoryEmoji(cat) {
  const map = { chaat: '🍿', momos: '🥟', chai: '☕', rolls: '🌯', biryani: '🍛', other: '🍽️' };
  return map[cat] || '🍽️';
}

function filterVendors() {
  const q = document.getElementById("searchInput").value.toLowerCase();
  const filtered = allVendors.filter(v =>
    v.stallName.toLowerCase().includes(q) ||
    v.area.toLowerCase().includes(q) ||
    v.category.toLowerCase().includes(q)
  );
  renderCards(filtered);
}

function filterByCategory(cat) {
  document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  const filtered = cat === 'all' ? allVendors : allVendors.filter(v => v.category === cat);
  renderCards(filtered);
}

function openVendorModal(vendorId) {
  currentVendor = allVendors.find(v => v.id === vendorId);
  if (!currentVendor) return;

  cart = [];
  document.getElementById("modalVendorName").textContent = currentVendor.stallName;
  document.getElementById("modalVendorInfo").innerHTML = `
    📍 ${currentVendor.area} | 📞 ${currentVendor.phone}
    ${currentVendor.delivery === 'yes' ? `<br/>🛵 Delivery ₹${currentVendor.deliveryCharge} (${currentVendor.deliveryRadius}km radius)` : '<br/>🚶 Pickup only'}
  `;

  // Load menu
  db.ref(`vendors/${vendorId}/menu`).once("value", snap => {
    const menuDiv = document.getElementById("modalMenu");
    let menuHTML = '<h3>Menu</h3>';

    if (!snap.exists()) {
      menuHTML += '<p>Menu abhi available nahi</p>';
    } else {
      snap.forEach(item => {
        const i = item.val();
        menuHTML += `
          <div class="menu-item ${i.available === 'no' ? 'unavailable' : ''}">
            <div>
              <b>${i.name}</b>
              <p>${i.desc || ''}</p>
            </div>
            <div class="menu-right">
              <span>₹${i.price}</span>
              ${i.available !== 'no' ? `<button onclick="addToCart('${item.key}', '${i.name}', ${i.price})">+ Add</button>` : '<span class="out">Out of Stock</span>'}
            </div>
          </div>`;
      });
    }

    menuDiv.innerHTML = menuHTML;
  });

  document.getElementById("orderModal").classList.remove("hidden");
  document.getElementById("orderSummary").classList.add("hidden");
}

function addToCart(id, name, price) {
  const existing = cart.find(c => c.id === id);
  if (existing) { existing.qty++; }
  else { cart.push({ id, name, price, qty: 1 }); }
  updateOrderSummary();
}

function updateOrderSummary() {
  if (cart.length === 0) {
    document.getElementById("orderSummary").classList.add("hidden");
    return;
  }

  document.getElementById("orderSummary").classList.remove("hidden");
  const deliveryFee = currentVendor.delivery === 'yes' ? parseInt(currentVendor.deliveryCharge || 20) : 0;
  const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const total = subtotal + PLATFORM_FEE + deliveryFee;

  document.getElementById("summaryItems").innerHTML = cart.map(c =>
    `<p>${c.name} x${c.qty} = ₹${c.price * c.qty}</p>`
  ).join('') + `<p>Subtotal: ₹${subtotal}</p>`;

  document.getElementById("deliveryFeeText").innerHTML =
    currentVendor.delivery === 'yes' ? `<b>Delivery Charge:</b> ₹${deliveryFee}` : '';
  document.getElementById("totalText").textContent = `Total: ₹${total}`;
}

function placeOrder() {
  const name = document.getElementById("customerName").value;
  const phone = document.getElementById("customerPhone").value;
  const address = document.getElementById("customerAddress").value;

  if (!name || !phone) {
    alert("Naam aur phone number dena zaroori hai!");
    return;
  }

  const deliveryFee = currentVendor.delivery === 'yes' ? parseInt(currentVendor.deliveryCharge || 20) : 0;
  const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const total = subtotal + PLATFORM_FEE + deliveryFee;

  const orderText = cart.map(c => `${c.name} x${c.qty} = ₹${c.price * c.qty}`).join('\n');
  const msg = encodeURIComponent(
    `🍛 *Gully Bites Order*\n\n` +
    `Stall: ${currentVendor.stallName}\n` +
    `Customer: ${name}\n` +
    `Phone: ${phone}\n` +
    `Address: ${address || 'Pickup'}\n\n` +
    `*Order:*\n${orderText}\n\n` +
    `Platform Fee: ₹${PLATFORM_FEE}\n` +
    `Delivery: ₹${deliveryFee}\n` +
    `*Total: ₹${total}*`
  );

  // Save order to Firebase
  db.ref("orders").push({
    vendorId: currentVendor.id,
    vendorName: currentVendor.stallName,
    customerName: name,
    customerPhone: phone,
    address,
    items: cart,
    total,
    platformFee: PLATFORM_FEE,
    deliveryFee,
    timestamp: Date.now(),
    status: "pending"
  });

  window.open(`https://wa.me/91${currentVendor.phone}?text=${msg}`, '_blank');
  closeModal();
}

function closeModal() {
  document.getElementById("orderModal").classList.add("hidden");
  cart = [];
  currentVendor = null;
}
