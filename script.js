// ======================================================
// SHIKSHAAI - COMPLETE SCRIPT.JS
// ======================================================

let currentUser = null;
let currentProfile = null;
let selectedLevel = "Beginner";
let currentQuiz = null;


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener("DOMContentLoaded", () => {
    loadSavedData();
    setupForms();
    setupSearch();
    setupKeyboardShortcuts();
});


// ======================================================
// LOAD SAVED DATA
// ======================================================

function loadSavedData() {

    const savedUser = localStorage.getItem("shikshaUser");
    const savedProfile = localStorage.getItem("shikshaProfile");

    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
        } catch (error) {
            localStorage.removeItem("shikshaUser");
        }
    }

    if (savedProfile) {
        try {
            currentProfile = JSON.parse(savedProfile);

            if (currentProfile.level) {
                selectedLevel = currentProfile.level;
            }
        } catch (error) {
            localStorage.removeItem("shikshaProfile");
        }
    }
}


// ======================================================
// AUTH MODAL
// ======================================================

function openAuth() {

    const modal = document.getElementById("authModal");

    if (!modal) {
        console.error("authModal not found");
        return;
    }

    modal.style.display = "flex";

    // Always open Sign Up by default
    showSignup();
}


function closeAuth() {

    const modal = document.getElementById("authModal");

    if (modal) {
        modal.style.display = "none";
    }
}


function showLogin() {

    const loginTab = document.getElementById("loginTab");
    const signupTab = document.getElementById("signupTab");

    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    if (loginTab) {
        loginTab.classList.add("active");
    }

    if (signupTab) {
        signupTab.classList.remove("active");
    }

    if (loginForm) {
        loginForm.style.display = "block";
        loginForm.hidden = false;
    }

    if (signupForm) {
        signupForm.style.display = "none";
        signupForm.hidden = true;
    }
}


function showSignup() {

    const loginTab = document.getElementById("loginTab");
    const signupTab = document.getElementById("signupTab");

    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    if (signupTab) {
        signupTab.classList.add("active");
    }

    if (loginTab) {
        loginTab.classList.remove("active");
    }

    if (signupForm) {
        signupForm.style.display = "block";
        signupForm.hidden = false;
    }

    if (loginForm) {
        loginForm.style.display = "none";
        loginForm.hidden = true;
    }
}


// ======================================================
// PASSWORD TOGGLE
// ======================================================

function togglePassword(inputId, button) {

    const input = document.getElementById(inputId);

    if (!input) return;

    if (input.type === "password") {

        input.type = "text";

        if (button) {
            button.textContent = "🙈";
        }

    } else {

        input.type = "password";

        if (button) {
            button.textContent = "👁️";
        }
    }
}


// ======================================================
// SIGN UP
// ======================================================

function signupUser(event) {

    if (event) {
        event.preventDefault();
    }

    const nameElement =
        document.getElementById("signupName");

    const emailElement =
        document.getElementById("signupEmail");

    const passwordElement =
        document.getElementById("signupPassword");

    const name =
        nameElement ? nameElement.value.trim() : "";

    const email =
        emailElement ? emailElement.value.trim() : "";

    const password =
        passwordElement ? passwordElement.value : "";


    // Validation
    if (!name) {
        alert("Please enter your full name.");
        nameElement?.focus();
        return;
    }

    if (!email) {
        alert("Please enter your email.");
        emailElement?.focus();
        return;
    }

    if (!email.includes("@")) {
        alert("Please enter a valid email.");
        emailElement?.focus();
        return;
    }

    if (!password) {
        alert("Please create a password.");
        passwordElement?.focus();
        return;
    }

    if (password.length < 6) {
        alert("Password must contain at least 6 characters.");
        passwordElement?.focus();
        return;
    }


    // Create user
    currentUser = {
        name: name,
        email: email,
        password: password
    };


    // Save user
    localStorage.setItem(
        "shikshaUser",
        JSON.stringify(currentUser)
    );


    // Close authentication
    closeAuth();


    // Open student onboarding
    openStudentProfile();


    // Fill name automatically
    const profileName =
        document.getElementById("profileName");

    if (profileName) {
        profileName.value = name;
    }
}


// ======================================================
// LOGIN
// ======================================================

function loginUser(event) {

    if (event) {
        event.preventDefault();
    }

    const emailElement =
        document.getElementById("loginEmail");

    const passwordElement =
        document.getElementById("loginPassword");

    const email =
        emailElement ? emailElement.value.trim() : "";

    const password =
        passwordElement ? passwordElement.value : "";


    if (!email) {
        alert("Please enter your email.");
        emailElement?.focus();
        return;
    }

    if (!password) {
        alert("Please enter your password.");
        passwordElement?.focus();
        return;
    }


    const savedUser =
        localStorage.getItem("shikshaUser");


    if (!savedUser) {

        alert(
            "No account found. Please create an account first."
        );

        showSignup();

        return;
    }


    let user;

    try {
        user = JSON.parse(savedUser);
    } catch (error) {

        alert(
            "Account data is corrupted. Please sign up again."
        );

        localStorage.removeItem("shikshaUser");

        showSignup();

        return;
    }


    if (
        user.email !== email ||
        user.password !== password
    ) {

        alert("Incorrect email or password.");

        return;
    }


    // Login successful
    currentUser = user;

    closeAuth();


    // Check profile
    const savedProfile =
        localStorage.getItem("shikshaProfile");


    if (savedProfile) {

        try {

            currentProfile =
                JSON.parse(savedProfile);

            openLearningDashboard();

        } catch (error) {

            openStudentProfile();
        }

    } else {

        openStudentProfile();
    }
}


// ======================================================
// STUDENT PROFILE
// ======================================================

function openStudentProfile() {

    const landingPage =
        document.getElementById("landingPage");

    const authModal =
        document.getElementById("authModal");

    const profilePage =
        document.getElementById("profilePage");

    const dashboard =
        document.getElementById("dashboard");


    if (landingPage) {
        landingPage.style.display = "none";
    }

    if (authModal) {
        authModal.style.display = "none";
    }

    if (dashboard) {
        dashboard.style.display = "none";
    }

    if (profilePage) {
        profilePage.style.display = "flex";
    }


    // Put user name
    if (currentUser) {

        const profileName =
            document.getElementById("profileName");

        if (
            profileName &&
            !profileName.value
        ) {
            profileName.value =
                currentUser.name;
        }
    }
}


// ======================================================
// LEVEL SELECT
// ======================================================

function selectLevel(level) {

    selectedLevel = level;


    const buttons =
        document.querySelectorAll(
            ".level-option, .level-btn, [data-level]"
        );


    buttons.forEach(button => {

        button.classList.remove("active");

        const buttonLevel =
            button.dataset.level ||
            button.textContent.trim();


        if (
            buttonLevel.toLowerCase() ===
            level.toLowerCase()
        ) {
            button.classList.add("active");
        }
    });
}


// ======================================================
// COMPLETE STUDENT PROFILE
// ======================================================

function completeProfile(event) {

    if (event) {
        event.preventDefault();
    }


    const name =
        document.getElementById(
            "profileName"
        )?.value.trim();


    const age =
        document.getElementById(
            "profileAge"
        )?.value;


    const studentClass =
        document.getElementById(
            "profileClass"
        )?.value;


    const stream =
        document.getElementById(
            "profileStream"
        )?.value;


    const subject =
        document.getElementById(
            "profileSubject"
        )?.value;


    const goal =
        document.getElementById(
            "profileGoal"
        )?.value;


    const time =
        document.getElementById(
            "profileTime"
        )?.value;


    const language =
        document.getElementById(
            "profileLanguage"
        )?.value;


    // Validation
    if (!name) {
        alert("Please enter your name.");
        return;
    }

    if (!age) {
        alert("Please select your age.");
        return;
    }

    if (!studentClass) {
        alert("Please select your class/course.");
        return;
    }

    if (!stream) {
        alert("Please select your stream/branch.");
        return;
    }

    if (!subject) {
        alert("Please select your favourite subject.");
        return;
    }

    if (!goal) {
        alert("Please select your learning goal.");
        return;
    }

    if (!time) {
        alert("Please select your daily learning target.");
        return;
    }

    if (!language) {
        alert("Please select your preferred language.");
        return;
    }


    // Save profile
    currentProfile = {

        name: name,

        age: age,

        studentClass: studentClass,

        stream: stream,

        subject: subject,

        level: selectedLevel,

        goal: goal,

        time: time,

        language: language
    };


    localStorage.setItem(
        "shikshaProfile",
        JSON.stringify(currentProfile)
    );


    // Update user name
    if (currentUser) {

        currentUser.name = name;

        localStorage.setItem(
            "shikshaUser",
            JSON.stringify(currentUser)
        );
    }


    // Open dashboard
    openLearningDashboard();
}


// ======================================================
// OPEN DASHBOARD
// ======================================================

function openLearningDashboard() {

    const landingPage =
        document.getElementById("landingPage");

    const profilePage =
        document.getElementById("profilePage");

    const dashboard =
        document.getElementById("dashboard");


    if (landingPage) {
        landingPage.style.display = "none";
    }

    if (profilePage) {
        profilePage.style.display = "none";
    }

    if (dashboard) {
        dashboard.style.display = "block";
    }


    updateDashboardProfile();

    showDashboardSection("home");
}


// ======================================================
// UPDATE DASHBOARD PROFILE
// ======================================================

function updateDashboardProfile() {

    if (!currentProfile) {
        return;
    }


    const data = {

        dashboardUserName:
            currentProfile.name || "Student",

        dashboardUserClass:
            currentProfile.studentClass || "Student",

        homeUserName:
            currentProfile.name || "Student",

        profileDashboardName:
            currentProfile.name || "Student",

        profileDashboardClass:
            currentProfile.studentClass || "-",

        profileDashboardSubject:
            currentProfile.subject || "-",

        profileDashboardLevel:
            currentProfile.level || "Beginner",

        profileDashboardGoal:
            currentProfile.goal || "-"
    };


    Object.entries(data).forEach(
        ([id, value]) => {

            const element =
                document.getElementById(id);

            if (element) {
                element.textContent = value;
            }
        }
    );


    // Language
    const language =
        document.getElementById(
            "dashboardLanguage"
        );

    if (
        language &&
        currentProfile.language
    ) {
        language.value =
            currentProfile.language;
    }
}


// ======================================================
// LOGOUT
// ======================================================

function logoutUser() {

    const confirmLogout =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmLogout) {
        return;
    }


    currentUser = null;
    currentProfile = null;


    localStorage.removeItem(
        "shikshaUser"
    );

    localStorage.removeItem(
        "shikshaProfile"
    );


    const dashboard =
        document.getElementById(
            "dashboard"
        );

    const profilePage =
        document.getElementById(
            "profilePage"
        );

    const landingPage =
        document.getElementById(
            "landingPage"
        );


    if (dashboard) {
        dashboard.style.display = "none";
    }

    if (profilePage) {
        profilePage.style.display = "none";
    }

    if (landingPage) {
        landingPage.style.display = "block";
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ======================================================
// DASHBOARD NAVIGATION
// ======================================================

function showDashboardSection(sectionName) {

    const sections =
        document.querySelectorAll(
            ".dashboard-section"
        );


    sections.forEach(section => {

        section.style.display = "none";
    });


    const selectedSection =
        document.getElementById(
            sectionName
        );


    if (selectedSection) {

        selectedSection.style.display =
            "block";
    }


    // Active sidebar item
    const navItems =
        document.querySelectorAll(
            ".sidebar-item, .nav-item, [data-section]"
        );


    navItems.forEach(item => {

        item.classList.remove("active");


        if (
            item.dataset.section ===
            sectionName
        ) {
            item.classList.add("active");
        }
    });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ======================================================
// AI TEACHER
// ======================================================

function openAIFromDashboard() {

    showDashboardSection(
        "aiTeacher"
    );


    const topic =
        document.getElementById(
            "dashboardTopic"
        );


    if (topic) {

        setTimeout(() => {
            topic.focus();
        }, 200);
    }
}


// ======================================================
// SYNC LANGUAGE
// ======================================================

function syncDashboardLanguage() {

    const language =
        document.getElementById(
            "dashboardLanguage"
        )?.value;


    if (!language) {
        return;
    }


    if (currentProfile) {

        currentProfile.language =
            language;


        localStorage.setItem(
            "shikshaProfile",
            JSON.stringify(currentProfile)
        );
    }
}


// ======================================================
// ASK AI
// ======================================================

async function askDashboardAI() {

    const topicInput =
        document.getElementById(
            "dashboardTopic"
        );


    const languageSelect =
        document.getElementById(
            "dashboardLanguage"
        );


    const result =
        document.getElementById(
            "dashboardAIResult"
        );


    if (!topicInput || !result) {
        return;
    }


    const topic =
        topicInput.value.trim();


    const language =
        languageSelect?.value ||
        "English";


    if (!topic) {

        alert(
            "Please enter a topic."
        );

        topicInput.focus();

        return;
    }


    result.style.display =
        "block";


    result.innerHTML = `
        <div class="ai-loading">
            🤖 ShikshaAI is thinking...
            <br>
            <small>
                Preparing your explanation...
            </small>
        </div>
    `;


    try {

        const response =
            await fetch(
                "/explain",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        topic: topic,
                        language: language
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "AI service unavailable"
            );
        }


        result.innerHTML = `

            <div class="ai-result-content">

                ${formatAIText(
                    data.explanation
                )}

            </div>

            <div class="ai-followups">

                <button
                    onclick="askFollowUp('simple')"
                >
                    🧒 Explain Simply
                </button>

                <button
                    onclick="askFollowUp('example')"
                >
                    💡 Give Example
                </button>

                <button
                    onclick="askFollowUp('analogy')"
                >
                    🔄 Use Analogy
                </button>

                <button
                    onclick="generateDashboardQuiz()"
                >
                    📝 Create Quiz
                </button>

            </div>
        `;


    } catch (error) {

        console.error(
            "AI Error:",
            error
        );


        result.innerHTML = `

            <div class="ai-error">

                ❌ AI could not generate
                the explanation.

                <br><br>

                Please try again.

            </div>

        `;
    }
}


// ======================================================
// FORMAT AI TEXT
// ======================================================

function formatAIText(text) {

    if (!text) {
        return "No explanation generated.";
    }


    let output =
        String(text);


    // Escape HTML
    output =
        output
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            );


    // Bold
    output =
        output.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        );


    // Headings
    output =
        output.replace(
            /^### (.*)$/gm,
            "<h3>$1</h3>"
        );


    output =
        output.replace(
            /^## (.*)$/gm,
            "<h2>$1</h2>"
        );


    output =
        output.replace(
            /^# (.*)$/gm,
            "<h1>$1</h1>"
        );


    // Line breaks
    output =
        output.replace(
            /\n/g,
            "<br>"
        );


    return output;
}


// ======================================================
// AI FOLLOW UP
// ======================================================

async function askFollowUp(type) {

    const topicInput =
        document.getElementById(
            "dashboardTopic"
        );


    const languageSelect =
        document.getElementById(
            "dashboardLanguage"
        );


    const result =
        document.getElementById(
            "dashboardAIResult"
        );


    if (!topicInput || !result) {
        return;
    }


    const topic =
        topicInput.value.trim();


    const language =
        languageSelect?.value ||
        "English";


    if (!topic) {
        return;
    }


    let instruction = "";


    if (type === "simple") {

        instruction =
            "Explain this topic like you are teaching a 10-year-old student. Use extremely simple language.";
    }


    if (type === "example") {

        instruction =
            "Explain this topic using 3 simple real-life examples.";
    }


    if (type === "analogy") {

        instruction =
            "Explain this topic using an easy daily-life analogy.";
    }


    result.innerHTML =
        "🤖 Preparing your answer...";


    try {

        const response =
            await fetch(
                "/explain",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        topic:
                            `${topic}\n\n${instruction}`,
                        language:
                            language
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Request failed"
            );
        }


        result.innerHTML = `

            <div class="ai-result-content">

                ${formatAIText(
                    data.explanation
                )}

            </div>

        `;


    } catch (error) {

        console.error(error);

        result.innerHTML =
            "❌ Could not generate the answer. Please try again.";
    }
}


// ======================================================
// GENERATE QUIZ
// ======================================================
function startAIQuiz() {
    showDashboardSection("aiTeacher");

    const topicInput = document.getElementById("dashboardTopic");

    if (topicInput) {
        topicInput.value = "";

        topicInput.placeholder = "Enter a topic to generate your quiz...";

        topicInput.focus();
    }

    const result = document.getElementById("dashboardAIResult");

    if (result) {
        result.innerHTML = `
            <div class="ai-result-content">
                <h2>📝 AI Quiz</h2>
                <p>Enter a topic in the box above and click Create Quiz.</p>
                <p>ShikshaAI will generate 5 questions for you.</p>
            </div>
        `;
    }
} 
async function generateDashboardQuiz() {

    const topicInput =
        document.getElementById(
            "dashboardTopic"
        );


    const languageSelect =
        document.getElementById(
            "dashboardLanguage"
        );


    const result =
        document.getElementById(
            "dashboardAIResult"
        );


    if (!topicInput || !result) {
        return;
    }


    const topic =
        topicInput.value.trim();


    const language =
        languageSelect?.value ||
        "English";


    if (!topic) {

        alert(
            "Please enter a topic first."
        );

        return;
    }


    result.innerHTML =
        "🤖 Creating your 5-question quiz...";


    try {

        const response =
            await fetch(
                "/quiz",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        topic: topic,
                        language: language
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Quiz generation failed"
            );
        }


        if (
            !Array.isArray(data.quiz) ||
            data.quiz.length !== 5
        ) {

            throw new Error(
                "Invalid quiz received."
            );
        }


        currentQuiz =
            data.quiz;


        renderDashboardQuiz(
            data.quiz
        );


    } catch (error) {

        console.error(
            "Quiz Error:",
            error
        );


        result.innerHTML = `

            ❌ Quiz could not be generated.

            <br><br>

            Please try again.

        `;
    }
}


// ======================================================
// RENDER QUIZ
// ======================================================

function renderDashboardQuiz(quiz) {

    const result =
        document.getElementById(
            "dashboardAIResult"
        );


    if (!result) {
        return;
    }


    result.innerHTML = `

        <div class="dashboard-quiz">

            <h2>📝 AI Quiz</h2>

            <p>
                Test your understanding.
                Answer all 5 questions.
            </p>

            <div
                id="dashboardQuizContainer"
            ></div>

            <button
                class="primary-btn"
                onclick="checkDashboardQuiz()"
            >
                Check Answers
            </button>

            <div
                id="dashboardQuizScore"
            ></div>

        </div>

    `;


    const container =
        document.getElementById(
            "dashboardQuizContainer"
        );


    quiz.forEach(
        (question, index) => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "quiz-question";


            div.innerHTML = `

                <h3>

                    ${index + 1}.
                    ${escapeHTML(
                        question.question
                    )}

                </h3>


                ${question.options
                    .map(
                        option => `

                            <label>

                                <input
                                    type="radio"
                                    name="dashboardQuestion${index}"
                                    value="${escapeHTML(
                                        option
                                    )}"
                                >

                                <span>
                                    ${escapeHTML(
                                        option
                                    )}
                                </span>

                            </label>

                        `
                    )
                    .join("")}

            `;


            container.appendChild(
                div
            );
        }
    );
}


// ======================================================
// CHECK QUIZ
// ======================================================

function checkDashboardQuiz() {

    if (!currentQuiz) {

        alert(
            "Please generate a quiz first."
        );

        return;
    }


    let score = 0;


    currentQuiz.forEach(
        (question, index) => {

            const selected =
                document.querySelector(
                    `input[name="dashboardQuestion${index}"]:checked`
                );


            if (
                selected &&
                selected.value ===
                question.answer
            ) {

                score++;
            }
        }
    );


    const scoreElement =
        document.getElementById(
            "dashboardQuizScore"
        );


    if (!scoreElement) {
        return;
    }


    let message;


    if (score === 5) {

        message =
            "🏆 Perfect Score! Excellent work!";

    } else if (score >= 3) {

        message =
            "🎉 Great job! Keep learning!";

    } else {

        message =
            "💪 Keep practicing! You can improve!";
    }


    scoreElement.innerHTML = `

        <div class="quiz-score">

            🎯 Your Score:
            <strong>
                ${score} / ${currentQuiz.length}
            </strong>

            <br>

            <small>
                ${message}
            </small>

        </div>

    `;
}


// ======================================================
// NOTES SEARCH
// ======================================================

function setupSearch() {

    const notesSearch =
        document.getElementById(
            "notesSearch"
        );


    const notesFilter =
        document.getElementById(
            "notesSubjectFilter"
        );


    if (notesSearch) {

        notesSearch.addEventListener(
            "input",
            filterNotes
        );
    }


    if (notesFilter) {

        notesFilter.addEventListener(
            "change",
            filterNotes
        );
    }


    const globalSearch =
        document.getElementById(
            "globalSearch"
        );


    if (globalSearch) {

        globalSearch.addEventListener(
            "keydown",
            handleGlobalSearch
        );
    }
}


// ======================================================
// FILTER NOTES
// ======================================================

function filterNotes() {

    const search =
        document.getElementById(
            "notesSearch"
        )?.value
        .toLowerCase()
        .trim() || "";


    const filter =
        document.getElementById(
            "notesSubjectFilter"
        )?.value
        .toLowerCase() || "all";


    const cards =
        document.querySelectorAll(
            ".note-card"
        );


    cards.forEach(card => {

        const text =
            card.textContent.toLowerCase();


        const subject =
            card.dataset.subject
            ?.toLowerCase() || "";


        const searchMatch =
            text.includes(search);


        const subjectMatch =
            filter === "all" ||
            subject === filter ||
            subject === "";


        if (
            searchMatch &&
            subjectMatch
        ) {

            card.style.display = "";

        } else {

            card.style.display = "none";
        }
    });
}


// ======================================================
// GLOBAL SEARCH
// ======================================================

function handleGlobalSearch(event) {

    if (event.key !== "Enter") {
        return;
    }


    const query =
        event.target.value
        .trim()
        .toLowerCase();


    if (!query) {
        return;
    }


    if (
        query.includes("ai") ||
        query.includes("teacher") ||
        query.includes("explain")
    ) {

        openAIFromDashboard();

        return;
    }


    if (
        query.includes("note")
    ) {

        showDashboardSection(
            "notes"
        );

        return;
    }


    if (
        query.includes("practice") ||
        query.includes("quiz")
    ) {

        showDashboardSection(
            "practice"
        );

        return;
    }


    if (
        query.includes("subject")
    ) {

        showDashboardSection(
            "subjects"
        );

        return;
    }


    if (
        query.includes("progress")
    ) {

        showDashboardSection(
            "progress"
        );

        return;
    }


    alert(
        `Searching ShikshaAI for "${event.target.value}"...`
    );
}


// ======================================================
// PROFILE
// ======================================================

function openProfile() {

    showDashboardSection(
        "profile"
    );

    updateDashboardProfile();
}


function saveProfileChanges(event) {

    if (event) {
        event.preventDefault();
    }


    if (!currentProfile) {
        return;
    }


    const name =
        document.getElementById(
            "profileName"
        )?.value.trim();


    if (name) {

        currentProfile.name =
            name;


        if (currentUser) {

            currentUser.name =
                name;


            localStorage.setItem(
                "shikshaUser",
                JSON.stringify(currentUser)
            );
        }
    }


    localStorage.setItem(
        "shikshaProfile",
        JSON.stringify(currentProfile)
    );


    updateDashboardProfile();


    alert(
        "Profile updated successfully! ✅"
    );
}


// ======================================================
// SETTINGS
// ======================================================

function saveSettings() {

    const language =
        document.getElementById(
            "dashboardLanguage"
        )?.value;


    if (
        language &&
        currentProfile
    ) {

        currentProfile.language =
            language;


        localStorage.setItem(
            "shikshaProfile",
            JSON.stringify(currentProfile)
        );
    }


    alert(
        "Settings saved successfully! ✅"
    );
}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


// ======================================================
// FORM SETUP
// ======================================================

function setupForms() {

    const signupForm =
        document.getElementById(
            "signupForm"
        );


    const loginForm =
        document.getElementById(
            "loginForm"
        );


    if (signupForm) {

        signupForm.addEventListener(
            "submit",
            signupUser
        );
    }


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            loginUser
        );
    }
}


// ======================================================
// CLOSE MODAL OUTSIDE
// ======================================================

document.addEventListener(
    "click",
    event => {

        const modal =
            document.getElementById(
                "authModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeAuth();
        }
    }
);


// ======================================================
// KEYBOARD SHORTCUTS
// ======================================================

function setupKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        event => {

            // ESC closes auth
            if (
                event.key === "Escape"
            ) {

                closeAuth();
            }


            // Dashboard AI Enter
            if (
                event.target?.id ===
                "dashboardTopic" &&
                event.key === "Enter"
            ) {

                event.preventDefault();

                askDashboardAI();
            }
        }
    );
}


// ======================================================
// OLD AI TEACHER SUPPORT
// ======================================================

async function explainTopic() {

    const topicInput =
        document.getElementById(
            "topicInput"
        );


    const languageSelect =
        document.getElementById(
            "languageSelect"
        );


    if (!topicInput) {
        return;
    }


    const topic =
        topicInput.value.trim();


    const language =
        languageSelect?.value ||
        "English";


    if (!topic) {

        alert(
            "Please enter a topic."
        );

        return;
    }


    const result =
        document.getElementById(
            "result"
        );


    const explanation =
        document.getElementById(
            "explanation"
        );


    if (result) {
        result.style.display =
            "block";
    }


    if (explanation) {

        explanation.innerHTML =
            "🤖 ShikshaAI is thinking...";
    }


    try {

        const response =
            await fetch(
                "/explain",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        topic,
                        language
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Something went wrong"
            );
        }


        if (explanation) {

            explanation.innerHTML =
                formatAIText(
                    data.explanation
                );
        }


    } catch (error) {

        console.error(
            "Explanation Error:",
            error
        );


        if (explanation) {

            explanation.innerHTML =
                "❌ AI could not generate the explanation. Please try again.";
        }
    }
}


// ======================================================
// OLD QUIZ SUPPORT
// ======================================================

async function generateQuiz() {

    const topicInput =
        document.getElementById(
            "topicInput"
        );


    const languageSelect =
        document.getElementById(
            "languageSelect"
        );


    if (!topicInput) {
        return;
    }


    const topic =
        topicInput.value.trim();


    const language =
        languageSelect?.value ||
        "English";


    if (!topic) {

        alert(
            "Please enter a topic first."
        );

        return;
    }


    const quizSection =
        document.getElementById(
            "quiz"
        );


    const quizContainer =
        document.getElementById(
            "quizContainer"
        );


    if (!quizContainer) {
        return;
    }


    if (quizSection) {

        quizSection.style.display =
            "block";
    }


    quizContainer.innerHTML =
        "🤖 Creating your 5-question quiz...";


    try {

        const response =
            await fetch(
                "/quiz",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        topic,
                        language
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Quiz generation failed"
            );
        }


        currentQuiz =
            data.quiz;


        quizContainer.innerHTML =
            "";


        data.quiz.forEach(
            (item, index) => {

                const questionDiv =
                    document.createElement(
                        "div"
                    );


                questionDiv.className =
                    "question";


                questionDiv.innerHTML = `

                    <h3>

                        ${index + 1}.
                        ${escapeHTML(
                            item.question
                        )}

                    </h3>


                    ${item.options
                        .map(
                            option => `

                                <label>

                                    <input
                                        type="radio"
                                        name="question${index}"
                                        value="${escapeHTML(
                                            option
                                        )}"
                                    >

                                    ${escapeHTML(
                                        option
                                    )}

                                </label>

                            `
                        )
                        .join("")}

                `;


                quizContainer.appendChild(
                    questionDiv
                );
            }
        );


    } catch (error) {

        console.error(
            "Quiz Error:",
            error
        );


        quizContainer.innerHTML =
            "❌ Quiz could not be generated. Please try again.";
    }
}


// ======================================================
// OLD CHECK ANSWERS
// ======================================================

function checkAnswers() {

    if (!currentQuiz) {

        alert(
            "Please generate a quiz first."
        );

        return;
    }


    let score = 0;


    currentQuiz.forEach(
        (question, index) => {

            const selected =
                document.querySelector(
                    `input[name="question${index}"]:checked`
                );


            if (
                selected &&
                selected.value ===
                question.answer
            ) {

                score++;
            }
        }
    );


    const scoreElement =
        document.getElementById(
            "score"
        );


    if (!scoreElement) {
        return;
    }


    let message;


    if (score === currentQuiz.length) {

        message =
            "🏆 Perfect Score! Excellent work!";

    } else if (score >= 3) {

        message =
            "🎉 Great job! Keep learning!";

    } else {

        message =
            "💪 Keep practicing! You can improve!";
    }


    scoreElement.innerHTML = `

        🎯 Your Score:
        ${score} / ${currentQuiz.length}

        <br>

        <small>
            ${message}
        </small>

    `;
}// ======================================================
// SHIKSHAAI - DYNAMIC MY SUBJECTS
// Class 9-12 + College
// ======================================================

(function setupDynamicSubjects() {

    const subjectsData = {

        "Class 9": {
            "default": [
                ["📐", "Mathematics", "Algebra, geometry and number systems"],
                ["🧪", "Science", "Physics, chemistry and biology basics"],
                ["📖", "English", "Grammar, reading and writing"],
                ["🌏", "Social Science", "History, geography, civics and economics"],
                ["🇮🇳", "Hindi", "Reading, grammar and writing"],
                ["💻", "Computer", "Digital literacy and computing"]
            ]
        },

        "Class 10": {
            "default": [
                ["📐", "Mathematics", "Algebra, geometry and trigonometry"],
                ["🧪", "Science", "Physics, chemistry and biology"],
                ["📖", "English", "Literature, grammar and writing"],
                ["🌏", "Social Science", "History, geography, civics and economics"],
                ["🇮🇳", "Hindi", "Literature and grammar"],
                ["💻", "Computer", "Computing fundamentals"]
            ]
        },

        "Class 11": {

            "Science": [
                ["⚛️", "Physics", "Mechanics, waves and physical laws"],
                ["🧪", "Chemistry", "Atomic structure, bonding and reactions"],
                ["📐", "Mathematics", "Functions, algebra and trigonometry"],
                ["🧬", "Biology", "Cell biology and living systems"],
                ["📖", "English", "Reading and communication"],
                ["💻", "Computer Science", "Programming and computing"]
            ],

            "Commerce": [
                ["📊", "Accountancy", "Accounting fundamentals and statements"],
                ["💹", "Business Studies", "Business, management and organisation"],
                ["💰", "Economics", "Microeconomics and statistics"],
                ["📖", "English", "Reading and communication"],
                ["💻", "Computer / Informatics", "Digital and information systems"]
            ],

            "Arts / Humanities": [
                ["🏛️", "History", "Historical events and societies"],
                ["🌍", "Geography", "People, places and environment"],
                ["⚖️", "Political Science", "Politics, government and constitution"],
                ["🧠", "Psychology", "Human behaviour and mind"],
                ["💰", "Economics", "Economic concepts"],
                ["📖", "English", "Reading and communication"]
            ]
        },

        "Class 12": {

            "Science": [
                ["⚛️", "Physics", "Electricity, magnetism and modern physics"],
                ["🧪", "Chemistry", "Organic, inorganic and physical chemistry"],
                ["📐", "Mathematics", "Calculus, vectors and probability"],
                ["🧬", "Biology", "Genetics, ecology and human biology"],
                ["📖", "English", "Literature and communication"],
                ["💻", "Computer Science", "Programming and data concepts"]
            ],

            "Commerce": [
                ["📊", "Accountancy", "Company accounts and financial statements"],
                ["💹", "Business Studies", "Management and business finance"],
                ["💰", "Economics", "Macroeconomics and development"],
                ["📖", "English", "Reading and communication"],
                ["💻", "Computer / Informatics", "Digital and information systems"]
            ],

            "Arts / Humanities": [
                ["🏛️", "History", "Modern history and historical analysis"],
                ["🌍", "Geography", "Human and economic geography"],
                ["⚖️", "Political Science", "Politics and contemporary world"],
                ["🧠", "Psychology", "Human behaviour and psychology"],
                ["💰", "Economics", "Economic development"],
                ["📖", "English", "Literature and communication"]
            ]
        }
    };


    // College subjects: sample subjects by branch
    const collegeSubjects = {

        "IT": [
            ["💻", "Programming in C", "Programming fundamentals and problem solving"],
            ["📐", "Engineering Mathematics", "Core mathematical methods"],
            ["🔢", "Digital Electronics", "Logic gates and digital circuits"],
            ["⚙️", "Engineering Mechanics", "Forces and motion"],
            ["⚛️", "Engineering Physics", "Physics for engineers"],
            ["🌐", "Web Development", "HTML, CSS and JavaScript"]
        ],

        "Computer Science": [
            ["💻", "Programming", "Programming fundamentals"],
            ["📐", "Engineering Mathematics", "Core mathematical methods"],
            ["🔢", "Digital Electronics", "Logic gates and circuits"],
            ["🗃️", "Data Structures", "Organising and processing data"],
            ["🌐", "Web Development", "HTML, CSS and JavaScript"],
            ["🖥️", "Computer Fundamentals", "Computer systems and architecture"]
        ],

        "Other Engineering": [
            ["📐", "Engineering Mathematics", "Core mathematical methods"],
            ["⚛️", "Engineering Physics", "Physics for engineers"],
            ["🧪", "Engineering Chemistry", "Chemistry fundamentals"],
            ["⚙️", "Engineering Mechanics", "Forces and motion"],
            ["💻", "Programming", "Programming fundamentals"],
            ["📏", "Engineering Graphics", "Technical drawing fundamentals"]
        ],

        "Other": [
            ["📘", "Core Subject 1", "Your course-specific subject"],
            ["📗", "Core Subject 2", "Your course-specific subject"],
            ["📙", "Core Subject 3", "Your course-specific subject"],
            ["📝", "Communication Skills", "Academic and professional communication"]
        ]
    };


    function getElement(id) {
        return document.getElementById(id);
    }


    // Get subjects according to class and stream
    function getSubjects(studentClass, stream) {

        if (subjectsData[studentClass]) {

            return subjectsData[studentClass][stream]
                || subjectsData[studentClass]["default"]
                || [];
        }

        if (studentClass.startsWith("College")) {

            return collegeSubjects[stream]
                || collegeSubjects["Other"];
        }

        return [];
    }


    // Display subject cards
    function renderSubjects() {

        const classSelect = getElement("subjectsClass");
        const streamSelect = getElement("subjectsStream");
        const subjectGrid = getElement("dynamicSubjectGrid");
        const notice = getElement("subjectsNotice");
        const streamWrap = getElement("subjectsStreamWrap");

        if (!classSelect || !streamSelect || !subjectGrid || !notice) {
            return;
        }

        const studentClass = classSelect.value;
        const stream = streamSelect.value;

        const seniorClass =
            studentClass === "Class 11" ||
            studentClass === "Class 12";

        const collegeClass =
            studentClass.startsWith("College");

        // Show stream/branch selector when required
        if (streamWrap) {
            streamWrap.style.display =
                (seniorClass || collegeClass) ? "flex" : "none";
        }

        // No class selected
        if (!studentClass) {
            subjectGrid.innerHTML = "";
            notice.textContent =
                "Select your class/course to see matching subjects.";
            return;
        }

        // Stream or branch not selected
        if ((seniorClass || collegeClass) && !stream) {

            subjectGrid.innerHTML = "";

            notice.textContent = seniorClass
                ? "Choose Science, Commerce or Arts to display your subjects."
                : "Choose your college branch/course to display your subjects.";

            return;
        }

        const subjects = getSubjects(studentClass, stream);

        notice.textContent =
            `Showing ${subjects.length} subjects for ${studentClass}` +
            (stream ? ` • ${stream}` : "") + ".";

        // Create subject cards
        subjectGrid.innerHTML = subjects.map(subject => {

            const icon = subject[0];
            const name = subject[1];
            const description = subject[2];

            return `
                <article class="dynamic-subject-card">

                    <div class="dynamic-subject-icon">
                        ${icon}
                    </div>

                    <h3>${name}</h3>

                    <p>${description}</p>

                    <button
                        type="button"
                        data-subject="${name.replace(/"/g, "&quot;")}"
                    >
                        Start Learning →
                    </button>

                </article>
            `;

        }).join("");


        // Start learning button
        subjectGrid.querySelectorAll("[data-subject]").forEach(button => {

            button.addEventListener("click", () => {

                const topic = button.dataset.subject;
                const topicInput = getElement("dashboardTopic");

                if (topicInput) {
                    topicInput.value = topic;
                }

                if (typeof openAIFromDashboard === "function") {
                    openAIFromDashboard();
                } else if (typeof showDashboardSection === "function") {
                    showDashboardSection("aiTeacher");
                }

            });

        });


        // Save selection
        localStorage.setItem(
            "shikshaSubjectsChoice",
            JSON.stringify({
                studentClass: studentClass,
                stream: stream
            })
        );
    }


    // Initialize after page loads
    document.addEventListener("DOMContentLoaded", () => {

        const classSelect = getElement("subjectsClass");
        const streamSelect = getElement("subjectsStream");

        if (!classSelect || !streamSelect) {
            console.warn(
                "My Subjects selectors not found. Check index.html IDs."
            );
            return;
        }

        // Restore saved selection
        let saved = {};

        try {
            saved = JSON.parse(
                localStorage.getItem("shikshaSubjectsChoice") || "{}"
            );
        } catch (error) {
            saved = {};
        }

        let profile = null;

        try {
            profile = JSON.parse(
                localStorage.getItem("shikshaProfile") || "null"
            );
        } catch (error) {
            profile = null;
        }

        const allowedClasses = [
            "Class 9",
            "Class 10",
            "Class 11",
            "Class 12",
            "College 1st Year",
            "College 2nd Year",
            "College 3rd Year",
            "College 4th Year"
        ];

        const profileClass = profile?.studentClass || "";

        if (allowedClasses.includes(profileClass)) {
            classSelect.value = profileClass;
        } else if (allowedClasses.includes(saved.studentClass)) {
            classSelect.value = saved.studentClass;
        }

        if (profile?.stream) {
            streamSelect.value = profile.stream;
        } else if (saved.stream) {
            streamSelect.value = saved.stream;
        }

        // Update subjects when selection changes
        classSelect.addEventListener("change", renderSubjects);
        streamSelect.addEventListener("change", renderSubjects);

        // Re-render when My Subjects is opened
        document.querySelectorAll('[data-section="subjects"]').forEach(item => {

            item.addEventListener("click", () => {
                setTimeout(renderSubjects, 50);
            });

        });

        renderSubjects();

    });


    // Refresh subjects whenever dashboard navigates to My Subjects
    const originalShowDashboardSection = window.showDashboardSection;

    if (typeof originalShowDashboardSection === "function") {

        window.showDashboardSection = function (sectionName) {

            originalShowDashboardSection(sectionName);

            if (sectionName === "subjects") {
                setTimeout(renderSubjects, 0);
            }

        };

    }

})();/* =====================================================
   SHIKSHAAI - COMPLETE MY SUBJECTS FEATURE
   Classes 9-12 and College
===================================================== */

(function () {
    "use strict";

    const SUBJECTS = {
        "Class 9": {
            "default": [
                ["📐", "Mathematics", "Algebra, geometry and number systems"],
                ["🧪", "Science", "Physics, chemistry and biology"],
                ["📖", "English", "Grammar, reading and writing"],
                ["🌍", "Social Science", "History, geography and civics"],
                ["🇮🇳", "Hindi", "Literature and grammar"],
                ["💻", "Computer", "Computer fundamentals"]
            ]
        },

        "Class 10": {
            "default": [
                ["📐", "Mathematics", "Algebra, geometry and trigonometry"],
                ["🧪", "Science", "Physics, chemistry and biology"],
                ["📖", "English", "Literature and grammar"],
                ["🌍", "Social Science", "History, geography and economics"],
                ["🇮🇳", "Hindi", "Literature and writing"],
                ["💻", "Computer", "Computing fundamentals"]
            ]
        },

        "Class 11": {
            "Science": [
                ["⚛️", "Physics", "Mechanics, motion and physical laws"],
                ["🧪", "Chemistry", "Atomic structure and chemical bonding"],
                ["📐", "Mathematics", "Functions, algebra and trigonometry"],
                ["🧬", "Biology", "Cells and living organisms"],
                ["📖", "English", "Reading and communication"],
                ["💻", "Computer Science", "Programming fundamentals"]
            ],

            "Commerce": [
                ["📊", "Accountancy", "Accounting fundamentals"],
                ["💹", "Business Studies", "Business and management"],
                ["💰", "Economics", "Economic concepts and statistics"],
                ["📖", "English", "Reading and communication"],
                ["💻", "Informatics Practices", "Computers and information systems"]
            ],

            "Arts / Humanities": [
                ["🏛️", "History", "Historical events and societies"],
                ["🌍", "Geography", "People, places and environment"],
                ["⚖️", "Political Science", "Politics and government"],
                ["🧠", "Psychology", "Human behaviour"],
                ["💰", "Economics", "Economic concepts"],
                ["📖", "English", "Reading and communication"]
            ]
        },

        "Class 12": {
            "Science": [
                ["⚛️", "Physics", "Electricity, magnetism and modern physics"],
                ["🧪", "Chemistry", "Organic and physical chemistry"],
                ["📐", "Mathematics", "Calculus, vectors and probability"],
                ["🧬", "Biology", "Genetics and ecology"],
                ["📖", "English", "Literature and communication"],
                ["💻", "Computer Science", "Programming and data concepts"]
            ],

            "Commerce": [
                ["📊", "Accountancy", "Company accounts and financial statements"],
                ["💹", "Business Studies", "Management and business finance"],
                ["💰", "Economics", "Macroeconomics and development"],
                ["📖", "English", "Reading and communication"],
                ["💻", "Informatics Practices", "Information systems"]
            ],

            "Arts / Humanities": [
                ["🏛️", "History", "Historical analysis"],
                ["🌍", "Geography", "Human and economic geography"],
                ["⚖️", "Political Science", "Politics and contemporary world"],
                ["🧠", "Psychology", "Human behaviour and psychology"],
                ["💰", "Economics", "Economic development"],
                ["📖", "English", "Literature and communication"]
            ]
        }
    };

    const COLLEGE_SUBJECTS = {
        "IT": [
            ["💻", "Programming in C", "Programming and problem solving"],
            ["📐", "Engineering Mathematics", "Mathematical methods"],
            ["🔢", "Digital Electronics", "Logic gates and digital circuits"],
            ["⚙️", "Engineering Mechanics", "Forces and motion"],
            ["⚛️", "Engineering Physics", "Physics fundamentals"],
            ["🌐", "Web Development", "HTML, CSS and JavaScript"]
        ],

        "Computer Science": [
            ["💻", "Programming", "Programming fundamentals"],
            ["📐", "Engineering Mathematics", "Mathematical methods"],
            ["🔢", "Digital Electronics", "Logic gates and circuits"],
            ["🗃️", "Data Structures", "Organising and processing data"],
            ["🌐", "Web Development", "HTML, CSS and JavaScript"],
            ["🖥️", "Computer Fundamentals", "Computer systems"]
        ],

        "Other Engineering": [
            ["📐", "Engineering Mathematics", "Mathematical methods"],
            ["⚛️", "Engineering Physics", "Physics fundamentals"],
            ["🧪", "Engineering Chemistry", "Chemistry fundamentals"],
            ["⚙️", "Engineering Mechanics", "Forces and motion"],
            ["💻", "Programming", "Programming fundamentals"],
            ["📏", "Engineering Graphics", "Technical drawing"]
        ],

        "Science": [
            ["⚛️", "Physics", "Core physics concepts"],
            ["🧪", "Chemistry", "Core chemistry concepts"],
            ["📐", "Mathematics", "Mathematical methods"],
            ["📖", "English", "Communication skills"]
        ],

        "Commerce": [
            ["📊", "Accountancy", "Accounting concepts"],
            ["💹", "Business Studies", "Business and management"],
            ["💰", "Economics", "Economic concepts"]
        ],

        "Arts / Humanities": [
            ["🏛️", "History", "Historical studies"],
            ["🌍", "Geography", "Geographical studies"],
            ["⚖️", "Political Science", "Political systems"],
            ["📖", "English", "Communication skills"]
        ],

        "Other": [
            ["📘", "Core Subject 1", "Course-specific learning"],
            ["📗", "Core Subject 2", "Course-specific learning"],
            ["📙", "Core Subject 3", "Course-specific learning"],
            ["📝", "Communication Skills", "Academic communication"]
        ]
    };

    function byId(id) {
        return document.getElementById(id);
    }

    function getSavedChoice() {
        try {
            return JSON.parse(
                localStorage.getItem("shikshaSubjectsChoice") || "{}"
            );
        } catch (error) {
            return {};
        }
    }

    function saveChoice(studentClass, stream) {
        try {
            localStorage.setItem(
                "shikshaSubjectsChoice",
                JSON.stringify({
                    studentClass: studentClass,
                    stream: stream
                })
            );
        } catch (error) {
            console.warn("Unable to save subject selection.", error);
        }
    }

    function getSubjects(studentClass, stream) {
        if (!studentClass) {
            return [];
        }

        if (SUBJECTS[studentClass]) {
            const classData = SUBJECTS[studentClass];

            if (classData[stream]) {
                return classData[stream];
            }

            if (classData.default) {
                return classData.default;
            }

            return [];
        }

        if (studentClass.startsWith("College")) {
            return COLLEGE_SUBJECTS[stream] ||
                   COLLEGE_SUBJECTS.Other;
        }

        return [];
    }

    function renderSubjects() {
        const classSelect = byId("subjectsClass");
        const streamSelect = byId("subjectsStream");
        const streamWrap = byId("subjectsStreamWrap");
        const grid = byId("dynamicSubjectGrid");
        const notice = byId("subjectsNotice");

        if (!classSelect || !streamSelect || !grid || !notice) {
            console.error(
                "My Subjects HTML elements missing. Check index.html IDs."
            );
            return;
        }

        const studentClass = classSelect.value;
        const stream = streamSelect.value;

        const isSeniorClass =
            studentClass === "Class 11" ||
            studentClass === "Class 12";

        const isCollege =
            studentClass.startsWith("College");

        if (streamWrap) {
            streamWrap.style.display =
                (isSeniorClass || isCollege) ? "flex" : "none";
        }

        grid.replaceChildren();

        if (!studentClass) {
            notice.textContent =
                "Please select your class to see your subjects.";
            return;
        }

        if ((isSeniorClass || isCollege) && !stream) {
            notice.textContent = isCollege
                ? "Please select your college branch."
                : "Please select Science, Commerce or Arts / Humanities.";

            return;
        }

        const subjects = getSubjects(studentClass, stream);

        if (subjects.length === 0) {
            notice.textContent = "No subjects found for this selection.";
            return;
        }

        notice.textContent =
            "Showing " + subjects.length +
            " subjects for " + studentClass +
            (stream ? " — " + stream : "") + ".";

        subjects.forEach(function (subject) {
            const card = document.createElement("article");
            card.className = "dynamic-subject-card";

            const icon = document.createElement("div");
            icon.className = "dynamic-subject-icon";
            icon.textContent = subject[0];

            const title = document.createElement("h3");
            title.textContent = subject[1];

            const description = document.createElement("p");
            description.textContent = subject[2];

            const button = document.createElement("button");
            button.type = "button";
            button.textContent = "Start Learning →";

            button.addEventListener("click", function () {
                openSubject(subject[1]);
            });

            card.append(icon, title, description, button);
            grid.appendChild(card);
        });

        saveChoice(studentClass, stream);
    }

    function openSubject(subjectName) {
        /*
         * Save the selected subject so another page can use it.
         */
        try {
            localStorage.setItem("dashboardTopic", subjectName);
            localStorage.setItem("shikshaSelectedSubject", subjectName);
        } catch (error) {
            console.warn("Unable to save selected subject.", error);
        }

        /*
         * Fill a topic input if the AI Teacher page has one.
         */
        const topicInput =
            byId("dashboardTopic") ||
            byId("aiTopic") ||
            byId("topicInput");

        if (topicInput && "value" in topicInput) {
            topicInput.value = subjectName;
        }

        /*
         * Use the existing navigation function if available.
         */
        if (typeof window.openAIFromDashboard === "function") {
            window.openAIFromDashboard();
            return;
        }

        if (typeof window.showDashboardSection === "function") {
            window.showDashboardSection("aiTeacher");
            return;
        }

        /*
         * If the existing navigation function is unavailable,
         * show a message instead of breaking the page.
         */
        alert(
            subjectName +
            " selected! Open AI Teacher to start learning."
        );
    }

    function initializeSubjects() {
        const classSelect = byId("subjectsClass");
        const streamSelect = byId("subjectsStream");

        if (!classSelect || !streamSelect) {
            console.error(
                "Subjects selectors not found. Check the HTML section."
            );
            return;
        }

        const saved = getSavedChoice();

        const validClasses = [
            "Class 9",
            "Class 10",
            "Class 11",
            "Class 12",
            "College 1st Year",
            "College 2nd Year",
            "College 3rd Year",
            "College 4th Year"
        ];

        if (
            saved.studentClass &&
            validClasses.includes(saved.studentClass)
        ) {
            classSelect.value = saved.studentClass;
        }

        if (saved.stream) {
            streamSelect.value = saved.stream;
        }

        classSelect.addEventListener("change", function () {
            const currentClass = classSelect.value;

            /*
             * Reset the stream when the selected class changes.
             */
            if (
                currentClass === "Class 9" ||
                currentClass === "Class 10"
            ) {
                streamSelect.value = "Science";
            } else {
                streamSelect.value = "";
            }

            renderSubjects();
        });

        streamSelect.addEventListener("change", renderSubjects);

        renderSubjects();

        /*
         * Re-render when the user opens My Subjects.
         */
        document.addEventListener("click", function (event) {
            const target = event.target.closest(
                '[data-section="subjects"], [href="#subjects"]'
            );

            if (target) {
                setTimeout(renderSubjects, 100);
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeSubjects
        );
    } else {
        initializeSubjects();
    }

})();