document.addEventListener('DOMContentLoaded', function() {
    
    const VARIANT_QUERY = `{
        node(id: "48217283101021") {
            ... on ProductVariant {
                compareAtPriceV2 {
                    amount
                    currencyCode
                }
            }
        }
    }`;
    
    const ADD_TO_CART_MUTATION = `mutation checkoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
            checkout {
                id
                webUrl
                totalPriceV2 {
                    amount
                    currencyCode
                }
                totalTaxV2 {
                    amount
                    currencyCode
                }
                lineItems(first: 5) {
                    edges {
                        node {
                            title
                            quantity
                            variant {
                                priceV2 {
                                    amount
                                    currencyCode
                                }
                                image {
                                    src
                                }
                            }
                        }
                    }
                }
            }
            checkoutUserErrors {
                code
                field
                message
            }
        }
    }`;

    const atcButton = document.getElementById('atc-button');
    const checkoutButton = document.getElementById('checkout-button');
    const minusSelector = document.getElementById('minus-selector');
    const plusSelector = document.getElementById('plus-selector');
    const itemQuantity = document.getElementById('item-quantity');
    const cartDrawer = document.querySelector('.cart-drawer');
    const bgLayer = document.querySelector('.cart-drawer-bg');

    let cartItems = [];
    let quantity = 1;

   // Retrieve the checkout object from local storage
let checkout = localStorage.getItem('checkout');
if (checkout) {
    checkout = JSON.parse(checkout);
    fetchCompareAtPrice(checkout); // Fetch the compare-at price using the stored checkout object
}

    // Retrieve cart items from local storage
const storedCartItems = localStorage.getItem('cartItems');
if (storedCartItems) {
    cartItems = JSON.parse(storedCartItems);
    quantity = cartItems[0]?.quantity || 0; // Update the quantity based on stored items
} else {
    cartItems = []; // Initialize the cartItems array as empty if it's not in local storage
    quantity = 0; // Initialize the quantity as 0
}

    
    // Retrieve the variant object from local storage
let variant = localStorage.getItem('variant');
if (variant) {
    variant = JSON.parse(variant);
    // Use the variant object as needed
}

    function updateCart() {
        const variantId = "48217283101021";
        const globalId = btoa(`gid://shopify/ProductVariant/${variantId}`);
        const variables = {
            input: {
                lineItems: [{ variantId: globalId, quantity: quantity }]
            }
        };

        fetch("https://4bdc87-2.myshopify.com/api/2023-07/graphql.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Storefront-Access-Token": "449cec3ee113da55bcb55d5f4025ab90"
            },
            body: JSON.stringify({
                query: ADD_TO_CART_MUTATION,
                variables
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.data.checkoutCreate.checkoutUserErrors.length > 0) {
                console.log('Checkout creation failed with the following errors:', data.data.checkoutCreate.checkoutUserErrors);
                return;
            }

            const checkout = data.data.checkoutCreate.checkout;
            localStorage.setItem('checkout', JSON.stringify(checkout)); // Store the checkout object

            const variant = checkout.lineItems.edges[0].node.variant; // Assuming lineItem is the relevant item
            localStorage.setItem('variant', JSON.stringify(variant)); // Store the variant object

            // Fetch the compare-at price and then update the cart display
            fetchCompareAtPrice(checkout);

            // Update the checkout button URL
            const checkoutURL = checkout.webUrl;
            checkoutButton.href = checkoutURL;
            localStorage.setItem('checkoutURL', checkoutURL); // Store the checkout URL

            // Open the cart drawer
            toggleCart();
        });
        updateGiftDisplay();
        // Update the cart state immediately after adding an item to the cart
        updateCartState();
    }

    atcButton.addEventListener('click', function() {
        // Check if the product is already in the cart
        const existingItem = cartItems.find(item => item.variantId === "48217283101021");
        if (existingItem) {
            existingItem.quantity++; // Increase the quantity if the product is already in the cart
            quantity = existingItem.quantity; // Update the quantity variable
        } else {
            cartItems.push({ variantId: "48217283101021", quantity: 1 }); // Add the product normally if it's not in the cart
            quantity = 1; // Set the quantity variable to 1
        }
        localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Store the cart items
        updateGiftDisplay();
        fetchCompareAtPrice(checkout);
        updateCart();
    });

    function fetchCompareAtPrice(checkout) {
        if (!checkout) return; // Exit if the checkout object is undefined

        const globalId = btoa(`gid://shopify/ProductVariant/48217283101021`);
        fetch("https://4bdc87-2.myshopify.com/api/2023-07/graphql.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Storefront-Access-Token": "449cec3ee113da55bcb55d5f4025ab90"
            },
            body: JSON.stringify({
                query: VARIANT_QUERY.replace("48217283101021", globalId)
            })
        })
        .then(response => response.json())
        .then(data => {
            const compareAtPrice = data.data.node.compareAtPriceV2.amount;
            updateCartDisplay(checkout, compareAtPrice); // Call updateCartDisplay here
        });
    }

    function toggleCart() {
        cartDrawer.style.right = '0'; // Slide the cart onto the screen
        bgLayer.style.height = '100vh'; // Expand the background layer
        bgLayer.style.opacity = '1'; // Make the background layer fully opaque
    }

    minusSelector.addEventListener('click', function() {
    if (quantity > 1) {
        quantity--;
        cartItems[0].quantity = quantity; // Update the quantity in the cartItems array
        localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Store the updated cartItems
        itemQuantity.textContent = quantity;
        updateCart();
        updateGiftDisplay();
    }
});

    plusSelector.addEventListener('click', function() {
    quantity++;
    cartItems[0].quantity = quantity; // Update the quantity in the cartItems array
    localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Store the updated cartItems
    itemQuantity.textContent = quantity;
    updateCart();
    updateGiftDisplay();
});

  const gift1Div = document.getElementById('gift-1');
  const gift1Name = document.getElementById('gift-1-name');
  const nogift1 = document.getElementById('nogift-1')

  function updateGiftDisplay() {
    if (quantity >= 1) {
        gift1Div.style.display = 'block'; // Show the gift div
        gift1Name.style.display = 'block';
        nogift1.style.display = 'none';
    } else {
        gift1Div.style.display = 'none'; // Hide the gift div
    }
}

    function updateCartState() {
        const emptyCart = document.getElementById('empty-cart');
        const cartItem = document.querySelector('.cart-item');

        if (cartItems.length === 0 || cartItems[0].quantity === 0) {
            emptyCart.style.display = 'block';
            cartItem.style.display = 'none';
        } else {
            emptyCart.style.display = 'none';
            cartItem.style.display = 'block';
        }
    }

    function updateCartDisplay(checkout, compareAtPrice) {
        const itemImage = document.getElementById('item-image');
        const itemName = document.getElementById('item-name');
        const itemPriceElement = document.getElementById('item-price');
        const itemComparePriceElement = document.getElementById('item-compare-price');
        const finalPrice = document.getElementById('final-price');
        const totalComparePrice = document.getElementById('total-compare-price');

        const lineItem = checkout.lineItems.edges[0].node;
        const itemPrice = parseFloat(lineItem.variant.priceV2.amount);

        // Update the item image, name, price, and quantity
        itemImage.src = lineItem.variant.image.src;
        itemName.textContent = lineItem.title;
        itemPriceElement.textContent = (itemPrice * quantity).toFixed(2);
        itemComparePriceElement.textContent = (compareAtPrice * quantity).toFixed(2);
        itemQuantity.textContent = quantity;

        // Update the final price and total compare price
        finalPrice.textContent = checkout.totalPriceV2.amount;
        totalComparePrice.textContent = (compareAtPrice * quantity).toFixed(2); // Regular price as the main item's compare-at price
        
    }

    function resetCartDisplay() {
    const finalPrice = document.getElementById('final-price');
    const totalComparePrice = document.getElementById('total-compare-price');

    // Reset the final price and total compare price to 0
    finalPrice.textContent = '0.00';
    totalComparePrice.textContent = '0.00';
}

    document.getElementById('remove-button').addEventListener('click', function() {
    // Clear the specific item from the cart
    cartItems = [];
    quantity = 0; // Reset the quantity to 0
    localStorage.removeItem('cartItems'); // Clear the item from local storage
    localStorage.removeItem('checkoutURL'); // Clear the checkout URL from local storage
    localStorage.removeItem('checkout'); // Clear the stored checkout object
    localStorage.removeItem('variant'); // Clear the stored variant object
    checkoutButton.href = ''; // Clear the checkout button URL

    updateGiftDisplay();
    updateCartState(); // Update the cart state
    resetCartDisplay(); // Reset the cart display
});
  
    // Call this initially to set up the correct display
    updateGiftDisplay();
    updateCartState();
if (checkout) {
    fetchCompareAtPrice(checkout); // Fetch the compare-at price using the stored checkout object
}
});
