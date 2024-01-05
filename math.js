
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
export function  calculateSelectedLionSum() {
    let sum = 0;
    document.querySelectorAll('.lion.selected').forEach(lion => {
        const lionValue = lion.dataset.value;
        console.log('Lion value:', lionValue); // Debugging line

        if (!isNaN(lionValue)) {
            sum += parseInt(lionValue, 10);
        } else {
            console.error('Invalid lion value:', lionValue); // Error logging
        }
    });

    console.log('Total sum:', sum); // Debugging line
    return sum;
}
export function showMathQuiz() {
    const mathQuiz = generateMathQuestion();
    document.getElementById('mathQuestion').textContent = mathQuiz.question;
    window.quizAnswer = mathQuiz.answer;
}
