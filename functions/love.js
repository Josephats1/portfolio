let images = [
    'images/ring1.jpg',
    'images/ring3.jpg',
    'images/ring4.jpg'
];
let index = 0;

function changeBackground() {
    // Correct the ID selector - it should match your HTML
    document.getElementById('personal-info-section').style.backgroundImage = `url(${images[index]})`;
    document.getElementById('personal-info-section').style.backgroundSize = 'cover';
    document.getElementById('personal-info-section').style.backgroundPosition = 'center';
    document.getElementById('personal-info-section').style.backgroundRepeat = 'no-repeat';
    
    index = (index + 1) % images.length;
}

// Call the function immediately to set the first image
changeBackground();

// Set interval to change images every 5 seconds (5000 milliseconds)
setInterval(changeBackground, 5000);
    
    // Card selection functions
    function toggleSelection(card, group) {
        const hiddenInput = card.querySelector('input');
        const selectedCards = document.querySelectorAll(`.card.selected[data-group="${group}"]`);
        
        if (card.classList.contains('selected')) {
            card.classList.remove('selected');
            hiddenInput.checked = false;
        } else {
            // Limit selection based on group
            if (group === 'values' && selectedCards.length >= 2) {
                return; // Don't allow more than 2 selections for values
            }
            
            card.classList.add('selected');
            hiddenInput.checked = true;
            card.setAttribute('data-group', group);
        }
    }
    
    function selectEmotionCard(card) {
        // Remove selection from all emotion cards first
        document.querySelectorAll('.emotion-card').forEach(c => {
            c.classList.remove('selected');
            c.querySelector('input').checked = false;
        });
        
        // Add selection to clicked card
        card.classList.add('selected');
        card.querySelector('input').checked = true;
    }
    
    // Form submission handling
    document.getElementById('loveQuestionnaireForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Here you would typically send the form data to the server
        // For demonstration, we'll just show an alert
        alert('Thank you for submitting your love questionnaire!');
        
        // In a real application, you would uncomment the following line:
        // this.submit();
    });
    // AURA
  const auraDescriptions = {
    red: {
        title: "🔥 Red Aura",
        description: "You are bold, energetic, and a natural leader! Your fiery spirit drives you to take action and inspire others.",
        traits: ["Passionate", "Courageous", "Determined", "Strong-willed"]
    },
    orange: {
        title: "🍊 Orange Aura",
        description: "You are playful, creative, and full of enthusiasm! Your vibrant energy attracts joy and spontaneity.",
        traits: ["Adventurous", "Energetic", "Sociable", "Optimistic"]
    },
    yellow: {
        title: "🌞 Yellow Aura",
        description: "You radiate sunshine and optimism! Your warmth uplifts those around you, and you see the bright side in everything.",
        traits: ["Cheerful", "Intellectual", "Confident", "Expressive"]
    },
    green: {
        title: "🌿 Green Aura",
        description: "You are balanced, nurturing, and deeply connected to nature. Your calm presence brings harmony to any situation.",
        traits: ["Compassionate", "Patient", "Growth-oriented", "Healing"]
    },
    blue: {
        title: "🌊 Blue Aura",
        description: "You are wise, serene, and deeply intuitive. People trust you for your calming energy and insightful mind.",
        traits: ["Communicative", "Truthful", "Peaceful", "Loyal"]
    },
    indigo: {
        title: "🌀 Indigo Aura",
        description: "You are mysterious, intuitive, and spiritually attuned. You see beyond the surface and sense hidden truths.",
        traits: ["Perceptive", "Visionary", "Sensitive", "Introspective"]
    },
    violet: {
        title: "🔮 Violet Aura",
        description: "You are a visionary, creative, and spiritually evolved. You embrace transformation and inspire others with your wisdom.",
        traits: ["Imaginative", "Inspirational", "Transcendent", "Artistic"]
    }
};

function selectCard(card, aura) {
    // Remove selection from all cards
    document.querySelectorAll('.aura-card').forEach(c => {
        c.classList.remove('selected');
        c.style.transform = 'scale(1)';
    });

    // Highlight selected card
    card.classList.add('selected');
    card.style.transform = 'scale(1.05)';

    // Display result
    const result = document.getElementById('aura-result');
    const auraName = document.getElementById('aura-name');
    const resultDesc = document.getElementById('aura-result-description');
    const traitsList = document.getElementById('aura-traits-list');

    // Update result content
    auraName.textContent = auraDescriptions[aura].title;
    resultDesc.textContent = auraDescriptions[aura].description;
    
    // Clear and rebuild traits list
    traitsList.innerHTML = '';
    auraDescriptions[aura].traits.forEach(trait => {
        const li = document.createElement('li');
        li.textContent = trait;
        li.className = 'aura-trait';
        traitsList.appendChild(li);
    });

    // Show result with animation
    result.style.display = 'block';
    result.style.animation = 'fadeIn 0.5s ease-in-out';
}

// Add click event listeners to all aura cards
document.querySelectorAll('.aura-card').forEach(card => {
    const auraType = card.classList.contains('red') ? 'red' :
                     card.classList.contains('orange') ? 'orange' :
                     card.classList.contains('yellow') ? 'yellow' :
                     card.classList.contains('green') ? 'green' :
                     card.classList.contains('blue') ? 'blue' :
                     card.classList.contains('indigo') ? 'indigo' : 'violet';
    
    card.addEventListener('click', () => selectCard(card, auraType));
});
function selectCard(card, aura) {
    // ... existing code ...
    
    // Set the hidden input value
    document.getElementById('aura-type-input').value = aura;
    
    // ... rest of the existing code ...
}
// Add animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .aura-trait {
        background-color: rgba(255,255,255,0.2);
        padding: 5px 10px;
        margin: 5px;
        border-radius: 15px;
        display: inline-block;
    }
`;
document.head.appendChild(style);