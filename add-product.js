/* =================================
   تنظیمات Supabase
================================= */

const SUPABASE_URL =
    "https://ugrtomjjslqwkijieovf.supabase.co";

const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVncnRvbWpqc2xxd2tpamllb3ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1Mzk4ODMsImV4cCI6MjEwNDExNTg4M30.77C3vnS5BO_YkHl1ppnbII0zy-jOjaUWq_HAMJnRLK4";


/* =================================
   اتصال Supabase
================================= */

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


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

const consoleOutput =
    document.getElementById(
        "console-output"
    );

const clearConsoleButton =
    document.getElementById(
        "clear-console"
    );


/* =================================
   کنسول داخل سایت
================================= */

function addToSiteConsole(
    type,
    ...values
) {

    if (!consoleOutput) return;


    const line =
        document.createElement(
            "div"
        );


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
                typeof value === "object" &&
                value !== null
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


/* =================================
   اتصال کنسول به console.log
================================= */

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


/* =================================
   console.error
================================= */

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


/* =================================
   console.warn
================================= */

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


/* =================================
   پاک کردن کنسول
================================= */

function clearSiteConsole() {

    if (consoleOutput) {

        consoleOutput.innerHTML =
            "";

    }

}


if (clearConsoleButton) {

    clearConsoleButton.addEventListener(
        "click",
        clearSiteConsole
    );

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
            "Line:",
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
   شروع
================================= */

console.log(
    "🚀 برنامه افزودن محصول شروع شد."
);


/* =================================
   بررسی تنظیمات Supabase
================================= */

if (
    !SUPABASE_URL ||
    SUPABASE_URL.includes(
        "YOUR_SUPABASE"
    )
) {

    console.error(
        "❌ SUPABASE_URL تنظیم نشده است."
    );

}


if (
    !SUPABASE_ANON_KEY ||
    SUPABASE_ANON_KEY.includes(
        "YOUR_SUPABASE"
    )
) {

    console.error(
        "❌ SUPABASE_ANON_KEY تنظیم نشده است."
    );

}


/* =================================
   انتخاب تصاویر
================================= */

if (imagesInput) {

    imagesInput.addEventListener(
        "change",
        function () {

            preview.innerHTML =
                "";


            const files =
                Array.from(
                    this.files
                );


            console.log(
                "🖼 تعداد تصاویر انتخاب‌شده:",
                files.length
            );


            files.forEach(
                function (file) {

                    if (
                        !file.type.startsWith(
                            "image/"
                        )
                    ) {

                        console.warn(
                            "فایل تصویر نیست:",
                            file.name
                        );

                        return;

                    }


                    const reader =
                        new FileReader();


                    reader.onload =
                        function (event) {

                            const img =
                                document.createElement(
                                    "img"
                                );


                            img.src =
                                event.target.result;


                            img.style.width =
                                "120px";

                            img.style.height =
                                "120px";

                            img.style.objectFit =
                                "cover";

                            img.style.borderRadius =
                                "10px";

                            img.style.margin =
                                "5px";


                            preview.appendChild(
                                img
                            );

                        };


                    reader.readAsDataURL(
                        file
                    );

                }
            );

        }
    );

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
        "📢",
        text
    );

}


/* =================================
   بررسی فایل‌ها
================================= */

function validateImages(
    files
) {

    if (
        !files ||
        files.length === 0
    ) {

        return "حداقل یک تصویر انتخاب کنید.";

    }


    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];


    for (
        const file of files
    ) {

        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            return (
                "فرمت تصویر مجاز نیست: " +
                file.name
            );

        }


        /*
         * حداکثر 5 مگابایت
         */

        if (
            file.size >
            5 * 1024 * 1024
        ) {

            return (
                "حجم تصویر بیشتر از ۵ مگابایت است: " +
                file.name
            );

        }

    }


    return null;

}


/* =================================
   ثبت فرم
================================= */

if (form) {

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            console.log(
                "📦 شروع ثبت محصول..."
            );


            /* -------------------------
               دریافت اطلاعات
            ------------------------- */

            const title =
                document
                    .getElementById(
                        "title"
                    )
                    .value
                    .trim();


            const price =
                Number(
                    document
                        .getElementById(
                            "price"
                        )
                        .value
                );


            const stock =
                Number(
                    document
                        .getElementById(
                            "stock"
                        )
                        .value
                );


            const description =
                document
                    .getElementById(
                        "description"
                    )
                    .value
                    .trim();


            const files =
                Array.from(
                    imagesInput.files
                );


            console.log(
                "نام محصول:",
                title
            );


            console.log(
                "قیمت:",
                price
            );


            console.log(
                "موجودی:",
                stock
            );


            console.log(
                "تعداد تصاویر:",
                files.length
            );


            /* -------------------------
               اعتبارسنجی
            ------------------------- */

            if (!title) {

                showMessage(
                    "نام محصول را وارد کنید.",
                    "#e60023"
                );

                return;

            }


            if (
                !Number.isFinite(price) ||
                price < 0
            ) {

                showMessage(
                    "قیمت محصول نامعتبر است.",
                    "#e60023"
                );

                return;

            }


            if (
                !Number.isInteger(stock) ||
                stock < 0
            ) {

                showMessage(
                    "موجودی محصول نامعتبر است.",
                    "#e60023"
                );

                return;

            }


            const imageError =
                validateImages(
                    files
                );


            if (imageError) {

                showMessage(
                    imageError,
                    "#e60023"
                );

                return;

            }


            /* -------------------------
               غیرفعال کردن دکمه
            ------------------------- */

            submitButton.disabled =
                true;


            submitButton.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                در حال ثبت...
            `;


            showMessage(
                "در حال ثبت محصول...",
                "#333"
            );


            let productId = null;


            try {

                /* =========================
                   مرحله ۱
                   ثبت محصول
                ========================= */

                console.log(
                    "1️⃣ ثبت محصول در جدول products..."
                );


                const {
                    data: product,
                    error: productError
                } =
                    await supabaseClient
                        .from(
                            "products"
                        )
                        .insert({

                            title:
                                title,

                            description:
                                description,

                            price:
                                price,

                            stock:
                                stock

                        })
                        .select()
                        .single();


                if (productError) {

                    console.error(
                        "❌ خطای ثبت محصول:",
                        productError
                    );

                    throw productError;

                }


                if (!product) {

                    throw new Error(
                        "Supabase محصولی برنگرداند."
                    );

                }


                productId =
                    product.id;


                console.log(
                    "✅ محصول ثبت شد. ID:",
                    productId
                );


                /* =========================
                   مرحله ۲
                   آپلود تصاویر
                ========================= */

                const uploadedImages = [];


                for (
                    let i = 0;
                    i < files.length;
                    i++
                ) {

                    const file =
                        files[i];


                    console.log(
                        "2️⃣ آپلود تصویر:",
                        file.name
                    );


                    /*
                     * پسوند فایل
                     */

                    let extension =
                        "jpg";


                    if (
                        file.type ===
                        "image/png"
                    ) {

                        extension =
                            "png";

                    }
                    else if (
                        file.type ===
                        "image/webp"
                    ) {

                        extension =
                            "webp";

                    }


                    /*
                     * نام یکتا
                     */

                    const fileName =
                        Date.now() +
                        "-" +
                        Math.random()
                            .toString(36)
                            .substring(2, 10) +
                        "." +
                        extension;


                    /*
                     * مسیر فایل
                     */

                    const filePath =
                        productId +
                        "/" +
                        fileName;


                    const {
                        error:
                            uploadError
                    } =
                        await supabaseClient
                            .storage
                            .from(
                                "product-images"
                            )
                            .upload(
                                filePath,
                                file,
                                {
                                    cacheControl:
                                        "3600",

                                    upsert:
                                        false,

                                    contentType:
                                        file.type
                                }
                            );


                    if (uploadError) {

                        console.error(
                            "❌ خطای آپلود:",
                            uploadError
                        );

                        throw uploadError;

                    }


                    console.log(
                        "✅ تصویر آپلود شد:",
                        filePath
                    );


                    /*
                     * دریافت URL عمومی
                     */

                    const {
                        data:
                            publicUrlData
                    } =
                        supabaseClient
                            .storage
                            .from(
                                "product-images"
                            )
                            .getPublicUrl(
                                filePath
                            );


                    const imageUrl =
                        publicUrlData
                            .publicUrl;


                    console.log(
                        "🔗 URL تصویر:",
                        imageUrl
                    );


                    uploadedImages.push({

                        product_id:
                            productId,

                        image_url:
                            imageUrl,

                        sort_order:
                            i

                    });

                }


                /* =========================
                   مرحله ۳
                   ثبت تصاویر در DB
                ========================= */

                console.log(
                    "3️⃣ ثبت URL تصاویر در product_images..."
                );


                if (
                    uploadedImages.length > 0
                ) {

                    const {
                        error:
                            imageDbError
                    } =
                        await supabaseClient
                            .from(
                                "product_images"
                            )
                            .insert(
                                uploadedImages
                            );


                    if (imageDbError) {

                        console.error(
                            "❌ خطای ثبت تصاویر:",
                            imageDbError
                        );


                        throw imageDbError;

                    }


                    console.log(
                        "✅ تصاویر در دیتابیس ثبت شدند."
                    );

                }


                /* =========================
                   موفقیت نهایی
                ========================= */

                console.log(
                    "🎉 محصول با موفقیت کامل ثبت شد!"
                );


                showMessage(
                    "✅ محصول با موفقیت ثبت شد.",
                    "green"
                );


                /*
                 * پاک کردن فرم
                 */

                form.reset();


                preview.innerHTML =
                    "";


                /*
                 * بازگرداندن دکمه
                 */

                submitButton.disabled =
                    false;


                submitButton.innerHTML = `
                    <i class="fa-solid fa-plus"></i>
                    ثبت محصول
                `;


            }
            catch (error) {

                console.error(
                    "❌ ثبت محصول ناموفق بود:",
                    error
                );


                showMessage(
                    "❌ خطا: " +
                    (
                        error.message ||
                        "خطای نامشخص"
                    ),
                    "#e60023"
                );


                /*
                 * اگر محصول ثبت شده ولی
                 * ادامه کار شکست خورده،
                 * ID را نشان می‌دهیم.
                 */

                if (productId) {

                    console.warn(
                        "⚠️ محصول با ID " +
                        productId +
                        " ثبت شده ولی عملیات تصاویر کامل نشده است."
                    );

                }


                submitButton.disabled =
                    false;


                submitButton.innerHTML = `
                    <i class="fa-solid fa-plus"></i>
                    ثبت محصول
                `;

            }

        }
    );

}
else {

    console.error(
        "❌ فرم product-form پیدا نشد."
    );

}


/* =================================
   پایان
================================= */

console.log(
    "✅ سیستم افزودن محصول آماده است."
);
