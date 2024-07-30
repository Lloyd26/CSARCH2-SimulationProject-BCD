document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".btn-reset").forEach(r => r.addEventListener("click", resetForm));
    document.querySelector("#bcd-generator .btn-convert").addEventListener("click", convertGenerator);
    document.querySelector("#bcd-translator .btn-convert").addEventListener("click", convertTranslator);

    document.querySelector("#input-generator").addEventListener("input", function() {
        document.querySelector("#error-generator").textContent = "";
    });
    document.querySelector("#input-translator").addEventListener("input", function() {
        document.querySelector("#error-translator").textContent = "";
    });

    document.querySelectorAll("input[type=radio][name=mode-generator]").forEach(bcd_mode_radio => bcd_mode_radio.addEventListener("change", function() {
        document.querySelector("#error-generator").textContent = "";
    }));
})

function resetForm(e) {
    let tab_content = e.currentTarget.closest(".tab-pane");
    let input_generator = tab_content.querySelector("#input-generator");
    let input_translator = tab_content.querySelector("#input-translator");

    if (input_generator !== null) {
        input_generator.value = "";
        document.querySelector("#error-generator").textContent = "";
    }
    if (input_translator !== null) {
        input_translator.value = "";
        document.querySelector("#error-translator").textContent = "";
    }

    if (tab_content.querySelector("#bcd-generator") !== undefined) {
        tab_content.querySelectorAll("input[type=radio][name=mode-generator]").forEach(bcd_mode_radio => bcd_mode_radio.checked = false);
    }
}

function validateInput(type, value, error_container) {
    switch (type) {
        case "generator":
            if (!/^\d+$/.test(value)) {
                error_container.textContent = "Error: Please enter a decimal input.";
                return false;
            }
            break;
        case "translator":
            if (value.length !== 10) {
                error_container.textContent = "Error: Binary-coded decimal (BCD) input should contain 10 bits.";
                return false;
            }
            if (!/^[01]{10}$/.test(value)) {
                error_container.textContent = "Error: Please enter a binary-coded decimal (BCD) input.";
                return false;
            }
            break;
    }

    if (error_container.textContent !== "") error_container.textContent = "";

    return true;
}

function convertGenerator(e) {
    let input = document.querySelector("#input-generator").value;

    let error_container = document.querySelector("#error-generator");
    validateInput("generator", input, error_container);

    if (document.querySelectorAll("input[type=radio][name=mode-generator]:checked").length === 0) {
        error_container.textContent = "Error: Please select a BCD format."
    }
}

function convertTranslator(e) {
    let input = document.querySelector("#input-translator").value;

    let error_container = document.querySelector("#error-translator");
    validateInput("translator", input, error_container);
}