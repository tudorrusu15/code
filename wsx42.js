document.addEventListener('DOMContentLoaded', function() {

    let cartItems = [];
    let quantity = 1;
    let totalComparePrice = 0.00;
    let compareAtPrice = document.getElementById('main-product-compare-price');

    // Retrieve cart items from local storage
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
        cartItems = JSON.parse(storedCartItems);
        quantity = cartItems[0]?.quantity || 0; // Update the quantity based on stored items
    } else {
        cartItems = []; // Initialize the cartItems array as empty if it's not in local storage
        quantity = 0; // Initialize the quantity as 0
    }

  // Find the HTML element that displays the quantity
const quantityElement = document.getElementById('item-quantity');

// Update the content of the quantity element
quantityElement.textContent = quantity;

    // Retrieve the totalComparePrice from local storage
    const storedTotalComparePrice = localStorage.getItem('totalComparePrice');
    if (storedTotalComparePrice) {
        totalComparePrice = localStorage.getItem('totalComparePrice');
    } else {
        totalComparePrice = 0.00;
    }

    // Retrieve the checkout URL from local storage
const checkoutURL = localStorage.getItem('checkoutURL');

// Get the checkout button element
const checkoutButton = document.getElementById('checkout-button');

// If the checkout URL is available, set it as the href attribute of the checkout button
if (checkoutURL) {
    checkoutButton.href = checkoutURL;
} else {
    checkoutButton.href = ''; // Leave it empty if no checkout URL is available
}

    const gift2VariantId = document.getElementById('gift-2-variant-id').value;
    const gift2Price = document.getElementById('gift-2-price').value;
    const gift2NameValue = document.getElementById('gift-2-name').value;
    const gift2ImageValue = document.getElementById('gift-2-image').value;
  
    const gift3VariantId = document.getElementById('gift-3-variant-id').value;
    const gift3Price = document.getElementById('gift-3-price').value;
    const gift3NameValue = document.getElementById('gift-3-name').value;
    const gift3ImageValue = document.getElementById('gift-3-image').value;
  
    const gift4VariantId = document.getElementById('gift-4-variant-id').value;
    const gift4Price = document.getElementById('gift-4-price').value;
    const gift4NameValue = document.getElementById('gift-4-name').value;
    const gift4ImageValue = document.getElementById('gift-4-image').value;
  
    const mainProductVariantId = document.getElementById('main-product-variant-id').value;
    const shopifyAccessToken = document.getElementById('shopify-access-token').value;
    const additionalDiscountCodeElement = document.getElementById('coupon-code');
    const additionalDiscountCode = additionalDiscountCodeElement ? additionalDiscountCodeElement.value : '';
    const freeShippingCode = document.getElementById('free-shipping-code').value;

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

  function updateGiftUI(giftNumber) {
    // Fetching the values directly from the hidden input fields
    const variantIdElementId = `gift-${giftNumber}-variant-id`;
    const priceElementId = `gift-${giftNumber}-price`;
    const nameElementId = `gift-${giftNumber}-name`;
    const imageElementId = `gift-${giftNumber}-image`;

    const variantId = document.getElementById(variantIdElementId).value;
    const price = parseFloat(document.getElementById(priceElementId).value);
    const name = document.getElementById(nameElementId).value;
    const imageUrl = document.getElementById(imageElementId).value;

    // Update the image
    const imageElement = document.getElementById(imageElementId);
    if (imageElement) {
        imageElement.src = imageUrl;
    }

    // Update the name
    const nameElement = document.getElementById(nameElementId);
    if (nameElement) {
        nameElement.textContent = name;
    }
}

  function calculateTotalComparePrice(compareAtPrice) {
    const quantityElement = document.getElementById('item-quantity');
    const quantity = parseInt(quantityElement.textContent, 10);

    let totalComparePrice = compareAtPrice * quantity;

    if (quantity >= 2) {
        const gift2Price = parseFloat(document.getElementById('gift-2-price').value);
        totalComparePrice += gift2Price;
    }
    if (quantity >= 3) {
        const gift3Price = parseFloat(document.getElementById('gift-3-price').value);
        totalComparePrice += gift3Price;
    }
    if (quantity >= 4) {
        const gift4Price = parseFloat(document.getElementById('gift-4-price').value);
        totalComparePrice += gift4Price;
    }

    // Store the totalComparePrice in local storage
    localStorage.setItem('totalComparePrice', totalComparePrice);
    
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

const APPLY_DISCOUNT_CODE_MUTATION = `
  mutation checkoutDiscountCodeApplyV2($checkoutId: ID!, $discountCode: String!) {
    checkoutDiscountCodeApplyV2(checkoutId: $checkoutId, discountCode: $discountCode) {
      checkout {
        id
        webUrl
        totalPriceV2 {
          amount
          currencyCode
        }
        discountApplications(first: 10) {
          edges {
            node {
              value {
                ... on MoneyV2 {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
      checkoutUserErrors {
        message
        code
        field
      }
    }
  }
`;
const atcButton = document.getElementById('atc-button');
const minusSelector = document.getElementById('minus-selector');
const plusSelector = document.getElementById('plus-selector');
const itemQuantity = document.getElementById('item-quantity');
const cartDrawer = document.querySelector('.cart-drawer');
const bgLayer = document.querySelector('.cart-drawer-bg');

function updateCart() {
  const variantId = mainProductVariantId;
  const globalId = btoa(`gid://shopify/ProductVariant/${variantId}`);
  
  // Create line items based on quantity
  let lineItems = [{ variantId: btoa(`gid://shopify/ProductVariant/${variantId}`), quantity: quantity }];
  if (quantity >= 2) lineItems.push({ variantId: btoa(`gid://shopify/ProductVariant/${gift2VariantId}`), quantity: 1 });
  if (quantity >= 3) lineItems.push({ variantId: btoa(`gid://shopify/ProductVariant/${gift3VariantId}`), quantity: 1 });
  if (quantity >= 4) lineItems.push({ variantId: btoa(`gid://shopify/ProductVariant/${gift4VariantId}`), quantity: 1 });

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
    console.log('ATC Result:', data);
    if (!data.data || !data.data.checkoutCreate) {
      console.error('Unexpected response:', data);
      return;
    }
    if (data.data.checkoutCreate.checkoutUserErrors.length > 0) {
      return;
    }

    let checkout = data.data.checkoutCreate.checkout;

    const variant = checkout.lineItems.edges[0].node.variant;
    localStorage.setItem('variant', JSON.stringify(variant));

    let checkoutURL = checkout.webUrl;

    // Apply discount codes
    const discountCodes = [additionalDiscountCode, freeShippingCode].filter(Boolean);

    const applyDiscountCode = (index) => {
      if (index >= discountCodes.length) {
        // All discount codes have been applied
        checkoutButton.href = checkoutURL;
        localStorage.setItem('checkoutURL', checkoutURL);
        toggleCart();
        return;
      }

      const discountCode = discountCodes[index];

      fetch("https://4bdc87-2.myshopify.com/api/2023-07/graphql.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": shopifyAccessToken
        },
        body: JSON.stringify({
          query: APPLY_DISCOUNT_CODE_MUTATION,
          variables: {
            checkoutId: checkout.id,
            discountCode
          }
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Discount Code Application Result:', data);
        if (data.data && data.data.checkoutDiscountCodeApplyV2 && data.data.checkoutDiscountCodeApplyV2.checkout) {
          // Update checkout URL with the applied discount
          checkoutURL = data.data.checkoutDiscountCodeApplyV2.checkout.webUrl;
          checkout.totalPriceV2 = data.data.checkoutDiscountCodeApplyV2.checkout.totalPriceV2;
        }
        
        localStorage.setItem('checkout', JSON.stringify(checkout));

        // Apply the next discount code
        applyDiscountCode(index + 1);
      });
    };

    // Start applying discount codes
    applyDiscountCode(0);

    checkoutButton.href = checkoutURL;
    localStorage.setItem('checkoutURL', checkoutURL);

    toggleCart();
  });
  calculateTotalComparePrice(compareAtPrice);
  updateCartDisplay(checkout, compareAtPrice);
  updateGiftUI(2);
  updateGiftUI(3);
  updateGiftUI(4);
  updateGiftDisplay();
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
      // Find the HTML element that displays the quantity
    const quantityElement = document.getElementById('item-quantity');

    // Update the content of the quantity element
    quantityElement.textContent = quantity;

        localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Store the cart items
        updateGiftDisplay();
        updateCart();
    });

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
    const itemImage = document.getElementById('item-image');
    const itemName = document.getElementById('item-name');
    const itemPriceElement = document.getElementById('item-price');
    const itemComparePriceElement = document.getElementById('item-compare-price');
    const itemSavings = document.getElementById('total-savings');
    const finalPriceElement = document.getElementById('final-price');
    const totalComparePriceElement = document.getElementById('total-compare-price');
    const totalComparePriceValue = calculateTotalComparePrice(compareAtPrice);

    const lineItem = checkout.lineItems.edges[0].node;
    const itemPrice = parseFloat(lineItem.variant.priceV2.amount);
    const finalPrice = parseFloat(checkout.totalPriceV2.amount);

    // Calculate the total savings as the difference between the total compare price and the final price
    const totalSavings = totalComparePriceValue - finalPrice;
    const currencyCode = checkout.totalPriceV2.currencyCode;

    // Update the cart number with the quantity of the main product
    const cartNumberElement = document.getElementById('cart-number'); 

    // Get the quantity of the first product in the list
    const mainProductQuantity = checkout.lineItems.edges[0].node.quantity;

    cartNumberElement.textContent = mainProductQuantity;

    // Update the item image, name, price, and quantity
    itemImage.src = lineItem.variant.image.src;
    itemName.textContent = lineItem.title;
    itemPriceElement.textContent = `${currencyCode} ${(itemPrice * quantity).toFixed(2)}`;
    itemComparePriceElement.textContent = `${currencyCode} ${(compareAtPrice * quantity).toFixed(2)}`;
    itemQuantity.textContent = quantity;

    // Update the final price, total compare price, and total savings
    finalPriceElement.textContent = `${currencyCode} ${finalPrice.toFixed(2)}`;
    totalComparePriceElement.textContent = `${currencyCode} ${totalComparePriceValue.toFixed(2)}`;
    itemSavings.textContent = `${currencyCode} ${totalSavings.toFixed(2)}`
}

    function resetCartDisplay() {
    const finalPrice = document.getElementById('final-price');
    const totalComparePrice = document.getElementById('total-compare-price');
    const itemSavings = document.getElementById('total-savings');

    // Reset the final price and total compare price to 0
    finalPrice.textContent = '0.00';
    totalComparePrice.textContent = '0.00';
    itemSavings.textContent = '0.00';
}

    document.getElementById('remove-button').addEventListener('click', function() {
    // Clear the specific item from the cart
    cartItems = [];
    quantity = 0; // Reset the quantity to 0
    localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Update the cart items in local storage
    localStorage.removeItem('checkoutURL'); // Clear the checkout URL from local storage
    localStorage.removeItem('checkout'); // Clear the stored checkout object
    localStorage.removeItem('variant'); // Clear the stored variant object
    localStorage.removeItem('totalComparePrice');
    checkoutButton.href = ''; // Clear the checkout button URL

    updateGiftDisplay(); // Update the gift display
    updateCartState(); // Update the cart state
    resetCartDisplay(); // Reset the cart display
});

    // Retrieve the checkout object from local storage
    let checkout = localStorage.getItem('checkout');
    if (checkout) {
        checkout = JSON.parse(checkout);
    }

    // Retrieve the variant object from local storage
    let variant = localStorage.getItem('variant');
    if (variant) {
        variant = JSON.parse(variant);
        // Use the variant object as needed
    }
  
    // Call this initially to set up the correct display
    updateGiftDisplay();
    updateCartState();
if (checkout) {
}
});
