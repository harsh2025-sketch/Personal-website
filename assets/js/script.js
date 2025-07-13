// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for anchor links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }

    // Update active nav on scroll
    window.addEventListener('scroll', updateActiveNav);
    
    // Header background opacity on scroll
    const header = document.querySelector('.header');
    
    function updateHeaderBackground() {
        const scrollPosition = window.scrollY;
        const opacity = Math.min(scrollPosition / 100, 0.95);
        header.style.backgroundColor = `rgba(14, 14, 14, ${opacity})`;
    }
    
    window.addEventListener('scroll', updateHeaderBackground);

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Create mailto link using decoded email
            const contactInfo = getContactInfo();
            const subject = encodeURIComponent(`Message from ${name} - Portfolio Contact`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            const mailtoLink = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            showNotification('Thank you for your message! Your email client will open shortly.', 'success');
            
            // Reset form
            this.reset();
        });
    }

    // Contact Form Handling
    function handleContactForm() {
        const contactForm = document.getElementById('contactFormMain');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(this);
                const contactData = {
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    company: formData.get('company'),
                    inquiryType: formData.get('inquiryType'),
                    message: formData.get('message'),
                    newsletter: formData.get('newsletter') === 'on',
                    privacy: formData.get('privacy') === 'on',
                    timestamp: new Date().toISOString(),
                    source: 'contact_form'
                };
                
                // Validate required fields
                if (!contactData.firstName || !contactData.email || !contactData.message || !contactData.privacy) {
                    showNotification('Please fill in all required fields and accept the privacy policy', 'error');
                    return;
                }
                
                if (!isValidEmail(contactData.email)) {
                    showNotification('Please enter a valid email address', 'error');
                    return;
                }
                
                // Store contact form data
                storeContactLocally(contactData);
                // storeContactToServer(contactData); // Uncomment for server storage
                // storeContactToFormspree(contactData); // Uncomment for Formspree
                
                // Update UI
                const submitBtn = this.querySelector('button[type="submit"]');
                submitBtn.textContent = 'Message Sent!';
                submitBtn.disabled = true;
                
                showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
                
                // Reset form after 3 seconds
                setTimeout(() => {
                    this.reset();
                    submitBtn.textContent = 'Send Message';
                    submitBtn.disabled = false;
                }, 3000);
            });
        }
    }
    
    // Newsletter Signup Handling
    function handleNewsletterSignup() {
        const newsletterForms = document.querySelectorAll('.newsletter-form, #newsletterForm');
        
        newsletterForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = new FormData(this);
                const email = formData.get('email');
                const source = this.dataset.source || 'newsletter';
                
                if (!email) {
                    showNotification('Please enter your email address', 'error');
                    return;
                }
                
                if (!isValidEmail(email)) {
                    showNotification('Please enter a valid email address', 'error');
                    return;
                }
                
                // Store locally and to Google Sheets
                storeEmailLocally(email);
                storeNewsletterToGoogleSheets(email, source);
                
                // Update UI
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Subscribed!';
                submitBtn.disabled = true;
                
                showNotification('Thank you for subscribing to my newsletter!', 'success');
                
                // Reset form after 3 seconds
                setTimeout(() => {
                    this.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            });
        });
    }
    
    // Store email locally for newsletter
    function storeEmailLocally(email) {
        let emails = JSON.parse(localStorage.getItem('newsletter_emails') || '[]');
        if (!emails.includes(email)) {
            emails.push(email);
            localStorage.setItem('newsletter_emails', JSON.stringify(emails));
            console.log('Email stored locally:', email);
        }
    }
    
    // Admin function to view stored emails
    function viewStoredEmails() {
        const emails = JSON.parse(localStorage.getItem('newsletter_emails') || '[]');
        console.log('Stored Newsletter Emails:', emails);
        return emails;
    }
    
    // Make admin function globally available
    window.viewStoredEmails = viewStoredEmails;

    // Store contact form data locally
    function storeContactLocally(contactData) {
        let contacts = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
        contacts.push(contactData);
        localStorage.setItem('contact_submissions', JSON.stringify(contacts));
        console.log('Contact form stored locally:', contactData);
        
        // Also store to Google Sheets
        storeContactToGoogleSheets(contactData);
        
        // Also store email for newsletter if opted in
        if (contactData.newsletter) {
            storeEmailLocally(contactData.email);
        }
    }
    
    // Store contact form data to Google Sheets
    function storeContactToGoogleSheets(contactData) {
        // Get encoded Google Apps Script URL
        const contact = getContactInfo();
        const GOOGLE_SCRIPT_URL = contact.scriptUrl;
        
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'contact_form',
                firstName: contactData.firstName || '',
                lastName: contactData.lastName || '',
                email: contactData.email || '',
                phone: contactData.phone || '',
                organization: contactData.organization || '',
                subject: contactData.subject || '',
                message: contactData.message || '',
                timestamp: new Date().toISOString(),
                source: window.location.href
            })
        })
        .then(response => {
            console.log('📡 Response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('✅ Contact form stored in Google Sheets:', data);
            if (data.success) {
                console.log('📧 Email notification should be sent!');
                showNotification('Message sent! You should receive a confirmation email.', 'success');
            } else {
                console.error('❌ Google Apps Script returned error:', data.error);
                showNotification('Message saved but email notification failed.', 'warning');
            }
        })
        .catch(error => {
            console.error('❌ Error storing to Google Sheets:', error);
            showNotification('Message saved locally. Email notification failed.', 'warning');
            // Form still works with local storage as fallback
        });
    }
    
    // Store collaboration requests to Google Sheets
    function storeCollaborationRequest(collaborationData) {
        const contact = getContactInfo();
        const GOOGLE_SCRIPT_URL = contact.scriptUrl;
        
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'collaboration_request',
                firstName: collaborationData.firstName || '',
                lastName: collaborationData.lastName || '',
                email: collaborationData.email || '',
                phone: collaborationData.phone || '',
                organization: collaborationData.organization || '',
                projectType: collaborationData.projectType || '',
                description: collaborationData.description || '',
                timestamp: new Date().toISOString(),
                source: window.location.href
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Collaboration request stored in Google Sheets:', data);
        })
        .catch(error => {
            console.error('Error storing collaboration request:', error);
        });
    }
    
    // Store newsletter signups to Google Sheets
    function storeNewsletterToGoogleSheets(email, source = 'newsletter') {
        const contact = getContactInfo();
        const GOOGLE_SCRIPT_URL = contact.scriptUrl;
        
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'newsletter_signup',
                email: email,
                firstName: '',
                lastName: '',
                source: source,
                timestamp: new Date().toISOString(),
                page: window.location.href
            })
        })
        .then(response => {
            console.log('📡 Newsletter response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('✅ Newsletter signup stored in Google Sheets:', data);
            if (data.success) {
                console.log('📧 Newsletter notification should be sent!');
            }
        })
        .catch(error => {
            console.error('❌ Error storing newsletter signup:', error);
        });
    }
    
    // Send contact form to server
    function storeContactToServer(contactData) {
        fetch('/api/contact-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Contact form stored on server:', data);
        })
        .catch(error => {
            console.error('Error storing contact form:', error);
            showNotification('Failed to send message. Please try again.', 'error');
        });
    }
    
    // Send contact form via Formspree
    function storeContactToFormspree(contactData) {
        fetch('https://formspree.io/f/YOUR_CONTACT_FORM_ID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...contactData,
                _subject: `New Contact Form: ${contactData.inquiryType}`
            })
        })
        .then(response => {
            if (response.ok) {
                console.log('Contact form sent via Formspree');
            } else {
                throw new Error('Formspree submission failed');
            }
        })
        .catch(error => {
            console.error('Error with Formspree:', error);
            showNotification('Failed to send message. Please try again.', 'error');
        });
    }
    
    // Admin function to view contact submissions
    function viewContactSubmissions() {
        const contacts = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
        console.log('Contact Submissions:', contacts);
        return contacts;
    }
    
    // Make admin function globally available
    window.viewContactSubmissions = viewContactSubmissions;

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <p>${message}</p>
            <button class="notification-close">&times;</button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background-color: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#00bcd4'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        `;
        
        // Add animation keyframes if not already added
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add to document
        document.body.appendChild(notification);
        
        // Close button functionality
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.focus-item, .skill-category, .frontier-section, .blog-post');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Typing effect for hero title (optional enhancement)
    function createTypingEffect(element, text, speed = 100) {
        element.textContent = '';
        let i = 0;
        
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, speed);
    }

    // Uncomment to enable typing effect for hero title
    // const heroTitle = document.querySelector('.hero-title');
    // if (heroTitle) {
    //     const originalText = heroTitle.textContent;
    //     createTypingEffect(heroTitle, originalText, 80);
    // }

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        
        if (heroBackground && scrolled < window.innerHeight) {
            const rate = scrolled * -0.5;
            heroBackground.style.transform = `translateY(${rate}px)`;
        }
    });

    // Dynamic copyright year
    const currentYear = new Date().getFullYear();
    const copyrightElement = document.querySelector('.footer-bottom p');
    if (copyrightElement) {
        copyrightElement.innerHTML = copyrightElement.innerHTML.replace('2025', currentYear);
    }

    // Keyboard navigation improvements
    document.addEventListener('keydown', (e) => {
        // Escape key closes mobile menu
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debounce to scroll handlers
    const debouncedScrollHandler = debounce(() => {
        updateActiveNav();
        updateHeaderBackground();
    }, 10);

    window.addEventListener('scroll', debouncedScrollHandler);

    // Initialize page
    updateActiveNav();
    updateHeaderBackground();
    handleNewsletterSignup(); // Initialize newsletter handling
    handleContactForm(); // Initialize contact form handling

    console.log('Harsh Dinodia Portfolio - Website initialized successfully! 🚀');
    console.log('Forms ready. Use viewStoredEmails() or viewContactSubmissions() in console to see data.');

    // 🧪 DIAGNOSTIC FUNCTIONS - Use these to test your setup
    
    // Test if Google Apps Script URL is working
    function testGoogleAppsScript() {
        console.log('🧪 Testing Google Apps Script connection...');
        const contact = getContactInfo();
        const GOOGLE_SCRIPT_URL = contact.scriptUrl;
        
        console.log('📍 Script URL:', GOOGLE_SCRIPT_URL);
        
        // Send test data
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'contact_form',
                firstName: 'Test',
                lastName: 'User', 
                email: 'test@example.com',
                subject: 'Test Email Notification',
                message: 'This is a test to check if email notifications are working!',
                timestamp: new Date().toISOString(),
                source: 'diagnostic_test'
            })
        })
        .then(response => {
            console.log('📡 Test response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('✅ Test result:', data);
            if (data.success) {
                console.log('🎉 SUCCESS! Check your email: harshdinodia06@gmail.com');
                showNotification('Test successful! Check your email for notification.', 'success');
            } else {
                console.log('❌ FAILED! Error:', data.error);
                showNotification('Test failed: ' + data.error, 'error');
            }
        })
        .catch(error => {
            console.error('❌ Test failed:', error);
            showNotification('Connection test failed: ' + error.message, 'error');
        });
    }
    
    // Check current configuration
    function checkConfig() {
        console.log('🔍 Checking configuration...');
        const contact = getContactInfo();
        console.log('📧 Email:', contact.email);
        console.log('📍 Script URL:', contact.scriptUrl);
        console.log('🔗 LinkedIn:', contact.linkedin);
        console.log('🔗 GitHub:', contact.github);
        
        return contact;
    }
    
    // Test email format
    function testEmailValidation(email) {
        const isValid = isValidEmail(email);
        console.log(`📧 Email "${email}" is ${isValid ? '✅ VALID' : '❌ INVALID'}`);
        return isValid;
    }
    
    // Make diagnostic functions globally available
    window.testGoogleAppsScript = testGoogleAppsScript;
    window.checkConfig = checkConfig;
    window.testEmailValidation = testEmailValidation;
});
