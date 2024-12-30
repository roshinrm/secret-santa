document.getElementById('generateButton').addEventListener('click', () => {
    const namesInput = document.getElementById('namesInput').value.trim();
    const resultList = document.getElementById('resultList');
    const inputSection = document.getElementById('inputSection');
    const outputSection = document.getElementById('outputSection');
    const confettiContainer = document.getElementById('confettiContainer');
    const downloadPDFButton = document.getElementById('downloadPDFButton');

    resultList.innerHTML = '';
    if (!namesInput) {
        alert('Please enter some names!');
        return;
    }

    let names = namesInput.split('\n').map(name => name.trim()).filter(name => name);
    if (names.length < 2) {
        alert('Enter at least two names!');
        return;
    }

    // Shuffle and ensure no one gets their own name
    let shuffled = [...names];
    do {
        shuffled = shuffleArray([...names]);
    } while (shuffled.some((name, index) => name === names[index]));

    // Hide input and show output
    inputSection.classList.add('hidden');
    outputSection.classList.remove('hidden');
    downloadPDFButton.classList.remove('hidden');

    // Display matches with animation
    names.forEach((name, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${name} → ${shuffled[index]}`;
        listItem.style.animationDelay = `${index * 0.1}s`;
        resultList.appendChild(listItem);
    });

    // Trigger confetti
    launchConfetti(confettiContainer);

    // Save matches for PDF generation
    downloadPDFButton.onclick = () => downloadMatchesAsPDF(names, shuffled);
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function launchConfetti(container) {
    container.innerHTML = '';
    container.classList.remove('hidden');

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 70%)`;
        confetti.style.animationDelay = `${Math.random() * 1}s`;
        container.appendChild(confetti);
    }

    setTimeout(() => {
        container.classList.add('hidden');
    }, 3000);
}

function downloadMatchesAsPDF(names, matches) {
    const { jsPDF } = window.jspdf; // Access jsPDF module
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Secret Santa Matches 🎅', 10, 10);

    names.forEach((name, index) => {
        doc.text(`${name} → ${matches[index]}`, 10, 20 + index * 10);
    });

    doc.save('Secret_Santa_Matches.pdf');
}

