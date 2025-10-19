async function addProductsToCart(page, productIds = [], delay = 0) {
  for (const id of productIds) {
    await page.click(`#add-to-cart-${id}`);
    if (delay > 0) await page.waitForTimeout(delay);
  }
}

module.exports = { addProductsToCart };
