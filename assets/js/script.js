const audFormatter = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD"
});


const productPrices = {
    //bedroom collection
    bedroom: {
        single: 59.95,
        double: 79.95,
        queen: 89.95,
        king: 99.95
    },

    //curtains collection
    curtains: {
        
        "203cm x 241cm": 85.00,
        "214cm x 160cm": 88.00,
        "214cm x 213cm": 91.00,
        "214cm x 229cm": 94.00,
        "264cm x 160cm": 97.00,
        "264cm x 213cm": 100.00,
        "264cm x 229cm": 103.00,
        "264cm x 241cm": 106.00,
        "264cm x 305cm": 109.00

    },

    //floor rugs collection
    floor_rugs: {
        "110cm x 170cm": 100.00,
        "60cm x 90cm": 103.00,
        "91cm x 152cm": 106.00,
        "122cm x 183cm": 109.00,
        "152cm x 244cm": 112.00,
        "158cm x 274cm": 115.00
    },

    //night lights collection
    night_lights: {
        "15cm x 15cm": 30.00,
        "20cm x 20cm": 35.00
    },
};

const productInformation =
    document.querySelector(".product-information");

const sizeSelector =
    document.getElementById("product-size");

const priceDisplay =
    document.getElementById("product-price");

if (productInformation && sizeSelector && priceDisplay) {
    sizeSelector.addEventListener("change", function () {
        const collection =
            productInformation.dataset.collection;

        const selectedSize =
            sizeSelector.value;

        if (selectedSize === "") {
            priceDisplay.textContent = "Select a size";
            return;
        }

        const selectedPrice =
            productPrices[collection][selectedSize];

        priceDisplay.textContent =
            audFormatter.format(selectedPrice);
    });
}

const addToCartButton = document.getElementById("add-to-cart-button");
const cartMessage = document.getElementById("cart-message");

if (addToCartButton) {
    addToCartButton.addEventListener("click", function () {
        const collection = productInformation.dataset.collection;
        const productId = productInformation.dataset.productId;
        const productName = productInformation.dataset.productName;
        const productImage = productInformation.dataset.productImage;
        const selectedSize = sizeSelector.value;

        if (selectedSize === "") {
            cartMessage.textContent = "Please select a size first.";
            return;
        }

        const selectedPrice = productPrices[collection][selectedSize];

        const cartItem = {
            product_id: productId,
            product_name: productName,
            product_image: productImage,
            collection: collection,
            size: selectedSize,
            price: selectedPrice,
            quantity: 1
        };

        const cart = JSON.parse(localStorage.getItem("observable_thoughts_cart")) || [];

        const existingItem = cart.find(function (item) {
            return (
                item.product_id === cartItem.product_id &&
                item.size === cartItem.size
            );
        });

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(cartItem);
        }

        localStorage.setItem(
            "observable_thoughts_cart",
            JSON.stringify(cart)
        );

        cartMessage.textContent =
            productName + " — " + selectedSize + " added to cart.";
    });
}

const cartItemsContainer = document.getElementById("cart-items");
const cartSubtotalDisplay = document.getElementById("cart-subtotal");
const cartTotalDisplay = document.getElementById("cart-total");

if (cartItemsContainer) {
    const cart =
        JSON.parse(
            localStorage.getItem("observable_thoughts_cart")
        ) || [];
        cartItemsContainer.addEventListener("click", (event) => {

    if (!event.target.classList.contains("increase-quantity") &&
    !event.target.classList.contains("decrease-quantity") &&
    !event.target.classList.contains("remove-item")) {
    return;
    }

    if (event.target.classList.contains("increase-quantity")) {

        const productID = event.target.dataset.product;
        const size = event.target.dataset.size;

        const item = cart.find(cartItem =>
            cartItem.product_id === productID &&
            cartItem.size === size
        );

        if (item) {
            item.quantity++;
        }

        localStorage.setItem(
            "observable_thoughts_cart",
            JSON.stringify(cart)
        );

        location.reload();

    }

    if (event.target.classList.contains("decrease-quantity")) {

    const productID = event.target.dataset.product;
    const size = event.target.dataset.size;

    const item = cart.find(cartItem =>
        cartItem.product_id === productID &&
        cartItem.size === size
    );

    if (item && item.quantity > 1) {
        item.quantity--;
    }

    localStorage.setItem(
        "observable_thoughts_cart",
        JSON.stringify(cart)
    );

    location.reload();

    }

    if (event.target.classList.contains("remove-item")) {

    const productID = event.target.dataset.product;
    const size = event.target.dataset.size;

    const itemIndex = cart.findIndex(cartItem =>
        cartItem.product_id === productID &&
        cartItem.size === size
    );

    if (itemIndex !== -1) {
        cart.splice(itemIndex, 1);
    }

    localStorage.setItem(
        "observable_thoughts_cart",
        JSON.stringify(cart)
    );

    location.reload();

    }

        });

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <p>Your cart is empty.</p>
        `;
    } else {
        let subtotal = 0;

        cart.forEach(function (item) {
            const itemTotal = item.price * item.quantity;

            subtotal += itemTotal;

            const cartItemElement = document.createElement("article");

            cartItemElement.classList.add("cart-item");

            cartItemElement.innerHTML = `
                <img
                    class="cart-item-image"
                    src="${item.product_image}"
                    alt="${item.product_name}">

                <div class="cart-item-information">

                    <h3>${item.product_name}</h3>

                    <div class="cart-quantity">

                        <button
                            class="decrease-quantity"
                            data-product="${item.product_id}"
                            data-size="${item.size}">

                            −

                        </button>

                        <span>

                            ${item.quantity}

                        </span>

                        <button
                            class="increase-quantity"
                            data-product="${item.product_id}"
                            data-size="${item.size}">

                            +

                        </button>

                    </div>

                    <p>
                        Price each:
                        ${audFormatter.format(item.price)}
                    </p>

                    <p>
                        Item total:
                        ${audFormatter.format(itemTotal)}
                    </p>

                    <button
                    class="remove-item"
                    data-product="${item.product_id}"
                    data-size="${item.size}">

                    Remove

                    </button>

                </div>
            `;

            cartItemsContainer.appendChild(cartItemElement);
        });

        cartSubtotalDisplay.textContent =
            audFormatter.format(subtotal);

        cartTotalDisplay.textContent =
            audFormatter.format(subtotal);
    }
}