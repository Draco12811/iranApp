const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, "db.json");


// ================= DB =================

function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({
    users: [],
transactions: [],
deposits: [],
withdrawals: []
    }, null, 2));
  }

  const db = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));

  if (!db.transactions) db.transactions = [];
  if (!db.deposits) db.deposits = [];
if (!db.withdrawals) db.withdrawals = [];  // ⭐ ADD THIS
  return db;
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}


// ================= AUTH =================

app.post("/api/auth/register", (req, res) => {
  const { username, password, inviteCode } = req.body;
  const db = readDB();

  if (db.users.find(u => u.username === username))
    return res.status(400).json({ message: "Exists" });

  const newUser = {
    id: Date.now(),
    username,
    password,
    inviteCode,
    balance: "0.00",
    todayCommission: "0.00",
    totalOrders: 0,
    cycleOrders: 0,
    cashGap: "0.00",
    traps: [],
    walletAddress: "",
    isFrozen: false
  };

  db.users.push(newUser);
  writeDB(db);

  res.json({ success: true, user: newUser });
});

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  const db = readDB();

  const user = db.users.find(
    u => u.username === username && u.password === password
  );

  if (!user) return res.status(401).json({ message: "Invalid" });

  res.json({ success: true, user });
});


// ================= ADMIN USERS =================

app.get("/api/admin/users", (req, res) => {
  res.json(readDB().users);
});

app.delete("/api/admin/delete-user/:id", (req, res) => {
  const db = readDB();
  db.users = db.users.filter(u => u.id !== Number(req.params.id));
  writeDB(db);
  res.json({ success: true });
});


// ================= RESET TASKS =================

app.post("/api/admin/reset-tasks", (req, res) => {
  const { userId } = req.body;
  const db = readDB();

  const user = db.users.find(u => u.id === Number(userId));
  if (!user) return res.status(404).json({ success: false });

  user.cycleOrders = 0;
  user.cashGap = "0.00";
  user.todayCommission = "0.00";

  writeDB(db);
  res.json({ success: true });
});


// ================= UPDATE BALANCE =================

app.post("/api/admin/update-balance", (req, res) => {
  const { userId, amount } = req.body;
  const db = readDB();

  const user = db.users.find(u => u.id === Number(userId));
  if (!user) return res.status(404).json({ success: false });

  user.balance = (
    parseFloat(user.balance) + parseFloat(amount)
  ).toFixed(2);

  writeDB(db);
  res.json({ success: true });
});


// ================= TRAP SYSTEM =================

app.post("/api/admin/set-trap", (req, res) => {
  const { userId, taskNum, amount, percent } = req.body;
  const db = readDB();

  const user = db.users.find(u => u.id === Number(userId));
  if (!user) return res.status(404).json({ success: false });

  if (!user.traps) user.traps = [];

  user.traps.push({
    taskNum: Number(taskNum),
    trapAmount: Number(amount),
    trapPercent: Number(percent)
  });

  writeDB(db);
  res.json({ success: true });
});

app.post("/api/admin/remove-trap", (req, res) => {
  const { userId, taskNum } = req.body;
  const db = readDB();

  const user = db.users.find(u => u.id === Number(userId));
  if (!user) return res.status(404).json({ success: false });

  user.traps = (user.traps || []).filter(
    t => t.taskNum !== Number(taskNum)
  );

  writeDB(db);
  res.json({ success: true });
});


// ================= ADMIN SETTINGS =================

app.post("/api/admin/update-settings", (req, res) => {
  const { userId, password, walletAddress } = req.body;
  const db = readDB();

  const user = db.users.find(u => u.id === Number(userId));
  if (!user) return res.status(404).json({ success: false });

  if (password !== undefined) user.password = password;
  if (walletAddress !== undefined) user.walletAddress = walletAddress;

  writeDB(db);
  res.json({ success: true });
});


// ================= WALLET =================

app.post("/api/user/bind-wallet", (req, res) => {
  const { userId, walletAddress } = req.body;
  const db = readDB();

  const user = db.users.find(u => u.id === Number(userId));
  if (!user) return res.status(404).json({ success: false });

  if (user.walletAddress) {
    return res.json({ success: false, message: "Wallet already bound" });
  }

  user.walletAddress = walletAddress;
  writeDB(db);

  res.json({ success: true });
});

app.get("/api/user/wallet/:id", (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ success: false });

  res.json({ walletAddress: user.walletAddress || null });
});


// ================= TRANSACTIONS =================

app.get("/api/admin/transactions", (req, res) => {
  const db = readDB();
  res.json(db.transactions || []);
});


// ================= MAIN TASK ENGINE =================

app.post("/api/admin/update-order-stats", (req, res) => {
  const { userId, amount, comm, productName, productImg } = req.body;

  const db = readDB();
  const user = db.users.find(u => u.id === Number(userId));
  if (!user) return res.status(404).json({ success: false });

  const amt = parseFloat(amount);
  const commission = parseFloat(comm);
  const balance = parseFloat(user.balance);

  const newTrans = {
    id: Date.now(),
    userId: user.id,
    productName: productName || "Product",
    productImg: productImg || "",
    amount: amt.toFixed(2),
    commission: commission.toFixed(2),
    date: new Date().toLocaleString()
  };

  // ❌ NOT ENOUGH BALANCE → PENDING
  if (balance < amt) {

    user.cashGap = (amt - balance).toFixed(2);
    newTrans.status = "Pending";

    db.transactions.push(newTrans);
  }
  else {

    // ✅ SUCCESS → ONLY ADD COMMISSION
    user.balance = (balance + commission).toFixed(2);

    user.todayCommission = (
      parseFloat(user.todayCommission) + commission
    ).toFixed(2);

    user.cycleOrders += 1;
    user.totalOrders += 1;
    user.cashGap = "0.00";

    newTrans.status = "Completed";

    db.transactions.push(newTrans);
  }

  writeDB(db);

  res.json({ success: true, user });
});


// ================= CLEAR GAP =================

app.post("/api/admin/clear-gap", (req, res) => {
  const { userId, transId } = req.body;
  const db = readDB();

  const user = db.users.find(u => u.id === Number(userId));
  const trans = db.transactions.find(t => t.id === Number(transId));

  if (!user || !trans) return res.status(404).json({ success: false });

  const commission = parseFloat(trans.commission);

  // ✅ ONLY ADD COMMISSION (NO DEDUCTION)
  user.balance = (
    parseFloat(user.balance) + commission
  ).toFixed(2);

  user.todayCommission = (
    parseFloat(user.todayCommission) + commission
  ).toFixed(2);

  user.cycleOrders += 1;
  user.totalOrders += 1;
  user.cashGap = "0.00";

  trans.status = "Completed";

  writeDB(db);

  res.json({ success: true });
});

// ================= DEPOSIT CONFIG =================

// ADMIN SAVE WALLET + QR
app.post("/api/admin/save-deposit-config", (req, res) => {
  const db = readDB();
  db.depositConfig = req.body;
  writeDB(db);
  res.json({ success: true });
});

// USER GET CONFIG (Payment page)
app.get("/api/deposit/config", (req, res) => {
  const db = readDB();
  res.json(db.depositConfig || {});
});


// ================= USER CREATE DEPOSIT =================

app.post("/api/user/create-deposit", (req, res) => {
  const { userId, amount } = req.body;

  const db = readDB();
  const user = db.users.find(u => u.id === Number(userId));

  if (!user) return res.status(404).json({ success: false });

  const deposit = {
    id: Date.now(),
    userId: user.id,
    username: user.username,
    amount: Number(amount),
    status: "pending",
    timestamp: Date.now()
  };

  db.deposits.push(deposit);
  writeDB(db);

  res.json({ success: true });
});


// ================= ADMIN GET DEPOSITS =================

app.get("/api/admin/deposits", (req, res) => {
  const db = readDB();
  res.json(db.deposits || []);
});


// ================= ADMIN DEPOSIT ACTION =================

app.post("/api/admin/deposit-action", (req, res) => {
  const { depositId, action } = req.body;

  const db = readDB();
  const dep = db.deposits.find(d => d.id === depositId);

  if (!dep) return res.status(404).json({ success: false });

  dep.status = action;

  // 💰 APPROVED → ADD BALANCE
  if (action === "approved") {
    const user = db.users.find(u => u.id === dep.userId);
    if (user) {
      user.balance = (
        parseFloat(user.balance) + parseFloat(dep.amount)
      ).toFixed(2);
    }
  }

  writeDB(db);
  res.json({ success: true });
});

// ================= USER CREATE WITHDRAWAL =================

app.post("/api/user/create-withdrawal", (req, res) => {
  const { userId, amount, walletAddress, password } = req.body;

  const db = readDB();
  const user = db.users.find(u => u.id === Number(userId));

  if (!user) return res.status(404).json({ success: false });

  const withdrawAmt = parseFloat(amount);

  // ❌ WALLET NOT BOUND
  if (!user.walletAddress) {
    return res.json({ success: false, message: "Wallet not bound" });
  }

  // ❌ WALLET MISMATCH
  if (walletAddress !== user.walletAddress) {
    return res.json({ success: false, message: "Wallet mismatch" });
  }

  // ❌ PASSWORD WRONG
  if (password !== user.password) {
    return res.json({ success: false, message: "Wrong password" });
  }

  // ❌ TASK CHECK (Grab system)
  // Allow ONLY if cycleOrders === 0 OR 25
  if (user.cycleOrders > 0 && user.cycleOrders < 25) {
    return res.json({
      success: false,
      message: "Please complete all 25 tasks to perform withdrawal"
    });
  }

  // ❌ INVALID AMOUNT
  if (isNaN(withdrawAmt) || withdrawAmt <= 0) {
    return res.json({ success: false, message: "Invalid amount" });
  }

  // ❌ INSUFFICIENT BALANCE
  if (withdrawAmt > parseFloat(user.balance)) {
    return res.json({ success: false, message: "Insufficient balance" });
  }

  // ✅ CREATE WITHDRAW REQUEST
// 💰 BALANCE CUT IMMEDIATELY (PENDING HOLD)
user.balance = (
  parseFloat(user.balance) - withdrawAmt
).toFixed(2);

// ✅ CREATE WITHDRAW REQUEST
const withdrawal = {
  id: Date.now(),
  userId: user.id,
  username: user.username,
  amount: withdrawAmt,
  wallet: walletAddress,
  status: "pending",
  timestamp: Date.now()
};

db.withdrawals.push(withdrawal);
writeDB(db);

res.json({ success: true });
});

// ================= ADMIN GET WITHDRAWALS =================

app.get("/api/admin/withdrawals", (req, res) => {
  const db = readDB();
  res.json(db.withdrawals || []);
});



// ================= ADMIN WITHDRAW ACTION =================

app.post("/api/admin/withdraw-action", (req, res) => {
  const { withdrawalId, action } = req.body;

  const db = readDB();

  const wd = db.withdrawals.find(w => w.id === withdrawalId);

  if (!wd) return res.status(404).json({ success: false });

  wd.status = action;

  const user = db.users.find(u => u.id === wd.userId);

  if (!user) return res.json({ success: true });

  // ❌ REJECT → RETURN MONEY
  if (action === "rejected") {
    user.balance = (
      parseFloat(user.balance) + parseFloat(wd.amount)
    ).toFixed(2);
  }

  // ✅ APPROVED → DO NOTHING (money already deducted)

  writeDB(db);

  res.json({ success: true });
});


// ================= USER SELF SETTINGS (Change Password) =================

app.post("/api/user/change-password", (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;
  const db = readDB();

  // 1. User ko dhoondo
  const user = db.users.find(u => u.id === Number(userId));

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // 2. Purana password check karo (Security ke liye)
  if (user.password !== currentPassword) {
    return res.json({ success: false, message: "Current password is incorrect" });
  }

  // 3. Naya password update karo
  user.password = newPassword;

  writeDB(db);

  res.json({ success: true, message: "Password updated successfully" });
});

// ================= CUSTOMER SUPPORT LINK =================

// ADMIN SET CS LINK
app.post("/api/admin/set-cs-link", (req, res) => {
  const { link } = req.body;
  const db = readDB();

  db.csLink = link || "";

  writeDB(db);
  res.json({ success: true });
});

// USER GET CS LINK
app.get("/api/cs-link", (req, res) => {
  const db = readDB();
  res.json({ link: db.csLink || "" });
});




app.listen(5000, () =>
  console.log("🚀 Server Running on Port 5000")
);