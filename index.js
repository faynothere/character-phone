import { extension_settings, getContext } from "../../../extensions.js";
import { saveSettingsDebounced } from "../../../../script.js";

const extensionName = "character-phone";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;

// ค่าเริ่มต้นสำหรับการตั้งค่า
const defaultSettings = {
    floatingButtonEnabled: true,
};

// ฟังก์ชันโหลดการตั้งค่า
function loadSettings() {
    extension_settings[extensionName] = extension_settings[extensionName] || {};
    if (Object.keys(extension_settings[extensionName]).length === 0) {
        Object.assign(extension_settings[extensionName], defaultSettings);
    }
    // อัปเดต UI การตั้งค่าให้ตรงกับค่าที่โหลดมา
    $("#character_phone_enable_btn").prop("checked", extension_settings[extensionName].floatingButtonEnabled);
    updateFloatingButtonVisibility();
}

// ฟังก์ชันอัปเดตสถานะปุ่มลอยตามการตั้งค่า
function updateFloatingButtonVisibility() {
    const enabled = extension_settings[extensionName].floatingButtonEnabled;
    if (enabled) {
        createFloatingButton();
    } else {
        removeFloatingButton();
    }
}

// ฟังก์ชันสร้างปุ่มลอย
function createFloatingButton() {
    if ($("#character-phone-float-btn").length) return;
    const btn = $(`
        <div id="character-phone-float-btn" class="character-phone-float-btn" title="เปิดมือถือของตัวละคร">
            <i class="fa-solid fa-mobile-screen-button"></i>
        </div>
    `);
    $("body").append(btn);
    btn.on("click", openPhoneModal);
    console.log(`[${extensionName}] Floating button created.`);
}

// ฟังก์ชันลบปุ่มลอย
function removeFloatingButton() {
    $("#character-phone-float-btn").remove();
}

// ฟังก์ชันเปิด Modal มือถือ
function openPhoneModal() {
    if ($("#character-phone-modal-overlay").length) return;

    const overlay = $(`<div id="character-phone-modal-overlay" class="character-phone-modal-overlay"></div>`);
    const modal = $(createPhoneHTML());
    overlay.append(modal);
    $("body").append(overlay);

    // ปิดเมื่อคลิกพื้นหลังหรือปุ่มปิด
    overlay.on("click", function(e) {
        if ($(e.target).hasClass("character-phone-modal-overlay") || $(e.target).hasClass("close-modal-btn")) {
            closePhoneModal();
        }
    });

    // จัดการการคลิกแอป
    modal.find(".app").on("click", function() {
        const appKey = $(this).data("app");
        const data = appData[appKey];
        if (data) {
            modal.find("#app-title").text(data.title);
            modal.find("#app-content").html(data.html);
        }
        modal.find(".phone").addClass("show-app-screen");
    });

    // ปุ่มกลับ
    modal.find(".back-btn").on("click", function() {
        modal.find(".phone").removeClass("show-app-screen");
        modal.find("#app-title").text("หน้าหลัก");
        modal.find("#app-content").html("<p>เลือกแอปเพื่อดูข้อมูล</p>");
    });
}

// ฟังก์ชันปิด Modal
function closePhoneModal() {
    $("#character-phone-modal-overlay").remove();
}

// ฟังก์ชันสร้าง HTML ของหน้าจอมือถือ
function createPhoneHTML() {
    return `
    <div class="character-phone-modal">
        <div class="phone-container">
            <div class="phone">
                <div class="status-bar">
                    <div class="time">12:30</div>
                    <div class="status-icons">
                        <i class="fa-solid fa-signal"></i>
                        <i class="fa-solid fa-wifi"></i>
                        <i class="fa-solid fa-battery-three-quarters"></i>
                    </div>
                </div>
                <div class="apps-grid">
                    <div class="app" data-app="notes"><div class="app-icon"><i class="fa-solid fa-note-sticky"></i></div><span>โน้ต</span></div>
                    <div class="app" data-app="maps"><div class="app-icon"><i class="fa-solid fa-map"></i></div><span>แผนที่</span></div>
                    <div class="app" data-app="chat"><div class="app-icon"><i class="fa-solid fa-comment"></i></div><span>แชท</span></div>
                    <div class="app" data-app="browser"><div class="app-icon"><i class="fa-solid fa-globe"></i></div><span>เบราว์เซอร์</span></div>
                    <div class="app" data-app="bank"><div class="app-icon"><i class="fa-solid fa-building-columns"></i></div><span>ธนาคาร</span></div>
                    <div class="app" data-app="purchases"><div class="app-icon"><i class="fa-solid fa-cart-shopping"></i></div><span>สิ่งที่ซื้อ</span></div>
                    <div class="app" data-app="gallery"><div class="app-icon"><i class="fa-solid fa-image"></i></div><span>รูปภาพ</span></div>
                </div>
                <div class="app-screen" id="app-screen">
                    <div class="app-header">
                        <button class="back-btn"><i class="fa-solid fa-arrow-left"></i></button>
                        <h3 id="app-title">หน้าหลัก</h3>
                    </div>
                    <div class="app-content" id="app-content"><p>เลือกแอปเพื่อดูข้อมูล</p></div>
                </div>
            </div>
        </div>
        <button class="close-modal-btn"><i class="fa-solid fa-times"></i></button>
    </div>
    `;
}

// ข้อมูลตัวอย่างสำหรับแต่ละแอป
const appData = {
    notes: { title: "โน้ตของลุค", html: `<div class="note-item"><i class="fa-solid fa-note-sticky"></i><div><h3>รายการซื้อของ</h3><p>นม, ไข่, ขนมปัง, ผลไม้</p><small>15 ม.ค.</small></div></div><div class="note-item"><i class="fa-solid fa-note-sticky"></i><div><h3>สิ่งที่ต้องทำ</h3><p>ส่งงานโปรเจค, นัดหมอฟัน</p><small>14 ม.ค.</small></div></div>` },
    maps: { title: "แผนที่", html: `<p>📍 ตำแหน่งปัจจุบัน: <strong>บ้านลุค</strong><br>🗺️ เส้นทางล่าสุด: ไปมหาวิทยาลัย</p>` },
    chat: { title: "ข้อความ", html: `<div class="chat-message"><strong>แม่:</strong> กลับบ้านกี่โมง?</div><div class="chat-message"><strong>เพื่อน:</strong> เจอกัน 6 โมงนะ</div>` },
    browser: { title: "ประวัติการค้นหา", html: `<p>🔍 "ร้านกาแฟใกล้ฉัน"<br>🔍 "หนังเข้าใหม่"</p>` },
    bank: { title: "บัญชีธนาคาร", html: `<p>💰 ยอดเงินคงเหลือ: 4,250 บาท<br>💳 รายการใช้จ่ายล่าสุด: -320 บาท</p>` },
    purchases: { title: "ประวัติการซื้อ", html: `<div class="purchase-item"><i class="fa-solid fa-receipt"></i> 15 ม.ค. - เสื้อยืด 350 บาท</div><div class="purchase-item"><i class="fa-solid fa-receipt"></i> 12 ม.ค. - หนังสือ 450 บาท</div>` },
    gallery: { title: "รูปภาพล่าสุด", html: `<p>🖼️ ภาพวิวทะเล<br>🖼️ ภาพแมวที่บ้าน</p>` }
};

// ฟังก์ชันรอให้ Font Awesome โหลดเสร็จ
function waitForFontAwesome(callback) {
    if (typeof FontAwesome !== 'undefined' || document.querySelector('link[href*="font-awesome"]')) {
        callback();
    } else {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
        document.head.appendChild(link);
        link.onload = callback;
    }
}

// เมื่อโหลดหน้าเสร็จ
jQuery(async () => {
    // รอให้ Font Awesome พร้อม
    waitForFontAwesome(async () => {
        // โหลดไฟล์ HTML สำหรับการตั้งค่า
        try {
            const settingsHtml = await $.get(`${extensionFolderPath}/settings.html`);
            $("#extensions_settings").append(settingsHtml);
            
            // ผูกเหตุการณ์กับการตั้งค่า
            $("#character_phone_enable_btn").on("change", function() {
                extension_settings[extensionName].floatingButtonEnabled = $(this).prop("checked");
                saveSettingsDebounced();
                updateFloatingButtonVisibility();
            });

            // โหลดการตั้งค่าเริ่มต้น
            loadSettings();
            
            // ตรวจสอบและสร้างปุ่มอีกครั้งหลังจากหน่วงเวลา (เผื่อกรณี DOM ยังไม่พร้อม)
            setTimeout(() => {
                updateFloatingButtonVisibility();
                console.log(`[${extensionName}] Extension loaded and verified.`);
            }, 1000);
            
        } catch (error) {
            console.error(`[${extensionName}] Failed to load settings:`, error);
        }
    });
});
