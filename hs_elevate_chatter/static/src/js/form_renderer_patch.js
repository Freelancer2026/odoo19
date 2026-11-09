/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { FormRenderer } from "@web/views/form/form_renderer";
import { useState } from "@odoo/owl";

patch(FormRenderer.prototype, {
    setup() {
        super.setup();
        // State to track if the elevated chatter drawer is open
        this.elevateChatterState = useState({
            isOpen: false,
        });
        // Bind the method to ensure 'this' is correct when called from the template
        this.toggleElevatedChatter = this.toggleElevatedChatter.bind(this);
    },

    toggleElevatedChatter(ev) {
        // Prevent default actions if needed
        if (ev) {
            ev.preventDefault();
            ev.stopPropagation();
        }
        this.elevateChatterState.isOpen = !this.elevateChatterState.isOpen;
    }
});
