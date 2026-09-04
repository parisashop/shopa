/* =================================
   تنظیمات Supabase
================================= */

const SUPABASE_URL = "YOUR_SUPABASE_URL";

const SUPABASE_ANON_KEY =
    "YOUR_SUPABASE_ANON_KEY";


/* =================================
   کنسول داخل سایت
================================= */

const consoleOutput =
    document.getElementById(
        "console-output"
    );


function addToSiteConsole(
    type,
    ...values
) {

    if (!consoleOutput) return;


    const line =
        document.createElement("div");


    line.className =
        "console-line " + type;


    const time =
        new Date()
            .toLocaleTimeString(
                "fa-IR"
            );


    let text =
        "[" + time + "] ";


    values.forEach(
        function (value) {

            if (
                typeof value === "object"
            ) {

                try {

                    text +=
                        JSON.stringify(
                            value,
                            null,
                            2
                        ) + " ";

                }
                catch {

                    text +=
                        String(value) + " ";

                }

            }
            else {

                text +=
                    String(value) + " ";

            }

        }
    );


    line.textContent =
        text;


    consoleOutput.appendChild(
        line
    );


    consoleOutput.scrollTop =
        consoleOutput.scrollHeight;

}


/* گرفتن log */

const originalLog =
    console.log;


console.log =
    function (...args) {

        originalLog(
            ...args
        );

        addToSiteConsole(
            "log",
            ...args
        );

    };


/* گرفتن error */

const originalError =
    console.error;


console.error =
    function (...args) {

        originalError(
            ...args
        );

        addToSiteConsole(
            "error",
            ...args
        );

    };


/* گرفتن warn */

const originalWarn =
    console.warn;


console.warn =
    function (...args) {

        originalWarn(
            ...args
        );

        addToSiteConsole(
            "warning",
            ...args
        );

    };


/* پاک کردن */

function clearSiteConsole() {

    if (consoleOutput) {

        consoleOutput.innerHTML =
            "";

    }

}


/* =================================
   خطاهای JavaScript
================================= */

window.addEventListener(
    "error",
    function (event) {

        console.error(
            "JavaScript Error:",
            event.message,
            "در خط:",
            event.lineno
        );

    }
);


window.addEventListener(
    "unhandledrejection",
    function (event) {

        console.error(
            "Promise Error:",
            event.reason
        );

    }
);


/* =================================
   بررسی Supabase
================================= */

console.log(
    "شروع برنامه..."
);


console.log(
    "Supabase URL:",
    SUPABASE_URL
);


if (
    !SUPABASE_URL ||
    SUPABASE_URL.includes(
        "YOUR_SUPABASE"
    )
) {

    console.error(
        "SUPABASE_URL تنظیم نشده است!"
    );

}


if (
    !SUPABASE_ANON_KEY ||
    SUPABASE_ANON_KEY.includes(
        "YOUR_SUPABASE"
    )
) {

    console.error(
        "SUPABASE_ANON_KEY تنظیم نشده است!"
    );

}


/* =================================
   اتصال Supabase
================================= */

let supabase;


try {

    supabase =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );


    console.log(
        "اتصال Supabase ایجاد شد."
    );

}
catch (error) {

    console.error(
        "خطا در ساخت اتصال Supabase:",
        error
    );

}


/* =================================
   عناصر صفحه
================================= */

const form =
    document.getElementById(
        "product-form"
    );

const imagesInput =
    document.getElementById(
        "images"
    );

const preview =
    document.getElementById(
        "image-preview"
    );

const message =
    document.getElementById(
        "message"
    );

const submitButton =
    document.getElementById(
        "submit-button"
    );

const categorySelect =
    document.getElementById(
        "category"
    );


console.log(
    "عناصر صفحه دریافت شدند."
);


/* =================================
   دریافت دسته‌بندی‌ها
================================= */

async function loadCategories() {

    console.log(
        "شروع دریافت دسته‌بندی‌ها..."
    );


    if (!categorySelect) {

        console.error(
            "عنصر category پیدا نشد!"
        );

        return;

    }


    categorySelect.innerHTML =
        '<option value="">در حال دریافت...</option>';


    try {

        console.log(
            "ارسال درخواست به جدول categories..."
        );


        const response =
            await supabase
                .from(
                    "categories"
                )
                .select(
                    "id, name"
                )
                .order(
                    "name",
                    {
                        ascending: true
                    }
                );


        console.log(
            "پاسخ کامل Supabase:",
            response
        );


        const data =
            response.data;


        const error =
            response.error;


        if (error) {

            console.error(
                "خطای Supabase:",
                error
            );

            throw error;

        }


        console.log(
            "دسته‌بندی‌های دریافت‌شده:",
            data
        );


        categorySelect.innerHTML =
            '<option value="">انتخاب دسته‌بندی</option>';


        if (
            !data ||
            data.length === 0
        ) {

            console.warn(
                "هیچ دسته‌بندی پیدا نشد."
            );


            categorySelect.innerHTML =
                '<option value="">هیچ دسته‌بندی وجود ندارد</option>';


            return;

        }


        data.forEach(
            function (category) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    category.id;


                option.textContent =
                    category.name;


                categorySelect.appendChild(
                    option
                );


                console.log(
                    "دسته اضافه شد:",
                    category.name
                );

            }
        );


        console.log(
            "دریافت دسته‌بندی‌ها با موفقیت تمام شد."
        );

    }
    catch (error) {

        console.error(
            "خطای نهایی دریافت دسته‌بندی:",
            error
        );


        categorySelect.innerHTML =
            '<option value="">خطا در دریافت دسته‌بندی</option>';


        showMessage(
            "خطا در دریافت دسته‌بندی: " +
            error.message,
            "red"
        );

    }

}


/* =================================
   نمایش پیام
================================= */

function showMessage(
    text,
    color
) {

    if (!message) return;


    message.textContent =
        text;


    message.style.color =
        color;


    console.log(
        "پیام:",
        text
    );

}


/* =================================
   شروع برنامه
================================= */

console.log(
    "فراخوانی loadCategories..."
);


loadCategories();
