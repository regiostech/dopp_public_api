/**
 * A public API that our customers can use to implement their own custom
 * flows built on top of our app.
 */
export type DOPPPublicApi = {
    /**
     * An experimental first version of the public API.
     */
    v0?: DOPPPublicApiV0;
};
/**
 * An experimental first version of the public API.
 */
export type DOPPPublicApiV0 = {
    /**
     * Calculates the discounted prices for a product.
     *
     * This is available on all pages.
     * @param args {@link DOPPPublicApiCalculateDiscountedPricesArgs}
     * @return Information about the discounted prices, as well as display info.
     */
    calculateDiscountedPrices: (args: DOPPPublicApiCalculateDiscountedPricesArgs) => Promise<DOPPPublicApiCalculateDiscountedPricesResult>;
    /**
     * Gets the list of items in the cart.
     *
     * This is global, and it is assigned one time when the page loads.
     * @returns The list of items in the cart.
     */
    getCartLines: () => Promise<DOPPPublicApiProduct[]>;
    /**
     * Gets the customer, if any.
     *
     * This is global, and it is assigned one time when the page loads.
     * @returns The customer, if logged in. Otherwise, `null`.
     */
    getCustomer: () => Promise<DOPPCustomer | null>;
    /**
     * Allows interop with our "Product Page Discount" app block's calculation
     * features.
     *
     * **Only available on product pages. Requires "Product Page Discount" app
     * block.**
     */
    productPage?: {
        /**
         * Calculates the discounted prices for a product.
         *
         * Because this uses the context of the "Product Page Discount" app block,
         * it can be used without passing in the product ID and variant ID.
         *
         * Also expands discount descriptions.
         */
        calculateDiscountedPrices: (args?: DOPPPublicApiProductPageCalculateDiscountedPricesArgs) => Promise<DOPPPublicApiCalculateDiscountedPricesResult>;
    };
};
/**
 * Information about a product on your store.
 */
export type DOPPPublicApiProduct = {
    /**
     * The product to calculate discounted prices for.
     */
    productId: number;
    /**
     * The product variant to calculate discounted prices for.
     */
    variantId: number;
    /**
     * The numeric IDs of the collections the product belongs to, if any.
     */
    collectionIds?: number[];
    /**
     * The sale price of the product variant.
     */
    regularPriceInCents: number;
    /**
     * The "compare at" price of the product, if any.
     * @default null
     */
    compareAtPriceInCents?: number;
    /**
     * The handle of the product.
     * @default ""
     */
    handle?: string;
    /**
     * The vendor of the product.
     * @default ""
     */
    vendor?: string;
    /**
     * The URL of the product.
     * @default ""
     */
    url?: string;
    /**
     * The quantity of the product in the cart.
     * @default 1
     */
    quantity?: number;
    /**
     * The tags on the product.
     */
    tags?: string[];
    /**
     * The variants of the product.
     *
     * If you do not provide this, the API will use the price of the product
     * itself for all calculations, regardless of the `variantId`.
     */
    variants?: DOPPPublicApiProductVariant[];
};
/**
 * A variant of a product on your store.
 */
export type DOPPPublicApiProductVariant = {
    /**
     * The numerical ID of the variant.
     */
    id: number;
    /**
     * The variant's title.
     */
    title: string;
    /**
     * The variant's price in cents.
     */
    priceInCents: number;
    /**
     * The variant's compare at price, if any, in cents.
     */
    compareAtPriceInCents: number | null;
};
/**
 * The arguments to the {@link DOPPPublicApiV0.calculateDiscountedPrices} function.
 */
export type DOPPPublicApiCalculateDiscountedPricesArgs = DOPPPublicApiProduct & {
    /**
     * The quantity of the product in the cart.
     * @default 1
     */
    quantity?: number;
    /**
     * Overrides information about the signed-in customer for this calculation.
     *
     * * For example, you can set this to `null` to calculate prices as if the
     * customer is a guest.
     * * Or, you can set this to a different customer to calculate prices as if
     * someone else were signed in.
     *
     * You can call `getCustomer` to get the current customer before calling this,
     * in case you just want to modify a few fields.
     *
     * This does NOT globally change the customer for the rest of the page, just
     * for this calculation.
     *
     * If none is provided (or `undefined`), the value of `getCustomer` will be
     * used.
     */
    customer?: Partial<DOPPCustomer> | null;
    /**
     * Overrides the list of other items in the cart.
     *
     * For example, you can use this to simulate a cart that contains the
     * components of a bundle.
     *
     * Or, if you have a discount with a "Check if specific products are in the
     * cart" condition, you can use this to simulate the presence of those
     * products.
     *
     * If none is provided (or `undefined`), the value of `getCartLines` will be
     * used.
     */
    cartLines?: DOPPPublicApiProduct[];
};
/**
 * Arguments for the `calculateDiscountedPrices` function.
 */
export type DOPPPublicApiProductPageCalculateDiscountedPricesArgs = {
    /**
     * The product variant to calculate discounted prices for.
     *
     * Defaults to the default or selected variant on the page.
     */
    variantId?: number;
    /**
     * The quantity of the product in the cart.
     * @default 1
     */
    quantity?: number;
    /**
     * Overrides information about the signed-in customer for this calculation.
     *
     * * For example, you can set this to `null` to calculate prices as if the
     * customer is a guest.
     * * Or, you can set this to a different customer to calculate prices as if
     * someone else were signed in.
     *
     * You can call `getCustomer` to get the current customer before calling this,
     * in case you just want to modify a few fields.
     *
     * This does NOT globally change the customer for the rest of the page, just
     * for this calculation.
     *
     * If none is provided (or `undefined`), the value of `getCustomer` will be
     * used.
     */
    customer?: Partial<DOPPCustomer> | null;
    /**
     * Overrides the list of other items in the cart.
     *
     * For example, you can use this to simulate a cart that contains the
     * components of a bundle.
     *
     * Or, if you have a discount with a "Check if specific products are in the
     * cart" condition, you can use this to simulate the presence of those
     * products.
     *
     * If none is provided (or `undefined`), the value of `getCartLines` will be
     * used.
     */
    cartLines?: DOPPPublicApiProduct[];
};
/**
 * The result of the `calculateDiscountedPrices` function.
 */
export type DOPPPublicApiCalculateDiscountedPricesResult = {
    /**
     * The sale price of the product.
     */
    salePrice: DOPPPublicApiPrice;
    /**
     * The regular price of the product.
     */
    regularPrice: DOPPPublicApiPrice;
    /**
     * The discount description, if any.
     */
    description: DOPPPublicApiDiscountDescription;
    /**
     * The discount badge, if any.
     */
    badge: DOPPPublicApiDiscountDescription;
    /**
     * The discount message, if any.
     */
    discountMessage?: string;
};
/**
 * A price in the public API.
 */
export type DOPPPublicApiPrice = {
    /**
     * The price amount, NOT in cents.
     * @example `10.99`
     */
    amount: number;
    /**
     * The price formatted as a string, using your store's currency settings.
     * @example `$10.99`, `$10.99 CAD`
     */
    formatted: string;
};
/**
 * A discount description in the public API.
 */
export type DOPPPublicApiDiscountDescription = {
    /**
     * The HTML content of the description.
     *
     * May be an empty string if there is no description.
     */
    html: string;
    /**
     * The CSS content of the description.
     *
     * May be an empty string if there is no custom CSS.
     */
    css: string;
};
/**
 * Information about the currently-signed-in customer.
 */
export type DOPPCustomer = {
    /**
     * The customer's numerical ID.
     *
     * @default 0
     */
    id: number;
    /**
     * The number of orders the customer has placed.
     * @default 0
     */
    numberOfOrders: number;
    /**
     * The tags on the customer.
     * @default []
     */
    tags: string[];
    /**
     * The metafields on the customer.
     */
    metafields: (DOPPCustomerMetafield | null)[];
};
/**
 * A metafield on a customer.
 */
export type DOPPCustomerMetafield = {
    /**
     * The GraphQL ID of the metafield.
     */
    id: string;
    /**
     * The key of the metafield.
     */
    key: string;
    /**
     * The namespace of the metafield.
     */
    namespace: string;
    /**
     * The value of the metafield.
     */
    value: string;
};
/**
 * An error thrown by the public API.
 */
export declare class DOPPPublicApiError extends Error {
    constructor(message: string);
}
/**
 * The detail for the `regios-dopp:collection-page:new-items` event.
 *
 * Fire this event when new items are loaded for a collection page, for example,
 * when a user clicks a "Load More" button, or if your collection page has
 * infinite scroll.
 */
export type DOPPCollectionPageNewItemsEventDetail = {
    /**
     * The unique key for the 'Collection Page Discount' app block corresponding
     * to the collection that new items were loaded for.
     * @default 'default'
     */
    uniqueKey?: string;
    /**
     * The new items that were loaded.
     */
    newItems: DOPPPublicApiProduct[];
};
declare global {
    interface Window {
        /**
         * Listens for new items loaded on a collection page.
         *
         * This event should be fired when new items are loaded for a collection
         * page, for example, when a user clicks a "Load More" button, or if your
         * collection page has infinite scroll.
         *
         * @see {@link DOPPCollectionPageNewItemsEventDetail}
         */
        addEventListener(type: "regios-dopp:collection-page:new-items", listener: (event: CustomEvent<DOPPCollectionPageNewItemsEventDetail>) => void): void;
    }
}
