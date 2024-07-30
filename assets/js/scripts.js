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
        resetOutput(document.querySelector("#output-generator"), "XXXXXXXXXX");
    }
    if (input_translator !== null) {
        input_translator.value = "";
        document.querySelector("#error-translator").textContent = "";
        resetOutput(document.querySelector("#output-translator"), "XXX");
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
        error_container.textContent = "Error: Please select a BCD format.";
        return;
    }

    let output = document.querySelector("#output-generator");

    if (document.querySelector("#mode-unpacked").checked || document.querySelector("#mode-packed").checked) {
        let mode = document.querySelector("#mode-unpacked").checked ? "unpacked" : (document.querySelector("#mode-packed").checked ? "packed" : "unpacked");
        setOutput(output, bcdUnpackedPacked(mode, input).join(" "));
    }


}

function convertTranslator(e) {
    let input = document.querySelector("#input-translator").value;

    let error_container = document.querySelector("#error-translator");
    validateInput("translator", input, error_container);
}

function bcdUnpackedPacked(mode, decimal) {
    const packed = [
        "0000",
        "0001",
        "0010",
        "0011",
        "0100",
        "0101",
        "0110",
        "0111",
        "1000",
        "1001"
    ];

    let result = [];

    String(decimal).split('').map(v => result.push(packed[v]));

    if (mode === "unpacked") {
        result.map((v, i) => result[i] = "0000" + v);
    }

    return result;
}

function setOutput(output_container, value) {
    output_container.setAttribute("data-result", true);
    output_container.textContent = value;
}

function resetOutput(output_container, reset_value) {
    output_container.setAttribute("data-result", false);
    output_container.textContent = reset_value;
}