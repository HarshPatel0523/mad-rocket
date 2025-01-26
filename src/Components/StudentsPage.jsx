import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Box, Button, Modal, TextField, Table, TableHead, TableRow, TableCell, TableBody, IconButton, MenuItem } from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";

const StudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [editStudent, setEditStudent] = useState(null);
    const [newStudent, setNewStudent] = useState({
        name: "",
        class: "",
        section: "",
        rollNumber: "",
        address: "",
        phone: "",
        email: "",
        guardianName: "",
        dob: "",
        admissionDate: "",
        grade: "",
        extraNotes: "",
    });

    const studentsRef = collection(db, "students");

    useEffect(() => {
        const fetchStudents = async () => {
            const data = await getDocs(studentsRef);
            setStudents(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };
        fetchStudents();
    }, []);

    const validate = (studentData) => {
        let tempErrors = {};

        tempErrors.name = /^[A-Za-z ]+$/.test(studentData.name) ? "" : "Name must only contain characters.";
        tempErrors.class = /^[1-9]$|^1[0-2]$/.test(studentData.class) ? "" : "Class must be between 1 and 12.";
        tempErrors.section = /^[A-E]$/.test(studentData.section) ? "" : "Section must be A, B, C, D, or E.";
        tempErrors.rollNumber = /^[1-9][0-9]?$|^100$/.test(studentData.rollNumber) ? "" : "Roll number must be between 1 and 100.";
        tempErrors.address = studentData.address.length <= 100 ? "" : "Address must not exceed 100 characters.";
        tempErrors.phone = /^[0-9]{10}$/.test(studentData.phone) ? "" : "Phone number must be exactly 10 digits.";
        tempErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentData.email) ? "" : "Invalid email format.";
        tempErrors.guardianName = /^[A-Za-z ]+$/.test(studentData.guardianName) ? "" : "Guardian name must only contain characters.";
        tempErrors.dob = studentData.dob ? "" : "Date of Birth is required.";

        const dob = new Date(studentData.dob);
        const admissionDate = new Date(studentData.admissionDate);
        const minAdmissionDate = new Date(dob);
        minAdmissionDate.setFullYear(minAdmissionDate.getFullYear() + 4);

        tempErrors.admissionDate =
            studentData.admissionDate && admissionDate >= minAdmissionDate && admissionDate <= new Date()
                ? ""
                : "Admission date must be at least 4 years after Date of Birth and not exceed today.";
        tempErrors.grade = /^[A-F]$/.test(studentData.grade) ? "" : "Grade must be A, B, C, D, E, or F.";

        setErrors(tempErrors);

        return Object.values(tempErrors).every((x) => x === "");
    };

    const handleAddStudent = async () => {
        if (validate(newStudent)) {
            await addDoc(studentsRef, newStudent);
            setModalOpen(false);
            setNewStudent({
                name: "", class: "", section: "", rollNumber: "", address: "", 
                phone: "", email: "", guardianName: "", dob: "", 
                admissionDate: "", grade: "", extraNotes: "",
            });
            window.location.reload();
        }
    };

    const handleEditStudent = async () => {
        if (editStudent && validate(editStudent)) {
            await updateDoc(doc(db, "students", editStudent.id), editStudent);
            setModalOpen(false);
            setEditStudent(null);
            // window.location.reload();
        }
    };

    const handleViewStudent = (student) => {
        setEditStudent(student);
        setViewModalOpen(true);
    };

    const handleEditClick = (student) => {
        setEditStudent(student);
        setModalOpen(true); 
    };

    const handleDeleteStudent = async (id) => {
        await deleteDoc(doc(db, "students", id));
        window.location.reload();
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Button variant="contained" color="primary" onClick={() => {
                setEditStudent(null);
                setModalOpen(true);
            }} sx={{ marginBottom: 2 }}>
                Add Student
            </Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Class</TableCell>
                        <TableCell>Section</TableCell>
                        <TableCell>Roll Number</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {students.map((student) => (
                        <TableRow key={student.id}>
                            <TableCell>{student.id}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.class}</TableCell>
                            <TableCell>{student.section}</TableCell>
                            <TableCell>{student.rollNumber}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => handleViewStudent(student)}>
                                    <Visibility />
                                </IconButton>
                                <IconButton onClick={() => handleEditClick(student)}>
                                    <Edit />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteStudent(student.id)}>
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Add Student/Edit Student Modal */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <Box
                    sx={{
                        padding: 4,
                        backgroundColor: "white",
                        margin: "50px auto",
                        width: "80%",
                        maxWidth: "500px",
                        maxHeight: "80vh",
                        overflowY: "auto",
                        borderRadius: 2,
                    }}
                >
                    <TextField
                        fullWidth
                        label="Name"
                        value={editStudent ? editStudent.name : newStudent.name}
                        onChange={(e) => 
                            editStudent 
                                ? setEditStudent({ ...editStudent, name: e.target.value })
                                : setNewStudent({ ...newStudent, name: e.target.value })
                        }
                        margin="normal"
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                    <TextField
                        fullWidth
                        label="Class"
                        type="number"
                        value={editStudent ? editStudent.class : newStudent.class}
                        onChange={(e) => {
                            const value = e.target.value > 12 ? "12" : e.target.value;
                            editStudent 
                                ? setEditStudent({ ...editStudent, class: value })
                                : setNewStudent({ ...newStudent, class: value });
                        }}
                        margin="normal"
                        InputProps={{ inputProps: { min: 1, max: 12 } }}
                        error={!!errors.class}
                        helperText={errors.class}
                    />
                    <TextField
                        fullWidth
                        label="Section"
                        select
                        value={editStudent ? editStudent.section : newStudent.section}
                        onChange={(e) => 
                            editStudent 
                                ? setEditStudent({ ...editStudent, section: e.target.value })
                                : setNewStudent({ ...newStudent, section: e.target.value })
                        }
                        margin="normal"
                        error={!!errors.section}
                        helperText={errors.section}
                    >
                        {['A', 'B', 'C', 'D', 'E'].map((section) => (
                            <MenuItem key={section} value={section}>
                                {section}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        label="Roll Number"
                        type="number"
                        value={editStudent ? editStudent.rollNumber : newStudent.rollNumber}
                        onChange={(e) => 
                            editStudent 
                                ? setEditStudent({ ...editStudent, rollNumber: e.target.value })
                                : setNewStudent({ ...newStudent, rollNumber: e.target.value })
                        }
                        margin="normal"
                        error={!!errors.rollNumber}
                        helperText={errors.rollNumber}
                    />
                    <TextField
                        fullWidth
                        label="Address"
                        value={editStudent ? editStudent.address : newStudent.address}
                        onChange={(e) => 
                            editStudent 
                                ? setEditStudent({ ...editStudent, address: e.target.value })
                                : setNewStudent({ ...newStudent, address: e.target.value })
                        }
                        margin="normal"
                        error={!!errors.address}
                        helperText={errors.address}
                    />
                    <TextField
                        fullWidth
                        label="Phone"
                        type="number"
                        value={editStudent ? editStudent.phone : newStudent.phone}
                        onChange={(e) => 
                            editStudent 
                                ? setEditStudent({ ...editStudent, phone: e.target.value })
                                : setNewStudent({ ...newStudent, phone: e.target.value })
                        }
                        margin="normal"
                        error={!!errors.phone}
                        helperText={errors.phone}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        value={editStudent ? editStudent.email : newStudent.email}
                        onChange={(e) => 
                            editStudent 
                                ? setEditStudent({ ...editStudent, email: e.target.value })
                                : setNewStudent({ ...newStudent, email: e.target.value })
                        }
                        margin="normal"
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        fullWidth
                        label="Guardian Name"
                        value={editStudent ? editStudent.guardianName : newStudent.guardianName}
                        onChange={(e) => 
                            editStudent 
                                ? setEditStudent({ ...editStudent, guardianName: e.target.value })
                                : setNewStudent({ ...newStudent, guardianName: e.target.value })
                        }
                        margin="normal"
                        error={!!errors.guardianName}
                        helperText={errors.guardianName}
                    />
                    <TextField
                        fullWidth
                        label="Date of Birth"
                        type="date"
                        value={editStudent ? editStudent.dob : newStudent.dob}
                        onChange={(e) => 
                            editStudent 
                                ? setEditStudent({ ...editStudent, dob: e.target.value })
                                : setNewStudent({ ...newStudent, dob: e.target.value })
                        }
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.dob}
                        helperText={errors.dob}
                    />
                    <TextField
                        fullWidth
                        label="Admission Date"
                        type="date"
                        value={editStudent ? editStudent.admissionDate : newStudent.admissionDate}
                        onChange={(e) => 
                            editStudent 
                                ? setEditStudent({ ...editStudent, admissionDate: e.target.value })
                                : setNewStudent({ ...newStudent, admissionDate: e.target.value })
                        }
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.admissionDate}
                        helperText={errors.admissionDate}
                    />
                    <TextField
                        fullWidth
                        label="Grade"
                        select
                        value={editStudent ? editStudent.grade : newStudent.grade}
                        onChange={(e) => 
                            editStudent 
                                ? setEditStudent({ ...editStudent, grade: e.target.value })
                                : setNewStudent({ ...newStudent, grade: e.target.value })
                        }
                        margin="normal"
                        error={!!errors.grade}
                        helperText={errors.grade}
                    >
                        {['A', 'B', 'C', 'D', 'E', 'F'].map((grade) => (
                            <MenuItem key={grade} value={grade}>
                                {grade}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        label="Extra Notes"
                        multiline
                        rows={4}
                        value={editStudent ? editStudent.extraNotes : newStudent.extraNotes}
                        onChange={(e) => 
                            editStudent 
                                ? setEditStudent({ ...editStudent, extraNotes: e.target.value })
                                : setNewStudent({ ...newStudent, extraNotes: e.target.value })
                        }
                        margin="normal"
                    />
                    <Button 
                        variant="contained" 
                        onClick={editStudent ? handleEditStudent : handleAddStudent} 
                        sx={{ marginTop: 2 }}
                    >
                        {editStudent ? "Update" : "Submit"}
                    </Button>
                </Box>
            </Modal>

            {/* View Student Modal */}
            <Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)}>
                <Box
                    sx={{
                        padding: 4,
                        backgroundColor: "white",
                        margin: "50px auto",
                        width: "80%",
                        maxWidth: "500px",
                        maxHeight: "80vh",
                        overflowY: "auto",
                        borderRadius: 2,
                    }}
                >
                    <TextField
                        fullWidth
                        label="Name"
                        value={editStudent?.name || ""}
                        margin="normal"
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        fullWidth
                        label="Class"
                        value={editStudent?.class || ""}
                        margin="normal"
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        fullWidth
                        label="Section"
                        value={editStudent?.section || ""}
                        margin="normal"
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        fullWidth
                        label="Roll Number"
                        value={editStudent?.rollNumber || ""}
                        margin="normal"
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        fullWidth
                        label="Address"
                        value={editStudent?.address || ""}
                        margin="normal"
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        fullWidth
                        label="Phone"
                        value={editStudent?.phone || ""}
                        margin="normal"
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        value={editStudent?.email || ""}
                        margin="normal"
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        fullWidth
                        label="Guardian Name"
                        value={editStudent?.guardianName || ""}
                        margin="normal"
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        fullWidth
                        label="Date of Birth"
                        value={editStudent?.dob || ""}
                        margin="normal"
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        fullWidth
                        label="Admission Date"
                        value={editStudent?.admissionDate || ""}
                        margin="normal"
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        fullWidth
                        label="Grade"
                        value={editStudent?.grade || ""}
                        margin="normal"
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        fullWidth
                        label="Extra Notes"
                        multiline
                        rows={4}
                        value={editStudent?.extraNotes || ""}
                        margin="normal"
                        InputProps={{ readOnly: true }}
                    />
                    <Button 
                        variant="contained" 
                        onClick={() => setViewModalOpen(false)} 
                        sx={{ marginTop: 2 }}
                    >
                        Close
                    </Button>
                </Box>
            </Modal>
        </Box>
    )
}

export default StudentsPage;