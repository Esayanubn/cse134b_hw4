
const fieldConfigs = {
    'name': {
    pattern: /^[A-Za-z\s]*$/,
    errorMessage: 'invalid name content: only letters and spaces are allowed.'
    },
    'email': {
    pattern: /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*)@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[A-Za-z]{2,}$/, 
    errorMessage: 'invalid email content: illegal characters or unacceptable pattern of email address.'
    }
};

const form = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const commentTextarea = document.getElementById('comment');
const errorOutput = document.getElementById('output-error');
const infoOutput = document.getElementById('output-info');
const charCounter = document.getElementById('char-counter');
const formErrorsInput = document.getElementById('form-errors-input');

class FormError {
    constructor(fieldName, fieldId, errorType, errorMsg,errorContent) {
        this.fieldName = fieldName;
        this.fieldId = fieldId;
        this.errorType = errorType;
        this.errorMsg = errorMsg;
        this.errorContent=errorContent;
    }
}

let form_errors = [];

// Util funcions
function showErrorMessage(message) {
    errorOutput.textContent = message;
    errorOutput.classList.remove('fade-out');
    void errorOutput.offsetWidth;
    errorOutput.classList.add('fade-out');
    
    setTimeout(() => {
    errorOutput.textContent = '';
    errorOutput.classList.remove('fade-out');
    }, 3000);
}

function addError(fieldName, fieldId, errorType, message,errorContent) {
    const error = new FormError(fieldName, fieldId, errorType, message,errorContent);
    form_errors.push(error);
}

function setupInputMasking(field, config) {
    const inputPattern = config.pattern;
    
    function checkAndUpdateFlash() {
        const value = field.value;
        if (value && !inputPattern.test(value)) {
            field.classList.add('flash');
        } else {
            field.classList.remove('flash');
        }
    }
    
    function validateAndShowError() {
        const value = field.value;
        if (value && !inputPattern.test(value)) {
            showErrorMessage(config.errorMessage);
            addError(field.name, field.id, 'invalid_character', "invalid input",value);
        }
        checkAndUpdateFlash();
    }
    
    field.addEventListener('input', e => {
        validateAndShowError();
    });

    field.addEventListener('paste', e => {
        setTimeout(() => {
            validateAndShowError();
        }, 0);
    });
    
    setInterval(() => {
        checkAndUpdateFlash();
    }, 100);
    
    checkAndUpdateFlash();
}


function updateCharCounter() {
      const currentLength = commentTextarea.value.length;
      const maxLength = parseInt(commentTextarea.getAttribute('maxlength'));
      const remaining = maxLength - currentLength;
      
      charCounter.textContent = `${currentLength} / ${maxLength}`;
      
      charCounter.classList.remove('warning', 'error');
      
      if (remaining <= 50 && remaining > 0) {
        charCounter.classList.add('warning');
        infoOutput.textContent = ` ${remaining} characters remaining`;
      } else if (remaining === 0) {
        charCounter.classList.add('error');
        infoOutput.textContent = ' You have reached the maximum character limit';
      } else {
        infoOutput.textContent = '';
      }
      if (currentLength > maxLength) {
        charCounter.classList.add('error');
        commentTextarea.setCustomValidity('maxlength_exceeded');
        addError('comment', 'comment', 'maxlength_exceeded', `current length exceed (${currentLength})`, commentTextarea.value);
      } else {
        commentTextarea.setCustomValidity('');
      }
    }



setupInputMasking(nameInput, fieldConfigs.name);

setupInputMasking(emailInput, fieldConfigs.email);

commentTextarea.addEventListener('input', updateCharCounter);
commentTextarea.addEventListener('paste', () => setTimeout(updateCharCounter, 0));
updateCharCounter();


form.addEventListener('submit', (e) => {
    const fields = [nameInput, emailInput, commentTextarea];
    let isValid = true;
    
    fields.forEach(field => {
    if (!field.checkValidity()) {
        isValid = false;
        let errorMsg = field.validationMessage;
        if (!errorMsg) {
        if (field.validity.valueMissing) {
            errorMsg = 'You missed to fill out this field, DO that Plz QWQ.';
        } else if (field.validity.patternMismatch) {
            errorMsg = fieldConfigs[field.id]?.errorMessage || 'Incorrect TwT.';
        }
        }
        field.setCustomValidity(errorMsg);
        addError(
            field.name,
            field.id,
            'validation_failed',
            errorMsg,
            field.value

        );
    }
    });

    const commentLength = commentTextarea.value.length;
    const maxLength = parseInt(commentTextarea.getAttribute('maxlength'));
    if (commentLength > maxLength) {
    isValid = false;
    addError(
        'comment',
        'comment',
        'maxlength_exceeded',
        `exceeds the maximum character limit (${maxLength})`,
        field.value
    );
    }
    
    formErrorsInput.value = JSON.stringify(form_errors);
    console.log(formErrorsInput.value);
    if (!isValid) {
        e.preventDefault();
        showErrorMessage(`表单包含 ${form_errors.length} 个错误，请检查后重试`);
    }
});
