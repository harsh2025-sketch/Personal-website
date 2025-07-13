/**
 * Contact Configuration - Obfuscated for GitHub
 * This file contains encoded contact information that gets decoded at runtime
 */

// Base64 encoded contact information (safe for public repos)
const CONTACT_CONFIG = {
    // Email address (encoded)
    email: 'aGFyc2hkaW5vZGlhMDZAZ21haWwuY29t',
    
    // LinkedIn profile URL (encoded)
    linkedin: 'aHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL2hhcnNoLWRpbm9kaWEtYjE1MTQ4MjQw',
    
    // GitHub profile URL (encoded)
    github: 'aHR0cHM6Ly9naXRodWIuY29tL2hhcnNoMjAyNS1za2V0Y2g=',
    
    // GitHub handle (encoded)
    githubHandle: 'QGhhcnNoMjAyNS1za2V0Y2g=',
    
    // LinkedIn display name (encoded)
    linkedinHandle: 'SGFyc2ggRGlub2RpYQ==',
    
    // Google Apps Script URL (Latest working deployment)
    scriptUrl: 'aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2tmeWNibzFKNjFNc29abjZaRFRfcW0yd3AyWGJYcWRhYjY2bEtKR184QlJwSUp1V3hZTTRSUDNhVVFCWFVzZGc5V0trUWlBcWcvZXhlYw==' // Updated deployment URL
};

/**
 * Decode base64 strings
 */
function decodeContact(encoded) {
    try {
        return atob(encoded);
    } catch (e) {
        console.error('Failed to decode contact info');
        return '#';
    }
}

/**
 * Get decoded contact information
 */
function getContactInfo() {
    return {
        email: decodeContact(CONTACT_CONFIG.email),
        linkedin: decodeContact(CONTACT_CONFIG.linkedin),
        github: decodeContact(CONTACT_CONFIG.github),
        githubHandle: decodeContact(CONTACT_CONFIG.githubHandle),
        linkedinHandle: decodeContact(CONTACT_CONFIG.linkedinHandle),
        scriptUrl: decodeContact(CONTACT_CONFIG.scriptUrl)
    };
}

/**
 * Initialize contact links when DOM is loaded
 */
function initializeContactLinks() {
    const contact = getContactInfo();
    
    console.log('🔗 Initializing contact links:', contact);
    
    // Update all email links
    document.querySelectorAll('a[href*="ENCODED_EMAIL"], a[href*="mailto:ENCODED_EMAIL"]').forEach(link => {
        link.href = `mailto:${contact.email}`;
        console.log('✅ Updated email link:', link.href);
    });
    
    // Update all LinkedIn links
    document.querySelectorAll('a[href*="ENCODED_LINKEDIN"]').forEach(link => {
        link.href = contact.linkedin;
        console.log('✅ Updated LinkedIn link:', link.href);
        
        // Update display text if needed
        const linkText = link.textContent;
        if (linkText.includes('ENCODED_LINKEDIN_HANDLE')) {
            link.textContent = linkText.replace('ENCODED_LINKEDIN_HANDLE', contact.linkedinHandle);
        }
        if (linkText === 'Professional Profile') {
            link.textContent = contact.linkedinHandle;
        }
    });
    
    // Update all GitHub links and handles
    document.querySelectorAll('a[href*="ENCODED_GITHUB"]').forEach(link => {
        link.href = contact.github;
        console.log('✅ Updated GitHub link:', link.href);
    });
    
    // Update GitHub handles in social-handle elements
    document.querySelectorAll('.social-handle').forEach(element => {
        if (element.textContent && element.textContent.includes('ENCODED_GITHUB_HANDLE')) {
            element.textContent = element.textContent.replace('ENCODED_GITHUB_HANDLE', contact.githubHandle);
            console.log('✅ Updated GitHub handle:', element.textContent);
        }
        if (element.textContent && element.textContent.includes('ENCODED_LINKEDIN_HANDLE')) {
            element.textContent = element.textContent.replace('ENCODED_LINKEDIN_HANDLE', contact.linkedinHandle);
            console.log('✅ Updated LinkedIn handle:', element.textContent);
        }
    });
    
    // Update contact display elements
    document.querySelectorAll('.contact-email').forEach(element => {
        element.textContent = contact.email;
        if (element.tagName === 'A') {
            element.href = `mailto:${contact.email}`;
        }
        console.log('✅ Updated contact email display:', element.textContent);
    });
    
    console.log('✅ Contact information initialized successfully');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded, initializing contact links...');
    initializeContactLinks();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    console.log('⏳ DOM still loading, waiting...');
} else {
    console.log('🚀 DOM already loaded, initializing contact links...');
    initializeContactLinks();
}

// Fallback: Initialize after a short delay to ensure everything is ready
setTimeout(function() {
    console.log('🔄 Fallback initialization...');
    initializeContactLinks();
}, 500);
