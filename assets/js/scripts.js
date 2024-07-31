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

    document.querySelectorAll(".btn-save-text").forEach(btn_save_text => btn_save_text.addEventListener("click", saveAsText));
});

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
            if (!/^[01]{10}(?: [01]{10})*$/.test(value)) {
                error_container.textContent = "Error: Please enter a binary-coded decimal (BCD) input.";
                return false;
            }
            break;
    }

    if (error_container.textContent !== "") error_container.textContent = "";

    return true;
}

function convertGenerator() {
    let input = document.querySelector("#input-generator").value;

    let error_container = document.querySelector("#error-generator");
    if (!validateInput("generator", input, error_container)) return;

    if (document.querySelectorAll("input[type=radio][name=mode-generator]:checked").length === 0) {
        error_container.textContent = "Error: Please select a BCD format.";
        return;
    }

    let output = document.querySelector("#output-generator");
    let output_format = document.querySelector("input[type=radio][name=mode-generator]:checked").value;
    let output_format_name = document.querySelector("input[type=radio][name=mode-generator]:checked").getAttribute("data-format-name");

    if (document.querySelector("#mode-unpacked").checked || document.querySelector("#mode-packed").checked) {
        let mode = document.querySelector("#mode-unpacked").checked ? "unpacked" : (document.querySelector("#mode-packed").checked ? "packed" : "unpacked");
        setOutput(output, bcdUnpackedPacked(mode, input).join(" "), output_format, output_format_name, input);
    }


    if (document.querySelector("#mode-densely-packed").checked) {
        //if (input.length < 3) input = String(input).padStart(3, '0');
        let bcd_outputs = [];

        if (input.length % 3 > 0) {
            bcd_outputs.push(input.split("").slice(0, input.length % 3).join(""));
        }

        for (let i = 0; i < Math.floor(input.length / 3); i++) {
            let start_index = (input.length % 3) + (i * 3);
            bcd_outputs.push(input.split("").slice(start_index, start_index + 3).join(""));
        }

        bcd_outputs.map((v, i) => {
            let packed = bcdUnpackedPacked("packed", String(v).padStart(3, '0')).join("");
            bcd_outputs[i] = bcdDenselyPacked(packed).join("");
        });

        setOutput(output, bcd_outputs.join(" "), output_format, output_format_name, input);
    }
}

function convertTranslator() {
    let input = document.querySelector("#input-translator").value;

    let error_container = document.querySelector("#error-translator");
    if (!validateInput("translator", input, error_container)) return;

    let output = document.querySelector("#output-translator");

    let decimal_outputs = [];

    input.split(" ").forEach(i => decimal_outputs.push(i));

    decimal_outputs.map((v, i) => decimal_outputs[i] = packedToDecimal(bcdDecimal(v)));

    setOutput(output, decimal_outputs.join(" "), "Decimal", "Decimal", input);
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

function bcdDenselyPacked(decimal) {
    const a = String(decimal).charAt(0);
    const b = String(decimal).charAt(1);
    const c = String(decimal).charAt(2);
    const d = String(decimal).charAt(3);
    const e = String(decimal).charAt(4);
    const f = String(decimal).charAt(5);
    const g = String(decimal).charAt(6);
    const h = String(decimal).charAt(7);
    const i = String(decimal).charAt(8);
    const j = String(decimal).charAt(9);
    const k = String(decimal).charAt(10);
    const m = String(decimal).charAt(11);

    let r = d;
    let u = h;
    let y = m;

    let p = "",
        q = "",
        s = "",
        t = "",
        w = "",
        x = "";

    let v = "1"

    if (a === "0") {
        p = b;
        q = c;

        if (e === "0") {
            s = f;
            t = g;

            if (i === "0") {
                w = j;
                x = k;
                v = "0";
            }
            if (i === "1") {
                w = "0";
                x = "0";
            }
        }

        if (e === "1") {
            w = i;
            x = "1";

            if (i === "0") {
                s = j;
                t = k;
            }
            if (i === "1") {
                s = "1";
                t = "0";
            }
        }
    }

    if (a === "1") {
        w = "1";

        if (e === "0") {
            x = i;

            if (i === "0") {
                p = j;
                q = k;
                s = f;
                t = g;
            }
            if (i === "1") {
                p = f;
                q = g;
                s = "0";
                t = "1";
            }
        }

        if (e === "1") {
            s = i;
            t = i;
            x = "1";

            if (i === "0") {
                p = j;
                q = k;
            }
            if (i === "1") {
                p = "0";
                q = "0";
            }
        }
    }

    let result = [p, q, r, s, t, u, v, w, x, y];
    return result;
}

function bcdDecimal(bcd) {
    const p = String(bcd).charAt(0);
    const q = String(bcd).charAt(1);
    const r = String(bcd).charAt(2);
    const s = String(bcd).charAt(3);
    const t = String(bcd).charAt(4);
    const u = String(bcd).charAt(5);
    const v = String(bcd).charAt(6);
    const w = String(bcd).charAt(7);
    const x = String(bcd).charAt(8);
    const y = String(bcd).charAt(9);

    let d = r;
    let h = u;
    let m = y;

    let a = "0",
        b = "0",
        c = "0",
        e = "0",
        f = "0",
        g = "0",
        i = "0",
        j = "0",
        k = "0";

    if (v === "0") {
        a = "0";
        e = "0";
        i = "0";

        b = p;
        c = q;
        f = s;
        g = t;
        j = w;
        k = x;
    }
    if (v === "1") {
        if (w === "0") {
            a = "0";

            b = p;
            c = q;

            if (x === "0") {
                e = "0";
                i = "1";

                f = s;
                g = t;
            }
            if (x === "1") {
                e = "1";
                i = "0";

                j = s;
                k = t;
            }
        }
        if (w === "1") {
            if (x === "0") {
                a = "1";
                e = "0";
                i = "0";

                j = p;
                k = q;
                f = s;
                g = t;
            }
            if (x === "1") {
                if (s === "0") {
                    a = "1";

                    if (t === "0") {
                        e = "1";
                        i = "0";

                        j = p;
                        k = q;
                    }
                    if (t === "1") {
                        e = "0";
                        i = "1";

                        f = p;
                        g = q;
                    }
                }
                if (s === "1") {
                    a = t;
                    e = "1";
                    i = "1";

                    if (t === "0") {
                        b = p;
                        c = q;
                    }
                }
            }
        }
    }

    let result = [a, b, c, d, e, f, g, h, i, j, k, m];
    return result;
}

function packedToDecimal(bcd_decimal) {
    let digit0 = [bcd_decimal[0], bcd_decimal[1], bcd_decimal[2], bcd_decimal[3]];
    let digit1 = [bcd_decimal[4], bcd_decimal[5], bcd_decimal[6], bcd_decimal[7]];
    let digit2 = [bcd_decimal[8], bcd_decimal[9], bcd_decimal[10], bcd_decimal[11]];

    let result = String(parseInt(digit0.join(""), 2)) + String(parseInt(digit1.join(""), 2)) + String(parseInt(digit2.join(""), 2));
    return result;
}

function setOutput(output_container, value, output_format, output_format_name, input) {
    output_container.setAttribute("data-result", true);
    output_container.setAttribute("data-result-format", output_format);
    output_container.setAttribute("data-result-format-name", output_format_name);
    output_container.setAttribute("data-result-input", input);
    output_container.textContent = value;
}

function resetOutput(output_container, reset_value) {
    output_container.setAttribute("data-result", false);
    output_container.setAttribute("data-result-format", "");
    output_container.setAttribute("data-result-format-name", "");
    output_container.setAttribute("data-result-input", "");
    output_container.textContent = reset_value;
}

function saveAsText(e) {
    let output = e.currentTarget.closest(".output-container").querySelector(".output-result");

    if (output.getAttribute("data-result") === "false") {
        snackbar({
            type: "error",
            text: "Error: Output is empty."
        });
        return;
    }

    let output_mode = output.getAttribute("id").split("-")[1];

    let output_format = output.getAttribute("data-result-format");
    let output_format_name = output.getAttribute("data-result-format-name");
    let input = output.getAttribute("data-result-input");

    let file_name = "BCD_" + output_format + "_" + input + ".txt";

    let file_content_header = "Binary-Coded Decimal Generator and Translator";
    let file_content_mode = "Mode: " + output_mode.charAt(0).toUpperCase() + output_mode.slice(1);
    let file_content_input = "Input: " + input;
    let file_content_format = "Format: " + output_format_name;
    let file_content_output = "Output: " + output.textContent;

    let file_content = file_content_header + "\n\n" + file_content_mode + "\n\n" + file_content_input + "\n" + file_content_format + "\n\n" + file_content_output;

    let file_txt = new Blob([file_content], {type: "text/plain"});

    window.URL = window.URL || window.webkitURL;
    let url = window.URL.createObjectURL(file_txt);

    let a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", file_name);

    document.body.appendChild(a);

    a.click();

    setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);

    snackbar({
        type: "primary",
        text: "Result saved into a text file with filename \"" + file_name + "\"."
    });
}