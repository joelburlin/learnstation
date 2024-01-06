
export function generateMathQuestion() {
    const num1 = Math.ceil(Math.random() * 10); // random number between 1-10
    const num2 = Math.ceil(Math.random() * 10); // random number between 1-10
    const question = `${num1} + ${num2}`;
    const answer = num1 + num2;

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

export function showMathQuiz() {
    const mathQuiz = generateMathQuestion();
    document.getElementById('mathQuestion').textContent = mathQuiz.question;
    window.quizAnswer = mathQuiz.answer; // Store the quiz answer globally
}