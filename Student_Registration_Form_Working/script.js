const form = document.getElementById("registrationForm");
const successMessage = document.getElementById("successMessage");
const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

function getGroup(id) {
  if (id === "gender") {
    return document.querySelector(".gender-group");
  }
  const el = document.getElementById(id);
  return el ? el.closest(".form-group") : null;
}

function error(id, message) {
  const group = getGroup(id);
  const errorEl = document.getElementById(id + "Error");

  if (errorEl) errorEl.textContent = message;
  if (group) group.classList.add("invalid");
}

function clearError(id) {
  const group = getGroup(id);
  const errorEl = document.getElementById(id + "Error");

  if (errorEl) errorEl.textContent = "";
  if (group) group.classList.remove("invalid");
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function validEnrollment(value) {
  return /^[A-Za-z0-9-]{3,20}$/.test(value);
}

function ageFromDOB(value) {
  const today = new Date();
  const birth = new Date(value + "T00:00:00");
  let age = today.getFullYear() - birth.getFullYear();
  const month = today.getMonth() - birth.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function getRegisteredStudents() {
  return JSON.parse(localStorage.getItem("registeredStudents") || "[]");
}

function saveRegisteredStudent(student) {
  const students = getRegisteredStudents();
  students.push(student);
  localStorage.setItem("registeredStudents", JSON.stringify(students));
}

function showSuccess(student) {
  successMessage.classList.add("show");
  successMessage.innerHTML = `
    <div class="success-title">✓ Registration Successful!</div>
    <div class="success-text">All details have been filled successfully.</div>
    <div class="registered-box">
      <div><b>Student Name:</b> ${student.name}</div>
      <div><b>Enrollment No:</b> ${student.enrollment}</div>
      <div><b>Email:</b> ${student.email}</div>
      <div><b>Gender:</b> ${student.gender}</div>
      <div><b>Date of Birth:</b> ${student.dob}</div>
      <div><b>Course:</b> ${student.course}</div>
    </div>
    <div class="already-text">Your account has been registered successfully.</div>
  `;
}

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("studentName").value.trim();
  const enrollment = document.getElementById("enrollment").value.trim();
  const email = document.getElementById("email").value.trim();
  const pass = password.value;
  const dob = document.getElementById("dob").value;
  const course = document.getElementById("course").value;
  const genderElement = document.querySelector('input[name="gender"]:checked');
  const gender = genderElement ? genderElement.value : "";

  let valid = true;

  ["studentName","enrollment","email","password","gender","dob","course"]
    .forEach(clearError);

  successMessage.innerHTML = "";
  successMessage.classList.remove("show");

  if (!name) {
    error("studentName","Student name is required.");
    valid = false;
  } else if (!/^[A-Za-z .'-]{3,60}$/.test(name)) {
    error("studentName","Enter a valid name.");
    valid = false;
  }

  if (!enrollment) {
    error("enrollment","Enrollment number is required.");
    valid = false;
  } else if (!validEnrollment(enrollment)) {
    error("enrollment","Use 3–20 letters, numbers or hyphens.");
    valid = false;
  }

  if (!email) {
    error("email","Email is required.");
    valid = false;
  } else if (!validEmail(email)) {
    error("email","Enter a valid email address.");
    valid = false;
  }

  if (!pass) {
    error("password","Password is required.");
    valid = false;
  } else if (pass.length < 8) {
    error("password","Minimum 8 characters required.");
    valid = false;
  } else if (!/[A-Z]/.test(pass) || !/[a-z]/.test(pass) || !/\d/.test(pass)) {
    error("password","Use uppercase, lowercase and a number.");
    valid = false;
  }

  if (!genderElement) {
    error("gender","Please select a gender.");
    valid = false;
  }

  if (!dob) {
    error("dob","Date of birth is required.");
    valid = false;
  } else {
    const birth = new Date(dob + "T00:00:00");
    const today = new Date();
    today.setHours(0,0,0,0);

    if (birth >= today) {
      error("dob","Date must be in the past.");
      valid = false;
    } else if (ageFromDOB(dob) < 13) {
      error("dob","Student must be at least 13 years old.");
      valid = false;
    }
  }

  if (!course) {
    error("course","Please select a course.");
    valid = false;
  }

  if (!valid) return;

  // Check whether this student is already registered.
  const students = getRegisteredStudents();
  const alreadyRegistered = students.some(student =>
    student.email.toLowerCase() === email.toLowerCase() ||
    student.enrollment.toLowerCase() === enrollment.toLowerCase()
  );

  if (alreadyRegistered) {
    successMessage.classList.add("show");
    successMessage.innerHTML = `
      <div class="already-title">⚠ Already Registered</div>
      <div class="success-text">
        An account with this Email or Enrollment No. is already registered.
      </div>
      <div class="already-text">
        Please use a different Email / Enrollment No.
      </div>
    `;
    return;
  }

  const student = {
    name,
    enrollment,
    email,
    gender,
    dob,
    course,
    registeredAt: new Date().toLocaleString()
  };

  saveRegisteredStudent(student);
  showSuccess(student);

  form.reset();

  document.querySelectorAll(".form-group").forEach(g =>
    g.classList.remove("invalid")
  );
  document.querySelectorAll(".error").forEach(e =>
    e.textContent = ""
  );
});

togglePassword.addEventListener("click", function() {
  const visible = password.type === "text";
  password.type = visible ? "password" : "text";
  togglePassword.textContent = visible ? "◉" : "◌";
});

document.querySelectorAll("input, select").forEach(input => {
  input.addEventListener("input", () => {
    if (input.id) clearError(input.id);
  });
  input.addEventListener("change", () => {
    if (input.id) clearError(input.id);
  });
});

document.querySelectorAll('input[name="gender"]').forEach(radio => {
  radio.addEventListener("change", () => clearError("gender"));
});

form.addEventListener("reset", function() {
  setTimeout(() => {
    document.querySelectorAll(".form-group").forEach(g =>
      g.classList.remove("invalid")
    );
    document.querySelectorAll(".error").forEach(e =>
      e.textContent = ""
    );
    successMessage.innerHTML = "";
    successMessage.classList.remove("show");
  }, 0);
});
