import { useEffect, useState } from 'react';
import { menuService, orderService, studentService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import Loader from '../../components/common/Loader';

const tabs = ['profile', 'menu', 'orders'];

function StudentDashboardPage() {
  const { user, logout } = useAuth();
  const { success, error } = useNotification();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [menus, setMenus] = useState([]);
  const [orders, setOrders] = useState([]);
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    hostelBlock: '',
    roomNumber: '',
    aadhaarNumber: '',
    dietPreference: 'VEG',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [myProfile, menuList, orderList] = await Promise.all([
        studentService.getMine(),
        menuService.list({}),
        orderService.list(),
      ]);
      setProfile(myProfile);
      setProfileForm({
        firstName: myProfile.firstName || '',
        lastName: myProfile.lastName || '',
        phone: myProfile.phone || '',
        hostelBlock: myProfile.hostelBlock || '',
        roomNumber: myProfile.roomNumber || '',
        aadhaarNumber: myProfile.aadhaarNumber || '',
        dietPreference: myProfile.dietPreference || 'VEG',
      });
      setMenus(menuList);
      setOrders(orderList);
    } catch (err) {
      error(err?.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const updated = await studentService.update(profile.id, profileForm);
      setProfile(updated);
      success('Profile updated');
    } catch (err) {
      error(err?.response?.data?.message || 'Update failed');
    }
  };

  const uploadAadhaar = async () => {
    if (!aadhaarFile) return;
    try {
      const updated = await studentService.uploadAadhaar(profile.id, aadhaarFile);
      setProfile(updated);
      setAadhaarFile(null);
      success('Aadhaar uploaded');
    } catch (err) {
      error(err?.response?.data?.message || 'Upload failed');
    }
  };

  const placeOrder = async (menuId) => {
    try {
      await orderService.place({
        menuId,
        orderDate: new Date().toISOString().slice(0, 10),
        quantity: 1,
        specialInstructions: '',
      });
      success('Order placed');
      setOrders(await orderService.list());
    } catch (err) {
      error(err?.response?.data?.message || 'Order failed');
    }
  };

  const cancelOrder = async (id) => {
    try {
      await orderService.cancel(id);
      success('Order cancelled');
      setOrders(await orderService.list());
    } catch (err) {
      error(err?.response?.data?.message || 'Cancel failed');
    }
  };

  if (loading) return <Loader text="Loading student panel..." />;

  return (
    <div className="panel-layout">
      {/* ── SIDEBAR NAV ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🎓</div>
          <div>
            <div className="sidebar-logo-text">Student Portal</div>
            <div className="sidebar-logo-sub">Tiffin Engine</div>
          </div>
        </div>

        <div className="sidebar-nav-label">Navigation</div>
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {profileForm.firstName?.charAt(0).toUpperCase() || 'S'}
          </div>
          <div>
            <div className="sidebar-user-name">
              {profileForm.firstName ? `${profileForm.firstName} ${profileForm.lastName}` : 'Student'}
            </div>
            <div className="sidebar-user-email">{user?.email}</div>
          </div>
        </div>
        
        <button type="button" onClick={logout} className="logout-btn">
          Logout
        </button>
      </aside>

      {/* ── CENTRAL CONTENT AREA ── */}
      <section className="panel-content">
        
        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <>
            <div className="page-header">
              <h1>My Profile</h1>
              <p>Manage your account settings, campus location, and meal choices.</p>
            </div>

            <form className="card form-grid card-body" onSubmit={updateProfile}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--sp-4)' }}>
                <label>First Name
                  <input value={profileForm.firstName} onChange={(e) => setProfileForm((p) => ({ ...p, firstName: e.target.value }))} placeholder="John" />
                </label>
                <label>Last Name
                  <input value={profileForm.lastName} onChange={(e) => setProfileForm((p) => ({ ...p, lastName: e.target.value }))} placeholder="Doe" />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--sp-4)' }}>
                <label>Phone
                  <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))} placeholder="9876543210" />
                </label>
                <label>Diet Preference
                  <select value={profileForm.dietPreference} onChange={(e) => setProfileForm((p) => ({ ...p, dietPreference: e.target.value }))}>
                    <option value="VEG">VEG</option>
                    <option value="NON_VEG">NON_VEG</option>
                    <option value="VEGAN">VEGAN</option>
                  </select>
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--sp-4)' }}>
                <label>Hostel Block
                  <input value={profileForm.hostelBlock} onChange={(e) => setProfileForm((p) => ({ ...p, hostelBlock: e.target.value }))} placeholder="Block-A" />
                </label>
                <label>Room Number
                  <input value={profileForm.roomNumber} onChange={(e) => setProfileForm((p) => ({ ...p, roomNumber: e.target.value }))} placeholder="302" />
                </label>
              </div>

              <label>Aadhaar Number
                <input value={profileForm.aadhaarNumber} onChange={(e) => setProfileForm((p) => ({ ...p, aadhaarNumber: e.target.value }))} placeholder="0000 0000 0000" />
              </label>

              <button type="submit" style={{ justifySelf: 'start', marginTop: 'var(--sp-2)' }}>Save Profile</button>
            </form>

            <div className="card">
              <div className="card-head">
                <h3>Verification Document</h3>
              </div>
              <div className="card-body" style={{ display: 'grid', gap: 'var(--sp-4)' }}>
                <div className="upload-zone" style={{ position: 'relative' }}>
                  <div className="upload-zone-icon">📁</div>
                  <p style={{ fontWeight: '500', marginBottom: 'var(--sp-1)' }}>
                    {aadhaarFile ? aadhaarFile.name : 'Click to drop files here to upload'}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--txt3)' }}>Supported formats: PDF, PNG, JPG</span>
                  <input 
                    type="file" 
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} 
                    onChange={(e) => setAadhaarFile(e.target.files?.[0] || null)} 
                  />
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--txt3)' }}>
                    Current path: <code style={{ color: 'var(--txt1)' }}>{profile?.aadhaarDocumentPath || 'Not uploaded'}</code>
                  </span>
                  <button type="button" onClick={uploadAadhaar} disabled={!aadhaarFile}>
                    Upload File
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* MENU & ORDERING TAB */}
        {activeTab === 'menu' && (
          <>
            <div className="page-header">
              <h1>Menu & Ordering</h1>
              <p>View historical schedules and order choices for campus service delivery.</p>
            </div>

            <div className="card">
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Meal</th>
                      <th>Title</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menus.map((m) => (
                      <tr key={m.id}>
                        <td data-label="Date" style={{ fontFamily: 'monospace' }}>{m.menuDate}</td>
                        <td data-label="Meal">
                          <span className="badge badge-primary">{m.mealType}</span>
                        </td>
                        <td data-label="Title" style={{ fontWeight: '600', color: 'var(--txt1)' }}>{m.title}</td>
                        <td data-label="Action">
                          <button type="button" onClick={() => placeOrder(m.id)}>Place Order</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ORDER HISTORY TAB */}
        {activeTab === 'orders' && (
          <>
            <div className="page-header">
              <h1>Order History</h1>
              <p>Track delivery logs, pending confirmation lists, and cancellations.</p>
            </div>

            <div className="card">
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Menu</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id}>
                        <td data-label="Date" style={{ fontFamily: 'monospace' }}>{o.orderDate}</td>
                        <td data-label="Menu" style={{ fontWeight: '500', color: 'var(--txt1)' }}>{o.menuTitle}</td>
                        <td data-label="Status">
                          <span className={`badge ${
                            o.status === 'DELIVERED' ? 'badge-success' : 
                            o.status === 'CANCELLED' ? 'badge-danger' : 'badge-warning'
                          }`}>
                            <span className={`status-dot ${
                              o.status === 'DELIVERED' ? 'dot-green' : 
                              o.status === 'CANCELLED' ? 'dot-red' : 'dot-yellow'
                            }`}></span>
                            {o.status}
                          </span>
                        </td>
                        <td data-label="Action">
                          {o.status === 'PENDING' ? (
                            <button 
                              type="button" 
                              style={{ background: 'var(--rose)', borderColor: 'var(--rose)' }} 
                              onClick={() => cancelOrder(o.id)}
                            >
                              Cancel Order
                            </button>
                          ) : (
                            <span style={{ color: 'var(--txt3)', fontSize: '0.875rem' }}>—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default StudentDashboardPage;