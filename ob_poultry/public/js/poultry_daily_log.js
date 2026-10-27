// Copyright (c) 2026, OB and contributors
// For license information, please see license.txt

function handle_daily_log_form(frm) {
    set_egg_separation_columns(frm);
    calculate_egg_separation_grand_total(frm);
}

frappe.ui.form.on("Poultry Daily Log", {
    onload: function (frm) {
        handle_daily_log_form(frm);
    },
    refresh: function (frm) {
        handle_daily_log_form(frm);
    },
    validate: function (frm) {
        calculate_all_egg_separation_totals(frm);
    },
    egg_separation_remove: function (frm) {
        calculate_egg_separation_grand_total(frm);
    }
});

frappe.ui.form.on("Daily Log", {
    onload: function (frm) {
        handle_daily_log_form(frm);
    },
    refresh: function (frm) {
        handle_daily_log_form(frm);
    },
    validate: function (frm) {
        calculate_all_egg_separation_totals(frm);
    },
    egg_separation_remove: function (frm) {
        calculate_egg_separation_grand_total(frm);
    }
});

frappe.ui.form.on("Egg Separation", {
    single_yolk: function (frm, cdt, cdn) {
        calculate_egg_separation_total(frm, cdt, cdn);
    },
    double_yolk: function (frm, cdt, cdn) {
        calculate_egg_separation_total(frm, cdt, cdn);
    },
    broken_eggs: function (frm, cdt, cdn) {
        calculate_egg_separation_total(frm, cdt, cdn);
    },
    cracked_eggs: function (frm, cdt, cdn) {
        calculate_egg_separation_total(frm, cdt, cdn);
    },
    yolkless: function (frm, cdt, cdn) {
        calculate_egg_separation_total(frm, cdt, cdn);
    },
    egg_separation_add: function (frm, cdt, cdn) {
        calculate_egg_separation_total(frm, cdt, cdn);
    },
    egg_separation_remove: function (frm) {
        calculate_egg_separation_grand_total(frm);
    }
});

function calculate_egg_separation_total(frm, cdt, cdn) {
    const row = locals[cdt] && locals[cdt][cdn];
    if (!row) return;

    const row_total = (cint(row.single_yolk) || 0) +
                      (cint(row.double_yolk) || 0) +
                      (cint(row.broken_eggs) || 0) +
                      (cint(row.cracked_eggs) || 0) +
                      (cint(row.yolkless) || 0);

    frappe.model.set_value(cdt, cdn, "total", row_total);

    if (frm) {
        calculate_egg_separation_grand_total(frm);
    }
}

function calculate_egg_separation_grand_total(frm) {
    if (!frm || !frm.doc) return;

    let grand_total = 0;
    (frm.doc.egg_separation || []).forEach(function (row) {
        grand_total += (cint(row.total) || 0);
    });

    if (frm.fields_dict && frm.fields_dict.total_separated_eggs) {
        frm.set_value("total_separated_eggs", grand_total);
    }
}

function calculate_all_egg_separation_totals(frm) {
    if (!frm || !frm.doc) return;

    let grand_total = 0;
    (frm.doc.egg_separation || []).forEach(function (row) {
        const row_total = (cint(row.single_yolk) || 0) +
                          (cint(row.double_yolk) || 0) +
                          (cint(row.broken_eggs) || 0) +
                          (cint(row.cracked_eggs) || 0) +
                          (cint(row.yolkless) || 0);
        row.total = row_total;
        grand_total += row_total;
    });

    if (frm.fields_dict && frm.fields_dict.total_separated_eggs) {
        frm.set_value("total_separated_eggs", grand_total);
    }
    frm.refresh_field("egg_separation");
}

function set_egg_separation_columns(frm) {
    if (!frm.fields_dict || !frm.fields_dict.egg_separation) {
        return;
    }

    frappe.call({
        method: "ob_poultry.poultry.doctype.poultry_daily_log.get_egg_separation_settings",
        callback: function (r) {
            if (!r.message) {
                return;
            }

            const settings = r.message;
            const grid = frm.fields_dict.egg_separation.grid;

            if (!grid) {
                return;
            }

            const column_settings = {
                single_yolk: settings.single_yolk,
                double_yolk: settings.double_yolk,
                broken_eggs: settings.broken_eggs,
                cracked_eggs: settings.cracked_eggs,
                yolkless: settings.yolkless,
                total: settings.total
            };

            Object.keys(column_settings).forEach(function (fieldname) {
                const show = Boolean(column_settings[fieldname]);

                if (typeof grid.set_column_disp === "function") {
                    grid.set_column_disp(fieldname, show);
                }

                const field = grid.get_field(fieldname);
                if (field) {
                    field.hidden = !show;
                }
            });

            if (frm.fields_dict && frm.fields_dict.total_separated_eggs) {
                frm.toggle_display("total_separated_eggs", Boolean(settings.total));
            }

            grid.refresh();
        }
    });
}
