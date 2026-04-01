# 🍛 Gully Bites
### Gurugram Ka #1 Street Food Platform

Gully Bites is a hyperlocal street food vendor discovery and ordering platform for Gurugram.
Customers can find nearby vendors on a live map, browse menus, and order online with home delivery.
Vendors manage everything from a simple Hinglish dashboard.

---

## 📁 Project Files

| File | Description |
|------|-------------|
| `index.html` | Customer homepage — live map + vendor cards + search |
| `vendor-register.html` | Vendor registration form |
| `vendor-dashboard.html` | Vendor dashboard (Hinglish) — location, menu, orders |
| `vendor-login.html` | Redirects to dashboard |
| `firebase-config.js` | Firebase configuration (fill your keys here) |
| `app.js` | Customer-side logic — map, orders, cart |
| `register.js` | Vendor registration logic |
| `dashboard.js` | Vendor dashboard logic |
| `style.css` | Full styling for all pages |
| `README.md` | This file |

---

## ⚙️ Setup Instructions

### Step 1 — Firebase Setup (Free)

1. Go to [firebase.google.com](https://firebase.google.com)
2. Click **Get Started** → Create a new project (name it `gully-bites`)
3. Go to **Build → Realtime Database** → Create database
4. Choose **Asia-Southeast1** region → Start in **Test Mode**
5. Go to **Project Settings** (gear icon) → **Your apps** → Add Web App
6. Copy the config object and paste it into `firebase-config.js`

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
