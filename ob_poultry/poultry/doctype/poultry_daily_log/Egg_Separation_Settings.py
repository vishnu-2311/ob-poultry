import frappe
from frappe.utils import cint


@frappe.whitelist()
def get_egg_separation_settings():
    settings = None
    try:
        if frappe.get_meta("Egg Separation Settings").issingle:
            settings = frappe.get_single("Egg Separation Settings")
        else:
            name = frappe.db.get_single_value("Egg Separation Settings", "name") or frappe.db.get_value("Egg Separation Settings", {}, "name")
            if name:
                settings = frappe.get_doc("Egg Separation Settings", name)
    except Exception:
        pass

    if not settings:
        return {
            "single_yolk": 1,
            "double_yolk": 1,
            "broken_eggs": 1,
            "cracked_eggs": 0,
            "yolkless": 0,
            "total": 1,
        }

    return {
        "single_yolk": cint(getattr(settings, "enable_single_yolk", 0)),
        "double_yolk": cint(getattr(settings, "enable_double_yolk", 0)),
        "broken_eggs": cint(getattr(settings, "enable_broken_eggs", 0)),
        "cracked_eggs": cint(getattr(settings, "enable_cracked_eggs", 0)),
        "yolkless": cint(getattr(settings, "enable_yolkless", 0)),
        "total": cint(getattr(settings, "enable_total", 1)),
    }
