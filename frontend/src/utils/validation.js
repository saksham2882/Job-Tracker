export const validateProfile = (fullName, setError) => {
    if (!fullName.trim()) {
        setError("Username is required");
        return false;
    }
    if (!/^[a-zA-Z0-9\s]+$/.test(fullName.trim())) {
        setError("Username can only contain letters, numbers, and spaces");
        return false;
    }
    if (fullName.trim().length < 3) {
        setError("Username must be at least 3 characters");
        return false;
    }
    return true;
};

export const validatePassword = (password, setError, fieldName = "Password") => {
    if (password.length < 8) {
        setError(`${fieldName} must be at least 8 characters`);
        return false;
    }
    if (!/[A-Z]/.test(password)) {
        setError(`${fieldName} must contain at least one uppercase letter`);
        return false;
    }
    if (!/[a-z]/.test(password)) {
        setError(`${fieldName} must contain at least one lowercase letter`);
        return false;
    }
    if (!/[0-9]/.test(password)) {
        setError(`${fieldName} must contain at least one number`);
        return false;
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        setError(`${fieldName} must contain at least one special character`);
        return false;
    }
    return true;
};

export const getPasswordStrength = (password) => {
    if (password.length === 0) return "";
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return "Weak";
    if (score <= 4) return "Medium";
    return "Strong";
};

export const getUsernameValidity = (fullName) => {
    const name = fullName.trim();
    if (name.length === 0) return "";
    if (!/^[a-zA-Z0-9\s]+$/.test(name)) return "Invalid characters";
    if (name.length < 3) return "Too short";
    return "Valid";
};