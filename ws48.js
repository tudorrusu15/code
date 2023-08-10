document.addEventListener('DOMContentLoaded', function() {
    
    const mainProductVariantId = document.getElementById('main-product-variant-id').value;
  console.log('mainProductVariantIdq', mainProductVariantId);
    const shopifyAccessToken = document.getElementById('shopify-access-token').value;
    const freeShippingCode = document.getElementById('free-shipping-code').value; // Free shipping code for gift 1

    const gift2VariantId = document.getElementById('gift-2-variant-id').value;
    const gift3VariantId = document.getElementById('gift-3-variant-id').value;
    const gift4VariantId = document.getElementById('gift-4-variant-id').value;

    const VARIANT_QUERY = `{
        node(id: "${mainProductVariantId}") {
            ... on ProductVariant {
                compareAtPriceV2 {
                    amount
                    currencyCode
                }
            }
        }
    }`;

    const GIFT_2_QUERY = `{
    node(id: "${gift2VariantId}") {
        ... on ProductVariant {
            compareAtPriceV2 {
                amount
                currencyCode
            }
            priceV2 {
                amount
                currencyCode
            }
            product {
                title
            }
            image {
                src
            }
        }
    }
}`;

    const GIFT_3_QUERY = `{
    node(id: "${gift3VariantId}") {
        ... on ProductVariant {
            compareAtPriceV2 {
                amount
                currencyCode
            }
            priceV2 {
                amount
                currencyCode
            }
            product {
                title
            }
            image {
                src
            }
        }
    }
}`;

  

  const GIFT_4_QUERY = `{
    node(id: "${gift4VariantId}") {
        ... on ProductVariant {
            compareAtPriceV2 {
                amount
                currencyCode
            }
            priceV2 {
                amount
                currencyCode
            }
            product {
                title
            }
            image {
                src
            }
        }
    }
}`;

  function fetchGift2Details() {
    const globalId = btoa(`gid://shopify/ProductVariant/${gift2VariantId}`);
    fetch("https://4bdc87-2.myshopify.com/api/2023-07/graphql.json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": shopifyAccessToken
        },
        body: JSON.stringify({
            query: GIFT_2_QUERY.replace(gift2VariantId, globalId)
        })
    })
    .then(response => response.json())
    .then(data => {
      console.log("Response data:", data);
        const variant = data.data.node;
      console.log("Variant object:", variant);
        const compareAtPrice = variant.compareAtPriceV2.amount;
        const price = variant.priceV2.amount;
        const name = variant.product.title;
        const imageUrl = variant.image.src;

        // You can now use these details to update the display or perform other actions

        const compareAtPriceValue = variant.compareAtPriceV2 ? variant.compareAtPriceV2.amount : variant.priceV2.amount;
        document.getElementById('gift-2-compare-price').value = compareAtPriceValue; // Store the compare-at price for gift 2
        updateGiftUI('gift-image-2', 'gift-name-2', variant); // Call updateGiftUI here
    });
}

  function fetchGift3Details() {
    const globalId = btoa(`gid://shopify/ProductVariant/${gift3VariantId}`);
    fetch("https://4bdc87-2.myshopify.com/api/2023-07/graphql.json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": shopifyAccessToken
        },
        body: JSON.stringify({
            query: GIFT_3_QUERY.replace(gift3VariantId, globalId)
        })
    })
    .then(response => response.json())
    .then(data => {
        const variant = data.data.node;
        const compareAtPrice = variant.compareAtPriceV2.amount;
        const price = variant.priceV2.amount;
        const name = variant.product.title;
        const imageUrl = variant.image.src;

        // You can now use these details to update the display or perform other actions

        const compareAtPriceValue = variant.compareAtPriceV2 ? variant.compareAtPriceV2.amount : variant.priceV2.amount;
        document.getElementById('gift-3-compare-price').value = compareAtPriceValue; // Store the compare-at price for gift 2
        updateGiftUI('gift-image-3', 'gift-name-3', variant); // Call updateGiftUI here
    });
}

  function fetchGift4Details() {
    const globalId = btoa(`gid://shopify/ProductVariant/${gift4VariantId}`);
    fetch("https://4bdc87-2.myshopify.com/api/2023-07/graphql.json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": shopifyAccessToken
        },
        body: JSON.stringify({
            query: GIFT_4_QUERY.replace(gift4VariantId, globalId)
        })
    })
    .then(response => response.json())
    .then(data => {
        const variant = data.data.node;
        const compareAtPrice = variant.compareAtPriceV2.amount;
        const price = variant.priceV2.amount;
        const name = variant.product.title;
        const imageUrl = variant.image.src;

        // You can now use these details to update the display or perform other actions

        const compareAtPriceValue = variant.compareAtPriceV2 ? variant.compareAtPriceV2.amount : variant.priceV2.amount;
        document.getElementById('gift-4-compare-price').value = compareAtPriceValue; // Store the compare-at price for gift 2
        updateGiftUI('gift-image-4', 'gift-name-4', variant); // Call updateGiftUI here
    });
}

  function updateGiftUI(imageId, nameId, variant) {
    if (!variant || !variant.product) {
        console.error("Variant or product is undefined");
        return; // Exit the function if variant or product is undefined
    }
    const name = variant.product.title;
    const imageUrl = variant.image.src;

    // Update the image
    const imageElement = document.getElementById(imageId);
    imageElement.src = imageUrl;

    // Update the name
    const nameElement = document.getElementById(nameId);
    nameElement.textContent = name;
}

  function calculateTotalComparePrice(compareAtPrice) {
    const quantityElement = document.getElementById('item-quantity');
    const quantity = parseInt(quantityElement.textContent, 10);
    console.log("compareAtPrice1:", compareAtPrice);
    console.log("quantity:", quantity);

    let totalComparePrice = compareAtPrice * quantity;
    console.log("Initial totalComparePrice:", totalComparePrice);

    if (quantity >= 2) {
        const gift2CompareAtPrice = document.getElementById('gift-2-compare-price').value;
        console.log("gift2CompareAtPrice:", gift2CompareAtPrice);
        totalComparePrice += parseFloat(gift2CompareAtPrice);
    }
    if (quantity >= 3) {
        const gift3CompareAtPrice = document.getElementById('gift-3-compare-price').value;
        console.log("gift3CompareAtPrice:", gift3CompareAtPrice);
        totalComparePrice += parseFloat(gift3CompareAtPrice);
    }
    if (quantity >= 4) {
        const gift4CompareAtPrice = document.getElementById('gift-4-compare-price').value;
        console.log("gift4CompareAtPrice:", gift4CompareAtPrice);
        totalComparePrice += parseFloat(gift4CompareAtPrice);
    }

    console.log("Final totalComparePrice:", totalComparePrice);

    // Return the calculated value
    return totalComparePrice;
}
  
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
        const variantId = mainProductVariantId;
      console.log('variantId', mainProductVariantId);
        const globalId = btoa(`gid://shopify/ProductVariant/${variantId}`);
      console.log('globalId', globalId);
        
        // Create line items based on quantity
        let lineItems = [{ variantId: btoa(`gid://shopify/ProductVariant/${variantId}`), quantity: quantity }];
        if (quantity >= 2) {
    lineItems.push({ variantId: btoa(`gid://shopify/ProductVariant/${gift2VariantId}`), quantity: 1 }); // Add gift 2
}
if (quantity >= 3) {
    lineItems.push({ variantId: btoa(`gid://shopify/ProductVariant/${gift3VariantId}`), quantity: 1 }); // Add gift 3
}
if (quantity >= 4) {
    lineItems.push({ variantId: btoa(`gid://shopify/ProductVariant/${gift4VariantId}`), quantity: 1 }); // Add gift 4
}

        const variables = {
            input: {
                lineItems: lineItems,
            }
        };

        fetch("https://4bdc87-2.myshopify.com/api/2023-07/graphql.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Storefront-Access-Token": shopifyAccessToken
            },
            body: JSON.stringify({
                query: ADD_TO_CART_MUTATION,
                variables
            })
        })
        .then(response => response.json())
        .then(data => {
            if (!data.data || !data.data.checkoutCreate) {
        console.error('Unexpected response:', data);
        return;
    }
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
        const existingItem = cartItems.find(item => item.variantId === mainProductVariantId);
        if (existingItem) {
            existingItem.quantity++; // Increase the quantity if the product is already in the cart
            quantity = existingItem.quantity; // Update the quantity variable
        } else {
            cartItems.push({ variantId: mainProductVariantId, quantity: 1 }); // Add the product normally if it's not in the cart
            quantity = 1; // Set the quantity variable to 1
        }
        localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Store the cart items
        updateGiftDisplay();
        fetchCompareAtPrice(checkout);
        updateCart();
    });

    function fetchCompareAtPrice(checkout, imageId, nameId, variant) {
    if (!checkout) return; // Exit if the checkout object is undefined

    const globalId = btoa(`gid://shopify/ProductVariant/${mainProductVariantId}`);
    fetch("https://4bdc87-2.myshopify.com/api/2023-07/graphql.json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": shopifyAccessToken
        },
        body: JSON.stringify({
            query: VARIANT_QUERY.replace(mainProductVariantId, globalId)
        })
    })
    .then(response => response.json())
    .then(data => {
        const compareAtPrice = data.data.node.compareAtPriceV2.amount;
        calculateTotalComparePrice(compareAtPrice);
        updateCartDisplay(checkout, compareAtPrice)
        updateGiftUI(imageId, nameId, variant)
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
  const gift1Name = document.getElementById('gift-name-1');
  const nogift1 = document.getElementById('nogift-1')
  const gift2Div = document.getElementById('gift-2');
  const gift2Name = document.getElementById('gift-name-2');
  const nogift2 = document.getElementById('nogift-2');
  const gift3Div = document.getElementById('gift-3');
  const gift3Name = document.getElementById('gift-name-3');
  const nogift3 = document.getElementById('nogift-3');
  const gift4Div = document.getElementById('gift-4');
  const gift4Name = document.getElementById('gift-name-4');
  const nogift4 = document.getElementById('nogift-4');

  function updateGiftDisplay() {
    // Gift 1
    if (quantity >= 1) {
        gift1Div.style.display = 'block';
        gift1Name.style.display = 'block';
        nogift1.style.display = 'none';
    } else {
        gift1Div.style.display = 'none';
        gift1Name.style.display = 'none';
        nogift1.style.display = 'block';
    }

    // Gift 2
    if (quantity >= 2) {
        gift2Div.style.display = 'block';
        gift2Name.style.display = 'block';
        nogift2.style.display = 'none';
    } else {
        gift2Div.style.display = 'none';
        gift2Name.style.display = 'none';
        nogift2.style.display = 'block';
    }

    // Gift 3
    if (quantity >= 3) {
        gift3Div.style.display = 'block';
        gift3Name.style.display = 'block';
        nogift3.style.display = 'none';
    } else {
        gift3Div.style.display = 'none';
        gift3Name.style.display = 'none';
        nogift3.style.display = 'block';
    }

    // Gift 4
    if (quantity >= 4) {
        gift4Div.style.display = 'block';
        gift4Name.style.display = 'block';
        nogift4.style.display = 'none';
    } else {
        gift4Div.style.display = 'none';
        gift4Name.style.display = 'none';
        nogift4.style.display = 'block';
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
        const quantityElement = document.getElementById('item-quantity');
        const quantity = parseInt(quantityElement.textContent, 10);
        console.log('Checkout object:', checkout);
        console.log('compareAtPrice:', compareAtPrice);
        console.log('quantity2:', quantity);
        const itemImage = document.getElementById('item-image');
        const itemName = document.getElementById('item-name');
        const itemPriceElement = document.getElementById('item-price');
        const itemComparePriceElement = document.getElementById('item-compare-price');
        const finalPrice = document.getElementById('final-price');
        const totalComparePriceElement = document.getElementById('total-compare-price');
        const totalComparePriceValue = calculateTotalComparePrice(compareAtPrice);

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
        totalComparePriceElement.textContent = totalComparePriceValue.toFixed(2);
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
    localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Update the cart items in local storage
    localStorage.removeItem('checkoutURL'); // Clear the checkout URL from local storage
    localStorage.removeItem('checkout'); // Clear the stored checkout object
    localStorage.removeItem('variant'); // Clear the stored variant object
    checkoutButton.href = ''; // Clear the checkout button URL

    updateGiftDisplay(); // Update the gift display
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
