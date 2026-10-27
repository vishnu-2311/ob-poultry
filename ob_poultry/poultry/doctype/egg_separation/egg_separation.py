# Copyright (c) 2026, OB and contributors
# For license information, please see license.txt

from frappe.model.document import Document
from frappe.utils import cint


class EggSeparation(Document):
	def validate(self):
		self.calculate_total()

	def calculate_total(self):
		self.total = (
			cint(self.single_yolk)
			+ cint(self.double_yolk)
			+ cint(self.broken_eggs)
			+ cint(self.cracked_eggs)
			+ cint(self.yolkless)
		)
