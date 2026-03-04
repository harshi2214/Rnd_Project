import { useState } from "react";
import { 
Document, 
Packer, 
Paragraph, 
TextRun, 
Table, 
TableRow, 
TableCell, 
WidthType 
} from "docx";
import { saveAs } from "file-saver";
function StudentDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("personal");
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrintPDF = () => {
    setIsPrinting(true);

    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 200);
  };
  const row = (label, value) =>
  new TableRow({
    children: [
      new TableCell({
        width: { size: 40, type: WidthType.PERCENTAGE },
        children: [
          new Paragraph({
            children: [new TextRun({ text: label, bold: true })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 60, type: WidthType.PERCENTAGE },
        children: [new Paragraph(value)],
      }),
    ],
  });
  const handleExportDocx = async () => {
  const doc = new Document({
    sections: [
      {
        children: [

          // ===== TITLE =====
          new Paragraph({
            children: [
              new TextRun({
                text: "MALLA REDDY UNIVERSITY",
                bold: true,
                size: 32,
              }),
            ],
          }),
          new Paragraph("Research & Development Portal – Ph.D Scholar"),
          new Paragraph(""),

          // ===== PERSONAL DETAILS =====
          new Paragraph({
  children: [new TextRun({ text: "PERSONAL DETAILS", bold: true, size: 26 })],
  spacing: { after: 200 },
}),

new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    row("Name", "E KRISHNAVENI REDDY"),
    row("Application No", "2001883"),
    row("Admission Date", "02-01-2021"),
    row("Roll No", "21132CS010002"),
    row("Nationality", "INDIAN"),
    row("Branch", "Part Time (PT)"),
    row("Mobile", "9701798883"),
    row("Official Mail", "phd21cs@mru.edu.in"),
    row("Personal Mail", "ekrishnavenireddy@gmail.com"),
    row("Department", "Computer Science & Engineering"),
  ],
}),
          // ===== ACADEMIC DETAILS =====
          new Paragraph({
  children: [new TextRun({ text: "ACADEMIC DETAILS", bold: true, size: 26 })],
  spacing: { before: 300, after: 200 },
}),

new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    row("Date of Joining", "02-01-2021"),
    row("Type", "Part Time"),
    row("Employment", "College"),
    row("Status", "Continuing"),
  ],
}),

          // ===== SUPERVISOR DETAILS =====
          new Paragraph({
  children: [new TextRun({ text: "SUPERVISOR DETAILS", bold: true, size: 26 })],
  spacing: { before: 300, after: 200 },
}),

new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    row("Supervisor Name", "Dr. Thayyaba Khatoon"),
    row("Department", "CSE, MRU"),
    row("Official Mail", "thayyaba.khatoon@mru.edu.in"),
    row("Personal Mail", "thayyabakhatoon@gmail.com"),
    row("Mobile", "98XXXXXXXX"),
    row("Assigned Date", "01-02-2021"),
  ],
}),

          // ===== CO-SUPERVISOR DETAILS =====
          new Paragraph({
  children: [new TextRun({ text: "CO-SUPERVISOR DETAILS", bold: true, size: 26 })],
  spacing: { before: 300, after: 200 },
}),

new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    row("Co-Supervisor Name", "Dr. XYZ"),
    row("Department", "CSE, MRU"),
    row("Official Mail", "cosupervisor@mru.edu.in"),
    row("Personal Mail", "cosupervisor@gmail.com"),
    row("Mobile", "97XXXXXXXX"),
    row("Assigned Date", "15-03-2021"),
  ],
}),
          // ===== FEES =====
          new Paragraph({
  children: [new TextRun({ text: "FEES DETAILS", bold: true, size: 26 })],
  spacing: { before: 300, after: 200 },
}),

new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    row("Year 1", "Paid"),
    row("Year 2", "Paid"),
    row("Year 3", "Pending"),
    row("Year 4", "Pending"),
  ],
}),

          // ===== COURSE WORK =====
          new Paragraph({
  children: [new TextRun({ text: "COURSE WORK", bold: true, size: 26 })],
  spacing: { before: 300, after: 200 },
}),

new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    row("Student Course Work 1", "Completed (15-06-2022)"),
    row("Student Course Work 2", "Incomplete"),
  ],
}),
          // ===== RRM =====
          new Paragraph({
  children: [new TextRun({ text: "RRM DETAILS", bold: true, size: 26 })],
  spacing: { before: 300, after: 200 },
}),

new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    row("RRM 1", "Completed (15-06-2022)"),
    row("RRM 2", "Incomplete"),
  ],
}),

          // ===== PUBLICATIONS =====
          new Paragraph({
  children: [new TextRun({ text: "PUBLICATIONS", bold: true, size: 26 })],
  spacing: { before: 300, after: 200 },
}),

new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [

    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph("S.No")] }),
        new TableCell({ children: [new Paragraph("Title")] }),
        new TableCell({ children: [new Paragraph("Journal")] }),
        new TableCell({ children: [new Paragraph("Year")] }),
        new TableCell({ children: [new Paragraph("Index")] }),
      ],
    }),

    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph("1")] }),
        new TableCell({ children: [new Paragraph("Machine Learning Based Analysis")] }),
        new TableCell({ children: [new Paragraph("International Journal of AI")] }),
        new TableCell({ children: [new Paragraph("2023")] }),
        new TableCell({ children: [new Paragraph("Scopus")] }),
      ],
    }),

    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph("2")] }),
        new TableCell({ children: [new Paragraph("Deep Learning for Healthcare")] }),
        new TableCell({ children: [new Paragraph("IEEE Access")] }),
        new TableCell({ children: [new Paragraph("2024")] }),
        new TableCell({ children: [new Paragraph("SCI")] }),
      ],
    }),
  ],
}),

          // ===== THESIS & VIVA =====
          new Paragraph({
  children: [new TextRun({ text: "THESIS & VIVA DETAILS", bold: true, size: 26 })],
  spacing: { before: 300, after: 200 },
}),

new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    row("Colloquium Date", "15-03-2024"),
    row("Colloquium Result", "Passed"),
    row("Proposed Thesis Title", "A Study on Machine Learning Models for Predictive Analytics"),
    row("Thesis Submission Date", "20-01-2025"),
    row("Viva Date", "05-02-2025"),
    row("Viva Completed", "Yes"),
  ],
}),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "PhD_Student_Details.docx");
};

  return (
    <>

      <div style={{ padding: "25px" }}>
        {/* DASHBOARD HEADING */}
        <h2 className="dashboard-title">Student Dashboard</h2>


        {/* SEARCH ROW 1 */}
        <div className="search-section">

  {/* ROW 1 */}
  <div className="search-row">
    <input placeholder="Search by Name / Hall Ticket / Mobile" />
    <button>Search</button>

    <input placeholder="Search by Supervisor Name" />
    <button>Search Sup</button>

    <input placeholder="Fees Due Year (1-4 or blank-any)" />
    <button>Fees Due</button>
  </div>

  {/* ROW 2 */}
  <div className="search-row">
    <select>
      <option>Select field</option>
    </select>

    <input placeholder="Search value for selected field / all fields" />

    <button className="align-btn">Search Field</button>
  </div>

</div>


        {/* ACTION BUTTONS */}
        <div className="action-buttons">
  <button className="btn edit">Edit</button>
  <button className="btn save">Save</button>
  <button className="btn delete">Delete</button>
  <button className="btn add">Add New</button>

  <button className="btn outline">Export CSV</button>
  <button className="btn outline">Import CSV</button>
  <button className="btn outline docx" onClick={handleExportDocx}>
  Export DOCX
</button>

  <button className="btn print" onClick={handlePrintPDF}>
  Print / PDF
</button>
</div>

        {/* TABS */}
        <div className="tab-bar">
          <button onClick={() => setActiveTab("personal")}>Personal Details</button>
          <button onClick={() => setActiveTab("academic")}>Academic Details</button>
          <button onClick={() => setActiveTab("research")}>Research & Supervisors</button>
          <button onClick={() => setActiveTab("fees")}>Fees, Course Work & RRM</button>
          <button onClick={() => setActiveTab("publications")}>Publications & Thesis</button>
        </div>

        {/* TAB CONTENT */}
        <div className="tab-content">
          

{/* ---------------- PERSONAL ---------------- */}
{(activeTab === "personal" || isPrinting) && (
  <div className="info-card">
    <h3 className="section-title">Personal Information</h3>
    <p className="supervisor">
      <b>Main Supervisor:</b> Dr. Thayyaba Khatoon
    </p>

    <div className="info-grid">

  {/* Row 1 */}
  <div>
    <label>S. No</label>
    <input value="1" readOnly />
  </div>

  <div>
    <label>Application No</label>
    <input value="2001883" readOnly />
  </div>

  <div>
    <label>Admission Date</label>
    <input value="02-01-2021" readOnly />
  </div>

  {/* Row 2 */}
  <div>
    <label>Name</label>
    <input value="E KRISHNAVENI REDDY" readOnly />
  </div>

  <div>
    <label>Nationality</label>
    <input value="INDIAN" readOnly />
  </div>

  <div>
    <label>School / Branch (FT / PT)</label>
    <input value="Part Time (PT)" readOnly />
  </div>

  {/* Row 3 */}
  <div>
    <label>Roll No</label>
    <input value="21132CS010002" readOnly />
  </div>

  <div>
    <label>Mobile</label>
    <input value="9701798883" readOnly />
  </div>

  <div>
    <label>Student Official Mail ID</label>
    <input value="phd21cs@mru.edu.in" readOnly />
  </div>

  {/* Row 4 */}
  <div>
    <label>Personal Email ID</label>
    <input value="ekrishnavenireddy@gmail.com" readOnly />
  </div>

  <div>
    <label>Aadhar</label>
    <input value="8550 8107 2518" readOnly />
  </div>

  <div>
    <label>Passport</label>
    <input value="-" readOnly />
  </div>

  {/* Row 5 */}
  <div>
    <label>UG</label>
    <input value="B.Tech (CSE)" readOnly />
  </div>

  <div>
    <label>PG</label>
    <input value="M.Tech (CSE)" readOnly />
  </div>

  <div>
    <label>Department</label>
    <input value="Computer Science & Engineering" readOnly />
  </div>

</div>
  </div>
)}

{/* ---------------- ACADEMIC ---------------- */}
{(activeTab === "academic" || isPrinting) && (
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
{(activeTab === "research" || isPrinting) && (
  <>
    {/* ================= SUPERVISOR DETAILS ================= */}
    <div className="info-card supervisor-card">

      <div className="supervisor-header">
        <h3 className="supervisor-title">Supervisor Details</h3>

        <button className="add-supervisor-btn">
          + Add Supervisor Slot
        </button>
      </div>

      <div className="section-divider"></div>

      <div className="info-grid">

        <div>
          <label>Supervisor Name</label>
          <input value="Dr. Thayyaba Khatoon" readOnly />
        </div>

        <div>
          <label>Department / Organization</label>
          <input value="CSE, MRU" readOnly />
        </div>

        <div>
          <label>Official Mail ID</label>
          <input value="thayyaba.khatoon@mru.edu.in" readOnly />
        </div>

        <div>
          <label>Personal Mail ID</label>
          <input value="thayyabakhatoon@gmail.com" readOnly />
        </div>

        <div>
          <label>Mobile Number</label>
          <input value="98XXXXXXXX" readOnly />
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


    {/* ================= CO-SUPERVISOR DETAILS ================= */}
    <div className="info-card supervisor-card" style={{ marginTop: "30px" }}>

      <div className="supervisor-header">
        <h3 className="supervisor-title">Co-Supervisor Details</h3>

        <button className="add-supervisor-btn">
          + Add Co-Supervisor Slot
        </button>
      </div>

      <div className="section-divider"></div>

      <div className="info-grid">

        <div>
          <label>Co-Supervisor Name</label>
          <input value="Dr. XYZ" readOnly />
        </div>

        <div>
          <label>Department / Organization</label>
          <input value="CSE, MRU" readOnly />
        </div>

        <div>
          <label>Official Mail ID</label>
          <input value="cosupervisor@mru.edu.in" readOnly />
        </div>

        <div>
          <label>Personal Mail ID</label>
          <input value="cosupervisor@gmail.com" readOnly />
        </div>

        <div>
          <label>Mobile Number</label>
          <input value="97XXXXXXXX" readOnly />
        </div>

        <div>
          <label>Assigned Date</label>
          <input value="15-03-2021" readOnly />
        </div>

        <div>
          <label>Leave Date</label>
          <input value="-" readOnly />
        </div>

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
{(activeTab === "fees" || isPrinting) && (
  <div className="info-card">
    <h3 className="section-title">Fees, Course Work & RRM</h3>
    <h4 className="sub-title">Fees</h4>

<div className="info-grid">

  {/* Row 1 */}
  <div>
    <label>Fees – Year 1</label>
    <input value="Paid" readOnly />
  </div>

  <div>
    <label>Fees – Year 2</label>
    <input value="Paid" readOnly />
  </div>

  <div></div>

  {/* Row 2 */}
  <div>
    <label>Fees – Year 3</label>
    <input value="Pending" readOnly />
  </div>

  <div>
    <label>Fees – Year 4</label>
    <input value="Pending" readOnly />
  </div>

  <div></div>

</div>

    {/* COURSE WORK SECTION */}
<h4 className="sub-title" style={{ marginTop: "25px" }}>
  Course Work
</h4>

<div className="info-grid">

  {/* Student Course Work 1 */}
  <div>
    <label>Student Course Work 1 Status</label>
    <input value="Completed" readOnly />
  </div>

  <div>
    <label>Student Course Work 1 Date</label>
    <input value="15-06-2022" readOnly />
  </div>

  <div></div>

  {/* Student Course Work 2 */}
  <div>
    <label>Student Course Work 2 Status</label>
    <input value="Incomplete" readOnly />
  </div>

  <div>
    <label>Student Course Work 2 Date</label>
    <input value="-" readOnly />
  </div>

  <div></div>

</div>
    {/* RRM SECTION */}
<h4 className="sub-title" style={{ marginTop: "25px" }}>
  RRM
</h4>

<div className="info-grid">

  {/* RRM 1 */}
  <div>
    <label>RRM 1 Status</label>
    <input value="Clear" readOnly />
  </div>

  <div>
    <label>RRM 1 Date</label>
    <input value="10-08-2022" readOnly />
  </div>

  <div></div>

  {/* RRM 2 */}
  <div>
    <label>RRM 2 Status</label>
    <input value="Clear" readOnly />
  </div>

  <div>
    <label>RRM 2 Date</label>
    <input value="12-02-2023" readOnly />
  </div>

  <div></div>

  {/* RRM 3 */}
  <div>
    <label>RRM 3 Status</label>
    <input value="Not Clear" readOnly />
  </div>

  <div>
    <label>RRM 3 Date</label>
    <input value="-" readOnly />
  </div>

  <div></div>

</div>
  </div>
)}

{/* ---------------- PUBLICATIONS ---------------- */}
{(activeTab === "publications" || isPrinting) && (
  <div className="info-card">
  <h3 className="section-title">Publications</h3>

  <table className="data-table">
    <thead>
      <tr>
        <th>S. No</th>
        <th>Title of Publication</th>
        <th>Journal Name</th>
        <th>ISSN No</th>
        <th>Year Published</th>
        <th>Index</th>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>1</td>
        <td>Machine Learning Based Analysis</td>
        <td>International Journal of AI</td>
        <td>1234-5678</td>
        <td>2023</td>
        <td>
  <select className="table-dropdown">
    <option>SCI</option>
    <option>SCOPUS</option>
    <option>WOS</option>
    <option>IEEE</option>
    <option>NAAS</option>
  </select>
</td>
      </tr>

      <tr>
        <td>2</td>
        <td>Deep Learning for Healthcare</td>
        <td>IEEE Access</td>
        <td>8765-4321</td>
        <td>2024</td>
        <td>
  <select className="table-dropdown">
    <option>SCI</option>
    <option>SCOPUS</option>
    <option>WOS</option>
    <option>IEEE</option>
    <option>NAAS</option>
  </select>
</td>
      </tr>
    </tbody>
  </table>

    <div className="info-card" style={{ marginTop: "25px" }}>
  <h3 className="section-title">Thesis & Viva Details</h3>

  <div className="info-grid">

    <div>
      <label>Colloquium Date</label>
      <input value="15-03-2024" readOnly />
    </div>

    <div>
      <label>Colloquium Result</label>
      <input value="Passed" readOnly />
    </div>

    <div style={{ gridColumn: "1 / -1" }}>
      <label>Proposed Thesis Title</label>
      <input
        value="A Study on Machine Learning Models for Predictive Analytics"
        readOnly
      />
    </div>

    <div>
      <label>Thesis Submission Date</label>
      <input value="20-01-2025" readOnly />
    </div>

    <div>
      <label>Viva-Voce Examination Date</label>
      <input value="05-02-2025" readOnly />
    </div>

    <div className="viva-radio-group">
  <label className="radio-label">Viva-Voce Completed</label>

  <div className="radio-options">
    <label className="radio-item">
      <input type="radio" name="vivaCompleted" checked readOnly />
      <span>Yes</span>
    </label>

    <label className="radio-item">
      <input type="radio" name="vivaCompleted" readOnly />
      <span>No</span>
    </label>
  </div>
</div>
  </div>
</div>
</div>
)}
{/* Add New Student Floating Button */}
<button className="add-student-btn">
  + Add New Student
</button>
        </div>
      </div>
    </>
);
}

export default StudentDashboard;