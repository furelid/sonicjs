# SonicJS Forms - Human Testing Scenarios

**Complete manual testing guide for QA and user acceptance testing**

---

## 🎯 Overview

This document provides **step-by-step testing scenarios** for real users to validate all forms functionality before launch. Each scenario includes expected results and pass/fail criteria.

**Time Required:** ~2-3 hours for complete testing  
**Prerequisites:** Access to admin account, browser console open for debugging

---

## 📋 Pre-Test Checklist

Before starting, verify:

- [ ] Development server is running (`pnpm run dev`)
- [ ] Database is migrated (`pnpm run setup:db` in `my-sonicjs-app/`)
- [ ] Admin account credentials are available
- [ ] Browser console is open (F12) to check for errors
- [ ] Test data is prepared (sample emails, phone numbers, addresses)

---

## 🧪 Testing Scenarios

### **Scenario 1: Forms List & Navigation**

**Objective:** Verify forms list page and navigation work correctly

**Steps:**
1. Log in as admin
2. Navigate to **Forms** in admin sidebar
3. Verify page loads without errors
4. Check for "Create New Form" button
5. Verify any existing forms are displayed
6. Click on a form to edit (if any exist)

**Expected Results:**
- ✅ Forms page loads with title "Forms"
- ✅ "Create New Form" button is visible
- ✅ Table/list of forms is displayed (or empty state)
- ✅ No console errors
- ✅ Clicking form navigates to builder

**Pass/Fail:** ☐ PASS ☐ FAIL  
**Notes:**

---

### **Scenario 2: Create New Form**

**Objective:** Test form creation flow

**Steps:**
1. From forms list, click "Create New Form"
2. Fill in form details:
   - **Name:** `test_contact_form` (lowercase, underscores only)
   - **Display Name:** `Test Contact Form`
   - **Description:** `Testing form creation`
   - **Category:** `general`
3. Click "Create Form" button
4. Wait for redirect to builder

**Expected Results:**
- ✅ Form creation page loads
- ✅ All fields are visible and editable
- ✅ Redirects to builder after creation
- ✅ Builder loads with empty form
- ✅ No console errors

**Pass/Fail:** ☐ PASS ☐ FAIL  
**Notes:**

---

### **Scenario 3: Form Name Validation**

**Objective:** Verify form name validation rules

**Steps:**
1. Click "Create New Form"
2. Try each invalid name:
   - `Test Form` (spaces)
   - `test-form` (hyphens)
   - `TestForm` (uppercase)
   - `test@form` (special characters)
3. Verify error messages appear
4. Try valid name: `valid_form_name`
5. Verify it's accepted

**Expected Results:**
- ✅ Invalid names show error message
- ✅ Error message mentions "lowercase letters, numbers, underscores"
- ✅ Valid names are accepted
- ✅ Form doesn't submit with invalid name

**Pass/Fail:** ☐ PASS ☐ FAIL  
**Notes:**

---

### **Scenario 4: Duplicate Form Prevention**

**Objective:** Verify duplicate form names are prevented

**Steps:**
1. Note the name of an existing form (or create one first)
2. Click "Create New Form"
3. Enter the same name as existing form
4. Try to submit
5. Verify error message

**Expected Results:**
- ✅ Error message appears
- ✅ Message mentions "already exists"
- ✅ Form is not created
- ✅ User stays on creation page

**Pass/Fail:** ☐ PASS ☐ FAIL  
**Notes:**

---

### **Scenario 5: Form Builder Interface**

**Objective:** Verify Form.io builder loads and functions

**Steps:**
1. Open an existing form or create new one
2. Wait for builder to fully load (may take 5-10 seconds)
3. Verify components sidebar is visible
4. Check for component groups:
   - Basic
   - Advanced
   - Layout
   - Data
   - Premium
5. Verify canvas area is visible

**Expected Results:**
- ✅ Builder loads within 15 seconds
- ✅ All component groups are visible
- ✅ Components can be clicked
- ✅ Canvas/drop area is visible
- ✅ No console errors
- ✅ Loading spinner disappears

**Pass/Fail:** ☐ PASS ☐ FAIL  
**Notes:**

---

### **Scenario 6: Display Type Toggle**

**Objective:** Test single-page vs wizard mode toggle

**Steps:**
1. In form builder, locate display type toggle at top
2. Verify "Single Page" and "Multi-Page Wizard" buttons
3. Click "Multi-Page Wizard"
4. Verify:
   - Button becomes active/highlighted
   - Hint text appears about using Panel components
5. Click "Single Page" to toggle back
6. Verify button state changes

**Expected Results:**
- ✅ Toggle buttons are visible
- ✅ Single Page is active by default
- ✅ Clicking changes active state
- ✅ Wizard mode shows hint message
- ✅ Toggle works both ways

**Pass/Fail:** ☐ PASS ☐ FAIL  
**Notes:**

---

### **Scenario 7: Drag & Drop Components**

**Objective:** Test adding components to form

**Steps:**
1. In builder, locate "Text Field" in Basic components
2. Drag it to the canvas area
3. Drop it (wait for it to appear)
4. Verify component appears in builder
5. Try adding more components:
   - Email (Basic)
   - Text Area (Basic)
   - Checkbox (Basic)

**Expected Results:**
- ✅ Components can be dragged
- ✅ Drop zones are visible during drag
- ✅ Components appear after drop
- ✅ Multiple components can be added
- ✅ Components are editable (Edit/Copy/Remove buttons visible)

**Pass/Fail:** ☐ PASS ☐ FAIL  
**Notes:**

---

### **Scenario 8: Configure Component Properties**

**Objective:** Test editing component settings

**Steps:**
1. Add a Text Field component
2. Click "Edit" button on the component
3. Verify configuration modal opens
4. Edit properties:
   - Change label to "Full Name"
   - Change placeholder to "Enter your name"
   - Check "Required"
5. Save changes
6. Verify changes are reflected

**Expected Results:**
- ✅ Edit modal opens
- ✅ All tabs are accessible (Display, Data, Validation, etc.)
- ✅ Changes are saved
- ✅ Component updates in builder
- ✅ Modal closes after save

**Pass/Fail:** ☐ PASS ☐ FAIL  
**Notes:**

---

### **Scenario 9: Save Form**

**Objective:** Test form saving functionality

**Steps:**
1. Add at least 2 components to form
2. Click "Save Form" button
3. Wait for save to complete
4. Verify success message
5. Refresh page
6. Verify components are still there

**Expected Results:**
- ✅ Save button is visible
- ✅ Shows "Saving..." during save
- ✅ Success notification appears
- ✅ Components persist after refresh
- ✅ No errors in console

**Pass/Fail:** ☐ PASS ☐ FAIL  
**Notes:**

---

### **Scenario 10: Preview Form**

**Objective:** Test form preview functionality

**Steps:**
1. Add several components to form
2. Click "Preview" button
3. Verify modal opens
4. Check preview shows:
   - Form title
   - All components
   - Submit button
5. Try filling out the preview form
6. Close modal

**Expected Results:**
- ✅ Preview modal opens
- ✅ Form renders correctly
- ✅ All components are visible
- ✅ Form is interactive
- ✅ Close button works
- ✅ Background/styling looks good

**Pass/Fail:** ☐ PASS ☐ FAIL  
**Notes:**

---

### **Scenario 11: Create Multi-Page Wizard**

**Objective:** Test wizard form creation

**Steps:**
1. Create new form or edit existing
2. Click "Multi-Page Wizard" button
3. From Layout tab, drag "Panel" component
4. Add Panel, name it "Page 1: Personal Info"
5. Drag Text Field inside the panel
6. Add another Panel named "Page 2: Contact"
7. Drag Email component inside second panel
8. Save form

**Expected Results:**
- ✅ Panels can be added
- ✅ Components can be dragged into panels
- ✅ Multiple panels create multiple pages
- ✅ Panel titles are visible
- ✅ Form saves successfully

**Pass/Fail:** ☐ PASS ☐ FAIL  
**Notes:**

---

### **Scenario 12: View Public Form (Single Page)**

**Objective:** Test public form rendering

**Steps:**
1. Create form with several components
2. Save form
3. Click "View Public Form" button (or navigate to `/forms/{form_name}`)
4. Verify form renders on public page
5. Check that:
   - Title is displayed
   - All components are visible
   - Form is interactive
   - Submit button is present

**Expected Results:**
- ✅ Public form page loads
- ✅ Form title is displayed
- ✅ All components render correctly
- ✅ Components are functional
- ✅ Submit button is visible
- ✅ Page styling looks good

**Pass/Fail:** ☐ PASS ☐ FAIL  
**Notes:**

---

### **Scenario 13: View Public Wizard Form**

**Objective:** Test wizard form on public page

**Steps:**
1. Open a wizard form (with panels) on public page
2. Verify:
   - Only first page is visible
   - "Next" button is present
   - No "Previous" button on first page
3. Click "Next"
4. Verify second page appears
5. Verify "Previous" and "Next" buttons
6. Navigate to last page
7. Verify "Submit" button appears

**Expected Results:**
- ✅ Wizard navigation works
- ✅ Progress indicator shows current page
- ✅ Previous/Next buttons function
- ✅ Submit only on last page
- ✅ Pages transition smoothly

**Pass/Fail:** ☐ PASS ☐ FAIL  
**Notes:**

---

### **Scenario 14: Submit Form Data**

**Objective:** Test form submission

**Steps:**
1. Open a public form
2. Fill in all required fields with test data:
   - Name: `Test User`
   - Email: `test@example.com`
   - Message: `This is a test submission`
3. Click Submit
4. Wait for response
5. Verify success message appears
6. Verify form clears or shows success

**Expected Results:**
- ✅ Submit button works
- ✅ Shows loading state during submission
- ✅ Success message appears
- ✅ No errors in console
- ✅ Form handles success gracefully

**Pass/Fail:** ☐ PASS ☐ FAIL  
**Notes:**

---

### **Scenario 15: Form Validation**

**Objective:** Test required field validation

**Steps:**
1. Open a form with required fields
2. Try to submit without filling required fields
3. Verify validation errors appear
4. Fill in fields one by one
5. Verify errors clear as fields are filled
6. Submit valid form

**Expected Results:**
- ✅ Cannot submit with empty required fields
- ✅ Validation messages appear
- ✅ Invalid fields are highlighted
- ✅ Validation clears when filled correctly
- ✅ Valid form submits successfully

**Pass/Fail:** ☐ PASS ☐ FAIL  
**Notes:**

---

### **Scenario 16: View Submissions in Admin**

**Objective:** Test submission viewing

**Steps:**
1. After submitting test form (Scenario 14)
2. Go to admin forms list
3. Find your test form
4. Click "View Submissions"
5. Verify submission appears in list
6. Check submission details

**Expected Results:**
- ✅ Submissions page loads
- ✅ Test submission is listed
- ✅ Submission data is displayed
- ✅ Timestamp is shown
- ✅ Can view submission details

**Pass/Fail:** ☐ PASS ☐ FAIL  
**Notes:**

---

### **Scenario 17: Headless API - Get Form Schema**

**Objective:** Test JSON API endpoint

**Steps:**
1. Open browser dev tools (F12)
2. Go to Console tab
3. Run this code (replace `form_name`):
```javascript
fetch('/forms/test_contact_form/schema')
  .then(r => r.json())
  .then(data => {
    console.log('Form Schema:', data)
    console.log('✅ API works!' if data.schema else '❌ API failed')
  })
```
4. Verify response structure

**Expected Results:**
- ✅ API returns 200 status
- ✅ Response contains:
  - `id`, `name`, `displayName`
  - `schema` object with `components` array
  - `settings` object
  - `submitUrl` string
- ✅ No CORS errors

**Pass/Fail:** ☐ PASS ☐ FAIL  
**Notes:**

---

### **Scenario 18: Headless API - Submit via API**

**Objective:** Test form submission API

**Steps:**
1. Get form ID from admin (or use name)
2. In browser console, run:
```javascript
fetch('/api/forms/YOUR_FORM_ID/submit', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    data: {
      name: 'API Test',
      email: 'api@example.com',
      message: 'Submitted via API'
    }
  })
})
  .then(r => r.json())
  .then(data => console.log('Submission result:', data))
```
3. Verify response

**Expected Results:**
- ✅ API returns 200 status
- ✅ Response contains:
  - `success: true`
  - `submissionId`
  - `message`
- ✅ Submission appears in admin

**Pass/Fail:** ☐ PASS ☐ FAIL  
**Notes:**

---

### **Scenario 19: File Upload Component** (Optional - Requires R2)

**Objective:** Test file upload functionality

**Steps:**
1. Add File component to form
2. Configure:
   - File Types: `.pdf, .jpg, .png`
   - Storage: `r2`
3. Save form
4. On public form, upload a test file
5. Submit form
6. Verify file is stored

**Expected Results:**
- ✅ File component appears
- ✅ File picker works
- ✅ File uploads successfully
- ✅ Form submits with file reference
- ✅ File is stored in R2

**Pass/Fail:** ☐ PASS ☐ FAIL ☐ N/A (R2 not configured)  
**Notes:**

---

### **Scenario 20: Address Component with Google Maps** (Optional - Requires API Key)

**Objective:** Test address component

**Steps:**
1. Add Address component to form
2. Edit component settings
3. Set Google Maps API key in `map.key` field
4. Save form
5. On public form, start typing an address
6. Verify autocomplete suggestions appear

**Expected Results:**
- ✅ Address component appears
- ✅ Google Maps autocomplete works
- ✅ Can select address from dropdown
- ✅ Address data is captured
- ✅ No API key errors in console

**Pass/Fail:** ☐ PASS ☐ FAIL ☐ N/A (API key not configured)  
**Notes:**

---

### **Scenario 21: Delete Form**

**Objective:** Test form deletion

**Steps:**
1. Go to forms list
2. Find a test form to delete
3. Click "Delete" button
4. Confirm deletion (if prompted)
5. Verify form is removed from list
6. Try to access deleted form's public URL
7. Verify 404 error

**Expected Results:**
- ✅ Delete button works
- ✅ Confirmation dialog appears (if implemented)
- ✅ Form is removed from list
- ✅ Public URL returns 404
- ✅ No orphaned data

**Pass/Fail:** ☐ PASS ☐ FAIL  
**Notes:**

---

### **Scenario 22: Browser Compatibility**

**Objective:** Test in multiple browsers

**Steps:**
1. Test key scenarios in:
   - Chrome/Chromium
   - Firefox
   - Safari (if available)
   - Mobile browser
2. Focus on:
   - Form builder UI
   - Drag & drop
   - Public form rendering
   - Form submission

**Expected Results:**
- ✅ Works in Chrome
- ✅ Works in Firefox
- ✅ Works in Safari
- ✅ Mobile responsive
- ✅ No browser-specific errors

**Pass/Fail:** ☐ PASS ☐ FAIL  
**Browsers Tested:**

---

### **Scenario 23: Mobile Responsiveness**

**Objective:** Test on mobile devices

**Steps:**
1. Open public form on mobile device or resize browser to mobile width
2. Verify:
   - Form is readable
   - Components are touch-friendly
   - Submit button is accessible
3. Fill and submit form
4. Test form builder on tablet (optional)

**Expected Results:**
- ✅ Form scales to mobile
- ✅ All components are usable
- ✅ Text is readable
- ✅ Buttons are tap-friendly
- ✅ Submission works on mobile

**Pass/Fail:** ☐ PASS ☐ FAIL  
**Notes:**

---

### **Scenario 24: Performance**

**Objective:** Test loading times and responsiveness

**Steps:**
1. Create form with 20+ components
2. Time how long builder takes to load
3. Time how long public form takes to render
4. Test form submission speed
5. Check browser performance tab for issues

**Expected Results:**
- ✅ Builder loads in < 15 seconds
- ✅ Public form loads in < 5 seconds
- ✅ Submission completes in < 3 seconds
- ✅ No memory leaks
- ✅ No excessive CPU usage

**Pass/Fail:** ☐ PASS ☐ FAIL  
**Load Times:**
- Builder: ___ seconds
- Public form: ___ seconds
- Submission: ___ seconds

---

### **Scenario 25: Error Handling**

**Objective:** Test error scenarios

**Steps:**
1. Try to access non-existent form: `/forms/fake_form_name`
2. Try to submit to non-existent form via API
3. Try to edit form without authentication
4. Try to create form with malformed data

**Expected Results:**
- ✅ Non-existent forms show 404
- ✅ API returns appropriate error codes
- ✅ Auth required for admin routes
- ✅ Validation errors are clear
- ✅ No crashes or white screens

**Pass/Fail:** ☐ PASS ☐ FAIL  
**Notes:**

---

## 📊 Test Summary

### Overall Results

Total Scenarios: 25  
Passed: ___  
Failed: ___  
N/A: ___  

**Pass Rate:** ____%

### Critical Issues Found

1. 
2. 
3. 

### Minor Issues Found

1. 
2. 
3. 

### Browser Compatibility Matrix

| Feature | Chrome | Firefox | Safari | Mobile |
|---------|--------|---------|--------|--------|
| Form Builder | ☐ | ☐ | ☐ | ☐ |
| Public Forms | ☐ | ☐ | ☐ | ☐ |
| Submissions | ☐ | ☐ | ☐ | ☐ |
| API | ☐ | ☐ | ☐ | ☐ |

---

## ✅ Launch Readiness Checklist

Before launching forms to production:

### Functionality
- [ ] All PASS criteria met
- [ ] No critical bugs
- [ ] Mobile responsive
- [ ] Browser compatible

### Performance
- [ ] Builder loads in < 15 sec
- [ ] Public forms load in < 5 sec
- [ ] No memory leaks

### Security
- [ ] Auth required for admin
- [ ] Public forms properly sandboxed
- [ ] Input sanitized
- [ ] No XSS vulnerabilities

### Documentation
- [ ] User guide created
- [ ] API docs complete
- [ ] Known issues documented

### Infrastructure
- [ ] Database migrations tested
- [ ] Backups configured
- [ ] Monitoring in place

---

## 🎯 Sign-Off

**Tester Name:** _______________  
**Date:** _______________  
**Recommendation:** ☐ Ready for Launch ☐ Needs Fixes ☐ Major Issues

**Notes:**

---

**Testing Tips:**
1. Use browser private/incognito mode for clean tests
2. Clear localStorage between test runs
3. Keep console open to catch errors
4. Take screenshots of issues
5. Note exact steps to reproduce bugs
6. Test with realistic data
7. Try to break things!

**Good luck with testing!** 🚀
