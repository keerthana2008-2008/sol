/* =========================================
   CAMPUS ISSUE TRACKER
   Vanilla JavaScript
========================================= */


/* =========================================
   SAMPLE DATA
========================================= */

const sampleIssues = [
    {
        id: 1,
        title: "Classroom Fan Not Working",
        category: "Electrical",
        location: "Block A - Room 204",
        description: "The ceiling fan is not working properly and makes a strange noise.",
        status: "Pending",
        date: "2026-10-01"
    },

    {
        id: 2,
        title: "Water Leakage in Washroom",
        category: "Water",
        location: "Block B - Ground Floor",
        description: "There is continuous water leakage near the wash basin.",
        status: "In Progress",
        date: "2026-10-02"
    },

    {
        id: 3,
        title: "Wi-Fi Connection Unstable",
        category: "Wi-Fi",
        location: "Library - Second Floor",
        description: "Wi-Fi disconnects frequently while accessing online resources.",
        status: "Pending",
        date: "2026-10-03"
    },

    {
        id: 4,
        title: "Broken Classroom Chair",
        category: "Furniture",
        location: "Block C - Room 101",
        description: "One of the classroom chairs has a broken backrest.",
        status: "Resolved",
        date: "2026-09-29"
    },

    {
        id: 5,
        title: "Projector Display Problem",
        category: "Electrical",
        location: "Seminar Hall",
        description: "The projector turns on but does not display the laptop screen.",
        status: "In Progress",
        date: "2026-10-04"
    },

    {
        id: 6,
        title: "Dustbin Overflow",
        category: "Other",
        location: "Canteen Entrance",
        description: "The dustbin near the canteen entrance is frequently overflowing.",
        status: "Resolved",
        date: "2026-09-30"
    }
];


/* =========================================
   LOAD DATA FROM LOCAL STORAGE
========================================= */

// Check whether issues already exist in localStorage
let issues = JSON.parse(localStorage.getItem("campusIssues"));

/*
    If there is no saved data,
    load the six sample issues.
*/
if (!issues) {
    issues = sampleIssues;
    saveIssues();
}


/* =========================================
   DOM ELEMENTS
========================================= */

const issueForm = document.getElementById("issueForm");

const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const locationInput = document.getElementById("location");
const descriptionInput = document.getElementById("description");

const issuesContainer = document.getElementById("issuesContainer");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const statusFilter = document.getElementById("statusFilter");

const adminToggle = document.getElementById("adminToggle");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const resolvedCount = document.getElementById("resolvedCount");

const issueCountText = document.getElementById("issueCountText");

const emptyMessage = document.getElementById("emptyMessage");


/* =========================================
   SAVE DATA
========================================= */

function saveIssues() {
    localStorage.setItem("campusIssues", JSON.stringify(issues));
}


/* =========================================
   DISPLAY ISSUES
========================================= */

function displayIssues() {

    // Clear old cards
    issuesContainer.innerHTML = "";

    // Get filter values
    const searchText = searchInput.value.toLowerCase().trim();

    const selectedCategory = categoryFilter.value;
    const selectedStatus = statusFilter.value;


    /*
        Filter issues based on:
        1. Search text
        2. Category
        3. Status
    */

    const filteredIssues = issues.filter(issue => {

        const matchesSearch =
            issue.title.toLowerCase().includes(searchText) ||
            issue.description.toLowerCase().includes(searchText) ||
            issue.location.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            issue.category === selectedCategory;

        const matchesStatus =
            selectedStatus === "All" ||
            issue.status === selectedStatus;

        return matchesSearch && matchesCategory && matchesStatus;
    });


    // Update number of displayed issues
    issueCountText.textContent =
        `Showing ${filteredIssues.length} of ${issues.length} issues`;


    // Show empty message if nothing matches
    if (filteredIssues.length === 0) {
        emptyMessage.style.display = "block";
        return;
    }

    emptyMessage.style.display = "none";


    // Create a card for every filtered issue
    filteredIssues.forEach(issue => {

        const card = document.createElement("div");

        card.className = "issue-card";


        /*
            Decide which CSS class to use
            for the status badge.
        */

        let statusClass = "";

        if (issue.status === "Pending") {
            statusClass = "status-pending";
        }
        else if (issue.status === "In Progress") {
            statusClass = "status-progress";
        }
        else {
            statusClass = "status-resolved";
        }


        /*
            Admin status dropdown.
            It is only visible when Admin Mode is enabled.
        */

        const adminControl = `
            <div class="admin-control">
                <select
                    class="status-select"
                    onchange="changeStatus(${issue.id}, this.value)"
                >
                    <option value="Pending"
                        ${issue.status === "Pending" ? "selected" : ""}>
                        Pending
                    </option>

                    <option value="In Progress"
                        ${issue.status === "In Progress" ? "selected" : ""}>
                        In Progress
                    </option>

                    <option value="Resolved"
                        ${issue.status === "Resolved" ? "selected" : ""}>
                        Resolved
                    </option>
                </select>
            </div>
        `;


        /*
            Build the issue card.
        */

        card.innerHTML = `

            <div class="issue-top">

                <div class="issue-title">
                    ${escapeHTML(issue.title)}
                </div>

                <span class="status-badge ${statusClass}">
                    ${issue.status}
                </span>

            </div>


            <span class="issue-category">
                ${escapeHTML(issue.category)}
            </span>


            <div class="issue-location">
                📍 ${escapeHTML(issue.location)}
            </div>


            <div class="issue-description">
                ${escapeHTML(issue.description)}
            </div>


            <div class="issue-footer">

                <span class="issue-date">
                    Reported: ${formatDate(issue.date)}
                </span>

                ${adminControl}

            </div>
        `;


        issuesContainer.appendChild(card);
    });
}


/* =========================================
   CHANGE ISSUE STATUS
========================================= */

function changeStatus(id, newStatus) {

    // Find the selected issue
    const issue = issues.find(issue => issue.id === id);

    if (!issue) {
        return;
    }

    // Update status
    issue.status = newStatus;

    // Save updated data
    saveIssues();

    // Refresh dashboard and issue cards
    updateDashboard();
    displayIssues();
}


/* =========================================
   DASHBOARD COUNTS
========================================= */

function updateDashboard() {

    const total = issues.length;

    const pending = issues.filter(
        issue => issue.status === "Pending"
    ).length;

    const resolved = issues.filter(
        issue => issue.status === "Resolved"
    ).length;


    totalCount.textContent = total;
    pendingCount.textContent = pending;
    resolvedCount.textContent = resolved;
}


/* =========================================
   ADD NEW ISSUE
========================================= */

issueForm.addEventListener("submit", function(event) {

    // Stop page refresh
    event.preventDefault();


    const newIssue = {

        id: Date.now(),

        title: titleInput.value.trim(),

        category: categoryInput.value,

        location: locationInput.value.trim(),

        description: descriptionInput.value.trim(),

        status: "Pending",

        date: new Date().toISOString().split("T")[0]
    };


    // Add issue at the beginning of the array
    issues.unshift(newIssue);


    // Save data
    saveIssues();


    // Clear form
    issueForm.reset();


    // Refresh UI
    updateDashboard();
    displayIssues();


    // Scroll to issues
    document.querySelector(".issues-section")
        .scrollIntoView({
            behavior: "smooth"
        });
});


/* =========================================
   SEARCH
========================================= */

searchInput.addEventListener("input", displayIssues);


/* =========================================
   CATEGORY FILTER
========================================= */

categoryFilter.addEventListener("change", displayIssues);


/* =========================================
   STATUS FILTER
========================================= */

statusFilter.addEventListener("change", displayIssues);


/* =========================================
   ADMIN MODE
========================================= */

adminToggle.addEventListener("change", function() {

    /*
        Add/remove the admin-mode class
        from the body.

        CSS uses this class to show
        the status dropdown.
    */

    if (this.checked) {
        document.body.classList.add("admin-mode");
    }
    else {
        document.body.classList.remove("admin-mode");
    }


    // Re-render cards
    displayIssues();
});


/* =========================================
   DATE FORMATTER
========================================= */

function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}


/* =========================================
   SECURITY HELPER
========================================= */

/*
    Prevent user-entered HTML from being
    directly inserted into the page.

    This protects the app from basic
    HTML/script injection through the form.
*/

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* =========================================
   INITIAL PAGE LOAD
========================================= */

updateDashboard();
displayIssues();