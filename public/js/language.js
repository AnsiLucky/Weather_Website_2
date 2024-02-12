document.getElementById('languageDropdown').addEventListener('change', function() {
    const selectedLanguage = this.value;
    const url = `/auth/setLanguage/${selectedLanguage}`;
    window.history.pushState(null, '', url);
    window.location.href = url;
});