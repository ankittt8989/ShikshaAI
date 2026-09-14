// ==========================================
// SHIKSHAAI - MAIN JAVASCRIPT
// ==========================================

let currentQuiz = null;


// ==========================================
// AI EXPLANATION
// ==========================================

async function explainTopic() {

    const topicInput = document.getElementById("topicInput");
    const languageSelect = document.getElementById("languageSelect");

    const topic = topicInput.value.trim();
    const language = languageSelect.value;

    if (!topic) {
        alert("Please enter a topic.");
        return;
    }

    const result = document.getElementById("result");
    const explanation = document.getElementById("explanation");

    result.style.display = "block";

    explanation.innerHTML =
        "🤖 ShikshaAI is thinking...";

    try {

        const response = await fetch("/explain", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                topic: topic,
                language: language
            })

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Something went wrong"
            );
        }

        explanation.innerHTML =
            formatAIText(data.explanation);

    } catch (error) {

        console.error("Explanation Error:", error);

        explanation.innerHTML =
            "❌ AI could not generate the explanation. Please try again.";

    }
}


// ==========================================
// FORMAT AI TEXT
// ==========================================

function formatAIText(text) {

    if (!text) {
        return "No explanation generated.";
    }

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/^### (.*)$/gm, "<h3>$1</h3>")
        .replace(/\n/g, "<br>");
}


// ==========================================
// GENERATE QUIZ
// ==========================================

async function generateQuiz() {

    const topicInput =
        document.getElementById("topicInput");

    const languageSelect =
        document.getElementById("languageSelect");

    const topic =
        topicInput.value.trim();

    const language =
        languageSelect.value;


    if (!topic) {

        alert("Please enter a topic first.");

        return;
    }


    const quizSection =
        document.getElementById("quiz");

    const quizContainer =
        document.getElementById("quizContainer");


    quizSection.style.display = "block";


    quizContainer.innerHTML =
        "🤖 Creating your 5-question quiz...";


    try {

        const response = await fetch("/quiz", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                topic: topic,

                language: language

            })

        });


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Quiz generation failed"
            );

        }


        quizContainer.innerHTML = "";


        currentQuiz = data.quiz;

        window.currentQuiz = data.quiz;


        // ==================================
        // CREATE QUIZ QUESTIONS
        // ==================================

        data.quiz.forEach((item, index) => {

            const questionDiv =
                document.createElement("div");


            questionDiv.className =
                "question";


            questionDiv.innerHTML = `

                <h3>
                    ${index + 1}. ${item.question}
                </h3>

                ${item.options.map(option => `

                    <label>

                        <input
                            type="radio"
                            name="question${index}"
                            value="${option}"
                        >

                        ${option}

                    </label>

                `).join("")}

            `;


            quizContainer.appendChild(
                questionDiv
            );

        });


        // Scroll smoothly to quiz

        setTimeout(() => {

            quizSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 200);


    } catch (error) {

        console.error(
            "Quiz Error:",
            error
        );


        quizContainer.innerHTML = `
            ❌ Quiz could not be generated.
            <br><br>
            Please try again.
        `;

    }
}


// ==========================================
// CHECK QUIZ ANSWERS
// ==========================================

function checkAnswers() {

    if (!currentQuiz && !window.currentQuiz) {

        alert(
            "Please generate a quiz first."
        );

        return;
    }


    const quiz =
        currentQuiz || window.currentQuiz;


    let score = 0;


    quiz.forEach((question, index) => {

        const selected =
            document.querySelector(
                `input[name="question${index}"]:checked`
            );


        if (
            selected &&
            selected.value === question.answer
        ) {

            score++;

        }

    });


    const scoreElement =
        document.getElementById("score");


    let message;


    if (score === quiz.length) {

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
        ${score} / ${quiz.length}

        <br>

        <small>
            ${message}
        </small>

    `;


    scoreElement.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}


// ==========================================
// ENTER KEY SUPPORT
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const topicInput =
            document.getElementById("topicInput");


        if (topicInput) {

            topicInput.addEventListener(
                "keypress",
                function (event) {

                    if (event.key === "Enter") {

                        explainTopic();

                    }

                }
            );

        }

    }
);