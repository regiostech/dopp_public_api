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
     * Also expands discount descriptions.
     */
    calculateDiscountedPrices: (
      args?: DOPPPublicApiCalculateDiscountedPricesArgs,
    ) => Promise<DOPPPublicApiCalculateDiscountedPricesResult>;
  };
};

/**
 * Arguments for the calculateDiscountedPrices function.
 */
export type DOPPPublicApiCalculateDiscountedPricesArgs = {
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
 * The result of the calculateDiscountedPrices function.
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
   * @example $10.99, $10.99 CAD
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
declare class DOPPPublicApiError extends Error;
