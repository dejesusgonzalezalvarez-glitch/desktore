import { CartLinesUpdateEvent } from '@shopify/events';

/**
 * A custom element that adds the selected bundle offer to the cart.
 *
 * Offers are rendered server-side as radio inputs. Each radio carries the variant id to add.
 * On submit the component uses the Ajax Cart API `/cart/add.js`, then dispatches the standard
 * `CartLinesUpdateEvent` so the cart drawer, cart bubble and cart items stay in sync.
 *
 * @typedef {HTMLElement & {
 *   dataset: {
 *     addUrl: string,
 *     cartUrl: string,
 *   }
 * }} BundleOffersRoot
 */
class BundleOffersComponent extends HTMLElement {
  /** @type {HTMLButtonElement | null} */
  #button = null;

  /** @type {HTMLElement | null} */
  #buttonText = null;

  /** @type {HTMLElement | null} */
  #errorElement = null;

  /** @type {string} */
  #defaultButtonLabel = '';

  connectedCallback() {
    this.#button = this.querySelector('[data-bundle-offers-button]');
    this.#buttonText = this.querySelector('[data-bundle-offers-button-text]');
    this.#errorElement = this.querySelector('[data-bundle-offers-error]');
    this.#defaultButtonLabel = this.#buttonText?.textContent?.trim() ?? '';

    this.addEventListener('change', this.#handleChange);
    this.#button?.addEventListener('click', this.#handleAddToCart);

    this.#updateButtonForSelection();
  }

  disconnectedCallback() {
    this.removeEventListener('change', this.#handleChange);
    this.#button?.removeEventListener('click', this.#handleAddToCart);
  }

  /** @returns {HTMLInputElement | null} */
  get #selectedInput() {
    return /** @type {HTMLInputElement | null} */ (this.querySelector('input[type="radio"]:checked'));
  }

  /** @param {Event} event */
  #handleChange = () => {
    this.#hideError();
    this.#updateButtonForSelection();
  };

  #updateButtonForSelection() {
    const input = this.#selectedInput;
    if (!this.#button || !this.#buttonText) return;

    const formattedPrice = input?.dataset.formattedPrice ?? '';
    const available = input?.dataset.available !== 'false';

    if (!input) {
      this.#button.disabled = true;
      this.#buttonText.textContent = this.#defaultButtonLabel;
      return;
    }

    this.#button.disabled = !available;
    this.#buttonText.textContent = available
      ? `${this.#defaultButtonLabel} — ${formattedPrice}`
      : 'Sold out';
  }

  #setLoading(isLoading) {
    if (!this.#button || !this.#buttonText) return;
    if (isLoading) {
      this.#button.setAttribute('aria-busy', 'true');
      this.#buttonText.textContent = 'Adding…';
    } else {
      this.#button.removeAttribute('aria-busy');
      this.#updateButtonForSelection();
    }
  }

  #showError(message) {
    if (!this.#errorElement) return;
    this.#errorElement.hidden = false;
    this.#errorElement.textContent = message;
  }

  #hideError() {
    if (!this.#errorElement) return;
    this.#errorElement.hidden = true;
    this.#errorElement.textContent = '';
  }

  #getSectionIds() {
    return Array.from(document.querySelectorAll('cart-items-component[data-section-id]'))
      .map((element) => (element instanceof HTMLElement ? element.dataset.sectionId : null))
      .filter((id) => Boolean(id));
  }

  #handleAddToCart = async () => {
    const input = this.#selectedInput;
    if (!input || !this.#button || this.#button.disabled) return;

    const variantId = input.value;
    if (!variantId) {
      this.#showError('This option is not available right now.');
      return;
    }

    this.#hideError();
    this.#setLoading(true);

    const deferredEventPromise = CartLinesUpdateEvent.createPromise();

    this.dispatchEvent(
      new CartLinesUpdateEvent({
        action: 'add',
        context: 'product',
        lines: [{ merchandiseId: variantId, quantity: 1 }],
        promise: deferredEventPromise.promise,
      })
    );

    const sectionIds = this.#getSectionIds();

    try {
      const addResponse = await fetch(this.dataset.addUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          items: [{ id: Number(variantId), quantity: 1 }],
          sections: sectionIds.join(','),
          sections_url: window.location.pathname,
        }),
      });

      const addResult = await addResponse.json();

      if (!addResponse.ok || addResult.status) {
        const message =
          addResult.message || addResult.description || 'Something went wrong. Please try again.';
        this.#showError(message);

        deferredEventPromise.resolve({
          cart: { totalQuantity: addResult.item_count ?? 0 },
          detail: { didError: true, source: 'bundle-offers' },
        });
        return;
      }

      const cart = await this.#fetchCart(addResult);

      deferredEventPromise.resolve({
        cart: CartLinesUpdateEvent.createCartFromAjaxResponse(cart),
        detail: {
          items: cart.items ?? addResult.items,
          itemCount: cart.item_count ?? addResult.item_count,
          sections: addResult.sections,
          source: 'bundle-offers',
          didError: false,
        },
      });
    } catch (error) {
      console.error('[bundle-offers] Add to cart failed:', error);
      this.#showError('Network error. Please check your connection and try again.');

      deferredEventPromise.resolve({
        cart: { totalQuantity: 0 },
        detail: { didError: true, source: 'bundle-offers' },
      });
    } finally {
      this.#setLoading(false);
    }
  };

  /**
   * Fetches the full cart so the resolved event carries a complete cart object.
   * Falls back to the `/cart/add.js` payload when the fetch fails.
   *
   * @param {any} addResult
   */
  async #fetchCart(addResult) {
    try {
      const response = await fetch(this.dataset.cartUrl, {
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
      });
      if (!response.ok) throw new Error(`Failed to fetch cart: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn('[bundle-offers] Cart fetch failed, using add response:', error);
      return {
        items: addResult.items,
        item_count: addResult.item_count,
        total_price: addResult.total_price,
        currency: addResult.currency,
      };
    }
  }
}

if (!customElements.get('bundle-offers-component')) {
  customElements.define('bundle-offers-component', BundleOffersComponent);
}
