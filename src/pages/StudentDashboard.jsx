import { useState } from "react";

function StudentDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("personal");

  const student = {
    name: "Harshitha Pochiraju",
    roll: "21DS030068",
    dept: "Data Science",
    email: "harshitha@mru.edu.in",
    mobile: "9876543210",
    supervisor: "Dr. A. Rao",
    nationality: "Indian",
    status: "Continuing",
    research: "AI in Healthcare",
    joining: "01-02-2023",
    type: "Full Time",
    fellowship: "Yes",
    fees: "Paid",
    publications: 4,
    remarks: "Good research progress"
  };

  return (
    <div style={{ padding: "30px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  <h2>Student Dashboard</h2>

  <button 
    onClick={onLogout}
    style={{
      background: "#0d465ce3",
      color: "white",
      border: "none",
      padding: "8px 16px",
      borderRadius: "5px",
      cursor: "pointer"
    }}
  >
    Logout
  </button>
</div>

      {/* Tabs */}
      <div className="tab-bar">
        <button onClick={() => setActiveTab("personal")}>Personal Details</button>
        <button onClick={() => setActiveTab("academic")}>Academic Details</button>
        <button onClick={() => setActiveTab("research")}>Research </button>
        <button onClick={() => setActiveTab("fees")}>Fees,Course Work & RRM</button>
        <button onClick={() => setActiveTab("publications")}>Publications & Remarks</button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">

        {activeTab === "personal" && (
  <div className="info-card">

    <h3 className="section-title">
      Personal Information
    </h3>

    <p className="supervisor">
      <b>Main Supervisor:</b> Dr. Thayyaba Khatoon
    </p>

    <div className="info-grid">

      <div>
        <label>Name</label>
        <input value="E KRISHNAVENI REDDY" readOnly />
      </div>

      <div>
        <label>Nationality</label>
        <input value="INDIAN" readOnly />
      </div>

      <div>
        <label>Application No</label>
        <input value="2001883" readOnly />
      </div>

      <div>
        <label>Roll No / Hall Ticket</label>
        <input value="21132CS010002" readOnly />
      </div>

      <div>
        <label>Mobile No</label>
        <input value="9701798883" readOnly />
      </div>

      <div>
        <label>Email ID</label>
        <input value="ekrishnavenireddy@gmail.com" readOnly />
      </div>

      <div>
        <label>Aadhar Card No</label>
        <input value="8550 8107 2518" readOnly />
      </div>

      <div>
        <label>Passport Number</label>
        <input value="-" readOnly />
      </div>

      <div>
        <label>UG</label>
        <input value="B. Tech (CSE)" readOnly />
      </div>

      <div>
        <label>PG</label>
        <input value="M. Tech (CSE)" readOnly />
      </div>

      <div>
        <label>Department</label>
        <input value="Computer Science and Engineering" readOnly />
      </div>

    </div>
  </div>
)}


        {activeTab === "academic" && (
  <div className="info-card">

    <h3 className="section-title">
      Academic Information
    </h3>

    <div className="info-grid">

      <div>
        <label>Date of Joining</label>
        <input value="02.01.2021" readOnly />
      </div>

      <div>
        <label>Date of Leaving</label>
        <input value="-" readOnly />
      </div>

      <div>
        <label>Type (Regular / Part Time)</label>
        <input value="Part Time" readOnly />
      </div>

      <div>
        <label>Place of Employment</label>
        <input value="Write the College Name / Place" readOnly />
      </div>

      <div>
        <label>Pursual of Ph.D (Yes / No)</label>
        <input value="Yes" readOnly />
      </div>

      <div>
        <label>Status (Continuing / Awarded / Discontinued)</label>
        <input value="Continuing" readOnly />
      </div>

    </div>
  </div>
)}


        {activeTab === "research" && (
  <div>

    {/* SUPERVISOR SECTION */}
    <div className="info-card">

      <h3 className="section-title">
        Supervisor Details
      </h3>

      <div className="info-grid">

        <div>
          <label>Supervisor Name</label>
          <input value="Dr. Thayyaba Khatoon" readOnly />
        </div>

        <div>
          <label>Department / Organization</label>
          <input value="Department of CSE, MRU" readOnly />
        </div>

        <div>
          <label>Assigned Date</label>
          <input value="01-02-2021" readOnly />
        </div>

        <div>
          <label>Leave Date</label>
          <input value="-" readOnly />
        </div>

      </div>
    </div>


    {/* RESEARCH & FELLOWSHIP SECTION */}
    <div className="info-card" style={{ marginTop: "25px" }}>

      <h3 className="section-title">
        Research & Fellowship
      </h3>

      <div className="info-grid">

        <div>
          <label>Field / Area</label>
          <input value="Machine Learning" readOnly />
        </div>

        <div>
          <label>Sub Topics</label>
          <input value="AI & Data Science" readOnly />
        </div>

        <div>
          <label>Research Center (1)</label>
          <input value="AI Research Lab" readOnly />
        </div>

        <div>
          <label>Research Center (2)</label>
          <input value="-" readOnly />
        </div>

        <div>
          <label>NET</label>
          <input value="No" readOnly />
        </div>

        <div>
          <label>Project Fellowship</label>
          <input value="Yes" readOnly />
        </div>

        <div>
          <label>MRU Fellowship / TA</label>
          <input value="No" readOnly />
        </div>

        <div>
          <label>Other Funding Agency</label>
          <input value="UGC" readOnly />
        </div>

        <div>
          <label>Fellowship Remark</label>
          <input value="Good research progress" readOnly />
        </div>

      </div>
    </div>

  </div>
)}

        {activeTab === "fees" && (
  <div className="info-card">

    <h3 className="section-title">
      Fees, Course Work & RRM
    </h3>

    {/* FEES SECTION */}
    <h4 className="sub-title">Fees</h4>

    <div className="info-grid">

      <div>
        <label>Fees – I Year</label>
        <input value="Paid" readOnly />
      </div>

      <div>
        <label>Fees – II Year</label>
        <input value="Paid" readOnly />
      </div>

      <div>
        <label>Fees – III Year</label>
        <input value="Pending" readOnly />
      </div>

      <div>
        <label>Fees – IV Year</label>
        <input value="Pending" readOnly />
      </div>

    </div>


    {/* COURSE WORK SECTION */}
    <h4 className="sub-title" style={{ marginTop: "25px" }}>
      Course Work
    </h4>

    <div className="info-grid">

      <div>
        <label>Course Work I</label>
        <input value="Completed" readOnly />
      </div>

      <div>
        <label>Course Work II</label>
        <input value="Completed" readOnly />
      </div>

      <div>
        <label>Course Work III</label>
        <input value="Pending" readOnly />
      </div>

      <div>
        <label>Course Work IV</label>
        <input value="Pending" readOnly />
      </div>

    </div>


    {/* RRM SECTION */}
    <h4 className="sub-title" style={{ marginTop: "25px" }}>
      RRM
    </h4>

    <div className="info-grid">

      <div>
        <label>RRM I</label>
        <input value="Clear" readOnly />
      </div>

      <div>
        <label>RRM II</label>
        <input value="Clear" readOnly />
      </div>

      <div>
        <label>RRM III</label>
        <input value="Not Clear" readOnly />
      </div>

      <div>
        <label>RRM IV</label>
        <input value="Not Attempted" readOnly />
      </div>

      <div>
        <label>RRM V</label>
        <input value="Not Attempted" readOnly />
      </div>

      <div>
        <label>RRM VI</label>
        <input value="Not Attempted" readOnly />
      </div>

      <div>
        <label>RRM VII</label>
        <input value="Not Attempted" readOnly />
      </div>

      <div>
        <label>RRM VIII</label>
        <input value="Not Attempted" readOnly />
      </div>

    </div>

  </div>
)}


        {activeTab === "publications" && (
  <div className="info-card">

    <h3 className="section-title">
      Publications, Conferences & Remarks
    </h3>

    {/* PUBLICATIONS SECTION */}
    <h4 className="sub-title">Publications</h4>

    <div className="info-grid">

      <div>
        <label>Publications – National</label>
        <input value="2" readOnly />
      </div>

      <div>
        <label>Publications – International</label>
        <input value="1" readOnly />
      </div>

      <div>
        <label>Conference Papers</label>
        <input value="3" readOnly />
      </div>

      <div>
        <label>Books</label>
        <input value="0" readOnly />
      </div>

      <div>
        <label>Book Chapters</label>
        <input value="1" readOnly />
      </div>

      <div>
        <label>Magazines</label>
        <input value="0" readOnly />
      </div>

      <div>
        <label>Total Publications</label>
        <input value="4" readOnly />
      </div>

    </div>


    {/* CONFERENCES SECTION */}
    <h4 className="sub-title" style={{ marginTop: "25px" }}>
      Conferences & Activities
    </h4>

    <div className="info-grid">

      <div>
        <label>Conferences – National</label>
        <input value="2" readOnly />
      </div>

      <div>
        <label>Conferences – International</label>
        <input value="1" readOnly />
      </div>

      <div>
        <label>Webinars</label>
        <input value="2" readOnly />
      </div>

      <div>
        <label>FDP</label>
        <input value="1" readOnly />
      </div>

      <div>
        <label>Invited Talks</label>
        <input value="1" readOnly />
      </div>

      <div>
        <label>Total Activities</label>
        <input value="4" readOnly />
      </div>

    </div>


    {/* REMARKS SECTION */}
    <h4 className="sub-title" style={{ marginTop: "25px" }}>
      Remarks
    </h4>

    <div className="info-grid">

      <div>
        <label>General Remarks</label>
        <input value="Active participation" readOnly />
      </div>

      <div>
        <label>Supervisor Remarks</label>
        <input value="Good progress" readOnly />
      </div>

      <div>
        <label>Co-Supervisor Remarks</label>
        <input value="Satisfactory" readOnly />
      </div>

    </div>

  </div>
)}
      </div>
    </div>
  );
}

export default StudentDashboard;
