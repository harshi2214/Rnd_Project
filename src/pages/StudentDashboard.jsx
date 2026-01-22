import { useState } from "react";

function StudentDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <>

      <div style={{ padding: "25px" }}>

        {/* DASHBOARD HEADING */}
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Student Dashboard
        </h2>

        {/* SEARCH ROW 1 */}
        <div className="dash-row">
          <input placeholder="Search by Name / Hall Ticket / Mobile" />
          <button>Search</button>

          <input placeholder="Search by Supervisor Name" />
          <button>Search Sup</button>

          <input placeholder="Fees Due Year (1-4 or blank-any)" />
          <button>Fees Due</button>
        </div>

        {/* SEARCH ROW 2 */}
        <div className="dash-row">
          <select>
            <option>Select field</option>
            <option>Name</option>
            <option>Roll No</option>
            <option>Department</option>
          </select>

          <input placeholder="Search value for selected field / all fields" />
          <button>Search Field</button>
        </div>

        {/* ACTION BUTTONS */}
        <div className="action-bar">

          <button className="edit">Edit</button>
          <button className="save">Save</button>
          <button className="delete">Delete</button>
          <button className="add">Add New</button>

          <button>Export CSV</button>
          <button>Import CSV</button>
          <button>CSV Template</button>
          <button>Export JSON</button>
          <button>Import JSON</button>

          <button className="approve">Approve Pending</button>
          <button className="pending">Pending Requests</button>
          <button className="print">Print / PDF</button>
        </div>

        {/* TABS */}
        <div className="tab-bar">
          <button onClick={() => setActiveTab("personal")}>Personal Details</button>
          <button onClick={() => setActiveTab("academic")}>Academic Details</button>
          <button onClick={() => setActiveTab("research")}>Research & Supervisors</button>
          <button onClick={() => setActiveTab("fees")}>Fees, Course Work & RRM</button>
          <button onClick={() => setActiveTab("publications")}>Publications & Remarks</button>
        </div>

        {/* TAB CONTENT */}
        <div className="tab-content">

{/* ---------------- PERSONAL ---------------- */}
{activeTab === "personal" && (
  <div className="info-card">
    <h3 className="section-title">Personal Information</h3>
    <p className="supervisor">
      <b>Main Supervisor:</b> Dr. Thayyaba Khatoon
    </p>

    <div className="info-grid">
      <div><label>Name</label><input value="E KRISHNAVENI REDDY" readOnly /></div>
      <div><label>Nationality</label><input value="INDIAN" readOnly /></div>
      <div><label>Application No</label><input value="2001883" readOnly /></div>
      <div><label>Roll No</label><input value="21132CS010002" readOnly /></div>
      <div><label>Mobile</label><input value="9701798883" readOnly /></div>
      <div><label>Email</label><input value="ekrishnavenireddy@gmail.com" readOnly /></div>
      <div><label>Aadhar</label><input value="8550 8107 2518" readOnly /></div>
      <div><label>Passport</label><input value="-" readOnly /></div>
      <div><label>UG</label><input value="B.Tech (CSE)" readOnly /></div>
      <div><label>PG</label><input value="M.Tech (CSE)" readOnly /></div>
      <div><label>Department</label><input value="CSE" readOnly /></div>
    </div>
  </div>
)}

{/* ---------------- ACADEMIC ---------------- */}
{activeTab === "academic" && (
  <div className="info-card">
    <h3 className="section-title">Academic Information</h3>

    <div className="info-grid">
      <div><label>Date of Joining</label><input value="02.01.2021" readOnly /></div>
      <div><label>Date of Leaving</label><input value="-" readOnly /></div>
      <div><label>Type</label><input value="Part Time" readOnly /></div>
      <div><label>Employment</label><input value="College" readOnly /></div>
      <div><label>Pursual</label><input value="Yes" readOnly /></div>
      <div><label>Status</label><input value="Continuing" readOnly /></div>
    </div>
  </div>
)}

{/* ---------------- RESEARCH ---------------- */}
{activeTab === "research" && (
  <>
    <div className="info-card">
      <h3 className="section-title">Supervisor Details</h3>
      <div className="info-grid">
        <div><label>Name</label><input value="Dr. Thayyaba Khatoon" readOnly /></div>
        <div><label>Department</label><input value="CSE, MRU" readOnly /></div>
        <div><label>Assigned</label><input value="01-02-2021" readOnly /></div>
        <div><label>Leave</label><input value="-" readOnly /></div>
      </div>
    </div>

    <div className="info-card" style={{ marginTop: "20px" }}>
      <h3 className="section-title">Research & Fellowship</h3>
      <div className="info-grid">
        <div><label>Field</label><input value="Machine Learning" readOnly /></div>
        <div><label>Topics</label><input value="AI" readOnly /></div>
        <div><label>Center 1</label><input value="AI Lab" readOnly /></div>
        <div><label>Center 2</label><input value="-" readOnly /></div>
        <div><label>NET</label><input value="No" readOnly /></div>
        <div><label>Project Fellowship</label><input value="Yes" readOnly /></div>
        <div><label>MRU Fellowship</label><input value="No" readOnly /></div>
        <div><label>Funding</label><input value="UGC" readOnly /></div>
        <div><label>Remark</label><input value="Good" readOnly /></div>
      </div>
    </div>
  </>
)}

{/* ---------------- FEES ---------------- */}
{activeTab === "fees" && (
  <div className="info-card">
    <h3 className="section-title">Fees, Course Work & RRM</h3>
    <h4 className="sub-title">Fees</h4>
    <div className="info-grid">
      <div><label>Year I</label><input value="Paid" readOnly /></div>
      <div><label>Year II</label><input value="Paid" readOnly /></div>
      <div><label>Year III</label><input value="Pending" readOnly /></div>
      <div><label>Year IV</label><input value="Pending" readOnly /></div>
    </div>

    <h4 className="sub-title" style={{ marginTop: "20px" }}>Course Work</h4>
    <div className="info-grid">
      <div><label>CW I</label><input value="Completed" readOnly /></div>
      <div><label>CW II</label><input value="Completed" readOnly /></div>
      <div><label>CW III</label><input value="Pending" readOnly /></div>
      <div><label>CW IV</label><input value="Pending" readOnly /></div>
    </div>

    <h4 className="sub-title" style={{ marginTop: "20px" }}>RRM</h4>
    <div className="info-grid">
      <div><label>RRM I</label><input value="Clear" readOnly /></div>
      <div><label>RRM II</label><input value="Clear" readOnly /></div>
      <div><label>RRM III</label><input value="Not Clear" readOnly /></div>
      <div><label>RRM IV</label><input value="NA" readOnly /></div>
    </div>
  </div>
)}

{/* ---------------- PUBLICATIONS ---------------- */}
{activeTab === "publications" && (
  <div className="info-card">
    <h3 className="section-title">Publications & Remarks</h3>

    <h4 className="sub-title">Publications</h4>
    <div className="info-grid">
      <div><label>National</label><input value="2" readOnly /></div>
      <div><label>International</label><input value="1" readOnly /></div>
      <div><label>Total</label><input value="3" readOnly /></div>
    </div>

    <h4 className="sub-title" style={{ marginTop: "20px" }}>Remarks</h4>
    <div className="info-grid">
      <div><label>General</label><input value="Good" readOnly /></div>
      <div><label>Supervisor</label><input value="Excellent" readOnly /></div>
    </div>
  </div>
)}

        </div>
      </div>
    </>
  );
}

export default StudentDashboard;