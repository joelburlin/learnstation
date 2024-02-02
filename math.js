export function generateMathQuestion(level, quizType = 'addition') {
    let question, answer;
    if (quizType === 'multiplication') {
        // For multiplication, the range starts from 2 and expands up to 12x12
        const min = Math.max(2, level);
        const max = Math.min(12, level + 4); // Gradually increase the range up to 12
        const num1 = Math.ceil(Math.random() * (max - min + 1)) + min - 1;
        const num2 = Math.ceil(Math.random() * (max - min + 1)) + min - 1;
        question = `${num1} × ${num2}`;
        window.quizQuestion = question; // Store the quiz answer globally

        answer = num1 * num2;
    } else {
        // Default to addition if no quiz type is specified or if it's not multiplication
        const min = level; // Minimum value increases with level
        const max = 5 + level;
        const num1 = Math.ceil(Math.random() * (max - min + 1)) + min - 1;
        const num2 = Math.ceil(Math.random() * (max - min + 1)) + min - 1;
        question = `${num1} + ${num2}`;
        window.quizQuestion = question; // Store the quiz answer globally
        answer = num1 + num2;
    }

    return { question, answer };
}

export function closeMathQuiz() {
    document.getElementById('mathQuizModal').style.display = 'none';

    // Assuming you have a function to calculate the sum of selected lions
    const selectedSum = calculateSelectedLionSum();
    const quizAnswer = window.quizAnswer;

    // Set a flag indicating whether the quiz answer was correct
    window.correctQuizAnswer = (selectedSum === quizAnswer);

    // Dispatch a custom event to indicate quiz completion
    document.dispatchEvent(new Event('mathQuizCompleted'));
}
export function calculateSelectedLionSum() {
    // Count the number of selected lions
    const selectedLionsCount = document.querySelectorAll('.lion.selected').length;
    
    console.log('Selected lions count:', selectedLionsCount); // Debugging line


    return selectedLionsCount;
}

export function showMathQuiz(quizType = 'addition') {
    const mathQuiz = generateMathQuestion(1, quizType); // Example: starts at level 1
    document.getElementById('mathQuestion').textContent = mathQuiz.question;
    window.quizAnswer = mathQuiz.answer; // Store the quiz answer globally
}