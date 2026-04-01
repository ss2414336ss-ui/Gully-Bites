document.getElementById("registerForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const phone = document.getElementById("phone").value;
  const password = Math.random().toString(36).slice(-6).toUpperCase(); // Auto-generate password

  const vendorData = {
    stallName: document.getElementById("stallName").value,
    ownerName: document.getElementById("ownerName").value,
    phone,
    password,
    category: document.getElementById("category").value,
    area: document.getElementById("area").value,
    speciality: document.getElementById("speciality").value,
    delivery: document.getElementById("delivery").value,
    deliveryCharge: document.getElementById("deliveryCharge").value,
    deliveryRadius: document.getElementById("deliveryRadius").value,
    isOpen: false,
    lat: null,
    lng: null,
    registeredAt: Date.now()
  };

  db.ref("vendors/" + phone).set(vendorData).then(() => {
    document.getElementById("registerForm").classList.add("hidden");
    document.getElementById("regSuccess").classList.remove("hidden");
    document.getElementById("regCredentials").innerHTML =
      `📱 Phone: <b>${phone}</b><br/>🔑 Password: <b>${password}</b><br/><br/>Yeh save kar lo!`;
    localStorage.setItem("gb_vendor_phone", phone);
    localStorage.setItem("gb_vendor_pass", password);
  });
});
