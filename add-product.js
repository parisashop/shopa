const SUPABASE_URL = "https://ugrtomjjslqwkijieovf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVncnRvbWpqc2xxd2tpamllb3ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1Mzk4ODMsImV4cCI6MjEwNDExNTg4M30.77C3vnS5BO_YkHl1ppnbII0zy-jOjaUWq_HAMJnRLK4";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

const form = document.getElementById("product-form");

const imagesInput = document.getElementById("images");

const preview = document.getElementById("image-preview");

const message = document.getElementById("message");

const submitButton =
    document.getElementById("submit-button");


/* =========================
   دریافت دسته‌بندی‌ها
========================= */

async function loadCategories() {

    const categorySelect =
        document.getElementById("category");


    const { data, error } =
        await supabase
            .from("categories")
            .select("*")
            .order("name");


    if (error) {

        categorySelect.innerHTML =
            "<option>خطا در دریافت دسته‌بندی</option>";

        console.error(error);

        return;

    }


    categorySelect.innerHTML =
        '<option value="">انتخاب دسته‌بندی</option>';


    data.forEach(category => {

        const option =
            document.createElement("option");


        option.value = category.id;

        option.textContent =
            category.name;


        categorySelect.appendChild(option);

    });

}


loadCategories();


/* =========================
   پیش‌نمایش تصاویر
========================= */

imagesInput.addEventListener(
    "change",
    function () {

        preview.innerHTML = "";

        const files =
            Array.from(this.files);


        files.forEach(file => {

            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    const img =
                        document.createElement("img");


                    img.src =
                        event.target.result;


                    preview.appendChild(img);

                };


            reader.readAsDataURL(file);

        });

    }
);


/* =========================
   آپلود تصویر
========================= */

async function uploadImage(
    file,
    productId,
    index
) {

    const fileExtension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();


    const fileName =
        `${productId}/${Date.now()}-${index}.${fileExtension}`;


    const { error } =
        await supabase
            .storage
            .from("product-images")
            .upload(
                fileName,
                file,
                {
                    contentType:
                        file.type,

                    upsert:
                        false
                }
            );


    if (error) {

        throw error;

    }


    const { data } =
        supabase
            .storage
            .from("product-images")
            .getPublicUrl(
                fileName
            );


    return data.publicUrl;

}


/* =========================
   ثبت محصول
========================= */

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const title =
            document
                .getElementById("title")
                .value
                .trim();


        const categoryId =
            document
                .getElementById("category")
                .value;


        const price =
            Number(
                document
                    .getElementById("price")
                    .value
            );


        const stock =
            Number(
                document
                    .getElementById("stock")
                    .value
            );


        const description =
            document
                .getElementById("description")
                .value
                .trim();


        const files =
            Array.from(
                imagesInput.files
            );


        if (!files.length) {

            showMessage(
                "حداقل یک تصویر انتخاب کنید.",
                "red"
            );

            return;

        }


        try {

            submitButton.disabled =
                true;


            submitButton.innerText =
                "در حال ثبت...";


            showMessage(
                "در حال ثبت محصول...",
                "#555"
            );


            /* ثبت محصول */

            const {
                data: product,
                error: productError
            } =
                await supabase
                    .from("products")
                    .insert({
                        title:
                            title,

                        description:
                            description,

                        price:
                            price,

                        stock:
                            stock,

                        category_id:
                            categoryId
                    })
                    .select()
                    .single();


            if (productError) {

                throw productError;

            }


            /* آپلود تصاویر */

            for (
                let i = 0;
                i < files.length;
                i++
            ) {

                const imageUrl =
                    await uploadImage(
                        files[i],
                        product.id,
                        i
                    );


                /* ثبت URL تصویر */

                const {
                    error: imageError
                } =
                    await supabase
                        .from("product_images")
                        .insert({

                            product_id:
                                product.id,

                            image_url:
                                imageUrl,

                            sort_order:
                                i

                        });


                if (imageError) {

                    throw imageError;

                }

            }


            showMessage(
                "محصول با موفقیت ثبت شد 🎉",
                "green"
            );


            form.reset();

            preview.innerHTML = "";


        }
        catch (error) {

            console.error(error);


            showMessage(
                "خطا: " +
                error.message,
                "red"
            );

        }
        finally {

            submitButton.disabled =
                false;


            submitButton.innerHTML =
                `
                <i class="fa-solid fa-plus"></i>
                ثبت محصول
                `;

        }

    }
);


/* =========================
   نمایش پیام
========================= */

function showMessage(
    text,
    color
) {

    message.textContent =
        text;

    message.style.color =
        color;

}
