document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".btn-reset").forEach(r => r.addEventListener("click", resetForm));
})

function resetForm(e) {
    let tab_content = e.currentTarget.closest(".tab-pane");
    let input_generator = tab_content.querySelector("#input-generator");
    let input_translator = tab_content.querySelector("#input-translator");

    if (input_generator !== null) input_generator.value = "";
    if (input_translator !== null) input_translator.value = "";

    if (tab_content.querySelector("#bcd-generator") !== undefined) {
        tab_content.querySelectorAll("input[type=radio][name=mode-generator]").forEach(bcd_mode_radio => bcd_mode_radio.checked = false);
    }
}