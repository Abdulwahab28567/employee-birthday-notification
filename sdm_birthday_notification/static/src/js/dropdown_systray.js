// /** @odoo-module **/
// import { registry } from "@web/core/registry";
// import { useService } from "@web/core/utils/hooks";
// const { Component, useState } = owl;

// class DropdownSystray extends Component {
//     static props = {};

//     setup() {
//         this.orm = useService("orm");
//         this.state = useState({ isDropdownOpen: false, notifications: [] });
//         document.addEventListener("click", this.handleOutsideClick.bind(this));
//     }

//     async loadNotifications() {
//         try {
//             console.log("🔍 Loading notifications...");
//             const notifications = await this.orm.call("x_sdm.birthday.notification", "search_read", [
//                 [['is_read', '=', false]],  // رجعنا الشرط الأساسي
//                 ['id', 'message', 'is_read']
//             ]);
//             console.log("✅ Loaded Notifications:", notifications);
//             this.state.notifications = notifications;
//         } catch (error) {
//             console.error("❌ Error loading notifications:", error);
//         }
//     }

//     toggleDropdown(ev) {
//         ev.stopPropagation();
//         this.state.isDropdownOpen = !this.state.isDropdownOpen;
//         console.log("Dropdown State:", this.state.isDropdownOpen);
//         if (this.state.isDropdownOpen) {
//             this.loadNotifications();
//         }
//     }

//     handleOutsideClick(event) {
//         const dropdownContainer = document.querySelector(".dropdown-container");
//         if (dropdownContainer && !dropdownContainer.contains(event.target)) {
//             this.state.isDropdownOpen = false;
//         }
//     }

//     async markAsRead(notificationId) {
//         try {
//             await this.orm.write('x_sdm.birthday.notification', [notificationId], {'is_read': true});
//             this.loadNotifications();
//         } catch (error) {
//             console.error("❌ Error marking notification as read:", error);
//         }
//     }

//     willUnmount() {
//         document.removeEventListener("click", this.handleOutsideClick.bind(this));
//     }
// }

// DropdownSystray.template = "sdm_birthday_notification.SystrayDropdown";
// registry.category("systray").add("DropdownSystray", {
//     Component: DropdownSystray,
//     sequence: 1,
// });


// /** @odoo-module **/

// import { registry } from "@web/core/registry";
// import { Component, useState } from "@odoo/owl";
// import { useService } from "@web/core/utils/hooks";

// export class BirthdayListSystray extends Component {
//     static template = "sdm_birthday_notification.SystrayDropdown";

//     setup() {
//         this.orm = useService("orm");
//         this.state = useState({ birthdays: [] });
//         this.loadBirthdays();
//     }

//     async loadBirthdays() {
//         try {
//             const today = new Date();
//             const nextWeek = new Date();
//             nextWeek.setDate(today.getDate() + 7);

//             // جلب جميع الموظفين وتواريخ ميلادهم
//             const employees = await this.orm.call(
//                 "hr.employee",
//                 "search_read",
//                 [[], ['id', 'name', 'birthday']]
//             );

//             // تصفية الموظفين الذين لديهم عيد ميلاد خلال الأسبوع القادم
//             const upcomingBirthdays = employees.filter(employee => {
//                 if (!employee.birthday) return false;
//                 const birthdayDate = new Date(employee.birthday);
//                 return birthdayDate >= today && birthdayDate <= nextWeek;
//             });

//             // العثور على أقرب تاريخ ميلاد
//             if (upcomingBirthdays.length > 0) {
//                 const nearestBirthday = upcomingBirthdays.reduce((nearest, employee) => {
//                     const birthdayDate = new Date(employee.birthday);
//                     return birthdayDate < new Date(nearest.birthday) ? employee : nearest;
//                 }, upcomingBirthdays[0]);

//                 // تحديد الأقرب باللون الأحمر
//                 upcomingBirthdays.forEach(employee => {
//                     employee.isNearest = (employee.id === nearestBirthday.id);
//                 });
//             }

//             console.log("✅ Loaded Upcoming Birthdays:", upcomingBirthdays);
//             this.state.birthdays = upcomingBirthdays;
//         } catch (error) {
//             console.error("❌ Error loading birthdays:", error);
//         }
//     }
// }

// registry.category("systray").add("sdm_birthday_notification.BirthdayListSystray", {
//     Component: BirthdayListSystray,
//     sequence: 15,
// });

// /** @odoo-module **/

// import { registry } from "@web/core/registry";
// import { Component, useState } from "@odoo/owl";
// import { useService } from "@web/core/utils/hooks";

// export class BirthdayListSystray extends Component {
//     static template = "sdm_birthday_notification.SystrayDropdown";

//     setup() {
//         this.orm = useService("orm");
//         this.state = useState({ birthdays: [] });
//         this.loadBirthdays();
//     }

//     async loadBirthdays() {
//         try {
//             const today = new Date();
//             const nextWeek = new Date();
//             nextWeek.setDate(today.getDate() + 7);

//             // جلب جميع الموظفين وتواريخ ميلادهم وصورهم
//             const employees = await this.orm.call(
//                 "hr.employee",
//                 "search_read",
//                 [[], ['id', 'name', 'birthday', 'image_128']]
//             );

//             // تصفية الموظفين الذين لديهم عيد ميلاد خلال الأسبوع القادم
//             const upcomingBirthdays = employees
//                 .filter(employee => {
//                     if (!employee.birthday) return false;
//                     const birthdayDate = new Date(employee.birthday);
//                     return birthdayDate >= today && birthdayDate <= nextWeek;
//                 })
//                 .sort((a, b) => new Date(a.birthday) - new Date(b.birthday)); // ترتيب من الأقرب إلى الأبعد

//             // العثور على أقرب تاريخ ميلاد وجعله بالأحمر
//             if (upcomingBirthdays.length > 0) {
//                 const nearestBirthday = upcomingBirthdays[0];
//                 upcomingBirthdays.forEach(employee => {
//                     employee.isNearest = (employee.id === nearestBirthday.id);
//                     employee.image_url = employee.image_128 ? `data:image/png;base64,${employee.image_128}` : null;
//                 });
//             }

//             console.log("✅ Loaded Sorted Birthdays with Nearest Highlighted and Images:", upcomingBirthdays);
//             this.state.birthdays = upcomingBirthdays;
//         } catch (error) {
//             console.error("❌ Error loading birthdays:", error);
//         }
//     }
// }

// registry.category("systray").add("sdm_birthday_notification.BirthdayListSystray", {
//     Component: BirthdayListSystray,
//     sequence: 15,
// });

/** @odoo-module **/

import { registry } from "@web/core/registry";
import { Component, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class BirthdayListSystray extends Component {
    static template = "sdm_birthday_notification.SystrayDropdown";

    setup() {
        this.orm = useService("orm");
        this.state = useState({ birthdays: [] });
        this.loadBirthdays();
    }

    async loadBirthdays() {
        try {
            const today = new Date();
            const currentYear = today.getFullYear();

            // جلب جميع الموظفين وتواريخ ميلادهم وصورهم
            const employees = await this.orm.call(
                "hr.employee",
                "search_read",
                [[], ['id', 'name', 'birthday', 'image_128']]
            );

            // حساب تاريخ الميلاد للسنة الحالية (لتحديد الفرق بالأيام)
            const allBirthdays = employees
                .filter(employee => employee.birthday)
                .map(employee => {
                    const birthdayDate = new Date(employee.birthday);
                    const thisYearBirthday = new Date(currentYear, birthdayDate.getMonth(), birthdayDate.getDate());

                    // إذا كان عيد الميلاد قد مر هذا العام، نحوله للعام القادم
                    if (thisYearBirthday < today) {
                        thisYearBirthday.setFullYear(currentYear + 1);
                    }

                    // حساب الفرق بالأيام
                    const diffTime = Math.ceil((thisYearBirthday - today) / (1000 * 60 * 60 * 24));
                    return {
                        ...employee,
                        isNearest: false,
                        daysRemaining: diffTime,
                        image_url: employee.image_128 ? `data:image/png;base64,${employee.image_128}` : null
                    };
                })
                .sort((a, b) => a.daysRemaining - b.daysRemaining); // ترتيب من الأقرب إلى الأبعد

            // العثور على أقرب تاريخ ميلاد وجعله بالأحمر
            if (allBirthdays.length > 0) {
                allBirthdays[0].isNearest = true;
            }

            console.log("✅ Loaded All Sorted Birthdays with Countdown:", allBirthdays);
            this.state.birthdays = allBirthdays;
        } catch (error) {
            console.error("❌ Error loading birthdays:", error);
        }
    }
}

registry.category("systray").add("sdm_birthday_notification.BirthdayListSystray", {
    Component: BirthdayListSystray,
    sequence: 15,
});
