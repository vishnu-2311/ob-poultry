// Copyright (c) 2026, OB and contributors
// For license information, please see license.txt

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
