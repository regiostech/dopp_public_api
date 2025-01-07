// Custom script I wrote for using DOPP API to display discounts within quick order forms...
function initQuickOrderDiscounts() {
  // You can edit these to control the behavior.
  const settings = {
    // Whether to add a sale badge to each discounted variant's price in the quick order form
    showBadge: false,
    // Whether to show a discount description below each discounted variant's price.
    showDescription: false,
    // How long (in ms) to wait after the Trade theme reloads a row to display discounted prices again.
    delay: 1000,
  };

  if (!window.RegiosDOPP_ProductPage) {
    console.error('"Product Page Discount" app block is required to display discounts within the quick order form.');
    return;
  }
  
  const updateQuickOrderDiscounts = async (api) => {
    let anyObserverFired = false;
    
    // Update each row      
    for (const variant of window.RegiosDOPP_ProductPage.variants) {
      const quickOrderListRowSelector = `.variant-item[data-variant-id="${variant.id}"]`;
      const quickOrderListRow = document.querySelector(quickOrderListRowSelector);
      if (!quickOrderListRow) {
        console.error(`Quick order list row for variant ${variant.id} not found: ${quickOrderListRowSelector}`);
        return;
      }
      
      const result = await api.calculateDiscountedPrices({
        ...window.RegiosDOPP_ProductPage,
        variantId: variant.id,
        // We are showing unit prices, so don't multiply by quantity
        // quantity,
        quantity: 1,
      });
      console.log(`Result for variant ${variant.id}`, result);

      // Display the discounted prices. The pricing elements in the quick order list are different from on the
      // product/collection page, so we have to implement this manually.
      const {salePrice, regularPrice, description, badge} = result;
      const discountWasApplied = salePrice.amount < regularPrice.amount;
      const variantItemPrice = quickOrderListRow.querySelector('.variant-item__price');

      if (!variantItemPrice) {
        console.error(`Quick order list row for variant ${variant.id} lacks a .variant-item__price`, quickOrderListRow);
      }

      if (!discountWasApplied) {
        variantItemPrice.innerHTML = `
        <span class="price" data-created-by-regios-quick-order-form-hook>${salePrice.formatted}/ea</span>
        `;
      } else {
        variantItemPrice.innerHTML = `
        <dl class="variant-item__discounted-prices">
          <dt class="visually-hidden">
            Regular price
          </dt>
          <dd>
            <s class="variant-item__old-price price price--end" data-created-by-regios-quick-order-form-hook>
              ${regularPrice.formatted}
            </s>
          </dd>
          <dt class="visually-hidden">
            Sale price
          </dt>
          <dd class="price"><span class="price" data-created-by-regios-quick-order-form-hook>${salePrice.formatted}/ea</span></dd>
          
        </dl>
        `;

        if (settings.showBadge) {
          const badgeEl = document.createElement('span');
          badgeEl.outerHTML = `
          <span class="badge price__badge-sale color-scheme-5" style="${badge.css}; margin-left: 1em">
            ${badge.html}
          </span>
          `;
          variantItemPrice.append(badgeEl);
        }
      }

      if (settings.showDescription) {
        const doppDesc = variantItemPrice.querySelector('.regios-dopp-description') || document.createElement('div');
        doppDesc.setAttribute('class', 'regios-dopp-description');
        doppDesc.innerHTML = description.html;
        doppDesc.style.cssText = description.css;
        variantItemPrice.append(doppDesc);
      }

      console.info(`Quick order list row for variant ${variant.id} prices updated`, { discountWasApplied, quickOrderListRow, result, variantItemPrice });

      // The theme completely overwrites the table contents when the quantity is updated. Let's listen for this.
      const variantItemPrice = quickOrderListRow.querySelector('.variant-item__price');
      const mo = new MutationObserver((mutations, observer) => {
        if (anyObserverFired) {
          observer.disconnect();
          return;
        }
        
        for (const mutation of mutations) {
          if ('removedNodes' in mutation) {
            const {removedNodes} = mutation;
            
            // Prevent infinite loops by only firing if an element we created was removed.
            const triggerSelector = '[data-created-by-regios-quick-order-form-hook]';
            // const trigger = Array.from(mutation.removedNodes).find((el) => el instanceof Element && el.matches(triggerSelector));
            const trigger = Array.from(mutation.removedNodes).includes(variantItemPrice);

            if (trigger) {     
              // Only listen once.
              observer.disconnect();
              anyObserverFired = true;
              // Update discounts on the page.
              console.info(`Quick order form {{ section.id }}-{{ product.id }} price for variant ${variant.id} reloaded`, { variant, mutations, observer, trigger });
              
              // Try to avoid race condition by delaying this operation.
              setTimeout(() => {
                updateQuickOrderDiscounts(api);
              }, settings.delay);
              return;
            } else {
              // console.info(`Quick order form {{ section.id }}-{{ product.id }} did not reload`, { removedNodes: Array.from(removedNodes) });
            }
          }
        }
      });
      mo.observe(
        quickOrderListRow,
        {
          childList: true,
          subtree: true,
        }
      );
    }
  }

  // Make sure this logic runs after the DOPP API has loaded.
  if (window.RegiosDOPP?.api?.v0) {
    updateQuickOrderDiscounts(window.RegiosDOPP.api.v0);
  } else {
    window.addEventListener("regios-dopp:api-initialized", (e) => {
      updateQuickOrderDiscounts(e.detail.api);
    });
  }
}

// Make sure this runs after the page loads.
if (document.readyState !== "loading") {
  initQuickOrderDiscounts();
} else {
  document.addEventListener("DOMContentLoaded", initQuickOrderDiscounts);
}
