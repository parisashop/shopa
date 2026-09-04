/* =========================================================
   تنظیمات Supabase
========================================================= */

const SUPABASE_URL = "https://ugrtomjjslqwkijieovf.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVncnRvbWpqc2xxd2tpamllb3ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1Mzk4ODMsImV4cCI6MjEwNDExNTg4M30.77C3vnS5BO_YkHl1ppnbII0zy-jOjaUWq_HAMJnRLK4";


/* =========================================================
   اتصال به Supabase
========================================================= */

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


/* =========================================================
   متغیرها
========================================================= */

let allProducts = [];

let cart = JSON.parse(
    localStorage.getItem("shop_cart") || "[]"
);


/* =========================================================
   عناصر صفحه
========================================================= */

const productsGrid =
    document.getElementById("products-grid");

const productsLoading =
    document.getElementById("products-loading");

const productsError =
    document.getElementById("products-error");

const noProducts =
    document.getElementById("no-products");

const searchInput =
    document.getElementById("search-input");

const cartCount =
    document.getElementById("cart-count");


/* =========================================================
   کنسول داخل سایت
========================================================= */

const consoleOutput =
    document.getElementById("console-output");


function addConsoleLine(
    type,
    message
) {

    if (!consoleOutput) return;

    const line =
        document.createElement("div");

    line.className =
        "console-line " + type;

    line.textContent =
        message;

    consoleOutput.appendChild(line);

    consoleOutput.scrollTop =
        consoleOutput.scrollHeight;
}


const originalLog =
    console.log;

const originalError =
    console.error;

const originalWarn =
    console.warn;


console.log = function (...args) {

    originalLog(...args);

    addConsoleLine(
        "log",
        args
            .map(item => {
                try {
                    return typeof item === "object"
                        ? JSON.stringify(item, null, 2)
                        : String(item);
                } catch {
                    return String(item);
                }
            })
            .join(" ")
    );
};


console.error = function (...args) {

    originalError(...args);

    addConsoleLine(
        "error",
        args
            .map(item => String(item))
            .join(" ")
    );
};


console.warn = function (...args) {

    originalWarn(...args);

    addConsoleLine(
        "warning",
        args
            .map(item => String(item))
            .join(" ")
    );
};


window.addEventListener(
    "error",
    function (event) {

        console.error(
            "خطای JavaScript:",
            event.message
        );

    }
);


window.addEventListener(
    "unhandledrejection",
    function (event) {

        console.error(
            "خطای Promise:",
            event.reason
        );

    }
);


function clearConsole() {

    if (consoleOutput) {

        consoleOutput.innerHTML = "";

    }

}


/* =========================================================
   اعداد فارسی
========================================================= */

function toPersianNumber(value) {

    return String(value)
        .replace(/0/g, "۰")
        .replace(/1/g, "۱")
        .replace(/2/g, "۲")
        .replace(/3/g, "۳")
        .replace(/4/g, "۴")
        .replace(/5/g, "۵")
        .replace(/6/g, "۶")
        .replace(/7/g, "۷")
        .replace(/8/g, "۸")
        .replace(/9/g, "۹");
}


/* =========================================================
   فرمت قیمت
========================================================= */

function formatPrice(price) {

    const number =
        Number(price);

    if (!Number.isFinite(number)) {

        return "۰ تومان";

    }

    return number
        .toLocaleString("fa-IR")
        + " تومان";
}


/* =========================================================
   تصویر پیش‌فرض
========================================================= */

const DEFAULT_IMAGE =
    "https://placehold.co/600x600/f5f5f5/e60023?text=بدون+تصویر";


/* =========================================================
   دریافت محصولات
========================================================= */

async function loadProducts() {

    console.log(
        "شروع دریافت محصولات از Supabase..."
    );

    productsLoading.style.display =
        "block";

    productsError.style.display =
        "none";

    noProducts.style.display =
        "none";

    productsGrid.innerHTML = "";


    try {

        /*
         * دریافت محصولات
         *
         * جدیدترین محصول اول
         */

        const {
            data: products,
            error
        } = await supabaseClient
            .from("products")
            .select(`
                id,
                title,
                description,
                price,
                stock,
                category_id,
                created_at
            `)
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


        if (error) {

            throw error;

        }


        console.log(
            "تعداد محصولات:",
            products?.length || 0
        );


        if (!products ||
            products.length === 0) {

            allProducts = [];

            productsLoading.style.display =
                "none";

            noProducts.style.display =
                "block";

            return;

        }


        /*
         * دریافت تصاویر
         */

        const productIds =
            products.map(
                product => product.id
            );


        const {
            data: images,
            error: imagesError
        } = await supabaseClient
            .from("product_images")
            .select(`
                id,
                product_id,
                image_url,
                sort_order
            `)
            .in(
                "product_id",
                productIds
            )
            .order(
                "sort_order",
                {
                    ascending: true
                }
            );


        if (imagesError) {

            console.warn(
                "خطا در دریافت تصاویر:",
                imagesError.message
            );

        }


        /*
         * اتصال تصویر به محصول
         */

        allProducts =
            products.map(product => {

                const productImages =
                    (images || [])
                        .filter(
                            image =>
                                image.product_id === product.id
                        )
                        .sort(
                            (a, b) =>
                                (a.sort_order || 0) -
                                (b.sort_order || 0)
                        );


                return {

                    ...product,

                    images:
                        productImages,

                    image:
                        productImages.length > 0
                            ? productImages[0].image_url
                            : DEFAULT_IMAGE

                };

            });


        productsLoading.style.display =
            "none";


        renderProducts(
            allProducts
        );


    } catch (error) {

        console.error(
            "خطا در دریافت محصولات:",
            error.message || error
        );


        productsLoading.style.display =
            "none";

        productsError.style.display =
            "block";

    }

}


/* =========================================================
   نمایش محصولات
========================================================= */

function renderProducts(
    products
) {

    productsGrid.innerHTML = "";

    noProducts.style.display =
        "none";


    if (!products ||
        products.length === 0) {

        noProducts.style.display =
            "block";

        return;

    }


    products.forEach(
        product => {

            const card =
                createProductCard(product);

            productsGrid.appendChild(card);

        }
    );

}


/* =========================================================
   ساخت کارت محصول
========================================================= */

function createProductCard(
    product
) {

    const article =
        document.createElement("article");

    article.className =
        "product-card";


    const imageContainer =
        document.createElement("div");

    imageContainer.className =
        "product-image";


    /*
     * تصویر
     */

    const image =
        document.createElement("img");

    image.src =
        product.image || DEFAULT_IMAGE;

    image.alt =
        product.title || "محصول";

    image.loading =
        "lazy";


    image.onerror =
        function () {

            this.onerror = null;

            this.src =
                DEFAULT_IMAGE;

        };


    imageContainer.appendChild(
        image
    );


    /*
     * وضعیت موجودی
     */

    if (Number(product.stock) <= 0) {

        const unavailable =
            document.createElement("span");

        unavailable.className =
            "discount";

        unavailable.textContent =
            "ناموجود";

        imageContainer.appendChild(
            unavailable
        );

    }


    article.appendChild(
        imageContainer
    );


    /*
     * عنوان محصول
     */

    const title =
        document.createElement("h3");

    title.textContent =
        product.title || "بدون نام";

    article.appendChild(
        title
    );


    /*
     * قیمت
     */

    const priceBox =
        document.createElement("div");

    priceBox.className =
        "product-price";


    const price =
        document.createElement("strong");

    price.textContent =
        formatPrice(
            product.price
        );


    priceBox.appendChild(
        price
    );


    /*
     * موجودی
     */

    const stock =
        document.createElement("small");

    stock.style.color =
        Number(product.stock) > 0
            ? "#666"
            : "#e60023";

    stock.style.marginTop =
        "5px";


    if (Number(product.stock) > 0) {

        stock.textContent =
            "موجودی: " +
            toPersianNumber(product.stock) +
            " عدد";

    } else {

        stock.textContent =
            "این محصول ناموجود است";

    }


    priceBox.appendChild(
        stock
    );


    article.appendChild(
        priceBox
    );


    /*
     * دکمه سبد خرید
     */

    const button =
        document.createElement("button");

    button.className =
        "add-to-cart";


    if (Number(product.stock) <= 0) {

        button.disabled =
            true;

        button.style.background =
            "#999";

        button.style.cursor =
            "not-allowed";


        button.innerHTML = `
            <i class="fa-solid fa-ban"></i>
            ناموجود
        `;

    } else {

        button.innerHTML = `
            <i class="fa-solid fa-cart-plus"></i>
            افزودن به سبد خرید
        `;


        button.addEventListener(
            "click",
            function () {

                addToCart(product);

            }
        );

    }


    article.appendChild(
        button
    );


    return article;

}


/* =========================================================
   افزودن محصول به سبد
========================================================= */

function addToCart(
    product
) {

    if (!product) {

        return;

    }


    if (Number(product.stock) <= 0) {

        alert(
            "این محصول موجود نیست."
        );

        return;

    }


    const existing =
        cart.find(
            item =>
                item.id === product.id
        );


    if (existing) {

        if (
            existing.quantity >=
            Number(product.stock)
        ) {

            alert(
                "بیشتر از موجودی این محصول نمی‌توانید اضافه کنید."
            );

            return;

        }


        existing.quantity++;

    } else {

        cart.push({

            id:
                product.id,

            title:
                product.title,

            price:
                Number(product.price),

            image:
                product.image,

            quantity:
                1

        });

    }


    localStorage.setItem(
        "shop_cart",
        JSON.stringify(cart)
    );


    updateCartCount();


    console.log(
        "محصول به سبد خرید اضافه شد:",
        product.title
    );


    /*
     * پیام کوچک
     */

    showToast(
        "محصول به سبد خرید اضافه شد 🛒"
    );

}


/* =========================================================
   تعداد سبد خرید
========================================================= */

function updateCartCount() {

    const count =
        cart.reduce(
            (
                total,
                item
            ) =>
                total +
                Number(item.quantity || 0),
            0
        );


    cartCount.textContent =
        count.toLocaleString("fa-IR");

}


updateCartCount();


/* =========================================================
   جستجوی محصولات
========================================================= */

searchInput.addEventListener(
    "input",
    function () {

        const query =
            this.value
                .trim()
                .toLowerCase();


        if (!query) {

            renderProducts(
                allProducts
            );

            return;

        }


        const filtered =
            allProducts.filter(
                product => {

                    const title =
                        String(
                            product.title || ""
                        ).toLowerCase();


                    const description =
                        String(
                            product.description || ""
                        ).toLowerCase();


                    return (
                        title.includes(query) ||
                        description.includes(query)
                    );

                }
            );


        console.log(
            "نتیجه جستجو:",
            filtered.length
        );


        renderProducts(
            filtered
        );

    }
);


/* =========================================================
   انتخاب دسته‌بندی
========================================================= */

document
    .querySelectorAll(".category")
    .forEach(
        category => {

            category.addEventListener(
                "click",
                function () {

                    /*
                     * فعلاً چون در فرم ثبت محصول
                     * category_id ثبت نمی‌شود،
                     * دسته‌بندی فقط برای ظاهر است.
                     */

                    searchInput.value = "";

                    renderProducts(
                        allProducts
                    );

                }
            );

        }
    );


/* =========================================================
   دکمه مشاهده همه
========================================================= */

document
    .getElementById("show-all-products")
    .addEventListener(
        "click",
        function () {

            searchInput.value = "";

            renderProducts(
                allProducts
            );

        }
    );


/* =========================================================
   دکمه سبد خرید
========================================================= */

document
    .getElementById("cart-button")
    .addEventListener(
        "click",
        function () {

            if (cart.length === 0) {

                alert(
                    "سبد خرید شما خالی است."
                );

                return;

            }


            let message =
                "محصولات سبد خرید:\n\n";


            cart.forEach(
                item => {

                    message +=
                        "🛒 " +
                        item.title +
                        " × " +
                        item.quantity +
                        "\n";

                }
            );


            alert(message);

        }
    );


/* =========================================================
   دکمه ورود
========================================================= */

document
    .getElementById("login-button")
    .addEventListener(
        "click",
        function () {

            alert(
                "بخش ورود و ثبت‌نام به‌زودی فعال می‌شود."
            );

        }
    );


/* =========================================================
   Toast
========================================================= */

function showToast(
    message
) {

    const oldToast =
        document.getElementById(
            "shop-toast"
        );


    if (oldToast) {

        oldToast.remove();

    }


    const toast =
        document.createElement("div");

    toast.id =
        "shop-toast";

    toast.textContent =
        message;


    toast.style.position =
        "fixed";

    toast.style.bottom =
        "25px";

    toast.style.right =
        "25px";

    toast.style.background =
        "#e60023";

    toast.style.color =
        "white";

    toast.style.padding =
        "14px 20px";

    toast.style.borderRadius =
        "10px";

    toast.style.zIndex =
        "9999";

    toast.style.boxShadow =
        "0 5px 20px #00000030";

    toast.style.fontSize =
        "14px";


    document.body.appendChild(
        toast
    );


    setTimeout(
        function () {

            toast.remove();

        },
        2500
    );

}


/* =========================================================
   شروع برنامه
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "فروشگاه در حال اجرا است..."
        );

        loadProducts();

    }
);
