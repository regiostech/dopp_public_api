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
  calculateDiscountedPrices: (
    args: DOPPPublicApiCalculateDiscountedPricesArgs,
  ) => Promise<DOPPPublicApiCalculateDiscountedPricesResult>;

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
    calculateDiscountedPrices: (
      args?: DOPPPublicApiProductPageCalculateDiscountedPricesArgs,
    ) => Promise<DOPPPublicApiCalculateDiscountedPricesResult>;
  };
};

/**
 * The arguments to the {@link DOPPPublicApiV0.calculateDiscountedPrices} function.
 */
export type DOPPPublicApiCalculateDiscountedPricesArgs = {
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
 * An error thrown by the public API.
 */
export class DOPPPublicApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DOPPPublicApiError";
  }
}


/**
 * An error thrown by the public API.
 */
declare class DOPPPublicApiError extends Error;
