/** @odoo-module **/

import { registry } from "@web/core/registry";
import { Component, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class BirthdayListSystray extends Component {
    static template = "sdm_birthday_notification.SystrayDropdown";

    setup() {
        this.orm = useService("orm");
        this.state = useState({
            birthdays: [],
            upcomingCount: 0, // العداد الجديد
        });
        this.loadBirthdays();
    }

    async loadBirthdays() {
        try {
            const today = new Date();
            const currentYear = today.getFullYear();

            const employees = await this.orm.call(
                "hr.employee",
                "search_read",
                [[], ['id', 'name', 'birthday', 'image_128']]
            );

            const allBirthdays = employees
                .filter(employee => employee.birthday)
                .map(employee => {
                    const birthdayDate = new Date(employee.birthday);
                    const thisYearBirthday = new Date(currentYear, birthdayDate.getMonth(), birthdayDate.getDate());

                    if (thisYearBirthday < today) {
                        thisYearBirthday.setFullYear(currentYear + 1);
                    }

                    const diffTime = Math.ceil((thisYearBirthday - today) / (1000 * 60 * 60 * 24));

                    return {
                        ...employee,
                        isNearest: false,
                        daysRemaining: diffTime,
                        image_url: employee.image_128 ? `data:image/png;base64,${employee.image_128}` : null
                    };
                })
                .sort((a, b) => a.daysRemaining - b.daysRemaining);

            if (allBirthdays.length > 0) {
                allBirthdays[0].isNearest = true;
            }

            const upcoming = allBirthdays.filter(e => e.daysRemaining <= 7).length;

            this.state.birthdays = allBirthdays;
            this.state.upcomingCount = upcoming;

            console.log("✅ Loaded All Birthdays | Upcoming:", upcoming);
        } catch (error) {
            console.error("❌ Error loading birthdays:", error);
        }
    }
}

registry.category("systray").add("sdm_birthday_notification.BirthdayListSystray", {
    Component: BirthdayListSystray,
    sequence: 15,
});
