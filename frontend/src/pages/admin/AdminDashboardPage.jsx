import { useEffect, useMemo, useState } from 'react';
import {
  attendanceService,
  dashboardService,
  menuService,
  orderService,
  studentService,
} from '../../services/api';
import Loader from '../../components/common/Loader';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const tabs = ['dashboard', 'students', 'attendance', 'menus'];

function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const { success, error } = useNotification();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [menus, setMenus] = useState([]);
  const [search, setSearch] = useState('');
  const [showDoc, setShowDoc] = useState(null);
  
  // Menu Form State
  const [menuForm, setMenuForm] = useState({
    id: null,
    menuDate: '',
    mealType: 'LUNCH',
    title: '',
    description: '',
    isPublished: true,
  });

  // NEW: Attendance Form State matching AttendanceCreateRequest DTO
  const [attendanceForm, setAttendanceForm] = useState({
    studentProfileId: '',
    menuId: '',
    attendanceDate: new Date().toISOString().slice(0, 10), // defaults to today
    status: 'PRESENT',
    remarks: '',
  });

  const todayMenu = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return menus.filter((m) => m.menuDate === today);
  }, [menus]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [statsData, studentsData, attendanceData, menusData] = await Promise.all([
        dashboardService.stats(),
        studentService.search({ keyword: search, page: 0, size: 30 }),
        attendanceService.list({}),
        menuService.list({}),
      ]);
      setStats(statsData);
      setStudents(studentsData.content || []);
      setAttendance(attendanceData || []);
      setMenus(menusData || []);
    } catch (err) {
      error(err?.response?.data?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = async () => {
    try {
      const data = await studentService.search({ keyword: search, page: 0, size: 30 });
      setStudents(data.content || []);
      success('Search complete');
    } catch (err) {
      error(err?.response?.data?.message || 'Search failed');
    }
  };

  const toggleActive = async (student) => {
    try {
      await studentService.update(student.id, { isActive: !student.isActive });
      success('Student status updated');
      onSearch();
    } catch (err) {
      error(err?.response?.data?.message || 'Failed to update student');
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await studentService.remove(id);
      success('Student deleted');
      onSearch();
    } catch (err) {
      error(err?.response?.data?.message || 'Delete failed');
    }
  };

  // NEW: Submit Handler for Creating Attendance
  const submitAttendance = async (e) => {
    e.preventDefault();
    try {
      // Mapping to numeric types required by Java Long types if passed as strings from select values
      const payload = {
        studentProfileId: Number(attendanceForm.studentProfileId),
        menuId: Number(attendanceForm.menuId),
        attendanceDate: attendanceForm.attendanceDate,
        status: attendanceForm.status,
        remarks: attendanceForm.remarks || null,
      };

      await attendanceService.create(payload); // Assumes attendanceService.create exists in your API layer
      success('Attendance record logged successfully');
      
      // Reset Form State
      setAttendanceForm({
        studentProfileId: '',
        menuId: '',
        attendanceDate: new Date().toISOString().slice(0, 10),
        status: 'PRESENT',
        remarks: '',
      });

      // Refresh Ledger List
      const refreshedAttendance = await attendanceService.list({});
      setAttendance(refreshedAttendance || []);
      
      // Refresh Dashboard Stats context metrics
      const refreshedStats = await dashboardService.stats();
      setStats(refreshedStats);
    } catch (err) {
      error(err?.response?.data?.message || 'Failed to create attendance record');
    }
  };

  const deleteAttendance = async (id) => {
    if (!window.confirm('Delete this attendance record?')) return;
    try {
      await attendanceService.remove(id);
      setAttendance((prev) => prev.filter((a) => a.id !== id));
      success('Attendance deleted');
    } catch (err) {
      error(err?.response?.data?.message || 'Delete failed');
    }
  };

  const submitMenu = async (e) => {
    e.preventDefault();
    try {
      if (menuForm.id) {
        await menuService.update(menuForm.id, menuForm);
        success('Menu updated');
      } else {
        await menuService.create(menuForm);
        success('Menu created');
      }
      setMenuForm({
        id: null,
        menuDate: '',
        mealType: 'LUNCH',
        title: '',
        description: '',
        isPublished: true,
      });
      const refreshed = await menuService.list({});
      setMenus(refreshed);
    } catch (err) {
      error(err?.response?.data?.message || 'Menu save failed');
    }
  };

  const editMenu = (menu) => setMenuForm(menu);

  const deleteMenu = async (id) => {
    if (!window.confirm('Delete this menu?')) return;
    try {
      await menuService.remove(id);
      setMenus((prev) => prev.filter((m) => m.id !== id));
      success('Menu deleted');
    } catch (err) {
      error(err?.response?.data?.message || 'Delete failed');
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await orderService.updateStatus(id, { status });
      success('Order status updated');
      const refreshed = await dashboardService.stats();
      setStats(refreshed);
    } catch (err) {
      error(err?.response?.data?.message || 'Status update failed');
    }
  };

  if (loading) return <Loader text="Loading admin panel..." />;

  return (
    <div className="panel-layout">
      {/* ── SIDEBAR NAV ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🍱</div>
          <div>
            <div className="sidebar-logo-text">Tiffin Admin</div>
            <div className="sidebar-logo-sub">Management Suite</div>
          </div>
        </div>

        <div className="sidebar-nav-label">Navigation</div>
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div>
            <div className="sidebar-user-name">Admin User</div>
            <div className="sidebar-user-email">{user?.email}</div>
          </div>
        </div>

        <button type="button" onClick={logout} className="logout-btn">
          Logout
        </button>
      </aside>

      {/* ── CENTRAL CONTENT AREA ── */}
      <section className="panel-content">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <>
            <div className="page-header">
              <h1>Dashboard</h1>
              <p>Overview and metrics summary for today.</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card" style={{ '--accent': 'var(--sf)' }}>
                <div className="stat-label">Total Students</div>
                <div className="stat-value">{stats?.totalStudents || 0}</div>
              </div>
              <div className="stat-card" style={{ '--accent': 'var(--leaf)' }}>
                <div className="stat-label">Active Students</div>
                <div className="stat-value">{stats?.activeStudents || 0}</div>
              </div>
              <div className="stat-card" style={{ '--accent': 'var(--amber)' }}>
                <div className="stat-label">Total Orders</div>
                <div className="stat-value">{stats?.totalOrders || 0}</div>
              </div>
              <div className="stat-card" style={{ '--accent': 'var(--clay)' }}>
                <div className="stat-label">Today Attendance</div>
                <div className="stat-value">{stats?.todayAttendanceCount || 0}</div>
              </div>
            </div>

            <div className="card menu-card">
              <div className="card-head">
                <h3>Today's Menu</h3>
              </div>
              <div className="card-body">
                {todayMenu.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">🍽️</div>
                    <h3>No Menu Published</h3>
                    <p>There are no menu records configured for today's date context.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: 'var(--sp-3)' }}>
                    {todayMenu.map((m) => (
                      <div key={m.id} className="quick-link-item">
                        <div>
                          <div className="meal-label">{m.mealType}</div>
                          <div className="meal-main">{m.title}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-head">
                <h3>Recent Orders</h3>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Menu</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(stats?.recentOrders || []).map((o) => (
                      <tr key={o.id}>
                        <td data-label="Student">{o.studentName}</td>
                        <td data-label="Menu">{o.menuTitle}</td>
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
                          <button type="button" onClick={() => updateOrderStatus(o.id, 'DELIVERED')}>Deliver</button>
                          <button type="button" style={{ background: 'var(--rose)', borderColor: 'var(--rose)' }} onClick={() => updateOrderStatus(o.id, 'CANCELLED')}>Cancel</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* STUDENTS TAB */}
        {activeTab === 'students' && (
          <>
            <div className="section-header">
              <h2>Student Directory</h2>
              <div className="toolbar">
                <div className="search-wrap">
                  <input 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    placeholder="Search profile details..." 
                  />
                </div>
                <button type="button" onClick={onSearch}>Search</button>
              </div>
            </div>

            <div className="card">
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Enrollment</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.id}>
                        <td data-label="Name" style={{ fontWeight: '600', color: 'var(--txt1)' }}>{s.firstName} {s.lastName}</td>
                        <td data-label="Email">{s.email}</td>
                        <td data-label="Enrollment">{s.enrollmentNumber}</td>
                        <td data-label="Status">
                          <span className={`badge ${s.isActive ? 'badge-success' : 'badge-neutral'}`}>
                            {s.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td data-label="Actions">
                          <button type="button" onClick={() => toggleActive(s)}>
                            {s.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button type="button" style={{ background: 'var(--clay)', borderColor: 'var(--clay)' }} onClick={() => setShowDoc(s.aadhaarDocumentPath || 'No document uploaded')}>Identity Doc</button>
                          <button type="button" style={{ background: 'var(--rose)', borderColor: 'var(--rose)' }} onClick={() => deleteStudent(s.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ATTENDANCE TAB (MODERNIZED WITH NEW ATTENDANCE FORM LINKED TO BACKEND DTO) */}
        {activeTab === 'attendance' && (
          <>
            <div className="page-header">
              <h1>Attendance Management</h1>
              <p>Verify tracking context logs, manage shifts, and log live entry instances.</p>
            </div>

            {/* Attendance Creation Form Layout */}
            <form className="card form-grid card-body" onSubmit={submitAttendance}>
              <h3 style={{ fontFamily: 'var(--font-d)', fontSize: '1.1rem', marginBottom: 'var(--sp-2)', color: 'var(--txt1)' }}> Log New Attendance Instance</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--sp-4)' }}>
                <label>Select Student
                  <select 
                    required 
                    value={attendanceForm.studentProfileId} 
                    onChange={(e) => setAttendanceForm(p => ({ ...p, studentProfileId: e.target.value }))}
                  >
                    <option value="">-- Choose Student --</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.enrollmentNumber || s.email})</option>
                    ))}
                  </select>
                </label>

                <label>Associated Menu
                  <select 
                    required 
                    value={attendanceForm.menuId} 
                    onChange={(e) => setAttendanceForm(p => ({ ...p, menuId: e.target.value }))}
                  >
                    <option value="">-- Choose Active Menu Setup --</option>
                    {menus.map(m => (
                      <option key={m.id} value={m.id}>{m.menuDate} - [{m.mealType}] {m.title}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--sp-4)' }}>
                <label>Attendance Date
                  <input 
                    type="date" 
                    required 
                    value={attendanceForm.attendanceDate} 
                    onChange={(e) => setAttendanceForm(p => ({ ...p, attendanceDate: e.target.value }))} 
                  />
                </label>

                <label>Status
                  <select 
                    value={attendanceForm.status} 
                    onChange={(e) => setAttendanceForm(p => ({ ...p, status: e.target.value }))}
                  >
                    <option value="PRESENT">PRESENT</option>
                    <option value="ABSENT">ABSENT</option>
                    <option value="EXCUSED">EXCUSED</option>
                  </select>
                </label>
              </div>

              <label>Remarks
                <input 
                  value={attendanceForm.remarks} 
                  onChange={(e) => setAttendanceForm(p => ({ ...p, remarks: e.target.value }))} 
                  placeholder="E.g., Medical exception, late collection adjustments..."
                  maxLength={255}
                />
              </label>

              <button type="submit" style={{ justifySelf: 'start', marginTop: 'var(--sp-2)' }}>Log Instance</button>
            </form>

            {/* Attendance List Ledger Display */}
            <div className="card">
              <div className="card-head">
                <h3>Attendance Ledger History</h3>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Remarks</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((a) => (
                      <tr key={a.id}>
                        <td data-label="Student" style={{ fontWeight: '500' }}>{a.studentName}</td>
                        <td data-label="Date">{a.attendanceDate}</td>
                        <td data-label="Status">
                          <span className={`badge ${a.status === 'PRESENT' ? 'badge-success' : 'badge-danger'}`}>
                            {a.status}
                          </span>
                        </td>
                        <td data-label="Remarks">{a.remarks || '—'}</td>
                        <td data-label="Actions">
                          <button type="button" style={{ background: 'var(--rose)', borderColor: 'var(--rose)' }} onClick={() => deleteAttendance(a.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* MENUS TAB */}
        {activeTab === 'menus' && (
          <>
            <div className="page-header">
              <h1>Menu Optimization Ledger</h1>
              <p>Generate, assign, and organize meal setups across specific timelines.</p>
            </div>

            <form className="card form-grid card-body" onSubmit={submitMenu}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--sp-4)' }}>
                <label>Menu Date
                  <input type="date" required value={menuForm.menuDate || ''} onChange={(e) => setMenuForm((p) => ({ ...p, menuDate: e.target.value }))} />
                </label>
                <label>Meal Type
                  <select value={menuForm.mealType || 'LUNCH'} onChange={(e) => setMenuForm((p) => ({ ...p, mealType: e.target.value }))}>
                    <option value="BREAKFAST">BREAKFAST</option>
                    <option value="LUNCH">LUNCH</option>
                    <option value="DINNER">DINNER</option>
                  </select>
                </label>
              </div>
              <label>Title
                <input required value={menuForm.title || ''} onChange={(e) => setMenuForm((p) => ({ ...p, title: e.target.value }))} placeholder="E.g., Special Premium Rice Bowl" />
              </label>
              <label>Description
                <textarea value={menuForm.description || ''} onChange={(e) => setMenuForm((p) => ({ ...p, description: e.target.value }))} placeholder="Provide details regarding side dishes, allergen notifications, or structural variants..." />
              </label>
              <button type="submit" style={{ justifySelf: 'start', marginTop: 'var(--sp-2)' }}>
                {menuForm.id ? 'Update Setup' : 'Publish Setup'}
              </button>
            </form>

            <div className="card">
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Meal Group</th>
                      <th>Title</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menus.map((m) => (
                      <tr key={m.id}>
                        <td data-label="Date" style={{ fontFamily: 'monospace' }}>{m.menuDate}</td>
                        <td data-label="Meal Group">
                          <span className="badge badge-primary">{m.mealType}</span>
                        </td>
                        <td data-label="Title" style={{ fontWeight: '500', color: 'var(--txt1)' }}>{m.title}</td>
                        <td data-label="Actions">
                          <button type="button" onClick={() => editMenu(m)}>Edit</button>
                          <button type="button" style={{ background: 'var(--rose)', borderColor: 'var(--rose)' }} onClick={() => deleteMenu(m.id)}>Delete</button>
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

      {/* ── MODAL ARCHITECTURE ── */}
      {showDoc && (
        <div className="modal-backdrop" onClick={() => setShowDoc(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Identification Vault</h2>
              <button type="button" className="modal-close" onClick={() => setShowDoc(null)}>×</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--txt2)', fontSize: '0.9375rem' }}>{showDoc}</p>
              <div className="aadhaar-placeholder">
                <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: 'var(--sp-2)' }}>📄</span>
                Secure Preview Mode Active
              </div>
            </div>
            <div className="modal-foot">
              <button type="button" style={{ background: 'var(--border-dk)', borderColor: 'var(--border-dk)', color: 'var(--txt1)' }} onClick={() => setShowDoc(null)}>Close View</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;