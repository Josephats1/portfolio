class LoveMatchQuestionnaire {
    constructor() {
        this.currentSection = 1;
        this.totalSections = 11; // Including preview section
        this.userData = {};
        this.formElement = document.getElementById('love-questionnaire-form');
        this.scriptsUrl = 'https://script.google.com/macros/s/AKfycbz9aXJuP3f2ewxA/exec';
        
        this.init();
    }
    
    init() {
        // Remove the form's action to prevent redirection
        if (this.formElement) {
            this.formElement.removeAttribute('action');
            this.formElement.removeAttribute('method');
        }
        
        this.setupEventListeners();
        this.setupNavigation();
        this.setupCardInteractions();
        this.setupAuraQuiz();
        this.updateProgress();
        this.loadSavedData();
        
        // Show first section
        this.showSection(1);
    }
    
    setupEventListeners() {
        // Next/Previous buttons using event delegation
        document.addEventListener('click', (e) => {
            const button = e.target.closest('.nav-btn');
            if (button) {
                e.preventDefault();
                
                if (button.classList.contains('next-btn')) {
                    this.handleNextButton(button);
                } else if (button.classList.contains('prev-btn')) {
                    this.handlePrevButton(button);
                }
            }
            
            // Edit questionnaire button
            if (e.target.closest('#edit-questionnaire')) {
                this.showSection(1);
            }
            
            // Final submit button
            if (e.target.closest('#final-submit-btn')) {
                this.handleFinalSubmit();
            }
        });
        
        // Form submit button
        const submitBtn = document.getElementById('submit-button');
        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handlePreviewSubmit();
            });
        }
        
        // Auto-save form data
        this.setupAutoSave();
        
        // Modal buttons
        document.getElementById('close-success')?.addEventListener('click', () => {
            this.hideModal('success-modal');
        });
        
        document.getElementById('close-error')?.addEventListener('click', () => {
            this.hideModal('error-modal');
        });
        
        document.getElementById('new-submission')?.addEventListener('click', () => {
            this.resetForm();
        });
        
        // Mobile navigation
        this.setupMobileNavigation();
    }
    
    setupAutoSave() {
        // Save on input change
        document.querySelectorAll('input, textarea, select').forEach(element => {
            element.addEventListener('change', () => {
                this.saveFormData();
            });
            element.addEventListener('input', () => {
                this.saveFormData();
            });
        });
    }
    
    saveFormData() {
        const formData = this.collectFormData();
        localStorage.setItem('loveMatchFormData', JSON.stringify(formData));
    }
    
    loadSavedData() {
        try {
            const saved = localStorage.getItem('loveMatchFormData');
            if (saved) {
                const data = JSON.parse(saved);
                this.populateForm(data);
            }
        } catch (e) {
            console.warn('Could not load saved data:', e);
        }
    }
    
    populateForm(data) {
        // Populate input fields
        Object.entries(data).forEach(([name, value]) => {
            const elements = document.querySelectorAll(`[name="${name}"]`);
            
            elements.forEach(element => {
                if (element.type === 'checkbox' || element.type === 'radio') {
                    if (Array.isArray(value)) {
                        element.checked = value.includes(element.value);
                    } else {
                        element.checked = element.value === value;
                    }
                } else if (element.tagName === 'SELECT' || element.type === 'text' || 
                          element.type === 'email' || element.type === 'tel' || 
                          element.type === 'number') {
                    element.value = value || '';
                } else if (element.tagName === 'TEXTAREA') {
                    element.value = value || '';
                }
            });
        });
        
        // Update visual states for cards
        this.updateCardStates();
    }
    
    updateCardStates() {
        // Update value cards
        document.querySelectorAll('.value-card .card-checkbox').forEach(checkbox => {
            if (checkbox.checked) {
                checkbox.closest('.value-card').classList.add('selected');
            }
        });
        
        // Update emotion cards
        document.querySelectorAll('.emotion-card .emotion-radio').forEach(radio => {
            if (radio.checked) {
                radio.closest('.emotion-card').classList.add('selected');
            }
        });
        
        // Update phobia cards
        document.querySelectorAll('.phobia-card .card-checkbox').forEach(checkbox => {
            if (checkbox.checked) {
                checkbox.closest('.phobia-card').classList.add('selected');
            }
        });
        
        // Update aura cards
        const auraInput = document.getElementById('aura-type-input');
        if (auraInput && auraInput.value) {
            const auraKey = Object.keys(this.auraDescriptions || {}).find(key => 
                this.auraDescriptions[key].name === auraInput.value
            );
            if (auraKey) {
                const auraCard = document.querySelector(`.aura-card[data-aura="${auraKey}"]`);
                if (auraCard) {
                    auraCard.classList.add('active');
                    this.updateAuraDisplay(auraKey);
                }
            }
        }
        
        // Update counters
        this.updateValueCount();
        this.updatePhobiaCount();
    }
    
    collectFormData() {
        const formData = new FormData(this.formElement);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }
        
        // Add special fields
        const auraInput = document.getElementById('aura-type-input');
        if (auraInput && auraInput.value) {
            data.aura_type = auraInput.value;
        }
        
        return data;
    }
    
    handleNextButton(button) {
        const nextSection = button.dataset.next;
        
        if (nextSection === 'preview-section') {
            // Validate current section first
            if (!this.validateCurrentSection()) {
                return;
            }
            
            // Collect all data and show preview
            this.userData = this.collectFormData();
            this.generatePreview();
            this.goToSection('preview-section');
        } else {
            if (this.validateCurrentSection()) {
                this.goToSection(nextSection);
            }
        }
    }
    
    handlePrevButton(button) {
        const prevSection = button.dataset.prev;
        this.goToSection(prevSection);
    }
    
    handlePreviewSubmit() {
        // Validate current section first
        if (!this.validateCurrentSection()) {
            return;
        }
        
        // Collect all data and show preview
        this.userData = this.collectFormData();
        this.generatePreview();
        this.goToSection('preview-section');
    }
    
    validateCurrentSection() {
        const section = document.querySelector('.form-section.active');
        if (!section) return true;
        
        let isValid = true;
        
        // Clear previous errors
        section.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        section.querySelectorAll('.error-message').forEach(el => el.remove());
        
        // Validate required fields
        const requiredFields = section.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (field.type === 'checkbox' || field.type === 'radio') {
                const name = field.name;
                const checked = section.querySelectorAll(`input[name="${name}"]:checked`).length > 0;
                
                if (!checked) {
                    this.showFieldError(field, 'This field is required');
                    isValid = false;
                }
            } else if (field.type === 'email' && field.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    this.showFieldError(field, 'Please enter a valid email address');
                    isValid = false;
                }
            } else if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            }
        });
        
        // Special validation for specific sections
        switch(this.currentSection) {
            case 4: // Values section
                const selectedValues = document.querySelectorAll('.value-card .card-checkbox:checked').length;
                if (selectedValues === 0) {
                    this.showSectionError('Please select at least one core value');
                    isValid = false;
                } else if (selectedValues > 2) {
                    this.showSectionError('Please select maximum 2 core values');
                    isValid = false;
                }
                break;
                
            case 8: // Phobias section
                const selectedPhobias = document.querySelectorAll('.phobia-card .card-checkbox:checked').length;
                if (selectedPhobias === 0) {
                    this.showSectionError('Please select at least one phobia category');
                    isValid = false;
                } else if (selectedPhobias > 2) {
                    this.showSectionError('Please select maximum 2 phobia categories');
                    isValid = false;
                }
                break;
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        field.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.appendChild(errorDiv);
        }
        
        // Scroll to error
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    showSectionError(message) {
        const notification = document.createElement('div');
        notification.className = 'section-error';
        notification.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff9800;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
    
    goToSection(sectionId) {
        document.querySelectorAll('.form-section').forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Update current section number
            const sections = [
                'personal-info-section',
                'contact-info-section',
                'relationship-prefs-section',
                'values-section',
                'personality-section',
                'family-prefs-section',
                'emotional-state-section',
                'phobias-section',
                'zodiac-section',
                'partner-prefs-section',
                'preview-section'
            ];
            
            this.currentSection = sections.indexOf(sectionId) + 1;
            this.updateProgress();
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    showSection(sectionNumber) {
        const sections = [
            'personal-info-section',
            'contact-info-section',
            'relationship-prefs-section',
            'values-section',
            'personality-section',
            'family-prefs-section',
            'emotional-state-section',
            'phobias-section',
            'zodiac-section',
            'partner-prefs-section',
            'preview-section'
        ];
        
        this.goToSection(sections[sectionNumber - 1]);
    }
    
    updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            const progressPercent = (this.currentSection / this.totalSections) * 100;
            progressFill.style.width = `${progressPercent}%`;
        }
        
        // Update progress dots
        document.querySelectorAll('.progress-dot').forEach((dot, index) => {
            const step = index + 1;
            if (step < this.currentSection) {
                dot.classList.add('completed', 'active');
            } else if (step === this.currentSection) {
                dot.classList.add('active');
                dot.classList.remove('completed');
            } else {
                dot.classList.remove('active', 'completed');
            }
        });
        
        // Update mobile progress
        this.updateMobileProgress();
    }
    
    setupMobileNavigation() {
        const mobilePrev = document.getElementById('mobile-prev');
        const mobileNext = document.getElementById('mobile-next');
        
        if (mobilePrev) {
            mobilePrev.addEventListener('click', () => {
                if (this.currentSection > 1) {
                    this.showSection(this.currentSection - 1);
                }
            });
        }
        
        if (mobileNext) {
            mobileNext.addEventListener('click', () => {
                if (this.currentSection < this.totalSections) {
                    if (this.validateCurrentSection()) {
                        this.showSection(this.currentSection + 1);
                    }
                }
            });
        }
    }
    
    updateMobileProgress() {
        const mobileProgress = document.getElementById('mobile-progress');
        if (mobileProgress) {
            const progressPercent = (this.currentSection / this.totalSections) * 100;
            mobileProgress.style.width = `${progressPercent}%`;
        }
        
        const mobilePrev = document.getElementById('mobile-prev');
        const mobileNext = document.getElementById('mobile-next');
        
        if (mobilePrev) {
            mobilePrev.disabled = this.currentSection === 1;
        }
        
        if (mobileNext) {
            mobileNext.disabled = this.currentSection === this.totalSections;
        }
    }
    
    setupCardInteractions() {
        // Value cards
        document.querySelectorAll('.value-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const checkbox = card.querySelector('.card-checkbox');
                if (!checkbox) return;
                
                const selectedCount = document.querySelectorAll('.value-card .card-checkbox:checked').length;
                
                if (checkbox.checked) {
                    checkbox.checked = false;
                    card.classList.remove('selected');
                } else if (selectedCount < 2) {
                    checkbox.checked = true;
                    card.classList.add('selected');
                }
                
                this.updateValueCount();
                this.saveFormData();
            });
        });
        
        // Emotion cards
        document.querySelectorAll('.emotion-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const radio = card.querySelector('.emotion-radio');
                if (!radio) return;
                
                radio.checked = true;
                document.querySelectorAll('.emotion-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                
                this.saveFormData();
            });
        });
        
        // Phobia cards
        document.querySelectorAll('.phobia-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const checkbox = card.querySelector('.card-checkbox');
                if (!checkbox) return;
                
                const selectedCount = document.querySelectorAll('.phobia-card .card-checkbox:checked').length;
                
                if (checkbox.checked) {
                    checkbox.checked = false;
                    card.classList.remove('selected');
                } else if (selectedCount < 2) {
                    checkbox.checked = true;
                    card.classList.add('selected');
                }
                
                this.updatePhobiaCount();
                this.saveFormData();
            });
        });
    }
    
    updateValueCount() {
        const valueCount = document.getElementById('values-count');
        if (valueCount) {
            const selected = document.querySelectorAll('.value-card .card-checkbox:checked').length;
            valueCount.textContent = selected;
        }
    }
    
    updatePhobiaCount() {
        const phobiaCount = document.getElementById('phobias-count');
        if (phobiaCount) {
            const selected = document.querySelectorAll('.phobia-card .card-checkbox:checked').length;
            phobiaCount.textContent = selected;
        }
    }
    
    setupAuraQuiz() {
        const auraCards = document.querySelectorAll('.aura-card');
        const auraInput = document.getElementById('aura-type-input');
        
        if (!auraCards.length || !auraInput) return;
        
        this.auraDescriptions = {
            red: { 
                name: "🔥 Red Aura",
                description: "You're a passionate, energetic individual with strong leadership qualities.",
                traits: ["Fiery energy and strong presence", "Natural leader and protector", "High motivation and determination", "Passionate about everything you do", "Animal spirit: Lion/Wolf"]
            },
            orange: { 
                name: "🍊 Orange Aura",
                description: "You're creative, social, and bring joy to those around you.",
                traits: ["Highly creative and artistic", "Brings joy and positivity", "Excellent social skills", "Playful and fun-loving", "Animal spirit: Dolphin/Monkey"]
            },
            yellow: { 
                name: "🌞 Yellow Aura",
                description: "You radiate optimism, warmth, and intellectual curiosity.",
                traits: ["Radiates warmth and positivity", "Intellectual and curious", "Brings light to situations", "Optimistic problem-solver", "Animal spirit: Dove/Eagle"]
            },
            green: { 
                name: "🌿 Green Aura",
                description: "You're grounded, nurturing, and bring harmony to relationships.",
                traits: ["Growth-oriented and balanced", "Nurturing and supportive", "Grounded and stable", "Brings harmony to relationships", "Animal spirit: Deer/Turtle"]
            },
            blue: { 
                name: "💙 Blue Aura",
                description: "You're calm, communicative, and create peaceful environments.",
                traits: ["Excellent communicator", "Calm and peaceful presence", "Trustworthy and loyal", "Expressive and creative", "Animal spirit: Whale/Dolphin"]
            },
            indigo: { 
                name: "🌀 Indigo Aura",
                description: "You're intuitive, mysterious, and possess deep insight.",
                traits: ["Highly intuitive", "Deep thinker and wise", "Mysterious and insightful", "Rare and special energy", "Animal spirit: Owl/Cat"]
            },
            violet: { 
                name: "🔮 Violet Aura",
                description: "You're spiritual, transformative, and inspire others.",
                traits: ["Spiritual and visionary", "Transformative energy", "Highly creative", "Inspires others", "Animal spirit: Butterfly/Phoenix"]
            }
        };
        
        auraCards.forEach(card => {
            card.addEventListener('click', () => {
                auraCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                
                const auraType = card.dataset.aura;
                const auraData = this.auraDescriptions[auraType];
                
                if (auraData) {
                    auraInput.value = auraData.name;
                    this.updateAuraDisplay(auraType);
                    this.saveFormData();
                }
            });
        });
    }
    
    updateAuraDisplay(auraType) {
        const auraName = document.getElementById('aura-name');
        const auraDescription = document.getElementById('aura-description');
        const auraDetails = document.getElementById('aura-details');
        const auraResult = document.getElementById('aura-result');
        
        if (!auraName || !auraDescription || !auraDetails) return;
        
        const auraData = this.auraDescriptions[auraType];
        if (!auraData) return;
        
        auraName.textContent = auraData.name;
        auraDescription.textContent = auraData.description;
        
        auraDetails.innerHTML = '';
        auraData.traits.forEach(trait => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check"></i> ${trait}`;
            auraDetails.appendChild(li);
        });
        
        if (auraResult) {
            auraResult.classList.add('show');
        }
    }
    
    generatePreview() {
        const previewContent = document.getElementById('preview-content');
        if (!previewContent) return;
        
        const sections = [
            { id: 'personal', title: 'Personal Information', icon: 'user-circle' },
            { id: 'contact', title: 'Contact Information', icon: 'address-card' },
            { id: 'relationship', title: 'Relationship Preferences', icon: 'heart' },
            { id: 'values', title: 'Core Values', icon: 'star' },
            { id: 'personality', title: 'Personality & Beliefs', icon: 'brain' },
            { id: 'family', title: 'Family Preferences', icon: 'home' },
            { id: 'emotional', title: 'Emotional State', icon: 'smile' },
            { id: 'phobias', title: 'Phobias', icon: 'spider' },
            { id: 'zodiac', title: 'Astrological Information', icon: 'star-and-crescent' },
            { id: 'partner', title: 'Ideal Partner Preferences', icon: 'search' }
        ];
        
        let html = '';
        
        sections.forEach(section => {
            const sectionData = this.extractSectionData(section.id);
            html += this.generateSectionPreview(section, sectionData);
        });
        
        previewContent.innerHTML = html;
    }
    
    extractSectionData(sectionKey) {
        const sectionMap = {
            personal: ['fullname', 'country', 'age', 'height', 'skin_tone', 'marital_status', 'children', 'occupation'],
            contact: ['email', 'phone', 'whatsapp', 'social_media', 'contact_preference'],
            relationship: ['deal_breakers', 'love_languages', 'marriage_preference', 'communication_style', 'relationship_perspective'],
            values: ['core_values'],
            personality: ['religion', 'spiritual_practice', 'personality_type', 'social_archetype', 'jungian_types', 'cognitive_dissonance'],
            family: ['love_for_children', 'desired_children'],
            emotional: ['emotional_state'],
            phobias: ['phobias'],
            zodiac: ['zodiac_sign', 'astrology_belief', 'soulmate_belief'],
            partner: ['time_with_partner', 'marry_with_children', 'past_matters', 'partner_skin_tone', 
                     'partner_age_range', 'partner_hair_color', 'partner_eye_color', 'partner_fashion_sense',
                     'partner_voice_tone', 'partner_body_type', 'partner_height_range', 'aura_type',
                     'partner_personality_traits', 'partner_intro_extro', 'partner_playful_serious',
                     'partner_leader_supportive', 'partner_attractive_features', 'partner_lifestyle',
                     'partner_health_fitness', 'partner_travel', 'partner_sleep_schedule',
                     'partner_planning_style', 'partner_relationship_dynamic', 'partner_attachment_style',
                     'partner_communication_frequency', 'partner_emotional_expression', 'partner_conflict_style',
                     'relationship_timeline', 'long_distance_thoughts', 'relocate_for_love', 'partner_financial_stability']
        };
        
        const fields = sectionMap[sectionKey] || [];
        const data = {};
        
        fields.forEach(field => {
            if (this.userData[field]) {
                data[field] = this.userData[field];
            }
        });
        
        return data;
    }
    
    generateSectionPreview(section, data) {
        if (Object.keys(data).length === 0) {
            return '';
        }
        
        let html = `
            <div class="preview-section">
                <div class="preview-section-header">
                    <h4><i class="fas fa-${section.icon}"></i> ${section.title}</h4>
                </div>
                <div class="preview-section-content">
        `;
        
        Object.entries(data).forEach(([key, value]) => {
            if (value && (Array.isArray(value) ? value.length > 0 : value.toString().trim() !== '')) {
                const label = this.formatLabel(key);
                const displayValue = this.formatValue(value);
                
                html += `
                    <div class="preview-item">
                        <span class="preview-label">${label}</span>
                        <span class="preview-value">${displayValue}</span>
                    </div>
                `;
            }
        });
        
        html += `
                </div>
            </div>
        `;
        
        return html;
    }
    
    formatLabel(key) {
        return key
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    
    formatValue(value) {
        if (Array.isArray(value)) {
            return value.join(', ');
        }
        
        if (typeof value === 'string') {
            // Handle special values
            if (value === '10') return '10% (Not for me)';
            if (value === '20') return '20%';
            if (value === '30') return '30%';
            if (value === '50') return '50% (Neutral)';
            if (value === '60') return '60%';
            if (value === '70') return '70%';
            if (value === '80') return '80% (Love kids)';
            if (value === '90') return '90%';
            if (value === '100') return '100% (Adore them)';
            
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
        
        return String(value);
    }
    
    async handleFinalSubmit() {
        // Validate privacy agreement
        const agreement = document.getElementById('privacy-agreement');
        if (!agreement || !agreement.checked) {
            this.showNotification('Please agree to the privacy terms before submitting', 'error');
            return;
        }
        
        // Show loading
        this.showLoading();
        
        try {
            // Prepare data for submission
            const submissionData = this.prepareSubmissionData();
            
            // Submit to Google Sheets via Apps Script
            const success = await this.submitToGoogleSheets(submissionData);
            
            if (success) {
                // Clear localStorage
                localStorage.removeItem('loveMatchFormData');
                
                // Show success
                setTimeout(() => {
                    this.hideLoading();
                    this.showSuccessModal();
                }, 1500);
            } else {
                throw new Error('Failed to submit to Google Sheets');
            }
            
        } catch (error) {
            console.error('Submission error:', error);
            this.hideLoading();
            this.showErrorModal('Failed to submit questionnaire. Please try again.');
        }
    }
    
    prepareSubmissionData() {
        // Add timestamp
        const data = { ...this.userData };
        data.timestamp = new Date().toISOString();
        data.submission_date = new Date().toLocaleString();
        
        return data;
    }
    
    async submitToGoogleSheets(data) {
        try {
            // Convert data to URL parameters
            const params = new URLSearchParams();
            
            // Add all data as parameters
            Object.entries(data).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    params.append(key, value.join(', '));
                } else if (value !== null && value !== undefined) {
                    params.append(key, value.toString());
                }
            });
            
            // Add email configuration
            params.append('to', 'bjerrykibs@gmail.com');
            params.append('subject', 'New Love Match Questionnaire Submission');
            
            // Submit using fetch with no-cors
            await fetch(this.scriptsUrl, {
                method: 'POST',
                body: params,
                mode: 'no-cors'
            });
            
            return true;
            
        } catch (error) {
            console.error('Google Sheets submission error:', error);
            return false;
        }
    }
    
    showLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    }
    
    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
    
    showSuccessModal() {
        const modal = document.getElementById('success-modal');
        if (modal) {
            modal.style.display = 'flex';
            this.createConfetti();
        }
    }
    
    showErrorModal(message) {
        const modal = document.getElementById('error-modal');
        const errorMessage = document.getElementById('error-message');
        
        if (modal && errorMessage) {
            errorMessage.textContent = message || 'An error occurred. Please try again.';
            modal.style.display = 'flex';
        }
    }
    
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    showNotification(message, type = 'error') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : '#4caf50'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
    
    createConfetti() {
        const colors = ['#e91e63', '#9c27b0', '#2196f3', '#4caf50', '#ff9800', '#ffeb3b'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: -20px;
                left: ${Math.random() * 100}vw;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                opacity: ${Math.random() * 0.5 + 0.5};
                z-index: 9999;
                animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentElement) {
                    confetti.remove();
                }
            }, 5000);
        }
    }
    
    resetForm() {
        // Clear form
        if (this.formElement) {
            this.formElement.reset();
        }
        
        // Clear card selections
        document.querySelectorAll('.selected, .active').forEach(el => {
            el.classList.remove('selected', 'active');
        });
        
        // Clear checkboxes and radios
        document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => {
            input.checked = false;
        });
        
        // Clear aura display
        const auraResult = document.getElementById('aura-result');
        if (auraResult) {
            auraResult.classList.remove('show');
        }
        
        // Clear counters
        this.updateValueCount();
        this.updatePhobiaCount();
        
        // Clear localStorage
        localStorage.removeItem('loveMatchFormData');
        
        // Reset to first section
        this.currentSection = 1;
        this.updateProgress();
        this.showSection(1);
        
        // Hide modals
        this.hideModal('success-modal');
        this.hideModal('error-modal');
    }
}

// Initialize the questionnaire
document.addEventListener('DOMContentLoaded', () => {
    // Add body loaded class
    document.body.classList.add('loaded');
    
    // Initialize questionnaire
    window.loveMatchApp = new LoveMatchQuestionnaire();
});