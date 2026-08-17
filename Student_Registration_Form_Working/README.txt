STUDENT REGISTRATION FORM
==========================

FEATURES
--------
- Complete JavaScript form validation
- Registration Successful message
- Shows ALL submitted details after successful registration
- Saves registration in browser localStorage
- Detects duplicate Email or Enrollment No.
- Shows "Already Registered" when the same account is submitted again
- Password show/hide
- Reset button
- Responsive design
- No external images
- No circular image/avatar
- Decorative graphics are CSS based

FILES
-----
index.html
style.css
script.js
README.txt

RUN
---
1. Extract the ZIP.
2. Open the folder in VS Code.
3. Open index.html.
4. Right-click -> Open with Live Server.

REGISTRATION FLOW
-----------------
1. Fill every field.
2. Click Register.
3. If all details are valid, the form shows:
   "Registration Successful!"
4. It also displays:
   Student Name
   Enrollment No
   Email
   Gender
   Date of Birth
   Course
5. The account is stored in localStorage.
6. If the same Email or Enrollment No. is entered again,
   the form displays "Already Registered".

IMPORTANT
---------
This uses browser localStorage, so it is suitable for a frontend
JavaScript project/demo. A real multi-user registration system needs
a backend/database.
