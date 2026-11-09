/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { FormCompiler } from "@web/views/form/form_compiler";
import { append, createElement, setAttributes } from "@web/core/utils/xml";

patch(FormCompiler.prototype, {
    compile(node, params) {
        // Get the result of the original compile (which already includes the mail app's patch)
        const res = super.compile(node, params);

        // Find the aside chatter container (injected by mail module or defined in arch).
        // In views with an attachment preview (such as Invoicing / account.move),
        // the mail form compiler clones the chatter container into .o_form_sheet_bg
        // with the class 'o-isInFormSheetBg' for COMBO mode. We must specifically target
        // the aside chatter container outside the sheet background (:not(.o-isInFormSheetBg)).
        const chatterContainerHookXml = res.querySelector(
            ".o-mail-ChatterContainer:not(.o-isInFormSheetBg), .o-mail-Form-chatter:not(.o-isInFormSheetBg), .oe_chatter:not(.o-isInFormSheetBg)"
        );

        if (!chatterContainerHookXml || (chatterContainerHookXml.closest && chatterContainerHookXml.closest(".o_form_sheet, .o_form_sheet_bg"))) {
            return res; // No aside chatter in this view, do nothing
        }

        // Add our custom base class to the chatter container hook
        chatterContainerHookXml.classList.add("hs-elevated-chatter");

        // Append our dynamic class to the existing t-attf-class logic from mail module
        const existingTAttfClass = chatterContainerHookXml.getAttribute("t-attf-class") || "";
        setAttributes(chatterContainerHookXml, {
            "t-attf-class": `${existingTAttfClass} {{ __comp__.elevateChatterState.isOpen ? 'hs-chatter-open' : '' }}`.trim()
        });

        // Add dynamic class directly to sheet elements to ensure they expand when chatter is closed
        const sheets = res.querySelectorAll(".o_form_sheet_bg, .o_form_sheet");
        sheets.forEach(sheet => {
            const existingSheetTAttfClass = sheet.getAttribute("t-attf-class") || "";
            setAttributes(sheet, {
                "t-attf-class": `${existingSheetTAttfClass} {{ __comp__.elevateChatterState.isOpen ? '' : 'hs-chatter-closed-sheet' }}`.trim()
            });
        });

        // Create the toggle button container
        const toggleBtnXml = createElement("div");
        toggleBtnXml.classList.add("hs-chatter-toggle");

        // Bind click event to our FormRenderer toggle method
        setAttributes(toggleBtnXml, {
            "t-on-click": "(ev) => __comp__.toggleElevatedChatter(ev)"
        });

        // Create the icon for the toggle button
        const arrowIcon = createElement("i");
        setAttributes(arrowIcon, {
            "t-attf-class": `fa {{ __comp__.elevateChatterState.isOpen ? 'fa-chevron-right' : 'fa-chevron-left' }}`
        });
        append(toggleBtnXml, arrowIcon);

        // Find the actual chatter component inside the hook
        const chatterContainerXml = chatterContainerHookXml.querySelector(
            "t[t-component='__comp__.mailComponents.Chatter']"
        );

        if (chatterContainerXml) {
            // Create the clip container
            const clipXml = createElement("div");
            clipXml.classList.add("hs-chatter-clip");

            // Create the content wrapper
            const wrapperXml = createElement("div");
            wrapperXml.classList.add("hs-chatter-content-wrapper");

            // Move the chatter component into the wrapper
            chatterContainerXml.parentNode.insertBefore(clipXml, chatterContainerXml);
            append(wrapperXml, chatterContainerXml);
            append(clipXml, wrapperXml);
        } else {
            // For other chatter components or portal chatter, wrap whatever is inside
            const children = Array.from(chatterContainerHookXml.childNodes);
            if (children.length > 0) {
                const clipXml = createElement("div");
                clipXml.classList.add("hs-chatter-clip");

                const wrapperXml = createElement("div");
                wrapperXml.classList.add("hs-chatter-content-wrapper");

                children.forEach(child => {
                    append(wrapperXml, child);
                });

                append(clipXml, wrapperXml);
                append(chatterContainerHookXml, clipXml);
            }
        }

        // Append the toggle button inside the chatter container hook
        append(chatterContainerHookXml, toggleBtnXml);

        return res;
    }
});
