import { useEffect, useState } from "react";
import {
  Document, Packer, Paragraph, TextRun,
  Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType, AlignmentType
} from "docx";
import { saveAs } from "file-saver";
import { fetchAllData, addStudent, deleteStudent } from "../services/api";

// ── helper: clean ISO date strings to readable dates ───────────────────────
function fmtDate(val) {
  if (!val) return "";
  const s = String(val);
  // ISO string like 2022-06-17T18:30:00.000Z → 17-06-2022
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return s;
}

function StudentDashboard() {
  const [activeTab, setActiveTab]           = useState("personal");
  const [isPrinting, setIsPrinting]         = useState(false);
  const [data, setData]                     = useState(null);
  const [isAdding, setIsAdding]             = useState(false);
  const [formData, setFormData]             = useState({});
  const [searchQuery, setSearchQuery]       = useState("");
  const [supSearchQuery, setSupSearchQuery] = useState("");
  const [feesDueYear, setFeesDueYear]       = useState("");
  const [fieldKey, setFieldKey]             = useState("Name");
  const [fieldValue, setFieldValue]         = useState("");
  const [filteredStudent, setFilteredStudent] = useState(null);
  const [isEditing, setIsEditing]           = useState(false);
  const [toast, setToast]                   = useState("");

  // publications list state — used in add/edit mode
  // each item: { Title, Journal, ISSN, Year, Index }
  const [pubList, setPubList] = useState([]);

  useEffect(() => {
    fetchAllData().then((res) => setData(res));
  }, []);

  // ─── toast ───────────────────────────────────────────────────────────────
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  if (!data || !data.students || data.students.length === 0) {
    return <p style={{ padding: 20 }}>Loading data…</p>;
  }

  const student = filteredStudent || data.students[0];
  const rno = String(student?.RollNo || "");

  const sup1   = data.supervisor1?.find((r) => String(r.RollNo) === rno) || {};
  const sup2   = data.supervisor2?.find((r) => String(r.RollNo) === rno) || {};
  const sup3   = data.supervisor3?.find((r) => String(r.RollNo) === rno) || {};
  const coSup  = data.cosupervisor?.find((r) => String(r.RollNo) === rno) || {};
  const research   = data.research?.find((r) => String(r.RollNo) === rno) || {};
  const fees       = data.fees?.find((f) => String(f.RollNo) === rno) || {};
  const coursework = data.coursework?.find((c) => String(c.RollNo) === rno) || {};
  const rrm1   = data.rrm1?.find((r) => String(r.RollNo) === rno) || {};
  const rrm2   = data.rrm2?.find((r) => String(r.RollNo) === rno) || {};
  const rrm3   = data.rrm3?.find((r) => String(r.RollNo) === rno) || {};
  const publications = data.publications?.filter((p) => String(p.RollNo) === rno) || [];
  const thesis = data.thesis?.find((t) => String(t.RollNo) === rno) || {};

  // ─── search handlers ──────────────────────────────────────────────────────
  const handleSearch = () => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) { showToast("Enter a search value"); return; }
    const found = data.students.find((s) =>
      String(s.RollNo || "").toLowerCase().includes(q) ||
      String(s.Name   || "").toLowerCase().includes(q) ||
      String(s.Phone  || "").toLowerCase().includes(q)
    );
    if (found) { setFilteredStudent(found); showToast("Student found"); }
    else { setFilteredStudent(null); showToast("No student found"); }
  };

  const handleSupSearch = () => {
    const q = supSearchQuery.trim().toLowerCase();
    if (!q) { showToast("Enter supervisor name"); return; }
    const allSups = [
      ...(data.supervisor1 || []),
      ...(data.supervisor2 || []),
      ...(data.supervisor3 || []),
    ];
    const match = allSups.find((s) =>
      Object.values(s).some((v) => String(v).toLowerCase().includes(q))
    );
    if (match) {
      const stu = data.students.find((s) => String(s.RollNo) === String(match.RollNo));
      if (stu) { setFilteredStudent(stu); showToast("Student found via supervisor"); }
      else showToast("Supervisor found but student record missing");
    } else {
      setFilteredStudent(null);
      showToast("No student found for that supervisor");
    }
  };

  const handleFeesDue = () => {
    const yr = feesDueYear.trim();
    if (!yr) {
      const found = data.students.find((s) => {
        const f = data.fees?.find((fe) => String(fe.RollNo) === String(s.RollNo)) || {};
        return (
          String(f.Year1 || "").toLowerCase() !== "paid" ||
          String(f.Year2 || "").toLowerCase() !== "paid" ||
          String(f.Year3 || "").toLowerCase() !== "paid" ||
          String(f.Year4 || "").toLowerCase() !== "paid"
        );
      });
      if (found) { setFilteredStudent(found); showToast("Student with fees due found"); }
      else showToast("All students have paid fees");
      return;
    }
    const key = `Year${yr}`;
    const feeRec = data.fees?.find((f) => {
      const val = String(f[key] || "").toLowerCase();
      return val !== "paid" && val !== "";
    });
    if (feeRec) {
      const stu = data.students.find((s) => String(s.RollNo) === String(feeRec.RollNo));
      if (stu) { setFilteredStudent(stu); showToast(`Student with Year ${yr} fees due found`); }
      else showToast("Student record not found");
    } else {
      setFilteredStudent(null);
      showToast(`No student with Year ${yr} fees due`);
    }
  };

  const handleFieldSearch = () => {
    const q = fieldValue.trim().toLowerCase();
    if (!q) { showToast("Enter a search value"); return; }
    const found = data.students.find((s) =>
      String(s[fieldKey] || "").toLowerCase().includes(q)
    );
    if (found) { setFilteredStudent(found); showToast("Student found"); }
    else { setFilteredStudent(null); showToast("No student found"); }
  };

  // ─── input helper ─────────────────────────────────────────────────────────
  const getInputProps = (field, source = student) => ({
    value: isAdding || isEditing ? formData[field] ?? "" : source?.[field] ?? "",
    onChange: (e) => setFormData({ ...formData, [field]: e.target.value }),
    readOnly: !(isAdding || isEditing),
  });

  // ─── pub list helpers ─────────────────────────────────────────────────────
  const addPubRow = () => {
    setPubList([...pubList, { Title: "", Journal: "", ISSN: "", Year: "", Index: "" }]);
  };

  const updatePub = (idx, field, val) => {
    const updated = pubList.map((p, i) => (i === idx ? { ...p, [field]: val } : p));
    setPubList(updated);
  };

  // ─── save ─────────────────────────────────────────────────────────────────
  const handleSaveStudent = async () => {
    if (!formData.RollNo) { showToast("Roll No is required"); return; }
    try {
      const payload = {
        student: {
          RollNo: formData.RollNo, Name: formData.Name,
          ApplicationNo: formData.ApplicationNo, AdmissionDate: formData.AdmissionDate,
          Nationality: formData.Nationality, Branch: formData.Branch,
          Phone: formData.Phone, Email: formData.Email,
          PersonalEmail: formData.PersonalEmail, Department: formData.Department,
          Aadhar: formData.Aadhar, Passport: formData.Passport,
          UG: formData.UG, PG: formData.PG,
          JoiningDate: formData.JoiningDate, LeavingDate: formData.LeavingDate,
          Type: formData.Type, Employment: formData.Employment,
          Pursual: formData.Pursual, Status: formData.Status,
        },
        supervisor1: {
          RollNo: formData.RollNo,
          SupervisorName: formData.SupervisorName,
          SupervisorDept: formData.SupervisorDept,
          SupervisorOfficialEmail: formData.SupervisorOfficialEmail,
          SupervisorPersonalEmail: formData.SupervisorPersonalEmail,
          SupervisorMobile: formData.SupervisorMobile,
          SupervisorAssignedDate: formData.SupervisorAssignedDate,
          SupervisorLeaveDate: formData.SupervisorLeaveDate,
        },
        supervisor2: {
          RollNo: formData.RollNo,
          Supervisor2Name: formData.Supervisor2Name,
          Supervisor2Dept: formData.Supervisor2Dept,
          Supervisor2OfficialEmail: formData.Supervisor2OfficialEmail,
          Supervisor2PersonalEmail: formData.Supervisor2PersonalEmail,
          Supervisor2Mobile: formData.Supervisor2Mobile,
          Supervisor2AssignedDate: formData.Supervisor2AssignedDate,
          Supervisor2LeaveDate: formData.Supervisor2LeaveDate,
        },
        supervisor3: {
          RollNo: formData.RollNo,
          Supervisor3Name: formData.Supervisor3Name,
          Supervisor3Dept: formData.Supervisor3Dept,
          Supervisor3OfficialEmail: formData.Supervisor3OfficialEmail,
          Supervisor3PersonalEmail: formData.Supervisor3PersonalEmail,
          Supervisor3Mobile: formData.Supervisor3Mobile,
          Supervisor3AssignedDate: formData.Supervisor3AssignedDate,
          Supervisor3LeaveDate: formData.Supervisor3LeaveDate,
        },
        cosupervisor: {
          RollNo: formData.RollNo,
          CoSupervisorName: formData.CoSupervisorName,
          CoSupervisorDept: formData.CoSupervisorDept,
          CoSupervisorOfficialEmail: formData.CoSupervisorOfficialEmail,
          CoSupervisorPersonalEmail: formData.CoSupervisorPersonalEmail,
          CoSupervisorMobile: formData.CoSupervisorMobile,
          CoSupervisorAssignedDate: formData.CoSupervisorAssignedDate,
          CoSupervisorLeaveDate: formData.CoSupervisorLeaveDate,
        },
        fees: {
          RollNo: formData.RollNo,
          Year1: formData.Year1, Year2: formData.Year2,
          Year3: formData.Year3, Year4: formData.Year4,
        },
        research: {
          RollNo: formData.RollNo,
          Domain: formData.Domain, ResearchTitle: formData.ResearchTitle,
          Center1: formData.Center1, Center2: formData.Center2,
          NET: formData.NET, ProjectFellowship: formData.ProjectFellowship,
          MRUFellowship: formData.MRUFellowship, Funding: formData.Funding,
          Remark: formData.Remark,
        },
        coursework: {
          RollNo: formData.RollNo,
          CW1Status: formData.CW1Status, CW1Date: formData.CW1Date,
          CW2Status: formData.CW2Status, CW2Date: formData.CW2Date,
        },
        rrm1: { RollNo: formData.RollNo, RRM1Status: formData.RRM1Status, RRM1Date: formData.RRM1Date },
        rrm2: { RollNo: formData.RollNo, RRM2Status: formData.RRM2Status, RRM2Date: formData.RRM2Date },
        rrm3: { RollNo: formData.RollNo, RRM3Status: formData.RRM3Status, RRM3Date: formData.RRM3Date },
        // send publications as a list array — backend appends each row separately
        publications: {
          RollNo: formData.RollNo,
          list: pubList.filter(p => p.Title || p.Journal),
        },
        thesis: {
          RollNo: formData.RollNo,
          ColloquiumDate: formData.ColloquiumDate,
          ColloquiumResult: formData.ColloquiumResult,
          ThesisTitle: formData.ThesisTitle,
          SubmissionDate: formData.SubmissionDate,
          VivaDate: formData.VivaDate,
          VivaCompleted: formData.VivaCompleted,
        },
      };

      const result = await addStudent(payload);
      console.log("API RESPONSE:", result);
      showToast(isEditing ? "Updated Successfully!" : "Student Added Successfully!");
      setIsAdding(false);
      setIsEditing(false);
      setPubList([]);
      const updated = await fetchAllData();
      setData(updated);
    } catch (err) {
      console.error(err);
      showToast("Error saving data");
    }
  };

  // ─── edit prefill ─────────────────────────────────────────────────────────
  const prefillForEdit = () => {
    const newFormData = {
      ...student,
      SupervisorName: sup1.SupervisorName, SupervisorDept: sup1.SupervisorDept,
      SupervisorOfficialEmail: sup1.SupervisorOfficialEmail, SupervisorPersonalEmail: sup1.SupervisorPersonalEmail,
      SupervisorMobile: sup1.SupervisorMobile, SupervisorAssignedDate: sup1.SupervisorAssignedDate,
      SupervisorLeaveDate: sup1.SupervisorLeaveDate,
      Supervisor2Name: sup2.Supervisor2Name, Supervisor2Dept: sup2.Supervisor2Dept,
      Supervisor2OfficialEmail: sup2.Supervisor2OfficialEmail, Supervisor2PersonalEmail: sup2.Supervisor2PersonalEmail,
      Supervisor2Mobile: sup2.Supervisor2Mobile, Supervisor2AssignedDate: sup2.Supervisor2AssignedDate,
      Supervisor2LeaveDate: sup2.Supervisor2LeaveDate,
      Supervisor3Name: sup3.Supervisor3Name, Supervisor3Dept: sup3.Supervisor3Dept,
      Supervisor3OfficialEmail: sup3.Supervisor3OfficialEmail, Supervisor3PersonalEmail: sup3.Supervisor3PersonalEmail,
      Supervisor3Mobile: sup3.Supervisor3Mobile, Supervisor3AssignedDate: sup3.Supervisor3AssignedDate,
      Supervisor3LeaveDate: sup3.Supervisor3LeaveDate,
      CoSupervisorName: coSup.CoSupervisorName, CoSupervisorDept: coSup.CoSupervisorDept,
      CoSupervisorOfficialEmail: coSup.CoSupervisorOfficialEmail, CoSupervisorPersonalEmail: coSup.CoSupervisorPersonalEmail,
      CoSupervisorMobile: coSup.CoSupervisorMobile, CoSupervisorAssignedDate: coSup.CoSupervisorAssignedDate,
      CoSupervisorLeaveDate: coSup.CoSupervisorLeaveDate,
      Year1: fees.Year1, Year2: fees.Year2, Year3: fees.Year3, Year4: fees.Year4,
      Domain: research.Domain, ResearchTitle: research.ResearchTitle,
      Center1: research.Center1, Center2: research.Center2, NET: research.NET,
      ProjectFellowship: research.ProjectFellowship, MRUFellowship: research.MRUFellowship,
      Funding: research.Funding, Remark: research.Remark,
      CW1Status: coursework.CW1Status, CW1Date: coursework.CW1Date,
      CW2Status: coursework.CW2Status, CW2Date: coursework.CW2Date,
      RRM1Status: rrm1.RRM1Status, RRM1Date: rrm1.RRM1Date,
      RRM2Status: rrm2.RRM2Status, RRM2Date: rrm2.RRM2Date,
      RRM3Status: rrm3.RRM3Status, RRM3Date: rrm3.RRM3Date,
      ColloquiumDate: thesis.ColloquiumDate, ColloquiumResult: thesis.ColloquiumResult,
      ThesisTitle: thesis.ThesisTitle, SubmissionDate: thesis.SubmissionDate,
      VivaDate: thesis.VivaDate, VivaCompleted: thesis.VivaCompleted,
    };
    setFormData(newFormData);
    // prefill pub list from existing publications
    setPubList(
      publications.map(p => ({
        Title: p.Title || "", Journal: p.Journal || "",
        ISSN: p.ISSN || "", Year: p.Year || "", Index: p.Index || "",
      }))
    );
    setIsEditing(true);
    setIsAdding(false);
  };

  // ─── print ────────────────────────────────────────────────────────────────
  const handlePrintPDF = () => {
    setIsPrinting(true);
    setTimeout(() => { window.print(); setIsPrinting(false); }, 200);
  };

  // ─── DOCX export (matches Rahul_Sharma_PhD_Details.docx format) ──────────
  const handleExportDocx = async () => {
    const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
    const borders = { top: border, bottom: border, left: border, right: border };
    const TW = 9360; // total table width DXA (US Letter with 1" margins)
    const LW = 3744; // label col ~40%
    const VW = 5616; // value col ~60%

    // Reusable row builder: bold label | plain value
    const trow = (label, value) =>
      new TableRow({
        children: [
          new TableCell({
            borders, width: { size: LW, type: WidthType.DXA },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            shading: { fill: "F2F2F2", type: ShadingType.CLEAR },
            children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 22 })] })],
          }),
          new TableCell({
            borders, width: { size: VW, type: WidthType.DXA },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: String(value || ""), size: 22 })] })],
          }),
        ],
      });

    const sectionHeading = (text) =>
      new Paragraph({
        children: [new TextRun({ text, bold: true, size: 26, color: "1F4E79" })],
        spacing: { before: 300, after: 160 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "1799CC", space: 1 } },
      });

    const makeTable = (rows) =>
      new Table({
        width: { size: TW, type: WidthType.DXA },
        columnWidths: [LW, VW],
        rows,
      });

    // Publications table header row
    const pubHeaderRow = new TableRow({
      children: ["S.No", "Title", "Journal", "ISSN", "Year", "Index"].map((h, i) =>
        new TableCell({
          borders,
          width: { size: [600, 2500, 2000, 1000, 800, 1260][i], type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          shading: { fill: "0D465C", type: ShadingType.CLEAR },
          children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 20, color: "FFFFFF" })] })],
        })
      ),
    });

    const pubDataRows = publications.map((p, i) =>
      new TableRow({
        children: [
          String(i + 1), p.Title || "", p.Journal || "", p.ISSN || "", String(p.Year || ""), p.Index || ""
        ].map((val, ci) =>
          new TableCell({
            borders,
            width: { size: [600, 2500, 2000, 1000, 800, 1260][ci], type: WidthType.DXA },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: val, size: 20 })] })],
          })
        ),
      })
    );

    const children = [
      // ── TITLE ──
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "MALLA REDDY UNIVERSITY", bold: true, size: 32, color: "0D1B2A" })],
        spacing: { after: 80 },
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Research & Development Portal – Ph.D Scholar", size: 22, italics: true })],
        spacing: { after: 300 },
      }),

      // ── PERSONAL ──
      sectionHeading("PERSONAL DETAILS"),
      makeTable([
        trow("Name", student.Name),
        trow("Application No", student.ApplicationNo),
        trow("Admission Date", fmtDate(student.AdmissionDate)),
        trow("Roll No", student.RollNo),
        trow("Nationality", student.Nationality),
        trow("Branch", student.Branch),
        trow("Mobile", student.Phone),
        trow("Official Mail", student.Email),
        trow("Personal Mail", student.PersonalEmail),
        trow("Department", student.Department),
        trow("Aadhar", student.Aadhar),
        trow("Passport", student.Passport),
        trow("UG", student.UG),
        trow("PG", student.PG),
      ]),

      // ── ACADEMIC ──
      sectionHeading("ACADEMIC DETAILS"),
      makeTable([
        trow("Joining Date", fmtDate(student.JoiningDate)),
        trow("Leaving Date", fmtDate(student.LeavingDate)),
        trow("Type", student.Type),
        trow("Employment", student.Employment),
        trow("Pursual", student.Pursual),
        trow("Status", student.Status),
      ]),

      // ── SUPERVISOR 1 ──
      sectionHeading("SUPERVISOR 1 DETAILS"),
      makeTable([
        trow("Supervisor Name", sup1.SupervisorName),
        trow("Department", sup1.SupervisorDept),
        trow("Official Email", sup1.SupervisorOfficialEmail),
        trow("Personal Email", sup1.SupervisorPersonalEmail),
        trow("Mobile", sup1.SupervisorMobile),
        trow("Assigned Date", fmtDate(sup1.SupervisorAssignedDate)),
        trow("Leave Date", fmtDate(sup1.SupervisorLeaveDate)),
      ]),

      // ── SUPERVISOR 2 ──
      sectionHeading("SUPERVISOR 2 DETAILS"),
      makeTable([
        trow("Supervisor Name", sup2.Supervisor2Name),
        trow("Department", sup2.Supervisor2Dept),
        trow("Official Email", sup2.Supervisor2OfficialEmail),
        trow("Personal Email", sup2.Supervisor2PersonalEmail),
        trow("Mobile", sup2.Supervisor2Mobile),
        trow("Assigned Date", fmtDate(sup2.Supervisor2AssignedDate)),
        trow("Leave Date", fmtDate(sup2.Supervisor2LeaveDate)),
      ]),

      // ── SUPERVISOR 3 ──
      sectionHeading("SUPERVISOR 3 DETAILS"),
      makeTable([
        trow("Supervisor Name", sup3.Supervisor3Name),
        trow("Department", sup3.Supervisor3Dept),
        trow("Official Email", sup3.Supervisor3OfficialEmail),
        trow("Personal Email", sup3.Supervisor3PersonalEmail),
        trow("Mobile", sup3.Supervisor3Mobile),
        trow("Assigned Date", fmtDate(sup3.Supervisor3AssignedDate)),
        trow("Leave Date", fmtDate(sup3.Supervisor3LeaveDate)),
      ]),

      // ── CO-SUPERVISOR ──
      sectionHeading("CO-SUPERVISOR DETAILS"),
      makeTable([
        trow("Co-Supervisor Name", coSup.CoSupervisorName),
        trow("Department", coSup.CoSupervisorDept),
        trow("Official Email", coSup.CoSupervisorOfficialEmail),
        trow("Personal Email", coSup.CoSupervisorPersonalEmail),
        trow("Mobile", coSup.CoSupervisorMobile),
        trow("Assigned Date", fmtDate(coSup.CoSupervisorAssignedDate)),
        trow("Leave Date", fmtDate(coSup.CoSupervisorLeaveDate)),
      ]),

      // ── FEES ──
      sectionHeading("FEES DETAILS"),
      makeTable([
        trow("Year 1", fees.Year1),
        trow("Year 2", fees.Year2),
        trow("Year 3", fees.Year3),
        trow("Year 4", fees.Year4),
      ]),

      // ── COURSE WORK ──
      sectionHeading("COURSE WORK"),
      makeTable([
        trow("Coursework 1", `${coursework.CW1Status || ""} ${coursework.CW1Date ? "(" + fmtDate(coursework.CW1Date) + ")" : ""}`.trim()),
        trow("Coursework 2", `${coursework.CW2Status || ""} ${coursework.CW2Date ? "(" + fmtDate(coursework.CW2Date) + ")" : ""}`.trim()),
      ]),

      // ── RRM ──
      sectionHeading("RRM DETAILS"),
      makeTable([
        trow("RRM 1", `${rrm1.RRM1Status || ""} ${rrm1.RRM1Date ? "(" + fmtDate(rrm1.RRM1Date) + ")" : ""}`.trim()),
        trow("RRM 2", `${rrm2.RRM2Status || ""} ${rrm2.RRM2Date ? "(" + fmtDate(rrm2.RRM2Date) + ")" : ""}`.trim()),
        trow("RRM 3", `${rrm3.RRM3Status || ""} ${rrm3.RRM3Date ? "(" + fmtDate(rrm3.RRM3Date) + ")" : ""}`.trim()),
      ]),

      // ── PUBLICATIONS ──
      sectionHeading("PUBLICATIONS"),
      ...(publications.length > 0
        ? [new Table({
            width: { size: TW, type: WidthType.DXA },
            columnWidths: [600, 2500, 2000, 1000, 800, 1260],
            rows: [pubHeaderRow, ...pubDataRows],
          })]
        : [new Paragraph({ children: [new TextRun({ text: "No publications on record.", size: 22, italics: true })] })]),

      // ── THESIS ──
      sectionHeading("THESIS DETAILS"),
      makeTable([
        trow("Colloquium Date", fmtDate(thesis.ColloquiumDate)),
        trow("Result", thesis.ColloquiumResult),
        trow("Title", thesis.ThesisTitle),
        trow("Submission Date", fmtDate(thesis.SubmissionDate)),
        trow("Viva Date", fmtDate(thesis.VivaDate)),
        trow("Viva Completed", thesis.VivaCompleted),
      ]),
    ];

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            size: { width: 12240, height: 15840 },
            margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
          },
        },
        children,
      }],
    });

    const blob = await Packer.toBlob(doc);
    const name = `${String(student.Name || "Student").replace(/\s+/g, "_")}_PhD_Details.docx`;
    saveAs(blob, name);
    showToast("DOCX downloaded!");
  };

  // ─── CSV / Excel export ───────────────────────────────────────────────────
  const escapeCsv = (val) => {
    const s = String(val ?? "");
    if (s.includes(",") || s.includes('"') || s.includes("\n"))
      return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const handleExportCSV = () => {
    const headers = [
      "RollNo","Name","ApplicationNo","AdmissionDate","Nationality","Branch","Phone","Email",
      "PersonalEmail","Department","Aadhar","Passport","UG","PG","JoiningDate","LeavingDate",
      "Type","Employment","Pursual","Status",
      "Sup1Name","Sup1Dept","Sup1Email","Sup1Mobile","Sup1Assigned",
      "Sup2Name","Sup2Dept","Sup2Email","Sup2Mobile","Sup2Assigned",
      "Sup3Name","Sup3Dept","Sup3Email","Sup3Mobile","Sup3Assigned",
      "CoSupName","CoSupDept","CoSupEmail","CoSupMobile","CoSupAssigned",
      "Year1","Year2","Year3","Year4",
      "Domain","ResearchTitle","Center1","Center2","NET","ProjectFellowship","MRUFellowship","Funding","Remark",
      "CW1Status","CW1Date","CW2Status","CW2Date",
      "RRM1Status","RRM1Date","RRM2Status","RRM2Date","RRM3Status","RRM3Date",
      "ColloquiumDate","ColloquiumResult","ThesisTitle","SubmissionDate","VivaDate","VivaCompleted",
    ];
    const rows = data.students.map((s) => {
      const rid = String(s.RollNo);
      const s1 = data.supervisor1?.find((r) => String(r.RollNo) === rid) || {};
      const s2 = data.supervisor2?.find((r) => String(r.RollNo) === rid) || {};
      const s3 = data.supervisor3?.find((r) => String(r.RollNo) === rid) || {};
      const cs = data.cosupervisor?.find((r) => String(r.RollNo) === rid) || {};
      const f  = data.fees?.find((r) => String(r.RollNo) === rid) || {};
      const rs = data.research?.find((r) => String(r.RollNo) === rid) || {};
      const cw = data.coursework?.find((r) => String(r.RollNo) === rid) || {};
      const r1 = data.rrm1?.find((r) => String(r.RollNo) === rid) || {};
      const r2 = data.rrm2?.find((r) => String(r.RollNo) === rid) || {};
      const r3 = data.rrm3?.find((r) => String(r.RollNo) === rid) || {};
      const th = data.thesis?.find((r) => String(r.RollNo) === rid) || {};
      return {
        RollNo: s.RollNo, Name: s.Name, ApplicationNo: s.ApplicationNo,
        AdmissionDate: s.AdmissionDate, Nationality: s.Nationality, Branch: s.Branch,
        Phone: s.Phone, Email: s.Email, PersonalEmail: s.PersonalEmail, Department: s.Department,
        Aadhar: s.Aadhar, Passport: s.Passport, UG: s.UG, PG: s.PG,
        JoiningDate: s.JoiningDate, LeavingDate: s.LeavingDate, Type: s.Type,
        Employment: s.Employment, Pursual: s.Pursual, Status: s.Status,
        Sup1Name: s1.SupervisorName, Sup1Dept: s1.SupervisorDept, Sup1Email: s1.SupervisorOfficialEmail,
        Sup1Mobile: s1.SupervisorMobile, Sup1Assigned: s1.SupervisorAssignedDate,
        Sup2Name: s2.Supervisor2Name, Sup2Dept: s2.Supervisor2Dept, Sup2Email: s2.Supervisor2OfficialEmail,
        Sup2Mobile: s2.Supervisor2Mobile, Sup2Assigned: s2.Supervisor2AssignedDate,
        Sup3Name: s3.Supervisor3Name, Sup3Dept: s3.Supervisor3Dept, Sup3Email: s3.Supervisor3OfficialEmail,
        Sup3Mobile: s3.Supervisor3Mobile, Sup3Assigned: s3.Supervisor3AssignedDate,
        CoSupName: cs.CoSupervisorName, CoSupDept: cs.CoSupervisorDept, CoSupEmail: cs.CoSupervisorOfficialEmail,
        CoSupMobile: cs.CoSupervisorMobile, CoSupAssigned: cs.CoSupervisorAssignedDate,
        Year1: f.Year1, Year2: f.Year2, Year3: f.Year3, Year4: f.Year4,
        Domain: rs.Domain, ResearchTitle: rs.ResearchTitle, Center1: rs.Center1, Center2: rs.Center2,
        NET: rs.NET, ProjectFellowship: rs.ProjectFellowship, MRUFellowship: rs.MRUFellowship,
        Funding: rs.Funding, Remark: rs.Remark,
        CW1Status: cw.CW1Status, CW1Date: cw.CW1Date, CW2Status: cw.CW2Status, CW2Date: cw.CW2Date,
        RRM1Status: r1.RRM1Status, RRM1Date: r1.RRM1Date,
        RRM2Status: r2.RRM2Status, RRM2Date: r2.RRM2Date,
        RRM3Status: r3.RRM3Status, RRM3Date: r3.RRM3Date,
        ColloquiumDate: th.ColloquiumDate, ColloquiumResult: th.ColloquiumResult,
        ThesisTitle: th.ThesisTitle, SubmissionDate: th.SubmissionDate,
        VivaDate: th.VivaDate, VivaCompleted: th.VivaCompleted,
      };
    });
    const csv = [
      headers.map(escapeCsv).join(","),
      ...rows.map((r) => headers.map((h) => escapeCsv(r[h])).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "PhD_Students_All_Data.csv"; a.click();
    URL.revokeObjectURL(url);
    showToast("CSV downloaded!");
  };

  const handleExportExcel = () => {
    const headers = ["RollNo","Name","ApplicationNo","Phone","Email","Department","Status","Sup1Name","Year1","Year2","Year3","Year4","RRM1Status","RRM2Status","RRM3Status"];
    const rows = data.students.map((s) => {
      const rid = String(s.RollNo);
      const s1 = data.supervisor1?.find((r) => String(r.RollNo) === rid) || {};
      const f  = data.fees?.find((r) => String(r.RollNo) === rid) || {};
      const r1 = data.rrm1?.find((r) => String(r.RollNo) === rid) || {};
      const r2 = data.rrm2?.find((r) => String(r.RollNo) === rid) || {};
      const r3 = data.rrm3?.find((r) => String(r.RollNo) === rid) || {};
      return { RollNo: s.RollNo, Name: s.Name, ApplicationNo: s.ApplicationNo,
        Phone: s.Phone, Email: s.Email, Department: s.Department, Status: s.Status,
        Sup1Name: s1.SupervisorName, Year1: f.Year1, Year2: f.Year2, Year3: f.Year3, Year4: f.Year4,
        RRM1Status: r1.RRM1Status, RRM2Status: r2.RRM2Status, RRM3Status: r3.RRM3Status };
    });
    const tsv = [
      headers.join("\t"),
      ...rows.map((r) => headers.map((h) => String(r[h] ?? "").replace(/\t/g, " ")).join("\t")),
    ].join("\n");
    const blob = new Blob([tsv], { type: "application/vnd.ms-excel;charset=utf-16;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "PhD_Students_All_Data.xls"; a.click();
    URL.revokeObjectURL(url);
    showToast("Excel file downloaded!");
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <>
      <div style={{ padding: "25px" }}>

        {toast && <div className="toast">{toast}</div>}

        <h2 className="dashboard-title">Student Dashboard</h2>

        {/* ── SEARCH ─────────────────────────────────────────────────────── */}
        <div className="search-section">
          <div className="search-row">
            <input
              placeholder="Search by Name / RollNo / Mobile"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button onClick={handleSearch}>Search</button>

            <input
              placeholder="Search by Supervisor Name"
              value={supSearchQuery}
              onChange={(e) => setSupSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSupSearch()}
            />
            <button onClick={handleSupSearch}>Search Sup</button>

            <input
              placeholder="Fees Due Year (1-4 or blank=any)"
              value={feesDueYear}
              onChange={(e) => setFeesDueYear(e.target.value)}
            />
            <button onClick={handleFeesDue}>Fees Due</button>
          </div>

          <div className="search-row">
            <select value={fieldKey} onChange={(e) => setFieldKey(e.target.value)}>
              <option value="Name">Name</option>
              <option value="RollNo">Roll No</option>
              <option value="Email">Official Email</option>
              <option value="PersonalEmail">Personal Email</option>
              <option value="Phone">Mobile</option>
              <option value="Department">Department</option>
              <option value="Branch">Branch</option>
              <option value="Type">Type</option>
              <option value="Status">Status</option>
              <option value="Nationality">Nationality</option>
            </select>
            <input
              placeholder="Search value for selected field"
              value={fieldValue}
              onChange={(e) => setFieldValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFieldSearch()}
            />
            <button className="align-btn" onClick={handleFieldSearch}>Search Field</button>
          </div>
        </div>

        {/* ── ACTION BUTTONS ──────────────────────────────────────────────── */}
        <div className="action-buttons">
          <button className="btn edit" onClick={prefillForEdit}>Edit</button>
          <button type="button" className="btn save" onClick={handleSaveStudent}>Save</button>
          <button
            className="btn delete"
            onClick={async () => {
              const rollNo = student?.RollNo;
              if (!rollNo) { showToast("No RollNo found"); return; }
              if (!window.confirm("Delete this student?")) return;
              try {
                await deleteStudent(rollNo);
                showToast("Student deleted successfully");
                const updated = await fetchAllData();
                setData(updated);
                setFilteredStudent(null);
              } catch (err) { console.error(err); showToast("Error deleting student"); }
            }}
          >Delete</button>
          <button className="btn add" onClick={() => { setIsAdding(true); setIsEditing(false); setFormData({}); setPubList([]); }}>
            Add New
          </button>
          <button className="btn outline" onClick={handleExportCSV}>Export CSV</button>
          <button className="btn outline" onClick={handleExportExcel}>Export xlsx</button>
          <button className="btn outline docx" onClick={handleExportDocx}>Export DOCX</button>
          <button className="btn print" onClick={handlePrintPDF}>Print / PDF</button>
        </div>

        {/* ── TABS ────────────────────────────────────────────────────────── */}
        <div className="tab-bar">
          <button onClick={() => setActiveTab("personal")}>Personal Details</button>
          <button onClick={() => setActiveTab("academic")}>Academic Details</button>
          <button onClick={() => setActiveTab("research")}>Research & Supervisors</button>
          <button onClick={() => setActiveTab("fees")}>Fees, Course Work & RRM</button>
          <button onClick={() => setActiveTab("publications")}>Publications & Thesis</button>
        </div>

        {/* ── TAB CONTENT ─────────────────────────────────────────────────── */}
        <div className="tab-content">

          {/* ── PERSONAL ──────────────────────────────────────────────────── */}
          {(activeTab === "personal" || isPrinting) && (
            <div className="info-card">
              <h3 className="section-title">Personal Information</h3>
              <p className="supervisor"><b>Main Supervisor:</b> {sup1?.SupervisorName || ""}</p>
              <div className="info-grid">
                <div><label>S. No</label><input value="1" readOnly /></div>
                <div>
                  <label>Application No</label>
                  <input
                    value={isAdding || isEditing ? formData.ApplicationNo || "" : student?.ApplicationNo || ""}
                    onChange={(e) => setFormData({ ...formData, ApplicationNo: e.target.value })}
                    readOnly={!(isAdding || isEditing)}
                  />
                </div>
                <div><label>Admission Date</label><input {...getInputProps("AdmissionDate")} /></div>
                <div><label>Name</label><input {...getInputProps("Name")} /></div>
                <div><label>Nationality</label><input {...getInputProps("Nationality")} /></div>
                <div><label>School / Branch (FT / PT)</label><input {...getInputProps("Branch")} /></div>
                <div><label>Roll No</label><input {...getInputProps("RollNo")} /></div>
                <div><label>Mobile</label><input {...getInputProps("Phone")} /></div>
                <div><label>Student Official Mail ID</label><input {...getInputProps("Email")} /></div>
                <div><label>Personal Email ID</label><input {...getInputProps("PersonalEmail")} /></div>
                <div><label>Aadhar</label><input {...getInputProps("Aadhar")} /></div>
                <div><label>Passport</label><input {...getInputProps("Passport")} /></div>
                <div><label>UG</label><input {...getInputProps("UG")} /></div>
                <div><label>PG</label><input {...getInputProps("PG")} /></div>
                <div><label>Department</label><input {...getInputProps("Department")} /></div>
              </div>
            </div>
          )}

          {/* ── ACADEMIC ──────────────────────────────────────────────────── */}
          {(activeTab === "academic" || isPrinting) && (
            <div className="info-card">
              <h3 className="section-title">Academic Information</h3>
              <div className="info-grid">
                <div><label>Date of Joining</label><input {...getInputProps("JoiningDate")} /></div>
                <div><label>Date of Leaving</label><input {...getInputProps("LeavingDate")} /></div>
                <div><label>Type</label><input {...getInputProps("Type")} /></div>
                <div><label>Employment</label><input {...getInputProps("Employment")} /></div>
                <div><label>Pursual</label><input {...getInputProps("Pursual")} /></div>
                <div><label>Status</label><input {...getInputProps("Status")} /></div>
              </div>
            </div>
          )}

          {/* ── RESEARCH & SUPERVISORS ────────────────────────────────────── */}
          {(activeTab === "research" || isPrinting) && (
            <>
              {/* Supervisor 1 */}
              <div className="info-card supervisor-card">
                <div className="supervisor-header"><h3 className="supervisor-title">Supervisor 1</h3></div>
                <div className="section-divider"></div>
                <div className="info-grid">
                  <div><label>Name</label><input {...getInputProps("SupervisorName", sup1)} /></div>
                  <div><label>Department / Org</label><input {...getInputProps("SupervisorDept", sup1)} /></div>
                  <div><label>Official Email</label><input {...getInputProps("SupervisorOfficialEmail", sup1)} /></div>
                  <div><label>Personal Email</label><input {...getInputProps("SupervisorPersonalEmail", sup1)} /></div>
                  <div><label>Mobile</label><input {...getInputProps("SupervisorMobile", sup1)} /></div>
                  <div><label>Assigned Date</label><input {...getInputProps("SupervisorAssignedDate", sup1)} /></div>
                  <div><label>Leave Date</label><input {...getInputProps("SupervisorLeaveDate", sup1)} /></div>
                </div>
              </div>

              {/* Supervisor 2 */}
              <div className="info-card supervisor-card" style={{ marginTop: "20px" }}>
                <div className="supervisor-header"><h3 className="supervisor-title">Supervisor 2</h3></div>
                <div className="section-divider"></div>
                <div className="info-grid">
                  <div><label>Name</label><input {...getInputProps("Supervisor2Name", sup2)} /></div>
                  <div><label>Department / Org</label><input {...getInputProps("Supervisor2Dept", sup2)} /></div>
                  <div><label>Official Email</label><input {...getInputProps("Supervisor2OfficialEmail", sup2)} /></div>
                  <div><label>Personal Email</label><input {...getInputProps("Supervisor2PersonalEmail", sup2)} /></div>
                  <div><label>Mobile</label><input {...getInputProps("Supervisor2Mobile", sup2)} /></div>
                  <div><label>Assigned Date</label><input {...getInputProps("Supervisor2AssignedDate", sup2)} /></div>
                  <div><label>Leave Date</label><input {...getInputProps("Supervisor2LeaveDate", sup2)} /></div>
                </div>
              </div>

              {/* Supervisor 3 */}
              <div className="info-card supervisor-card" style={{ marginTop: "20px" }}>
                <div className="supervisor-header"><h3 className="supervisor-title">Supervisor 3</h3></div>
                <div className="section-divider"></div>
                <div className="info-grid">
                  <div><label>Name</label><input {...getInputProps("Supervisor3Name", sup3)} /></div>
                  <div><label>Department / Org</label><input {...getInputProps("Supervisor3Dept", sup3)} /></div>
                  <div><label>Official Email</label><input {...getInputProps("Supervisor3OfficialEmail", sup3)} /></div>
                  <div><label>Personal Email</label><input {...getInputProps("Supervisor3PersonalEmail", sup3)} /></div>
                  <div><label>Mobile</label><input {...getInputProps("Supervisor3Mobile", sup3)} /></div>
                  <div><label>Assigned Date</label><input {...getInputProps("Supervisor3AssignedDate", sup3)} /></div>
                  <div><label>Leave Date</label><input {...getInputProps("Supervisor3LeaveDate", sup3)} /></div>
                </div>
              </div>

              {/* Co-Supervisor */}
              <div className="info-card supervisor-card" style={{ marginTop: "20px" }}>
                <div className="supervisor-header"><h3 className="supervisor-title">Co-Supervisor</h3></div>
                <div className="section-divider"></div>
                <div className="info-grid">
                  <div><label>Name</label><input {...getInputProps("CoSupervisorName", coSup)} /></div>
                  <div><label>Department / Org</label><input {...getInputProps("CoSupervisorDept", coSup)} /></div>
                  <div><label>Official Email</label><input {...getInputProps("CoSupervisorOfficialEmail", coSup)} /></div>
                  <div><label>Personal Email</label><input {...getInputProps("CoSupervisorPersonalEmail", coSup)} /></div>
                  <div><label>Mobile</label><input {...getInputProps("CoSupervisorMobile", coSup)} /></div>
                  <div><label>Assigned Date</label><input {...getInputProps("CoSupervisorAssignedDate", coSup)} /></div>
                  <div><label>Leave Date</label><input {...getInputProps("CoSupervisorLeaveDate", coSup)} /></div>
                </div>
              </div>

              {/* Research */}
              <div className="info-card" style={{ marginTop: "20px" }}>
                <h3 className="section-title">Research & Fellowship</h3>
                <div className="info-grid">
                  <div><label>Field</label><input {...getInputProps("Domain", research)} /></div>
                  <div><label>Topics</label><input {...getInputProps("ResearchTitle", research)} /></div>
                  <div><label>Center 1</label><input {...getInputProps("Center1", research)} /></div>
                  <div><label>Center 2</label><input {...getInputProps("Center2", research)} /></div>
                  <div><label>NET</label><input {...getInputProps("NET", research)} /></div>
                  <div><label>Project Fellowship</label><input {...getInputProps("ProjectFellowship", research)} /></div>
                  <div><label>MRU Fellowship</label><input {...getInputProps("MRUFellowship", research)} /></div>
                  <div><label>Funding</label><input {...getInputProps("Funding", research)} /></div>
                  <div><label>Remark</label><input {...getInputProps("Remark", research)} /></div>
                </div>
              </div>
            </>
          )}

          {/* ── FEES / COURSEWORK / RRM ───────────────────────────────────── */}
          {(activeTab === "fees" || isPrinting) && (
            <div className="info-card">
              <h3 className="section-title">Fees, Course Work & RRM</h3>

              <h4 className="sub-title">Fees</h4>
              <div className="info-grid">
                <div><label>Fees – Year 1</label><input {...getInputProps("Year1", fees)} /></div>
                <div><label>Fees – Year 2</label><input {...getInputProps("Year2", fees)} /></div>
                <div></div>
                <div><label>Fees – Year 3</label><input {...getInputProps("Year3", fees)} /></div>
                <div><label>Fees – Year 4</label><input {...getInputProps("Year4", fees)} /></div>
                <div></div>
              </div>

              <h4 className="sub-title" style={{ marginTop: "25px" }}>Course Work</h4>
              <div className="info-grid">
                <div>
                  <label>Coursework 1 Status</label>
                  <input
                    value={isAdding || isEditing ? formData.CW1Status || "" : coursework?.CW1Status || ""}
                    onChange={(e) => setFormData({ ...formData, CW1Status: e.target.value })}
                    readOnly={!isAdding && !isEditing}
                  />
                </div>
                <div>
                  <label>Coursework 1 Date</label>
                  <input
                    value={isAdding || isEditing ? formData.CW1Date || "" : coursework?.CW1Date || ""}
                    onChange={(e) => setFormData({ ...formData, CW1Date: e.target.value })}
                    readOnly={!isAdding && !isEditing}
                  />
                </div>
                <div></div>
                <div>
                  <label>Coursework 2 Status</label>
                  <input
                    value={isAdding || isEditing ? formData.CW2Status || "" : coursework?.CW2Status || ""}
                    onChange={(e) => setFormData({ ...formData, CW2Status: e.target.value })}
                    readOnly={!isAdding && !isEditing}
                  />
                </div>
                <div>
                  <label>Coursework 2 Date</label>
                  <input
                    value={isAdding || isEditing ? formData.CW2Date || "" : coursework?.CW2Date || ""}
                    onChange={(e) => setFormData({ ...formData, CW2Date: e.target.value })}
                    readOnly={!isAdding && !isEditing}
                  />
                </div>
                <div></div>
              </div>

              <h4 className="sub-title" style={{ marginTop: "25px" }}>RRM</h4>
              <div className="info-grid">
                <div>
                  <label>RRM 1 Status</label>
                  <input
                    value={isAdding || isEditing ? formData.RRM1Status || "" : rrm1?.RRM1Status || ""}
                    onChange={(e) => setFormData({ ...formData, RRM1Status: e.target.value })}
                    readOnly={!isAdding && !isEditing}
                  />
                </div>
                <div>
                  <label>RRM 1 Date</label>
                  <input
                    value={isAdding || isEditing ? formData.RRM1Date || "" : rrm1?.RRM1Date || ""}
                    onChange={(e) => setFormData({ ...formData, RRM1Date: e.target.value })}
                    readOnly={!isAdding && !isEditing}
                  />
                </div>
                <div></div>
                <div>
                  <label>RRM 2 Status</label>
                  <input
                    value={isAdding || isEditing ? formData.RRM2Status || "" : rrm2?.RRM2Status || ""}
                    onChange={(e) => setFormData({ ...formData, RRM2Status: e.target.value })}
                    readOnly={!isAdding && !isEditing}
                  />
                </div>
                <div>
                  <label>RRM 2 Date</label>
                  <input
                    value={isAdding || isEditing ? formData.RRM2Date || "" : rrm2?.RRM2Date || ""}
                    onChange={(e) => setFormData({ ...formData, RRM2Date: e.target.value })}
                    readOnly={!isAdding && !isEditing}
                  />
                </div>
                <div></div>
                <div>
                  <label>RRM 3 Status</label>
                  <input
                    value={isAdding || isEditing ? formData.RRM3Status || "" : rrm3?.RRM3Status || ""}
                    onChange={(e) => setFormData({ ...formData, RRM3Status: e.target.value })}
                    readOnly={!isAdding && !isEditing}
                  />
                </div>
                <div>
                  <label>RRM 3 Date</label>
                  <input
                    value={isAdding || isEditing ? formData.RRM3Date || "" : rrm3?.RRM3Date || ""}
                    onChange={(e) => setFormData({ ...formData, RRM3Date: e.target.value })}
                    readOnly={!isAdding && !isEditing}
                  />
                </div>
                <div></div>
              </div>
            </div>
          )}

          {/* ── PUBLICATIONS & THESIS ─────────────────────────────────────── */}
          {(activeTab === "publications" || isPrinting) && (
            <div className="info-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <h3 className="section-title" style={{ margin: 0 }}>Publications</h3>
                {(isAdding || isEditing) && (
                  <button className="add-supervisor-btn" onClick={addPubRow}>
                    + Add Publication
                  </button>
                )}
              </div>

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
                  {/* View mode: show from Google Sheet */}
                  {!isAdding && !isEditing && publications.map((pub, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td><input value={pub.Title || ""} readOnly /></td>
                      <td><input value={pub.Journal || ""} readOnly /></td>
                      <td><input value={pub.ISSN || ""} readOnly /></td>
                      <td><input value={String(pub.Year || "")} readOnly /></td>
                      <td>
                        <select className="table-dropdown" value={pub.Index || ""} disabled>
                          <option value="">Select</option>
                          <option value="SCI">SCI</option>
                          <option value="SCOPUS">SCOPUS</option>
                          <option value="WOS">WOS</option>
                          <option value="IEEE">IEEE</option>
                          <option value="NAAS">NAAS</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {/* Add / Edit mode: use pubList state */}
                  {(isAdding || isEditing) && pubList.map((pub, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td><input value={pub.Title} onChange={(e) => updatePub(index, "Title", e.target.value)} /></td>
                      <td><input value={pub.Journal} onChange={(e) => updatePub(index, "Journal", e.target.value)} /></td>
                      <td><input value={pub.ISSN} onChange={(e) => updatePub(index, "ISSN", e.target.value)} /></td>
                      <td><input value={pub.Year} onChange={(e) => updatePub(index, "Year", e.target.value)} /></td>
                      <td>
                        <select
                          className="table-dropdown"
                          value={pub.Index}
                          onChange={(e) => updatePub(index, "Index", e.target.value)}
                        >
                          <option value="">Select</option>
                          <option value="SCI">SCI</option>
                          <option value="SCOPUS">SCOPUS</option>
                          <option value="WOS">WOS</option>
                          <option value="IEEE">IEEE</option>
                          <option value="NAAS">NAAS</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Thesis */}
              <div className="info-card" style={{ marginTop: "25px" }}>
                <h3 className="section-title">Thesis & Viva Details</h3>
                <div className="info-grid">
                  <div><label>Colloquium Date</label><input {...getInputProps("ColloquiumDate", thesis)} /></div>
                  <div><label>Colloquium Result</label><input {...getInputProps("ColloquiumResult", thesis)} /></div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label>Proposed Thesis Title</label>
                    <input {...getInputProps("ThesisTitle", thesis)} />
                  </div>
                  <div><label>Thesis Submission Date</label><input {...getInputProps("SubmissionDate", thesis)} /></div>
                  <div><label>Viva-Voce Examination Date</label><input {...getInputProps("VivaDate", thesis)} /></div>
                  <div className="viva-radio-group">
                    <label className="radio-label">Viva-Voce Completed</label>
                    <div className="radio-options">
                      <label className="radio-item">
                        <input
                          type="radio" name="vivaCompleted"
                          checked={(isAdding || isEditing ? formData.VivaCompleted : thesis?.VivaCompleted ?? formData.VivaCompleted) === "Yes"}
                          onChange={() => setFormData({ ...formData, VivaCompleted: "Yes" })}
                          disabled={!isAdding && !isEditing}
                        />
                        <span>Yes</span>
                      </label>
                      <label className="radio-item">
                        <input
                          type="radio" name="vivaCompleted"
                          checked={(isAdding || isEditing ? formData.VivaCompleted : thesis?.VivaCompleted ?? formData.VivaCompleted) === "No"}
                          onChange={() => setFormData({ ...formData, VivaCompleted: "No" })}
                          disabled={!isAdding && !isEditing}
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Floating Add New Student Button */}
      <button
        className="add-student-btn"
        onClick={() => { setIsAdding(true); setIsEditing(false); setFormData({}); setPubList([]); }}
      >
        + Add New Student
      </button>
    </>
  );
}

export default StudentDashboard;